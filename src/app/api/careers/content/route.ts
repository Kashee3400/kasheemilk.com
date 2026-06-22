// app/api/careers/route.ts
// ─── GET /api/careers ─────────────────────────────────────────────────────────
// Returns the full CareersData payload in a single DB round-trip batch.
// Replaces the previous split between /api/careers/content and /api/careers/jobs.
//
// Query params (all optional — filter the jobs[] slice only):
//   ?department=engineering   (slug)
//   ?type=full_time           (employment_type enum)
//   ?mode=remote              (work_mode enum)
//   ?featured=true
//
// Tables:
//   page_heroes · site_config · careers_values · careers_benefits
//   page_stats  · careers_testimonials · careers_hiring_process
//   departments · job_openings (via vw_active_jobs)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import type { CareersData } from "@/types/db";

export async function GET(
  request: NextRequest
): Promise<NextResponse<{ data: CareersData } | { error: string }>> {
  const { searchParams } = request.nextUrl;
  const departmentSlug = searchParams.get("department");
  const type           = searchParams.get("type");
  const mode           = searchParams.get("mode");
  const featured       = searchParams.get("featured");

  // ── Build job filter conditions ──────────────────────────────────────────
  const jobConditions: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobParams: any[] = [];

  if (departmentSlug && departmentSlug !== "all") {
    jobParams.push(departmentSlug);
    jobConditions.push(`department_slug = $${jobParams.length}`);
  }
  if (type) {
    jobParams.push(type);
    jobConditions.push(`employment_type = $${jobParams.length}`);
  }
  if (mode) {
    jobParams.push(mode);
    jobConditions.push(`work_mode = $${jobParams.length}`);
  }
  if (featured === "true") {
    jobConditions.push("is_featured = TRUE");
  }

  const jobWhere = jobConditions.length
    ? `AND ${jobConditions.join(" AND ")}`
    : "";

  try {
    const [
      heroResult,
      configResult,
      valuesResult,
      benefitsResult,
      statsResult,
      testimonialsResult,
      hiringResult,
      deptsResult,
      jobsResult,
    ] = await Promise.all([

      // hero — page_heroes WHERE page = 'careers'
      pool.query(`
        SELECT headline, subheadline, description,
               cta_label, cta_href, banner_image_url
        FROM   page_heroes
        WHERE  page      = 'careers'
          AND  is_active = TRUE
        LIMIT  1
      `),

      // config — site_config WHERE category = 'careers'
      pool.query(`
        SELECT key, value
        FROM   site_config
        WHERE  category  = 'careers'
          AND  is_public = TRUE
      `),

      // values
      pool.query(`
        SELECT id, icon, title, description, sort_order
        FROM   careers_values
        WHERE  is_active = TRUE
        ORDER  BY sort_order ASC
      `),

      // benefits
      pool.query(`
        SELECT id, icon, title, description, sort_order
        FROM   careers_benefits
        WHERE  is_active = TRUE
        ORDER  BY sort_order ASC
      `),

      // stats — page_stats WHERE section = 'careers'
      pool.query(`
        SELECT stat_key, display_value, label, sort_order
        FROM   page_stats
        WHERE  section   = 'careers'
          AND  is_active = TRUE
        ORDER  BY sort_order ASC
      `),

      // testimonials
      pool.query(`
        SELECT id, quote, author_name, author_role,
               author_avatar_url, sort_order
        FROM   careers_testimonials
        WHERE  is_active = TRUE
        ORDER  BY sort_order ASC
      `),

      // hiring process steps
      pool.query(`
        SELECT id, step_number, title, description
        FROM   careers_hiring_process
        WHERE  is_active = TRUE
        ORDER  BY step_number ASC
      `),

      // departments
      pool.query(`
        SELECT id, name, slug, head_count
        FROM   departments
        WHERE  is_active = TRUE
        ORDER  BY name ASC
      `),

      // jobs — via vw_active_jobs (already filters is_active + deadline)
      pool.query(
        `SELECT *
         FROM   vw_active_jobs
         WHERE  TRUE ${jobWhere}
         ORDER  BY is_featured DESC, posted_at DESC`,
        jobParams
      ),
    ]);

    // ── Assemble CareersConfig from site_config key-value rows ─────────────
    const config = Object.fromEntries(
      configResult.rows.map((r: { key: string; value: string }) => [r.key, r.value])
    ) as Partial<CareersData["config"]>;

    const data: CareersData = {
      hero:         heroResult.rows[0] ?? null,
      config,
      featureFlags: {},                           // populated by a separate /api/flags call if needed
      values:       valuesResult.rows,
      benefits:     benefitsResult.rows,
      stats:        statsResult.rows,
      testimonials: testimonialsResult.rows,
      hiringProcess:hiringResult.rows,
      departments:  deptsResult.rows,
      jobs:         jobsResult.rows,
    };

    return NextResponse.json(
      { data },
      { headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[GET /api/careers]", message);
    return NextResponse.json({ error: "Failed to load careers data." }, { status: 500 });
  }
}