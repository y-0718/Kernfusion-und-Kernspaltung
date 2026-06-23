"use client";

import { useEffect, useRef } from "react";

type ParticleLayerProps = {
  activeIndex: number;
};

type ParticleKind = "atom" | "proton" | "neutron" | "energy" | "plasma";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  depth: number;
  rotation: number;
  spin: number;
  phase: number;
  kind: ParticleKind;
};

const COLORS = {
  white: "#FFFFFF",
  blue: "#0033A0",
  gray: "#1A1A1A",
  orange: "#FFB300"
};

export function ParticleLayer({ activeIndex }: ParticleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastScrollRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasNode = canvas;

    const context = canvasNode.getContext("2d");
    if (!context) return;

    const ctx = context;
    const scrollContainer = document.querySelector<HTMLElement>(".presentation-scroll");
    const scrollTarget: HTMLElement | Window = scrollContainer || window;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPowerDevice = (navigator.hardwareConcurrency || 4) <= 4;
    const maxParticles = 2;
    const ambientParticles = lowPowerDevice ? 1 : 2;
    let frame = 0;
    let tick = 0;
    let width = 0;
    let height = 0;

    particlesRef.current = [];
    lastScrollRef.current = scrollContainer?.scrollTop || window.scrollY;
    scrollVelocityRef.current = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvasNode.width = width * ratio;
      canvasNode.height = height * ratio;
      canvasNode.style.width = `${width}px`;
      canvasNode.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function currentSceneText() {
      const slides = document.querySelectorAll<HTMLElement>(".presentation-slide");
      return slides[activeIndex]?.innerText.toLowerCase() || "";
    }

    function pickKind(): ParticleKind {
      const scene = currentSceneText();
      const random = Math.random();

      if (scene.includes("fusion") || scene.includes("plasma") || scene.includes("sonne")) {
        if (random < 0.4) return "plasma";
        if (random < 0.72) return "energy";
        return "atom";
      }

      if (scene.includes("spaltung") || scene.includes("uran") || scene.includes("neutron")) {
        if (random < 0.32) return "neutron";
        if (random < 0.58) return "proton";
        if (random < 0.8) return "energy";
        return "atom";
      }

      if (random < 0.4) return "atom";
      if (random < 0.62) return "energy";
      if (random < 0.8) return "plasma";
      return random < 0.9 ? "proton" : "neutron";
    }

    function particleSize(kind: ParticleKind) {
      if (kind === "atom") return 18 + Math.random() * 12;
      if (kind === "energy") return 18 + Math.random() * 20;
      if (kind === "plasma") return 10 + Math.random() * 14;
      return 5 + Math.random() * 6;
    }

    function spawn(amount: number, biasY = height / 2, preferEdges = false) {
      if (reduceMotion) return;

      for (let index = 0; index < amount; index += 1) {
        const kind = pickKind();
        const depth = 0.35 + Math.random() * 0.9;
        const useEdge = preferEdges || Math.random() < 0.72;
        const edgeX = Math.random() < 0.5 ? Math.random() * width * 0.14 : width * (0.86 + Math.random() * 0.14);
        particlesRef.current.push({
          x: useEdge ? edgeX : Math.random() * width,
          y: biasY + (Math.random() - 0.5) * Math.min(280, height * 0.35),
          vx: (Math.random() - 0.5) * 0.7 * depth,
          vy: (Math.random() - 0.5) * 0.62 * depth,
          life: 0,
          maxLife: 320 + Math.random() * 260,
          size: particleSize(kind),
          depth,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.026,
          phase: Math.random() * Math.PI * 2,
          kind
        });
      }

      particlesRef.current = particlesRef.current.slice(-maxParticles);
    }

    function onScroll() {
      const current = scrollContainer?.scrollTop || window.scrollY;
      const delta = current - lastScrollRef.current;
      lastScrollRef.current = current;
      scrollVelocityRef.current = delta;

      if (Math.abs(delta) > 3) {
        const biasY = delta > 0 ? height * 0.67 : height * 0.33;
        spawn(1, biasY, true);
      }
    }

    function drawAtom(particle: Particle, alpha: number) {
      const radius = particle.size;
      ctx.globalAlpha = alpha * 0.66;
      ctx.strokeStyle = COLORS.blue;
      ctx.lineWidth = 1.15;

      for (let orbit = 0; orbit < 3; orbit += 1) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * orbit);
        ctx.scale(1.55, 0.48);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.shadowBlur = 10;
      ctx.shadowColor = COLORS.orange;
      ctx.fillStyle = COLORS.orange;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(3, radius * 0.18), 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 5;
      ctx.shadowColor = COLORS.blue;
      ctx.fillStyle = COLORS.blue;
      for (let electron = 0; electron < 3; electron += 1) {
        const angle = particle.life * 0.035 + electron * ((Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * radius * 1.5, Math.sin(angle) * radius * 0.55, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawNucleon(particle: Particle, alpha: number, color: string) {
      const radius = particle.size;
      const gradient = ctx.createRadialGradient(-radius * 0.3, -radius * 0.35, 0.5, 0, 0, radius);
      gradient.addColorStop(0, COLORS.white);
      gradient.addColorStop(0.28, color);
      gradient.addColorStop(1, color);
      ctx.globalAlpha = alpha * 0.52;
      ctx.fillStyle = gradient;
      ctx.shadowBlur = 7;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawEnergy(particle: Particle, alpha: number) {
      const velocity = Math.min(Math.abs(scrollVelocityRef.current), 110);
      const length = particle.size + velocity * 0.22;
      const gradient = ctx.createLinearGradient(-length, 0, length, 0);
      gradient.addColorStop(0, "rgba(255,179,0,0)");
      gradient.addColorStop(0.55, COLORS.orange);
      gradient.addColorStop(1, "rgba(255,179,0,0)");
      ctx.globalAlpha = alpha * 0.58;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 8;
      ctx.shadowColor = COLORS.orange;
      ctx.beginPath();
      ctx.moveTo(-length, 0);
      ctx.quadraticCurveTo(0, Math.sin(particle.phase + particle.life * 0.06) * 4, length, 0);
      ctx.stroke();
    }

    function drawPlasma(particle: Particle, alpha: number) {
      const radius = particle.size * (0.92 + Math.sin(particle.life * 0.08 + particle.phase) * 0.08);
      ctx.globalAlpha = alpha * 0.46;
      ctx.strokeStyle = COLORS.orange;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 12;
      ctx.shadowColor = COLORS.orange;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.2;
      ctx.fillStyle = COLORS.orange;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.48, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawParticle(particle: Particle) {
      const alpha = Math.max(0, 1 - particle.life / particle.maxLife);
      const speedBlur = Math.min(Math.abs(scrollVelocityRef.current) / 85, 1.4);
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation + particle.life * particle.spin);
      ctx.filter = `blur(${speedBlur * particle.depth}px)`;

      if (particle.kind === "atom") drawAtom(particle, alpha);
      if (particle.kind === "proton") drawNucleon(particle, alpha, COLORS.blue);
      if (particle.kind === "neutron") drawNucleon(particle, alpha, COLORS.gray);
      if (particle.kind === "energy") drawEnergy(particle, alpha);
      if (particle.kind === "plasma") drawPlasma(particle, alpha);
      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);
      scrollVelocityRef.current *= 0.86;
      tick += 1;

      particlesRef.current = particlesRef.current
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx + Math.sin(particle.life * 0.022 + particle.phase) * 0.08 * particle.depth,
          y: particle.y + particle.vy + scrollVelocityRef.current * 0.012 * particle.depth,
          life: particle.life + 1
        }))
        .filter((particle) => particle.life < particle.maxLife);

      if (tick % 36 === 0 && particlesRef.current.length < ambientParticles) {
        spawn(1, height * (0.18 + Math.random() * 0.64), true);
      }

      particlesRef.current.forEach(drawParticle);
      frame = requestAnimationFrame(loop);
    }

    resize();
    spawn(ambientParticles, height / 2, true);
    window.addEventListener("resize", resize);
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      scrollTarget.removeEventListener("scroll", onScroll);
    };
  }, [activeIndex]);

  return <canvas ref={canvasRef} className="presentation-particle-canvas pointer-events-none fixed inset-0 z-[3] opacity-[0.38]" aria-hidden="true" />;
}
