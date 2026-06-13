import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { SlideShell } from "@/components/presentation/slides/SlideShell";

type Props = {
  slide: PublicSlide;
  content: SlideContent;
  design: SlideDesign;
  index: number;
  total: number;
};

export function QuoteSlide({ slide, content, design }: Props) {
  const accent = design.accentColor || "#0033A0";

  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
          {slide.title}
        </p>
        <blockquote className="mt-8 text-4xl font-semibold leading-tight md:text-6xl lg:text-7xl">
          “{content.quote || content.body || slide.subtitle}”
        </blockquote>
        {content.author ? <p className="mt-8 text-xl opacity-70">{content.author}</p> : null}
        {content.body && content.quote ? <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 opacity-75">{content.body}</p> : null}
      </div>
    </SlideShell>
  );
}
