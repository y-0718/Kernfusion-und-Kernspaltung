import { PresentationDeck } from "@/components/presentation/PresentationDeck";
import { getActivePresentation, getPresentationSettings, getPublicSlides, getPublicSources } from "@/lib/slides/queries";
import { presentationJsonLd } from "@/lib/seo/jsonLd";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const result = await getHomeData();

  if (!result.ok) {
    return <SetupNotice message={result.message} />;
  }

  const { presentation, slides, sources, settings } = result;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(presentationJsonLd(presentation, slides)) }} />
      <PresentationDeck slides={slides} sources={sources} settings={settings} />
    </>
  );
}

async function getHomeData() {
  try {
    const presentation = await getActivePresentation();
    if (!presentation) return { ok: false as const, message: undefined };

    const [slides, sources, settings] = await Promise.all([
      getPublicSlides(presentation.id),
      getPublicSources(presentation.id),
      getPresentationSettings(presentation.id)
    ]);

    return { ok: true as const, presentation, slides, sources, settings };
  } catch (error) {
    return { ok: false as const, message: error instanceof Error ? error.message : "Die Präsentation konnte nicht geladen werden." };
  }
}

function SetupNotice({ message }: { message?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 text-center text-[#1A1A1A]">
      <section className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0033A0]">Einrichtung erforderlich</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-6xl">Die Präsentation ist bereit für Supabase.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Trage die Supabase-Zugangsdaten in `.env.local` ein und importiere die SQL-Dateien aus dem Ordner `supabase`.
        </p>
        {message ? <p className="mt-4 rounded-md bg-[#EEF4FF] px-4 py-3 text-sm text-[#0033A0]">{message}</p> : null}
      </section>
    </main>
  );
}
