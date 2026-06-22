import ResourceManager from "@/components/admin/ResourceManager";
import { getAdminModuleData } from "@/lib/admin/resources";

export default async function AdminBoardPage() {
  const data = await getAdminModuleData("board");
  if (!data) return null;
  return <ResourceManager initialData={data} />;
}
