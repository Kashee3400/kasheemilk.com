// app/api/careers/jobs/route.ts
// ─── GET /api/careers/jobs ────────────────────────────────────────────────────
// Lightweight jobs + departments endpoint.
// Used when the full /api/careers payload is already loaded and only the
// jobs slice needs to be refreshed (e.g. filter interactions client-side).
//
// Query params (all optional):
//   ?department=engineering   (slug)
//   ?type=full_time           (employment_type enum)
//   ?mode=remote              (work_mode enum)
//   ?featured=true
//
// Returns: JobsSliceResponse — the jobs[] and departments[] subsets of CareersData.
// All filtering is done in SQL — no in-memory post-processing.
//
// Tables: job_openings · departments (via vw_active_jobs for jobs)

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import type { CareersData, ActiveJobRow, DepartmentRow } from "@/types/db";

// Scoped return type — subset of CareersData, not the full payload
type JobsSliceResponse = {
  jobs:        CareersData["jobs"];
  departments: CareersData["departments"];
  total:       number;
};

// ── Route handler ──────────────────────────────────────────────────────────────
export async function GET(
  request: NextRequest
): Promise<NextResponse<JobsSliceResponse | { error: string }>> {
  const { searchParams } = request.nextUrl;
  const departmentSlug = searchParams.get("department");
  const type           = searchParams.get("type");
  const mode           = searchParams.get("mode");
  const featured       = searchParams.get("featured");

  // ── Build parameterised WHERE clauses ─────────────────────────────────────
  const conditions: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any[] = [];

  // vw_active_jobs already filters is_active = TRUE and deadline >= CURRENT_DATE
  if (departmentSlug && departmentSlug !== "all") {
    params.push(departmentSlug);
    conditions.push(`department_slug = $${params.length}`);
  }
  if (type) {
    params.push(type);
    conditions.push(`employment_type = $${params.length}`);
  }
  if (mode) {
    params.push(mode);
    conditions.push(`work_mode = $${params.length}`);
  }
  if (featured === "true") {
    conditions.push("is_featured = TRUE");
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const [jobsResult, deptsResult] = await Promise.all([

      // vw_active_jobs joins departments and aliases dept columns —
      // its columns map directly onto ActiveJobRow
      pool.query<ActiveJobRow>(
        `SELECT *
         FROM   vw_active_jobs
         ${where}
         ORDER  BY is_featured DESC, posted_at DESC`,
        params
      ),

      // departments — Pick<DepartmentRow, "id" | "name" | "slug" | "head_count">
      pool.query<Pick<DepartmentRow, "id" | "name" | "slug" | "head_count">>(
        `SELECT id, name, slug, head_count
         FROM   departments
         WHERE  is_active = TRUE
         ORDER  BY name ASC`
      ),
    ]);

    return NextResponse.json({
      jobs:        jobsResult.rows,
      departments: deptsResult.rows,
      total:       jobsResult.rows.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[GET /api/careers/jobs]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}