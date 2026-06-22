"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PublicSlide, SlideContent } from "@/lib/slides/types";

export type ScienceVisualMode = "atom" | "fission" | "fusion" | "solar" | "plasma" | "energy";

type ScientificPlaceholderProps = {
  slide: PublicSlide;
  mode?: ScienceVisualMode;
  labels?: string[];
  className?: string;
};

export function ScientificPlaceholder({ slide, mode, labels = [], className = "" }: ScientificPlaceholderProps) {
  const reduceMotion = useReducedMotion();
  const visualMode = mode || resolveVisualMode(slide);

  return (
    <motion.div
      role="img"
      aria-label={`Wissenschaftliche Visualisierung: ${modeLabel[visualMode]}`}
      className={`science-surface relative isolate min-h-[420px] overflow-hidden ${className}`}
      initial={reduceMotion ? false : { opacity: 0, scale: 1.025, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ amount: 0.35 }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="science-grid absolute inset-0 opacity-60" />
      <div className="absolute -right-[15%] -top-[28%] h-[70%] w-[70%] rounded-full border border-[#0033A0]/10" />
      <div className="absolute -bottom-[38%] -left-[16%] h-[72%] w-[72%] rounded-full border border-[#0033A0]/10" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 560" aria-hidden="true">
        <defs>
          <radialGradient id="blueNucleus" cx="32%" cy="28%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="28%" stopColor="#5377C8" />
            <stop offset="100%" stopColor="#0033A0" />
          </radialGradient>
          <radialGradient id="orangeEnergy" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#FFD970" />
            <stop offset="100%" stopColor="#FFB300" />
          </radialGradient>
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="wideGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
        </defs>

        <g opacity="0.22" fill="none" stroke="#0033A0">
          <path d="M65 92 H290" />
          <path d="M510 470 H742" />
          <path d="M103 118 V212" />
          <path d="M699 338 V447" />
        </g>

        {visualMode === "atom" ? <AtomVisual /> : null}
        {visualMode === "fission" ? <FissionVisual /> : null}
        {visualMode === "fusion" ? <FusionVisual /> : null}
        {visualMode === "solar" ? <SolarVisual /> : null}
        {visualMode === "plasma" ? <PlasmaVisual /> : null}
        {visualMode === "energy" ? <EnergyVisual /> : null}
      </svg>

      <div className="absolute left-5 top-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0033A0]/55 md:left-7 md:top-7">
        <span className="h-px w-8 bg-[#0033A0]/40" />
        {modeLabel[visualMode]}
      </div>

      {labels.length ? (
        <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#0033A0]/12 pt-4 md:bottom-7 md:left-7 md:right-7">
          {labels.slice(0, 4).map((label, index) => (
            <span key={`${label}-${index}`} className="flex items-center gap-2 text-xs font-medium text-[#1A1A1A]/65">
              <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? "bg-[#FFB300]" : "bg-[#0033A0]"}`} />
              {label}
            </span>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

export function resolveVisualMode(slide: PublicSlide): ScienceVisualMode {
  const content = slide.content_json as SlideContent;
  const configured = String(content.visualization || slide.interactive_config?.type || "").toLowerCase();
  const searchable = `${configured} ${slide.title} ${slide.subtitle || ""} ${content.body || ""}`.toLowerCase();

  if (configured.includes("atom")) return "atom";
  if (searchable.includes("sonne") || searchable.includes("stern") || searchable.includes("solar")) return "solar";
  if (searchable.includes("spaltung") || searchable.includes("uran") || searchable.includes("chain")) return "fission";
  if (searchable.includes("fusion") || searchable.includes("deuter") || searchable.includes("trit")) return "fusion";
  if (searchable.includes("plasma") || searchable.includes("iter")) return "plasma";
  if (searchable.includes("energie") || searchable.includes("strom") || searchable.includes("turbine")) return "energy";
  return "atom";
}

const modeLabel: Record<ScienceVisualMode, string> = {
  atom: "Atomic structure",
  fission: "Fission sequence",
  fusion: "Fusion field",
  solar: "Stellar surface",
  plasma: "Plasma confinement",
  energy: "Energy transfer"
};

function Nucleus({ cx, cy, scale = 1, split = false }: { cx: number; cy: number; scale?: number; split?: boolean }) {
  const particles = split
    ? [[-20, -13], [1, -19], [21, -8], [-17, 10], [5, 7], [22, 17]]
    : [[-28, -17], [-8, -25], [15, -20], [30, -3], [-23, 6], [0, 0], [21, 14], [-11, 22], [10, 28]];

  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`} filter="url(#softGlow)">
      {particles.map(([x, y], index) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={index % 3 === 0 ? 16 : 14} fill={index % 2 ? "url(#blueNucleus)" : "url(#orangeEnergy)"} />
      ))}
    </g>
  );
}

function AtomVisual() {
  return (
    <g>
      <g className="science-orbit" transform="translate(400 280)" fill="none" stroke="#0033A0" strokeWidth="2">
        <ellipse rx="215" ry="82" opacity="0.48" />
        <ellipse rx="215" ry="82" opacity="0.38" transform="rotate(60)" />
        <ellipse rx="215" ry="82" opacity="0.28" transform="rotate(120)" />
        <circle cx="215" cy="0" r="7" fill="#0033A0" stroke="none" filter="url(#softGlow)" />
        <circle cx="-107" cy="-71" r="6" fill="#FFB300" stroke="none" />
        <circle cx="-110" cy="71" r="6" fill="#0033A0" stroke="none" />
      </g>
      <circle cx="400" cy="280" r="105" fill="#0033A0" opacity="0.06" filter="url(#wideGlow)" />
      <Nucleus cx={400} cy={280} scale={1.35} />
    </g>
  );
}

function FissionVisual() {
  return (
    <g>
      <path d="M66 280 H250" stroke="#0033A0" strokeWidth="2" strokeDasharray="9 10" />
      <circle className="science-particle" cx="110" cy="280" r="9" fill="url(#blueNucleus)" filter="url(#softGlow)" />
      <Nucleus cx={340} cy={280} scale={1.35} />
      <path d="M428 280 C500 280 504 190 565 164" fill="none" stroke="#FFB300" strokeWidth="3" />
      <path d="M428 280 C500 280 504 370 565 396" fill="none" stroke="#0033A0" strokeWidth="3" />
      <Nucleus cx={610} cy={158} scale={0.85} split />
      <Nucleus cx={618} cy={402} scale={0.92} split />
      {[[-1, -1], [1, -0.25], [1, 0.8]].map(([dx, dy], index) => (
        <g key={index}>
          <path d={`M470 280 L${470 + dx * 175} ${280 + dy * 135}`} stroke="#0033A0" strokeWidth="1.5" strokeDasharray="7 9" opacity="0.6" />
          <circle cx={470 + dx * 175} cy={280 + dy * 135} r="7" fill="#0033A0" />
        </g>
      ))}
      <circle cx="470" cy="280" r="74" fill="#FFB300" opacity="0.08" filter="url(#wideGlow)" />
    </g>
  );
}

function FusionVisual() {
  return (
    <g>
      <path d="M86 280 C185 174 230 190 315 258" fill="none" stroke="#0033A0" strokeWidth="2" strokeDasharray="7 10" opacity="0.55" />
      <path d="M714 280 C615 174 570 190 485 258" fill="none" stroke="#0033A0" strokeWidth="2" strokeDasharray="7 10" opacity="0.55" />
      <Nucleus cx={210} cy={280} scale={0.8} split />
      <Nucleus cx={590} cy={280} scale={0.9} split />
      <circle className="science-pulse" cx="400" cy="280" r="105" fill="#FFB300" opacity="0.08" filter="url(#wideGlow)" />
      <Nucleus cx={400} cy={280} scale={1.25} />
      <path d="M400 110 V182 M400 378 V450 M230 280 H302 M498 280 H570" stroke="#FFB300" strokeWidth="2" opacity="0.7" />
      <text x="188" y="391" fill="#0033A0" fontSize="22" fontWeight="650">D</text>
      <text x="574" y="397" fill="#0033A0" fontSize="22" fontWeight="650">T</text>
      <text x="382" y="404" fill="#FF8C00" fontSize="22" fontWeight="650">He</text>
    </g>
  );
}

function SolarVisual() {
  return (
    <g>
      <circle cx="535" cy="290" r="215" fill="#FFB300" opacity="0.2" filter="url(#wideGlow)" />
      <circle cx="535" cy="290" r="166" fill="url(#orangeEnergy)" filter="url(#softGlow)" />
      {[0, 36, 72, 108, 144].map((rotation) => (
        <ellipse key={rotation} cx="535" cy="290" rx="150" ry="58" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.27" transform={`rotate(${rotation} 535 290)`} />
      ))}
      <path d="M60 130 C180 80 246 128 315 220 S432 410 526 430" fill="none" stroke="#0033A0" strokeWidth="2" opacity="0.38" />
      <path d="M64 430 C170 385 216 392 300 315" fill="none" stroke="#0033A0" strokeWidth="1.5" strokeDasharray="8 11" opacity="0.45" />
      {[134, 194, 262, 342, 414].map((y, index) => <circle key={y} cx={95 + index * 38} cy={y} r={index % 2 ? 5 : 7} fill={index % 2 ? "#FFB300" : "#0033A0"} />)}
    </g>
  );
}

function PlasmaVisual() {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((index) => (
        <ellipse key={index} cx="400" cy="280" rx={250 - index * 30} ry={118 - index * 10} fill="none" stroke={index % 2 ? "#FFB300" : "#0033A0"} strokeWidth={index === 0 ? 2.5 : 1.5} opacity={0.18 + index * 0.09} transform={`rotate(${index % 2 ? 8 : -8} 400 280)`} />
      ))}
      <ellipse className="science-orbit" cx="400" cy="280" rx="180" ry="66" fill="none" stroke="#FFB300" strokeWidth="3" strokeDasharray="18 12" opacity="0.72" />
      <circle cx="400" cy="280" r="90" fill="#FFB300" opacity="0.1" filter="url(#wideGlow)" />
      {[[260, 248], [318, 329], [390, 225], [458, 324], [535, 259], [420, 289], [350, 270]].map(([x, y], index) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={index % 3 === 0 ? 8 : 5} fill={index % 2 ? "#FFB300" : "#0033A0"} filter="url(#softGlow)" />
      ))}
    </g>
  );
}

function EnergyVisual() {
  return (
    <g>
      {[0, 1, 2, 3].map((index) => (
        <path key={index} d={`M70 ${170 + index * 62} C205 ${95 + index * 55} 284 ${255 + index * 35} 410 ${190 + index * 40} S620 ${170 + index * 56} 742 ${210 + index * 34}`} fill="none" stroke={index === 1 ? "#FFB300" : "#0033A0"} strokeWidth={index === 1 ? 4 : 1.5} opacity={index === 1 ? 0.86 : 0.3} />
      ))}
      {[145, 270, 400, 535, 665].map((x, index) => (
        <g key={x} className={index === 2 ? "science-pulse" : ""}>
          <circle cx={x} cy={index % 2 ? 305 : 245} r={index === 2 ? 20 : 9} fill={index === 2 ? "url(#orangeEnergy)" : "url(#blueNucleus)"} filter="url(#softGlow)" />
          <circle cx={x} cy={index % 2 ? 305 : 245} r={index === 2 ? 48 : 24} fill="none" stroke={index === 2 ? "#FFB300" : "#0033A0"} opacity="0.22" />
        </g>
      ))}
    </g>
  );
}
