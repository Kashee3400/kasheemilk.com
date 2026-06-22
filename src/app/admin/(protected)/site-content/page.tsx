import ResourceManager from "@/components/admin/ResourceManager";
import { getAdminModuleData } from "@/lib/admin/resources";

export default async function AdminSiteContentPage() {
  const data = await getAdminModuleData("site-content");
  if (!data) return null;
  return <ResourceManager initialData={data} />;
}
