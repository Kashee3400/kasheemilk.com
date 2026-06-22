// ═══════════════════════════════════════════════════════════════════════════
// types/db.ts
// Kashee Milk — TypeScript interfaces aligned to consolidated schema v1.0
//
// STRUCTURE
// ──────────
// 00. Postgres primitive aliases
// 01. Enums              (mirror PG ENUM types 1-to-1)
// 02. DB Row types       (one interface per table, every column)
// 03. View row types     (derived from SQL views)
// 04. API payload types  (what each /api/* route returns)
// 05. Config key unions  (type-safe site_config key lookup)
// 06. Feature flag key   (type-safe feature_flags key lookup)
// 07. Form / mutation    (input types for POST routes)
// ═══════════════════════════════════════════════════════════════════════════


// ══════════════════════════════════════════════════════════════════════════
// 00. POSTGRES PRIMITIVE ALIASES
//     pg driver returns these JS types for PG column types.
//     Aliases make the mapping explicit and searchable.
// ══════════════════════════════════════════════════════════════════════════

/** PostgreSQL SERIAL / INT → number */
type PgInt = number;
/** PostgreSQL SMALLINT → number */
type PgSmallInt = number;
/** PostgreSQL NUMERIC / DECIMAL → number (pg converts automatically) */
type PgNumeric = number;
/** PostgreSQL TEXT / VARCHAR → string */
type PgText = string;
/** PostgreSQL BOOLEAN → boolean */
type PgBoolean = boolean;
/** PostgreSQL UUID → string (36-char hex with dashes) */
type PgUUID = string;
/** PostgreSQL DATE → string ISO "YYYY-MM-DD" (pg returns Date obj; serialised to string in JSON) */
type PgDate = string;
/** PostgreSQL TIMESTAMPTZ → string ISO 8601 (serialised in JSON) */
type PgTimestamp = string;
/** PostgreSQL TEXT[] → string[] */
type PgTextArray = string[];
/** PostgreSQL INET → string */
type PgInet = string;


// ══════════════════════════════════════════════════════════════════════════
// 01. ENUMS  (mirrors PostgreSQL ENUM types exactly)
// ══════════════════════════════════════════════════════════════════════════

export type EmploymentType =
    | "full_time"
    | "part_time"
    | "contract"
    | "internship";

export type ExperienceLevel =
    | "entry"
    | "mid"
    | "senior"
    | "lead"
    | "executive";

export type ApplicationStatus =
    | "submitted"
    | "under_review"
    | "shortlisted"
    | "interview_scheduled"
    | "offer_extended"
    | "hired"
    | "rejected"
    | "withdrawn";

export type WorkMode = "onsite" | "remote" | "hybrid";

export type ContactSubject =
    | "general"
    | "product_query"
    | "complaint"
    | "partnership"
    | "media"
    | "careers"
    | "other";

export type ContactStatus = "new" | "read" | "replied" | "archived";

export type GalleryCategory =
    | "events"
    | "milestones"
    | "team"
    | "products"
    | "community";

export type AspectRatio = "square" | "landscape" | "portrait";

export type SiteConfigValueType =
    | "string"
    | "url"
    | "boolean"
    | "number"
    | "json";

/** All valid site_config category values */
export type SiteConfigCategory =
    | "brand"
    | "contact"
    | "general"
    | "hero"
    | "about"
    | "stats"
    | "careers";

/** All valid page_stats section values */
export type PageStatSection = "home" | "footer" | "careers";

/** All valid announcements section values */
export type AnnouncementSection = "header" | "footer";

/** All valid page_heroes page values */
export type PageHeroPage = "careers" | "contact" | string; // extensible


// ══════════════════════════════════════════════════════════════════════════
// 02. DATABASE ROW TYPES
//     One interface per table. Column names match the schema exactly.
//     Nullable columns (no NOT NULL) → type | null
// ══════════════════════════════════════════════════════════════════════════

// ── 01a. site_config ──────────────────────────────────────────────────────
export interface SiteConfigRow {
    id: PgInt;
    key: PgText;
    value: PgText | null;       // TEXT, nullable
    value_type: SiteConfigValueType;
    label: PgText | null;
    category: SiteConfigCategory;
    is_public: PgBoolean;
    updated_at: PgTimestamp;
}

