"use client";

import { useEffect, useRef } from "react";

type AtomParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  phase: number;
};

const COLORS = {
  white: "#FFFFFF",
  blue: "#0033A0",
  orange: "#FFB300"
};

export function ParticleLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasNode = canvas;
    const context = canvasNode.getContext("2d");
    if (!context) return;
    const ctx = context;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let tick = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let atoms: AtomParticle[] = [];

    function createAtom(index: number): AtomParticle {
      const size = 22 + Math.random() * 8;
      const margin = size * 2;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.28 + Math.random() * 0.24;

      return {
        x: margin + Math.random() * Math.max(1, width - margin * 2),
        y: margin + Math.random() * Math.max(1, height - margin * 2),
        vx: Math.cos(angle) * speed || (index ? 0.35 : -0.35),
        vy: Math.sin(angle) * speed || (index ? -0.28 : 0.28),
        size,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.006,
        phase: Math.random() * Math.PI * 2
      };
    }

    function resize() {
      const previousWidth = width || window.innerWidth;
      const previousHeight = height || window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvasNode.width = width * ratio;
      canvasNode.height = height * ratio;
      canvasNode.style.width = `${width}px`;
      canvasNode.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      atoms = atoms.map((atom) => ({
        ...atom,
        x: Math.min(width - atom.size * 2, Math.max(atom.size * 2, atom.x * (width / previousWidth))),
        y: Math.min(height - atom.size * 2, Math.max(atom.size * 2, atom.y * (height / previousHeight)))
      }));
    }

    function updateAtom(atom: AtomParticle) {
      if (reduceMotion) return;
      const margin = atom.size * 1.8;
      atom.x += atom.vx + Math.sin(tick * 0.009 + atom.phase) * 0.07;
      atom.y += atom.vy + Math.cos(tick * 0.007 + atom.phase) * 0.07;
      atom.rotation += atom.spin;

      if (atom.x <= margin || atom.x >= width - margin) {
        atom.vx *= -1;
        atom.x = Math.min(width - margin, Math.max(margin, atom.x));
      }
      if (atom.y <= margin || atom.y >= height - margin) {
        atom.vy *= -1;
        atom.y = Math.min(height - margin, Math.max(margin, atom.y));
      }
    }

    function drawAtom(atom: AtomParticle) {
      const radius = atom.size;
      const electronTime = reduceMotion ? atom.phase : tick * 0.025 + atom.phase;

      ctx.save();
      ctx.translate(atom.x, atom.y);
      ctx.rotate(atom.rotation);
      ctx.globalAlpha = 0.82;
      ctx.strokeStyle = COLORS.blue;
      ctx.lineWidth = 1.45;
      ctx.shadowBlur = 7;
      ctx.shadowColor = COLORS.white;

      for (let orbit = 0; orbit < 3; orbit += 1) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * orbit);
        ctx.scale(1.58, 0.5);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.shadowBlur = 12;
      ctx.shadowColor = COLORS.orange;
      ctx.fillStyle = COLORS.orange;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(3.5, radius * 0.19), 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 6;
      ctx.shadowColor = COLORS.blue;
      ctx.fillStyle = COLORS.blue;
      for (let electron = 0; electron < 3; electron += 1) {
        const angle = electronTime + electron * ((Math.PI * 2) / 3);
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * radius * 1.5, Math.sin(angle) * radius * 0.56, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);
      tick += 1;
      atoms.forEach((atom) => {
        updateAtom(atom);
        drawAtom(atom);
      });
      frame = requestAnimationFrame(loop);
    }

    resize();
    atoms = [createAtom(0), createAtom(1)];
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-30 opacity-[0.62]" aria-hidden="true" />;
}
