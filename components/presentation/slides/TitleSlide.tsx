import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { SlideShell } from "@/components/presentation/slides/SlideShell";
import { SlideText } from "@/components/presentation/slides/SlideText";

type Props = { slide: PublicSlide; content: SlideContent; design: SlideDesign; index: number; total: number };

export function TitleSlide({ slide, content, design }: Props) {
  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      {design.spaceHero ? <SolarHero /> : null}
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center text-center [text-shadow:0_2px_24px_rgba(26,26,26,.48)]">
        <SlideText title={slide.title} subtitle={slide.subtitle} content={content} design={{ ...design, textAlignment: "center" }} />
      </div>
    </SlideShell>
  );
}

function SolarHero() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#1A1A1A]">
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.75)_0_1px,transparent_1px),radial-gradient(circle_at_70%_30%,rgba(255,255,255,.55)_0_1px,transparent_1px)] [background-size:120px_120px,180px_180px]" />
      <div className="absolute left-1/2 top-1/2 h-[58vw] max-h-[760px] min-h-[360px] w-[58vw] min-w-[360px] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB300] opacity-95 shadow-[0_0_120px_rgba(255,179,0,.45)]">
        <div className="absolute inset-5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff1b8,#ffb300_38%,#ff8c00_76%)]" />
        <div className="absolute -inset-12 rounded-full border border-[#FFB300]/20" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,26,26,.34)_0_30%,rgba(26,26,26,.48)_58%,#1A1A1A_100%)]" />
    </div>
  );
}