// ── 01b. feature_flags ────────────────────────────────────────────────────
export interface FeatureFlagRow {
    id: PgInt;
    key: PgText;
    is_enabled: PgBoolean;
    description: PgText | null;
    updated_at: PgTimestamp;
}

// ── 01c. social_links ─────────────────────────────────────────────────────
export interface SocialLinkRow {
    id: PgInt;
    platform: PgText;              // "Facebook" | "LinkedIn" | etc.
    url: PgText;
    icon_name: PgText | null;       // lucide icon name
    sections: PgTextArray;         // ["header","footer","contact"]
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    created_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 02a. announcements (was ticker_announcements) ──────────────────────────
export interface AnnouncementRow {
    id: PgInt;
    emoji: PgText | null;
    text: PgText;
    link_url: PgText | null;
    section: AnnouncementSection;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    starts_at: PgTimestamp | null;
    ends_at: PgTimestamp | null;
    created_at: PgTimestamp;
}

// ── 02b. nav_items ────────────────────────────────────────────────────────
export interface NavItemRow {
    id: PgInt;
    parent_id: PgInt | null;       // null for top-level items
    label: PgText;
    href: PgText;
    description: PgText | null;
    icon_name: PgText | null;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    open_in_new: PgBoolean;
    created_at: PgTimestamp;
}

// ── 03a. page_heroes ──────────────────────────────────────────────────────
export interface PageHeroRow {
    id: PgUUID;
    page: PageHeroPage;
    headline: PgText;
    label: string;
    subheadline: PgText;
    description: PgText | null;
    cta_label: PgText | null;
    cta_href: PgText | null;
    banner_image_url: PgText | null;
    is_active: PgBoolean;
    created_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 03b. page_stats ───────────────────────────────────────────────────────
export interface PageStatRow {
    id: PgInt;
    section: PageStatSection;
    stat_key: PgText;
    display_value: PgText;           // "45,000+" — always shown
    numeric_value: PgInt | null;     // for JS counter animation; null if not needed
    suffix: PgText;           // "+", "%", "cr", ""
    label: PgText;
    icon: PgText | null;    // emoji
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    updated_at: PgTimestamp;
}

// ── 04a. hero_slides ──────────────────────────────────────────────────────
export interface HeroSlideRow {
    id: PgInt;
    image_url: PgText;
    image_alt: PgText;
    eyebrow: PgText | null;
    title: PgText | null;
    title_accent: PgText | null;
    description: PgText | null;
    cta_label: PgText | null;
    cta_href: PgText | null;
    tag_label: PgText | null;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    starts_at: PgTimestamp | null;
    ends_at: PgTimestamp | null;
    created_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 04b. about_paragraphs ─────────────────────────────────────────────────
export interface AboutParagraphRow {
    id: PgInt;
    content: PgText;              // may contain <strong> tags
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    created_at: PgTimestamp;
}

// ── 04c. about_districts ──────────────────────────────────────────────────
export interface AboutDistrictRow {
    id: PgInt;
    name: PgText;
    href: PgText | null;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
}

// ── 04d. about_sdg_badges ─────────────────────────────────────────────────
export interface AboutSdgBadgeRow {
    id: PgInt;
    image_url: PgText;
    label: PgText;
    href: PgText | null;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
}

// ── 04e. about_news_items ─────────────────────────────────────────────────
export interface AboutNewsItemRow {
    id: PgInt;
    title: PgText;
    image_url: PgText;
    href: PgText;
    source: PgText | null;
    published_at: PgDate | null;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    created_at: PgTimestamp;
}

// ── 05a. footer_trust_badges ──────────────────────────────────────────────
export interface FooterTrustBadgeRow {
    id: PgInt;
    icon_name: PgText;              // lucide icon: "Leaf", "Heart", "Shield"
    text: PgText;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
}

// ── 05b. footer_services ──────────────────────────────────────────────────
export interface FooterServiceRow {
    id: PgInt;
    label: PgText;
    href: PgText;
    nav_item_id: PgInt | null;       // optional FK → nav_items.id
    sort_order: PgSmallInt;
    is_active: PgBoolean;
}

// ── 05c. footer_legal_links ───────────────────────────────────────────────
export interface FooterLegalLinkRow {
    id: PgInt;
    label: PgText;
    href: PgText;
    sort_order: PgSmallInt;
    open_in_new: PgBoolean;
    is_active: PgBoolean;
}

// ── 06. gallery_categories ────────────────────────────────────────────────
export interface GalleryCategoryRow {
    value: GalleryCategory;     // PK
    label: PgText;
    emoji: PgText;
    sort_order: PgSmallInt;
    created_at: PgTimestamp;
}

// ── 06. gallery_items ─────────────────────────────────────────────────────
export interface GalleryItemRow {
    id: PgUUID;
    image_url: PgText;
    thumbnail_url: PgText | null;
    alt_text: PgText;
    title: PgText | null;
    description: PgText | null;
    category: GalleryCategory;  // FK → gallery_categories.value
    tags: PgTextArray;
    aspect_ratio: AspectRatio;
    featured: PgBoolean;
    sort_order: PgInt;
    is_active: PgBoolean;
    shot_date: PgDate | null;
    created_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 07a. careers_values ───────────────────────────────────────────────────
export interface CareersValueRow {
    id: PgUUID;
    icon: PgText;             // emoji
    title: PgText;
    description: PgText;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    created_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 07b. careers_benefits ─────────────────────────────────────────────────
export interface CareersBenefitRow {
    id: PgUUID;
    icon: PgText;
    title: PgText;
    description: PgText;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    created_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 07c. careers_testimonials ─────────────────────────────────────────────
export interface CareersTestimonialRow {
    id: PgUUID;
    quote: PgText;
    author_name: PgText;
    author_role: PgText;
    author_avatar_url: PgText | null;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    created_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 07d. careers_hiring_process ───────────────────────────────────────────
export interface CareersHiringStepRow {
    id: PgUUID;
    step_number: PgSmallInt;
    title: PgText;
    description: PgText;
    is_active: PgBoolean;
    updated_at: PgTimestamp;
}

// ── 07e. departments ──────────────────────────────────────────────────────
export interface DepartmentRow {
    id: PgUUID;
    name: PgText;
    slug: PgText;
    description: PgText | null;
    head_count: PgInt;
    is_active: PgBoolean;
    created_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 07f. job_openings ─────────────────────────────────────────────────────
export interface JobOpeningRow {
    id: PgUUID;
    title: PgText;
    slug: PgText;
    department_id: PgUUID;    // FK → departments.id
    employment_type: EmploymentType;
    experience_level: ExperienceLevel;
    work_mode: WorkMode;
    location: PgText;
    salary_min: PgNumeric | null;
    salary_max: PgNumeric | null;
    salary_currency: PgText;    // default "INR"
    salary_visible: PgBoolean;
    summary: PgText;
    description: PgText;    // Markdown
    responsibilities: PgTextArray;
    requirements: PgTextArray;
    nice_to_have: PgTextArray;
    benefits_note: PgText | null;
    tags: PgTextArray;
    is_active: PgBoolean;
    is_featured: PgBoolean;
    application_deadline: PgDate | null;
    posted_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 07g. job_applications ─────────────────────────────────────────────────
export interface JobApplicationRow {
    id: PgUUID;
    job_id: PgUUID;  // FK → job_openings.id
    status: ApplicationStatus;
    // Personal
    first_name: PgText;
    last_name: PgText;
    email: PgText;
    phone: PgText;
    // Professional
    current_job_role: PgText | null;   // NOTE: renamed from current_role (PG reserved word)
    current_company: PgText | null;
    total_experience_years: PgNumeric;
    notice_period_days: PgInt | null;
    expected_salary: PgNumeric | null;
    salary_currency: PgText;
    // Documents
    resume_url: PgText | null;
    linkedin_url: PgText | null;
    portfolio_url: PgText | null;
    github_url: PgText | null;
    // Screening
    cover_letter: PgText | null;
    how_did_you_hear: PgText | null;
    willing_to_relocate: PgBoolean | null;
    available_from: PgDate | null;
    // Admin
    reviewer_notes: PgText | null;
    submitted_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 07h. application_status_history ──────────────────────────────────────
export interface ApplicationStatusHistoryRow {
    id: PgUUID;
    application_id: PgUUID;          // FK → job_applications.id
    from_status: ApplicationStatus | null;  // null on first transition
    to_status: ApplicationStatus;
    changed_by: PgText | null;   // admin email or "system"
    note: PgText | null;
    changed_at: PgTimestamp;
}

// ── 08a. contact_offices ──────────────────────────────────────────────────
export interface ContactOfficeRow {
    id: PgUUID;
    label: PgText;
    address_line1: PgText;
    address_line2: PgText | null;
    city: PgText;
    state: PgText;
    pincode: PgText;
    country: PgText;
    phone: PgText;
    email: PgText;
    map_embed_url: PgText | null;
    map_link_url: PgText | null;
    latitude: PgNumeric | null;
    longitude: PgNumeric | null;
    is_primary: PgBoolean;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    created_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 08b. contact_office_hours ─────────────────────────────────────────────
export interface ContactOfficeHoursRow {
    id: PgInt;
    office_id: PgUUID | null;   // null = global default (applies to all offices)
    days_label: PgText;          // "Monday – Friday"
    hours_label: PgText;          // "9:00 AM – 6:00 PM"
    is_closed: PgBoolean;
    sort_order: PgSmallInt;
}

// ── 08c. contact_submissions ──────────────────────────────────────────────
export interface ContactSubmissionRow {
    id: PgUUID;
    full_name: PgText;
    email: PgText;
    phone: PgText | null;
    subject: ContactSubject;
    message: PgText;
    office_id: PgUUID | null;  // FK → contact_offices.id
    newsletter_opt_in: PgBoolean;
    status: ContactStatus;
    ip_address: PgInet | null;
    user_agent: PgText | null;
    submitted_at: PgTimestamp;
    updated_at: PgTimestamp;
}

// ── 08d. contact_faq_items ────────────────────────────────────────────────
export interface ContactFaqItemRow {
    id: PgUUID;
    question: PgText;
    answer: PgText;
    sort_order: PgSmallInt;
    is_active: PgBoolean;
    created_at: PgTimestamp;
    updated_at: PgTimestamp;
}


// ══════════════════════════════════════════════════════════════════════════
// 03. VIEW ROW TYPES
//     Columns produced by SQL views; include all joined/computed fields.
// ══════════════════════════════════════════════════════════════════════════

// ── vw_header_nav ─────────────────────────────────────────────────────────
/** Child nav item as returned by the JSON array inside vw_header_nav */
export interface NavItemChild {
    id: PgInt;
    label: PgText;
    href: PgText;
    description: PgText | null;
    sort_order: PgSmallInt;
    open_in_new: PgBoolean;
}

/** Top-level row from vw_header_nav with children embedded as JSON */
export interface HeaderNavRow extends Omit<NavItemRow, "parent_id" | "description" | "icon_name" | "created_at"> {
    children: NavItemChild[];        // JSON-parsed from pg json_agg
}

// ── vw_active_jobs ────────────────────────────────────────────────────────
/** Job opening enriched with department name/slug */
export interface ActiveJobRow extends JobOpeningRow {
    department_name: PgText;
    department_slug: PgText;
}

// ── vw_application_pipeline ───────────────────────────────────────────────
export interface ApplicationPipelineRow {
    id: PgUUID;
    candidate_name: PgText;         // first_name || ' ' || last_name
    email: PgText;
    phone: PgText;
    status: ApplicationStatus;
    submitted_at: PgTimestamp;
    job_title: PgText;
    department_name: PgText;
}

// ── vw_contact_new_submissions ────────────────────────────────────────────
export interface NewSubmissionRow {
    id: PgUUID;
    full_name: PgText;
    email: PgText;
    phone: PgText | null;
    subject: ContactSubject;
    message_preview: PgText;         // LEFT(message, 120) + ellipsis
    submitted_at: PgTimestamp;
}

// ── vw_gallery_active ─────────────────────────────────────────────────────
export interface GalleryActiveRow extends GalleryItemRow {
    category_label: PgText;
    category_emoji: PgText;
}

// ── vw_gallery_category_counts ────────────────────────────────────────────
export interface GalleryCategoryCountRow {
    value: GalleryCategory;
    label: PgText;
    emoji: PgText;
    sort_order: PgSmallInt;
    item_count: PgInt;               // pg returns bigint as string; parse with Number()
}


// ══════════════════════════════════════════════════════════════════════════
// 04. API PAYLOAD TYPES
//     What each /api/* route serialises to JSON.
//     These are the types your fetch helpers and components consume.
// ══════════════════════════════════════════════════════════════════════════

// ── /api/header ───────────────────────────────────────────────────────────
export interface HeaderData {
    navItems: HeaderNavRow[];
    announcements: Pick<AnnouncementRow, "id" | "emoji" | "text" | "link_url" | "sort_order">[];
    socialLinks: Pick<SocialLinkRow, "id" | "platform" | "url" | "icon_name" | "sort_order">[];
    config: Partial<HeaderConfig>;
    featureFlags: Partial<HeaderFeatureFlags>;
}

export interface HeaderConfig {
    site_name: string;
    site_tagline: string;
    logo_url: string;
    logo_alt: string;
    logo_name_part1: string;
    logo_name_part2: string;
    phone_number: string;
    phone_href: string;
    working_hours: string;
    cta_label: string;
}

export interface HeaderFeatureFlags {
    "header.topbar": boolean;
    "header.ticker": boolean;
    "header.social_icons": boolean;
    "header.search": boolean;
    "header.cta_button": boolean;
    "header.sticky": boolean;
    "header.scroll_blur": boolean;
    "header.mobile_drawer": boolean;
    "header.dropdown_desc": boolean;
    "header.top_accent_bar": boolean;
}

// ── /api/footer ───────────────────────────────────────────────────────────
export interface FooterData {
    stats: Pick<PageStatRow, "stat_key" | "display_value" | "label" | "sort_order">[];
    services: Pick<FooterServiceRow, "id" | "label" | "href" | "sort_order">[];
    trustBadges: Pick<FooterTrustBadgeRow, "id" | "icon_name" | "text" | "sort_order">[];
    legalLinks: Pick<FooterLegalLinkRow, "id" | "label" | "href" | "open_in_new" | "sort_order">[];
    socialLinks: Pick<SocialLinkRow, "id" | "platform" | "url" | "icon_name" | "sort_order">[];
    navItems: Pick<NavItemRow, "id" | "label" | "href" | "open_in_new">[];
    config: Partial<FooterConfig>;
    featureFlags: Partial<FooterFeatureFlags>;
}

export interface FooterConfig {
    site_name: string;
    footer_tagline: string;
    footer_logo_url: string;
    footer_logo_alt: string;
    copyright_name: string;
    designed_by_label: string;
    designed_by_url: string;
    contact_address: string;
    contact_phone: string;
    contact_email: string;
    office_hours_weekday: string;
    office_hours_weekend: string;
    newsletter_heading: string;
    newsletter_subtext: string;
    newsletter_placeholder: string;
    newsletter_btn_label: string;
}

export interface FooterFeatureFlags {
    "footer.cta_band": boolean;
    "footer.stats_strip": boolean;
    "footer.brand_column": boolean;
    "footer.quick_links": boolean;
    "footer.services_column": boolean;
    "footer.contact_column": boolean;
    "footer.trust_badges": boolean;
    "footer.social_icons": boolean;
    "footer.newsletter_form": boolean;
    "footer.office_hours": boolean;
    "footer.legal_links": boolean;
    "footer.designed_by": boolean;
    "footer.dark_mode_support": boolean;
}

// ── /api/hero ─────────────────────────────────────────────────────────────
export interface HeroData {
    slides: Pick<HeroSlideRow,
        "id" | "image_url" | "image_alt" | "eyebrow" | "title" |
        "title_accent" | "description" | "cta_label" | "cta_href" |
        "tag_label" | "sort_order">[];
    config: Partial<HeroConfig>;
    featureFlags: Partial<HeroFeatureFlags>;
}

export interface HeroConfig {
    hero_autoplay_ms: string;      // stored as string in site_config; cast with Number()
    hero_transition_ms: string;
    hero_explore_label: string;
    hero_explore_href: string;
    hero_height_clamp: string;
}

export interface HeroFeatureFlags {
    "hero.autoplay": boolean;
    "hero.progress_bar": boolean;
    "hero.dot_nav": boolean;
    "hero.slide_counter": boolean;
    "hero.thumbnail_nav": boolean;
    "hero.arrow_nav": boolean;
    "hero.tag_pill": boolean;
    "hero.explore_link": boolean;
    "hero.accent_line": boolean;
    "hero.hover_parallax": boolean;
    "hero.entrance_animation": boolean;
}

// ── /api/about ────────────────────────────────────────────────────────────
export interface AboutData {
    paragraphs: Pick<AboutParagraphRow, "id" | "content" | "sort_order">[];
    districts: Pick<AboutDistrictRow, "id" | "name" | "href" | "sort_order">[];
    sdgBadges: Pick<AboutSdgBadgeRow, "id" | "image_url" | "label" | "href" | "sort_order">[];
    newsItems: Pick<AboutNewsItemRow,
        "id" | "title" | "image_url" | "href" | "source" | "sort_order">[];
    config: AboutConfig;
    featureFlags: Partial<AboutFeatureFlags>;
}

export interface AboutConfig {
    about_section_label: string;
    about_section_title: string;
    about_subtitle: string;
    about_cta_label: string;
    about_cta_href: string;
    news_section_label: string;
    news_section_title: string;
    news_view_all_href: string;
    news_footer_href: string;
    news_footer_label: string;
    news_ticker_speed_s: number;     // parsed from string in route
}

export interface AboutFeatureFlags {
    "about.districts": boolean;
    "about.districts_scroll": boolean;
    "about.sdg_badges": boolean;
    "about.sdg_scroll": boolean;
    "about.news_ticker": boolean;
    "about.news_live_dot": boolean;
    "about.news_auto_scroll": boolean;
    "about.news_pause_hover": boolean;
    "about.cta_button": boolean;
}

// ── /api/stats ────────────────────────────────────────────────────────────
export interface StatsData {
    stats: Pick<PageStatRow,
        "stat_key" | "display_value" | "numeric_value" |
        "suffix" | "label" | "icon" | "sort_order">[];
    config: StatsConfig;
    featureFlags: Partial<StatsFeatureFlags>;
}

export interface StatsConfig {
    stats_eyebrow: string;
    stats_heading: string;
    stats_accent: string;
    stats_subtext: string;
    stats_counter_ms: number;
}

export interface StatsFeatureFlags {
    "stats.animated_counter": boolean;
    "stats.scroll_snap": boolean;
    "stats.show_icon": boolean;
    "stats.show_divider": boolean;
    "stats.offset_alt_cards": boolean;
}

// ── /api/gallery ──────────────────────────────────────────────────────────
export interface GalleryItem {
    id: PgUUID;
    image_url: PgText;
    thumbnail_url: PgText | null;
    alt_text: PgText;
    title: PgText | null;
    description: PgText | null;
    category: GalleryCategory;
    tags: PgTextArray;
    aspect_ratio: AspectRatio;
    featured: PgBoolean;
    sort_order: PgInt;
    /** Aliased from shot_date in the DB query to keep frontend types stable */
    date: PgDate | null;
    created_at: PgTimestamp;
    category_label: PgText;
    category_emoji: PgText;
}

export interface GalleryFilterCategory {
    value: GalleryCategory | "all";
    label: PgText;
    count: PgInt;
}

export interface GalleryMeta {
    totalCount: PgInt;
    categories: GalleryFilterCategory[];
}

export interface GalleryResponse {
    items: GalleryItem[];
    meta: GalleryMeta;
}

export interface GalleryQueryParams {
    category?: GalleryCategory | "all";
    page?: number;
    limit?: number;
    tag?: string;
    featured?: boolean;
}

// ── /api/careers ──────────────────────────────────────────────────────────
export interface CareersData {
    hero: Pick<PageHeroRow, "headline" | "subheadline" | "description" | "cta_label" | "cta_href" | "banner_image_url"> | null;
    values: Pick<CareersValueRow, "id" | "icon" | "title" | "description" | "sort_order">[];
    benefits: Pick<CareersBenefitRow, "id" | "icon" | "title" | "description" | "sort_order">[];
    stats: Pick<PageStatRow, "stat_key" | "display_value" | "label" | "sort_order">[];
    testimonials: Pick<CareersTestimonialRow,
        "id" | "quote" | "author_name" | "author_role" | "author_avatar_url" | "sort_order">[];
    hiringProcess: Pick<CareersHiringStepRow, "id" | "step_number" | "title" | "description">[];
    departments: Pick<DepartmentRow, "id" | "name" | "slug" | "head_count">[];
    jobs: ActiveJobRow[];
    config: Partial<CareersConfig>;
    featureFlags: Partial<CareersFeatureFlags>;
}

export interface CareersConfig {
    "careers.values_heading": string;
    "careers.values_subheading": string;
    "careers.benefits_heading": string;
    "careers.benefits_subheading": string;
    "careers.openings_heading": string;
    "careers.openings_subheading": string;
    "careers.testimonials_heading": string;
    "careers.process_heading": string;
    "careers.process_subheading": string;
}

export interface CareersFeatureFlags {
    [key: string]: boolean;          // no specific flags defined in schema yet
}

// ── /api/contact ──────────────────────────────────────────────────────────
export interface ContactData {
    hero: Pick<PageHeroRow, "headline" | "subheadline" | "banner_image_url"> | null;
    offices: ContactOfficeRow[];
    officeHours: ContactOfficeHoursRow[];
    socialLinks: Pick<SocialLinkRow, "id" | "platform" | "url" | "sort_order">[];
    faqItems: Pick<ContactFaqItemRow, "id" | "question" | "answer" | "sort_order">[];
    config: Partial<ContactConfig>;
    featureFlags: Partial<ContactFeatureFlags>;
}

export interface ContactConfig {
    "contact.page_label": string;
    "contact.info_panel_heading": string;
    "contact.info_panel_subheading": string;
    "contact.form_heading": string;
    "contact.form_subheading": string;
    "contact.form_success_heading": string;
    "contact.form_success_body": string;
    "contact.form_submit_label": string;
    "contact.hours_heading": string;
    "contact.faq_heading": string;
    "contact.faq_cta_label": string;
    "contact.faq_cta_href": string;
    "contact.whatsapp_number": string;
    "contact.whatsapp_label": string;
}

export interface ContactFeatureFlags {
    "contact.map": boolean;
    "contact.map_interactive": boolean;
    "contact.office_hours": boolean;
    "contact.social_links": boolean;
    "contact.faq_teaser": boolean;
    "contact.newsletter_signup": boolean;
    "contact.whatsapp_cta": boolean;
    "contact.hero_banner": boolean;
    "contact.multi_office": boolean;
}


// ══════════════════════════════════════════════════════════════════════════
// 05. SITE_CONFIG KEY UNIONS
//     Use these as the key parameter in config lookup helpers.
// ══════════════════════════════════════════════════════════════════════════

export type BrandConfigKey =
    | "site_name" | "site_tagline"
    | "logo_url" | "logo_alt" | "logo_name_part1" | "logo_name_part2"
    | "copyright_name" | "designed_by_label" | "designed_by_url"
    | "footer_logo_url" | "footer_logo_alt" | "footer_tagline";

export type ContactConfigKey =
    | "phone_number" | "phone_href" | "working_hours"
    | "contact_address" | "contact_phone" | "contact_email"
    | "office_hours_weekday" | "office_hours_weekend";

export type GeneralConfigKey =
    | "cta_label"
    | "newsletter_heading" | "newsletter_subtext"
    | "newsletter_placeholder" | "newsletter_btn_label";

export type HeroConfigKey =
    | "hero_autoplay_ms" | "hero_transition_ms"
    | "hero_explore_label" | "hero_explore_href" | "hero_height_clamp";

export type AboutConfigKey =
    | "about_section_label" | "about_section_title" | "about_subtitle"
    | "about_cta_label" | "about_cta_href"
    | "news_section_label" | "news_section_title"
    | "news_view_all_href" | "news_footer_href"
    | "news_footer_label" | "news_ticker_speed_s";

export type StatsConfigKey =
    | "stats_eyebrow" | "stats_heading" | "stats_accent"
    | "stats_subtext" | "stats_counter_ms";

export type CareersConfigKey =
    | "careers.values_heading" | "careers.values_subheading"
    | "careers.benefits_heading" | "careers.benefits_subheading"
    | "careers.openings_heading" | "careers.openings_subheading"
    | "careers.testimonials_heading"
    | "careers.process_heading" | "careers.process_subheading";

export type ContactPageConfigKey =
    | "contact.page_label"
    | "contact.info_panel_heading" | "contact.info_panel_subheading"
    | "contact.form_heading" | "contact.form_subheading"
    | "contact.form_success_heading" | "contact.form_success_body"
    | "contact.form_submit_label" | "contact.hours_heading"
    | "contact.faq_heading" | "contact.faq_cta_label"
    | "contact.faq_cta_href" | "contact.whatsapp_number"
    | "contact.whatsapp_label";

/** Union of every valid key in site_config */
export type SiteConfigKey =
    | BrandConfigKey
    | ContactConfigKey
    | GeneralConfigKey
    | HeroConfigKey
    | AboutConfigKey
    | StatsConfigKey
    | CareersConfigKey
    | ContactPageConfigKey;


// ══════════════════════════════════════════════════════════════════════════
// 06. FEATURE FLAG KEY UNION
//     Every key that exists in the feature_flags table.
// ══════════════════════════════════════════════════════════════════════════

export type FeatureFlagKey =
    // Header
    | "header.topbar" | "header.ticker" | "header.social_icons"
    | "header.search" | "header.cta_button" | "header.sticky"
    | "header.scroll_blur" | "header.mobile_drawer" | "header.dropdown_desc"
    | "header.top_accent_bar"
    // Footer
    | "footer.cta_band" | "footer.stats_strip" | "footer.brand_column"
    | "footer.quick_links" | "footer.services_column" | "footer.contact_column"
    | "footer.trust_badges" | "footer.social_icons" | "footer.newsletter_form"
    | "footer.office_hours" | "footer.legal_links" | "footer.designed_by"
    | "footer.dark_mode_support"
    // Hero
    | "hero.autoplay" | "hero.progress_bar" | "hero.dot_nav"
    | "hero.slide_counter" | "hero.thumbnail_nav" | "hero.arrow_nav"
    | "hero.tag_pill" | "hero.explore_link" | "hero.accent_line"
    | "hero.hover_parallax" | "hero.entrance_animation"
    // About
    | "about.districts" | "about.districts_scroll" | "about.sdg_badges"
    | "about.sdg_scroll" | "about.news_ticker" | "about.news_live_dot"
    | "about.news_auto_scroll" | "about.news_pause_hover" | "about.cta_button"
    // Stats
    | "stats.animated_counter" | "stats.scroll_snap" | "stats.show_icon"
    | "stats.show_divider" | "stats.offset_alt_cards"
    // Contact
    | "contact.map" | "contact.map_interactive" | "contact.office_hours"
    | "contact.social_links" | "contact.faq_teaser" | "contact.newsletter_signup"
    | "contact.whatsapp_cta" | "contact.hero_banner" | "contact.multi_office";

/** Type-safe helper to look up a feature flag */
export type FeatureFlagMap = Record<FeatureFlagKey, boolean>;


// ══════════════════════════════════════════════════════════════════════════
// 07. FORM / MUTATION INPUT TYPES
//     Used for POST body validation in API routes.
// ══════════════════════════════════════════════════════════════════════════

/** Body expected by POST /api/contact/submit */
export interface ContactSubmissionInput {
    full_name: string;
    email: string;
    phone?: string;
    subject: ContactSubject;
    message: string;
    office_id?: string;       // UUID string
    newsletter_opt_in?: boolean;
}

/** Body expected by POST /api/careers/apply */
export interface JobApplicationInput {
    job_id: string;    // UUID
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    current_job_role?: string;
    current_company?: string;
    total_experience_years?: number;
    notice_period_days?: number;
    expected_salary?: number;
    salary_currency?: string;
    resume_url?: string;
    linkedin_url?: string;
    portfolio_url?: string;
    github_url?: string;
    cover_letter?: string;
    how_did_you_hear?: string;
    willing_to_relocate?: boolean;
    available_from?: string;    // ISO date string "YYYY-MM-DD"
}

export interface ApplicationSubmitResponse {
    success: boolean;
    application_id: string;    // short ref e.g. "APP-A1B2C3D4"
    message: string;
}
/** Body expected by POST /api/newsletter */
export interface NewsletterSignupInput {
    email: string;
}