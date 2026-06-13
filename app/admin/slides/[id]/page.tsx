import { AdminShell } from "@/components/admin/AdminShell";
import { SlideEditor } from "@/components/admin/SlideEditor";
import { requireAdminUser } from "@/lib/auth/requireAdmin";
import { getActivePresentation, getAdminSlide, getMediaAssets } from "@/lib/slides/queries";

export const dynamic = "force-dynamic";

export default async function EditSlidePage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await requireAdminUser();
  const { id } = await params;
  const [presentation, slide, mediaAssets] = await Promise.all([getActivePresentation(), getAdminSlide(id), getMediaAssets()]);

  return (
    <AdminShell userEmail={user.email}>
      {presentation ? <SlideEditor presentationId={presentation.id} slide={slide} mediaAssets={mediaAssets} /> : <p>Keine aktive Präsentation gefunden.</p>}
    </AdminShell>
  );
}
