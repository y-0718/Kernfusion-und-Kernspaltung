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

  return (
    <div className={`max-w-3xl ${alignmentClass}`}>
      {content.eyebrow ? (
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
          {content.eyebrow}
        </p>
      ) : null}
      <h1 className={`${compact ? "text-4xl md:text-6xl" : "text-5xl md:text-7xl lg:text-8xl"} font-semibold leading-[0.95]`}>
        {title}
      </h1>
      {subtitle ? <p className="mt-6 text-2xl leading-snug opacity-80 md:text-3xl">{subtitle}</p> : null}
      {content.body ? <p className="mt-8 text-xl leading-9 opacity-80 md:text-2xl">{content.body}</p> : null}
      {content.bullets?.length ? (
        <ul className="mt-8 space-y-4 text-left text-xl leading-8 md:text-2xl">
          {content.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-4">
              <span className="mt-3 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
