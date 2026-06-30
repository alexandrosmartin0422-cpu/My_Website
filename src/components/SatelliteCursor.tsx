"use client";

import { useEffect, useRef } from "react";

// Projects-page custom cursor shaped like the flying satellites: a satellite
// floats above the pointer and aims a fixed scan beam straight down to the
// pointer position — which IS the click point (the beam footprint). On click,
// 0/1 digits burst outward and a small DEM contour "logo" is sampled at the
// footprint, then fades. Disabled on touch / reduced-motion (native cursor).

const BEAM_LEN = 72; // distance from satellite down to the footprint (click)
const BEAM_HALF = 26;

type Bit = { x: number; y: number; vx: number; vy: number; life: number; ch: string };
type Patch = { x: number; y: number; r: number; life: number };

export default function SatelliteCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

    let mx = -9999;
    let my = -9999;
    const bits: Bit[] = [];
    const patches: Patch[] = [];
    // 0/1 tail trailing behind the satellite
    const trail: { x: number; y: number; ch: string; life: number; size: number }[] = [];
    let lastTrailX = -9999;
    let lastTrailY = -9999;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const onDown = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY; // footprint = click point
      // digit burst
      const n = 20;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.3;
        const sp = 1.6 + Math.random() * 2.6;
        bits.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          ch: Math.random() < 0.5 ? "0" : "1",
        });
      }
      // DEM contour patch
      patches.push({ x, y, r: 4, life: 1 });
    };

    const drawSat = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.shadowColor = "rgba(34,211,238,0.85)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "rgba(225,242,252,0.97)";
      ctx.fillRect(-3.5, -3.5, 7, 7);
      ctx.fillStyle = "rgba(34,211,238,0.7)";
      ctx.fillRect(-14, -2.6, 9, 5.2);
      ctx.fillRect(5, -2.6, 9, 5.2);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(34,211,238,0.5)";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-14, -2.6, 9, 5.2);
      ctx.strokeRect(5, -2.6, 9, 5.2);
      ctx.restore();
    };

    let raf = 0;
    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mx > -9000) {
        const sx = mx;
        const sy = my - BEAM_LEN; // satellite floats above the click point
        const topY = sy + 4;

        // fixed scan beam down to the footprint (= cursor / click point)
        const grad = ctx.createLinearGradient(0, topY, 0, my);
        grad.addColorStop(0, "rgba(34,211,238,0.22)");
        grad.addColorStop(1, "rgba(34,211,238,0.03)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(sx - 3, topY);
        ctx.lineTo(sx + 3, topY);
        ctx.lineTo(mx + BEAM_HALF, my);
        ctx.lineTo(mx - BEAM_HALF, my);
        ctx.closePath();
        ctx.fill();

        // sweeping scan line
        const scanP = (now % 1300) / 1300;
        const scanY = topY + scanP * (my - topY);
        const half = 3 + (BEAM_HALF - 3) * scanP;
        ctx.strokeStyle = `rgba(103,232,249,${0.55 * (1 - scanP)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(sx - half, scanY);
        ctx.lineTo(sx + half, scanY);
        ctx.stroke();

        // footprint reticle at the exact click point
        const pulse = 0.5 + 0.5 * Math.sin(now / 260);
        ctx.strokeStyle = `rgba(34,211,238,${0.35 + pulse * 0.25})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(mx, my, BEAM_HALF * (0.7 + pulse * 0.2), 5.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        // crosshair tick
        ctx.beginPath();
        ctx.moveTo(mx - 5, my);
        ctx.lineTo(mx + 5, my);
        ctx.stroke();

        // tail starts at the very bottom of the cursor — the beam footprint /
        // click point, where the digits burst on click
        const tailX = mx;
        const tailY = my;
        if (lastTrailX < -9000) {
          lastTrailX = tailX;
          lastTrailY = tailY;
        }
        const moved = Math.hypot(tailX - lastTrailX, tailY - lastTrailY);
        if (moved > 6) {
          const steps = Math.min(4, Math.floor(moved / 6));
          for (let k = 1; k <= steps; k++) {
            const t = k / steps;
            trail.push({
              x: lastTrailX + (tailX - lastTrailX) * t + (Math.random() - 0.5) * 5,
              y: lastTrailY + (tailY - lastTrailY) * t + (Math.random() - 0.5) * 5,
              ch: Math.random() < 0.5 ? "0" : "1",
              life: 1,
              size: 8 + Math.random() * 4,
            });
          }
          lastTrailX = tailX;
          lastTrailY = tailY;
        }

        // draw + fade the tail behind the satellite body
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = trail.length - 1; i >= 0; i--) {
          const d = trail[i];
          d.life -= 0.02;
          d.y += 0.25; // gentle drift
          if (d.life <= 0) {
            trail.splice(i, 1);
            continue;
          }
          ctx.font = `${d.size}px var(--font-mono, monospace)`;
          ctx.fillStyle = `rgba(103,232,249,${d.life * 0.7})`;
          ctx.fillText(d.ch, d.x, d.y);
        }

        drawSat(sx, sy);
      }

      // DEM contour patches (terrain "logo") from clicks
      for (let i = patches.length - 1; i >= 0; i--) {
        const pt = patches[i];
        pt.r += 1.4;
        pt.life -= 0.025;
        if (pt.life <= 0) {
          patches.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(103,232,249,${pt.life * 0.6})`;
        ctx.lineWidth = 1;
        for (let r = 0; r < 3; r++) {
          ctx.beginPath();
          const rr = pt.r + r * 7;
          for (let s = 0; s <= 40; s++) {
            const ang = (s / 40) * Math.PI * 2;
            const wob = Math.sin(ang * 4 + now / 120 + r) * 2.4;
            const px = pt.x + Math.cos(ang) * (rr + wob);
            const py = pt.y + Math.sin(ang) * (rr + wob) * 0.5;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // 0/1 digits bursting from the click
      ctx.font = "11px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.04;
        b.vx *= 0.98;
        b.vy *= 0.98;
        b.life -= 0.02;
        if (b.life <= 0) {
          bits.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(103,232,249,${b.life})`;
        ctx.fillText(b.ch, b.x, b.y);
      }

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[66]"
    />
  );
}
