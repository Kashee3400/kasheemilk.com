// ── app/api/revalidate/route.ts ──────────────────────────────
// POST /api/revalidate?secret=<REVALIDATE_SECRET>
// Call this from your admin panel after updating header data in the DB.

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("header");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}