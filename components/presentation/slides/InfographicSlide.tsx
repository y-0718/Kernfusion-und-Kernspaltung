import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
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
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <SlideText title={slide.title} subtitle={slide.subtitle} content={content} design={design} compact />
        <PhysicsVisualization type={content.visualization || String(slide.interactive_config?.type || "atom_structure")} labels={content.labels || []} />
      </div>
    </SlideShell>
  );
}

function PhysicsVisualization({ type, labels }: { type: string; labels: string[] }) {
  if (type === "fission") return <FissionVisual labels={labels} />;
  if (type === "chain_reaction") return <ChainReactionVisual labels={labels} />;
  if (type === "fusion") return <FusionVisual labels={labels} />;
  return <AtomVisual labels={labels} />;
}

function AtomVisual({ labels }: { labels: string[] }) {
  return (
    <div className="media-frame relative grid aspect-[1.25] place-items-center bg-white">
      <div className="absolute h-64 w-64 rounded-full border border-[#0033A0]/20" />
      <div className="absolute h-80 w-44 rotate-45 rounded-full border border-[#0033A0]/25" />
      <div className="absolute h-80 w-44 -rotate-45 rounded-full border border-[#0033A0]/25" />
      <div className="grid h-32 w-32 place-items-center rounded-full bg-[#EEF4FF] shadow-[0_0_80px_rgba(0,51,160,.18)]">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className={`h-5 w-5 rounded-full ${index % 2 ? "bg-[#0033A0]" : "bg-[#FFB300]"}`} />
          ))}
        </div>
      </div>
      <Labels labels={labels} />
    </div>
  );
}

function FissionVisual({ labels }: { labels: string[] }) {
  return (
    <div className="media-frame relative grid aspect-[1.25] place-items-center bg-white">
      <div className="absolute left-[10%] top-1/2 h-2 w-28 -translate-y-1/2 bg-[#0033A0]" />
      <div className="absolute left-[28%] top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[#0033A0]" />
      <div className="grid h-36 w-36 place-items-center rounded-full bg-[#EEF4FF]">
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }).map((_, index) => (
            <span key={index} className={`h-4 w-4 rounded-full ${index % 3 ? "bg-[#0033A0]" : "bg-[#FFB300]"}`} />
          ))}
        </div>
      </div>
      <div className="absolute right-[24%] top-[34%] h-20 w-20 rounded-full bg-[#EEF4FF] shadow-lg" />
      <div className="absolute right-[18%] top-[57%] h-24 w-24 rounded-full bg-[#EEF4FF] shadow-lg" />
      <div className="absolute right-[8%] top-[20%] text-5xl font-semibold text-[#FFB300]">E</div>
      <Labels labels={labels} />
    </div>
  );
}

function ChainReactionVisual({ labels }: { labels: string[] }) {
  return (
    <div className="media-frame relative aspect-[1.25] bg-white">
      {[
        ["18%", "50%"],
        ["45%", "30%"],
        ["45%", "70%"],
        ["74%", "22%"],
        ["76%", "54%"],
        ["70%", "82%"]
      ].map(([left, top], index) => (
        <div key={`${left}-${top}`} className="absolute grid h-16 w-16 place-items-center rounded-full bg-[#EEF4FF] shadow-sm" style={{ left, top }}>
          <span className={`h-7 w-7 rounded-full ${index % 2 ? "bg-[#FFB300]" : "bg-[#0033A0]"}`} />
        </div>
      ))}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M27 54 C36 46 38 38 45 35" stroke="#0033A0" strokeWidth="1.2" fill="none" />
        <path d="M27 54 C36 61 39 66 45 73" stroke="#0033A0" strokeWidth="1.2" fill="none" />
        <path d="M54 34 C62 27 66 24 75 25" stroke="#FFB300" strokeWidth="1.2" fill="none" />
        <path d="M54 74 C63 70 68 64 77 58" stroke="#FFB300" strokeWidth="1.2" fill="none" />
      </svg>
      <Labels labels={labels} />
    </div>
  );
}

function FusionVisual({ labels }: { labels: string[] }) {
  return (
    <div className="media-frame relative grid aspect-[1.25] place-items-center overflow-hidden bg-white">
      <div className="absolute left-[20%] h-24 w-24 rounded-full bg-[#0033A0] shadow-[0_0_42px_rgba(0,51,160,.2)]" />
      <div className="absolute right-[20%] h-24 w-24 rounded-full bg-[#0033A0] shadow-[0_0_42px_rgba(0,51,160,.2)]" />
      <div className="absolute h-44 w-44 rounded-full bg-[#FFB300] opacity-90 shadow-[0_0_100px_rgba(255,179,0,.55)]" />
      <div className="absolute text-6xl font-semibold text-white">He</div>
      <Labels labels={labels} />
    </div>
  );
}

function Labels({ labels }: { labels: string[] }) {
  return (
    <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
      {labels.map((label) => (
        <span key={label} className="rounded-full border border-[#0033A0]/12 bg-white/82 px-3 py-1 text-sm font-medium text-[#0033A0] shadow-sm">
          {label}
        </span>
      ))}
    </div>
  );
}
