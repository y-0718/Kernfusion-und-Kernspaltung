"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { PublicSlide, SlideContent, SlideDesign } from "@/lib/slides/types";
import { SlideShell } from "@/components/presentation/slides/SlideShell";
import { useSlideDepthProgress } from "@/components/presentation/SlideDepthContext";

type Props = {
  slide: PublicSlide;
  content: SlideContent;
  design: SlideDesign;
  index: number;
  total: number;
};

export function ChapterDividerSlide({ slide, content, design, index }: Props) {
  const reduceMotion = useReducedMotion();
  const depthProgress = useSlideDepthProgress();
  const accent = design.accentColor || "#0033A0";
  const chapterNumber = content.chapterNumber || String(index + 1).padStart(2, "0");
  const numberY = useTransform(depthProgress, [0, 1], reduceMotion ? [0, 0] : [-42, 42]);
  const orbitX = useTransform(depthProgress, [0, 1], reduceMotion ? [0, 0] : [28, -28]);
  const foregroundY = useTransform(depthProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [10, 0, -10]);

  return (
    <SlideShell design={design} backgroundUrl={slide.background_url} className="items-center">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[5vw] top-1/2 -z-10 -translate-y-1/2 font-mono text-[42vw] font-semibold leading-none text-[#0033A0]/[0.045]"
        style={{ y: numberY }}
      >
        {chapterNumber}
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-y-1/2 md:h-[48rem] md:w-[48rem]"
        style={{ x: orbitX }}
      >
        <div className="absolute inset-0 rounded-full border border-[#0033A0]/12" />
        <div className="absolute inset-[16%] rotate-12 rounded-full border border-[#0033A0]/10" />
        <div className="absolute inset-[32%] -rotate-12 rounded-full border border-[#FFB300]/25" />
        <div className="absolute left-[18%] top-1/2 h-2 w-2 rounded-full bg-[#FFB300] shadow-[0_0_30px_rgba(255,179,0,.8)]" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto grid w-full max-w-[90rem] items-center gap-8 md:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]"
        style={{ y: foregroundY }}
      >
        <div className="flex items-center gap-5 md:block">
          <span className="font-mono text-5xl font-semibold md:text-7xl" style={{ color: accent }}>
            {chapterNumber}
          </span>
          <div className="mt-0 h-px flex-1 bg-[#0033A0]/20 md:mt-6 md:w-28" />
          <p className="mt-0 text-xs font-semibold uppercase tracking-[0.22em] opacity-[0.65] md:mt-5">
            {content.eyebrow || "Kapitel"}
          </p>
        </div>

        <div className="max-w-6xl">
          <motion.h1
            className="max-w-[14ch] text-5xl font-semibold leading-[0.92] md:text-7xl lg:text-8xl"
            initial={reduceMotion ? false : { opacity: 0, clipPath: "inset(0 0 18% 0)", filter: "blur(10px)" }}
            whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)", filter: "blur(0px)" }}
            viewport={{ amount: 0.45 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {slide.title}
          </motion.h1>
          {slide.subtitle ? (
            <p className="mt-6 max-w-3xl text-xl leading-snug opacity-[0.72] md:text-3xl">{slide.subtitle}</p>
          ) : null}
          {content.body ? (
            <p className="mt-7 max-w-2xl border-t border-[#0033A0]/14 pt-5 text-lg leading-8 opacity-[0.68]">
              {content.body}
            </p>
          ) : null}
        </div>
      </motion.div>
    </SlideShell>
  );
}
