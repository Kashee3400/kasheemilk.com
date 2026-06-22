import ResourceManager from "@/components/admin/ResourceManager";
import { getAdminModuleData } from "@/lib/admin/resources";

export default async function AdminNavigationPage() {
  const data = await getAdminModuleData("navigation");
  if (!data) return null;
  return <ResourceManager initialData={data} />;
}
