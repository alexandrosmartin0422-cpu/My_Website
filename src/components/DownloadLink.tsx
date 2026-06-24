"use client";

import { DOWNLOAD_EVENT } from "./StatsBadge";

type Stats = { visits: number; downloads: number };

// A download anchor that records the download in the global counter, then
// lets the browser proceed with the file download as normal.
export default function DownloadLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  async function handleClick() {
    try {
      const res = await fetch("/api/stats/download", { method: "POST" });
      if (res.ok) {
        const data: Stats = await res.json();
        // Tell the badge to update its download number immediately.
        window.dispatchEvent(new CustomEvent(DOWNLOAD_EVENT, { detail: data }));
      }
    } catch {
      // Counting is best-effort; never block the actual download.
    }
  }

  return (
    <a href={href} download className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
