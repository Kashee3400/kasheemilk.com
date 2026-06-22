
const FALLBACK: HeaderData = {
    navItems:      [],
    announcements: [],
    socialLinks:   [],
    config:        {},
    featureFlags:  {},
};

export async function fetchHeaderData(): Promise<HeaderData> {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ??
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

        const res = await fetch(`${baseUrl}/api/header`, {
            next: { tags: ["header"], revalidate: 60 },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } catch (e) {
        console.warn("[fetchHeaderData] Using fallback:", e);
        return FALLBACK;
    }
}


const FOOTER_FALLBACK: FooterData = {
    stats:       [],
    services:    [],
    trustBadges: [],
    legalLinks:  [],
    socialLinks: [],
    navItems:    [],
    config:      {},
    featureFlags: {},
};

export async function fetchFooterData(): Promise<FooterData> {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ??
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

        const res = await fetch(`${baseUrl}/api/footer`, {
            next: { tags: ["footer"], revalidate: 60 },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } catch (e) {
        console.warn("[fetchFooterData] Using fallback:", e);
        return FOOTER_FALLBACK;
    }
}


// ─── lib/fetchHeroData.ts ─────────────────────────────────────────────────────
// No schema changes needed in this fetch helper.


const HERO_FALLBACK: HeroData = {
    slides:      [],
    config:      {},
    featureFlags: {},
};

export async function fetchHeroData(): Promise<HeroData> {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ??
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

        const res = await fetch(`${baseUrl}/api/hero`, {
            next: { tags: ["hero"], revalidate: 60 },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } catch (e) {
        console.warn("[fetchHeroData] Using fallback:", e);
        return HERO_FALLBACK;
    }
}


// ─── lib/fetchStatsData.ts ────────────────────────────────────────────────────
// ⚠️  SCHEMA CHANGE — column rename in stats items:
//
//   OLD shape (stats_items):
//     { value: number, suffix: string, label: string, icon: string }
//     → your counter read: stat.value
//
//   NEW shape (page_stats, section='home'):
//     { numeric_value: number, display_value: string, suffix: string, label: string, icon: string }
//     → your counter should read: stat.numeric_value  (count-up target)
//     → final display string:     stat.display_value  (e.g. "45,000+")
//
// If your StatsCounter component still reads stat.value, update it to stat.numeric_value.


const STATS_FALLBACK: StatsData = {
    stats: [
        { stat_key: "members",   display_value: "45,000+", numeric_value: 45000,  suffix: "+", label: "Total Enrolled Members", icon: "👥", sort_order: 10 },
        { stat_key: "villages",  display_value: "1,000+",  numeric_value: 1000,   suffix: "+", label: "Total Villages",         icon: "🏘️", sort_order: 20 },
        { stat_key: "milk",      display_value: "2,00,000+",numeric_value: 200000,suffix: "+", label: "Milk Qty (Litres/Day)",  icon: "🥛", sort_order: 30 },
        { stat_key: "districts", display_value: "7",        numeric_value: 7,      suffix: "",  label: "Districts Covered",      icon: "📍", sort_order: 40 },
    ],
    config: {
        stats_eyebrow:    "Our Impact",
        stats_heading:    "Progress in Numbers",
        stats_accent:     "Numbers",
        stats_subtext:    "Every figure represents a life touched, a family strengthened, and a future secured across Eastern UP.",
        stats_counter_ms: 2000,
    },
    featureFlags: {
        "stats.animated_counter": true,
        "stats.scroll_snap":      true,
        "stats.show_icon":        true,
        "stats.show_divider":     true,
        "stats.offset_alt_cards": true,
    },
};

export async function fetchStatsData(): Promise<StatsData> {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ??
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

        const res = await fetch(`${baseUrl}/api/stats`, {
            next: { tags: ["stats"], revalidate: 60 },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } catch (e) {
        console.warn("[fetchStatsData] Using fallback:", e);
        return STATS_FALLBACK;
    }
}


// ─── lib/fetchAboutData.ts ────────────────────────────────────────────────────
// No schema changes — about_* tables are identical in the new schema.

import { AboutData, FooterData, HeaderData, HeroData, StatsData } from "@/types/db";

const ABOUT_FALLBACK: AboutData = {
    paragraphs: [
        { id: 1, content: "Kashee Milk Producer Company Limited, Varanasi, was incorporated in November 2021 with the goal of providing a sustainable livelihood to women milk producers through dairy farming.", sort_order: 10 },
        { id: 2, content: "Recognizing the organization's commendable efforts, the State Rural Livelihood Mission (SRLM) approved the addition of two more districts — Bhadohi and Varanasi — starting in 2024. Currently, the company operates in <strong>seven districts</strong> of Eastern Uttar Pradesh.", sort_order: 20 },
        { id: 3, content: 'The company commenced business operations from <strong>March 2022</strong> under the project "Dairy Value Chain Development in Eastern Uttar Pradesh" with financial assistance from UPSRLM and technical support from NDDB Dairy Services.', sort_order: 30 },
    ],
    districts: [
        { id: 1, name: "Ballia",    href: null, sort_order: 10 },
        { id: 2, name: "Chandauli", href: null, sort_order: 20 },
        { id: 3, name: "Ghazipur",  href: null, sort_order: 30 },
        { id: 4, name: "Mirzapur",  href: null, sort_order: 40 },
        { id: 5, name: "Sonbhadra", href: null, sort_order: 50 },
        { id: 6, name: "Bhadohi",   href: null, sort_order: 60 },
        { id: 7, name: "Varanasi",  href: null, sort_order: 70 },
    ],
    sdgBadges: [
        { id: 1, image_url: "https://www.kasheemilk.com/wp-content/uploads/2023/10/OIP.jpg",           label: "No Poverty",    href: null, sort_order: 10 },
        { id: 2, image_url: "https://www.kasheemilk.com/wp-content/uploads/2023/10/climate-action.jpg", label: "Climate Action", href: null, sort_order: 20 },
        { id: 3, image_url: "https://www.kasheemilk.com/wp-content/uploads/2023/10/goodhealth.jpg",     label: "Good Health",   href: null, sort_order: 30 },
    ],
    newsItems: [
        { id: 1, title: "Kashee Milk Producer Organization to achieve turnover of Rs 200 cr by FY24", image_url: "https://www.kasheemilk.com/wp-content/uploads/2023/11/The-Economic-Times.jpg", href: "#", source: "The Economic Times", sort_order: 10 },
        { id: 2, title: "समृद्धि की अनूठी मिसाल पेश कर रहीं KMPO से जुड़ी महिलाएं",                  image_url: "https://www.kasheemilk.com/wp-content/uploads/2023/11/punjab-kesari.jpg",       href: "#", source: "Punjab Kesari",      sort_order: 20 },
        { id: 3, title: "KMPO से जुड़ी 2000 महिलाएं डेढ़ साल के भीतर बनी लाखों की मालकिन",           image_url: "https://www.kasheemilk.com/wp-content/uploads/2023/11/ETV-Bharat.jpg",          href: "#", source: "ETV Bharat",         sort_order: 30 },
    ],
    config: {
        about_section_label: "Who We Are",
        about_section_title: "A Story of Empowerment & Purpose",
        about_subtitle:      "Kashee Milk Producer Company Limited, Varanasi, was incorporated in November 2021.",
        about_cta_label:     "Learn More",
        about_cta_href:      "/about-us",
        news_section_label:  "Media",
        news_section_title:  "News & Events",
        news_view_all_href:  "/category/news-and-updates",
        news_footer_href:    "/category/news-and-updates",
        news_footer_label:   "All news & events",
        news_ticker_speed_s: 30,
    },
    featureFlags: {
        "about.districts":       true,
        "about.districts_scroll":true,
        "about.sdg_badges":      true,
        "about.sdg_scroll":      true,
        "about.news_ticker":     true,
        "about.news_live_dot":   true,
        "about.news_auto_scroll":true,
        "about.news_pause_hover":true,
        "about.cta_button":      true,
    },
};

export async function fetchAboutData(): Promise<AboutData> {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ??
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

        const res = await fetch(`${baseUrl}/api/about`, {
            next: { tags: ["about"], revalidate: 60 },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } catch (e) {
        console.warn("[fetchAboutData] Using fallback:", e);
        return ABOUT_FALLBACK;
    }
}