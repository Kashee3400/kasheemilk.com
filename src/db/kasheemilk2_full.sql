--
-- PostgreSQL database dump
--

\restrict DoEBhj5OmsVgzA5dfMDaAA3o5miJGRIjEr9fGzvSDyfr2e8QV8bv9EBdhRPQDAv

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.nav_items DROP CONSTRAINT IF EXISTS nav_items_parent_id_fkey;
ALTER TABLE IF EXISTS ONLY public.job_openings DROP CONSTRAINT IF EXISTS job_openings_department_id_fkey;
ALTER TABLE IF EXISTS ONLY public.job_applications DROP CONSTRAINT IF EXISTS job_applications_job_id_fkey;
ALTER TABLE IF EXISTS ONLY public.gallery_items DROP CONSTRAINT IF EXISTS gallery_items_category_fkey;
ALTER TABLE IF EXISTS ONLY public.footer_services DROP CONSTRAINT IF EXISTS footer_services_nav_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.contact_submissions DROP CONSTRAINT IF EXISTS contact_submissions_office_id_fkey;
ALTER TABLE IF EXISTS ONLY public.contact_office_hours DROP CONSTRAINT IF EXISTS contact_office_hours_office_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bod_members DROP CONSTRAINT IF EXISTS bod_members_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.application_status_history DROP CONSTRAINT IF EXISTS application_status_history_application_id_fkey;
DROP TRIGGER IF EXISTS trg_social_links_upd ON public.social_links;
DROP TRIGGER IF EXISTS trg_site_config_upd ON public.site_config;
DROP TRIGGER IF EXISTS trg_page_stats_upd ON public.page_stats;
DROP TRIGGER IF EXISTS trg_page_heroes_upd ON public.page_heroes;
DROP TRIGGER IF EXISTS trg_job_openings_upd ON public.job_openings;
DROP TRIGGER IF EXISTS trg_job_applications_upd ON public.job_applications;
DROP TRIGGER IF EXISTS trg_hiring_process_upd ON public.careers_hiring_process;
DROP TRIGGER IF EXISTS trg_hero_slides_upd ON public.hero_slides;
DROP TRIGGER IF EXISTS trg_gallery_items_upd ON public.gallery_items;
DROP TRIGGER IF EXISTS trg_feature_flags_upd ON public.feature_flags;
DROP TRIGGER IF EXISTS trg_departments_upd ON public.departments;
DROP TRIGGER IF EXISTS trg_contact_submissions_upd ON public.contact_submissions;
DROP TRIGGER IF EXISTS trg_contact_offices_upd ON public.contact_offices;
DROP TRIGGER IF EXISTS trg_contact_faq_upd ON public.contact_faq_items;
DROP TRIGGER IF EXISTS trg_careers_values_upd ON public.careers_values;
DROP TRIGGER IF EXISTS trg_careers_testimonials_upd ON public.careers_testimonials;
DROP TRIGGER IF EXISTS trg_careers_benefits_upd ON public.careers_benefits;
DROP TRIGGER IF EXISTS page_heroes_updated_at ON public.page_heroes;
DROP TRIGGER IF EXISTS bod_members_updated_at ON public.bod_members;
CREATE OR REPLACE VIEW public.vw_header_nav AS
SELECT
    NULL::integer AS id,
    NULL::character varying(120) AS label,
    NULL::character varying(300) AS href,
    NULL::smallint AS sort_order,
    NULL::boolean AS is_active,
    NULL::boolean AS open_in_new,
    NULL::json AS children;
DROP INDEX IF EXISTS public.idx_status_history_app;
DROP INDEX IF EXISTS public.idx_social_links_sections;
DROP INDEX IF EXISTS public.idx_nav_items_parent;
DROP INDEX IF EXISTS public.idx_job_openings_tags;
DROP INDEX IF EXISTS public.idx_job_openings_feat;
DROP INDEX IF EXISTS public.idx_job_openings_dept;
DROP INDEX IF EXISTS public.idx_gallery_items_tags;
DROP INDEX IF EXISTS public.idx_gallery_items_featured;
DROP INDEX IF EXISTS public.idx_gallery_items_created;
DROP INDEX IF EXISTS public.idx_gallery_items_category;
DROP INDEX IF EXISTS public.idx_contact_submissions_status;
DROP INDEX IF EXISTS public.idx_contact_submissions_email;
DROP INDEX IF EXISTS public.idx_applications_status;
DROP INDEX IF EXISTS public.idx_applications_job_status;
DROP INDEX IF EXISTS public.idx_applications_email;
DROP INDEX IF EXISTS public.idx_announcements_active;
ALTER TABLE IF EXISTS ONLY public.social_links DROP CONSTRAINT IF EXISTS social_links_platform_key;
ALTER TABLE IF EXISTS ONLY public.social_links DROP CONSTRAINT IF EXISTS social_links_pkey;
ALTER TABLE IF EXISTS ONLY public.site_config DROP CONSTRAINT IF EXISTS site_config_pkey;
ALTER TABLE IF EXISTS ONLY public.site_config DROP CONSTRAINT IF EXISTS site_config_key_key;
ALTER TABLE IF EXISTS ONLY public.page_stats DROP CONSTRAINT IF EXISTS page_stats_section_stat_key_key;
ALTER TABLE IF EXISTS ONLY public.page_stats DROP CONSTRAINT IF EXISTS page_stats_pkey;
ALTER TABLE IF EXISTS ONLY public.page_heroes DROP CONSTRAINT IF EXISTS page_heroes_pkey;
ALTER TABLE IF EXISTS ONLY public.page_heroes DROP CONSTRAINT IF EXISTS page_heroes_page_key;
ALTER TABLE IF EXISTS ONLY public.nav_items DROP CONSTRAINT IF EXISTS nav_items_pkey;
ALTER TABLE IF EXISTS ONLY public.job_openings DROP CONSTRAINT IF EXISTS job_openings_slug_key;
ALTER TABLE IF EXISTS ONLY public.job_openings DROP CONSTRAINT IF EXISTS job_openings_pkey;
ALTER TABLE IF EXISTS ONLY public.job_applications DROP CONSTRAINT IF EXISTS job_applications_pkey;
ALTER TABLE IF EXISTS ONLY public.job_applications DROP CONSTRAINT IF EXISTS job_applications_job_id_email_key;
ALTER TABLE IF EXISTS ONLY public.hero_slides DROP CONSTRAINT IF EXISTS hero_slides_pkey;
ALTER TABLE IF EXISTS ONLY public.gallery_items DROP CONSTRAINT IF EXISTS gallery_items_pkey;
ALTER TABLE IF EXISTS ONLY public.gallery_categories DROP CONSTRAINT IF EXISTS gallery_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.footer_trust_badges DROP CONSTRAINT IF EXISTS footer_trust_badges_pkey;
ALTER TABLE IF EXISTS ONLY public.footer_services DROP CONSTRAINT IF EXISTS footer_services_pkey;
ALTER TABLE IF EXISTS ONLY public.footer_legal_links DROP CONSTRAINT IF EXISTS footer_legal_links_pkey;
ALTER TABLE IF EXISTS ONLY public.feature_flags DROP CONSTRAINT IF EXISTS feature_flags_pkey;
ALTER TABLE IF EXISTS ONLY public.feature_flags DROP CONSTRAINT IF EXISTS feature_flags_key_key;
ALTER TABLE IF EXISTS ONLY public.departments DROP CONSTRAINT IF EXISTS departments_slug_key;
ALTER TABLE IF EXISTS ONLY public.departments DROP CONSTRAINT IF EXISTS departments_pkey;
ALTER TABLE IF EXISTS ONLY public.departments DROP CONSTRAINT IF EXISTS departments_name_key;
ALTER TABLE IF EXISTS ONLY public.contact_submissions DROP CONSTRAINT IF EXISTS contact_submissions_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_offices DROP CONSTRAINT IF EXISTS contact_offices_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_office_hours DROP CONSTRAINT IF EXISTS contact_office_hours_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_faq_items DROP CONSTRAINT IF EXISTS contact_faq_items_pkey;
ALTER TABLE IF EXISTS ONLY public.careers_values DROP CONSTRAINT IF EXISTS careers_values_pkey;
ALTER TABLE IF EXISTS ONLY public.careers_testimonials DROP CONSTRAINT IF EXISTS careers_testimonials_pkey;
ALTER TABLE IF EXISTS ONLY public.careers_hiring_process DROP CONSTRAINT IF EXISTS careers_hiring_process_step_number_key;
ALTER TABLE IF EXISTS ONLY public.careers_hiring_process DROP CONSTRAINT IF EXISTS careers_hiring_process_pkey;
ALTER TABLE IF EXISTS ONLY public.careers_benefits DROP CONSTRAINT IF EXISTS careers_benefits_pkey;
ALTER TABLE IF EXISTS ONLY public.bod_roles DROP CONSTRAINT IF EXISTS bod_roles_role_key_key;
ALTER TABLE IF EXISTS ONLY public.bod_roles DROP CONSTRAINT IF EXISTS bod_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.bod_members DROP CONSTRAINT IF EXISTS bod_members_pkey;
ALTER TABLE IF EXISTS ONLY public.application_status_history DROP CONSTRAINT IF EXISTS application_status_history_pkey;
ALTER TABLE IF EXISTS ONLY public.announcements DROP CONSTRAINT IF EXISTS announcements_pkey;
ALTER TABLE IF EXISTS ONLY public.about_sdg_badges DROP CONSTRAINT IF EXISTS about_sdg_badges_pkey;
ALTER TABLE IF EXISTS ONLY public.about_paragraphs DROP CONSTRAINT IF EXISTS about_paragraphs_pkey;
ALTER TABLE IF EXISTS ONLY public.about_news_items DROP CONSTRAINT IF EXISTS about_news_items_pkey;
ALTER TABLE IF EXISTS ONLY public.about_districts DROP CONSTRAINT IF EXISTS about_districts_pkey;
ALTER TABLE IF EXISTS public.social_links ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.site_config ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.page_stats ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.nav_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hero_slides ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.footer_trust_badges ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.footer_services ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.footer_legal_links ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.feature_flags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.contact_office_hours ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.bod_roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.bod_members ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.announcements ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_sdg_badges ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_paragraphs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_news_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_districts ALTER COLUMN id DROP DEFAULT;
DROP VIEW IF EXISTS public.vw_header_nav;
DROP VIEW IF EXISTS public.vw_gallery_category_counts;
DROP VIEW IF EXISTS public.vw_gallery_active;
DROP VIEW IF EXISTS public.vw_footer_data;
DROP VIEW IF EXISTS public.vw_contact_new_submissions;
DROP VIEW IF EXISTS public.vw_application_pipeline;
DROP VIEW IF EXISTS public.vw_active_jobs;
DROP SEQUENCE IF EXISTS public.social_links_id_seq;
DROP TABLE IF EXISTS public.social_links;
DROP SEQUENCE IF EXISTS public.site_config_id_seq;
DROP TABLE IF EXISTS public.site_config;
DROP SEQUENCE IF EXISTS public.page_stats_id_seq;
DROP TABLE IF EXISTS public.page_stats;
DROP TABLE IF EXISTS public.page_heroes;
DROP SEQUENCE IF EXISTS public.nav_items_id_seq;
DROP TABLE IF EXISTS public.nav_items;
DROP TABLE IF EXISTS public.job_openings;
DROP TABLE IF EXISTS public.job_applications;
DROP SEQUENCE IF EXISTS public.hero_slides_id_seq;
DROP TABLE IF EXISTS public.hero_slides;
DROP TABLE IF EXISTS public.gallery_items;
DROP TABLE IF EXISTS public.gallery_categories;
DROP SEQUENCE IF EXISTS public.footer_trust_badges_id_seq;
DROP TABLE IF EXISTS public.footer_trust_badges;
DROP SEQUENCE IF EXISTS public.footer_services_id_seq;
DROP TABLE IF EXISTS public.footer_services;
DROP SEQUENCE IF EXISTS public.footer_legal_links_id_seq;
DROP TABLE IF EXISTS public.footer_legal_links;
DROP SEQUENCE IF EXISTS public.feature_flags_id_seq;
DROP TABLE IF EXISTS public.feature_flags;
DROP TABLE IF EXISTS public.departments;
DROP TABLE IF EXISTS public.contact_submissions;
DROP TABLE IF EXISTS public.contact_offices;
DROP SEQUENCE IF EXISTS public.contact_office_hours_id_seq;
DROP TABLE IF EXISTS public.contact_office_hours;
DROP TABLE IF EXISTS public.contact_faq_items;
DROP TABLE IF EXISTS public.careers_values;
DROP TABLE IF EXISTS public.careers_testimonials;
DROP TABLE IF EXISTS public.careers_hiring_process;
DROP TABLE IF EXISTS public.careers_benefits;
DROP SEQUENCE IF EXISTS public.bod_roles_id_seq;
DROP TABLE IF EXISTS public.bod_roles;
DROP SEQUENCE IF EXISTS public.bod_members_id_seq;
DROP TABLE IF EXISTS public.bod_members;
DROP TABLE IF EXISTS public.application_status_history;
DROP SEQUENCE IF EXISTS public.announcements_id_seq;
DROP TABLE IF EXISTS public.announcements;
DROP SEQUENCE IF EXISTS public.about_sdg_badges_id_seq;
DROP TABLE IF EXISTS public.about_sdg_badges;
DROP SEQUENCE IF EXISTS public.about_paragraphs_id_seq;
DROP TABLE IF EXISTS public.about_paragraphs;
DROP SEQUENCE IF EXISTS public.about_news_items_id_seq;
DROP TABLE IF EXISTS public.about_news_items;
DROP SEQUENCE IF EXISTS public.about_districts_id_seq;
DROP TABLE IF EXISTS public.about_districts;
DROP FUNCTION IF EXISTS public.update_updated_at();
DROP FUNCTION IF EXISTS public.set_updated_at();
DROP FUNCTION IF EXISTS public.create_updated_at_trigger(trig text, tbl text);
DROP TYPE IF EXISTS public.work_mode;
DROP TYPE IF EXISTS public.gallery_category;
DROP TYPE IF EXISTS public.experience_level;
DROP TYPE IF EXISTS public.employment_type;
DROP TYPE IF EXISTS public.contact_subject;
DROP TYPE IF EXISTS public.contact_status;
DROP TYPE IF EXISTS public.aspect_ratio;
DROP TYPE IF EXISTS public.application_status;
DROP EXTENSION IF EXISTS pgcrypto;
--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: application_status; Type: TYPE; Schema: public; Owner: kashee
--

CREATE TYPE public.application_status AS ENUM (
    'submitted',
    'under_review',
    'shortlisted',
    'interview_scheduled',
    'offer_extended',
    'hired',
    'rejected',
    'withdrawn'
);


ALTER TYPE public.application_status OWNER TO kashee;

--
-- Name: aspect_ratio; Type: TYPE; Schema: public; Owner: kashee
--

