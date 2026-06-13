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
        <h1 className="text-5xl font-semibold md:text-7xl">{slide.title}</h1>
        {content.body ? <p className="mt-5 max-w-3xl text-xl leading-8 text-[#1A1A1A]/70">{content.body}</p> : null}
        <ol className="mt-10 grid max-h-[58vh] gap-4 overflow-y-auto pr-2 text-left">
          {sources.length ? (
            sources.map((source, index) => (
              <li key={source.id} className="rounded-md border border-[#0033A0]/10 bg-white p-4 shadow-sm">
                <span className="font-semibold text-[#0033A0]">[{index + 1}] </span>
                <span className="font-semibold">{source.title}</span>
                {source.author ? <span>, {source.author}</span> : null}
                {source.publisher ? <span>, {source.publisher}</span> : null}
                {source.published_at ? <span>, {new Date(source.published_at).getFullYear()}</span> : null}
                {source.url ? (
                  <a className="ml-2 break-all text-[#0033A0] underline decoration-[#0033A0]/25" href={source.url}>
                    {source.url}
                  </a>
                ) : null}
              </li>
            ))
          ) : (
            <li className="rounded-md border border-dashed border-[#0033A0]/20 p-6 text-[#1A1A1A]/65">
              Noch keine Quellen hinterlegt. Ergänze sie im Admin-Bereich bei den jeweiligen Slides.
            </li>
          )}
        </ol>
      </div>
    </SlideShell>
  );
}
