"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

type PremiumSlideFrameProps = {
  children: React.ReactNode;
  transition?: string;
  index: number;
};

export function PremiumSlideFrame({ children, transition = "fade", index }: PremiumSlideFrameProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const scrollProgress = useMotionValue(0.5);

  useEffect(() => {
    const frame = frameRef.current;
    const container = frame?.closest(".presentation-scroll") as HTMLElement | null;
    if (!frame || !container || reduceMotion) return;

    function updateProgress() {
      const rect = frame.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      scrollProgress.set(Math.min(1, Math.max(0, progress)));
    }

    updateProgress();
    container.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      container.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [reduceMotion, scrollProgress]);

  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 28,
    mass: 0.5
  });

  const depthY = useTransform(smoothProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [30, 0, -24]);
  const depthScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    reduceMotion ? [1, 1, 1] : transition === "zoom" ? [0.97, 1, 1.018] : [0.988, 1, 0.994]
  );
  const backgroundY = useTransform(smoothProgress, [0, 1], reduceMotion ? [0, 0] : [-16, 16]);
  const backgroundX = useTransform(smoothProgress, [0, 1], reduceMotion ? [0, 0] : [index % 2 ? 10 : -10, 0]);

  return (
    <motion.div
      ref={frameRef}
      className="relative min-h-screen overflow-hidden [perspective:1400px]"
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985, filter: "blur(9px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ amount: 0.38, once: false }}
      transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[7%] z-[1] w-px bg-[#0033A0]/10"
        style={{ y: backgroundY }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-[14%] z-[1] h-px bg-[#0033A0]/10"
        style={{ x: backgroundX }}
      />
      <motion.div
        className="relative z-[2] min-h-screen [transform-style:preserve-3d]"
        style={{ y: depthY, scale: depthScale }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
