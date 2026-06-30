"use client";

import { useEffect, useRef } from "react";

// Site-wide magnetic cursor:
//  - a custom ring follows the pointer
//  - when the pointer nears an interactive element (button / link / [data-magnetic]),
//    the ring is pulled toward that element's center and grows, and the element
//    itself is nudged slightly toward the cursor ("magnetic" attraction)
// Disabled on touch devices and when the user prefers reduced motion (there the
// native cursor stays completely normal and nothing is rendered).

const SELECTOR =
  "a, button, [role='button'], input[type='submit'], .btn, .btn-primary, .btn-ghost, [data-magnetic]";

// How far (px) from an element's center the magnetic field reaches.
const RADIUS = 90;

export default function MagneticCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || touch) return;

    const ring = ringRef.current;
    if (!ring) return;

    // Mark <html> so we can hide the native cursor only when this is active.
    document.documentElement.classList.add("has-magnetic-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    // Track the element currently being attracted so we can reset its transform.
    let pulled: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const nearestTarget = (): { el: HTMLElement; cx: number; cy: number; d: number } | null => {
      const node = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      const el = node?.closest(SELECTOR) as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(mouseX - cx, mouseY - cy);
      // Field reaches a bit beyond the element's own size.
      const reach = Math.max(r.width, r.height) / 2 + RADIUS;
      if (d > reach) return null;
      return { el, cx, cy, d };
    };

    const tick = () => {
      const target = nearestTarget();

      // Reset a previously-pulled element if it's no longer the target.
      if (pulled && (!target || target.el !== pulled)) {
        pulled.style.transform = "";
        pulled.style.transition = "transform 250ms ease-out";
        pulled = null;
      }

      let destX = mouseX;
      let destY = mouseY;
      let scale = 1;

      if (target) {
        // Pull strength grows as the cursor gets closer to the center.
        const reach = Math.max(target.el.getBoundingClientRect().width, target.el.getBoundingClientRect().height) / 2 + RADIUS;
        const pull = 1 - Math.min(target.d / reach, 1); // 0..1
        // Ring is attracted toward the element center.
        destX = mouseX + (target.cx - mouseX) * pull * 0.6;
        destY = mouseY + (target.cy - mouseY) * pull * 0.6;
        scale = 1 + pull * 1.4;

        // Nudge the element toward the cursor.
        const nudge = 0.22 * pull;
        target.el.style.transition = "transform 120ms ease-out";
        target.el.style.transform = `translate(${(mouseX - target.cx) * nudge}px, ${(mouseY - target.cy) * nudge}px)`;
        pulled = target.el;
      }

      // Smoothly ease the ring toward its destination.
      ringX += (destX - ringX) * 0.2;
      ringY += (destY - ringY) * 0.2;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${scale})`;
      ring.style.borderColor = target
        ? "rgba(34,211,238,0.9)"
        : "rgba(34,211,238,0.45)";

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      if (pulled) pulled.style.transform = "";
      document.documentElement.classList.remove("has-magnetic-cursor");
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[65] h-8 w-8 rounded-full border-2 border-cyber-400/50 shadow-glow-cyber [transition:border-color_150ms_ease-out] will-change-transform"
    />
  );
}
