// ── components/FooterServer.tsx ──────────────────────────────
// React Server Component — fetches footer data, passes to client component.
// Use this in layout.tsx, not KasheeFooter directly.

import { fetchFooterData } from "@/lib/helper/fetch_data";
import KasheeFooter from "./Footer";

export default async function FooterServer() {
    const data = await fetchFooterData();
    return <KasheeFooter data={data} />;
}