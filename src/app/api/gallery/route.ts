// app/api/gallery/route.ts
// ─── Gallery API ──────────────────────────────────────────────────────────────
// GET /api/gallery
// GET /api/gallery?category=events&page=1&limit=12&tag=agm&featured=true
//
// Schema changes from old → new:
//   • Was reading from static GALLERY_IMAGES constant — now queries the DB
//   • item.date (old static field) → item.shot_date (DB column)
//   • Category counts come from vw_gallery_category_counts view
//   • All filtering/sorting moved to SQL (was done in JS)

import { NextRequest, NextResponse } from "next/server";
import { gquery } from "@/lib/db";
import { GalleryCategory, GalleryItem, GalleryMeta, GalleryResponse } from "@/types/db";

export const revalidate = 60;

// ── Route handler ──────────────────────────────────────────────────────────────
export async function GET(request: NextRequest): Promise<NextResponse<GalleryResponse | { error: string }>> {
    const { searchParams } = request.nextUrl;

    const category = (searchParams.get("category") ?? "all") as GalleryCategory | "all";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(48, Math.max(1, parseInt(searchParams.get("limit") ?? "24", 10)));
    const tag = searchParams.get("tag") ?? null;
    const featParam = searchParams.get("featured");
    const featured = featParam === "true" ? true : featParam === "false" ? false : null;

    const offset = (page - 1) * limit;

    try {
        // ── Build parameterised WHERE clause ──────────────────────────────────
        // All filtering happens in SQL — no JS array manipulation
        const conditions: string[] = ["gi.is_active = TRUE"];
        const params: unknown[] = [];
        let p = 1;

        if (category !== "all") {
            conditions.push(`gi.category = $${p++}`);
            params.push(category);
        }
        if (tag) {
            conditions.push(`$${p++} = ANY(gi.tags)`);
            params.push(tag);
        }
        if (featured !== null) {
            conditions.push(`gi.featured = $${p++}`);
            params.push(featured);
        }

        const where = conditions.join(" AND ");

        // ── 1. Total count (for pagination) ───────────────────────────────────
        const countRows = await gquery<{ total: string }>(
            `SELECT COUNT(*) AS total
             FROM   gallery_items gi
             WHERE  ${where}`,
            params
        );
        const totalCount = parseInt(countRows[0]?.total ?? "0", 10);

        // ── 2. Paginated items ────────────────────────────────────────────────
        // Column change: item.date → shot_date
        // Sorting: featured DESC, then sort_order ASC, then newest shot_date first
        const itemRows = await gquery<GalleryItem>(
            `SELECT gi.id,
                    gi.image_url,
                    gi.thumbnail_url,
                    gi.alt_text,
                    gi.title,
                    gi.description,
                    gi.category,
                    gi.tags,
                    gi.aspect_ratio,
                    gi.featured,
                    gi.sort_order,
                    gi.shot_date   AS date,   -- aliased to 'date' to keep frontend types unchanged
                    gi.created_at,
                    gc.label       AS category_label,
                    gc.emoji       AS category_emoji
             FROM   gallery_items      gi
             JOIN   gallery_categories gc ON gc.value = gi.category
             WHERE  ${where}
             ORDER  BY gi.featured DESC,
                       gi.sort_order ASC,
                       gi.shot_date  DESC NULLS LAST
             LIMIT  $${p++} OFFSET $${p++}`,
            [...params, limit, offset]
        );

        // ── 3. Category counts (for filter pills) ─────────────────────────────
        // Comes from the vw_gallery_category_counts view — no manual counting in JS
        const categoryRows = await gquery<{
            value: string;
            label: string;
            emoji: string;
            item_count: string;
        }>(`
            SELECT value, label, emoji, item_count
            FROM   vw_gallery_category_counts
            ORDER  BY sort_order
        `);

        const totalAll = categoryRows.reduce(
            (sum, r) => sum + parseInt(r.item_count, 10), 0
        );

        const meta: GalleryMeta = {
            totalCount,
            categories: [
                { value: "all" as GalleryCategory, label: "All", count: totalAll },
                ...categoryRows.map((r) => ({
                    value: r.value as GalleryCategory,
                    label: r.label,
                    count: parseInt(r.item_count, 10),
                })),
            ],
        };

        return NextResponse.json({ items: itemRows, meta });

    } catch (err) {
        console.error("[GET /api/gallery]", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}