"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PublicSlide } from "@/lib/slides/types";

type MediaBlockProps = {
  slide: PublicSlide;
  mode?: "image" | "video";
};

export function MediaBlock({ slide, mode = "image" }: MediaBlockProps) {
  const reduceMotion = useReducedMotion();
  const url = slide.primary_media_url;

  if (!url) {
    return (
      <div className="media-frame grid min-h-[360px] place-items-center border border-dashed border-[#0033A0]/25 bg-[#EEF4FF] p-8 text-center text-[#0033A0]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em]">Medienplatzhalter</p>
          <p className="mt-3 text-lg text-[#1A1A1A]/70">Wähle im Admin-Bereich ein Bild oder Video aus.</p>
        </div>
      </div>
    );
  }

  const reveal = reduceMotion
    ? undefined
    : {
        initial: { opacity: 0, scale: 1.045, clipPath: "inset(7% 5% 7% 5%)", filter: "blur(8px)" },
        whileInView: { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)" }
      };

  if (mode === "video" || slide.primary_media_type === "video") {
    return (
      <motion.div
        className="media-frame bg-[#1A1A1A]"
        {...reveal}
        viewport={{ amount: 0.45 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      >
        <video src={url} controls playsInline className="h-full min-h-[420px] w-full object-cover" />
      </motion.div>
    );
  }

  return (
    <motion.figure
      className="media-frame"
      {...reveal}
      viewport={{ amount: 0.45 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.img
        src={url}
        alt={slide.primary_media_alt || ""}
        className="h-full min-h-[420px] w-full object-cover"
        initial={reduceMotion ? false : { scale: 1.035 }}
        whileInView={{ scale: 1 }}
        viewport={{ amount: 0.45 }}
        transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
      />
      {slide.primary_media_caption ? (
        <figcaption className="bg-white px-4 py-3 text-sm text-[#1A1A1A]/70">{slide.primary_media_caption}</figcaption>
      ) : null}
    </motion.figure>
  );
}
