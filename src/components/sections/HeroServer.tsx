// ── components/HeroServer.tsx ─────────────────────────────────
// React Server Component — fetches hero data server-side,
// passes to HeroSlider client component.
// Usage in page.tsx:  import HeroServer from "@/components/HeroServer"

import { fetchHeroData } from "@/lib/helper/fetch_data";
import { HeroSlider } from "./HeroSlider";

export default async function HeroServer() {
    const data = await fetchHeroData();
    return <HeroSlider data={data} />;
}