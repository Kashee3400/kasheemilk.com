// app/api/hero/route.ts
// ─── Hero Slider API ──────────────────────────────────────────────────────────
// GET /api/hero
//
// Schema: No structural changes to hero_slides or its config keys.
// Only change: trigger function was renamed internally (transparent to queries).

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
    try {
        const [slideRows, configRows, flagRows] = await Promise.all([

            // ── 1. Active slides ──────────────────────────────────────────────
            // Unchanged — hero_slides table is identical
            query(`
                SELECT id, image_url, image_alt, eyebrow, title, title_accent,
                       description, cta_label, cta_href, tag_label, sort_order
                FROM   hero_slides
                WHERE  is_active = TRUE
                  AND  (starts_at IS NULL OR starts_at <= NOW())
                  AND  (ends_at   IS NULL OR ends_at   >  NOW())
                ORDER  BY sort_order
            `),

            // ── 2. Hero config keys ───────────────────────────────────────────
            query(`
                SELECT key, value
                FROM   site_config
                WHERE  category  = 'hero'
                  AND  is_public = TRUE
            `),

            // ── 3. Hero feature flags ─────────────────────────────────────────
            query(`
                SELECT key, is_enabled
                FROM   feature_flags
                WHERE  key LIKE 'hero.%'
            `),
        ]);

        const config = Object.fromEntries(configRows.map((r) => [r.key, r.value]));
        const featureFlags = Object.fromEntries(
            flagRows.map((r) => [r.key as string, r.is_enabled])
        );

        return NextResponse.json({ slides: slideRows, config, featureFlags });
    } catch (err) {
        console.error("[GET /api/hero]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}