"use client";

import { useEffect, useRef } from "react";

type ParticleLayerProps = {
  activeIndex: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
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

    function spawn(amount: number, biasY = height / 2) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      for (let index = 0; index < amount; index += 1) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: biasY + (Math.random() - 0.5) * 180,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8,
          life: 0,
          maxLife: 48 + Math.random() * 40,
          size: 4 + Math.random() * 7
        });
      }
    }

    function onScroll() {
      const current = window.scrollY;
      const delta = Math.abs(current - lastScrollRef.current);
      lastScrollRef.current = current;
      if (delta > 4) spawn(Math.min(10, Math.ceil(delta / 42)), height * (0.35 + Math.random() * 0.35));
    }

    function drawX(particle: Particle) {
      const alpha = 1 - particle.life / particle.maxLife;
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.life * 0.03);
      ctx.globalAlpha = alpha * 0.55;
      ctx.strokeStyle = particle.life % 7 < 2 ? "#FFB300" : "#0033A0";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-particle.size, -particle.size);
      ctx.lineTo(particle.size, particle.size);
      ctx.moveTo(particle.size, -particle.size);
      ctx.lineTo(-particle.size, particle.size);
      ctx.stroke();
      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
      particlesRef.current = particlesRef.current
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life + 1
        }))
        .filter((particle) => particle.life < particle.maxLife);
      particlesRef.current.forEach(drawX);
      frame = requestAnimationFrame(loop);
    }

    resize();
    spawn(16);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [activeIndex]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-30 opacity-90" aria-hidden="true" />;
}