CREATE TYPE public.aspect_ratio AS ENUM (
    'square',
    'landscape',
    'portrait'
);


ALTER TYPE public.aspect_ratio OWNER TO kashee;

--
-- Name: contact_status; Type: TYPE; Schema: public; Owner: kashee
--

CREATE TYPE public.contact_status AS ENUM (
    'new',
    'read',
    'replied',
    'archived'
);


ALTER TYPE public.contact_status OWNER TO kashee;

--
-- Name: contact_subject; Type: TYPE; Schema: public; Owner: kashee
--

CREATE TYPE public.contact_subject AS ENUM (
    'general',
    'product_query',
    'complaint',
    'partnership',
    'media',
    'careers',
    'other'
);


ALTER TYPE public.contact_subject OWNER TO kashee;

--
-- Name: employment_type; Type: TYPE; Schema: public; Owner: kashee
--

CREATE TYPE public.employment_type AS ENUM (
    'full_time',
    'part_time',
    'contract',
    'internship'
);


ALTER TYPE public.employment_type OWNER TO kashee;

--
-- Name: experience_level; Type: TYPE; Schema: public; Owner: kashee
--

CREATE TYPE public.experience_level AS ENUM (
    'entry',
    'mid',
    'senior',
    'lead',
    'executive'
);


ALTER TYPE public.experience_level OWNER TO kashee;

--
-- Name: gallery_category; Type: TYPE; Schema: public; Owner: kashee
--

CREATE TYPE public.gallery_category AS ENUM (
    'events',
    'milestones',
    'team',
    'products',
    'community'
);


ALTER TYPE public.gallery_category OWNER TO kashee;

--
-- Name: work_mode; Type: TYPE; Schema: public; Owner: kashee
--

CREATE TYPE public.work_mode AS ENUM (
    'onsite',
    'remote',
    'hybrid'
);


ALTER TYPE public.work_mode OWNER TO kashee;

--
-- Name: create_updated_at_trigger(text, text); Type: FUNCTION; Schema: public; Owner: kashee
--

CREATE FUNCTION public.create_updated_at_trigger(trig text, tbl text) RETURNS void
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.create_updated_at_trigger(trig text, tbl text) OWNER TO kashee;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: kashee
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO kashee;

