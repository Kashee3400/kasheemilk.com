import ResourceManager from "@/components/admin/ResourceManager";
import { getAdminModuleData } from "@/lib/admin/resources";

export default async function AdminCareersPage() {
  const data = await getAdminModuleData("careers");
  if (!data) return null;
  return <ResourceManager initialData={data} />;
}
