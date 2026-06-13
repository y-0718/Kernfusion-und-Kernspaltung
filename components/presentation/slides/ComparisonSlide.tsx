import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { SlideShell } from "@/components/presentation/slides/SlideShell";

type Props = {
  slide: PublicSlide;
  content: SlideContent;
  design: SlideDesign;
  index: number;
  total: number;
};

export function ComparisonSlide({ slide, content, design }: Props) {
  const accent = design.accentColor || "#0033A0";

  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-semibold md:text-7xl">{slide.title}</h1>
          {slide.subtitle ? <p className="mt-5 text-2xl opacity-75">{slide.subtitle}</p> : null}
          {content.body ? <p className="mt-6 text-xl opacity-75">{content.body}</p> : null}
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <ComparisonPanel title={content.left?.title || "Links"} items={content.left?.items || []} accent={accent} />
          <ComparisonPanel title={content.right?.title || "Rechts"} items={content.right?.items || []} accent="#FFB300" />
        </div>
      </div>
    </SlideShell>
  );
}

function ComparisonPanel({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  return (
    <section className="rounded-md border border-[#0033A0]/12 bg-white/82 p-8 shadow-[0_20px_70px_rgba(0,51,160,.10)] backdrop-blur">
      <h2 className="text-3xl font-semibold" style={{ color: accent }}>
        {title}
      </h2>
      <ul className="mt-8 space-y-5 text-xl leading-8 text-[#1A1A1A]/80">
        {items.map((item) => (
          <li key={item} className="flex gap-4">
            <span className="mt-3 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
