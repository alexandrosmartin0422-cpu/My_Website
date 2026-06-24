// Server-only stats store backed by a JSON file.
//
// This keeps two global counters: total site visits and total downloads.
//
// NOTE: A JSON file persists on a long-running server (local dev, a VPS, or a
// Node host like Railway/Render). It does NOT persist on serverless platforms
// such as Vercel, where the filesystem is ephemeral. To deploy there, swap the
// read/write functions below for a Vercel KV / Upstash Redis client — the rest
// of the app talks only to readStats/incrementVisits/incrementDownloads, so no
// other file needs to change.

import { promises as fs } from "fs";
import path from "path";

export type Stats = {
  visits: number;
  downloads: number;
};

// Where the counter file lives. Set STATS_DIR to a persistent path (e.g. a
// mounted volume like "/data") in production so the file survives redeploys.
// Falls back to a project-local ".data" folder for local development.
const DATA_DIR = process.env.STATS_DIR || path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "stats.json");

const EMPTY: Stats = { visits: 0, downloads: 0 };

// Serialize writes within a single server process to avoid lost updates when
// two requests increment at the same time.
let writeLock: Promise<unknown> = Promise.resolve();

async function readRaw(): Promise<Stats> {
  try {
    const text = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(text) as Partial<Stats>;
    return {
      visits: Number(parsed.visits) || 0,
      downloads: Number(parsed.downloads) || 0,
    };
  } catch {
    // File missing or unreadable -> start from zero.
    return { ...EMPTY };
  }
}

async function writeRaw(stats: Stats): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(stats), "utf8");
}

export async function readStats(): Promise<Stats> {
  return readRaw();
}

async function increment(field: keyof Stats): Promise<Stats> {
  // Chain onto the lock so increments run one at a time.
  const run = writeLock.then(async () => {
    const current = await readRaw();
    const next: Stats = { ...current, [field]: current[field] + 1 };
    await writeRaw(next);
    return next;
  });
  // Keep the lock alive even if this run throws, so later writes still proceed.
  writeLock = run.catch(() => undefined);
  return run;
}

export function incrementVisits(): Promise<Stats> {
  return increment("visits");
}

export function incrementDownloads(): Promise<Stats> {
  return increment("downloads");
}
