import ResourceManager from "@/components/admin/ResourceManager";
import { getAdminModuleData } from "@/lib/admin/resources";

export default async function AdminPagesPage() {
  const data = await getAdminModuleData("pages");
  if (!data) return null;
  return <ResourceManager initialData={data} />;
}
