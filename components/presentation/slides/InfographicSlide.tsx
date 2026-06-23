import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { MediaBlock } from "@/components/presentation/slides/MediaBlock";
import { InteractiveStage } from "@/components/presentation/slides/InteractiveStage";
import { SlideShell } from "@/components/presentation/slides/SlideShell";
import { SlideText } from "@/components/presentation/slides/SlideText";

type Props = {
  slide: PublicSlide;
  content: SlideContent;
  design: SlideDesign;
  index: number;
  total: number;
};

export function InfographicSlide({ slide, content, design }: Props) {
  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[.88fr_1.12fr] lg:gap-16">
        <SlideText title={slide.title} subtitle={slide.subtitle} content={content} design={design} compact />
        {slide.primary_media_url ? (
          <MediaBlock slide={slide} />
        ) : (
          <InteractiveStage slide={slide} content={content} />
        )}
      </div>
    </SlideShell>
  );
}
