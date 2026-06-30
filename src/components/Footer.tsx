import Link from "next/link";
import { nav, site } from "@/lib/site";
import AuroraGradient from "@/components/AuroraGradient";
import Constellations from "@/components/Constellations";

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-cyber-400/10 bg-rock-950/40">
      {/* Aurora (northern-lights) backdrop */}
      <AuroraGradient />
      {/* Darken slightly so the footer text stays legible over the aurora */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-gradient-to-t from-rock-950/90 via-rock-950/55 to-rock-950/70"
      />
      {/* Twinkling constellations (Orion & Scorpius) over the aurora */}
      <div className="absolute inset-0 z-[5]">
        <Constellations />
      </div>
      {/* Glowing hairline at the top of the footer */}
      <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-cyber-400/50 to-transparent" />
      <div className="container-content relative z-10 flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-semibold text-gradient">{site.name}</p>
          <p className="mt-2 text-sm text-rock-400">{site.intro}</p>
          <p className="mt-2 text-sm text-rock-500">{site.location}</p>
        </div>

        <div className="flex gap-12">
          <div>
            <p className="eyebrow mb-3">Navigate</p>
            <ul className="space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-rock-300 hover:text-ore-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Connect</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`mailto:${site.email}`} className="link-underline text-rock-300 hover:text-ore-400">
                  Email
                </a>
              </li>
              <li>
                <a href={site.links.github} target="_blank" rel="noreferrer" className="link-underline text-rock-300 hover:text-ore-400">
                  GitHub
                </a>
              </li>
              <li>
                <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="link-underline text-rock-300 hover:text-ore-400">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
