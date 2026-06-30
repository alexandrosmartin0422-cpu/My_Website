"use client";

import { useEffect, useRef } from "react";

// A living wireframe DEM terrain. Streams of 0/1 digits fall slowly from the
// top and get "absorbed" into the nearest terrain vertex; each absorption bumps
// that vertex's height strongly, so the terrain visibly reshapes (plus a slow
// ambient undulation). Shaded faces + depth give it a 3D feel. A "dem:burst"
// window event (dispatched when the header field is clicked) spawns an
// explosion of extra falling digits. Reduced-motion users get one static frame.

const COLS = 46;
const ROWS = 20;
const MAX_DIGITS = 360;

type Digit = { x: number; y: number; vi: number; char: string; scale: number };

export default function DemTerrain() {
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

    const baseH = new Float32Array(COLS * ROWS);
    const offH = new Float32Array(COLS * ROWS);

    const noise = (i: number, j: number) => {
      const ndx = i / (COLS - 1) - 0.5;
      const ridge = Math.exp(-(ndx * ndx) * 5);
      const detail =
        Math.sin(i * 0.55 + j * 0.3) * 0.5 +
        Math.sin(i * 0.21 - j * 0.5) * 0.5 +
        Math.sin(i * 0.9 + j * 0.15) * 0.25;
      const ramp = 1 - j / (ROWS - 1);
      return ridge * (0.6 + 0.4 * ramp) + detail * 0.18 * ridge;
    };
    for (let j = 0; j < ROWS; j++)
      for (let i = 0; i < COLS; i++) baseH[j * COLS + i] = noise(i, j);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      W = parent.clientWidth;
      H = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let t = 0;
    const heightAt = (idx: number, i: number, j: number) => {
      const wave =
        Math.sin(i * 0.4 + t) * 0.04 + Math.sin(j * 0.5 - t * 0.8) * 0.04;
      return baseH[idx] + wave + offH[idx] / (H * 0.34 || 1);
    };
    const project = (i: number, j: number) => {
      const rowT = j / (ROWS - 1);
      const nearY = H * 0.98;
      const farY = H * 0.3;
      const baseY = nearY + (farY - nearY) * rowT;
      const cx = W / 2;
      const scaleX = 1 - 0.32 * rowT;
      const x = cx + ((i / (COLS - 1) - 0.5) * W) * scaleX;
      const amp = H * 0.34;
      const h = heightAt(j * COLS + i, i, j) * amp;
      return { x, y: baseY - h, hr: h / amp, rowT };
    };

    const digits: Digit[] = [];
    const spawn = () => {
      digits.push({
        x: Math.random() * W,
        y: -10 - Math.random() * H * 0.4, // above the top
        vi: Math.floor(Math.random() * COLS * ROWS),
        char: Math.random() < 0.5 ? "0" : "1",
        scale: 1,
      });
    };
    for (let k = 0; k < 80; k++) spawn();

    // Explosion of digits when the header binary field is clicked (2x).
    const onBurst = () => {
      const n = 120;
      for (let k = 0; k < n && digits.length < MAX_DIGITS; k++) spawn();
    };
    window.addEventListener("dem:burst", onBurst);

    // Regional, smooth deformation: an absorbed digit lifts ("1") or lowers
    // ("0") a whole area around the vertex it hits — not a single sharp spike.
    // So areas hit by more 1s rise and areas hit by more 0s sink.
    const deform = (vi: number, sign: number) => {
      const ci = vi % COLS;
      const cj = Math.floor(vi / COLS);
      const A = 9 * sign;
      const sigma = 2.4;
      const rad = 6;
      const lim = H * 0.34 * 0.75;
      for (let dj = -rad; dj <= rad; dj++) {
        const jj = cj + dj;
        if (jj < 0 || jj >= ROWS) continue;
        for (let di = -rad; di <= rad; di++) {
          const ii = ci + di;
          if (ii < 0 || ii >= COLS) continue;
          const f = Math.exp(-(di * di + dj * dj) / (2 * sigma * sigma));
          const idx = jj * COLS + ii;
          offH[idx] = Math.max(-lim, Math.min(lim, offH[idx] + A * f));
        }
      }
    };

    let raf = 0;
    const FALL = 0.65; // slow fall speed

    const frame = () => {
      t += 0.012;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let k = 0; k < offH.length; k++) offH[k] *= 0.99;

      // --- shaded faces for a 3D look ---
      for (let j = 0; j < ROWS - 1; j++) {
        for (let i = 0; i < COLS - 1; i++) {
          const a = project(i, j);
          const b = project(i + 1, j);
          const c = project(i + 1, j + 1);
          const d = project(i, j + 1);
          const hr = (a.hr + b.hr + c.hr + d.hr) / 4;
          const depth = 0.35 + 0.65 * (1 - a.rowT); // nearer = brighter
          const alpha = Math.max(0, Math.min(0.22, hr * 0.28)) * depth;
          if (alpha <= 0.01) continue;
          ctx.fillStyle = `rgba(40,200,235,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.lineTo(c.x, c.y);
          ctx.lineTo(d.x, d.y);
          ctx.closePath();
          ctx.fill();
        }
      }

      // --- wireframe, brighter at the front and on the peaks ---
      ctx.lineWidth = 1;
      for (let j = 0; j < ROWS; j++) {
        const depth = 0.1 + 0.22 * (1 - j / (ROWS - 1));
        ctx.strokeStyle = `rgba(205,232,250,${depth})`;
        ctx.beginPath();
        for (let i = 0; i < COLS; i++) {
          const p = project(i, j);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (let i = 0; i < COLS; i++) {
        ctx.strokeStyle = "rgba(205,232,250,0.12)";
        ctx.beginPath();
        for (let j = 0; j < ROWS; j++) {
          const p = project(i, j);
          if (j === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // --- falling digits absorbed into the mesh ---
      ctx.font = "13px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let k = digits.length - 1; k >= 0; k--) {
        const d = digits[k];
        const ti = d.vi % COLS;
        const tj = Math.floor(d.vi / COLS);
        const target = project(ti, tj);

        if (!reduce) {
          // ease horizontally toward the target column, fall slowly
          d.x += (target.x - d.x) * 0.02;
          d.y += FALL;
          const remaining = target.y - d.y;
          d.scale = Math.max(0, Math.min(1, Math.abs(remaining) / 70));

          // absorbed when it reaches the terrain surface
          if (d.y >= target.y - 3 && Math.abs(target.x - d.x) < 16) {
            // "1" raises the area, "0" lowers it (smooth, regional)
            deform(d.vi, d.char === "1" ? 1 : -1);
            // respawn from the top
            d.x = Math.random() * W;
            d.y = -10 - Math.random() * H * 0.4;
            d.vi = Math.floor(Math.random() * COLS * ROWS);
            d.char = Math.random() < 0.5 ? "0" : "1";
            d.scale = 1;
            continue;
          }
          // fell past the bottom (missed) -> respawn, trim bursts back down
          if (d.y > H + 20) {
            if (digits.length > 80) {
              digits.splice(k, 1);
              continue;
            }
            d.x = Math.random() * W;
            d.y = -10 - Math.random() * H * 0.4;
            d.vi = Math.floor(Math.random() * COLS * ROWS);
          }
        }

        const op = 0.3 + d.scale * 0.55;
        ctx.fillStyle = `rgba(34,211,238,${op})`;
        ctx.save();
        ctx.translate(d.x, d.y);
        const s = d.scale * 0.6 + 0.45;
        ctx.scale(s, s);
        ctx.fillText(d.char, 0, 0);
        ctx.restore();
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };

    window.addEventListener("resize", resize);
    frame();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("dem:burst", onBurst);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}
