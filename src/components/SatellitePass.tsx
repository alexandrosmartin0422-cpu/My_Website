"use client";

import { useEffect, useRef } from "react";

// A satellite riding a curved orbital arc. Its scanning beam has a FIXED angle
// and length and always points straight down — so it reads as the satellite
// scanning the ground directly beneath itself, consistently. The 3D feel comes
// from the curved path and the satellite growing/brightening near the apex.
// At the scan footprint, a DEM-extraction effect fires intermittently: data
// bits stream up the beam and a small terrain patch is sampled — for realism.
//  - dir "ne": bottom-left -> top-right    - dir "nw": bottom-right -> top-left
// Decorative, pointer-events-none, reduced-motion safe.

const PERIOD = 16000; // ms per pass
const BEAM_LEN = 78; // fixed scan distance (px)
const BEAM_HALF = 30; // fixed scan half-width at the ground (fixed angle)
const EXTRACT_EVERY = 2400; // ms between DEM samplings

type Bit = { x: number; y: number; vy: number; life: number; ch: string };

export default function SatellitePass({
  dir = "ne",
  delay = 0,
}: {
  dir?: "ne" | "nw";
  delay?: number;
}) {
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

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const m = 0.2;
    const at = (p: number) => {
      const sy = (1 + m) * H;
      const ey = -m * H;
      const sx = dir === "ne" ? -m * W : (1 + m) * W;
      const ex = dir === "ne" ? (1 + m) * W : -m * W;
      const lx = sx + (ex - sx) * p;
      const ly = sy + (ey - sy) * p;
      const bow = Math.sin(p * Math.PI) * H * 0.32;
      return { x: lx, y: ly - bow };
    };
    const depthAt = (p: number) => Math.sin(p * Math.PI);

    const drawSat = (x: number, y: number, s: number, a: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      ctx.globalAlpha = a;
      ctx.fillStyle = "rgba(220,240,252,0.95)";
      ctx.fillRect(-3, -3, 6, 6);
      ctx.fillStyle = "rgba(34,211,238,0.6)";
      ctx.fillRect(-13, -2.4, 8, 4.8);
      ctx.fillRect(5, -2.4, 8, 4.8);
      ctx.strokeStyle = "rgba(34,211,238,0.45)";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-13, -2.4, 8, 4.8);
      ctx.strokeRect(5, -2.4, 8, 4.8);
      ctx.restore();
    };

    const bits: Bit[] = [];
    let lastExtract = 0;
    let extractUntil = 0;
    let raf = 0;
    let startT = 0;

    const render = (now: number) => {
      if (!startT) startT = now - delay;
      const p = ((now - startT) % PERIOD) / PERIOD;
      const sat = at(p);
      const depth = depthAt(p);
      const s = 0.55 + depth * 0.95;
      const bright = 0.45 + depth * 0.5;

      // footprint: fixed distance straight below the satellite
      const fx = sat.x;
      const fy = sat.y + BEAM_LEN;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // faint curved orbital track
      ctx.strokeStyle = "rgba(34,211,238,0.10)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      for (let q = 0; q <= 1.0001; q += 0.02) {
        const a = at(q);
        if (q === 0) ctx.moveTo(a.x, a.y);
        else ctx.lineTo(a.x, a.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // FIXED scan beam (constant angle + length) straight down
      const topY = sat.y + 3;
      const grad = ctx.createLinearGradient(0, topY, 0, fy);
      grad.addColorStop(0, "rgba(34,211,238,0.22)");
      grad.addColorStop(1, "rgba(34,211,238,0.02)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(sat.x - 3, topY);
      ctx.lineTo(sat.x + 3, topY);
      ctx.lineTo(fx + BEAM_HALF, fy);
      ctx.lineTo(fx - BEAM_HALF, fy);
      ctx.closePath();
      ctx.fill();

      // scan line sweeping the fixed beam
      const scanP = (now % 1400) / 1400;
      const scanY = topY + scanP * (fy - topY);
      const halfAtScan = 3 + (BEAM_HALF - 3) * scanP;
      ctx.strokeStyle = `rgba(103,232,249,${0.55 * (1 - scanP)})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(sat.x - halfAtScan, scanY);
      ctx.lineTo(sat.x + halfAtScan, scanY);
      ctx.stroke();

      // footprint ellipse (fixed size)
      const pulse = 0.5 + 0.5 * Math.sin(now / 320);
      ctx.strokeStyle = `rgba(34,211,238,${0.18 + pulse * 0.18})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(fx, fy, BEAM_HALF * (0.85 + pulse * 0.15), 6, 0, 0, Math.PI * 2);
      ctx.stroke();

      // --- intermittent DEM extraction ---
      if (!reduce && now - lastExtract > EXTRACT_EVERY) {
        lastExtract = now;
        extractUntil = now + 1000;
        const n = 7;
        for (let i = 0; i < n; i++) {
          bits.push({
            x: fx + (Math.random() - 0.5) * BEAM_HALF * 1.4,
            y: fy - Math.random() * 6,
            vy: -(0.7 + Math.random() * 0.9),
            life: 1,
            ch: Math.random() < 0.5 ? "0" : "1",
          });
        }
      }

      // sampled terrain patch (small wavy contour lines) while extracting
      if (now < extractUntil) {
        const k = (extractUntil - now) / 1000; // 1 -> 0
        ctx.strokeStyle = `rgba(103,232,249,${0.5 * k})`;
        ctx.lineWidth = 1;
        for (let r = 0; r < 3; r++) {
          ctx.beginPath();
          const yy = fy - 2 - r * 4;
          for (let xx = -BEAM_HALF * 0.8; xx <= BEAM_HALF * 0.8; xx += 4) {
            const yo = Math.sin((xx + now / 90 + r * 2) * 0.4) * 2;
            const px = fx + xx;
            const py = yy + yo;
            if (xx === -Math.floor(BEAM_HALF * 0.8)) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      // data bits streaming UP the beam (toward the satellite)
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        b.y += b.vy;
        b.x += (sat.x - b.x) * 0.02; // converge toward the beam axis
        b.life -= 0.02;
        if (b.life <= 0 || b.y < sat.y) {
          bits.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(103,232,249,${b.life})`;
        ctx.font = "9px var(--font-mono, monospace)";
        ctx.textAlign = "center";
        ctx.fillText(b.ch, b.x, b.y);
      }

      // satellite glow + body (depth-scaled => 3D feel)
      ctx.shadowColor = "rgba(34,211,238,0.85)";
      ctx.shadowBlur = 6 + depth * 8;
      drawSat(sat.x, sat.y, s, bright + 0.3);
      ctx.shadowBlur = 0;

      if (!reduce) raf = requestAnimationFrame(render);
    };

    if (reduce) {
      startT = -PERIOD * 0.5 - delay;
      render(0);
    } else {
      raf = requestAnimationFrame(render);
    }
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [dir, delay]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
