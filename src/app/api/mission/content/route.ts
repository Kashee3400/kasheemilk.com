import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(): Promise<NextResponse<{ data: Record<string, any> } | { error: string }>> {
    try {
        const [
            heroResult,
        ] = await Promise.all([

            pool.query(`
                SELECT headline,description, subheadline, banner_image_url
                FROM   page_heroes
                WHERE  page      = 'mission'
                AND  is_active = TRUE
                LIMIT  1
      `),
        ]);

        const data: Record<string, any> = {
            hero: heroResult.rows[0] ?? null,
        };
        return NextResponse.json(
            { data },
            { headers: { "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600" } }
        );
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[GET /api/mission/content]", message);
        return NextResponse.json({ error: "Failed to load contact data." }, { status: 500 });
    }
}