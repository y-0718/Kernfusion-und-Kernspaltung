import { AdminShell } from "@/components/admin/AdminShell";
import { SlideEditor } from "@/components/admin/SlideEditor";
import { requireAdminUser } from "@/lib/auth/requireAdmin";
import { getActivePresentation, getMediaAssets } from "@/lib/slides/queries";

export const dynamic = "force-dynamic";

export default async function NewSlidePage() {
  const { user } = await requireAdminUser();
  const presentation = await getActivePresentation();
  const mediaAssets = await getMediaAssets();

  return (
    <AdminShell userEmail={user.email}>
      {presentation ? <SlideEditor presentationId={presentation.id} mediaAssets={mediaAssets} /> : <p>Keine aktive Präsentation gefunden.</p>}
    </AdminShell>
  );
}
