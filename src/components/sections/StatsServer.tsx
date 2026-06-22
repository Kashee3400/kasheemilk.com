// ── components/StatsServer.tsx ────────────────────────────────
import { fetchStatsData } from "@/lib/helper/fetch_data";
import { StatsSection } from "./StatsSection";

export default async function StatsServer() {
    const data = await fetchStatsData();
    return <StatsSection data={data} />;
}