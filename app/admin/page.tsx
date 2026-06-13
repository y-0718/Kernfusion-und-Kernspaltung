import Link from "next/link";
import { Image as ImageIcon, ScrollText, Settings, Tv } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminUser } from "@/lib/auth/requireAdmin";
import { getActivePresentation, getAdminSlides, getMediaAssets, getAllSources } from "@/lib/slides/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { user } = await requireAdminUser();
  const presentation = await getActivePresentation();
  const [slides, media, sources] = presentation ? await Promise.all([getAdminSlides(presentation.id), getMediaAssets(), getAllSources()]) : [[], [], []];

  return (
    <AdminShell userEmail={user.email}>
      <div className="grid gap-6">
        <section className="rounded-md border border-[#0033A0]/10 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0033A0]">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold">Präsentations-CMS</h1>
          <p className="mt-2 max-w-2xl text-slate-500">
            Hier verwaltest du Slides, Medien, Quellen und Einstellungen, ohne den Code zu ändern.
          </p>
        </section>
        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCard href="/admin/slides" icon={<Tv />} label="Slides" value={slides.length} />
          <DashboardCard href="/admin/media" icon={<ImageIcon />} label="Medien" value={media.length} />
          <DashboardCard href="/admin/sources" icon={<ScrollText />} label="Quellen" value={sources.length} />
          <DashboardCard href="/admin/settings" icon={<Settings />} label="Einstellungen" value="CMS" />
        </div>
      </div>
    </AdminShell>
  );
}

function DashboardCard({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-md border border-[#0033A0]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between text-[#0033A0]">
        {icon}
        <span className="text-2xl font-semibold">{value}</span>
      </div>
      <p className="mt-5 text-sm font-semibold text-[#1A1A1A]">{label}</p>
    </Link>
  );
}
