"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Stats = { visits: number; downloads: number };

// Listens for download events dispatched from anywhere in the app so the badge
// updates instantly without re-fetching.
export const DOWNLOAD_EVENT = "stats:download";

export default function StatsBadge() {
  const pathname = usePathname();
  const [stats, setStats] = useState<Stats | null>(null);
  const lastCounted = useRef<string | null>(null);

  // Count a visit on every route change (one increment per navigation).
  useEffect(() => {
    let cancelled = false;

    async function countVisit() {
      // Guard against React Strict Mode double-invoking the effect for the
      // same path in development.
      if (lastCounted.current === pathname) return;
      lastCounted.current = pathname;

      try {
        const res = await fetch("/api/stats/visit", { method: "POST" });
        if (!res.ok) throw new Error("visit failed");
        const data: Stats = await res.json();
        if (!cancelled) setStats(data);
      } catch {
        // On failure, at least try to show the current totals.
        if (!cancelled) refresh();
      }
    }

    async function refresh() {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        const data: Stats = await res.json();
        if (!cancelled) setStats(data);
      } catch {
        /* ignore */
      }
    }

    countVisit();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Update the download number live when a download happens.
  useEffect(() => {
    function onDownload(e: Event) {
      const detail = (e as CustomEvent<Stats>).detail;
      if (detail) setStats(detail);
    }
    window.addEventListener(DOWNLOAD_EVENT, onDownload);
    return () => window.removeEventListener(DOWNLOAD_EVENT, onDownload);
  }, []);

  return (
    <div className="fixed left-3 top-3 z-[60] flex items-center gap-2 rounded-full border border-cyber-400/30 bg-rock-950/70 px-3 py-1.5 text-xs font-mono text-rock-300 shadow-glow-cyber backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-cyber-400/60 hover:shadow-[0_0_26px_-4px_rgba(34,211,238,0.7)]">
      <span className="flex items-center gap-1.5" title="Total page visits">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="tabular-nums text-rock-100">
          {stats ? stats.visits.toLocaleString("en-US") : "—"}
        </span>
      </span>

      <span className="h-3 w-px bg-cyber-400/30" aria-hidden />

      <span className="flex items-center gap-1.5" title="Total downloads">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="tabular-nums text-rock-100">
          {stats ? stats.downloads.toLocaleString("en-US") : "—"}
        </span>
      </span>
    </div>
  );
}
