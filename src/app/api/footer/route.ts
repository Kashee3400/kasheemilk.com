// app/api/footer/route.ts
// ─── Footer API ───────────────────────────────────────────────────────────────
// GET /api/footer
//
// Schema changes from old → new:
//   • footer_stats   → page_stats  (WHERE section = 'footer')
//     column: value  → display_value
//   • social_links   → same table  (WHERE 'footer' = ANY(sections))
//   • footer_data_view → vw_footer_data  (view renamed)
//   • All other tables (footer_trust_badges, footer_services,
//     footer_legal_links) are unchanged.

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
    try {
        const [
            statsRows,
            serviceRows,
            trustBadgeRows,
            legalRows,
            socialRows,
            navRows,
            configRows,
            flagRows,
        ] = await Promise.all([

            // ── 1. Footer stats strip ──────────────────────────────────────────
            // Table changed: footer_stats → page_stats
            // Column changed: value (string) → display_value (string)
            query(`
                SELECT stat_key, display_value, label, sort_order
                FROM   page_stats
                WHERE  section   = 'footer'
                  AND  is_active = TRUE
                ORDER  BY sort_order
            `),

            // ── 2. Services column ────────────────────────────────────────────
            // Unchanged
            query(`
                SELECT id, label, href, sort_order
                FROM   footer_services
                WHERE  is_active = TRUE
                ORDER  BY sort_order
            `),

            // ── 3. Trust badges ───────────────────────────────────────────────
            // Unchanged
            query(`
                SELECT id, icon_name, text, sort_order
                FROM   footer_trust_badges
                WHERE  is_active = TRUE
                ORDER  BY sort_order
            `),

            // ── 4. Legal links ────────────────────────────────────────────────
            // Unchanged
            query(`
                SELECT id, label, href, open_in_new, sort_order
                FROM   footer_legal_links
                WHERE  is_active = TRUE
                ORDER  BY sort_order
            `),

            // ── 5. Social links for footer ────────────────────────────────────
            // Same table; filter uses sections[] array
            query(`
                SELECT id, platform, url, icon_name, sort_order
                FROM   social_links
                WHERE  is_active = TRUE
                  AND  'footer'  = ANY(sections)
                ORDER  BY sort_order
            `),

            // ── 6. Quick links (top-level nav for footer column) ──────────────
            // Unchanged
            query(`
                SELECT id, label, href, open_in_new
                FROM   nav_items
                WHERE  parent_id IS NULL
                  AND  is_active = TRUE
                ORDER  BY sort_order
            `),

            // ── 7. Config keys ────────────────────────────────────────────────
            query(`
                SELECT key, value
                FROM   site_config
                WHERE  is_public = TRUE
                  AND  category  IN ('brand', 'contact', 'general')
            `),

            // ── 8. Footer feature flags ───────────────────────────────────────
            query(`
                SELECT key, is_enabled
                FROM   feature_flags
                WHERE  key LIKE 'footer.%'
            `),
        ]);

        const config = Object.fromEntries(configRows.map((r) => [r.key, r.value]));
        const featureFlags = Object.fromEntries(
            flagRows.map((r) => [r.key as string, r.is_enabled])
        );

        return NextResponse.json({
            stats:       statsRows,
            services:    serviceRows,
            trustBadges: trustBadgeRows,
            legalLinks:  legalRows,
            socialLinks: socialRows,
            navItems:    navRows,
            config,
            featureFlags,
        });
    } catch (err) {
        console.error("[GET /api/footer]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}