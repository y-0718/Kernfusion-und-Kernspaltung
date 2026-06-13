import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { MediaBlock } from "@/components/presentation/slides/MediaBlock";
import { SlideShell } from "@/components/presentation/slides/SlideShell";
import { SlideText } from "@/components/presentation/slides/SlideText";

type Props = {
  slide: PublicSlide;
  content: SlideContent;
  design: SlideDesign;
  index: number;
  total: number;
};

export function SplitMediaTextSlide({ slide, content, design }: Props) {
  const mediaFirst = design.mediaPosition !== "right";

  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div className={mediaFirst ? "order-1" : "order-2 lg:order-2"}>
          <MediaBlock slide={slide} />
        </div>
        <div className={mediaFirst ? "order-2" : "order-1 lg:order-1"}>
          <SlideText title={slide.title} subtitle={slide.subtitle} content={content} design={design} compact />
        </div>
      </div>
    </SlideShell>
  );
}
