"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { SlideDepthProvider } from "@/components/presentation/SlideDepthContext";

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
    const frameNode = frame;

    function updateProgress() {
      const rect = frameNode.getBoundingClientRect();
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

  const depthY = useTransform(smoothProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [20, 0, -18]);
  const depthScale = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    reduceMotion ? [1, 1, 1] : transition === "zoom" ? [0.975, 1, 1.025] : [0.992, 1, 0.996]
  );
  const cameraRotate = useTransform(smoothProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [0.7, 0, -0.55]);
  const backgroundY = useTransform(smoothProgress, [0, 1], reduceMotion ? [0, 0] : [-24, 24]);
  const backgroundX = useTransform(smoothProgress, [0, 1], reduceMotion ? [0, 0] : [index % 2 ? 16 : -16, index % 2 ? -8 : 8]);
  const lightScale = useTransform(smoothProgress, [0, 0.5, 1], reduceMotion ? [1, 1, 1] : [0.92, 1.04, 0.96]);

  return (
    <motion.div
      ref={frameRef}
      className="relative min-h-screen overflow-hidden [perspective:1800px]"
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.982, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ amount: 0.34, once: false }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[18%] z-0 opacity-80 [background:radial-gradient(circle_at_72%_24%,rgba(255,179,0,.13),transparent_24%),radial-gradient(circle_at_18%_74%,rgba(0,51,160,.11),transparent_30%)]"
        style={{ x: backgroundX, y: backgroundY, scale: lightScale }}
      />
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
        style={{ y: depthY, scale: depthScale, rotateX: cameraRotate }}
      >
        <SlideDepthProvider value={smoothProgress}>{children}</SlideDepthProvider>
      </motion.div>
    </motion.div>
  );
}
