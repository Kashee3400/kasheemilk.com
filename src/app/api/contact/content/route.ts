import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { ContactData } from "@/types/db";

export async function GET(): Promise<NextResponse<{ data: ContactData } | { error: string }>> {
  try {
    const [
      heroResult,
      configResult,
      officesResult,
      hoursResult,
      socialResult,
      faqResult,
      flagsResult,
    ] = await Promise.all([

      // hero — page_heroes WHERE page = 'contact'
      pool.query(`
        SELECT headline, subheadline, banner_image_url
        FROM   page_heroes
        WHERE  page      = 'contact'
          AND  is_active = TRUE
        LIMIT  1
      `),

      // config — site_config WHERE category = 'contact'
      // Replaces the 15-column single-row contact_page_copy table
      pool.query(`
        SELECT key, value
        FROM   site_config
        WHERE  category  = 'contact'
          AND  is_public = TRUE
      `),

      // offices — unchanged table, unchanged query
      pool.query(`
        SELECT id, label,
               address_line1, address_line2,
               city, state, pincode, country,
               phone, email,
               map_embed_url, map_link_url,
               latitude, longitude,
               is_primary, sort_order, is_active
        FROM   contact_offices
        WHERE  is_active = TRUE
        ORDER  BY sort_order ASC
      `),

      // office hours — no is_active column in consolidated schema
      pool.query(`
        SELECT id, office_id, days_label, hours_label, is_closed, sort_order
        FROM   contact_office_hours
        ORDER  BY sort_order ASC
      `),

      // social links — unified table, filter by sections array
      // No label column in social_links (dropped vs contact_social_links)
      pool.query(`
        SELECT id, platform, url, sort_order
        FROM   social_links
        WHERE  is_active = TRUE
          AND  'contact' = ANY(sections)
        ORDER  BY sort_order ASC
      `),

      // faq items — unchanged
      pool.query(`
        SELECT id, question, answer, sort_order, is_active
        FROM   contact_faq_items
        WHERE  is_active = TRUE
        ORDER  BY sort_order ASC
      `),

      // feature flags — normalised rows, filter by key prefix
      // Replaces the single JSONB row in contact_feature_flags
      pool.query(`
        SELECT key, is_enabled
        FROM   feature_flags
        WHERE  key LIKE 'contact.%'
      `),
    ]);

    // ── Assemble ContactConfig from site_config key-value rows ─────────────
    const config = Object.fromEntries(
      configResult.rows.map((r: { key: string; value: string }) => [r.key, r.value])
    ) as Partial<ContactData["config"]>;

    // ── Assemble ContactFeatureFlags from feature_flags rows ───────────────
    const featureFlags = Object.fromEntries(
      flagsResult.rows.map((r: { key: string; is_enabled: boolean }) => [r.key, r.is_enabled])
    ) as Partial<ContactData["featureFlags"]>;

    const data: ContactData = {
      hero:         heroResult.rows[0] ?? null,
      offices:      officesResult.rows,
      officeHours:  hoursResult.rows,
      socialLinks:  socialResult.rows,
      faqItems:     faqResult.rows,
      config,
      featureFlags,
    };
    return NextResponse.json(
      { data },
      { headers: { "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[GET /api/contact/content]", message);
    return NextResponse.json({ error: "Failed to load contact data." }, { status: 500 });
  }
}