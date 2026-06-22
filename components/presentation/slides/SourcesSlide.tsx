import type { PublicSlide, SlideContent, SlideDesign, SlideSource } from "@/lib/slides/types";
import { SlideShell } from "@/components/presentation/slides/SlideShell";

type Props = {
  slide: PublicSlide;
  content: SlideContent;
  design: SlideDesign;
  sources: (SlideSource & { presentation_id?: string; slide_sort_order?: number })[];
  index: number;
  total: number;
};

export function SourcesSlide({ slide, content, design, sources }: Props) {
  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-5xl font-semibold leading-[0.96] md:text-7xl">{slide.title}</h1>
        {content.body ? <p className="mt-5 max-w-3xl text-lg leading-8 text-[#1A1A1A]/68">{content.body}</p> : null}
        <ol className="mt-10 grid max-h-[58vh] overflow-y-auto border-y border-[#0033A0]/12 pr-2 text-left">
          {sources.length ? sources.map((source, index) => (
            <li key={source.id} className="grid gap-2 border-b border-[#0033A0]/10 py-5 last:border-b-0 md:grid-cols-[70px_1fr] md:gap-5">
              <span className="font-mono text-sm font-semibold text-[#0033A0]">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <span className="text-lg font-semibold">{source.title}</span>
                <p className="mt-1 text-sm text-[#1A1A1A]/62">
                  {[source.author, source.publisher, source.published_at ? new Date(source.published_at).getFullYear() : null].filter(Boolean).join(" · ")}
                </p>
                {source.url ? <a className="mt-2 block break-all text-sm text-[#0033A0] underline decoration-[#0033A0]/20 underline-offset-4" href={source.url}>{source.url}</a> : null}
              </div>
            </li>
          )) : (
            <li className="grid min-h-48 place-items-center py-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto h-20 w-px bg-gradient-to-b from-[#0033A0] to-[#FFB300]" />
                <p className="mt-5 text-lg text-[#1A1A1A]/62">Quellen werden hier automatisch als wissenschaftliches Verzeichnis zusammengestellt.</p>
              </div>
            </li>
          )}
        </ol>
      </div>
    </SlideShell>
  );
}
