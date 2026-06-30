"use client";

import { useEffect, useRef } from "react";

// Canvas-based cursor effects for the Home page only:
//  - a trail of soft "smoke" particles following the pointer
//  - an expanding ripple + spark burst on click ("fireworks")
// Disabled on touch devices and when the user prefers reduced motion.
// The canvas is fixed, full-screen, and pointer-events-none so it never
// blocks interaction; the real cursor stays normal on every page.

type Smoke = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 -> 0
  size: number;
  hue: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
};

type Ripple = { x: number; y: number; r: number; life: number; hue: number };

export default function CursorEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip on touch / reduced-motion.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || touch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const smoke: Smoke[] = [];
    const sparks: Spark[] = [];
    const ripples: Ripple[] = [];

    let lastX = 0;
    let lastY = 0;
    let moved = false;
    let raf = 0;

    // Palette: cyan -> gold, matching the site theme.
    const pickHue = () => (Math.random() < 0.5 ? 188 : 42);

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (moved) {
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.hypot(dx, dy);
        // emit a few smoke puffs proportional to movement
        const count = Math.min(3, 1 + Math.floor(dist / 14));
        for (let i = 0; i < count; i++) {
          smoke.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: dx * 0.02 + (Math.random() - 0.5) * 0.4,
            vy: dy * 0.02 + (Math.random() - 0.5) * 0.4 - 0.3,
            life: 1,
            size: 8 + Math.random() * 14,
            hue: pickHue(),
          });
        }
      }
      lastX = x;
      lastY = y;
      moved = true;
    };

    const onClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const hue = pickHue();
      ripples.push({ x, y, r: 0, life: 1, hue });
      // firework spark burst
      const n = 22;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.3;
        const sp = 2.5 + Math.random() * 3.5;
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          hue: Math.random() < 0.5 ? hue : pickHue(),
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";

      // smoke
      for (let i = smoke.length - 1; i >= 0; i--) {
        const p = smoke[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.01; // drift up
        p.life -= 0.018;
        p.size += 0.4;
        if (p.life <= 0) {
          smoke.splice(i, 1);
          continue;
        }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        const a = p.life * 0.28;
        g.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${a})`);
        g.addColorStop(1, `hsla(${p.hue}, 90%, 65%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += 6;
        r.life -= 0.04;
        if (r.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `hsla(${r.hue}, 95%, 65%, ${r.life * 0.8})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.06; // gravity
        s.vx *= 0.98;
        s.vy *= 0.98;
        s.life -= 0.022;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `hsla(${s.hue}, 95%, 65%, ${s.life})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2 * s.life + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55]"
    />
  );
}
