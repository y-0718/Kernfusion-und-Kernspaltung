import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
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
      <div className="mb-12 max-w-4xl">
        <h1 className="text-5xl font-semibold leading-none md:text-7xl">{slide.title}</h1>
        {slide.subtitle ? <p className="mt-5 text-2xl opacity-85">{slide.subtitle}</p> : null}
        {content.body ? <p className="mt-7 text-xl leading-9 opacity-85 md:text-2xl">{content.body}</p> : null}
        {content.caption ? <p className="mt-8 text-sm uppercase tracking-[0.2em] text-white/70">{content.caption}</p> : null}
      </div>
    </SlideShell>
  );
}
