"use client";

import { useState } from "react";

type Channel = {
  label: string;
  value: string;
  href: string;
};

export default function ContactChannels({ channels }: { channels: Channel[] }) {
  // Track which channel was last clicked so its text stays highlighted (yellow).
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  return (
    <ul className="space-y-4">
      {channels.map((c) => {
        const isActive = c.label === activeLabel;
        return (
          <li key={c.label}>
            <p className="text-xs font-mono uppercase tracking-wider text-rock-500">
              {c.label}
            </p>
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              onClick={() => setActiveLabel(c.label)}
              className={`mt-1 block text-sm break-words transition-colors hover:text-ore-400 ${
                isActive ? "text-ore-400" : "text-rock-100"
              }`}
            >
              {c.value}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
