// ── lib/fetchBodData.ts ───────────────────────────────────────
import type { BodData } from "@/types/bod";
import { getBaseUrl } from "../db";

const FALLBACK: BodData = {
    hero: {
        label: "Leadership",
        headline: "Board of Directors",
        subheadline: "Meet the visionary leaders guiding Kashee Milk Producer Company — committed to empowering women farmers across Eastern Uttar Pradesh.",
        banner_image_url: "https://www.kasheemilk.com/wp-content/uploads/2025/01/gallerybanner-.jpg",
    },
    chairman: null,
    members: [
    ],
    config: {
        bod_section_eyebrow: "Our Leadership",
        bod_section_title: "Board of Directors",
        bod_section_subtitle: "Meet the dedicated leaders steering Kashee Milk towards a more empowered and sustainable future.",
        bod_chairman_label: "Chairman",
        bod_appointed_prefix: "Appointed",
        bod_carousel_speed_ms: 5000,
        bod_cards_per_view: 3,
    },
    featureFlags: {
        "bod.chairman_hero": true,
        "bod.auto_carousel": true,
        "bod.show_appointed_date": true,
        "bod.show_qualification": false,
        "bod.show_linkedin": false,
        "bod.show_district": false,
        "bod.bio_expandable": true,
    },
};

export async function fetchBodData(): Promise<BodData> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/bod`, {
            next: { tags: ["bod"], revalidate: 60 },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    } catch (e) {
        console.warn("[fetchBodData] fallback:", e);
        return FALLBACK;
    }
}