"use client";

import { useEffect, useRef } from "react";

// Animated topographic contour lines occupying roughly the left half of the
// parent. Three contour "features" (peaks) sit at fixed, well-spaced positions
// so their rings never overlap. Each peak is magnetically attracted toward the
// pointer when it comes near, then springs back. Rings also undulate gently
// over time. pointer-events-none and reduced-motion safe.

const RINGS = 6;

type Center = {
  hx: number; // home (fraction of W)
  hy: number; // home (fraction of H)
  x: number; // current px
  y: number;
  baseR: number;
  phase: number;
  a1: number;
  a2: number;
  k1: number;
  k2: number;
  speed: number;
};

export default function ContourLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Three fixed, well-spaced anchors (fractions of the canvas) so the
    // contour features sit comfortably apart and never overlap.
    const anchors = [
      { fx: 0.24, fy: 0.24 },
      { fx: 0.68, fy: 0.46 },
      { fx: 0.34, fy: 0.76 },
    ];
    const centers: Center[] = anchors.map((a, i) => ({
      hx: a.fx,
      hy: a.fy,
      x: 0,
      y: 0,
      baseR: 7.5,
      phase: i * 1.7,
      a1: 0.16 + (i % 3) * 0.03,
      a2: 0.09 + (i % 2) * 0.04,
      k1: 3 + (i % 3),
      k2: 5 + (i % 2),
      speed: 0.34 + i * 0.12,
    }));

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // seed current positions at home
      for (const c of centers) {
        c.x = c.hx * W;
        c.y = c.hy * H;
      }
    };
    resize();

    // Pointer in canvas-local coordinates (-9999 when away).
    let mx = -9999;
    let my = -9999;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const FIELD = 170; // magnetic reach (px)
    let t = 0;
    let raf = 0;

    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;

      const unit = Math.min(W, H) / 22;

      for (const c of centers) {
        const homeX = c.hx * W;
        const homeY = c.hy * H;

        if (!reduce) {
          // Magnetic pull toward the pointer when within the field.
          let tx = homeX;
          let ty = homeY;
          const d = Math.hypot(mx - homeX, my - homeY);
          if (mx > -9000 && d < FIELD) {
            const pull = 1 - d / FIELD;
            tx = homeX + (mx - homeX) * pull * 0.55;
            ty = homeY + (my - homeY) * pull * 0.55;
          }
          // ease toward target (spring)
          c.x += (tx - c.x) * 0.12;
          c.y += (ty - c.y) * 0.12;
        } else {
          c.x = homeX;
          c.y = homeY;
        }

        for (let r = 1; r <= RINGS; r++) {
          const rr = c.baseR * r * (unit / 9);
          const inner = 1 - r / RINGS;
          ctx.strokeStyle = `rgba(34,211,238,${0.05 + inner * 0.13})`;
          ctx.beginPath();
          const steps = 84;
          for (let s = 0; s <= steps; s++) {
            const ang = (s / steps) * Math.PI * 2;
            const perturb =
              1 +
              c.a1 * Math.sin(c.k1 * ang + t * c.speed + c.phase) +
              c.a2 * Math.sin(c.k2 * ang - t * c.speed * 0.7);
            const x = c.x + Math.cos(ang) * rr * perturb;
            const y = c.y + Math.sin(ang) * rr * perturb * 0.82;
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 h-full w-1/2"
    />
  );
}
