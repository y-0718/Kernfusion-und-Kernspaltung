"use client";

import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import type { PublicSlide, SlideContent } from "@/lib/slides/types";
import {
  ScientificPlaceholder,
  type ScienceVisualMode
} from "@/components/presentation/slides/ScientificPlaceholder";

type Props = {
  slide: PublicSlide;
  content: SlideContent;
};

export function InteractiveStage({ slide, content }: Props) {
  const type = String(slide.interactive_config.type || content.visualization || "atom_structure");
  const entries = (content.labels?.length ? content.labels : content.bullets) || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [runId, setRunId] = useState(0);

  if (type === "timeline") {
    return (
      <section className="relative min-h-[24rem] overflow-x-auto py-10" aria-label="Interaktiver Zeitstrahl">
        <div className="absolute left-[8%] right-[8%] top-1/2 h-px bg-[#0033A0]/25" />
        <div
          className="relative grid min-h-[20rem] items-center"
          style={{
            gridTemplateColumns: `repeat(${Math.max(entries.length, 1)}, minmax(140px, 1fr))`,
            minWidth: `${Math.max(entries.length, 1) * 140}px`
          }}
        >
          {entries.map((entry, index) => (
            <button
              key={`${entry}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative grid min-h-40 place-items-center px-2 text-center"
              aria-pressed={activeIndex === index}
            >
              <span
                className={`z-10 grid h-5 w-5 place-items-center rounded-full border-2 transition duration-300 ${
                  activeIndex === index
                    ? "scale-125 border-[#FFB300] bg-[#FFB300] shadow-[0_0_22px_rgba(255,179,0,.55)]"
                    : "border-[#0033A0] bg-white group-hover:scale-110"
                }`}
              />
              <span className={`absolute top-[calc(50%+2.2rem)] max-w-40 text-sm font-semibold leading-5 transition ${
                activeIndex === index ? "text-[#0033A0]" : "text-[#1A1A1A]/55"
              }`}>
                {entry}
              </span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (type === "quiz") {
    const correctIndex = Number(slide.interactive_config.correctIndex ?? -1);
    return (
      <section className="grid min-h-[24rem] content-center gap-3" aria-label="Interaktives Quiz">
        {entries.map((entry, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = isSelected && index === correctIndex;
          return (
            <button
              key={`${entry}-${index}`}
              type="button"
              onClick={() => setSelectedAnswer(index)}
              className={`flex min-h-14 items-center gap-4 border-l-2 px-5 py-3 text-left text-base font-semibold transition duration-300 ${
                isCorrect
                  ? "border-green-600 bg-green-50 text-green-800"
                  : isSelected
                    ? "border-[#FFB300] bg-[#FFB300]/10 text-[#1A1A1A]"
                    : "border-[#0033A0]/25 bg-white/45 text-[#1A1A1A]/75 hover:border-[#0033A0] hover:bg-white/75"
              }`}
              aria-pressed={isSelected}
            >
              <span className="font-mono text-sm text-[#0033A0]">{String(index + 1).padStart(2, "0")}</span>
              {entry}
            </button>
          );
        })}
      </section>
    );
  }

  if (type === "comparison") {
    const columns = [content.left, content.right];
    return (
      <section className="grid min-h-[24rem] gap-8 md:grid-cols-2" aria-label="Interaktive Vergleichsvisualisierung">
        {columns.map((column, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`border-t-2 py-8 text-left transition duration-300 ${
              activeIndex === index ? "border-[#FFB300] opacity-100" : "border-[#0033A0]/25 opacity-55 hover:opacity-80"
            }`}
            aria-pressed={activeIndex === index}
          >
            <span className="font-mono text-sm text-[#0033A0]">0{index + 1}</span>
            <strong className="mt-4 block text-3xl">{column?.title}</strong>
            <span className="mt-5 grid gap-3">
              {(column?.items || []).map((item, itemIndex) => (
                <span key={`${item}-${itemIndex}`} className="border-l border-[#0033A0]/20 pl-4 text-base font-medium leading-6">
                  {item}
                </span>
              ))}
            </span>
          </button>
        ))}
      </section>
    );
  }

  const visualMode: ScienceVisualMode =
    type === "fission" || type === "chain_reaction"
      ? "fission"
      : type === "fusion"
        ? "fusion"
        : "atom";

  return (
    <section className="relative" aria-label="Interaktive wissenschaftliche Simulation">
      <ScientificPlaceholder
        key={runId}
        slide={slide}
        mode={visualMode}
        labels={entries}
        className="aspect-[1.25]"
      />
      <button
        type="button"
        onClick={() => setRunId((current) => current + 1)}
        className="absolute bottom-5 right-5 z-20 inline-flex min-h-11 items-center gap-2 rounded-md bg-white/88 px-4 py-2 text-sm font-semibold text-[#0033A0] shadow-sm backdrop-blur transition hover:bg-white"
      >
        {runId === 0 ? <Play size={17} /> : <RotateCcw size={17} />}
        {runId === 0 ? "Simulation starten" : "Neu starten"}
      </button>
    </section>
  );
}
