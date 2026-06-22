import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { SlideShell } from "@/components/presentation/slides/SlideShell";

type Props = { slide: PublicSlide; content: SlideContent; design: SlideDesign; index: number; total: number };

export function QuoteSlide({ slide, content, design }: Props) {
  const accent = design.accentColor || "#0033A0";

  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <div className="relative mx-auto max-w-6xl px-2 text-center">
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0033A0]/10 md:h-[44rem] md:w-[44rem]" />
        <div className="mx-auto mb-7 flex items-center justify-center gap-3">
          <span className="h-px w-10" style={{ backgroundColor: accent }} />
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>{slide.title}</p>
          <span className="h-px w-10" style={{ backgroundColor: accent }} />
        </div>
        <span aria-hidden="true" className="block font-serif text-7xl leading-none text-[#FFB300]">“</span>
        <blockquote className="-mt-3 text-4xl font-semibold leading-[1.08] md:text-6xl lg:text-7xl">
          {content.quote || content.body || slide.subtitle}
        </blockquote>
        {content.author ? <p className="mt-8 text-lg opacity-[0.65]">{content.author}</p> : null}
        {content.body && content.quote ? <p className="mx-auto mt-7 max-w-3xl border-t border-[#0033A0]/12 pt-6 text-lg leading-8 opacity-[0.72]">{content.body}</p> : null}
      </div>
    </SlideShell>
  );
}
