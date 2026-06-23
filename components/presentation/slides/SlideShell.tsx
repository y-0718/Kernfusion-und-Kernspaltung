"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { SlideDesign } from "@/lib/slides/types";
import { useSlideDepthProgress } from "@/components/presentation/SlideDepthContext";

type SlideShellProps = {
  design: SlideDesign;
  children: React.ReactNode;
  className?: string;
  backgroundUrl?: string | null;
};

export function SlideShell({ design, children, className = "", backgroundUrl }: SlideShellProps) {
  const reduceMotion = useReducedMotion();
  const depthProgress = useSlideDepthProgress();
  const isDark = design.overlay === "dark" || design.backgroundColor === "#1A1A1A";
  const backgroundY = useTransform(depthProgress, [0, 1], reduceMotion ? [0, 0] : [-36, 36]);
  const backgroundScale = useTransform(depthProgress, [0, 0.5, 1], reduceMotion ? [1, 1, 1] : [1.08, 1.035, 1.08]);
  const middleY = useTransform(depthProgress, [0, 1], reduceMotion ? [0, 0] : [-18, 18]);
  const middleX = useTransform(depthProgress, [0, 1], reduceMotion ? [0, 0] : [-10, 10]);
  const foregroundY = useTransform(depthProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [10, 0, -10]);

  return (
    <div
      className={`relative flex min-h-screen overflow-hidden px-6 py-10 md:px-12 md:py-16 lg:px-[clamp(4rem,7vw,8rem)] ${className}`}
      style={{ backgroundColor: design.backgroundColor || "#FFFFFF", color: isDark ? "#FFFFFF" : "#1A1A1A" }}
    >
      {backgroundUrl ? (
        <motion.div
          className="absolute -inset-10"
          initial={reduceMotion ? false : { scale: 1.07, opacity: 0.65 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ amount: 0.45 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: backgroundY }}
        >
          <motion.img src={backgroundUrl} alt="" className="h-full w-full object-cover" style={{ scale: backgroundScale }} />
          <div className={`absolute inset-0 ${isDark ? "bg-[#1A1A1A]/48" : "bg-white/30"}`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(26,26,26,.12)_100%)]" />
        </motion.div>
      ) : (
        <motion.div aria-hidden="true" className="pointer-events-none absolute -inset-10 overflow-hidden" style={{ y: backgroundY, scale: backgroundScale }}>
          <div className="slide-atmosphere absolute inset-0 opacity-70" />
          <div className="slide-stars absolute inset-0 opacity-55" />
          <div className="absolute -right-[22vw] -top-[40vh] h-[78vh] w-[78vh] rounded-full border border-[#0033A0]/[0.08]" />
          <div className="absolute -right-[16vw] -top-[32vh] h-[62vh] w-[62vh] rounded-full border border-[#0033A0]/10" />
          <div className="absolute -bottom-[46vh] -left-[18vw] h-[72vh] w-[72vh] rounded-full border border-[#0033A0]/[0.08]" />
        </motion.div>
      )}

      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" style={{ x: middleX, y: middleY }}>
        <div className="absolute -right-[9rem] top-[14%] h-72 w-72 rounded-full border border-[#0033A0]/10 md:h-[28rem] md:w-[28rem]" />
        <div className="absolute -right-[3rem] top-[22%] h-48 w-48 rounded-full border border-[#FFB300]/12 md:h-80 md:w-80" />
        <div className="absolute bottom-[9%] left-[7%] h-px w-40 bg-gradient-to-r from-[#0033A0]/40 to-transparent md:w-72" />
        <div className="absolute bottom-[9%] left-[7%] h-1.5 w-1.5 rounded-full bg-[#FFB300] shadow-[0_0_18px_rgba(255,179,0,.75)]" />
      </motion.div>

      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-7 z-[3] flex items-center gap-3 opacity-45 md:inset-x-12" style={{ x: middleX }}>
        <span className="h-px w-10 bg-[#0033A0]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#FFB300]" />
        <span className="h-px flex-1 bg-[#0033A0]/15" />
      </motion.div>

      <motion.div
        className="relative z-10 flex min-h-[calc(100vh-7rem)] w-full items-center"
        initial={reduceMotion ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.48 }}
        transition={{ duration: 0.72, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: foregroundY }}
      >
        <div className="w-full">{children}</div>
      </motion.div>
    </div>
  );
}
