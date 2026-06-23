"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import type { PublicSlide, SlideDesign } from "@/lib/slides/types";
import { ScientificPlaceholder } from "@/components/presentation/slides/ScientificPlaceholder";
import { useSlideDepthProgress } from "@/components/presentation/SlideDepthContext";

type Props = {
  slide: PublicSlide;
  design: SlideDesign;
  index: number;
};

export function FullBleedImageSlide({ slide, design, index }: Props) {
  const reduceMotion = useReducedMotion();
  const depthProgress = useSlideDepthProgress();
  const imageUrl = slide.primary_media_url || slide.background_url;
  const imageY = useTransform(depthProgress, [0, 1], reduceMotion ? [0, 0] : [-8, 8]);
  const imageScale = useTransform(depthProgress, [0, 0.5, 1], reduceMotion ? [1, 1, 1] : [1.015, 1, 1.015]);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: design.backgroundColor || "#FFFFFF" }}
    >
      {imageUrl ? (
        <>
          <motion.img
            aria-hidden="true"
            src={imageUrl}
            alt=""
            className="absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] scale-110 object-cover opacity-20 blur-2xl"
            style={{ y: imageY }}
          />
          <div className="absolute inset-0 bg-white/55 backdrop-saturate-75" />
          <motion.img
            src={imageUrl}
            alt={slide.primary_media_alt || slide.background_alt || slide.title}
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 z-10 h-full w-full object-contain"
            style={{ y: imageY, scale: imageScale }}
            initial={reduceMotion ? false : { opacity: 0, scale: 1.018, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </>
      ) : (
        <div className="absolute inset-0 p-3 md:p-5">
          <ScientificPlaceholder slide={slide} className="h-full min-h-screen rounded-none border-0" />
        </div>
      )}
      <h1 className="sr-only">{slide.title}</h1>
    </div>
  );
}
