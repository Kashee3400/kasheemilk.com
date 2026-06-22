// ── components/HeaderServer.tsx ──────────────────────────────
// React Server Component — fetches header data from DB/API
// and injects it into the client KasheeHeader.
// Import THIS in your layout.tsx, not KasheeHeader directly.

import { fetchHeaderData } from "@/lib/helper/fetch_data";
import KasheeHeader from "./Header";

export default async function HeaderServer() {
    const data = await fetchHeaderData();
    return <KasheeHeader data={data} />;
}