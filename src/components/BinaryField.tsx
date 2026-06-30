"use client";

import { useEffect, useRef } from "react";

// A field of scattered 0s and 1s on a canvas filling its parent.
//  - Pointer motion pushes nearby digits sideways + forward, then they spring
//    back. The home position drifts slightly where the pointer passes, so the
//    field gently reshapes along the cursor's trail.
//  - A click sends out a circular shockwave (ripple) that pushes digits
//    radially outward as it expands.
// Decorative; pointer-events-none so it never blocks the header's links.
// Disabled for reduced-motion users (static field, no interaction).

type Digit = {
  ox: number; // original home (to limit drift)
  oy: number;
  hx: number; // current home
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  base: number;
};

type Ripple = { x: number; y: number; r: number };

export default function BinaryField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let digits: Digit[] = [];
    const ripples: Ripple[] = [];
    const GAP = 26;

    const build = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      digits = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          if (Math.random() < 0.35) continue; // sparse scatter
          digits.push({
            ox: x,
            oy: y,
            hx: x,
            hy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            char: Math.random() < 0.5 ? "0" : "1", // truly random 0/1
            base: 0.14 + Math.random() * 0.22,
          });
        }
      }
    };
    build();

    let mx = -9999;
    let my = -9999;
    let pmx = -9999;
    let pmy = -9999;
    let raf = 0;

    const local = (cx: number, cy: number) => {
      const rect = canvas.getBoundingClientRect();
      return { x: cx - rect.left, y: cy - rect.top, rect };
    };

    const onMove = (e: MouseEvent) => {
      const p = local(e.clientX, e.clientY);
      pmx = mx === -9999 ? p.x : mx;
      pmy = my === -9999 ? p.y : my;
      mx = p.x;
      my = p.y;
    };

    const onDown = (e: MouseEvent) => {
      const p = local(e.clientX, e.clientY);
      // only inside the field
      if (
        p.x < 0 ||
        p.y < 0 ||
        p.x > p.rect.width ||
        p.y > p.rect.height
      )
        return;
      ripples.push({ x: p.x, y: p.y, r: 0 });
      // tell the 2nd-section DEM terrain to explode with extra falling digits
      window.dispatchEvent(new CustomEvent("dem:burst"));
    };

    const RADIUS = 80;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "14px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // pointer velocity / direction
      let dirx = mx - pmx;
      let diry = my - pmy;
      const dlen = Math.hypot(dirx, diry) || 1;
      dirx /= dlen;
      diry /= dlen;
      const perpx = -diry;
      const perpy = dirx;

      // advance ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r += 7;
        if (ripples[i].r > 900) ripples.splice(i, 1);
      }

      for (const d of digits) {
        if (!reduce) {
          // pointer push
          const dx = d.x - mx;
          const dy = d.y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            const force = (1 - dist / RADIUS) * 3.2;
            const side = dx * perpx + dy * perpy >= 0 ? 1 : -1;
            d.vx += perpx * side * force + dirx * force * 0.8;
            d.vy += perpy * side * force + diry * force * 0.8;
            // drift the home a little toward the cursor trail (capped)
            d.hx += (mx - d.hx) * 0.01;
            d.hy += (my - d.hy) * 0.01;
            // never wander too far from the original slot
            d.hx = d.ox + Math.max(-GAP, Math.min(GAP, d.hx - d.ox));
            d.hy = d.oy + Math.max(-GAP, Math.min(GAP, d.hy - d.oy));
          }

          // shockwave push (radial, from each ripple's expanding ring)
          for (const w of ripples) {
            const rx = d.x - w.x;
            const ry = d.y - w.y;
            const rd = Math.hypot(rx, ry) || 1;
            const band = Math.abs(rd - w.r);
            if (band < 36) {
              const t = 1 - band / 36;
              const f = t * 2.6; // slightly gentler shockwave
              const nx = rx / rd;
              const ny = ry / rd;
              d.vx += nx * f;
              d.vy += ny * f;
              // shift the home a little outward along the blast direction, so
              // each shockwave permanently nudges the digits as it passes
              d.hx += nx * t * 1.2;
              d.hy += ny * t * 1.2;
              d.hx = d.ox + Math.max(-GAP * 1.5, Math.min(GAP * 1.5, d.hx - d.ox));
              d.hy = d.oy + Math.max(-GAP * 1.5, Math.min(GAP * 1.5, d.hy - d.oy));
            }
          }

          // spring home + damping
          d.vx += (d.hx - d.x) * 0.06;
          d.vy += (d.hy - d.y) * 0.06;
          d.vx *= 0.86;
          d.vy *= 0.86;
          d.x += d.vx;
          d.y += d.vy;
        }

        const disp = Math.hypot(d.x - d.hx, d.y - d.hy);
        const glow = Math.min(disp / 40, 1);
        const op = Math.min(1, d.base + glow * 0.6);
        ctx.fillStyle = `rgba(${Math.round(34 + glow * 90)}, 211, 238, ${op})`;
        ctx.fillText(d.char, d.x, d.y);
      }

      pmx = mx;
      pmy = my;
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("resize", build);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", build);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
