"use client";

import { useEffect, useRef } from "react";

// A small "satellite imagery upload" widget for the Downloads header. It cycles
// through spectral bands; for each band a thumbnail of the scene loads top-to-
// bottom (with a scan line) like a file uploading, while a filename + progress
// bar fill, and finished bands stack below as completed files. Decorative,
// pointer-events-none, reduced-motion safe.

const BANDS = [
  { id: "B2", name: "Blue", rgb: [70, 130, 245] },
  { id: "B3", name: "Green", rgb: [70, 200, 120] },
  { id: "B4", name: "Red", rgb: [235, 90, 80] },
  { id: "B8", name: "NIR", rgb: [230, 80, 165] },
  { id: "B11", name: "SWIR", rgb: [240, 165, 60] },
];

const COLS = 26;
const ROWS = 16;
const BAND_MS = 3200;

export default function SpectralUpload() {
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

    // Deterministic scene reflectance (terrain-ish clusters), 0..1.
    const val = new Float32Array(COLS * ROWS);
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const n =
          Math.sin(i * 0.6 + j * 0.4) * 0.5 +
          Math.sin(i * 0.23 - j * 0.5) * 0.3 +
          Math.sin((i + j) * 0.9) * 0.2;
        val[j * COLS + i] = Math.min(1, Math.max(0.12, 0.5 + n * 0.45));
      }
    }

    let raf = 0;
    let startT = 0;

    const render = (now: number) => {
      if (!startT) startT = now;
      const elapsed = now - startT;
      const totalDone = Math.floor(elapsed / BAND_MS);
      const bandIndex = totalDone % BANDS.length;
      const progress = (elapsed % BAND_MS) / BAND_MS;
      const band = BANDS[bandIndex];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const p = 16;
      const tileW = Math.min(190, Math.max(120, W - p * 2));
      const tileH = tileW * 0.58;
      const lineH = 13;
      const blockH = tileH + 14 + lineH + 8 + 6 + 14 + 3 * lineH;
      let ty = Math.max(p, H - p - blockH);
      const tx = p;

      // --- thumbnail: scene loads top -> bottom for the current band ---
      const cw = tileW / COLS;
      const ch = tileH / ROWS;
      const revealRows = progress * ROWS;
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const v = val[j * COLS + i];
          let a: number;
          if (j < Math.floor(revealRows)) a = 1;
          else if (j < revealRows) a = revealRows - j;
          else a = 0;
          const [r, g, b] = band.rgb;
          ctx.fillStyle =
            a <= 0
              ? "rgba(120,140,160,0.06)"
              : `rgba(${Math.round(r * v)},${Math.round(g * v)},${Math.round(b * v)},${0.2 + a * 0.8})`;
          ctx.fillRect(tx + i * cw, ty + j * ch, cw + 0.6, ch + 0.6);
        }
      }
      // scan line at the loading front
      if (!reduce && revealRows < ROWS) {
        const sy = ty + revealRows * ch;
        ctx.strokeStyle = "rgba(103,232,249,0.95)";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tx, sy);
        ctx.lineTo(tx + tileW, sy);
        ctx.stroke();
      }
      // frame + band label
      ctx.strokeStyle = "rgba(34,211,238,0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(tx, ty, tileW, tileH);
      ctx.fillStyle = "rgba(10,14,20,0.55)";
      ctx.fillRect(tx, ty, 78, 16);
      ctx.fillStyle = "rgba(205,232,250,0.95)";
      ctx.font = "10px var(--font-mono, monospace)";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`${band.id} · ${band.name}`, tx + 5, ty + 8);

      // --- uploading file row (name + progress bar + %) ---
      let ry = ty + tileH + 14;
      ctx.fillStyle = "rgba(205,232,250,0.92)";
      ctx.font = "11px var(--font-mono, monospace)";
      ctx.fillText(`S2_${band.id}_${band.name.toUpperCase()}.tif`, tx, ry);
      ctx.fillStyle = "rgba(34,211,238,0.85)";
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(progress * 100)}%`, tx + tileW, ry);
      ctx.textAlign = "left";

      const barY = ry + 9;
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(tx, barY, tileW, 4);
      ctx.fillStyle = "rgba(34,211,238,0.85)";
      ctx.fillRect(tx, barY, tileW * progress, 4);

      // --- completed bands (uploaded files) ---
      ry = barY + 16;
      ctx.font = "10px var(--font-mono, monospace)";
      for (let k = 1; k <= 3; k++) {
        if (totalDone - k < 0) break;
        const b = BANDS[((bandIndex - k) % BANDS.length + BANDS.length) % BANDS.length];
        const yy = ry + (k - 1) * lineH;
        // check tick
        ctx.strokeStyle = "rgba(70,200,120,0.9)";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(tx, yy);
        ctx.lineTo(tx + 3, yy + 3);
        ctx.lineTo(tx + 8, yy - 3);
        ctx.stroke();
        ctx.fillStyle = "rgba(160,185,200,0.6)";
        ctx.textBaseline = "middle";
        ctx.fillText(`S2_${b.id}_${b.name.toUpperCase()}.tif  ✓`, tx + 14, yy);
      }

      if (!reduce) raf = requestAnimationFrame(render);
    };

    if (reduce) {
      startT = -BAND_MS * 0.6;
      render(0);
    } else {
      raf = requestAnimationFrame(render);
    }
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-[1] h-full w-2/5"
    />
  );
}
