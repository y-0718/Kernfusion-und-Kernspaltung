import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminUser } from "@/lib/auth/requireAdmin";
import { getAllSources } from "@/lib/slides/queries";

export const dynamic = "force-dynamic";

export default async function AdminSourcesPage() {
  const { user } = await requireAdminUser();
  const sources = await getAllSources();

  return (
    <AdminShell userEmail={user.email}>
      <section className="rounded-md border border-[#0033A0]/10 bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold">Quellenübersicht</h1>
        <p className="mt-1 text-sm text-slate-500">Quellen werden pro Slide bearbeitet. Diese Seite zeigt alle vorhandenen Quellen gesammelt.</p>
        <div className="mt-6 grid gap-3">
          {sources.map((source) => (
            <article key={source.id} className="rounded-md border border-[#0033A0]/10 p-4">
              <p className="font-semibold">{source.title}</p>
              <p className="mt-1 text-sm text-slate-500">{[source.author, source.publisher, source.url].filter(Boolean).join(" · ")}</p>
            </article>
          ))}
          {!sources.length ? <p className="text-slate-500">Noch keine Quellen angelegt.</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}
