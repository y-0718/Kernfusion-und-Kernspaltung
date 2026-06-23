"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { SlideContent, SlideDesign } from "@/lib/slides/types";
import { useSlideDepthProgress } from "@/components/presentation/SlideDepthContext";

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
  const reduceMotion = useReducedMotion();
  const depthProgress = useSlideDepthProgress();
  const textY = useTransform(depthProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [7, 0, -7]);
  const alignmentClass = align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  const flexAlignment = align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";

  return (
    <motion.div
      className={`relative max-w-3xl ${alignmentClass}`}
      initial={reduceMotion ? false : { opacity: 0, clipPath: "inset(0 0 14% 0)", filter: "blur(7px)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)", filter: "blur(0px)" }}
      viewport={{ amount: 0.45 }}
      transition={{ duration: 0.86, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ y: textY }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-8 top-0 h-24 w-px bg-gradient-to-b from-[#0033A0]/35 to-transparent" />
      {content.eyebrow ? (
        <div className={`mb-5 flex items-center gap-3 ${flexAlignment}`}>
          <span className="h-px w-10" style={{ backgroundColor: accent }} />
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>{content.eyebrow}</p>
        </div>
      ) : null}
      <h1 className={`${compact ? "text-4xl md:text-6xl lg:text-7xl" : "text-5xl md:text-7xl lg:text-8xl"} max-w-[15ch] font-semibold leading-[0.96]`}>
        {title}
      </h1>
      {subtitle ? <p className="mt-4 max-w-[34ch] text-lg leading-snug opacity-[0.72] md:mt-6 md:text-2xl">{subtitle}</p> : null}
      {content.body ? <p className="mt-4 max-w-[52ch] text-base leading-6 opacity-[0.75] md:mt-7 md:text-xl md:leading-8">{content.body}</p> : null}
      {content.bullets?.length ? (
        <ul className="mt-5 max-w-2xl text-left text-base leading-6 md:mt-8 md:text-xl md:leading-7">
          {content.bullets.map((bullet, index) => (
            <li key={bullet} className="flex gap-3 border-t border-[#0033A0]/12 py-2.5 first:border-t-0 md:gap-4 md:py-3.5">
              <span className="mt-0.5 font-mono text-xs font-semibold" style={{ color: accent }}>0{index + 1}</span>
              <span className="opacity-[0.82]">{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
}
