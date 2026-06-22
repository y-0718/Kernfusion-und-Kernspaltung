import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { SlideShell } from "@/components/presentation/slides/SlideShell";

type Props = { slide: PublicSlide; content: SlideContent; design: SlideDesign; index: number; total: number };

export function ComparisonSlide({ slide, content, design }: Props) {
  const accent = design.accentColor || "#0033A0";

  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-semibold leading-[0.96] md:text-7xl">{slide.title}</h1>
          {slide.subtitle ? <p className="mt-5 text-xl opacity-[0.72] md:text-2xl">{slide.subtitle}</p> : null}
          {content.body ? <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 opacity-[0.72]">{content.body}</p> : null}
        </div>
        <div className="relative mt-12 grid gap-10 border-y border-[#0033A0]/12 py-9 md:grid-cols-2 md:gap-0 md:py-10">
          <div aria-hidden="true" className="absolute bottom-10 left-1/2 top-10 hidden w-px bg-[#0033A0]/14 md:block" />
          <ComparisonPanel number="01" title={content.left?.title || "Links"} items={content.left?.items || []} accent={accent} />
          <ComparisonPanel number="02" title={content.right?.title || "Rechts"} items={content.right?.items || []} accent="#FFB300" />
        </div>
      </div>
    </SlideShell>
  );
}

function ComparisonPanel({ number, title, items, accent }: { number: string; title: string; items: string[]; accent: string }) {
  return (
    <section className="relative px-1 md:px-10 lg:px-14">
      <span className="font-mono text-xs font-semibold" style={{ color: accent }}>{number}</span>
      <h2 className="mt-4 text-3xl font-semibold md:text-4xl" style={{ color: accent }}>{title}</h2>
      <ul className="mt-7 text-lg leading-7 text-[#1A1A1A]/78 md:text-xl">
        {items.map((item) => (
          <li key={item} className="flex gap-4 border-t border-[#0033A0]/10 py-3.5">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
