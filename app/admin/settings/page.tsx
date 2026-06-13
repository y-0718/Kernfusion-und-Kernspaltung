import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdminUser } from "@/lib/auth/requireAdmin";
import { getActivePresentation, getPresentationSettings } from "@/lib/slides/queries";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { user } = await requireAdminUser();
  const presentation = await getActivePresentation();
  const settings = presentation ? await getPresentationSettings(presentation.id) : null;

  return (
    <AdminShell userEmail={user.email}>
      {settings ? <SettingsForm settings={settings} /> : <p className="rounded-md bg-white p-6">Keine Einstellungen gefunden.</p>}
    </AdminShell>
  );
}
