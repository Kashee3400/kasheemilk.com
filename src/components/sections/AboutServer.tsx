// ── components/AboutServer.tsx ────────────────────────────────
// React Server Component — fetches about data, passes to client.
// Usage in page.tsx: import AboutServer from "@/components/AboutServer"

import { fetchAboutData } from "@/lib/helper/fetch_data";
import { AboutSection } from "./AboutSection";

export default async function AboutServer() {
    const data = await fetchAboutData();
    return <AboutSection data={data} />;
}