import HeroManager from "@/components/admin/HeroManager";
import { getAdminHeroData } from "@/lib/admin/hero";

export default async function AdminHeroPage() {
  const data = await getAdminHeroData();
  return <HeroManager initialData={data} />;
}
