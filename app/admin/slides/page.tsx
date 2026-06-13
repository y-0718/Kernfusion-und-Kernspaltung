import { AdminShell } from "@/components/admin/AdminShell";
import { SlideList } from "@/components/admin/SlideList";
import { requireAdminUser } from "@/lib/auth/requireAdmin";
import { getActivePresentation, getAdminSlides } from "@/lib/slides/queries";

export const dynamic = "force-dynamic";

export default async function AdminSlidesPage() {
  const { user } = await requireAdminUser();
  const presentation = await getActivePresentation();
  const slides = presentation ? await getAdminSlides(presentation.id) : [];

  return (
    <AdminShell userEmail={user.email}>
      {presentation ? (
        <SlideList slides={slides} presentationId={presentation.id} />
      ) : (
        <p className="rounded-md bg-white p-6 text-slate-600">Keine aktive Präsentation gefunden. Importiere zuerst die Seed-Daten.</p>
      )}
    </AdminShell>
  );
}
