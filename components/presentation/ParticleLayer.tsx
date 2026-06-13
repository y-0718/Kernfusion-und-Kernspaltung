"use client";

import { useEffect, useRef } from "react";

type ParticleLayerProps = {
  activeIndex: number;
};

type ParticleKind = "atom" | "proton" | "neutron" | "energy" | "plasma";
type ParticleScene = "hero" | "fission" | "fusion" | "neutral";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  spin: number;
  phase: number;
  kind: ParticleKind;
  scene: ParticleScene;
};

const COLORS = {
  blue: "#0033A0",
  gray: "#1A1A1A",
  white: "#FFFFFF",
  orange: "#FFB300"
};

export function ParticleLayer({ activeIndex }: ParticleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasNode = canvas;
    const context = canvasNode.getContext("2d");
    if (!context) return;

    const ctx = context;
    let frame = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvasNode.width = width * ratio;
      canvasNode.height = height * ratio;
      canvasNode.style.width = `${width}px`;
      canvasNode.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function getScene(): ParticleScene {
      const text = document.body.innerText.toLowerCase();

      if (text.includes("fusion") || text.includes("plasma") || text.includes("sonne")) {
        return "fusion";
      }

      if (text.includes("spaltung") || text.includes("uran") || text.includes("neutron")) {
        return "fission";
      }

      if (activeIndex === 0) {
        return "hero";
      }

      return "neutral";
    }

    function pickKind(scene: ParticleScene): ParticleKind {
      const random = Math.random();

      if (scene === "fusion") {
        if (random < 0.42) return "plasma";
        if (random < 0.76) return "energy";
        return "atom";
      }

      if (scene === "fission") {
        if (random < 0.36) return "neutron";
        if (random < 0.68) return "proton";
        if (random < 0.86) return "energy";
        return "atom";
      }

      if (scene === "hero") {
        if (random < 0.46) return "atom";
        if (random < 0.78) return "energy";
        return "plasma";
      }

      if (random < 0.3) return "atom";
      if (random < 0.55) return "proton";
      if (random < 0.78) return "neutron";
      return "energy";
    }

    function spawn(amount: number, biasY = height / 2) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const scene = getScene();

      for (let index = 0; index < amount; index += 1) {
        const kind = pickKind(scene);
        const energyBias = kind === "energy" || kind === "plasma" ? 1.25 : 1;

        particlesRef.current.push({
          x: Math.random() * width,
          y: biasY + (Math.random() - 0.5) * 220,
          vx: (Math.random() - 0.5) * 0.75 * energyBias,
          vy: (Math.random() - 0.5) * 0.75 * energyBias,
          life: 0,
          maxLife: 70 + Math.random() * 70,
          size: particleSize(kind),
          spin: (Math.random() - 0.5) * 0.035,
          phase: Math.random() * Math.PI * 2,
          kind,
          scene
        });
      }

      particlesRef.current = particlesRef.current.slice(-90);
    }

    function particleSize(kind: ParticleKind) {
      if (kind === "atom") return 28 + Math.random() * 22;
      if (kind === "energy") return 24 + Math.random() * 28;
      if (kind === "plasma") return 16 + Math.random() * 22;
      return 6 + Math.random() * 8;
    }

    function onScroll() {
      const current = window.scrollY;
      const delta = current - lastScrollRef.current;
      lastScrollRef.current = current;

      if (Math.abs(delta) > 4) {
        const directionY = delta > 0 ? height * 0.68 : height * 0.32;
        spawn(Math.min(8, Math.ceil(Math.abs(delta) / 56)), directionY);
      }
    }

    function drawParticle(particle: Particle) {
      const alpha = 1 - particle.life / particle.maxLife;
      const pulse = Math.sin(particle.life * 0.08 + particle.phase) * 0.18 + 0.82;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.life * particle.spin);
      ctx.globalAlpha = Math.min(0.28, alpha * 0.24 * pulse);

      if (particle.kind === "atom") drawAtom(particle.size);
      if (particle.kind === "proton") drawNucleon(particle.size, COLORS.blue);
      if (particle.kind === "neutron") drawNucleon(particle.size, COLORS.gray);
      if (particle.kind === "energy") drawEnergy(particle.size);
      if (particle.kind === "plasma") drawPlasma(particle.size);

      ctx.restore();
    }

    function drawAtom(size: number) {
      ctx.strokeStyle = COLORS.blue;
      ctx.lineWidth = 1.15;

      for (let orbit = 0; orbit < 3; orbit += 1) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * orbit);
        ctx.scale(1.45, 0.48);
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = COLORS.orange;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(3, size * 0.11), 0, Math.PI * 2);
      ctx.fill();
    }

    function drawNucleon(size: number, color: string) {
      const gradient = ctx.createRadialGradient(-size * 0.18, -size * 0.2, 1, 0, 0, size);
      gradient.addColorStop(0, COLORS.white);
      gradient.addColorStop(0.28, color);
      gradient.addColorStop(1, color);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawEnergy(size: number) {
      const gradient = ctx.createLinearGradient(-size, 0, size, 0);
      gradient.addColorStop(0, "rgba(255, 179, 0, 0)");
      gradient.addColorStop(0.5, COLORS.orange);
      gradient.addColorStop(1, "rgba(255, 179, 0, 0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.quadraticCurveTo(-size * 0.2, -size * 0.18, size, 0);
      ctx.stroke();
    }

    function drawPlasma(size: number) {
      ctx.strokeStyle = COLORS.orange;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = COLORS.orange;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(2, size * 0.12), 0, Math.PI * 2);
      ctx.fill();
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      particlesRef.current = particlesRef.current
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx + Math.sin(particle.life * 0.025 + particle.phase) * 0.08,
          y: particle.y + particle.vy,
          life: particle.life + 1
        }))
        .filter((particle) => particle.life < particle.maxLife);

      particlesRef.current.forEach(drawParticle);
      frame = requestAnimationFrame(loop);
    }

    resize();
    spawn(22);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [activeIndex]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 opacity-90"
      style={{ mixBlendMode: "multiply" }}
      aria-hidden="true"
    />
  );
}
