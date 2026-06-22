"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SlideDesign } from "@/lib/slides/types";

type SlideShellProps = {
  design: SlideDesign;
  children: React.ReactNode;
  className?: string;
  backgroundUrl?: string | null;
};

export function SlideShell({ design, children, className = "", backgroundUrl }: SlideShellProps) {
  const reduceMotion = useReducedMotion();
  const isDark = design.overlay === "dark" || design.backgroundColor === "#1A1A1A";

  return (
    <div
      className={`relative flex min-h-screen overflow-hidden px-6 py-14 md:px-12 md:py-16 lg:px-[clamp(4rem,7vw,8rem)] ${className}`}
      style={{ backgroundColor: design.backgroundColor || "#FFFFFF", color: isDark ? "#FFFFFF" : "#1A1A1A" }}
    >
      {backgroundUrl ? (
        <motion.div
          className="absolute -inset-5"
          initial={reduceMotion ? false : { scale: 1.07, opacity: 0.65 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ amount: 0.45 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={backgroundUrl} alt="" className="h-full w-full object-cover" />
          <div className={`absolute inset-0 ${isDark ? "bg-[#1A1A1A]/55" : "bg-white/35"}`} />
        </motion.div>
      ) : (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="slide-atmosphere absolute inset-0 opacity-70" />
          <div className="absolute -right-[22vw] -top-[40vh] h-[78vh] w-[78vh] rounded-full border border-[#0033A0]/[0.08]" />
          <div className="absolute -right-[16vw] -top-[32vh] h-[62vh] w-[62vh] rounded-full border border-[#0033A0]/10" />
          <div className="absolute -bottom-[46vh] -left-[18vw] h-[72vh] w-[72vh] rounded-full border border-[#0033A0]/[0.08]" />
          <div className="absolute bottom-[12%] right-[8%] h-20 w-px bg-gradient-to-b from-transparent via-[#FFB300]/50 to-transparent" />
        </div>
      )}

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-7 z-[1] flex items-center gap-3 opacity-45 md:inset-x-12">
        <span className="h-px w-10 bg-[#0033A0]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#FFB300]" />
        <span className="h-px flex-1 bg-[#0033A0]/15" />
      </div>

      <motion.div
        className="relative z-10 flex min-h-[calc(100vh-7rem)] w-full items-center"
        initial={reduceMotion ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.48 }}
        transition={{ duration: 0.72, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="w-full">{children}</div>
      </motion.div>
    </div>
  );
}
