// app/api/header/route.ts
// ─── Header API ───────────────────────────────────────────────────────────────
// GET /api/header
//
// Schema changes from old → new:
//   • ticker_announcements  → announcements  (WHERE section = 'header')
//   • social_links          → social_links   (WHERE 'header' = ANY(sections))
//   • feature_flags         → same table, no change
//   • site_config           → same table, no change
//   • nav_items / view      → vw_header_nav  (was header_nav_view)

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const revalidate = 60; // ISR — rebuild at most once per minute

export async function GET() {
    try {
        const [navRows, announcementRows, socialRows, configRows, flagRows] =
            await Promise.all([

                // ── 1. Nav tree (top-level + children JSON array) ──────────────
                // View name changed: header_nav_view → vw_header_nav
                query(`
                    SELECT id, label, href, sort_order, is_active, open_in_new,
                           children
                    FROM   vw_header_nav
                    ORDER  BY sort_order
                `),

                // ── 2. Ticker announcements ────────────────────────────────────
                // Table renamed: ticker_announcements → announcements
                // Filter added:  WHERE section = 'header'
                query(`
                    SELECT id, emoji, text, link_url, sort_order
                    FROM   announcements
                    WHERE  is_active = TRUE
                      AND  section   = 'header'
                      AND  (starts_at IS NULL OR starts_at <= NOW())
                      AND  (ends_at   IS NULL OR ends_at   >  NOW())
                    ORDER  BY sort_order
                `),

                // ── 3. Social links for header ─────────────────────────────────
                // Same table; filter changed to use sections[] array
                query(`
                    SELECT id, platform, url, icon_name, sort_order
                    FROM   social_links
                    WHERE  is_active = TRUE
                      AND  'header'  = ANY(sections)
                    ORDER  BY sort_order
                `),

                // ── 4. Brand / contact config keys ────────────────────────────
                query(`
                    SELECT key, value
                    FROM   site_config
                    WHERE  is_public = TRUE
                      AND  category  IN ('brand', 'contact', 'general')
                `),

                // ── 5. Header feature flags ────────────────────────────────────
                query(`
                    SELECT key, is_enabled
                    FROM   feature_flags
                    WHERE  key LIKE 'header.%'
                `),
            ]);

        // Build key→value maps
        const config = Object.fromEntries(configRows.map((r) => [r.key, r.value]));
        const featureFlags = Object.fromEntries(
            flagRows.map((r) => [r.key as string, r.is_enabled])
        );

        return NextResponse.json({
            navItems:      navRows,
            announcements: announcementRows,
            socialLinks:   socialRows,
            config,
            featureFlags,
        });
    } catch (err) {
        console.error("[GET /api/header]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}