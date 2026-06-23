import { NextResponse } from "next/server";
import { gquery } from "@/lib/db";
import type { CmsPageRow } from "@/types/db";

export const revalidate = 60;

interface RouteParams {
  params: { slug: string };
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = params;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const rows = await gquery<CmsPageRow>(
      `SELECT * FROM cms_pages WHERE slug = $1 AND status = 'published' LIMIT 1`,
      [slug]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ page: rows[0] });
  } catch (err) {
    console.error("[GET /api/pages/[slug]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
