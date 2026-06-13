import type { PublicSlide, SlideContent, SlideDesign, SlideSource } from "@/lib/slides/types";
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

  switch (slide.slide_type) {
    case "split_media_text":
      return <SplitMediaTextSlide slide={slide} content={content} design={design} index={index} total={total} />;
    case "full_image":
      return <FullImageSlide slide={slide} content={content} design={design} index={index} total={total} />;
    case "video":
      return <VideoSlide slide={slide} content={content} design={design} index={index} total={total} />;
    case "comparison":
      return <ComparisonSlide slide={slide} content={content} design={design} index={index} total={total} />;
    case "quote":
      return <QuoteSlide slide={slide} content={content} design={design} index={index} total={total} />;
    case "sources":
      return <SourcesSlide slide={slide} content={content} design={design} sources={sources} index={index} total={total} />;
    case "infographic":
      return <InfographicSlide slide={slide} content={content} design={design} index={index} total={total} />;
    case "title":
    default:
      return <TitleSlide slide={slide} content={content} design={design} index={index} total={total} />;
  }
}
