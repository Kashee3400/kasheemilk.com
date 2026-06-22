// app/api/about/route.ts
// ─── About Section API ────────────────────────────────────────────────────────
// GET /api/about
//
// Schema: All about_* tables are identical to the old schema.
// No breaking changes — this route is new (was missing before).

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const revalidate = 60;

export async function GET() {
    try {
        const [
            paragraphRows,
            districtRows,
            sdgRows,
            newsRows,
            configRows,
            flagRows,
        ] = await Promise.all([

            // ── 1. Body paragraphs ────────────────────────────────────────────
            query(`
                SELECT id, content, sort_order
                FROM   about_paragraphs
                WHERE  is_active = TRUE
                ORDER  BY sort_order
            `),

            // ── 2. District tags ──────────────────────────────────────────────
            query(`
                SELECT id, name, href, sort_order
                FROM   about_districts
                WHERE  is_active = TRUE
                ORDER  BY sort_order
            `),

            // ── 3. SDG badges ─────────────────────────────────────────────────
            query(`
                SELECT id, image_url, label, href, sort_order
                FROM   about_sdg_badges
                WHERE  is_active = TRUE
                ORDER  BY sort_order
            `),

            // ── 4. News ticker items ──────────────────────────────────────────
            query(`
                SELECT id, title, image_url, href, source, published_at, sort_order
                FROM   about_news_items
                WHERE  is_active = TRUE
                ORDER  BY sort_order
            `),

            // ── 5. About + news config keys ───────────────────────────────────
            query(`
                SELECT key, value
                FROM   site_config
                WHERE  category  = 'about'
                  AND  is_public = TRUE
            `),

            // ── 6. About feature flags ────────────────────────────────────────
            query(`
                SELECT key, is_enabled
                FROM   feature_flags
                WHERE  key LIKE 'about.%'
            `),
        ]);

        // Build typed config object matching AboutData['config'] shape
        const rawConfig = Object.fromEntries(configRows.map((r) => [r.key, r.value]));
        const config = {
            about_section_label:  rawConfig["about_section_label"]  ?? "",
            about_section_title:  rawConfig["about_section_title"]  ?? "",
            about_subtitle:       rawConfig["about_subtitle"]        ?? "",
            about_cta_label:      rawConfig["about_cta_label"]       ?? "",
            about_cta_href:       rawConfig["about_cta_href"]        ?? "/about-us",
            news_section_label:   rawConfig["news_section_label"]    ?? "",
            news_section_title:   rawConfig["news_section_title"]    ?? "",
            news_view_all_href:   rawConfig["news_view_all_href"]    ?? "#",
            news_footer_href:     rawConfig["news_footer_href"]      ?? "#",
            news_footer_label:    rawConfig["news_footer_label"]     ?? "",
            news_ticker_speed_s:  Number(rawConfig["news_ticker_speed_s"] ?? 30),
        };

        const featureFlags = Object.fromEntries(
            flagRows.map((r) => [r.key as string, r.is_enabled])
        );

        return NextResponse.json({
            paragraphs:  paragraphRows,
            districts:   districtRows,
            sdgBadges:   sdgRows,
            newsItems:   newsRows,
            config,
            featureFlags,
        });
    } catch (err) {
        console.error("[GET /api/about]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}