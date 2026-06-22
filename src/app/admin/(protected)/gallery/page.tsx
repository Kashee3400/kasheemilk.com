import ResourceManager from "@/components/admin/ResourceManager";
import { getAdminModuleData } from "@/lib/admin/resources";

export default async function AdminGalleryPage() {
  const data = await getAdminModuleData("gallery");
  if (!data) return null;
  return <ResourceManager initialData={data} />;
}
