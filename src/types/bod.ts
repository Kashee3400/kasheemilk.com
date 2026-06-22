// ── types/bod.ts ──────────────────────────────────────────────

import { PageHeroRow } from "./db";

export interface BodMember {
  id: number;
  full_name: string;
  role_key: string;
  role_label: string;
  role_sort_order: number;   // ← from bod_roles.sort_order — drives section order
  designation: string;
  photo_url: string | null;
  bio: string | null;
  qualification: string | null;
  district: string | null;
  appointed_on: string | null;
  linkedin_url: string | null;
  sort_order: number;        // ← within-role card order
  is_chairman: boolean;
}



export interface BodConfig {
  bod_section_eyebrow: string;
  bod_section_title: string;
  bod_section_subtitle: string;
  bod_chairman_label: string;
  bod_appointed_prefix: string;
  bod_carousel_speed_ms: number;
  bod_cards_per_view: number;
}

export interface BodFeatureFlags {
  "bod.chairman_hero": boolean;
  "bod.auto_carousel": boolean;
  "bod.show_appointed_date": boolean;
  "bod.show_qualification": boolean;
  "bod.show_linkedin": boolean;
  "bod.show_district": boolean;
  "bod.bio_expandable": boolean;
  [key: string]: boolean;
}
export interface BodData {
  hero: Pick<PageHeroRow, "label" | "headline" | "subheadline" | "banner_image_url"> | null;
  chairman: BodMember | null;
  members: BodMember[];      // all non-chairman members, sorted by role_sort_order then sort_order
  config: BodConfig;
  featureFlags: BodFeatureFlags;
}