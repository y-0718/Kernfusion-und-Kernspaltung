import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { MediaBlock } from "@/components/presentation/slides/MediaBlock";
import { ScientificPlaceholder } from "@/components/presentation/slides/ScientificPlaceholder";
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
          <ScientificPlaceholder slide={slide} labels={content.labels || []} className="aspect-[1.25]" />
        )}
      </div>
    </SlideShell>
  );
}
