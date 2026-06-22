import type { SlideContent, SlideDesign } from "@/lib/slides/types";

type SlideTextProps = {
  title: string;
  subtitle?: string | null;
  content: SlideContent;
  design: SlideDesign;
  compact?: boolean;
};

export function SlideText({ title, subtitle, content, design, compact = false }: SlideTextProps) {
  const align = design.textAlignment || "left";
  const accent = design.accentColor || "#0033A0";
  const alignmentClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  const flexAlignment = align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";

  return (
    <div className={`max-w-3xl ${alignmentClass}`}>
      {content.eyebrow ? (
        <div className={`mb-5 flex items-center gap-3 ${flexAlignment}`}>
          <span className="h-px w-10" style={{ backgroundColor: accent }} />
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>{content.eyebrow}</p>
        </div>
      ) : null}
      <h1 className={`${compact ? "text-4xl md:text-6xl lg:text-7xl" : "text-5xl md:text-7xl lg:text-8xl"} max-w-[15ch] font-semibold leading-[0.96]`}>
        {title}
      </h1>
      {subtitle ? <p className="mt-6 max-w-[34ch] text-xl leading-snug opacity-[0.72] md:text-2xl">{subtitle}</p> : null}
      {content.body ? <p className="mt-7 max-w-[52ch] text-lg leading-8 opacity-[0.75] md:text-xl">{content.body}</p> : null}
      {content.bullets?.length ? (
        <ul className="mt-8 max-w-2xl text-left text-lg leading-7 md:text-xl">
          {content.bullets.map((bullet, index) => (
            <li key={bullet} className="flex gap-4 border-t border-[#0033A0]/12 py-3.5 first:border-t-0">
              <span className="mt-0.5 font-mono text-xs font-semibold" style={{ color: accent }}>0{index + 1}</span>
              <span className="opacity-[0.82]">{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
