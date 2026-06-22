import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { ScientificPlaceholder } from "@/components/presentation/slides/ScientificPlaceholder";
import { SlideShell } from "@/components/presentation/slides/SlideShell";

type Props = {
  slide: PublicSlide;
  content: SlideContent;
  design: SlideDesign;
  index: number;
  total: number;
};

export function FullImageSlide({ slide, content, design }: Props) {
  const imageUrl = slide.primary_media_url || slide.background_url;

  return (
    <SlideShell design={{ ...design, overlay: "dark" }} backgroundUrl={imageUrl} className="items-end">
      {!imageUrl ? (
        <div className="absolute inset-[-4rem] -z-10">
          <ScientificPlaceholder slide={slide} className="h-full min-h-screen rounded-none border-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent" />
        </div>
      ) : null}
      <div className="mb-8 max-w-4xl border-l-2 border-[#FFB300] pl-6 md:mb-12 md:pl-9">
        <h1 className="text-5xl font-semibold leading-[0.96] md:text-7xl">{slide.title}</h1>
        {slide.subtitle ? <p className="mt-5 text-2xl opacity-[0.85]">{slide.subtitle}</p> : null}
        {content.body ? <p className="mt-6 max-w-3xl text-lg leading-8 opacity-[0.82] md:text-xl">{content.body}</p> : null}
        {content.caption ? <p className="mt-8 text-sm uppercase tracking-[0.2em] text-white/70">{content.caption}</p> : null}
      </div>
    </SlideShell>
  );
}
