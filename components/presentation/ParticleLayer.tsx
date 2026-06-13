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

      if (delta > 4) {
        spawn(
          Math.min(10, Math.ceil(delta / 42)),
          height * (0.35 + Math.random() * 0.35)
        );
      }
    }

    function drawAtomParticle(particle: Particle) {
      const alpha = 1 - particle.life / particle.maxLife;
      const size = particle.size * 1.8;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.life * 0.025);

      ctx.globalAlpha = Math.min(0.62, alpha * 0.58);
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#0033A0";

      // Elektronenbahnen
      ctx.strokeStyle = particle.life % 7 < 2 ? "#FFB300" : "#0033A0";
      ctx.lineWidth = 1.8;

      for (let orbit = 0; orbit < 3; orbit += 1) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * orbit);
        ctx.scale(1.55, 0.48);
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Atomkern
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#FFB300";
      ctx.fillStyle = "#FFB300";
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(4, particle.size * 0.42), 0, Math.PI * 2);
      ctx.fill();

      // Elektron
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#0033A0";
      ctx.fillStyle = "#0033A0";
      ctx.beginPath();
      ctx.arc(size * 1.55, 0, 3.4, 0, Math.PI * 2);
      ctx.fill();

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

      particlesRef.current.forEach(drawAtomParticle);
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

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 opacity-90"
      aria-hidden="true"
    />
  );
}
