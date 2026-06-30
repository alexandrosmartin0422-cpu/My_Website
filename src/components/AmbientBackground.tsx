"use client";

import { useEffect, useRef } from "react";

// Fixed, site-wide futuristic backdrop: a faint tech grid plus two slowly
// pulsing glow orbs (gold + cyan). On scroll, each layer shifts at a different
// rate for a parallax effect. Purely decorative and non-interactive.
export default function AmbientBackground() {
  const gridRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const cyanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect users who prefer reduced motion: skip the scroll parallax.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      // Each layer moves at a different fraction of the scroll for depth.
      if (gridRef.current)
        gridRef.current.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
      if (goldRef.current)
        goldRef.current.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
      if (cyanRef.current)
        cyanRef.current.style.transform = `translate3d(0, ${y * -0.25}px, 0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-rock-950"
    >
      {/* Tech grid (parallax) */}
      <div
        ref={gridRef}
        className="absolute inset-0 -top-24 bottom-[-6rem] bg-grid-fade bg-grid will-change-transform [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      {/* Gold glow orb (parallax) */}
      <div
        ref={goldRef}
        className="absolute -left-40 top-[-10%] h-[36rem] w-[36rem] animate-pulse-glow rounded-full bg-ore-500/10 blur-[120px] will-change-transform"
      />

      {/* Cyan glow orb (parallax, opposite direction) */}
      <div
        ref={cyanRef}
        className="absolute -right-40 bottom-[-10%] h-[40rem] w-[40rem] animate-pulse-glow rounded-full bg-cyber-500/10 blur-[130px] will-change-transform"
      />

      {/* Top vignette so the navbar reads cleanly */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-rock-950 to-transparent" />
    </div>
  );
}
