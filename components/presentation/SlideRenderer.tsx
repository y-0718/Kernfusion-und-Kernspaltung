import type { PublicSlide, SlideContent, SlideDesign, SlideSource } from "@/lib/slides/types";
import { PremiumSlideFrame } from "@/components/presentation/PremiumSlideFrame";
import { TitleSlide } from "@/components/presentation/slides/TitleSlide";
import { SplitMediaTextSlide } from "@/components/presentation/slides/SplitMediaTextSlide";
import { FullImageSlide } from "@/components/presentation/slides/FullImageSlide";
import { VideoSlide } from "@/components/presentation/slides/VideoSlide";
import { ComparisonSlide } from "@/components/presentation/slides/ComparisonSlide";
import { QuoteSlide } from "@/components/presentation/slides/QuoteSlide";
import { SourcesSlide } from "@/components/presentation/slides/SourcesSlide";
import { InfographicSlide } from "@/components/presentation/slides/InfographicSlide";

type SlideRendererProps = {
  slide: PublicSlide;
  sources: (SlideSource & { presentation_id?: string; slide_sort_order?: number })[];
  index: number;
  total: number;
};

export function SlideRenderer({ slide, sources, index, total }: SlideRendererProps) {
  const content = slide.content_json as SlideContent;
  const design = slide.design_json as SlideDesign;
  const transition = String(slide.animation_json?.transition || "fade");
  let renderedSlide: React.ReactNode;

  switch (slide.slide_type) {
    case "split_media_text":
      renderedSlide = <SplitMediaTextSlide slide={slide} content={content} design={design} index={index} total={total} />;
      break;
    case "full_image":
      renderedSlide = <FullImageSlide slide={slide} content={content} design={design} index={index} total={total} />;
      break;
    case "video":
      renderedSlide = <VideoSlide slide={slide} content={content} design={design} index={index} total={total} />;
      break;
    case "comparison":
      renderedSlide = <ComparisonSlide slide={slide} content={content} design={design} index={index} total={total} />;
      break;
    case "quote":
      renderedSlide = <QuoteSlide slide={slide} content={content} design={design} index={index} total={total} />;
      break;
    case "sources":
      renderedSlide = (
        <SourcesSlide slide={slide} content={content} design={design} sources={sources} index={index} total={total} />
      );
      break;
    case "infographic":
      renderedSlide = <InfographicSlide slide={slide} content={content} design={design} index={index} total={total} />;
      break;
    case "title":
    default:
      renderedSlide = <TitleSlide slide={slide} content={content} design={design} index={index} total={total} />;
  }

  return (
    <PremiumSlideFrame transition={transition} index={index}>
      {renderedSlide}
    </PremiumSlideFrame>
  );
}
