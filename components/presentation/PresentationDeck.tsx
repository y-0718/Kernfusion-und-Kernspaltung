"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Maximize2, Minimize2, Play } from "lucide-react";
import type { PresentationSettings, PublicSlide, SlideSource } from "@/lib/slides/types";
import { SlideRenderer } from "@/components/presentation/SlideRenderer";
import { ProgressNavigation } from "@/components/presentation/ProgressNavigation";
import { ParticleLayer } from "@/components/presentation/ParticleLayer";
import { readPresentationState, subscribePresentationState, writePresentationState } from "@/lib/presenter/presentationState";

type PresentationDeckProps = {
  slides: PublicSlide[];
  sources: (SlideSource & { presentation_id?: string; slide_sort_order?: number })[];
  settings: PresentationSettings | null;
};

export function PresentationDeck({ slides, sources, settings }: PresentationDeckProps) {
  const deckRef = useRef<HTMLDivElement | null>(null);
  const isSyncingRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const slideIds = useMemo(() => slides.map((slide) => slide.id), [slides]);

  const scrollToIndex = useCallback((index: number) => {
    document.getElementById(slideIds[index])?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [reduceMotion, slideIds]);

  useEffect(() => {
    const state = readPresentationState();
    const initialIndex = Math.min(Math.max(state.activeIndex, 0), Math.max(slides.length - 1, 0));
    setActiveIndex(initialIndex);
    setHasStarted(state.hasStarted);
  }, [slides.length]);

  useEffect(() => subscribePresentationState((state) => {
    const nextIndex = Math.min(Math.max(state.activeIndex, 0), Math.max(slides.length - 1, 0));
    setHasStarted(state.hasStarted);
    if (nextIndex !== activeIndex) {
      isSyncingRef.current = true;
      setActiveIndex(nextIndex);
      scrollToIndex(nextIndex);
      window.setTimeout(() => { isSyncingRef.current = false; }, 700);
    }
  }), [activeIndex, scrollToIndex, slides.length]);

  useEffect(() => {
    const container = deckRef.current;
    if (!container) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = slideIds.indexOf(visible.target.id);
      if (index >= 0) {
        setActiveIndex(index);
        if (!isSyncingRef.current) writePresentationState({ activeIndex: index });
      }
    }, { root: container, threshold: [0.52, 0.72] });

    slideIds.forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [slideIds]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!deckRef.current) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goTo(Math.min(activeIndex + 1, slides.length - 1));
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goTo(Math.max(activeIndex - 1, 0));
      }
      if (event.key.toLowerCase() === "f") { event.preventDefault(); toggleFullscreen(); }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function goTo(index: number) {
    writePresentationState({ activeIndex: index });
    scrollToIndex(index);
  }

  function startPresentation() {
    setHasStarted(true);
    writePresentationState({
      activeIndex: 0, timerStartedAt: Date.now(), timerElapsedMs: 0, isTimerRunning: true, hasStarted: true
    });
    scrollToIndex(0);
  }

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
    return <main className="grid min-h-screen place-items-center bg-white px-6 text-center"><section className="max-w-xl">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0033A0]">Keine veröffentlichten Slides</p>
      <h1 className="mt-4 text-4xl font-semibold text-[#1A1A1A]">Die Präsentation ist noch leer.</h1>
      <p className="mt-4 text-lg text-slate-600">Melde dich unter /admin an und veröffentliche deine ersten Slides.</p>
    </section></main>;
  }

  return (
    <main className="relative h-screen overflow-hidden bg-white">
      {settings?.enable_particles ? <ParticleLayer /> : null}
      <ProgressNavigation slides={slides} activeIndex={activeIndex} onSelect={goTo} />

      {!hasStarted ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-white/88 px-6 backdrop-blur-xl">
          <motion.section
            className="max-w-xl text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0033A0]">Bereit</p>
            <h1 className="mt-4 text-4xl font-semibold text-[#1A1A1A] md:text-6xl">Präsentation starten</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">Der Timer der Referentenansicht startet mit diesem Klick.</p>
            <button type="button" onClick={startPresentation} className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-md bg-[#0033A0] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#062a7a]">
              <Play size={20} />Präsentation starten
            </button>
          </motion.section>
        </div>
      ) : null}

      <button type="button" onClick={toggleFullscreen} className="fixed right-5 top-5 z-40 grid h-10 w-10 place-items-center rounded-md border border-[#0033A0]/15 bg-white/80 text-[#0033A0] shadow-sm backdrop-blur transition hover:bg-[#EEF4FF]" aria-label={isFullscreen ? "Vollbild verlassen" : "Vollbild starten"} title={isFullscreen ? "Vollbild verlassen" : "Vollbild starten"}>
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>

      <div ref={deckRef} className="presentation-scroll">
        {slides.map((slide, index) => (
          <section id={slide.id} key={slide.id} className="presentation-slide">
            <SlideRenderer slide={slide} sources={sources} index={index} total={slides.length} />
          </section>
        ))}
      </div>
    </main>
  );
}