--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: kashee
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at() OWNER TO kashee;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: about_districts; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.about_districts (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    href character varying(300),
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.about_districts OWNER TO kashee;

--
-- Name: about_districts_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.about_districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.about_districts_id_seq OWNER TO kashee;

--
-- Name: about_districts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.about_districts_id_seq OWNED BY public.about_districts.id;


--
-- Name: about_news_items; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.about_news_items (
    id integer NOT NULL,
    title text NOT NULL,
    image_url text NOT NULL,
    href character varying(300) DEFAULT '#'::character varying NOT NULL,
    source character varying(100),
    published_at date,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.about_news_items OWNER TO kashee;

--
-- Name: about_news_items_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.about_news_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.about_news_items_id_seq OWNER TO kashee;

--
-- Name: about_news_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.about_news_items_id_seq OWNED BY public.about_news_items.id;


--
-- Name: about_paragraphs; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.about_paragraphs (
    id integer NOT NULL,
    content text NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.about_paragraphs OWNER TO kashee;

--
-- Name: about_paragraphs_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.about_paragraphs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.about_paragraphs_id_seq OWNER TO kashee;

--
-- Name: about_paragraphs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.about_paragraphs_id_seq OWNED BY public.about_paragraphs.id;


--
-- Name: about_sdg_badges; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.about_sdg_badges (
    id integer NOT NULL,
    image_url text NOT NULL,
    label character varying(100) NOT NULL,
    href character varying(300),
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.about_sdg_badges OWNER TO kashee;

--
-- Name: about_sdg_badges_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.about_sdg_badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.about_sdg_badges_id_seq OWNER TO kashee;

--
-- Name: about_sdg_badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.about_sdg_badges_id_seq OWNED BY public.about_sdg_badges.id;


--
-- Name: announcements; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    emoji character varying(10),
    text text NOT NULL,
    link_url text,
    section character varying(40) DEFAULT 'header'::character varying NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.announcements OWNER TO kashee;

--
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.announcements_id_seq OWNER TO kashee;

--
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- Name: application_status_history; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.application_status_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    from_status public.application_status,
    to_status public.application_status NOT NULL,
    changed_by character varying(200),
    note text,
    changed_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.application_status_history OWNER TO kashee;

--
-- Name: bod_members; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.bod_members (
    id integer NOT NULL,
    full_name character varying(150) NOT NULL,
    role_id integer,
    designation character varying(150),
    photo_url text,
    bio text,
    qualification text,
    district character varying(100),
    appointed_on date,
    linkedin_url character varying(300),
    sort_order smallint DEFAULT 0,
    is_chairman boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.bod_members OWNER TO kashee;

--
-- Name: bod_members_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.bod_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bod_members_id_seq OWNER TO kashee;

--
-- Name: bod_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.bod_members_id_seq OWNED BY public.bod_members.id;


--
-- Name: bod_roles; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.bod_roles (
    id integer NOT NULL,
    role_key character varying(60) NOT NULL,
    role_label character varying(100) NOT NULL,
    sort_order smallint DEFAULT 0,
    is_active boolean DEFAULT true
);


ALTER TABLE public.bod_roles OWNER TO kashee;

--
-- Name: bod_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.bod_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bod_roles_id_seq OWNER TO kashee;

--
-- Name: bod_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.bod_roles_id_seq OWNED BY public.bod_roles.id;


--
-- Name: careers_benefits; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.careers_benefits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    icon character varying(16) NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.careers_benefits OWNER TO kashee;

--
-- Name: careers_hiring_process; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.careers_hiring_process (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    step_number smallint NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.careers_hiring_process OWNER TO kashee;

--
-- Name: careers_testimonials; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.careers_testimonials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quote text NOT NULL,
    author_name character varying(100) NOT NULL,
    author_role character varying(100) NOT NULL,
    author_avatar_url text,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.careers_testimonials OWNER TO kashee;

--
-- Name: careers_values; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.careers_values (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    icon character varying(16) NOT NULL,
    title character varying(100) NOT NULL,
    description text NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.careers_values OWNER TO kashee;

--
-- Name: contact_faq_items; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.contact_faq_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contact_faq_items OWNER TO kashee;

--
-- Name: contact_office_hours; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.contact_office_hours (
    id integer NOT NULL,
    office_id uuid,
    days_label character varying(60) NOT NULL,
    hours_label character varying(60) NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL
);


ALTER TABLE public.contact_office_hours OWNER TO kashee;

--
-- Name: TABLE contact_office_hours; Type: COMMENT; Schema: public; Owner: kashee
--

COMMENT ON TABLE public.contact_office_hours IS 'Operating hours per office. office_id NULL = applies to all offices (global default).';


--
-- Name: contact_office_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.contact_office_hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_office_hours_id_seq OWNER TO kashee;

--
-- Name: contact_office_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.contact_office_hours_id_seq OWNED BY public.contact_office_hours.id;


--
-- Name: contact_offices; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.contact_offices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    label character varying(100) NOT NULL,
    address_line1 text NOT NULL,
    address_line2 text,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    pincode character varying(20) NOT NULL,
    country character varying(100) DEFAULT 'India'::character varying NOT NULL,
    phone character varying(30) NOT NULL,
    email character varying(255) NOT NULL,
    map_embed_url text,
    map_link_url text,
    latitude numeric(10,7),
    longitude numeric(10,7),
    is_primary boolean DEFAULT false NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contact_offices OWNER TO kashee;

--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.contact_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name character varying(200) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30),
    subject public.contact_subject DEFAULT 'general'::public.contact_subject NOT NULL,
    message text NOT NULL,
    office_id uuid,
    newsletter_opt_in boolean DEFAULT false NOT NULL,
    status public.contact_status DEFAULT 'new'::public.contact_status NOT NULL,
    ip_address inet,
    user_agent text,
    submitted_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.contact_submissions OWNER TO kashee;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.departments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    head_count integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.departments OWNER TO kashee;

--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.feature_flags (
    id integer NOT NULL,
    key character varying(120) NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.feature_flags OWNER TO kashee;

--
-- Name: TABLE feature_flags; Type: COMMENT; Schema: public; Owner: kashee
--

COMMENT ON TABLE public.feature_flags IS 'Global boolean feature flags. All sections use this table. Key convention: section.feature_name (e.g. header.ticker, contact.map).';


--
-- Name: feature_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.feature_flags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.feature_flags_id_seq OWNER TO kashee;

--
-- Name: feature_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.feature_flags_id_seq OWNED BY public.feature_flags.id;


--
-- Name: footer_legal_links; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.footer_legal_links (
    id integer NOT NULL,
    label character varying(80) NOT NULL,
    href character varying(300) NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    open_in_new boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.footer_legal_links OWNER TO kashee;

--
-- Name: footer_legal_links_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.footer_legal_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.footer_legal_links_id_seq OWNER TO kashee;

--
-- Name: footer_legal_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.footer_legal_links_id_seq OWNED BY public.footer_legal_links.id;


--
-- Name: footer_services; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.footer_services (
    id integer NOT NULL,
    label character varying(120) NOT NULL,
    href character varying(300) DEFAULT '#'::character varying NOT NULL,
    nav_item_id integer,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.footer_services OWNER TO kashee;

--
-- Name: footer_services_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.footer_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.footer_services_id_seq OWNER TO kashee;

--
-- Name: footer_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.footer_services_id_seq OWNED BY public.footer_services.id;


--
-- Name: footer_trust_badges; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.footer_trust_badges (
    id integer NOT NULL,
    icon_name character varying(60) NOT NULL,
    text character varying(120) NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.footer_trust_badges OWNER TO kashee;

--
-- Name: footer_trust_badges_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.footer_trust_badges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.footer_trust_badges_id_seq OWNER TO kashee;

--
-- Name: footer_trust_badges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.footer_trust_badges_id_seq OWNED BY public.footer_trust_badges.id;


--
-- Name: gallery_categories; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.gallery_categories (
    value public.gallery_category NOT NULL,
    label character varying(64) NOT NULL,
    emoji character varying(8) DEFAULT '📷'::character varying NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gallery_categories OWNER TO kashee;

--
-- Name: gallery_items; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.gallery_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_url text NOT NULL,
    thumbnail_url text,
    alt_text character varying(255) NOT NULL,
    title character varying(255),
    description text,
    category public.gallery_category NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    aspect_ratio public.aspect_ratio DEFAULT 'square'::public.aspect_ratio NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    shot_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gallery_items OWNER TO kashee;

--
-- Name: hero_slides; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.hero_slides (
    id integer NOT NULL,
    image_url text NOT NULL,
    image_alt character varying(200) DEFAULT ''::character varying NOT NULL,
    eyebrow character varying(120),
    title character varying(200),
    title_accent character varying(200),
    description text,
    cta_label character varying(80),
    cta_href character varying(300),
    tag_label character varying(80),
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.hero_slides OWNER TO kashee;

--
-- Name: hero_slides_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.hero_slides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hero_slides_id_seq OWNER TO kashee;

--
-- Name: hero_slides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.hero_slides_id_seq OWNED BY public.hero_slides.id;


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.job_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    job_id uuid NOT NULL,
    status public.application_status DEFAULT 'submitted'::public.application_status NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30) NOT NULL,
    current_job_role character varying(200),
    current_company character varying(200),
    total_experience_years numeric(4,1) DEFAULT 0 NOT NULL,
    notice_period_days integer,
    expected_salary numeric(12,2),
    salary_currency character varying(8) DEFAULT 'INR'::character varying NOT NULL,
    resume_url text,
    linkedin_url text,
    portfolio_url text,
    github_url text,
    cover_letter text,
    how_did_you_hear character varying(200),
    willing_to_relocate boolean,
    available_from date,
    reviewer_notes text,
    submitted_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.job_applications OWNER TO kashee;

--
-- Name: job_openings; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.job_openings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(200) NOT NULL,
    slug character varying(200) NOT NULL,
    department_id uuid NOT NULL,
    employment_type public.employment_type NOT NULL,
    experience_level public.experience_level NOT NULL,
    work_mode public.work_mode DEFAULT 'onsite'::public.work_mode NOT NULL,
    location character varying(200) NOT NULL,
    salary_min numeric(12,2),
    salary_max numeric(12,2),
    salary_currency character varying(8) DEFAULT 'INR'::character varying NOT NULL,
    salary_visible boolean DEFAULT false NOT NULL,
    summary text NOT NULL,
    description text NOT NULL,
    responsibilities text[] DEFAULT '{}'::text[] NOT NULL,
    requirements text[] DEFAULT '{}'::text[] NOT NULL,
    nice_to_have text[] DEFAULT '{}'::text[] NOT NULL,
    benefits_note text,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    application_deadline date,
    posted_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_salary_range CHECK (((salary_max IS NULL) OR (salary_max >= salary_min)))
);


ALTER TABLE public.job_openings OWNER TO kashee;

--
-- Name: nav_items; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.nav_items (
    id integer NOT NULL,
    parent_id integer,
    label character varying(120) NOT NULL,
    href character varying(300) DEFAULT '#'::character varying NOT NULL,
    description text,
    icon_name character varying(60),
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    open_in_new boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.nav_items OWNER TO kashee;

--
-- Name: nav_items_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.nav_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nav_items_id_seq OWNER TO kashee;

--
-- Name: nav_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.nav_items_id_seq OWNED BY public.nav_items.id;


--
-- Name: page_heroes; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.page_heroes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    page character varying(40) NOT NULL,
    headline text NOT NULL,
    subheadline text NOT NULL,
    description text,
    cta_label character varying(80),
    cta_href character varying(300),
    banner_image_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    label character varying(100)
);


ALTER TABLE public.page_heroes OWNER TO kashee;

--
-- Name: TABLE page_heroes; Type: COMMENT; Schema: public; Owner: kashee
--

COMMENT ON TABLE public.page_heroes IS 'Single-banner hero for interior pages (careers, contact, gallery, …). Replaces separate careers_hero and contact_hero tables.';


--
-- Name: page_stats; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.page_stats (
    id integer NOT NULL,
    section character varying(40) NOT NULL,
    stat_key character varying(60) NOT NULL,
    display_value character varying(30) NOT NULL,
    numeric_value integer,
    suffix character varying(10) DEFAULT ''::character varying NOT NULL,
    label character varying(120) NOT NULL,
    icon character varying(10),
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.page_stats OWNER TO kashee;

--
-- Name: TABLE page_stats; Type: COMMENT; Schema: public; Owner: kashee
--

COMMENT ON TABLE public.page_stats IS 'Consolidated stats table. section column scopes each stat to its page area. Replaces footer_stats, stats_items, and careers_stats.';


--
-- Name: page_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.page_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.page_stats_id_seq OWNER TO kashee;

--
-- Name: page_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.page_stats_id_seq OWNED BY public.page_stats.id;


--
-- Name: site_config; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.site_config (
    id integer NOT NULL,
    key character varying(120) NOT NULL,
    value text,
    value_type character varying(20) DEFAULT 'string'::character varying NOT NULL,
    label character varying(180),
    category character varying(60) DEFAULT 'general'::character varying NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT site_config_value_type_check CHECK (((value_type)::text = ANY ((ARRAY['string'::character varying, 'url'::character varying, 'boolean'::character varying, 'number'::character varying, 'json'::character varying])::text[])))
);


ALTER TABLE public.site_config OWNER TO kashee;

--
-- Name: TABLE site_config; Type: COMMENT; Schema: public; Owner: kashee
--

COMMENT ON TABLE public.site_config IS 'Global scalar CMS settings. Use category to group in admin panels. Replaces careers_section_headings and contact_page_copy one-row tables.';


--
-- Name: site_config_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.site_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_config_id_seq OWNER TO kashee;

--
-- Name: site_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.site_config_id_seq OWNED BY public.site_config.id;


--
-- Name: social_links; Type: TABLE; Schema: public; Owner: kashee
--

CREATE TABLE public.social_links (
    id integer NOT NULL,
    platform character varying(60) NOT NULL,
    url text NOT NULL,
    icon_name character varying(60),
    sections text[] DEFAULT '{}'::text[] NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.social_links OWNER TO kashee;

--
-- Name: TABLE social_links; Type: COMMENT; Schema: public; Owner: kashee
--

COMMENT ON TABLE public.social_links IS 'Unified social link table. sections[] controls which page areas render a given link. Replaces both social_links (header) and contact_social_links (contact).';


--
-- Name: social_links_id_seq; Type: SEQUENCE; Schema: public; Owner: kashee
--

CREATE SEQUENCE public.social_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_links_id_seq OWNER TO kashee;

--
-- Name: social_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kashee
--

ALTER SEQUENCE public.social_links_id_seq OWNED BY public.social_links.id;


--
-- Name: vw_active_jobs; Type: VIEW; Schema: public; Owner: kashee
--

CREATE VIEW public.vw_active_jobs AS
 SELECT j.id,
    j.title,
    j.slug,
    j.department_id,
    j.employment_type,
    j.experience_level,
    j.work_mode,
    j.location,
    j.salary_min,
    j.salary_max,
    j.salary_currency,
    j.salary_visible,
    j.summary,
    j.description,
    j.responsibilities,
    j.requirements,
    j.nice_to_have,
    j.benefits_note,
    j.tags,
    j.is_active,
    j.is_featured,
    j.application_deadline,
    j.posted_at,
    j.updated_at,
    d.name AS department_name,
    d.slug AS department_slug
   FROM (public.job_openings j
     JOIN public.departments d ON ((d.id = j.department_id)))
  WHERE ((j.is_active = true) AND ((j.application_deadline IS NULL) OR (j.application_deadline >= CURRENT_DATE)))
  ORDER BY j.is_featured DESC, j.posted_at DESC;


ALTER VIEW public.vw_active_jobs OWNER TO kashee;

--
-- Name: vw_application_pipeline; Type: VIEW; Schema: public; Owner: kashee
--

CREATE VIEW public.vw_application_pipeline AS
 SELECT a.id,
    (((a.first_name)::text || ' '::text) || (a.last_name)::text) AS candidate_name,
    a.email,
    a.phone,
    a.status,
    a.submitted_at,
    j.title AS job_title,
    d.name AS department_name
   FROM ((public.job_applications a
     JOIN public.job_openings j ON ((j.id = a.job_id)))
     JOIN public.departments d ON ((d.id = j.department_id)))
  ORDER BY a.submitted_at DESC;


ALTER VIEW public.vw_application_pipeline OWNER TO kashee;

--
-- Name: vw_contact_new_submissions; Type: VIEW; Schema: public; Owner: kashee
--

CREATE VIEW public.vw_contact_new_submissions AS
 SELECT id,
    full_name,
    email,
    phone,
    subject,
    ("left"(message, 120) ||
        CASE
            WHEN (length(message) > 120) THEN '…'::text
            ELSE ''::text
        END) AS message_preview,
    submitted_at
   FROM public.contact_submissions
  WHERE (status = 'new'::public.contact_status)
  ORDER BY submitted_at DESC;


ALTER VIEW public.vw_contact_new_submissions OWNER TO kashee;

--
-- Name: vw_footer_data; Type: VIEW; Schema: public; Owner: kashee
--

CREATE VIEW public.vw_footer_data AS
 SELECT ( SELECT json_object_agg(site_config.key, site_config.value) AS json_object_agg
           FROM public.site_config
          WHERE (site_config.is_public = true)) AS site_config,
    ( SELECT json_agg(json_build_object('section', page_stats.section, 'stat_key', page_stats.stat_key, 'display_value', page_stats.display_value, 'numeric_value', page_stats.numeric_value, 'suffix', page_stats.suffix, 'label', page_stats.label, 'icon', page_stats.icon, 'sort_order', page_stats.sort_order) ORDER BY page_stats.sort_order) AS json_agg
           FROM public.page_stats
          WHERE (((page_stats.section)::text = 'footer'::text) AND (page_stats.is_active = true))) AS footer_stats,
    ( SELECT json_agg(json_build_object('id', footer_services.id, 'label', footer_services.label, 'href', footer_services.href, 'sort_order', footer_services.sort_order) ORDER BY footer_services.sort_order) AS json_agg
           FROM public.footer_services
          WHERE (footer_services.is_active = true)) AS services,
    ( SELECT json_agg(json_build_object('id', footer_trust_badges.id, 'icon_name', footer_trust_badges.icon_name, 'text', footer_trust_badges.text, 'sort_order', footer_trust_badges.sort_order) ORDER BY footer_trust_badges.sort_order) AS json_agg
           FROM public.footer_trust_badges
          WHERE (footer_trust_badges.is_active = true)) AS trust_badges,
    ( SELECT json_agg(json_build_object('id', footer_legal_links.id, 'label', footer_legal_links.label, 'href', footer_legal_links.href, 'open_in_new', footer_legal_links.open_in_new, 'sort_order', footer_legal_links.sort_order) ORDER BY footer_legal_links.sort_order) AS json_agg
           FROM public.footer_legal_links
          WHERE (footer_legal_links.is_active = true)) AS legal_links,
    ( SELECT json_agg(json_build_object('id', social_links.id, 'platform', social_links.platform, 'url', social_links.url, 'icon_name', social_links.icon_name, 'sort_order', social_links.sort_order) ORDER BY social_links.sort_order) AS json_agg
           FROM public.social_links
          WHERE ((social_links.is_active = true) AND ('footer'::text = ANY (social_links.sections)))) AS social_links,
    ( SELECT json_object_agg(feature_flags.key, feature_flags.is_enabled) AS json_object_agg
           FROM public.feature_flags) AS feature_flags,
    ( SELECT json_agg(json_build_object('id', nav_items.id, 'label', nav_items.label, 'href', nav_items.href, 'open_in_new', nav_items.open_in_new) ORDER BY nav_items.sort_order) AS json_agg
           FROM public.nav_items
          WHERE ((nav_items.parent_id IS NULL) AND (nav_items.is_active = true))) AS nav_items;


ALTER VIEW public.vw_footer_data OWNER TO kashee;

--
-- Name: vw_gallery_active; Type: VIEW; Schema: public; Owner: kashee
--

CREATE VIEW public.vw_gallery_active AS
 SELECT gi.id,
    gi.image_url,
    gi.thumbnail_url,
    gi.alt_text,
    gi.title,
    gi.description,
    gi.category,
    gi.tags,
    gi.aspect_ratio,
    gi.featured,
    gi.sort_order,
    gi.is_active,
    gi.shot_date,
    gi.created_at,
    gi.updated_at,
    gc.label AS category_label,
    gc.emoji AS category_emoji
   FROM (public.gallery_items gi
     JOIN public.gallery_categories gc ON ((gc.value = gi.category)))
  WHERE (gi.is_active = true)
  ORDER BY gi.featured DESC, gi.sort_order, gi.shot_date DESC NULLS LAST;


ALTER VIEW public.vw_gallery_active OWNER TO kashee;

--
-- Name: vw_gallery_category_counts; Type: VIEW; Schema: public; Owner: kashee
--

CREATE VIEW public.vw_gallery_category_counts AS
 SELECT gc.value,
    gc.label,
    gc.emoji,
    gc.sort_order,
    count(gi.id) AS item_count
   FROM (public.gallery_categories gc
     LEFT JOIN public.gallery_items gi ON (((gi.category = gc.value) AND (gi.is_active = true))))
  GROUP BY gc.value, gc.label, gc.emoji, gc.sort_order
  ORDER BY gc.sort_order;


ALTER VIEW public.vw_gallery_category_counts OWNER TO kashee;

--
-- Name: vw_header_nav; Type: VIEW; Schema: public; Owner: kashee
--

CREATE VIEW public.vw_header_nav AS
SELECT
    NULL::integer AS id,
    NULL::character varying(120) AS label,
    NULL::character varying(300) AS href,
    NULL::smallint AS sort_order,
    NULL::boolean AS is_active,
    NULL::boolean AS open_in_new,
    NULL::json AS children;


ALTER VIEW public.vw_header_nav OWNER TO kashee;

--
-- Name: VIEW vw_header_nav; Type: COMMENT; Schema: public; Owner: kashee
--

COMMENT ON VIEW public.vw_header_nav IS 'Nav tree for header dropdown — top-level items with children JSON array.';


--
-- Name: about_districts id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.about_districts ALTER COLUMN id SET DEFAULT nextval('public.about_districts_id_seq'::regclass);


--
-- Name: about_news_items id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.about_news_items ALTER COLUMN id SET DEFAULT nextval('public.about_news_items_id_seq'::regclass);


--
-- Name: about_paragraphs id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.about_paragraphs ALTER COLUMN id SET DEFAULT nextval('public.about_paragraphs_id_seq'::regclass);


--
-- Name: about_sdg_badges id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.about_sdg_badges ALTER COLUMN id SET DEFAULT nextval('public.about_sdg_badges_id_seq'::regclass);


--
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- Name: bod_members id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.bod_members ALTER COLUMN id SET DEFAULT nextval('public.bod_members_id_seq'::regclass);


--
-- Name: bod_roles id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.bod_roles ALTER COLUMN id SET DEFAULT nextval('public.bod_roles_id_seq'::regclass);


--
-- Name: contact_office_hours id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.contact_office_hours ALTER COLUMN id SET DEFAULT nextval('public.contact_office_hours_id_seq'::regclass);


--
-- Name: feature_flags id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.feature_flags ALTER COLUMN id SET DEFAULT nextval('public.feature_flags_id_seq'::regclass);


--
-- Name: footer_legal_links id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.footer_legal_links ALTER COLUMN id SET DEFAULT nextval('public.footer_legal_links_id_seq'::regclass);


--
-- Name: footer_services id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.footer_services ALTER COLUMN id SET DEFAULT nextval('public.footer_services_id_seq'::regclass);


--
-- Name: footer_trust_badges id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.footer_trust_badges ALTER COLUMN id SET DEFAULT nextval('public.footer_trust_badges_id_seq'::regclass);


--
-- Name: hero_slides id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.hero_slides ALTER COLUMN id SET DEFAULT nextval('public.hero_slides_id_seq'::regclass);


--
-- Name: nav_items id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.nav_items ALTER COLUMN id SET DEFAULT nextval('public.nav_items_id_seq'::regclass);


--
-- Name: page_stats id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.page_stats ALTER COLUMN id SET DEFAULT nextval('public.page_stats_id_seq'::regclass);


--
-- Name: site_config id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.site_config ALTER COLUMN id SET DEFAULT nextval('public.site_config_id_seq'::regclass);


--
-- Name: social_links id; Type: DEFAULT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.social_links ALTER COLUMN id SET DEFAULT nextval('public.social_links_id_seq'::regclass);


--
-- Data for Name: about_districts; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.about_districts (id, name, href, sort_order, is_active) FROM stdin;
3	Ghazipur	\N	30	t
6	Bhadohi	\N	60	t
8	Kerakat	\N	80	t
9	Kasimabad	\N	90	t
2	Chandauli	\N	10	t
4	Mirzapur	\N	20	t
5	Sonbhadra	\N	40	t
1	Ballia	\N	50	t
7	Ramgarh	\N	70	t
10	Phulpur	\N	100	t
\.


--
-- Data for Name: about_news_items; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.about_news_items (id, title, image_url, href, source, published_at, sort_order, is_active, created_at) FROM stdin;
1	Kashee Milk Producer Organization to achieve turnover of Rs 200 cr by FY24	https://www.kasheemilk.com/wp-content/uploads/2023/11/The-Economic-Times.jpg	/kashee-milk-producer-organization-to-achieve-turnover-of-rs-200-cr-by-fy24-the-economic-times	The Economic Times	\N	10	t	2026-03-08 14:59:48.930928+00
2	समृद्धि की अनूठी मिसाल पेश कर रहीं KMPO से जुड़ी महिलाएं	https://www.kasheemilk.com/wp-content/uploads/2023/11/punjab-kesari.jpg	#	Punjab Kesari	\N	20	t	2026-03-08 14:59:48.930928+00
3	इन महिलाओं ने दूध बेचकर कमाए लाखों रुपये	https://www.kasheemilk.com/wp-content/uploads/2023/11/Agro-Haryana.jpg	#	Agro Haryana	\N	30	t	2026-03-08 14:59:48.930928+00
4	समृद्धि की अनूठी मिसाल	https://www.kasheemilk.com/wp-content/uploads/2023/11/The-Print-Hindi.jpg	#	The Print Hindi	\N	40	t	2026-03-08 14:59:48.930928+00
5	KMPO से जुड़ी 2000 महिलाएं डेढ़ साल के भीतर बनी लाखों की मालकिन	https://www.kasheemilk.com/wp-content/uploads/2023/11/ETV-Bharat.jpg	#	ETV Bharat	\N	50	t	2026-03-08 14:59:48.930928+00
\.


--
-- Data for Name: about_paragraphs; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.about_paragraphs (id, content, sort_order, is_active, created_at) FROM stdin;
1	Kashee Milk Producer Company Limited, Varanasi, was incorporated in November 2021 with the goal of providing a sustainable livelihood to women milk producers through dairy farming.	10	t	2026-03-08 14:59:48.884935+00
2	Recognizing the organization's commendable efforts, the State Rural Livelihood Mission (SRLM) approved the addition of two more districts — Bhadohi and Varanasi — starting in 2024. Currently, the company operates in <strong>seven districts</strong> of Eastern Uttar Pradesh.	20	t	2026-03-08 14:59:48.884935+00
3	The company commenced business operations from <strong>March 2022</strong> under the project "Dairy Value Chain Development in Eastern Uttar Pradesh" with financial assistance from UPSRLM and technical support from NDDB Dairy Services.	30	t	2026-03-08 14:59:48.884935+00
\.


--
-- Data for Name: about_sdg_badges; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.about_sdg_badges (id, image_url, label, href, sort_order, is_active) FROM stdin;
1	https://www.kasheemilk.com/wp-content/uploads/2023/10/OIP.jpg	No Poverty	\N	10	t
2	https://www.kasheemilk.com/wp-content/uploads/2023/10/climate-action.jpg	Climate Action	\N	20	t
3	https://www.kasheemilk.com/wp-content/uploads/2023/10/goodhealth.jpg	Good Health	\N	30	t
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.announcements (id, emoji, text, link_url, section, sort_order, is_active, starts_at, ends_at, created_at) FROM stdin;
1	🥛	Fresh A2 Milk delivered to your doorstep daily	\N	header	1	t	\N	\N	2026-03-08 14:59:48.785933+00
2	🐄	Empowering 10,000+ women dairy farmers across UP	\N	header	2	t	\N	\N	2026-03-08 14:59:48.785933+00
3	🌿	100% pure, natural & chemical-free products	\N	header	3	t	\N	\N	2026-03-08 14:59:48.785933+00
4	🏆	Best Dairy Brand — Eastern UP 2024	\N	header	4	t	\N	\N	2026-03-08 14:59:48.785933+00
5	📞	Helpline: 1800-XXX-XXXX — Mon–Sat, 9am–6pm	\N	header	5	t	\N	\N	2026-03-08 14:59:48.785933+00
\.


--
-- Data for Name: application_status_history; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.application_status_history (id, application_id, from_status, to_status, changed_by, note, changed_at) FROM stdin;
\.


--
-- Data for Name: bod_members; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.bod_members (id, full_name, role_id, designation, photo_url, bio, qualification, district, appointed_on, linkedin_url, sort_order, is_chairman, is_active, created_at, updated_at) FROM stdin;
1	Smt. Savita Devi	1	Chairman	https://www.kasheemilk.com/wp-content/uploads/2023/10/poonamDevi.jpg	Smt. Savita Devi is the founding Chairman of Kashee Milk Producer Company Limited. A grassroots leader from Varanasi, she has championed the cause of women dairy farmers for over a decade. Under her leadership, the company has grown from a small cooperative to a multi-district dairy value chain serving thousands of families across Eastern Uttar Pradesh.	\N	Varanasi	2021-11-01	\N	10	t	t	2026-03-09 16:15:03.58355+00	2026-03-09 16:15:03.58355+00
2	Mr. Rakesh Kumar Singh	2	Chief Executive Officer	\N	Mr. Rakesh Kumar Singh brings over 18 years of experience in dairy sector management and rural enterprise development. Prior to joining Kashee Milk, he served with the National Dairy Development Board in operational and strategic capacities across multiple states. He holds an MBA in Agribusiness Management from IRMA, Anand.	MBA Agribusiness — IRMA, Anand	\N	2022-03-01	\N	10	f	t	2026-03-09 16:15:03.587106+00	2026-03-09 16:15:03.587106+00
3	Ms. Gayatri Rao	3	Expert Director	https://www.kasheemilk.com/wp-content/uploads/2023/10/gayatriRao.jpg	Ms. Gayatri Rao has more than 16 years of working experience. She has worked with the National Rural Livelihoods Mission on women empowerment and poverty alleviation. She holds a postgraduate degree in management from IIM Kozhikode, and a Master's in Public Administration from Harvard University (Kennedy School), where she was an Edward Mason Fellow.	MBA — IIM Kozhikode | MPA — Harvard Kennedy School	\N	\N	\N	10	f	t	2026-03-09 16:15:03.589682+00	2026-03-09 16:15:03.589682+00
4	Dr. Meena Agarwal	3	Expert Director (Animal Husbandry)	\N	Dr. Meena Agarwal is a veterinary scientist with 20 years of field experience in dairy animal health and productivity improvement. She has led cattle breed improvement programmes across UP and Bihar under the National Livestock Mission.	BVSc & AH | M.VSc — IVRI, Izatnagar	\N	2022-06-15	\N	20	f	t	2026-03-09 16:15:03.589682+00	2026-03-09 16:15:03.589682+00
5	Mr. Anand Prakash Verma	3	Expert Director (Finance)	\N	Mr. Anand Prakash Verma is a Chartered Accountant with deep expertise in cooperative finance and rural lending. He advises multiple producer companies across India on financial structuring and governance, and was formerly associated with NABARD as a development consultant.	CA | B.Com (Hons) — Delhi University	\N	2023-04-01	\N	30	f	t	2026-03-09 16:15:03.589682+00	2026-03-09 16:15:03.589682+00
6	Smt. Geeta Devi	4	Director	https://www.kasheemilk.com/wp-content/uploads/2023/10/geetaDevi.jpg	Smt. Geeta Devi is from Ballia, Uttar Pradesh. Her family occupation is animal husbandry. She was appointed to the Board on 18/09/2024.	\N	Ballia	2024-09-18	\N	10	f	t	2026-03-09 16:15:03.593518+00	2026-03-09 16:15:03.593518+00
7	Smt. Poonam Devi	4	Director	https://www.kasheemilk.com/wp-content/uploads/2023/10/poonamDevi.jpg	Smt. Poonam Devi is from Chandauli, Uttar Pradesh. Her family occupation is animal husbandry. She was appointed to the Board on 18/09/2024.	\N	Chandauli	2024-09-18	\N	20	f	t	2026-03-09 16:15:03.593518+00	2026-03-09 16:15:03.593518+00
8	Smt. Kiran Devi	4	Director	\N	Smt. Kiran Devi is from Ghazipur, Uttar Pradesh. She is an active member of her local self-help group and has been involved in dairy farming for over 8 years. She was appointed to the Board on 18/09/2024.	\N	Ghazipur	2024-09-18	\N	30	f	t	2026-03-09 16:15:03.593518+00	2026-03-09 16:15:03.593518+00
9	Smt. Sunita Yadav	4	Director	\N	Smt. Sunita Yadav hails from Mirzapur district. A second-generation dairy farmer, she oversees milk collection operations in her cluster and has been instrumental in improving procurement quality.	\N	Mirzapur	2024-09-18	\N	40	f	t	2026-03-09 16:15:03.593518+00	2026-03-09 16:15:03.593518+00
10	Smt. Rekha Bind	4	Director	\N	Smt. Rekha Bind represents the Sonbhadra cluster on the Board. She has been associated with the UPSRLM-supported SHG network since 2018 and plays a key role in member mobilisation and training.	\N	Sonbhadra	2024-09-18	\N	50	f	t	2026-03-09 16:15:03.593518+00	2026-03-09 16:15:03.593518+00
11	Smt. Usha Maurya	4	Director	\N	Smt. Usha Maurya is from Bhadohi district and has been an active participant in the dairy value chain since the company's expansion into Bhadohi in 2024.	\N	Bhadohi	2024-09-18	\N	60	f	t	2026-03-09 16:15:03.593518+00	2026-03-09 16:15:03.593518+00
12	Smt. Lalita Singh	4	Director	\N	Smt. Lalita Singh is from Varanasi and has been a founding member of her village-level dairy cooperative. She leads awareness campaigns on cattle nutrition and milk hygiene.	\N	Varanasi	2021-11-01	\N	70	f	t	2026-03-09 16:15:03.593518+00	2026-03-09 16:15:03.593518+00
13	Smt. Shanti Devi	4	Director	\N	Smt. Shanti Devi is from the Chandauli cluster and joined the Board in its second term. She is known for organising women dairy farmers into structured procurement groups.	\N	Chandauli	2023-09-18	\N	80	f	t	2026-03-09 16:15:03.593518+00	2026-03-09 16:15:03.593518+00
14	Prof. Suresh Chandra Tripathi	5	Independent Director	\N	Prof. Suresh Chandra Tripathi is a retired professor of Rural Management from BHU, Varanasi. He has served on the boards of several farmer producer organizations in UP and authored extensively on cooperative governance and dairy sector reforms.	PhD Rural Management — BHU | MA Economics	\N	2022-03-01	\N	10	f	t	2026-03-09 16:15:03.596508+00	2026-03-09 16:15:03.596508+00
\.


--
-- Data for Name: bod_roles; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.bod_roles (id, role_key, role_label, sort_order, is_active) FROM stdin;
1	chairman	Chairman	10	t
2	ceo	Chief Executive Officer	20	t
3	expert_director	Expert Director	30	t
4	director	Director	40	t
5	independent	Independent Director	50	t
\.


--
-- Data for Name: careers_benefits; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.careers_benefits (id, icon, title, description, sort_order, is_active, created_at, updated_at) FROM stdin;
85728ea2-6fdb-43e7-97b9-8cff0e0418a7	💰	Competitive Compensation	Market-leading salaries benchmarked annually, with performance bonuses and equity for senior roles.	1	t	2026-03-08 14:59:49.087416+00	2026-03-08 14:59:49.087416+00
d19a6e3b-50d8-476e-affa-8a3ecb90bb8f	🏥	Comprehensive Health Cover	Full medical, dental, and vision cover for you and your immediate family from day one.	2	t	2026-03-08 14:59:49.087416+00	2026-03-08 14:59:49.087416+00
bd26c5cc-6819-4c3f-9145-d081ede5cd86	📚	Learning Budget	₹50,000 annual budget per employee for courses, certifications, books, and conferences — no approval required.	3	t	2026-03-08 14:59:49.087416+00	2026-03-08 14:59:49.087416+00
0437fbb9-9467-4113-8a2b-1e38f1776e9d	🏡	Flexible Work	Hybrid-first culture. Work from our Varanasi HQ, from home, or from a café — as long as the work gets done.	4	t	2026-03-08 14:59:49.087416+00	2026-03-08 14:59:49.087416+00
1a9ac9ca-e14e-40c2-8e43-51bc45b6d030	🌴	Generous Leave	24 days paid leave + 12 national holidays + unlimited sick leave. We mean it — use it.	5	t	2026-03-08 14:59:49.087416+00	2026-03-08 14:59:49.087416+00
ca2959ef-c923-42b5-b963-d87ae0ce359a	🥛	Product Perks	Monthly Kashee Milk hamper delivered to your home. Because we should all drink what we sell.	6	t	2026-03-08 14:59:49.087416+00	2026-03-08 14:59:49.087416+00
d3948646-7e17-48ed-86fb-5b5a40931f78	👶	Parental Support	26 weeks maternity and 4 weeks paternity leave, fully paid, with a phased return-to-work programme.	7	t	2026-03-08 14:59:49.087416+00	2026-03-08 14:59:49.087416+00
11b7dc94-647c-4eb2-b3c9-3380a6ce2f24	🎯	Clear Career Paths	Bi-annual reviews, published promotion criteria, and an internal job board so you always know what is next.	8	t	2026-03-08 14:59:49.087416+00	2026-03-08 14:59:49.087416+00
\.


--
-- Data for Name: careers_hiring_process; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.careers_hiring_process (id, step_number, title, description, is_active, updated_at) FROM stdin;
c4e04b28-4b5a-4ab3-a0f7-4c3fa31a41ba	1	Apply Online	Submit your application in under five minutes. No cover letter required — though we read every one you send.	t	2026-03-08 14:59:49.134448+00
c2c299b9-35cf-4f1a-b11b-c345afc55d11	2	Initial Screen	A 30-minute call with our talent team to understand your background and answer your questions about the role.	t	2026-03-08 14:59:49.134448+00
9093d39c-b68d-4f4e-984b-45c7e87d2851	3	Technical Assessment	A practical, take-home task relevant to the role. We respect your time — no multi-day projects, no tricks.	t	2026-03-08 14:59:49.134448+00
34d9da48-fdd3-4169-9363-5e7c9ad9dc09	4	Team Interview	Meet the people you will work with. This is a two-way conversation — come with questions.	t	2026-03-08 14:59:49.134448+00
1415c4e5-b56e-40da-b14e-71fd62c95009	5	Offer & Onboarding	A clear, competitive offer within 48 hours of your final interview. Structured 90-day onboarding from day one.	t	2026-03-08 14:59:49.134448+00
\.


--
-- Data for Name: careers_testimonials; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.careers_testimonials (id, quote, author_name, author_role, author_avatar_url, sort_order, is_active, created_at, updated_at) FROM stdin;
29e25952-c10f-4dbb-ae06-835e8e2bc2ed	I joined as a junior analyst three years ago and now lead a team of eight. The growth here is real, not just a recruiting line.	Priya Sharma	Head of Supply Chain Analytics	\N	1	t	2026-03-08 14:59:49.107324+00	2026-03-08 14:59:49.107324+00
8acc436a-b7df-4fbb-9f86-7c68d4f47333	What surprised me most was how much my opinion mattered from week one. There is no waiting to earn your voice here.	Rahul Mehra	Senior Software Engineer	\N	2	t	2026-03-08 14:59:49.107324+00	2026-03-08 14:59:49.107324+00
c38f1a5d-cec9-40f5-9477-33c1603ec111	I have worked at two Fortune 500 companies. The speed and ownership culture at Kashee is something I have never experienced before.	Ananya Iyer	Product Manager, Digital	\N	3	t	2026-03-08 14:59:49.107324+00	2026-03-08 14:59:49.107324+00
d88b81fc-c954-4a22-9573-d675b8a24910	The learning budget changed my career. I spent mine on a data science certification and moved into a brand-new role six months later.	Deepak Verma	Data Scientist	\N	4	t	2026-03-08 14:59:49.107324+00	2026-03-08 14:59:49.107324+00
\.


--
-- Data for Name: careers_values; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.careers_values (id, icon, title, description, sort_order, is_active, created_at, updated_at) FROM stdin;
d46cc897-8329-4781-9ff0-42f7fdba79f7	🌿	Rooted in Integrity	We source honestly, price fairly, and speak plainly — to our farmers, our customers, and each other.	1	t	2026-03-08 14:59:49.06655+00	2026-03-08 14:59:49.06655+00
37364239-c56a-431b-8600-cbcb52ecc74e	🚀	Growth Without Compromise	We move fast, but never at the cost of quality, safety, or the trust of the people who depend on us.	2	t	2026-03-08 14:59:49.06655+00	2026-03-08 14:59:49.06655+00
f7a01aa3-78cf-48f8-a626-203dd665ae4e	🤝	People Over Process	Great outcomes come from great teams. We hire carefully, invest deeply, and keep bureaucracy out of the way of good work.	3	t	2026-03-08 14:59:49.06655+00	2026-03-08 14:59:49.06655+00
3e41c770-03f0-4038-b556-7fa84c258b21	🌍	Community First	Every decision we make considers the farmer, the consumer, and the planet. Profit follows purpose — not the other way around.	4	t	2026-03-08 14:59:49.06655+00	2026-03-08 14:59:49.06655+00
132663de-284c-4a97-8687-29c6bd07a12d	💡	Curiosity as a Superpower	We ask why. We question assumptions. We celebrate the person who spots the better way — no matter their title.	5	t	2026-03-08 14:59:49.06655+00	2026-03-08 14:59:49.06655+00
91bc933f-c5ae-4f3d-9330-27131e0c64d3	🏆	Ownership Mentality	We hire adults. You own your work from day one, make real decisions, and see the direct impact of your contribution.	6	t	2026-03-08 14:59:49.06655+00	2026-03-08 14:59:49.06655+00
\.


--
-- Data for Name: contact_faq_items; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.contact_faq_items (id, question, answer, sort_order, is_active, created_at, updated_at) FROM stdin;
07e8d13b-c532-4183-805c-0280397f3cd0	How do I place a bulk order?	For bulk or institutional orders, please email orders@kasheemilk.com or call our sales team directly.	1	t	2026-03-08 14:59:49.405208+00	2026-03-08 14:59:49.405208+00
5eaedc45-be4f-4788-9f6c-7df526b67bbf	Where is Kashee Milk available?	We currently deliver across 18 cities in Uttar Pradesh. Use the store locator on our website to find the nearest outlet.	2	t	2026-03-08 14:59:49.405208+00	2026-03-08 14:59:49.405208+00
508b4b4c-0e54-4b94-b68a-020f277bd7b6	How can I become a Kashee Milk farmer?	We welcome dairy farmers who share our commitment to quality. Fill in the partnership form on this page and select "Partnership" as your subject.	3	t	2026-03-08 14:59:49.405208+00	2026-03-08 14:59:49.405208+00
b8efa53b-f6b1-408f-a3ca-55d389586a55	What is your return / refund policy?	If you are not satisfied with a product, contact us within 24 hours of delivery and we will arrange a replacement or full refund.	4	t	2026-03-08 14:59:49.405208+00	2026-03-08 14:59:49.405208+00
\.


--
-- Data for Name: contact_office_hours; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.contact_office_hours (id, office_id, days_label, hours_label, is_closed, sort_order) FROM stdin;
1	\N	Monday – Friday	9:00 AM – 6:00 PM	f	1
2	\N	Saturday	9:00 AM – 2:00 PM	f	2
3	\N	Sunday	Closed	t	3
\.


--
-- Data for Name: contact_offices; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.contact_offices (id, label, address_line1, address_line2, city, state, pincode, country, phone, email, map_embed_url, map_link_url, latitude, longitude, is_primary, sort_order, is_active, created_at, updated_at) FROM stdin;
57219bcd-7cbf-4c4c-aef7-cd96938ce100	Head Office	Kashee Milk Producer Company Limited	Varanasi Industrial Estate, Rohaniya	Varanasi	Uttar Pradesh	221109	India	+91 98765 43210	info@kasheemilk.com	https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5!2d82.9739!3d25.3176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1	https://maps.google.com/?q=Varanasi+Industrial+Estate+Rohaniya+Varanasi+UP	25.3176000	82.9739000	t	1	t	2026-03-08 14:59:49.335862+00	2026-03-08 14:59:49.335862+00
\.


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.contact_submissions (id, full_name, email, phone, subject, message, office_id, newsletter_opt_in, status, ip_address, user_agent, submitted_at, updated_at) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.departments (id, name, slug, description, head_count, is_active, created_at, updated_at) FROM stdin;
3fbb304b-17d6-490e-8a73-7892203fbe50	Engineering & Technology	engineering	Building the digital backbone of Kashee Milk.	24	t	2026-03-08 14:59:49.170539+00	2026-03-08 14:59:49.170539+00
6490e302-de4e-49af-a7be-1ebf4dfad5c4	Supply Chain & Operations	operations	From farm to doorstep — end-to-end.	38	t	2026-03-08 14:59:49.170539+00	2026-03-08 14:59:49.170539+00
6c27030a-2ec9-4afd-9e31-30b75f0a97cc	Sales & Marketing	sales-marketing	Growing the Kashee brand across India.	31	t	2026-03-08 14:59:49.170539+00	2026-03-08 14:59:49.170539+00
0922bdbe-66c8-40aa-b9b6-20ad9c1e147b	Product	product	Defining what we build and why.	8	t	2026-03-08 14:59:49.170539+00	2026-03-08 14:59:49.170539+00
2c988814-6b2b-4d0d-9fb2-f9e51f1cb297	Finance & Accounting	finance	Stewards of our financial health.	12	t	2026-03-08 14:59:49.170539+00	2026-03-08 14:59:49.170539+00
45e1f91d-fe3c-445a-bb19-0dc809538528	Human Resources	hr	Finding, growing, and keeping great people.	9	t	2026-03-08 14:59:49.170539+00	2026-03-08 14:59:49.170539+00
9e79a89c-265d-4cf7-917d-2a5fdfc7ed39	Quality Assurance	quality	Guardians of the Kashee standard.	14	t	2026-03-08 14:59:49.170539+00	2026-03-08 14:59:49.170539+00
e59c13c3-1a70-4e77-93c6-56f1e237d0a4	Customer Experience	cx	Every customer interaction, perfected.	18	t	2026-03-08 14:59:49.170539+00	2026-03-08 14:59:49.170539+00
\.


--
-- Data for Name: feature_flags; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.feature_flags (id, key, is_enabled, description, updated_at) FROM stdin;
1	header.topbar	t	Show the dark green top bar with ticker + social icons	2026-03-08 14:59:48.685545+00
2	header.ticker	t	Rotating ticker announcements in top bar	2026-03-08 14:59:48.685545+00
3	header.social_icons	t	Social media icons in top bar	2026-03-08 14:59:48.685545+00
4	header.search	t	Search button and expandable search bar	2026-03-08 14:59:48.685545+00
6	header.sticky	t	Make header sticky on scroll	2026-03-08 14:59:48.685545+00
7	header.scroll_blur	t	Frosted glass blur effect on scroll	2026-03-08 14:59:48.685545+00
8	header.mobile_drawer	t	Mobile hamburger menu with slide-out drawer	2026-03-08 14:59:48.685545+00
9	header.dropdown_desc	t	Show description text under dropdown items	2026-03-08 14:59:48.685545+00
10	header.top_accent_bar	t	Colored gradient accent rule at top of header	2026-03-08 14:59:48.685545+00
11	footer.cta_band	t	Show newsletter/CTA band at top of footer	2026-03-08 14:59:48.685545+00
12	footer.stats_strip	t	Show stats strip (10K+ farmers, etc.)	2026-03-08 14:59:48.685545+00
13	footer.brand_column	t	Show brand/logo column	2026-03-08 14:59:48.685545+00
14	footer.quick_links	t	Show Quick Links column	2026-03-08 14:59:48.685545+00
15	footer.services_column	t	Show Our Services column	2026-03-08 14:59:48.685545+00
16	footer.contact_column	t	Show Contact Us column	2026-03-08 14:59:48.685545+00
17	footer.trust_badges	t	Show trust badges under brand logo	2026-03-08 14:59:48.685545+00
18	footer.social_icons	t	Show social icons in footer brand column	2026-03-08 14:59:48.685545+00
19	footer.newsletter_form	t	Show email subscription form in CTA band	2026-03-08 14:59:48.685545+00
20	footer.office_hours	t	Show office hours card in contact column	2026-03-08 14:59:48.685545+00
21	footer.legal_links	t	Show legal links in bottom bar	2026-03-08 14:59:48.685545+00
22	footer.designed_by	t	Show "Designed by" credit in bottom bar	2026-03-08 14:59:48.685545+00
23	footer.dark_mode_support	t	Enable dark mode classes on footer	2026-03-08 14:59:48.685545+00
24	hero.autoplay	t	Auto-advance slides	2026-03-08 14:59:48.685545+00
25	hero.progress_bar	t	Show progress bar at bottom	2026-03-08 14:59:48.685545+00
26	hero.dot_nav	t	Show dot navigation at bottom	2026-03-08 14:59:48.685545+00
28	hero.thumbnail_nav	t	Show thumbnail strip on right (hover)	2026-03-08 14:59:48.685545+00
29	hero.arrow_nav	t	Show prev/next arrow buttons	2026-03-08 14:59:48.685545+00
30	hero.tag_pill	t	Show tag pill on each slide	2026-03-08 14:59:48.685545+00
31	hero.explore_link	t	Show "Explore" secondary link	2026-03-08 14:59:48.685545+00
32	hero.accent_line	t	Show left vertical gold accent line	2026-03-08 14:59:48.685545+00
33	hero.hover_parallax	t	Subtle image scale on hover	2026-03-08 14:59:48.685545+00
34	hero.entrance_animation	t	Fade-in animation on first load	2026-03-08 14:59:48.685545+00
35	about.districts	t	Show district tags row	2026-03-08 14:59:48.685545+00
36	about.districts_scroll	t	Enable horizontal scroll on districts	2026-03-08 14:59:48.685545+00
37	about.sdg_badges	t	Show SDG badge row	2026-03-08 14:59:48.685545+00
38	about.sdg_scroll	t	Enable horizontal scroll on SDG badges	2026-03-08 14:59:48.685545+00
39	about.news_ticker	t	Show news ticker / marquee	2026-03-08 14:59:48.685545+00
40	about.news_live_dot	t	Show animated live dot on news header	2026-03-08 14:59:48.685545+00
41	about.news_auto_scroll	t	Auto-scroll news ticker	2026-03-08 14:59:48.685545+00
42	about.news_pause_hover	t	Pause news ticker on hover	2026-03-08 14:59:48.685545+00
43	about.cta_button	t	Show Learn More CTA button	2026-03-08 14:59:48.685545+00
44	stats.animated_counter	t	Animate numbers on scroll into view	2026-03-08 14:59:48.685545+00
45	stats.scroll_snap	t	Carousel/scroll-snap on mobile	2026-03-08 14:59:48.685545+00
46	stats.show_icon	t	Show emoji icon on each stat card	2026-03-08 14:59:48.685545+00
47	stats.show_divider	t	Show divider line between number and label	2026-03-08 14:59:48.685545+00
48	stats.offset_alt_cards	t	Stagger alternate cards vertically	2026-03-08 14:59:48.685545+00
49	contact.map	t	Show embedded Google Map	2026-03-08 14:59:48.685545+00
50	contact.map_interactive	t	Interactive vs static map	2026-03-08 14:59:48.685545+00
51	contact.office_hours	t	Show office hours panel	2026-03-08 14:59:48.685545+00
52	contact.social_links	t	Show social links on contact page	2026-03-08 14:59:48.685545+00
53	contact.faq_teaser	t	Show FAQ teaser section	2026-03-08 14:59:48.685545+00
54	contact.newsletter_signup	t	Show newsletter opt-in on contact form	2026-03-08 14:59:48.685545+00
55	contact.whatsapp_cta	t	Show WhatsApp CTA button	2026-03-08 14:59:48.685545+00
56	contact.hero_banner	t	Show contact page hero banner	2026-03-08 14:59:48.685545+00
57	contact.multi_office	f	Show multi-office tab switcher	2026-03-08 14:59:48.685545+00
5	header.cta_button	f	Call-to-action phone button	2026-03-08 16:54:33.554903+00
58	bod.chairman_hero	t	Show chairman in full-width hero card above grid	2026-03-09 15:31:40.174817+00
59	bod.auto_carousel	t	Auto-rotate carousel on mobile	2026-03-09 15:31:40.174817+00
60	bod.show_appointed_date	t	Show appointment date on card	2026-03-09 15:31:40.174817+00
61	bod.show_qualification	f	Show qualification line on card	2026-03-09 15:31:40.174817+00
62	bod.show_linkedin	f	Show LinkedIn icon if URL present	2026-03-09 15:31:40.174817+00
63	bod.show_district	f	Show district tag on card	2026-03-09 15:31:40.174817+00
64	bod.bio_expandable	t	Bio truncated with read-more on card	2026-03-09 15:31:40.174817+00
27	hero.slide_counter	t	Show 01/05 counter	2026-06-22 10:43:01.297138+00
\.


--
-- Data for Name: footer_legal_links; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.footer_legal_links (id, label, href, sort_order, open_in_new, is_active) FROM stdin;
1	Privacy Policy	/privacy-policy	1	f	t
2	Terms of Use	/terms	2	f	t
3	Sitemap	/sitemap	3	f	t
\.


--
-- Data for Name: footer_services; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.footer_services (id, label, href, nav_item_id, sort_order, is_active) FROM stdin;
1	Pashu Sanjivani Seva	/kashee-pashu-sanjivani-seva-mobile-veterinary	\N	1	t
2	Animal Breeding	/animal-breeding-services	\N	2	t
3	Cattle Feed & Nutrition	/animal-nutrition-products	\N	3	t
4	Fodder Seed Distribution	/fodder-seed-distribution	\N	4	t
5	Health Initiatives	/animal-health-preventive-initiatives	\N	5	t
6	DMT Training	/trainings	\N	6	t
\.


--
-- Data for Name: footer_trust_badges; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.footer_trust_badges (id, icon_name, text, sort_order, is_active) FROM stdin;
1	Leaf	100% Pure & Natural Products	1	t
2	Heart	Women-Led Cooperative	2	t
3	Shield	FSSAI Certified	3	t
\.


--
-- Data for Name: gallery_categories; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.gallery_categories (value, label, emoji, sort_order, created_at) FROM stdin;
events	Events	🎉	1	2026-03-08 14:59:48.987756+00
milestones	Milestones	🏆	2	2026-03-08 14:59:48.987756+00
team	Team	👥	3	2026-03-08 14:59:48.987756+00
products	Products	🥛	4	2026-03-08 14:59:48.987756+00
community	Community	🤝	5	2026-03-08 14:59:48.987756+00
\.


--
-- Data for Name: gallery_items; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.gallery_items (id, image_url, thumbnail_url, alt_text, title, description, category, tags, aspect_ratio, featured, sort_order, is_active, shot_date, created_at, updated_at) FROM stdin;
a1000000-0000-0000-0000-000000000001	https://www.kasheemilk.com/wp-content/uploads/2025/01/hg.jpg	\N	Kashee Milk headquarters	Our Home	The heart of Kashee Milk operations.	milestones	{headquarters,facility}	square	t	1	t	2025-01-15	2026-03-08 14:59:49.042606+00	2026-03-08 14:59:49.042606+00
a1000000-0000-0000-0000-000000000002	https://www.kasheemilk.com/wp-content/uploads/2024/09/hgallery4.jpg	\N	Community event	Community Gathering	Bringing farmers and consumers together.	community	{community,gathering}	square	f	1	t	2024-09-20	2026-03-08 14:59:49.042606+00	2026-03-08 14:59:49.042606+00
a1000000-0000-0000-0000-000000000003	https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery1.jpg	\N	AGM 2025 opening session	AGM 2025 — Opening	Annual General Meeting 2025 opening ceremony.	events	{agm,2025}	square	t	1	t	2025-09-05	2026-03-08 14:59:49.042606+00	2026-03-08 14:59:49.042606+00
a1000000-0000-0000-0000-000000000004	https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery3.jpg	\N	AGM 2025 panel discussion	AGM 2025 — Panel	Key stakeholders sharing insights at the panel.	events	{agm,2025,panel}	square	f	2	t	2025-09-05	2026-03-08 14:59:49.042606+00	2026-03-08 14:59:49.042606+00
a1000000-0000-0000-0000-000000000005	https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery4.jpg	\N	AGM 2025 awards ceremony	AGM 2025 — Awards	Recognising excellence among our farmer network.	events	{agm,2025,awards}	square	t	3	t	2025-09-05	2026-03-08 14:59:49.042606+00	2026-03-08 14:59:49.042606+00
a1000000-0000-0000-0000-000000000006	https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery2.jpg	\N	AGM 2025 audience	AGM 2025 — Audience	Members from across Varanasi and beyond.	events	{agm,2025}	square	f	4	t	2025-09-06	2026-03-08 14:59:49.042606+00	2026-03-08 14:59:49.042606+00
\.


--
-- Data for Name: hero_slides; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.hero_slides (id, image_url, image_alt, eyebrow, title, title_accent, description, cta_label, cta_href, tag_label, sort_order, is_active, starts_at, ends_at, created_at, updated_at) FROM stdin;
2	https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-dslide2.jpg	AGM 2025	Community & Growth	Rooted in Villages,	Reaching the Nation	1,000+ villages. One mission — sustainable dairy for every woman farmer.	Meet Members	/membership	7 Districts	20	t	\N	\N	2026-03-08 14:59:48.865751+00	2026-03-08 14:59:48.865751+00
3	https://www.kasheemilk.com/wp-content/uploads/2026/01/Kaashee-new-slider3.webp	Kashee Milk	Dairy Value Chain	From Farm to Table,	With Care	Pure milk and premium dairy products crafted with love by the women of Eastern UP.	Our Products	/milk-milk-products	Since March 2022	30	t	\N	\N	2026-03-08 14:59:48.865751+00	2026-03-08 14:59:48.865751+00
4	https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-dslide4.jpg	AGM 2025	Veterinary Services	Healthier Animals,	Better Yields	Comprehensive veterinary care, breeding, and nutrition programs at your doorstep.	Our Services	/animal-breeding-services	Mobile Vet Units	40	t	\N	\N	2026-03-08 14:59:48.865751+00	2026-03-08 14:59:48.865751+00
5	https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-dslide5.jpg	AGM 2025	Impact & Progress	Growing Together,	Every Single Day	A cooperative built on trust, transparency, and the power of collective ownership.	Annual Reports	/annual-reports	UPSRLM · NDDB	50	t	\N	\N	2026-03-08 14:59:48.865751+00	2026-03-08 14:59:48.865751+00
1	https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-dslide1.jpg	AGM 2025	Est. 2021 · Eastern UP	Empowering Women,	Nourishing Lives	A women-owned dairy cooperative transforming livelihoods across 7 districts.	Our Story	/about-us	50,000+ Members	10	t	\N	\N	2026-03-08 14:59:48.865751+00	2026-06-22 09:45:12.742693+00
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.job_applications (id, job_id, status, first_name, last_name, email, phone, current_job_role, current_company, total_experience_years, notice_period_days, expected_salary, salary_currency, resume_url, linkedin_url, portfolio_url, github_url, cover_letter, how_did_you_hear, willing_to_relocate, available_from, reviewer_notes, submitted_at, updated_at) FROM stdin;
\.


--
-- Data for Name: job_openings; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.job_openings (id, title, slug, department_id, employment_type, experience_level, work_mode, location, salary_min, salary_max, salary_currency, salary_visible, summary, description, responsibilities, requirements, nice_to_have, benefits_note, tags, is_active, is_featured, application_deadline, posted_at, updated_at) FROM stdin;
c9c9d5de-b3ab-45c8-acb7-4a4b3d8c026f	Senior Full-Stack Engineer	senior-fullstack-engineer	3fbb304b-17d6-490e-8a73-7892203fbe50	full_time	senior	hybrid	Varanasi, Uttar Pradesh	1800000.00	2800000.00	INR	t	Own the end-to-end delivery of consumer-facing features used by half a million customers daily.	## About the Role\n\nWe are looking for a Senior Full-Stack Engineer to join our product engineering team.	{"Design, build, and ship full-stack features on our Next.js + Node.js platform","Lead technical design reviews and architecture decisions","Mentor 2–3 junior engineers through code reviews and pairing sessions","Instrument and monitor services using our observability stack","Collaborate with Product and Design in early discovery phases"}	{"4+ years of professional full-stack development experience","Strong proficiency in TypeScript, React / Next.js, and Node.js","Experience with PostgreSQL and REST or GraphQL API design","Comfortable with cloud infrastructure (AWS or GCP)","Track record of shipping production features with high quality"}	{"Experience with React Native for mobile development","Familiarity with event-driven architectures (Kafka / SQS)","Prior experience in a high-growth startup or FMCG-tech environment"}	\N	{nextjs,typescript,nodejs,postgresql,aws}	t	t	\N	2026-03-08 14:59:49.220135+00	2026-03-08 14:59:49.220135+00
1b2a9b61-9799-4e4e-a1be-c18d651953dc	DevOps Engineer	devops-engineer	3fbb304b-17d6-490e-8a73-7892203fbe50	full_time	mid	remote	Remote (India)	\N	\N	INR	f	Build and maintain the infrastructure that keeps our platform fast, reliable, and secure at scale.	## About the Role\n\nWe need a DevOps Engineer who loves automation, hates downtime, and believes infrastructure is a product too.	{"Manage and scale our Kubernetes clusters on AWS EKS","Own our CI/CD pipelines","Build infrastructure-as-code using Terraform","Set up alerting, dashboards, and on-call runbooks","Drive security hardening and compliance"}	{"3+ years in a DevOps or SRE role","Deep experience with Kubernetes and Docker","Proficient in Terraform or Pulumi","Solid understanding of networking, TLS, and IAM","Experience with Prometheus / Grafana / Datadog"}	{"GitOps experience (ArgoCD / Flux)","AWS certifications","Experience with SOC 2 compliance"}	\N	{devops,kubernetes,aws,terraform,cicd}	t	f	\N	2026-03-08 14:59:49.224842+00	2026-03-08 14:59:49.224842+00
99ccdb26-6cec-4826-98fc-b83e95c5ba88	Product Manager — Consumer App	product-manager-consumer-app	0922bdbe-66c8-40aa-b9b6-20ad9c1e147b	full_time	senior	hybrid	Varanasi, Uttar Pradesh	1600000.00	2400000.00	INR	t	Define and drive the product vision for our consumer-facing mobile and web app serving 500K+ MAU.	## About the Role\n\nYou will own the consumer app roadmap, work closely with engineering and design, and be accountable for MAU growth and retention metrics.	{"Define and own the product roadmap for the consumer app","Run discovery: user interviews, data analysis, competitor research","Write clear, outcome-oriented product specs","Partner with engineering leads to deliver on time","Track core metrics: MAU, retention, NPS, conversion"}	{"4+ years of product management, with 2+ in consumer apps","Comfortable with quantitative analysis — SQL is a plus","Experience running structured user research","Strong written and verbal communication","Proven track record of shipping 0→1 and improving existing products"}	{"Experience in FMCG or D2C","Background in growth/experimentation","MBA from a Tier-1 institution"}	\N	{product,consumer-app,growth,mobile}	t	t	\N	2026-03-08 14:59:49.22809+00	2026-03-08 14:59:49.22809+00
8dfc799e-c8d0-4f69-835a-5e3716a496cf	Regional Sales Manager — North India	regional-sales-manager-north	6c27030a-2ec9-4afd-9e31-30b75f0a97cc	full_time	lead	onsite	Lucknow / Varanasi, Uttar Pradesh	\N	\N	INR	f	Lead our retail and institutional sales strategy across UP and Uttarakhand, managing a team of 12 territory reps.	## About the Role\n\nWe are expanding aggressively across North India and need a sales leader who can build relationships, develop team capability, and hit numbers.	{"Own revenue and distribution targets for UP and Uttarakhand","Lead, coach, and hire 12 territory sales reps","Develop and execute channel strategy across modern trade, traditional trade, and HoReCa","Build relationships with key retail chains and distributors","Report weekly on pipeline, forecasts, and market intelligence"}	{"7+ years in FMCG sales, with 3+ years in team leadership","Deep knowledge of UP and Uttarakhand retail landscape","Experience managing distributors and key accounts","Data-driven approach to performance management","Willingness to travel extensively (50%+)"}	{"Prior experience in dairy or beverages","Fluency in Hindi and English","MBA in Sales/Marketing"}	\N	{sales,fmcg,north-india,leadership}	t	t	\N	2026-03-08 14:59:49.231048+00	2026-03-08 14:59:49.231048+00
188702a0-e8dd-44aa-b27a-d307b0912697	Quality Assurance Lead — Processing Plant	qa-lead-processing-plant	9e79a89c-265d-4cf7-917d-2a5fdfc7ed39	full_time	mid	onsite	Varanasi Processing Facility, UP	\N	\N	INR	f	Own quality control protocols at our Varanasi facility, ensuring every batch meets the highest standard.	## About the Role\n\nYou will be the last line of defence for product quality, running a team of 4 QA technicians across three shifts.	{"Design and enforce SOPs for raw milk, in-process, and finished goods testing","Manage 4 QA technicians across shift rotations","Lead RCA and CAPA for quality deviations","Maintain FSSAI, ISO 22000, and HACCP compliance documentation","Liaise with R&D team on new product trials"}	{"BSc/MSc in Food Science, Dairy Technology, or Microbiology","4+ years QA experience in food & beverage manufacturing","Hands-on experience with microbiological and physicochemical testing","Familiarity with FSSAI regulations and ISO 22000 / HACCP","Experience managing a shift-based team"}	{"Prior dairy industry experience","Certified Internal Auditor (ISO 22000)","Experience with LIMS software"}	\N	{quality,food-safety,dairy,haccp}	t	f	\N	2026-03-08 14:59:49.234672+00	2026-03-08 14:59:49.234672+00
8acddf77-1b47-434b-bb1f-5e2e992ebe4a	HR & Talent Intern	hr-talent-intern	45e1f91d-fe3c-445a-bb19-0dc809538528	internship	entry	hybrid	Varanasi, Uttar Pradesh	\N	\N	INR	f	A 6-month paid internship supporting our talent acquisition and people operations team.	## About the Role\n\nA fantastic opportunity for an MBA student or fresh graduate to get hands-on experience in a fast-growing FMCG company.	{"Support end-to-end recruitment for entry and mid-level roles","Screen CVs, schedule interviews, manage candidate communications","Assist with onboarding logistics and Day 1 experience","Help maintain ATS and HRMS data accuracy","Contribute to employer branding on LinkedIn"}	{"Pursuing or recently completed MBA in HR or equivalent","Excellent written and verbal communication in English and Hindi","High attention to detail and organisational skills","Comfortable with Google Workspace and spreadsheets"}	{"Prior internship in HR or recruitment","Familiarity with LinkedIn Recruiter or Naukri"}	\N	{hr,internship,talent,recruiting}	t	f	\N	2026-03-08 14:59:49.238547+00	2026-03-08 14:59:49.238547+00
\.


--
-- Data for Name: nav_items; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.nav_items (id, parent_id, label, href, description, icon_name, sort_order, is_active, open_in_new, created_at) FROM stdin;
1	\N	Home	/	\N	\N	10	t	f	2026-03-08 14:59:48.74108+00
2	\N	About Us	/about-us	\N	\N	20	t	f	2026-03-08 14:59:48.74108+00
4	\N	Veterinary Services	#	\N	\N	40	t	f	2026-03-08 14:59:48.74108+00
5	\N	Business Opportunity	#	\N	\N	50	t	f	2026-03-08 14:59:48.74108+00
6	\N	Member Corner	#	\N	\N	60	t	f	2026-03-08 14:59:48.74108+00
7	\N	Media	#	\N	\N	70	t	f	2026-03-08 14:59:48.74108+00
8	\N	Join Us	/join-us	\N	\N	80	t	f	2026-03-08 14:59:48.74108+00
9	\N	Contact	/contact-us	\N	\N	90	t	f	2026-03-08 14:59:48.74108+00
10	2	Chairman's Message	/chairmans-message	Words from our leader	\N	1	t	f	2026-03-08 14:59:48.744756+00
11	2	Board of Directors	/board-of-directors	Meet the governing council	\N	2	t	f	2026-03-08 14:59:48.744756+00
12	2	Mission	/mission	What drives us forward	\N	3	t	f	2026-03-08 14:59:48.744756+00
13	2	Vision	/vision	Where we see ourselves	\N	4	t	f	2026-03-08 14:59:48.744756+00
14	2	Values	/values	Core principles we live by	\N	5	t	f	2026-03-08 14:59:48.744756+00
15	2	Milestone	/milestone	Key achievements over the years	\N	6	t	f	2026-03-08 14:59:48.744756+00
16	4	Animal Breeding Services	/animal-breeding-services	AI & ET services	\N	1	t	f	2026-03-08 14:59:48.748503+00
17	4	Animal Nutrition Products	/animal-nutrition-products	Balanced feed solutions	\N	2	t	f	2026-03-08 14:59:48.748503+00
18	4	Animal Health Initiatives	/animal-health-preventive-initiatives	Preventive care programs	\N	3	t	f	2026-03-08 14:59:48.748503+00
19	4	Pashu Sanjivani Seva	/kashee-pashu-sanjivani-seva-mobile-veterinary	Mobile vet services	\N	4	t	f	2026-03-08 14:59:48.748503+00
20	4	Trainings	/trainings	Farmer education programs	\N	5	t	f	2026-03-08 14:59:48.748503+00
21	5	Distributor Enquiry	/distributor-enquiry	Become a distributor	\N	1	t	f	2026-03-08 14:59:48.751467+00
22	5	Vendor Enquiry	/vendor-enquiry	Empanel as a vendor	\N	2	t	f	2026-03-08 14:59:48.751467+00
23	5	Tenders	/tenders	Active procurement tenders	\N	3	t	f	2026-03-08 14:59:48.751467+00
24	5	Facilities	/facilities	Our infrastructure	\N	4	t	f	2026-03-08 14:59:48.751467+00
25	6	Kashee E-Dairy App	/kashee-e-dairy-app	Manage your dairy digitally	\N	1	t	f	2026-03-08 14:59:48.754767+00
26	6	Membership	/membership	Join the cooperative	\N	2	t	f	2026-03-08 14:59:48.754767+00
27	6	Annual Reports	/annual-reports	Financial disclosures	\N	3	t	f	2026-03-08 14:59:48.754767+00
28	6	Annual Returns	/annual-returns	MCA filings	\N	4	t	f	2026-03-08 14:59:48.754767+00
29	6	Grievance Redressal	/grievance-redressal	Raise a complaint	\N	5	t	f	2026-03-08 14:59:48.754767+00
30	7	Latest News	/category/news-and-updates	Recent press releases	\N	1	t	f	2026-03-08 14:59:48.757311+00
31	7	Gallery	/gallery	Photo & video gallery	\N	2	t	f	2026-03-08 14:59:48.757311+00
32	7	Events	/events	Upcoming events	\N	3	t	f	2026-03-08 14:59:48.757311+00
33	7	Kashee in News	/kashee-in-news	Media coverage	\N	4	t	f	2026-03-08 14:59:48.757311+00
34	8	Join Us	/join-us	Be part of us	\N	1	t	f	2026-03-08 14:59:48.760199+00
35	8	Life@Kashee	/lifekashee	Culture & work-life	\N	2	t	f	2026-03-08 14:59:48.760199+00
36	8	Current Openings	/current-openings	Open positions	\N	3	t	f	2026-03-08 14:59:48.760199+00
37	8	Internship Opportunity	/internship-opportunity	Student programs	\N	4	t	f	2026-03-08 14:59:48.760199+00
38	2	Compliance	https://www.kasheemilk.com/wp-content/uploads/2026/04/Form-5A_KasheeMPCL.pdf	\N	\N	7	t	f	2026-06-22 10:13:57.305026+00
3	\N	Milk & Products	/milk-products	\N	\N	30	f	f	2026-03-08 14:59:48.74108+00
\.


--
-- Data for Name: page_heroes; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.page_heroes (id, page, headline, subheadline, description, cta_label, cta_href, banner_image_url, is_active, created_at, updated_at, label) FROM stdin;
df7a1881-e811-4a81-b860-120f9b11195e	careers	Shape the Future of Pure Dairy	Join a team that believes great milk starts with great people.	At Kashee Milk, we are on a mission to deliver the purest, most nourishing dairy to every home in India. Behind every bottle is a team of passionate individuals — farmers, technologists, marketers, and dreamers — who show up every day to do meaningful work. If that sounds like you, we want to hear from you.	Explore Open Roles	#openings	https://www.kasheemilk.com/wp-content/uploads/2023/06/joinusbanner.jpg	t	2026-03-08 14:59:48.8158+00	2026-03-08 17:18:37.651931+00	\N
cb95c987-9691-4eed-9c03-b827d182d063	contact	Let's Start a Conversation	Whether you have a question about our products, a partnership idea, or just want to say hello — we are here.	\N	\N	\N	https://www.kasheemilk.com/wp-content/uploads/2023/06/contactusbanner.jpg	t	2026-03-08 14:59:48.8158+00	2026-03-08 17:18:37.651931+00	\N
05b4fa00-ff5e-4458-9d73-65e59c64260b	bod	Board of Directors	Meet the visionary leaders guiding Kashee Milk Producer Company — committed to empowering women farmers across Eastern Uttar Pradesh.	\N	\N	\N	https://www.kasheemilk.com/wp-content/uploads/2025/01/gallerybanner-.jpg	t	2026-03-09 15:31:40.047059+00	2026-06-22 10:50:13.554977+00	Leadership
d04734ef-b6dd-4a14-9070-bc621ad27ff9	mission	Our Mission	Our mission is to empower the women farmers.	To foster sustainable social and economic empowerment among our producer members, Kashee MPCL will offer competitive prices for supplied milk and aim to optimize milk production by providing essential technical input services to its members.	\N	\N	https://www.kasheemilk.com/wp-content/uploads/2024/02/Our-mission-bg-image.jpg	t	2026-06-22 10:47:28.471168+00	2026-06-22 11:13:54.15836+00	\N
\.


--
-- Data for Name: page_stats; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.page_stats (id, section, stat_key, display_value, numeric_value, suffix, label, icon, sort_order, is_active, updated_at) FROM stdin;
2	home	villages	1,000+	1000	+	Total Villages	🏘️	20	t	2026-03-08 14:59:48.838747+00
3	home	milk	2,00,000+	200000	+	Milk Qty (Litres/Day)	🥛	30	t	2026-03-08 14:59:48.838747+00
4	home	districts	7	7		Districts Covered	📍	40	t	2026-03-08 14:59:48.838747+00
9	careers	team_members	120+	120		Team Members	\N	1	t	2026-03-08 16:34:47.595847+00
8	footer	districts	7	7		Districts	\N	4	t	2026-03-08 16:34:47.595847+00
7	footer	pure_milk	100%	100		Pure Milk	\N	3	t	2026-03-08 16:34:47.595847+00
6	footer	years	5+	5		Years	\N	2	t	2026-03-08 16:34:47.595847+00
5	footer	farmers	12K+	12000		Farmers	\N	1	t	2026-03-08 16:34:47.595847+00
14	careers	founded	2022	2022		Founded	\N	6	t	2026-03-08 16:37:51.278907+00
13	careers	cities	18	18		Cities Served	\N	5	t	2026-03-08 16:37:51.278907+00
12	careers	glassdoor	4.7★	\N		Glassdoor Rating	\N	4	t	2026-03-08 16:37:51.278907+00
11	careers	retention	94%	94		Retention Rate	\N	3	t	2026-03-08 16:37:51.278907+00
10	careers	departments	12	18		Departments	\N	2	t	2026-03-08 16:37:51.278907+00
1	home	members	50,000+	50000	+	Total Enrolled Members	👥	10	t	2026-06-22 10:39:56.211571+00
\.


--
-- Data for Name: site_config; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.site_config (id, key, value, value_type, label, category, is_public, updated_at) FROM stdin;
3	logo_url	https://www.kasheemilk.com/wp-content/uploads/2023/05/Kashee-GIF-logo.gif	url	Logo URL	brand	t	2026-03-08 14:59:48.654659+00
4	logo_alt	Kashee Milk Logo	string	Logo Alt Text	brand	t	2026-03-08 14:59:48.654659+00
5	logo_name_part1	Kashee	string	Logo Name Part 1	brand	t	2026-03-08 14:59:48.654659+00
6	logo_name_part2	Milk	string	Logo Name Part 2 (accent)	brand	t	2026-03-08 14:59:48.654659+00
7	copyright_name	Kashee Milk Producer Company Ltd.	string	Copyright Entity Name	brand	t	2026-03-08 14:59:48.654659+00
10	footer_logo_url	https://www.kasheemilk.com/wp-content/uploads/2023/05/Kashee-GIF-logo.gif	url	Footer Logo URL	brand	t	2026-03-08 14:59:48.654659+00
11	footer_logo_alt	Kashee Milk	string	Footer Logo Alt	brand	t	2026-03-08 14:59:48.654659+00
12	footer_tagline	Empowering women milk producers in Eastern Uttar Pradesh through sustainable dairy farming since 2021.	string	Footer Tagline	brand	t	2026-03-08 14:59:48.654659+00
13	phone_number	1800-XXX-XXXX	string	Helpline Number	contact	t	2026-03-08 14:59:48.654659+00
14	phone_href	tel:1800XXXXXXX	string	Phone Link	contact	t	2026-03-08 14:59:48.654659+00
17	contact_phone	+91-XXXXX-XXXXX	string	Contact Phone	contact	t	2026-03-08 14:59:48.654659+00
18	contact_email	info@kasheemilk.com	string	Contact Email	contact	t	2026-03-08 14:59:48.654659+00
20	office_hours_weekend	Sun: Closed	string	Office Hours (Weekend)	contact	t	2026-03-08 14:59:48.654659+00
21	cta_label	Order Fresh Milk Today	string	CTA Button Label	general	t	2026-03-08 14:59:48.654659+00
22	newsletter_heading	Get Fresh Updates & Exclusive Offers	string	Newsletter Heading	general	t	2026-03-08 14:59:48.654659+00
23	newsletter_subtext	Stay Connected	string	Newsletter Sub-label	general	t	2026-03-08 14:59:48.654659+00
24	newsletter_placeholder	Enter your email…	string	Newsletter Placeholder	general	t	2026-03-08 14:59:48.654659+00
25	newsletter_btn_label	Subscribe	string	Newsletter Button Label	general	t	2026-03-08 14:59:48.654659+00
26	hero_autoplay_ms	5000	number	Slide autoplay interval (ms)	hero	t	2026-03-08 14:59:48.654659+00
27	hero_transition_ms	800	number	Slide transition duration (ms)	hero	t	2026-03-08 14:59:48.654659+00
28	hero_explore_label	Explore	string	Explore link label	hero	t	2026-03-08 14:59:48.654659+00
29	hero_explore_href	/about-us	string	Explore link URL	hero	t	2026-03-08 14:59:48.654659+00
30	hero_height_clamp	clamp(340px, 46vw, 520px)	string	Hero section height (CSS clamp)	hero	t	2026-03-08 14:59:48.654659+00
31	about_section_label	Who We Are	string	About eyebrow label	about	t	2026-03-08 14:59:48.654659+00
32	about_section_title	A Story of Empowerment & Purpose	string	About section heading	about	t	2026-03-08 14:59:48.654659+00
33	about_subtitle	Kashee Milk Producer Company Limited, Varanasi, was incorporated in November 2021 with the goal of providing a sustainable livelihood to women milk producers through dairy farming.	string	About subtitle	about	t	2026-03-08 14:59:48.654659+00
34	about_cta_label	Learn More	string	About CTA button label	about	t	2026-03-08 14:59:48.654659+00
35	about_cta_href	/about-us	string	About CTA link	about	t	2026-03-08 14:59:48.654659+00
36	news_section_label	Media	string	News eyebrow label	about	t	2026-03-08 14:59:48.654659+00
37	news_section_title	News & Events	string	News section heading	about	t	2026-03-08 14:59:48.654659+00
38	news_view_all_href	/category/news-and-updates	string	News "View all" link	about	t	2026-03-08 14:59:48.654659+00
39	news_footer_href	/category/news-and-updates	string	News footer link	about	t	2026-03-08 14:59:48.654659+00
40	news_footer_label	All news & events	string	News footer link label	about	t	2026-03-08 14:59:48.654659+00
41	news_ticker_speed_s	30	number	News ticker speed (s)	about	t	2026-03-08 14:59:48.654659+00
42	stats_eyebrow	Our Impact	string	Stats eyebrow label	stats	t	2026-03-08 14:59:48.654659+00
43	stats_heading	Progress in Numbers	string	Stats heading	stats	t	2026-03-08 14:59:48.654659+00
44	stats_accent	Numbers	string	Heading accent word	stats	t	2026-03-08 14:59:48.654659+00
45	stats_subtext	Every figure represents a life touched, a family strengthened, and a future secured across Eastern UP.	string	Stats subtext	stats	t	2026-03-08 14:59:48.654659+00
46	stats_counter_ms	2000	number	Counter animation (ms)	stats	t	2026-03-08 14:59:48.654659+00
47	careers.values_heading	What We Stand For	string	Careers: Values heading	careers	t	2026-03-08 14:59:48.654659+00
48	careers.values_subheading	Our values are not posters on a wall — they are the decisions we make every day.	string	Careers: Values subheading	careers	t	2026-03-08 14:59:48.654659+00
49	careers.benefits_heading	Life at Kashee Milk	string	Careers: Benefits heading	careers	t	2026-03-08 14:59:48.654659+00
50	careers.benefits_subheading	We invest in our people the same way we invest in our product — with care and without compromise.	string	Careers: Benefits subheading	careers	t	2026-03-08 14:59:48.654659+00
51	careers.openings_heading	Open Positions	string	Careers: Openings heading	careers	t	2026-03-08 14:59:48.654659+00
52	careers.openings_subheading	Find your place in our growing team. All roles are open to talented individuals regardless of background.	string	Careers: Openings subheading	careers	t	2026-03-08 14:59:48.654659+00
53	careers.testimonials_heading	Voices from the Team	string	Careers: Testimonials heading	careers	t	2026-03-08 14:59:48.654659+00
54	careers.process_heading	How We Hire	string	Careers: Process heading	careers	t	2026-03-08 14:59:48.654659+00
55	careers.process_subheading	A transparent, respectful process — because your time matters as much as ours.	string	Careers: Process subheading	careers	t	2026-03-08 14:59:48.654659+00
56	contact.page_label	Get In Touch	string	Contact: page label	contact	t	2026-03-08 14:59:48.654659+00
57	contact.info_panel_heading	We Would Love to Hear From You	string	Contact: info panel heading	contact	t	2026-03-08 14:59:48.654659+00
58	contact.info_panel_subheading	Reach us through any of the channels below, or fill in the form and we will get back to you within one business day.	string	Contact: info panel subheading	contact	t	2026-03-08 14:59:48.654659+00
59	contact.form_heading	Send Us a Message	string	Contact: form heading	contact	t	2026-03-08 14:59:48.654659+00
60	contact.form_subheading	Fill in the form below and our team will respond promptly.	string	Contact: form subheading	contact	t	2026-03-08 14:59:48.654659+00
61	contact.form_success_heading	Message Received!	string	Contact: success heading	contact	t	2026-03-08 14:59:48.654659+00
62	contact.form_success_body	Thank you for reaching out. A member of our team will respond to your message within one business day.	string	Contact: success body	contact	t	2026-03-08 14:59:48.654659+00
19	office_hours_weekday	Mon–Sat: 9:00 AM – 8:00 PM	string	Office Hours (Weekday)	contact	t	2026-03-08 16:55:49.296535+00
15	working_hours	Mon–Sat, 9:30am–5:30pm	string	Working Hours	contact	t	2026-03-08 16:55:49.296535+00
63	contact.form_submit_label	Send Message	string	Contact: submit button label	contact	t	2026-03-08 14:59:48.654659+00
64	contact.hours_heading	Office Hours	string	Contact: hours heading	contact	t	2026-03-08 14:59:48.654659+00
65	contact.faq_heading	Frequently Asked Questions	string	Contact: FAQ heading	contact	t	2026-03-08 14:59:48.654659+00
66	contact.faq_cta_label	Browse all FAQs	string	Contact: FAQ CTA label	contact	t	2026-03-08 14:59:48.654659+00
67	contact.faq_cta_href	/faq	url	Contact: FAQ CTA href	contact	t	2026-03-08 14:59:48.654659+00
68	contact.whatsapp_number	+919876543210	string	Contact: WhatsApp number	contact	t	2026-03-08 14:59:48.654659+00
69	contact.whatsapp_label	Chat on WhatsApp	string	Contact: WhatsApp label	contact	t	2026-03-08 14:59:48.654659+00
16	contact_address	Kashee Milk Producer Company Limited, 2nd floor S-2/1-77, Tagore town extension, Panchkoshi Road, Varanasi – 221002\n	string	Office Address	contact	t	2026-03-08 16:53:23.765066+00
9	designed_by_url	https://techyugantar.in/	url	Designed By URL	brand	t	2026-03-08 16:53:23.765066+00
8	designed_by_label	Tech Yugantar	string	Designed By Label	brand	t	2026-03-08 16:53:23.765066+00
2	site_tagline	हर · घर · काशी	string	Tagline	brand	t	2026-03-08 16:53:23.765066+00
1	site_name	Kashee Milk Producer Company	string	Site Name	brand	t	2026-03-08 16:53:23.765066+00
70	bod_section_eyebrow	Our Leadership	string	BOD eyebrow label	bod	t	2026-03-09 15:31:40.166982+00
71	bod_section_title	Board of Directors	string	BOD section heading	bod	t	2026-03-09 15:31:40.166982+00
72	bod_section_subtitle	Meet the dedicated leaders steering Kashee Milk towards a more empowered and sustainable future for women farmers.	string	BOD section subtitle	bod	t	2026-03-09 15:31:40.166982+00
73	bod_chairman_label	Chairman	string	Chairman badge label	bod	t	2026-03-09 15:31:40.166982+00
74	bod_appointed_prefix	Appointed	string	Appointed date prefix	bod	t	2026-03-09 15:31:40.166982+00
75	bod_carousel_speed_ms	5000	number	Auto-rotate interval (ms)	bod	t	2026-03-09 15:31:40.166982+00
76	bod_cards_per_view	3	number	Cards visible at once	bod	t	2026-03-09 15:31:40.166982+00
\.


--
-- Data for Name: social_links; Type: TABLE DATA; Schema: public; Owner: kashee
--

COPY public.social_links (id, platform, url, icon_name, sections, sort_order, is_active, created_at, updated_at) FROM stdin;
1	Facebook	https://www.facebook.com/people/Kashee-Milk-Producer-Company/100080985653961/	Facebook	{header,footer,contact}	1	t	2026-03-08 14:59:48.715669+00	2026-03-08 14:59:48.715669+00
2	LinkedIn	https://www.linkedin.com/in/kashee-milk-933a4223b/	Linkedin	{header,footer,contact}	2	t	2026-03-08 14:59:48.715669+00	2026-03-08 14:59:48.715669+00
3	YouTube	https://www.youtube.com/channel/UCJkNzlRPmV-sWKG0mCSL9ew	Youtube	{header,footer}	3	t	2026-03-08 14:59:48.715669+00	2026-03-08 14:59:48.715669+00
4	Twitter	https://twitter.com/KasheeMilk	Twitter	{header,footer,contact}	4	t	2026-03-08 14:59:48.715669+00	2026-03-08 14:59:48.715669+00
5	Instagram	https://instagram.com/kasheemilk	Instagram	{contact}	5	t	2026-03-08 14:59:48.715669+00	2026-03-08 14:59:48.715669+00
\.


--
-- Name: about_districts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.about_districts_id_seq', 10, true);


--
-- Name: about_news_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.about_news_items_id_seq', 5, true);


--
-- Name: about_paragraphs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.about_paragraphs_id_seq', 3, true);


--
-- Name: about_sdg_badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.about_sdg_badges_id_seq', 3, true);


--
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.announcements_id_seq', 5, true);


--
-- Name: bod_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.bod_members_id_seq', 14, true);


--
-- Name: bod_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.bod_roles_id_seq', 5, true);


--
-- Name: contact_office_hours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.contact_office_hours_id_seq', 3, true);


--
-- Name: feature_flags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.feature_flags_id_seq', 71, true);


--
-- Name: footer_legal_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.footer_legal_links_id_seq', 3, true);


--
-- Name: footer_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.footer_services_id_seq', 6, true);


--
-- Name: footer_trust_badges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.footer_trust_badges_id_seq', 3, true);


--
-- Name: hero_slides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.hero_slides_id_seq', 5, true);


--
-- Name: nav_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.nav_items_id_seq', 38, true);


--
-- Name: page_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.page_stats_id_seq', 14, true);


--
-- Name: site_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.site_config_id_seq', 83, true);


--
-- Name: social_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kashee
--

SELECT pg_catalog.setval('public.social_links_id_seq', 5, true);


--
-- Name: about_districts about_districts_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.about_districts
    ADD CONSTRAINT about_districts_pkey PRIMARY KEY (id);


--
-- Name: about_news_items about_news_items_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.about_news_items
    ADD CONSTRAINT about_news_items_pkey PRIMARY KEY (id);


--
-- Name: about_paragraphs about_paragraphs_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.about_paragraphs
    ADD CONSTRAINT about_paragraphs_pkey PRIMARY KEY (id);


--
-- Name: about_sdg_badges about_sdg_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.about_sdg_badges
    ADD CONSTRAINT about_sdg_badges_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: application_status_history application_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.application_status_history
    ADD CONSTRAINT application_status_history_pkey PRIMARY KEY (id);


--
-- Name: bod_members bod_members_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.bod_members
    ADD CONSTRAINT bod_members_pkey PRIMARY KEY (id);


--
-- Name: bod_roles bod_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.bod_roles
    ADD CONSTRAINT bod_roles_pkey PRIMARY KEY (id);


--
-- Name: bod_roles bod_roles_role_key_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.bod_roles
    ADD CONSTRAINT bod_roles_role_key_key UNIQUE (role_key);


--
-- Name: careers_benefits careers_benefits_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.careers_benefits
    ADD CONSTRAINT careers_benefits_pkey PRIMARY KEY (id);


--
-- Name: careers_hiring_process careers_hiring_process_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.careers_hiring_process
    ADD CONSTRAINT careers_hiring_process_pkey PRIMARY KEY (id);


--
-- Name: careers_hiring_process careers_hiring_process_step_number_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.careers_hiring_process
    ADD CONSTRAINT careers_hiring_process_step_number_key UNIQUE (step_number);


--
-- Name: careers_testimonials careers_testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.careers_testimonials
    ADD CONSTRAINT careers_testimonials_pkey PRIMARY KEY (id);


--
-- Name: careers_values careers_values_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.careers_values
    ADD CONSTRAINT careers_values_pkey PRIMARY KEY (id);


--
-- Name: contact_faq_items contact_faq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.contact_faq_items
    ADD CONSTRAINT contact_faq_items_pkey PRIMARY KEY (id);


--
-- Name: contact_office_hours contact_office_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.contact_office_hours
    ADD CONSTRAINT contact_office_hours_pkey PRIMARY KEY (id);


--
-- Name: contact_offices contact_offices_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.contact_offices
    ADD CONSTRAINT contact_offices_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: departments departments_name_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key UNIQUE (name);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: departments departments_slug_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_slug_key UNIQUE (slug);


--
-- Name: feature_flags feature_flags_key_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_key_key UNIQUE (key);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: footer_legal_links footer_legal_links_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.footer_legal_links
    ADD CONSTRAINT footer_legal_links_pkey PRIMARY KEY (id);


--
-- Name: footer_services footer_services_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.footer_services
    ADD CONSTRAINT footer_services_pkey PRIMARY KEY (id);


--
-- Name: footer_trust_badges footer_trust_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.footer_trust_badges
    ADD CONSTRAINT footer_trust_badges_pkey PRIMARY KEY (id);


--
-- Name: gallery_categories gallery_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.gallery_categories
    ADD CONSTRAINT gallery_categories_pkey PRIMARY KEY (value);


--
-- Name: gallery_items gallery_items_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_pkey PRIMARY KEY (id);


--
-- Name: hero_slides hero_slides_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.hero_slides
    ADD CONSTRAINT hero_slides_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_job_id_email_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_id_email_key UNIQUE (job_id, email);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: job_openings job_openings_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.job_openings
    ADD CONSTRAINT job_openings_pkey PRIMARY KEY (id);


--
-- Name: job_openings job_openings_slug_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.job_openings
    ADD CONSTRAINT job_openings_slug_key UNIQUE (slug);


--
-- Name: nav_items nav_items_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.nav_items
    ADD CONSTRAINT nav_items_pkey PRIMARY KEY (id);


--
-- Name: page_heroes page_heroes_page_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.page_heroes
    ADD CONSTRAINT page_heroes_page_key UNIQUE (page);


--
-- Name: page_heroes page_heroes_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.page_heroes
    ADD CONSTRAINT page_heroes_pkey PRIMARY KEY (id);


--
-- Name: page_stats page_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.page_stats
    ADD CONSTRAINT page_stats_pkey PRIMARY KEY (id);


--
-- Name: page_stats page_stats_section_stat_key_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.page_stats
    ADD CONSTRAINT page_stats_section_stat_key_key UNIQUE (section, stat_key);


--
-- Name: site_config site_config_key_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.site_config
    ADD CONSTRAINT site_config_key_key UNIQUE (key);


--
-- Name: site_config site_config_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.site_config
    ADD CONSTRAINT site_config_pkey PRIMARY KEY (id);


--
-- Name: social_links social_links_pkey; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_pkey PRIMARY KEY (id);


--
-- Name: social_links social_links_platform_key; Type: CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_platform_key UNIQUE (platform);


--
-- Name: idx_announcements_active; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_announcements_active ON public.announcements USING btree (section, sort_order) WHERE (is_active = true);


--
-- Name: idx_applications_email; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_applications_email ON public.job_applications USING btree (email);


--
-- Name: idx_applications_job_status; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_applications_job_status ON public.job_applications USING btree (job_id, status, submitted_at DESC);


--
-- Name: idx_applications_status; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_applications_status ON public.job_applications USING btree (status, submitted_at DESC);


--
-- Name: idx_contact_submissions_email; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_contact_submissions_email ON public.contact_submissions USING btree (email, submitted_at DESC);


--
-- Name: idx_contact_submissions_status; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_contact_submissions_status ON public.contact_submissions USING btree (status, submitted_at DESC);


--
-- Name: idx_gallery_items_category; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_gallery_items_category ON public.gallery_items USING btree (category, is_active, sort_order, shot_date DESC);


--
-- Name: idx_gallery_items_created; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_gallery_items_created ON public.gallery_items USING btree (created_at DESC, is_active);


--
-- Name: idx_gallery_items_featured; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_gallery_items_featured ON public.gallery_items USING btree (featured, is_active) WHERE (featured = true);


--
-- Name: idx_gallery_items_tags; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_gallery_items_tags ON public.gallery_items USING gin (tags);


--
-- Name: idx_job_openings_dept; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_job_openings_dept ON public.job_openings USING btree (department_id, is_active, posted_at DESC);


--
-- Name: idx_job_openings_feat; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_job_openings_feat ON public.job_openings USING btree (is_featured, is_active) WHERE (is_featured = true);


--
-- Name: idx_job_openings_tags; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_job_openings_tags ON public.job_openings USING gin (tags);


--
-- Name: idx_nav_items_parent; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_nav_items_parent ON public.nav_items USING btree (parent_id, sort_order) WHERE (is_active = true);


--
-- Name: idx_social_links_sections; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_social_links_sections ON public.social_links USING gin (sections);


--
-- Name: idx_status_history_app; Type: INDEX; Schema: public; Owner: kashee
--

CREATE INDEX idx_status_history_app ON public.application_status_history USING btree (application_id, changed_at DESC);


--
-- Name: vw_header_nav _RETURN; Type: RULE; Schema: public; Owner: kashee
--

CREATE OR REPLACE VIEW public.vw_header_nav AS
 SELECT p.id,
    p.label,
    p.href,
    p.sort_order,
    p.is_active,
    p.open_in_new,
    COALESCE(json_agg(json_build_object('id', c.id, 'label', c.label, 'href', c.href, 'description', c.description, 'sort_order', c.sort_order, 'open_in_new', c.open_in_new) ORDER BY c.sort_order) FILTER (WHERE (c.id IS NOT NULL)), '[]'::json) AS children
   FROM (public.nav_items p
     LEFT JOIN public.nav_items c ON (((c.parent_id = p.id) AND (c.is_active = true))))
  WHERE ((p.parent_id IS NULL) AND (p.is_active = true))
  GROUP BY p.id
  ORDER BY p.sort_order;


--
-- Name: bod_members bod_members_updated_at; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER bod_members_updated_at BEFORE UPDATE ON public.bod_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: page_heroes page_heroes_updated_at; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER page_heroes_updated_at BEFORE UPDATE ON public.page_heroes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: careers_benefits trg_careers_benefits_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_careers_benefits_upd BEFORE UPDATE ON public.careers_benefits FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: careers_testimonials trg_careers_testimonials_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_careers_testimonials_upd BEFORE UPDATE ON public.careers_testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: careers_values trg_careers_values_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_careers_values_upd BEFORE UPDATE ON public.careers_values FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: contact_faq_items trg_contact_faq_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_contact_faq_upd BEFORE UPDATE ON public.contact_faq_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: contact_offices trg_contact_offices_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_contact_offices_upd BEFORE UPDATE ON public.contact_offices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: contact_submissions trg_contact_submissions_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_contact_submissions_upd BEFORE UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: departments trg_departments_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_departments_upd BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: feature_flags trg_feature_flags_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_feature_flags_upd BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: gallery_items trg_gallery_items_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_gallery_items_upd BEFORE UPDATE ON public.gallery_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: hero_slides trg_hero_slides_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_hero_slides_upd BEFORE UPDATE ON public.hero_slides FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: careers_hiring_process trg_hiring_process_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_hiring_process_upd BEFORE UPDATE ON public.careers_hiring_process FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: job_applications trg_job_applications_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_job_applications_upd BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: job_openings trg_job_openings_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_job_openings_upd BEFORE UPDATE ON public.job_openings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: page_heroes trg_page_heroes_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_page_heroes_upd BEFORE UPDATE ON public.page_heroes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: page_stats trg_page_stats_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_page_stats_upd BEFORE UPDATE ON public.page_stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: site_config trg_site_config_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_site_config_upd BEFORE UPDATE ON public.site_config FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: social_links trg_social_links_upd; Type: TRIGGER; Schema: public; Owner: kashee
--

CREATE TRIGGER trg_social_links_upd BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: application_status_history application_status_history_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.application_status_history
    ADD CONSTRAINT application_status_history_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.job_applications(id) ON DELETE CASCADE;


--
-- Name: bod_members bod_members_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.bod_members
    ADD CONSTRAINT bod_members_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.bod_roles(id) ON DELETE SET NULL;


--
-- Name: contact_office_hours contact_office_hours_office_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.contact_office_hours
    ADD CONSTRAINT contact_office_hours_office_id_fkey FOREIGN KEY (office_id) REFERENCES public.contact_offices(id) ON DELETE CASCADE;


--
-- Name: contact_submissions contact_submissions_office_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_office_id_fkey FOREIGN KEY (office_id) REFERENCES public.contact_offices(id) ON DELETE SET NULL;


--
-- Name: footer_services footer_services_nav_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.footer_services
    ADD CONSTRAINT footer_services_nav_item_id_fkey FOREIGN KEY (nav_item_id) REFERENCES public.nav_items(id) ON DELETE SET NULL;


--
-- Name: gallery_items gallery_items_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_category_fkey FOREIGN KEY (category) REFERENCES public.gallery_categories(value);


--
-- Name: job_applications job_applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.job_openings(id);


--
-- Name: job_openings job_openings_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.job_openings
    ADD CONSTRAINT job_openings_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: nav_items nav_items_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kashee
--

ALTER TABLE ONLY public.nav_items
    ADD CONSTRAINT nav_items_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.nav_items(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict DoEBhj5OmsVgzA5dfMDaAA3o5miJGRIjEr9fGzvSDyfr2e8QV8bv9EBdhRPQDAv

