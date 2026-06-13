import { AdminShell } from "@/components/admin/AdminShell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { requireAdminUser } from "@/lib/auth/requireAdmin";
import { getMediaAssets } from "@/lib/slides/queries";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const { user } = await requireAdminUser();
  const assets = await getMediaAssets();

  return (
    <AdminShell userEmail={user.email}>
      <MediaLibrary assets={assets} />
    </AdminShell>
  );
}
