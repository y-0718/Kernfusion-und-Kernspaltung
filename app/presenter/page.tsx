import { PresenterView } from "@/components/presenter/PresenterView";
import { requireAdminUser } from "@/lib/auth/requireAdmin";
import { getActivePresentation, getAdminSlides, getMediaAssets } from "@/lib/slides/queries";

export const dynamic = "force-dynamic";

export default async function PresenterPage() {
  await requireAdminUser();
  const presentation = await getActivePresentation();

  if (!presentation) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F7FAFF] px-6 text-center">
        <section className="rounded-md border border-[#0033A0]/10 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Keine aktive Präsentation gefunden.</h1>
          <p className="mt-2 text-slate-600">Importiere zuerst die Präsentationsdaten in Supabase.</p>
        </section>
      </main>
    );
  }

  const [slides, mediaAssets] = await Promise.all([getAdminSlides(presentation.id), getMediaAssets()]);
  const publishedSlides = slides.filter((slide) => slide.status === "published");

  return <PresenterView slides={publishedSlides} mediaAssets={mediaAssets} />;
}
