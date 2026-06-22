// app/api/stats/route.ts
// ─── Stats Section API ────────────────────────────────────────────────────────
// GET /api/stats
//
// Schema changes from old → new:
//   • Table:  stats_items         → page_stats (WHERE section = 'home')
//   • Column: value  (INT)        → numeric_value (INT)   — for JS counter target
//   • Column: (none)              → display_value (VARCHAR) — final display string
//
// Frontend impact:
//   OLD: stat.value  → number to count up to
//   NEW: stat.numeric_value → number to count up to
//        stat.display_value → string shown when animation ends (e.g. "45,000+")

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
    try {
        const [statRows, configRows, flagRows] = await Promise.all([

            // ── 1. Home page stats ────────────────────────────────────────────
            // Table changed:  stats_items → page_stats
            // Filter added:   WHERE section = 'home'
            // Columns changed: value → numeric_value, new display_value column
            query(`
                SELECT stat_key,
                       display_value,
                       numeric_value,
                       suffix,
                       label,
                       icon,
                       sort_order
                FROM   page_stats
                WHERE  section   = 'home'
                  AND  is_active = TRUE
                ORDER  BY sort_order
            `),

            // ── 2. Stats section config ───────────────────────────────────────
            query(`
                SELECT key, value
                FROM   site_config
                WHERE  category  = 'stats'
                  AND  is_public = TRUE
            `),

            // ── 3. Stats feature flags ────────────────────────────────────────
            query(`
                SELECT key, is_enabled
                FROM   feature_flags
                WHERE  key LIKE 'stats.%'
            `),
        ]);

        const rawConfig = Object.fromEntries(configRows.map((r) => [r.key, r.value]));
        const config = {
            stats_eyebrow:    rawConfig["stats_eyebrow"]    ?? "Our Impact",
            stats_heading:    rawConfig["stats_heading"]    ?? "Progress in Numbers",
            stats_accent:     rawConfig["stats_accent"]     ?? "Numbers",
            stats_subtext:    rawConfig["stats_subtext"]    ?? "",
            stats_counter_ms: Number(rawConfig["stats_counter_ms"] ?? 2000),
        };

        const featureFlags = Object.fromEntries(
            flagRows.map((r) => [r.key as string, r.is_enabled])
        );

        return NextResponse.json({ stats: statRows, config, featureFlags });
    } catch (err) {
        console.error("[GET /api/stats]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}