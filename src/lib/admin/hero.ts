import pool from "@/lib/db";
import type { FeatureFlagRow, HeroSlideRow, SiteConfigRow } from "@/types/db";

export type AdminHeroData = {
  slides: HeroSlideRow[];
  config: Pick<SiteConfigRow, "key" | "value" | "value_type" | "label" | "category">[];
  flags: Pick<FeatureFlagRow, "key" | "is_enabled" | "description">[];
};

export async function getAdminHeroData(): Promise<AdminHeroData> {
  const [slides, config, flags] = await Promise.all([
    pool.query<HeroSlideRow>(`
      SELECT id, image_url, image_alt, eyebrow, title, title_accent, description,
             cta_label, cta_href, tag_label, sort_order, is_active,
             starts_at, ends_at, created_at, updated_at
      FROM hero_slides
      ORDER BY sort_order ASC, id ASC
    `),
    pool.query<Pick<SiteConfigRow, "key" | "value" | "value_type" | "label" | "category">>(`
      SELECT key, value, value_type, label, category
      FROM site_config
      WHERE category = 'hero'
      ORDER BY key ASC
    `),
    pool.query<Pick<FeatureFlagRow, "key" | "is_enabled" | "description">>(`
      SELECT key, is_enabled, description
      FROM feature_flags
      WHERE key LIKE 'hero.%'
      ORDER BY key ASC
    `),
  ]);

  return {
    slides: slides.rows,
    config: config.rows,
    flags: flags.rows,
  };
}
