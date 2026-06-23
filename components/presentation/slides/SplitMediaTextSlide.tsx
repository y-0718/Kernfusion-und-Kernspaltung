import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { MediaBlock } from "@/components/presentation/slides/MediaBlock";
import { SlideShell } from "@/components/presentation/slides/SlideShell";
import { SlideText } from "@/components/presentation/slides/SlideText";

type Props = { slide: PublicSlide; content: SlideContent; design: SlideDesign; index: number; total: number };

export function SplitMediaTextSlide({ slide, content, design }: Props) {
  const mediaFirst = design.mediaPosition !== "right";

  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <div className="mx-auto grid w-full max-w-[92rem] items-center gap-5 lg:grid-cols-[minmax(0,1.16fr)_minmax(0,.84fr)] lg:gap-[clamp(3rem,6vw,7rem)]">
        <div className={`order-1 max-h-[28vh] overflow-hidden lg:max-h-none lg:overflow-visible ${mediaFirst ? "lg:order-1 lg:-ml-[5vw]" : "lg:order-2 lg:-mr-[5vw]"}`}>
          <MediaBlock slide={slide} />
        </div>
        <div className={`order-2 relative z-10 ${mediaFirst ? "lg:order-2" : "lg:order-1"}`}>
          <SlideText title={slide.title} subtitle={slide.subtitle} content={content} design={design} compact />
        </div>
      </div>
    </SlideShell>
  );
}
