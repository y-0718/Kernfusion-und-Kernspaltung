"use client";

import { useEffect, useMemo, useState } from "react";
import { Maximize2, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { AdminSlide, MediaAsset, PublicSlide, SlideSource } from "@/lib/slides/types";
import { Button } from "@/components/ui/Button";
import { SlideRenderer } from "@/components/presentation/SlideRenderer";
import {
  formatTimer,
  getTimerElapsedMs,
  readPresentationState,
  subscribePresentationState,
  writePresentationState,
  type PresentationState
} from "@/lib/presenter/presentationState";

type PresenterViewProps = {
  slides: AdminSlide[];
  mediaAssets: MediaAsset[];
};

export function PresenterView({ slides, mediaAssets }: PresenterViewProps) {
  const [state, setState] = useState<PresentationState>(() => readPresentationState());
  const [now, setNow] = useState(Date.now());
  const activeIndex = Math.min(Math.max(state.activeIndex, 0), Math.max(slides.length - 1, 0));
  const currentSlide = slides[activeIndex];
  const nextSlide = slides[activeIndex + 1] || null;
  const elapsedMs = getTimerElapsedMs(state, now);

  useEffect(() => subscribePresentationState(setState), []);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        goTo(activeIndex + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(activeIndex - 1);
      }
      if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        toggleTimer();
      }
      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        resetTimer();
      }
      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        toggleFullscreen();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const currentPreview = useMemo(
    () => (currentSlide ? toPublicSlide(currentSlide, mediaAssets) : null),
    [currentSlide, mediaAssets]
  );
  const nextPreview = useMemo(
    () => (nextSlide ? toPublicSlide(nextSlide, mediaAssets) : null),
    [nextSlide, mediaAssets]
  );

  function goTo(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), Math.max(slides.length - 1, 0));
    setState(writePresentationState({ activeIndex: nextIndex }));
  }

  function pauseTimer() {
    setState(writePresentationState({ timerStartedAt: null, timerElapsedMs: elapsedMs, isTimerRunning: false }));
  }

  function resumeTimer() {
    setState(writePresentationState({ timerStartedAt: Date.now(), isTimerRunning: true, hasStarted: true }));
  }

  function toggleTimer() {
    if (state.isTimerRunning) pauseTimer();
    else resumeTimer();
  }

  function resetTimer() {
    setState(
      writePresentationState({
        timerStartedAt: state.isTimerRunning ? Date.now() : null,
        timerElapsedMs: 0,
        hasStarted: true
      })
    );
  }

  async function toggleFullscreen() {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  }

  if (!slides.length || !currentPreview) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F7FAFF] px-6 text-center">
        <section className="rounded-md border border-[#0033A0]/10 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Referentenansicht</h1>
          <p className="mt-2 text-slate-500">Es gibt noch keine veröffentlichten Slides.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen gap-5 bg-[#F7FAFF] p-4 text-[#1A1A1A] lg:p-6 xl:grid-cols-[minmax(0,1.35fr)_420px]">
      <section className="grid content-start gap-5">
        <div className="overflow-hidden rounded-md border border-[#0033A0]/10 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#0033A0]/10 px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0033A0]">Aktuelle Slide</p>
              <h1 className="mt-1 text-xl font-semibold">{currentSlide.title}</h1>
            </div>
            <span className="rounded-full bg-[#EEF4FF] px-3 py-1 text-sm font-semibold text-[#0033A0]">
              {activeIndex + 1} / {slides.length}
            </span>
          </div>
          <SlidePreview slide={currentPreview} index={activeIndex} total={slides.length} large />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,.85fr)_1fr]">
          <section className="overflow-hidden rounded-md border border-[#0033A0]/10 bg-white shadow-sm">
            <div className="border-b border-[#0033A0]/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0033A0]">Nächste Slide</p>
              <h2 className="mt-1 truncate font-semibold">{nextSlide?.title || "Ende der Präsentation"}</h2>
            </div>
            {nextPreview ? <SlidePreview slide={nextPreview} index={activeIndex + 1} total={slides.length} /> : (
              <div className="grid aspect-video place-items-center text-slate-500">Keine weitere Slide</div>
            )}
          </section>

          <section className="rounded-md border border-[#0033A0]/10 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0033A0]">Private Notizen</p>
            <div className="mt-3 max-h-[270px] overflow-y-auto whitespace-pre-line rounded-md bg-[#F7FAFF] p-4 text-lg leading-8">
              {currentSlide.presenter_notes || "Keine Präsentator-Notizen für diese Slide hinterlegt."}
            </div>
          </section>
        </div>
      </section>

      <aside className="grid content-start gap-5">
        <section className="rounded-md border border-[#0033A0]/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0033A0]">Timer</p>
          <div className="mt-3 font-mono text-6xl font-semibold tabular-nums">{formatTimer(elapsedMs)}</div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Button type="button" variant="secondary" onClick={toggleTimer}>
              {state.isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
              {state.isTimerRunning ? "Pause" : "Weiter"}
            </Button>
            <Button type="button" variant="secondary" onClick={resetTimer}><RotateCcw size={18} />Reset</Button>
            <Button type="button" variant="secondary" onClick={toggleFullscreen}><Maximize2 size={18} />Vollbild</Button>
          </div>
        </section>

        <section className="rounded-md border border-[#0033A0]/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0033A0]">Steuerung</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button type="button" variant="secondary" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}>
              <SkipBack size={18} />Zurück
            </Button>
            <Button type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex >= slides.length - 1}>
              Weiter<SkipForward size={18} />
            </Button>
          </div>
          <div className="mt-5 rounded-md bg-[#EEF4FF] p-4 text-sm leading-6 text-[#1A1A1A]/75">
            Pfeile: Slides wechseln<br />Leertaste: nächste Slide<br />P: Timer pausieren/fortsetzen<br />
            R: Timer zurücksetzen<br />F: Vollbild
          </div>
        </section>
      </aside>
    </main>
  );
}

const emptySources: SlideSource[] = [];

function SlidePreview({ slide, index, total, large = false }: { slide: PublicSlide; index: number; total: number; large?: boolean }) {
  return (
    <div className="relative aspect-video overflow-hidden bg-white">
      <div className={`absolute left-0 top-0 h-[100vh] w-[177.777vh] origin-top-left ${large ? "scale-[0.16] md:scale-[0.22] xl:scale-[0.26]" : "scale-[0.09] md:scale-[0.12]"}`}>
        <SlideRenderer slide={slide} sources={emptySources} index={index} total={total} />
      </div>
    </div>
  );
}

function toPublicSlide(slide: AdminSlide, mediaAssets: MediaAsset[]): PublicSlide {
  const primary = mediaAssets.find((asset) => asset.id === slide.primary_media_id);
  const background = mediaAssets.find((asset) => asset.id === slide.background_media_id);

  return {
    id: slide.id, presentation_id: slide.presentation_id, title: slide.title, subtitle: slide.subtitle, slug: slide.slug,
    slide_type: slide.slide_type, content_json: slide.content_json, design_json: slide.design_json,
    animation_json: slide.animation_json, interactive_config: slide.interactive_config,
    background_media_id: slide.background_media_id, background_url: background?.file_url || null,
    background_alt: background?.alt_text || null, primary_media_id: slide.primary_media_id,
    primary_media_url: primary?.file_url || null, primary_media_type: primary?.file_type || null,
    primary_media_alt: primary?.alt_text || null, primary_media_caption: primary?.caption || null,
    sort_order: slide.sort_order, created_at: slide.created_at, updated_at: slide.updated_at
  };
}
