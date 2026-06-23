-- ═══════════════════════════════════════════════════════════════════════════
-- KASHEE MILK — CONSOLIDATED DATABASE SCHEMA  (v1.0 — DBA Clean Rewrite)
-- PostgreSQL 14+
-- ═══════════════════════════════════════════════════════════════════════════

-- 00. FOUNDATION
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION create_updated_at_trigger(trig TEXT, tbl TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = trig
  ) THEN
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at()', trig, tbl
    );
  END IF;
END;
$$;

-- Shared enum types
DO $$ BEGIN
  CREATE TYPE employment_type AS ENUM
    ('full_time','part_time','contract','internship');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE experience_level AS ENUM
    ('entry','mid','senior','lead','executive');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM (
    'submitted','under_review','shortlisted',
    'interview_scheduled','offer_extended','hired','rejected','withdrawn'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE work_mode AS ENUM ('onsite','remote','hybrid');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE contact_subject AS ENUM (
    'general','product_query','complaint',
    'partnership','media','careers','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE contact_status AS ENUM ('new','read','replied','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE gallery_category AS ENUM
    ('events','milestones','team','products','community');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE aspect_ratio AS ENUM ('square','landscape','portrait');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 01. GLOBAL CONFIGURATION

CREATE TABLE IF NOT EXISTS site_config (
  id          SERIAL       PRIMARY KEY,
  key         VARCHAR(120) UNIQUE NOT NULL,
  value       TEXT,
  value_type  VARCHAR(20)  NOT NULL DEFAULT 'string'
                           CHECK (value_type IN ('string','url','boolean','number','json')),
  label       VARCHAR(180),
  category    VARCHAR(60)  NOT NULL DEFAULT 'general',
  is_public   BOOLEAN      NOT NULL DEFAULT TRUE,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_site_config_upd', 'site_config');

INSERT INTO site_config (key, value, value_type, label, category) VALUES
  ('site_name',           'Kashee Milk',                                                                 'string', 'Site Name',               'brand'),
  ('site_tagline',        'Pure · Natural · Trusted',                                                    'string', 'Tagline',                 'brand'),
  ('logo_url',            'https://www.kasheemilk.com/wp-content/uploads/2023/05/Kashee-GIF-logo.gif',  'url',    'Logo URL',                'brand'),
  ('logo_alt',            'Kashee Milk Logo',                                                            'string', 'Logo Alt Text',           'brand'),
  ('logo_name_part1',     'Kashee',                                                                      'string', 'Logo Name Part 1',        'brand'),
  ('logo_name_part2',     'Milk',                                                                        'string', 'Logo Name Part 2 (accent)','brand'),
  ('copyright_name',      'Kashee Milk Producer Company Ltd.',                                           'string', 'Copyright Entity Name',   'brand'),
  ('designed_by_label',   'Gemini Digital Agency',                                                       'string', 'Designed By Label',       'brand'),
  ('designed_by_url',     'https://www.geminidigitalagency.com/',                                        'url',    'Designed By URL',         'brand'),
  ('footer_logo_url',     'https://www.kasheemilk.com/wp-content/uploads/2023/05/Kashee-GIF-logo.gif',  'url',    'Footer Logo URL',         'brand'),
  ('footer_logo_alt',     'Kashee Milk',                                                                 'string', 'Footer Logo Alt',         'brand'),
  ('footer_tagline',      'Empowering women milk producers in Eastern Uttar Pradesh through sustainable dairy farming since 2021.', 'string', 'Footer Tagline', 'brand'),
  ('phone_number',        '1800-XXX-XXXX',                                                               'string', 'Helpline Number',         'contact'),
  ('phone_href',          'tel:1800XXXXXXX',                                                             'string', 'Phone Link',              'contact'),
  ('working_hours',       'Mon–Sat, 9am–6pm',                                                            'string', 'Working Hours',           'contact'),
  ('contact_address',     'Village Katehar, Post Devkali, District Azamgarh, Uttar Pradesh — 276001',   'string', 'Office Address',          'contact'),
  ('contact_phone',       '+91-XXXXX-XXXXX',                                                             'string', 'Contact Phone',           'contact'),
  ('contact_email',       'info@kasheemilk.com',                                                         'string', 'Contact Email',           'contact'),
  ('office_hours_weekday','Mon–Sat: 9:00 AM – 6:00 PM',                                                 'string', 'Office Hours (Weekday)',  'contact'),
  ('office_hours_weekend','Sun: Closed',                                                                  'string', 'Office Hours (Weekend)',  'contact'),
  ('cta_label',           'Order Fresh Milk Today',                                                      'string', 'CTA Button Label',        'general'),
  ('newsletter_heading',  'Get Fresh Updates & Exclusive Offers',                                        'string', 'Newsletter Heading',      'general'),
  ('newsletter_subtext',  'Stay Connected',                                                              'string', 'Newsletter Sub-label',    'general'),
  ('newsletter_placeholder','Enter your email…',                                                         'string', 'Newsletter Placeholder',  'general'),
  ('newsletter_btn_label','Subscribe',                                                                   'string', 'Newsletter Button Label', 'general'),
  ('hero_autoplay_ms',    '5000',                                                                        'number', 'Slide autoplay interval (ms)',     'hero'),
  ('hero_transition_ms',  '800',                                                                         'number', 'Slide transition duration (ms)',   'hero'),
  ('hero_explore_label',  'Explore',                                                                     'string', 'Explore link label',               'hero'),
  ('hero_explore_href',   '/about-us',                                                                   'string', 'Explore link URL',                 'hero'),
  ('hero_height_clamp',   'clamp(340px, 46vw, 520px)',                                                   'string', 'Hero section height (CSS clamp)', 'hero'),
  ('about_section_label', 'Who We Are',                                                                  'string', 'About eyebrow label',    'about'),
  ('about_section_title', 'A Story of Empowerment & Purpose',                                            'string', 'About section heading',  'about'),
  ('about_subtitle',      'Kashee Milk Producer Company Limited, Varanasi, was incorporated in November 2021 with the goal of providing a sustainable livelihood to women milk producers through dairy farming.', 'string', 'About subtitle', 'about'),
  ('about_cta_label',     'Learn More',                                                                  'string', 'About CTA button label', 'about'),
  ('about_cta_href',      '/about-us',                                                                   'string', 'About CTA link',          'about'),
  ('news_section_label',  'Media',                                                                       'string', 'News eyebrow label',      'about'),
  ('news_section_title',  'News & Events',                                                               'string', 'News section heading',    'about'),
  ('news_view_all_href',  '/category/news-and-updates',                                                  'string', 'News "View all" link',    'about'),
  ('news_footer_href',    '/category/news-and-updates',                                                  'string', 'News footer link',        'about'),
  ('news_footer_label',   'All news & events',                                                           'string', 'News footer link label',  'about'),
  ('news_ticker_speed_s', '30',                                                                          'number', 'News ticker speed (s)',   'about'),
  ('stats_eyebrow',       'Our Impact',                                                                  'string', 'Stats eyebrow label',    'stats'),
  ('stats_heading',       'Progress in Numbers',                                                         'string', 'Stats heading',           'stats'),
  ('stats_accent',        'Numbers',                                                                     'string', 'Heading accent word',     'stats'),
  ('stats_subtext',       'Every figure represents a life touched, a family strengthened, and a future secured across Eastern UP.', 'string', 'Stats subtext', 'stats'),
  ('stats_counter_ms',    '2000',                                                                        'number', 'Counter animation (ms)',  'stats'),
  ('careers.values_heading',        'What We Stand For',                                                 'string', 'Careers: Values heading',        'careers'),
  ('careers.values_subheading',     'Our values are not posters on a wall — they are the decisions we make every day.', 'string', 'Careers: Values subheading', 'careers'),
  ('careers.benefits_heading',      'Life at Kashee Milk',                                               'string', 'Careers: Benefits heading',      'careers'),
  ('careers.benefits_subheading',   'We invest in our people the same way we invest in our product — with care and without compromise.', 'string', 'Careers: Benefits subheading', 'careers'),
  ('careers.openings_heading',      'Open Positions',                                                    'string', 'Careers: Openings heading',      'careers'),
  ('careers.openings_subheading',   'Find your place in our growing team. All roles are open to talented individuals regardless of background.', 'string', 'Careers: Openings subheading', 'careers'),
  ('careers.testimonials_heading',  'Voices from the Team',                                              'string', 'Careers: Testimonials heading',  'careers'),
  ('careers.process_heading',       'How We Hire',                                                       'string', 'Careers: Process heading',       'careers'),
  ('careers.process_subheading',    'A transparent, respectful process — because your time matters as much as ours.', 'string', 'Careers: Process subheading', 'careers'),
  ('contact.page_label',             'Get In Touch',                                                     'string', 'Contact: page label',             'contact'),
  ('contact.info_panel_heading',     'We Would Love to Hear From You',                                   'string', 'Contact: info panel heading',     'contact'),
  ('contact.info_panel_subheading',  'Reach us through any of the channels below, or fill in the form and we will get back to you within one business day.', 'string', 'Contact: info panel subheading', 'contact'),
  ('contact.form_heading',           'Send Us a Message',                                                'string', 'Contact: form heading',           'contact'),
  ('contact.form_subheading',        'Fill in the form below and our team will respond promptly.',       'string', 'Contact: form subheading',        'contact'),
  ('contact.form_success_heading',   'Message Received!',                                                'string', 'Contact: success heading',        'contact'),
  ('contact.form_success_body',      'Thank you for reaching out. A member of our team will respond to your message within one business day.', 'string', 'Contact: success body', 'contact'),
  ('contact.form_submit_label',      'Send Message',                                                     'string', 'Contact: submit button label',    'contact'),
  ('contact.hours_heading',          'Office Hours',                                                     'string', 'Contact: hours heading',          'contact'),
  ('contact.faq_heading',            'Frequently Asked Questions',                                       'string', 'Contact: FAQ heading',            'contact'),
  ('contact.faq_cta_label',          'Browse all FAQs',                                                  'string', 'Contact: FAQ CTA label',          'contact'),
  ('contact.faq_cta_href',           '/faq',                                                             'url',    'Contact: FAQ CTA href',           'contact'),
  ('contact.whatsapp_number',        '+919876543210',                                                    'string', 'Contact: WhatsApp number',        'contact'),
  ('contact.whatsapp_label',         'Chat on WhatsApp',                                                 'string', 'Contact: WhatsApp label',         'contact')
ON CONFLICT (key) DO NOTHING;

-- feature_flags
CREATE TABLE IF NOT EXISTS feature_flags (
  id          SERIAL       PRIMARY KEY,
  key         VARCHAR(120) UNIQUE NOT NULL,
  is_enabled  BOOLEAN      NOT NULL DEFAULT TRUE,
  description TEXT,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_feature_flags_upd', 'feature_flags');

INSERT INTO feature_flags (key, is_enabled, description) VALUES
  ('header.topbar',           TRUE,  'Show the dark green top bar with ticker + social icons'),
  ('header.ticker',           TRUE,  'Rotating ticker announcements in top bar'),
  ('header.social_icons',     TRUE,  'Social media icons in top bar'),
  ('header.search',           TRUE,  'Search button and expandable search bar'),
  ('header.cta_button',       TRUE,  'Call-to-action phone button'),
  ('header.sticky',           TRUE,  'Make header sticky on scroll'),
  ('header.scroll_blur',      TRUE,  'Frosted glass blur effect on scroll'),
  ('header.mobile_drawer',    TRUE,  'Mobile hamburger menu with slide-out drawer'),
  ('header.dropdown_desc',    TRUE,  'Show description text under dropdown items'),
  ('header.top_accent_bar',   TRUE,  'Colored gradient accent rule at top of header'),
  ('footer.cta_band',         TRUE,  'Show newsletter/CTA band at top of footer'),
  ('footer.stats_strip',      TRUE,  'Show stats strip (10K+ farmers, etc.)'),
  ('footer.brand_column',     TRUE,  'Show brand/logo column'),
  ('footer.quick_links',      TRUE,  'Show Quick Links column'),
  ('footer.services_column',  TRUE,  'Show Our Services column'),
  ('footer.contact_column',   TRUE,  'Show Contact Us column'),
  ('footer.trust_badges',     TRUE,  'Show trust badges under brand logo'),
  ('footer.social_icons',     TRUE,  'Show social icons in footer brand column'),
  ('footer.newsletter_form',  TRUE,  'Show email subscription form in CTA band'),
  ('footer.office_hours',     TRUE,  'Show office hours card in contact column'),
  ('footer.legal_links',      TRUE,  'Show legal links in bottom bar'),
  ('footer.designed_by',      TRUE,  'Show "Designed by" credit in bottom bar'),
  ('footer.dark_mode_support',TRUE,  'Enable dark mode classes on footer'),
  ('hero.autoplay',           TRUE,  'Auto-advance slides'),
  ('hero.progress_bar',       TRUE,  'Show progress bar at bottom'),
  ('hero.dot_nav',            TRUE,  'Show dot navigation at bottom'),
  ('hero.slide_counter',      TRUE,  'Show 01/05 counter'),
  ('hero.thumbnail_nav',      TRUE,  'Show thumbnail strip on right (hover)'),
  ('hero.arrow_nav',          TRUE,  'Show prev/next arrow buttons'),
  ('hero.tag_pill',           TRUE,  'Show tag pill on each slide'),
  ('hero.explore_link',       TRUE,  'Show "Explore" secondary link'),
  ('hero.accent_line',        TRUE,  'Show left vertical gold accent line'),
  ('hero.hover_parallax',     TRUE,  'Subtle image scale on hover'),
  ('hero.entrance_animation', TRUE,  'Fade-in animation on first load'),
  ('about.districts',         TRUE,  'Show district tags row'),
  ('about.districts_scroll',  TRUE,  'Enable horizontal scroll on districts'),
  ('about.sdg_badges',        TRUE,  'Show SDG badge row'),
  ('about.sdg_scroll',        TRUE,  'Enable horizontal scroll on SDG badges'),
  ('about.news_ticker',       TRUE,  'Show news ticker / marquee'),
  ('about.news_live_dot',     TRUE,  'Show animated live dot on news header'),
  ('about.news_auto_scroll',  TRUE,  'Auto-scroll news ticker'),
  ('about.news_pause_hover',  TRUE,  'Pause news ticker on hover'),
  ('about.cta_button',        TRUE,  'Show Learn More CTA button'),
  ('stats.animated_counter',  TRUE,  'Animate numbers on scroll into view'),
  ('stats.scroll_snap',       TRUE,  'Carousel/scroll-snap on mobile'),
  ('stats.show_icon',         TRUE,  'Show emoji icon on each stat card'),
  ('stats.show_divider',      TRUE,  'Show divider line between number and label'),
  ('stats.offset_alt_cards',  TRUE,  'Stagger alternate cards vertically'),
  ('contact.map',                TRUE,  'Show embedded Google Map'),
  ('contact.map_interactive',    TRUE,  'Interactive vs static map'),
  ('contact.office_hours',       TRUE,  'Show office hours panel'),
  ('contact.social_links',       TRUE,  'Show social links on contact page'),
  ('contact.faq_teaser',         TRUE,  'Show FAQ teaser section'),
  ('contact.newsletter_signup',  TRUE,  'Show newsletter opt-in on contact form'),
  ('contact.whatsapp_cta',       TRUE,  'Show WhatsApp CTA button'),
  ('contact.hero_banner',        TRUE,  'Show contact page hero banner'),
  ('contact.multi_office',      FALSE,  'Show multi-office tab switcher')
ON CONFLICT (key) DO NOTHING;

-- social_links
CREATE TABLE IF NOT EXISTS social_links (
  id         SERIAL       PRIMARY KEY,
  platform   VARCHAR(60)  NOT NULL UNIQUE,
  url        TEXT         NOT NULL,
  icon_name  VARCHAR(60),
  sections   TEXT[]       NOT NULL DEFAULT '{}',
  sort_order SMALLINT     NOT NULL DEFAULT 0,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_links_sections ON social_links USING GIN (sections);
SELECT create_updated_at_trigger('trg_social_links_upd', 'social_links');

INSERT INTO social_links (platform, url, icon_name, sections, sort_order) VALUES
  ('Facebook',  'https://www.facebook.com/people/Kashee-Milk-Producer-Company/100080985653961/', 'Facebook',  ARRAY['header','footer','contact'], 1),
  ('LinkedIn',  'https://www.linkedin.com/in/kashee-milk-933a4223b/',                            'Linkedin',  ARRAY['header','footer','contact'], 2),
  ('YouTube',   'https://www.youtube.com/channel/UCJkNzlRPmV-sWKG0mCSL9ew',                     'Youtube',   ARRAY['header','footer'],           3),
  ('Twitter',   'https://twitter.com/KasheeMilk',                                               'Twitter',   ARRAY['header','footer','contact'], 4),
  ('Instagram', 'https://instagram.com/kasheemilk',                                             'Instagram', ARRAY['contact'],                   5)
ON CONFLICT (platform) DO NOTHING;

-- 02. NAVIGATION & ANNOUNCEMENTS

CREATE TABLE IF NOT EXISTS nav_items (
  id          SERIAL       PRIMARY KEY,
  parent_id   INT          REFERENCES nav_items(id) ON DELETE CASCADE,
  label       VARCHAR(120) NOT NULL,
  href        VARCHAR(300) NOT NULL DEFAULT '#',
  description TEXT,
  icon_name   VARCHAR(60),
  sort_order  SMALLINT     NOT NULL DEFAULT 0,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  open_in_new BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nav_items_parent ON nav_items (parent_id, sort_order) WHERE is_active = TRUE;

INSERT INTO nav_items (label, href, sort_order) VALUES
  ('Home',                '/',                   10),
  ('About Us',            '/about-us',           20),
  ('Milk & Products',     '/milk-milk-products', 30),
  ('Veterinary Services', '#',                   40),
  ('Business Opportunity','#',                   50),
  ('Member Corner',       '#',                   60),
  ('Media',               '#',                   70),
  ('Join Us',             '/join-us',            80),
  ('Contact',             '/contact-us',         90)
ON CONFLICT DO NOTHING;

-- announcements
CREATE TABLE IF NOT EXISTS announcements (
  id         SERIAL       PRIMARY KEY,
  emoji      VARCHAR(10),
  text       TEXT         NOT NULL,
  link_url   TEXT,
  section    VARCHAR(40)  NOT NULL DEFAULT 'header',
  sort_order SMALLINT     NOT NULL DEFAULT 0,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  starts_at  TIMESTAMPTZ,
  ends_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements (section, sort_order) WHERE is_active = TRUE;

INSERT INTO announcements (emoji, text, section, sort_order) VALUES
  ('🥛', 'Fresh A2 Milk delivered to your doorstep daily',         'header', 1),
  ('🐄', 'Empowering 10,000+ women dairy farmers across UP',        'header', 2),
  ('🌿', '100% pure, natural & chemical-free products',             'header', 3),
  ('🏆', 'Best Dairy Brand — Eastern UP 2024',                      'header', 4),
  ('📞', 'Helpline: 1800-XXX-XXXX — Mon–Sat, 9am–6pm',             'header', 5)
ON CONFLICT DO NOTHING;

-- 03. SHARED CMS COMPONENTS

CREATE TABLE IF NOT EXISTS page_heroes (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  page             VARCHAR(40)  NOT NULL UNIQUE,
  headline         TEXT         NOT NULL,
  subheadline      TEXT         NOT NULL,
  description      TEXT,
  cta_label        VARCHAR(80),
  cta_href         VARCHAR(300),
  banner_image_url TEXT,
  is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_page_heroes_upd', 'page_heroes');

INSERT INTO page_heroes (page, headline, subheadline, description, cta_label, cta_href) VALUES
  ('careers', 'Shape the Future of Pure Dairy', 'Join a team that believes great milk starts with great people.', 'At Kashee Milk, we are on a mission to deliver the purest, most nourishing dairy to every home in India. Behind every bottle is a team of passionate individuals — farmers, technologists, marketers, and dreamers — who show up every day to do meaningful work. If that sounds like you, we want to hear from you.', 'Explore Open Roles', '#openings'),
  ('contact', 'Let''s Start a Conversation', 'Whether you have a question about our products, a partnership idea, or just want to say hello — we are here.', NULL, NULL, NULL)
ON CONFLICT (page) DO NOTHING;

-- page_stats
CREATE TABLE IF NOT EXISTS page_stats (
  id             SERIAL       PRIMARY KEY,
  section        VARCHAR(40)  NOT NULL,
  stat_key       VARCHAR(60)  NOT NULL,
  display_value  VARCHAR(30)  NOT NULL,
  numeric_value  INTEGER,
  suffix         VARCHAR(10)  NOT NULL DEFAULT '',
  label          VARCHAR(120) NOT NULL,
  icon           VARCHAR(10),
  sort_order     SMALLINT     NOT NULL DEFAULT 0,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (section, stat_key)
);

SELECT create_updated_at_trigger('trg_page_stats_upd', 'page_stats');

INSERT INTO page_stats (section, stat_key, display_value, numeric_value, suffix, label, icon, sort_order) VALUES
  ('home', 'members',   '45,000+', 45000,  '+', 'Total Enrolled Members', '👥', 10),
  ('home', 'villages',  '1,000+',  1000,   '+', 'Total Villages',         '🏘️', 20),
  ('home', 'milk',      '2,00,000+',200000,'+', 'Milk Qty (Litres/Day)',  '🥛', 30),
  ('home', 'districts', '7',       7,      '',  'Districts Covered',      '📍', 40)
ON CONFLICT (section, stat_key) DO NOTHING;

INSERT INTO page_stats (section, stat_key, display_value, suffix, label, sort_order) VALUES
  ('footer', 'farmers',   '10K+',  '',    'Farmers',   1),
  ('footer', 'years',     '5+',    '',    'Years',     2),
  ('footer', 'pure_milk', '100%',  '',    'Pure Milk', 3),
  ('footer', 'districts', '4',     '',    'Districts', 4)
ON CONFLICT (section, stat_key) DO NOTHING;

INSERT INTO page_stats (section, stat_key, display_value, suffix, label, sort_order) VALUES
  ('careers', 'team_members', '200+', '', 'Team Members',   1),
  ('careers', 'departments',  '12',   '', 'Departments',    2),
  ('careers', 'retention',    '94%',  '', 'Retention Rate', 3),
  ('careers', 'glassdoor',    '4.7★', '', 'Glassdoor Rating',4),
  ('careers', 'cities',       '18',   '', 'Cities Served',  5),
  ('careers', 'founded',      '2015', '', 'Founded',        6)
ON CONFLICT (section, stat_key) DO NOTHING;

-- 04. HOME PAGE SECTIONS

CREATE TABLE IF NOT EXISTS hero_slides (
  id            SERIAL       PRIMARY KEY,
  image_url     TEXT         NOT NULL,
  image_alt     VARCHAR(200) NOT NULL DEFAULT '',
  eyebrow       VARCHAR(120),
  title         VARCHAR(200),
  title_accent  VARCHAR(200),
  description   TEXT,
  cta_label     VARCHAR(80),
  cta_href      VARCHAR(300),
  tag_label     VARCHAR(80),
  sort_order    SMALLINT     NOT NULL DEFAULT 0,
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  starts_at     TIMESTAMPTZ,
  ends_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_hero_slides_upd', 'hero_slides');

INSERT INTO hero_slides (image_url, image_alt, eyebrow, title, title_accent, description, cta_label, cta_href, tag_label, sort_order) VALUES
  ('https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-dslide1.jpg', 'AGM 2025', 'Est. 2021 · Eastern UP',  'Empowering Women,',  'Nourishing Lives',    'A women-owned dairy cooperative transforming livelihoods across 7 districts.',                          'Our Story',     '/about-us',                   '45,000+ Members', 10),
  ('https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-dslide2.jpg', 'AGM 2025', 'Community & Growth',      'Rooted in Villages,','Reaching the Nation', '1,000+ villages. One mission — sustainable dairy for every woman farmer.',                            'Meet Members',  '/membership',                 '7 Districts',     20),
  ('https://www.kasheemilk.com/wp-content/uploads/2026/01/Kaashee-new-slider3.webp','Kashee Milk','Dairy Value Chain',  'From Farm to Table,','With Care',           'Pure milk and premium dairy products crafted with love by the women of Eastern UP.',                  'Our Products',  '/milk-milk-products',         'Since March 2022',30),
  ('https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-dslide4.jpg', 'AGM 2025', 'Veterinary Services',     'Healthier Animals,', 'Better Yields',       'Comprehensive veterinary care, breeding, and nutrition programs at your doorstep.',                   'Our Services',  '/animal-breeding-services',   'Mobile Vet Units',40),
  ('https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-dslide5.jpg', 'AGM 2025', 'Impact & Progress',       'Growing Together,',  'Every Single Day',    'A cooperative built on trust, transparency, and the power of collective ownership.',               'Annual Reports', '/annual-reports',             'UPSRLM · NDDB',  50)
ON CONFLICT DO NOTHING;

-- about_paragraphs
CREATE TABLE IF NOT EXISTS about_paragraphs (
  id         SERIAL       PRIMARY KEY,
  content    TEXT         NOT NULL,
  sort_order SMALLINT     NOT NULL DEFAULT 0,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO about_paragraphs (content, sort_order) VALUES
  ('Kashee Milk Producer Company Limited, Varanasi, was incorporated in November 2021 with the goal of providing a sustainable livelihood to women milk producers through dairy farming.', 10),
  ('Recognizing the organization''s commendable efforts, the State Rural Livelihood Mission (SRLM) approved the addition of two more districts — Bhadohi and Varanasi — starting in 2024. Currently, the company operates in <strong>seven districts</strong> of Eastern Uttar Pradesh.', 20),
  ('The company commenced business operations from <strong>March 2022</strong> under the project "Dairy Value Chain Development in Eastern Uttar Pradesh" with financial assistance from UPSRLM and technical support from NDDB Dairy Services.', 30)
ON CONFLICT DO NOTHING;

-- about_districts
CREATE TABLE IF NOT EXISTS about_districts (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  href       VARCHAR(300),
  sort_order SMALLINT     NOT NULL DEFAULT 0,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE
);

INSERT INTO about_districts (name, sort_order) VALUES
  ('Ballia', 10), ('Chandauli', 20), ('Ghazipur', 30), ('Mirzapur', 40),
  ('Sonbhadra', 50), ('Bhadohi', 60), ('Varanasi', 70)
ON CONFLICT DO NOTHING;

-- about_sdg_badges
CREATE TABLE IF NOT EXISTS about_sdg_badges (
  id         SERIAL       PRIMARY KEY,
  image_url  TEXT         NOT NULL,
  label      VARCHAR(100) NOT NULL,
  href       VARCHAR(300),
  sort_order SMALLINT     NOT NULL DEFAULT 0,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE
);

INSERT INTO about_sdg_badges (image_url, label, sort_order) VALUES
  ('https://www.kasheemilk.com/wp-content/uploads/2023/10/OIP.jpg',           'No Poverty',    10),
  ('https://www.kasheemilk.com/wp-content/uploads/2023/10/climate-action.jpg', 'Climate Action', 20),
  ('https://www.kasheemilk.com/wp-content/uploads/2023/10/goodhealth.jpg',     'Good Health',   30)
ON CONFLICT DO NOTHING;

-- about_news_items
CREATE TABLE IF NOT EXISTS about_news_items (
  id           SERIAL       PRIMARY KEY,
  title        TEXT         NOT NULL,
  image_url    TEXT         NOT NULL,
  href         VARCHAR(300) NOT NULL DEFAULT '#',
  source       VARCHAR(100),
  published_at DATE,
  sort_order   SMALLINT     NOT NULL DEFAULT 0,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO about_news_items (title, image_url, href, source, sort_order) VALUES
  ('Kashee Milk Producer Organization to achieve turnover of Rs 200 cr by FY24', 'https://www.kasheemilk.com/wp-content/uploads/2023/11/The-Economic-Times.jpg', '/kashee-milk-producer-organization-to-achieve-turnover-of-rs-200-cr-by-fy24-the-economic-times', 'The Economic Times', 10),
  ('समृद्धि की अनूठी मिसाल पेश कर रहीं KMPO से जुड़ी महिलाएं', 'https://www.kasheemilk.com/wp-content/uploads/2023/11/punjab-kesari.jpg', '#', 'Punjab Kesari', 20),
  ('इन महिलाओं ने दूध बेचकर कमाए लाखों रुपये', 'https://www.kasheemilk.com/wp-content/uploads/2023/11/Agro-Haryana.jpg', '#', 'Agro Haryana', 30),
  ('समृद्धि की अनूठी मिसाल', 'https://www.kasheemilk.com/wp-content/uploads/2023/11/The-Print-Hindi.jpg', '#', 'The Print Hindi', 40),
  ('KMPO से जुड़ी 2000 महिलाएं डेढ़ साल के भीतर बनी लाखों की मालकिन', 'https://www.kasheemilk.com/wp-content/uploads/2023/11/ETV-Bharat.jpg', '#', 'ETV Bharat', 50)
ON CONFLICT DO NOTHING;

-- 05. FOOTER-SPECIFIC COMPONENTS

CREATE TABLE IF NOT EXISTS footer_trust_badges (
  id         SERIAL      PRIMARY KEY,
  icon_name  VARCHAR(60) NOT NULL,
  text       VARCHAR(120) NOT NULL,
  sort_order SMALLINT    NOT NULL DEFAULT 0,
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE
);

INSERT INTO footer_trust_badges (icon_name, text, sort_order) VALUES
  ('Leaf',   '100% Pure & Natural Products', 1),
  ('Heart',  'Women-Led Cooperative',        2),
  ('Shield', 'FSSAI Certified',              3)
ON CONFLICT DO NOTHING;

-- footer_services
CREATE TABLE IF NOT EXISTS footer_services (
  id         SERIAL       PRIMARY KEY,
  label      VARCHAR(120) NOT NULL,
  href       VARCHAR(300) NOT NULL DEFAULT '#',
  nav_item_id INT         REFERENCES nav_items(id) ON DELETE SET NULL,
  sort_order SMALLINT     NOT NULL DEFAULT 0,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE
);

INSERT INTO footer_services (label, href, sort_order) VALUES
  ('Pashu Sanjivani Seva',     '/kashee-pashu-sanjivani-seva-mobile-veterinary', 1),
  ('Animal Breeding',          '/animal-breeding-services',                      2),
  ('Cattle Feed & Nutrition',  '/animal-nutrition-products',                     3),
  ('Fodder Seed Distribution', '/fodder-seed-distribution',                      4),
  ('Health Initiatives',       '/animal-health-preventive-initiatives',          5),
  ('DMT Training',             '/trainings',                                     6)
ON CONFLICT DO NOTHING;

-- footer_legal_links
CREATE TABLE IF NOT EXISTS footer_legal_links (
  id          SERIAL       PRIMARY KEY,
  label       VARCHAR(80)  NOT NULL,
  href        VARCHAR(300) NOT NULL,
  sort_order  SMALLINT     NOT NULL DEFAULT 0,
  open_in_new BOOLEAN      NOT NULL DEFAULT FALSE,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE
);

INSERT INTO footer_legal_links (label, href, sort_order) VALUES
  ('Privacy Policy', '/privacy-policy', 1),
  ('Terms of Use',   '/terms',          2),
  ('Sitemap',        '/sitemap',        3)
ON CONFLICT DO NOTHING;

-- 06. GALLERY

CREATE TABLE IF NOT EXISTS gallery_categories (
  value       gallery_category PRIMARY KEY,
  label       VARCHAR(64)      NOT NULL,
  emoji       VARCHAR(8)       NOT NULL DEFAULT '📷',
  sort_order  SMALLINT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

INSERT INTO gallery_categories (value, label, emoji, sort_order) VALUES
  ('events',     'Events',     '🎉', 1),
  ('milestones', 'Milestones', '🏆', 2),
  ('team',       'Team',       '👥', 3),
  ('products',   'Products',   '🥛', 4),
  ('community',  'Community',  '🤝', 5)
ON CONFLICT (value) DO UPDATE SET label = EXCLUDED.label, emoji = EXCLUDED.emoji, sort_order = EXCLUDED.sort_order;

CREATE TABLE IF NOT EXISTS gallery_items (
  id            UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url     TEXT             NOT NULL,
  thumbnail_url TEXT,
  alt_text      VARCHAR(255)     NOT NULL,
  title         VARCHAR(255),
  description   TEXT,
  category      gallery_category NOT NULL REFERENCES gallery_categories(value),
  tags          TEXT[]           NOT NULL DEFAULT '{}',
  aspect_ratio  aspect_ratio     NOT NULL DEFAULT 'square',
  featured      BOOLEAN          NOT NULL DEFAULT FALSE,
  sort_order    INT              NOT NULL DEFAULT 0,
  is_active     BOOLEAN          NOT NULL DEFAULT TRUE,
  shot_date     DATE,
  created_at    TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items (category, is_active, sort_order, shot_date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_featured ON gallery_items (featured, is_active) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_gallery_items_tags ON gallery_items USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_gallery_items_created ON gallery_items (created_at DESC, is_active);

SELECT create_updated_at_trigger('trg_gallery_items_upd', 'gallery_items');

INSERT INTO gallery_items (id, image_url, alt_text, title, description, category, tags, aspect_ratio, featured, sort_order, shot_date) VALUES
  ('a1000000-0000-0000-0000-000000000001','https://www.kasheemilk.com/wp-content/uploads/2025/01/hg.jpg', 'Kashee Milk headquarters',  'Our Home', 'The heart of Kashee Milk operations.', 'milestones', ARRAY['headquarters','facility'], 'square', TRUE,  1, '2025-01-15'),
  ('a1000000-0000-0000-0000-000000000002','https://www.kasheemilk.com/wp-content/uploads/2024/09/hgallery4.jpg', 'Community event', 'Community Gathering','Bringing farmers and consumers together.', 'community', ARRAY['community','gathering'], 'square', FALSE, 1, '2024-09-20'),
  ('a1000000-0000-0000-0000-000000000003','https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery1.jpg', 'AGM 2025 opening session', 'AGM 2025 — Opening', 'Annual General Meeting 2025 opening ceremony.', 'events', ARRAY['agm','2025'], 'square', TRUE,  1, '2025-09-05'),
  ('a1000000-0000-0000-0000-000000000004','https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery3.jpg', 'AGM 2025 panel discussion', 'AGM 2025 — Panel', 'Key stakeholders sharing insights at the panel.', 'events', ARRAY['agm','2025','panel'], 'square', FALSE, 2, '2025-09-05'),
  ('a1000000-0000-0000-0000-000000000005','https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery4.jpg', 'AGM 2025 awards ceremony', 'AGM 2025 — Awards', 'Recognising excellence among our farmer network.', 'events', ARRAY['agm','2025','awards'], 'square', TRUE,  3, '2025-09-05'),
  ('a1000000-0000-0000-0000-000000000006','https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery2.jpg', 'AGM 2025 audience', 'AGM 2025 — Audience','Members from across Varanasi and beyond.', 'events', ARRAY['agm','2025'], 'square', FALSE, 4, '2025-09-06')
ON CONFLICT (id) DO NOTHING;

-- 07. CAREERS

CREATE TABLE IF NOT EXISTS careers_values (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  icon        VARCHAR(16)  NOT NULL,
  title       VARCHAR(100) NOT NULL,
  description TEXT         NOT NULL,
  sort_order  SMALLINT     NOT NULL DEFAULT 0,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_careers_values_upd', 'careers_values');

INSERT INTO careers_values (icon, title, description, sort_order) VALUES
  ('🌿','Rooted in Integrity',      'We source honestly, price fairly, and speak plainly — to our farmers, our customers, and each other.', 1),
  ('🚀','Growth Without Compromise','We move fast, but never at the cost of quality, safety, or the trust of the people who depend on us.', 2),
  ('🤝','People Over Process',      'Great outcomes come from great teams. We hire carefully, invest deeply, and keep bureaucracy out of the way of good work.', 3),
  ('🌍','Community First',          'Every decision we make considers the farmer, the consumer, and the planet. Profit follows purpose — not the other way around.', 4),
  ('💡','Curiosity as a Superpower','We ask why. We question assumptions. We celebrate the person who spots the better way — no matter their title.', 5),
  ('🏆','Ownership Mentality',      'We hire adults. You own your work from day one, make real decisions, and see the direct impact of your contribution.', 6)
ON CONFLICT DO NOTHING;

-- careers_benefits
CREATE TABLE IF NOT EXISTS careers_benefits (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  icon        VARCHAR(16)  NOT NULL,
  title       VARCHAR(100) NOT NULL,
  description TEXT         NOT NULL,
  sort_order  SMALLINT     NOT NULL DEFAULT 0,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_careers_benefits_upd', 'careers_benefits');

INSERT INTO careers_benefits (icon, title, description, sort_order) VALUES
  ('💰','Competitive Compensation',  'Market-leading salaries benchmarked annually, with performance bonuses and equity for senior roles.', 1),
  ('🏥','Comprehensive Health Cover','Full medical, dental, and vision cover for you and your immediate family from day one.', 2),
  ('📚','Learning Budget',           '₹50,000 annual budget per employee for courses, certifications, books, and conferences — no approval required.', 3),
  ('🏡','Flexible Work',             'Hybrid-first culture. Work from our Varanasi HQ, from home, or from a café — as long as the work gets done.', 4),
  ('🌴','Generous Leave',            '24 days paid leave + 12 national holidays + unlimited sick leave. We mean it — use it.', 5),
  ('🥛','Product Perks',             'Monthly Kashee Milk hamper delivered to your home. Because we should all drink what we sell.', 6),
  ('👶','Parental Support',          '26 weeks maternity and 4 weeks paternity leave, fully paid, with a phased return-to-work programme.', 7),
  ('🎯','Clear Career Paths',        'Bi-annual reviews, published promotion criteria, and an internal job board so you always know what is next.', 8)
ON CONFLICT DO NOTHING;

-- careers_testimonials
CREATE TABLE IF NOT EXISTS careers_testimonials (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  quote           TEXT         NOT NULL,
  author_name       VARCHAR(100) NOT NULL,
  author_role       VARCHAR(100) NOT NULL,
  author_avatar_url TEXT,
  sort_order        SMALLINT     NOT NULL DEFAULT 0,
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_careers_testimonials_upd', 'careers_testimonials');

INSERT INTO careers_testimonials (quote, author_name, author_role, sort_order) VALUES
  ('I joined as a junior analyst three years ago and now lead a team of eight. The growth here is real, not just a recruiting line.', 'Priya Sharma', 'Head of Supply Chain Analytics', 1),
  ('What surprised me most was how much my opinion mattered from week one. There is no waiting to earn your voice here.', 'Rahul Mehra', 'Senior Software Engineer', 2),
  ('I have worked at two Fortune 500 companies. The speed and ownership culture at Kashee is something I have never experienced before.', 'Ananya Iyer', 'Product Manager, Digital', 3),
  ('The learning budget changed my career. I spent mine on a data science certification and moved into a brand-new role six months later.', 'Deepak Verma', 'Data Scientist', 4)
ON CONFLICT DO NOTHING;

-- careers_hiring_process
CREATE TABLE IF NOT EXISTS careers_hiring_process (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number SMALLINT     NOT NULL UNIQUE,
  title       VARCHAR(100) NOT NULL,
  description TEXT         NOT NULL,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_hiring_process_upd', 'careers_hiring_process');

INSERT INTO careers_hiring_process (step_number, title, description) VALUES
  (1, 'Apply Online',         'Submit your application in under five minutes. No cover letter required — though we read every one you send.'),
  (2, 'Initial Screen',       'A 30-minute call with our talent team to understand your background and answer your questions about the role.'),
  (3, 'Technical Assessment', 'A practical, take-home task relevant to the role. We respect your time — no multi-day projects, no tricks.'),
  (4, 'Team Interview',       'Meet the people you will work with. This is a two-way conversation — come with questions.'),
  (5, 'Offer & Onboarding',   'A clear, competitive offer within 48 hours of your final interview. Structured 90-day onboarding from day one.')
ON CONFLICT (step_number) DO NOTHING;

-- departments
CREATE TABLE IF NOT EXISTS departments (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL UNIQUE,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  head_count  INT          NOT NULL DEFAULT 0,
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_departments_upd', 'departments');

INSERT INTO departments (name, slug, description, head_count) VALUES
  ('Engineering & Technology',  'engineering',    'Building the digital backbone of Kashee Milk.',  24),
  ('Supply Chain & Operations', 'operations',     'From farm to doorstep — end-to-end.',             38),
  ('Sales & Marketing',         'sales-marketing','Growing the Kashee brand across India.',           31),
  ('Product',                   'product',        'Defining what we build and why.',                  8),
  ('Finance & Accounting',      'finance',        'Stewards of our financial health.',               12),
  ('Human Resources',           'hr',             'Finding, growing, and keeping great people.',      9),
  ('Quality Assurance',         'quality',        'Guardians of the Kashee standard.',               14),
  ('Customer Experience',       'cx',             'Every customer interaction, perfected.',           18)
ON CONFLICT (slug) DO NOTHING;

-- job_openings
CREATE TABLE IF NOT EXISTS job_openings (
  id                   UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  title                VARCHAR(200)     NOT NULL,
  slug                 VARCHAR(200)     NOT NULL UNIQUE,
  department_id        UUID             NOT NULL REFERENCES departments(id),
  employment_type      employment_type  NOT NULL,
  experience_level     experience_level NOT NULL,
  work_mode            work_mode        NOT NULL DEFAULT 'onsite',
  location             VARCHAR(200)     NOT NULL,
  salary_min           NUMERIC(12,2),
  salary_max           NUMERIC(12,2),
  salary_currency      VARCHAR(8)       NOT NULL DEFAULT 'INR',
  salary_visible       BOOLEAN          NOT NULL DEFAULT FALSE,
  summary              TEXT             NOT NULL,
  description          TEXT             NOT NULL,
  responsibilities     TEXT[]           NOT NULL DEFAULT '{}',
  requirements         TEXT[]           NOT NULL DEFAULT '{}',
  nice_to_have         TEXT[]           NOT NULL DEFAULT '{}',
  benefits_note        TEXT,
  tags                 TEXT[]           NOT NULL DEFAULT '{}',
  is_active            BOOLEAN          NOT NULL DEFAULT TRUE,
  is_featured          BOOLEAN          NOT NULL DEFAULT FALSE,
  application_deadline DATE,
  posted_at            TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_salary_range CHECK (salary_max IS NULL OR salary_max >= salary_min)
);

CREATE INDEX IF NOT EXISTS idx_job_openings_dept ON job_openings (department_id, is_active, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_openings_feat ON job_openings (is_featured, is_active) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_job_openings_tags ON job_openings USING GIN (tags);

SELECT create_updated_at_trigger('trg_job_openings_upd', 'job_openings');

-- job_applications
CREATE TABLE IF NOT EXISTS job_applications (
  id                     UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id                 UUID               NOT NULL REFERENCES job_openings(id),
  status                 application_status NOT NULL DEFAULT 'submitted',
  first_name             VARCHAR(100) NOT NULL,
  last_name              VARCHAR(100) NOT NULL,
  email                  VARCHAR(255) NOT NULL,
  phone                  VARCHAR(30)  NOT NULL,
  current_job_role       VARCHAR(200),
  current_company        VARCHAR(200),
  total_experience_years NUMERIC(4,1) NOT NULL DEFAULT 0,
  notice_period_days     INT,
  expected_salary        NUMERIC(12,2),
  salary_currency        VARCHAR(8)   NOT NULL DEFAULT 'INR',
  resume_url             TEXT,
  linkedin_url           TEXT,
  portfolio_url          TEXT,
  github_url             TEXT,
  cover_letter           TEXT,
  how_did_you_hear       VARCHAR(200),
  willing_to_relocate    BOOLEAN,
  available_from         DATE,
  reviewer_notes         TEXT,
  submitted_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (job_id, email)
);

CREATE INDEX IF NOT EXISTS idx_applications_job_status ON job_applications (job_id, status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_email ON job_applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications (status, submitted_at DESC);

SELECT create_updated_at_trigger('trg_job_applications_upd', 'job_applications');

-- application_status_history
CREATE TABLE IF NOT EXISTS application_status_history (
  id             UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID               NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  from_status    application_status,
  to_status      application_status NOT NULL,
  changed_by     VARCHAR(200),
  note           TEXT,
  changed_at     TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_status_history_app ON application_status_history (application_id, changed_at DESC);

-- 08. CONTACT

CREATE TABLE IF NOT EXISTS contact_offices (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  label          VARCHAR(100) NOT NULL,
  address_line1  TEXT         NOT NULL,
  address_line2  TEXT,
  city           VARCHAR(100) NOT NULL,
  state          VARCHAR(100) NOT NULL,
  pincode        VARCHAR(20)  NOT NULL,
  country        VARCHAR(100) NOT NULL DEFAULT 'India',
  phone          VARCHAR(30)  NOT NULL,
  email          VARCHAR(255) NOT NULL,
  map_embed_url  TEXT,
  map_link_url   TEXT,
  latitude       NUMERIC(10,7),
  longitude      NUMERIC(10,7),
  is_primary     BOOLEAN      NOT NULL DEFAULT FALSE,
  sort_order     SMALLINT     NOT NULL DEFAULT 0,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_contact_offices_upd', 'contact_offices');

INSERT INTO contact_offices (label, address_line1, address_line2, city, state, pincode, phone, email, map_embed_url, map_link_url, latitude, longitude, is_primary, sort_order) VALUES
  ('Head Office', 'Kashee Milk Producer Company Limited', 'Varanasi Industrial Estate, Rohaniya', 'Varanasi', 'Uttar Pradesh', '221109', '+91 98765 43210', 'info@kasheemilk.com', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5!2d82.9739!3d25.3176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1', 'https://maps.google.com/?q=Varanasi+Industrial+Estate+Rohaniya+Varanasi+UP', 25.3176, 82.9739, TRUE, 1)
ON CONFLICT DO NOTHING;

-- contact_office_hours
CREATE TABLE IF NOT EXISTS contact_office_hours (
  id          SERIAL       PRIMARY KEY,
  office_id   UUID         REFERENCES contact_offices(id) ON DELETE CASCADE,
  days_label  VARCHAR(60)  NOT NULL,
  hours_label VARCHAR(60)  NOT NULL,
  is_closed   BOOLEAN      NOT NULL DEFAULT FALSE,
  sort_order  SMALLINT     NOT NULL DEFAULT 0
);

INSERT INTO contact_office_hours (days_label, hours_label, is_closed, sort_order) VALUES
  ('Monday – Friday', '9:00 AM – 6:00 PM', FALSE, 1),
  ('Saturday',        '9:00 AM – 2:00 PM', FALSE, 2),
  ('Sunday',          'Closed',             TRUE,  3)
ON CONFLICT DO NOTHING;

-- contact_submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         VARCHAR(200)    NOT NULL,
  email             VARCHAR(255)    NOT NULL,
  phone             VARCHAR(30),
  subject           contact_subject NOT NULL DEFAULT 'general',
  message           TEXT            NOT NULL,
  office_id         UUID            REFERENCES contact_offices(id) ON DELETE SET NULL,
  newsletter_opt_in BOOLEAN         NOT NULL DEFAULT FALSE,
  status            contact_status  NOT NULL DEFAULT 'new',
  ip_address        INET,
  user_agent        TEXT,
  submitted_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions (status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions (email, submitted_at DESC);

SELECT create_updated_at_trigger('trg_contact_submissions_upd', 'contact_submissions');

-- contact_faq_items
CREATE TABLE IF NOT EXISTS contact_faq_items (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  question   TEXT        NOT NULL,
  answer     TEXT        NOT NULL,
  sort_order SMALLINT    NOT NULL DEFAULT 0,
  is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT create_updated_at_trigger('trg_contact_faq_upd', 'contact_faq_items');

INSERT INTO contact_faq_items (question, answer, sort_order) VALUES
  ('How do I place a bulk order?', 'For bulk or institutional orders, please email orders@kasheemilk.com or call our sales team directly.', 1),
  ('Where is Kashee Milk available?', 'We currently deliver across 18 cities in Uttar Pradesh. Use the store locator on our website to find the nearest outlet.', 2),
  ('How can I become a Kashee Milk farmer?', 'We welcome dairy farmers who share our commitment to quality. Fill in the partnership form on this page and select "Partnership" as your subject.', 3),
  ('What is your return / refund policy?', 'If you are not satisfied with a product, contact us within 24 hours of delivery and we will arrange a replacement or full refund.', 4)
ON CONFLICT DO NOTHING;

-- 09. VIEWS

CREATE OR REPLACE VIEW vw_header_nav AS
SELECT
  p.id, p.label, p.href, p.sort_order, p.is_active, p.open_in_new,
  COALESCE(
    json_agg(
      json_build_object(
        'id', c.id, 'label', c.label, 'href', c.href,
        'description', c.description, 'sort_order', c.sort_order, 'open_in_new', c.open_in_new
      ) ORDER BY c.sort_order
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'
  ) AS children
FROM nav_items p
LEFT JOIN nav_items c ON c.parent_id = p.id AND c.is_active = TRUE
WHERE p.parent_id IS NULL AND p.is_active = TRUE
GROUP BY p.id
ORDER BY p.sort_order;

CREATE OR REPLACE VIEW vw_active_jobs AS
SELECT
  j.*,
  d.name AS department_name,
  d.slug AS department_slug
FROM job_openings j
JOIN departments d ON d.id = j.department_id
WHERE j.is_active = TRUE
  AND (j.application_deadline IS NULL OR j.application_deadline >= CURRENT_DATE)
ORDER BY j.is_featured DESC, j.posted_at DESC;

CREATE OR REPLACE VIEW vw_application_pipeline AS
SELECT
  a.id,
  a.first_name || ' ' || a.last_name AS candidate_name,
  a.email, a.phone, a.status, a.submitted_at,
  j.title  AS job_title,
  d.name   AS department_name
FROM job_applications a
JOIN job_openings j ON j.id = a.job_id
JOIN departments  d ON d.id = j.department_id
ORDER BY a.submitted_at DESC;

CREATE OR REPLACE VIEW vw_contact_new_submissions AS
SELECT
  id, full_name, email, phone, subject,
  LEFT(message, 120) || CASE WHEN LENGTH(message) > 120 THEN '…' ELSE '' END AS message_preview,
  submitted_at
FROM contact_submissions
WHERE status = 'new'
ORDER BY submitted_at DESC;

CREATE OR REPLACE VIEW vw_gallery_active AS
SELECT gi.*, gc.label AS category_label, gc.emoji AS category_emoji
FROM gallery_items gi
JOIN gallery_categories gc ON gc.value = gi.category
WHERE gi.is_active = TRUE
ORDER BY gi.featured DESC, gi.sort_order ASC, gi.shot_date DESC NULLS LAST;

CREATE OR REPLACE VIEW vw_gallery_category_counts AS
SELECT gc.value, gc.label, gc.emoji, gc.sort_order, COUNT(gi.id) AS item_count
FROM gallery_categories gc
LEFT JOIN gallery_items gi ON gi.category = gc.value AND gi.is_active = TRUE
GROUP BY gc.value, gc.label, gc.emoji, gc.sort_order
ORDER BY gc.sort_order;

CREATE OR REPLACE VIEW vw_footer_data AS
SELECT
  (SELECT json_object_agg(key, value) FROM site_config WHERE is_public = TRUE)             AS site_config,
  (SELECT json_agg(json_build_object('section',section,'stat_key',stat_key,
    'display_value',display_value,'numeric_value',numeric_value,'suffix',suffix,
    'label',label,'icon',icon,'sort_order',sort_order) ORDER BY sort_order)
   FROM page_stats WHERE section = 'footer' AND is_active = TRUE)                          AS footer_stats,
  (SELECT json_agg(json_build_object('id',id,'label',label,'href',href,
    'sort_order',sort_order) ORDER BY sort_order)
   FROM footer_services WHERE is_active = TRUE)                                             AS services,
  (SELECT json_agg(json_build_object('id',id,'icon_name',icon_name,'text',text,
    'sort_order',sort_order) ORDER BY sort_order)
   FROM footer_trust_badges WHERE is_active = TRUE)                                        AS trust_badges,
  (SELECT json_agg(json_build_object('id',id,'label',label,'href',href,
    'open_in_new',open_in_new,'sort_order',sort_order) ORDER BY sort_order)
   FROM footer_legal_links WHERE is_active = TRUE)                                         AS legal_links,
  (SELECT json_agg(json_build_object('id',id,'platform',platform,'url',url,
    'icon_name',icon_name,'sort_order',sort_order) ORDER BY sort_order)
   FROM social_links WHERE is_active = TRUE AND 'footer' = ANY(sections))                 AS social_links,
  (SELECT json_object_agg(key, is_enabled) FROM feature_flags)                            AS feature_flags,
  (SELECT json_agg(json_build_object('id',id,'label',label,'href',href,
    'open_in_new',open_in_new) ORDER BY sort_order)
   FROM nav_items WHERE parent_id IS NULL AND is_active = TRUE)                           AS nav_items;