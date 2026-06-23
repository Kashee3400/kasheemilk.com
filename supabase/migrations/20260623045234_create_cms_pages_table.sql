-- ═══════════════════════════════════════════════════════════════════════════
-- CMS Pages Table Migration
-- Creates cms_pages table for dynamic page management with SEO and navigation.
-- ═══════════════════════════════════════════════════════════════════════════

-- Create enum for page status
CREATE TYPE cms_page_status AS ENUM ('draft', 'published');

-- Create cms_pages table
CREATE TABLE cms_pages (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    meta_title TEXT,
    meta_description TEXT,
    featured_image_url TEXT,
    short_description TEXT,
    page_content TEXT,
    status cms_page_status NOT NULL DEFAULT 'draft',
    show_in_navbar BOOLEAN NOT NULL DEFAULT false,
    navbar_parent_id INTEGER,
    navbar_sort_order SMALLINT NOT NULL DEFAULT 0,
    show_in_footer BOOLEAN NOT NULL DEFAULT false,
    footer_sort_order SMALLINT NOT NULL DEFAULT 0,
    seo_keywords TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_status ON cms_pages(status);
CREATE INDEX idx_cms_pages_navbar ON cms_pages(show_in_navbar, navbar_sort_order) WHERE show_in_navbar = true AND status = 'published';
CREATE INDEX idx_cms_pages_footer ON cms_pages(show_in_footer, footer_sort_order) WHERE show_in_footer = true AND status = 'published';
CREATE INDEX idx_cms_pages_navbar_parent ON cms_pages(navbar_parent_id) WHERE navbar_parent_id IS NOT NULL;

-- Create a trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cms_page_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cms_pages_updated_at
    BEFORE UPDATE ON cms_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_cms_page_updated_at();

-- Grant permissions for public access to read published pages
GRANT SELECT ON cms_pages TO anon;
GRANT SELECT ON cms_pages TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE cms_pages_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE cms_pages_id_seq TO authenticated;

-- Row Level Security
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;

-- Public can only read published pages (anon role)
CREATE POLICY "anon_read_published_cms_pages" ON cms_pages
    FOR SELECT
    TO anon
    USING (status = 'published');

-- Row Level Security policies
CREATE POLICY "select_cms_pages" ON cms_pages
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "insert_cms_pages" ON cms_pages
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "update_cms_pages" ON cms_pages
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "delete_cms_pages" ON cms_pages
    FOR DELETE
    TO authenticated
    USING (true);

-- Add comment
COMMENT ON TABLE cms_pages IS 'Dynamic CMS pages with SEO metadata and nav/footer integration';
COMMENT ON COLUMN cms_pages.navbar_parent_id IS 'If set, this page appears as a dropdown item under this nav_items id';
COMMENT ON COLUMN cms_pages.page_content IS 'Rich HTML content (sanitized on save)';