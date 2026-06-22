import ResourceManager from "@/components/admin/ResourceManager";
import { getAdminModuleData } from "@/lib/admin/resources";

export default async function AdminFlagsPage() {
  const data = await getAdminModuleData("flags");
  if (!data) return null;
  return <ResourceManager initialData={data} />;
}
