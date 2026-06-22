// ── app/api/bod/route.ts ─────────────────────────────────────
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { BodData } from "@/types/bod";

export const revalidate = 60;

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const [heroRes, membersRes, cfgRes, flagsRes] = await Promise.all([
        client.query(`
          SELECT label, headline, subheadline, banner_image_url
          FROM   page_heroes
          WHERE  page = 'bod' AND is_active = TRUE
          LIMIT  1
        `),
        client.query(`
          SELECT
            m.id,
            m.full_name,
            r.role_key,
            r.role_label,
            r.sort_order          AS role_sort_order,
            m.designation,
            m.photo_url,
            m.bio,
            m.qualification,
            m.district,
            TO_CHAR(m.appointed_on, 'DD/MM/YYYY') AS appointed_on,
            m.linkedin_url,
            m.sort_order,
            m.is_chairman
          FROM   bod_members m
          LEFT JOIN bod_roles r ON r.id = m.role_id
          WHERE  m.is_active = TRUE
          ORDER BY
            m.is_chairman        DESC,   -- chairman always first (pulled out separately)
            r.sort_order         ASC,    -- then by role priority
            m.sort_order         ASC     -- then within-role order
        `),
        client.query(`
          SELECT key, value, value_type
          FROM   site_config
          WHERE  category = 'bod' AND is_public = TRUE
        `),
        client.query(`
          SELECT key, is_enabled FROM feature_flags WHERE key LIKE 'bod.%'
        `),
      ]);

      const config = cfgRes.rows.reduce((acc, { key, value, value_type }) => ({
        ...acc,
        [key]: value_type === "number" ? Number(value) : value,
      }), {} as Record<string, string | number>);

      const featureFlags = flagsRes.rows.reduce(
        (acc, { key, is_enabled }) => ({ ...acc, [key]: is_enabled }),
        {} as Record<string, boolean>
      );

      // Separate chairman from rest — API consumer decides rendering
      const chairman = membersRes.rows.find((m) => m.is_chairman) ?? null;
      const members = membersRes.rows.filter((m) => !m.is_chairman);

      const payload: BodData = {
        hero: heroRes.rows[0] ?? null,
        chairman,
        members,
        config: config as BodData["config"],
        featureFlags: featureFlags as BodData["featureFlags"],
      };

      return NextResponse.json(payload, {
        headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[/api/bod]", err);
    return NextResponse.json({ error: "Failed to load BOD data" }, { status: 500 });
  }
}