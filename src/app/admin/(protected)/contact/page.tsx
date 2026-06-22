import ResourceManager from "@/components/admin/ResourceManager";
import { getAdminModuleData } from "@/lib/admin/resources";

export default async function AdminContactPage() {
  const data = await getAdminModuleData("contact");
  if (!data) return null;
  return <ResourceManager initialData={data} />;
}
