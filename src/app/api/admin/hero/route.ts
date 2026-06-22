import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminUser } from "@/lib/admin/auth";
import { getAdminHeroData } from "@/lib/admin/hero";

const slideFields = new Set([
  "image_url",
  "image_alt",
  "eyebrow",
  "title",
  "title_accent",
  "description",
  "cta_label",
  "cta_href",
  "tag_label",
  "sort_order",
  "is_active",
  "starts_at",
  "ends_at",
]);

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  if (!getAdminUser()) return unauthorized();

  try {
    return NextResponse.json(await getAdminHeroData());
  } catch (error) {
    console.error("[GET /api/admin/hero]", error);
    return NextResponse.json({ error: "Failed to load hero CMS data." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!getAdminUser()) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const imageUrl = String(body.image_url || "").trim();
  const imageAlt = String(body.image_alt || "").trim();

  if (!imageUrl || !imageAlt) {
    return NextResponse.json({ error: "Image URL and image alt text are required." }, { status: 422 });
  }

  try {
    const res = await pool.query(
      `INSERT INTO hero_slides (
        image_url, image_alt, eyebrow, title, title_accent, description,
        cta_label, cta_href, tag_label, sort_order, is_active
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        COALESCE((SELECT MAX(sort_order) + 10 FROM hero_slides), 10),
        TRUE
      )
      RETURNING id`,
      [
        imageUrl,
        imageAlt,
        emptyToNull(body.eyebrow),
        emptyToNull(body.title),
        emptyToNull(body.title_accent),
        emptyToNull(body.description),
        emptyToNull(body.cta_label),
        emptyToNull(body.cta_href),
        emptyToNull(body.tag_label),
      ]
    );

    revalidateTag("hero");
    return NextResponse.json({ success: true, id: res.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/hero]", error);
    return NextResponse.json({ error: "Failed to create hero slide." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!getAdminUser()) return unauthorized();

  let body: {
    kind?: "slide" | "config" | "flag";
    id?: number;
    key?: string;
    value?: string | null;
    is_enabled?: boolean;
    updates?: Record<string, unknown>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    if (body.kind === "slide") {
      if (!body.id || !body.updates) {
        return NextResponse.json({ error: "Slide id and updates are required." }, { status: 422 });
      }

      const entries = Object.entries(body.updates).filter(([key]) => slideFields.has(key));
      if (!entries.length) {
        return NextResponse.json({ error: "No valid slide fields supplied." }, { status: 422 });
      }

      const setSql = entries.map(([key], index) => `${key} = $${index + 1}`).join(", ");
      const values = entries.map(([key, value]) => {
        if (key === "sort_order") return Number(value);
        if (key === "is_active") return Boolean(value);
        return value === "" ? null : value;
      });

      await pool.query(
        `UPDATE hero_slides
         SET ${setSql}, updated_at = NOW()
         WHERE id = $${entries.length + 1}`,
        [...values, body.id]
      );
    } else if (body.kind === "config") {
      if (!body.key) {
        return NextResponse.json({ error: "Config key is required." }, { status: 422 });
      }

      await pool.query(
        `UPDATE site_config
         SET value = $1, updated_at = NOW()
         WHERE key = $2 AND category = 'hero'`,
        [body.value ?? "", body.key]
      );
    } else if (body.kind === "flag") {
      if (!body.key || typeof body.is_enabled !== "boolean") {
        return NextResponse.json({ error: "Feature flag key and state are required." }, { status: 422 });
      }

      await pool.query(
        `UPDATE feature_flags
         SET is_enabled = $1, updated_at = NOW()
         WHERE key = $2 AND key LIKE 'hero.%'`,
        [body.is_enabled, body.key]
      );
    } else {
      return NextResponse.json({ error: "Unsupported update kind." }, { status: 422 });
    }

    revalidateTag("hero");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PATCH /api/admin/hero]", error);
    return NextResponse.json({ error: "Failed to update hero content." }, { status: 500 });
  }
}

function emptyToNull(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || null;
}
