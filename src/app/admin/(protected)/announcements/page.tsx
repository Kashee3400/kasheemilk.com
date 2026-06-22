import ResourceManager from "@/components/admin/ResourceManager";
import { getAdminModuleData } from "@/lib/admin/resources";

export default async function AdminAnnouncementsPage() {
  const data = await getAdminModuleData("announcements");
  if (!data) return null;
  return <ResourceManager initialData={data} />;
}
