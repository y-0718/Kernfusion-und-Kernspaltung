"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import type { PresentationSettings, PublicSlide, SlideSource } from "@/lib/slides/types";
import { SlideRenderer } from "@/components/presentation/SlideRenderer";
import { ProgressNavigation } from "@/components/presentation/ProgressNavigation";
import { ParticleLayer } from "@/components/presentation/ParticleLayer";

type PresentationDeckProps = {
  slides: PublicSlide[];
  sources: (SlideSource & { presentation_id?: string; slide_sort_order?: number })[];
  settings: PresentationSettings | null;
};

export function PresentationDeck({ slides, sources, settings }: PresentationDeckProps) {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slideIds = useMemo(() => slides.map((slide) => slide.id), [slides]);

  const scrollToIndex = useCallback((index: number) => {
    document.getElementById(slideIds[index])?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slideIds]);

  useEffect(() => {
    const container = deckRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = slideIds.indexOf(visible.target.id);
        if (index >= 0) setActiveIndex(index);
      },
      { root: container, threshold: [0.52, 0.72] }
    );

    slideIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [slideIds]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!deckRef.current) return;

      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        scrollToIndex(Math.min(activeIndex + 1, slides.length - 1));
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        scrollToIndex(Math.max(activeIndex - 1, 0));
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, slides.length, scrollToIndex]);

  async function toggleFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }

  if (!slides.length) {
    return (
      <main className="grid min-h-screen place-items-center bg-white px-6 text-center">
        <section className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0033A0]">Keine veröffentlichten Slides</p>
          <h1 className="mt-4 text-4xl font-semibold text-[#1A1A1A]">Die Präsentation ist noch leer.</h1>
          <p className="mt-4 text-lg text-slate-600">Melde dich unter /admin an und veröffentliche deine ersten Slides.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="relative h-screen overflow-hidden bg-white">
      {settings?.enable_particles ? <ParticleLayer activeIndex={activeIndex} /> : null}
      <ProgressNavigation slides={slides} activeIndex={activeIndex} onSelect={scrollToIndex} />

      <button
        type="button"
        onClick={toggleFullscreen}
        className="fixed right-5 top-5 z-40 grid h-10 w-10 place-items-center rounded-md border border-[#0033A0]/15 bg-white/80 text-[#0033A0] shadow-sm backdrop-blur transition hover:bg-[#EEF4FF]"
        aria-label={isFullscreen ? "Vollbild verlassen" : "Vollbild starten"}
        title={isFullscreen ? "Vollbild verlassen" : "Vollbild starten"}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>

      <div ref={deckRef} className="presentation-scroll">
        <AnimatePresence mode="wait">
          {slides.map((slide, index) => (
            <motion.section
              id={slide.id}
              key={slide.id}
              className="presentation-slide"
              initial={{ opacity: 0.88 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.6 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <SlideRenderer slide={slide} sources={sources} index={index} total={slides.length} />
            </motion.section>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
