import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-rock-800/80 bg-rock-950">
      <div className="container-content flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-semibold text-rock-50">{site.name}</p>
          <p className="mt-2 text-sm text-rock-400">{site.intro}</p>
          <p className="mt-2 text-sm text-rock-500">{site.location}</p>
        </div>

        <div className="flex gap-12">
          <div>
            <p className="eyebrow mb-3">Navigate</p>
            <ul className="space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-rock-300 hover:text-ore-400">
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
                <a href={`mailto:${site.email}`} className="text-rock-300 hover:text-ore-400">
                  Email
                </a>
              </li>
              <li>
                <a href={site.links.github} target="_blank" rel="noreferrer" className="text-rock-300 hover:text-ore-400">
                  GitHub
                </a>
              </li>
              <li>
                <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="text-rock-300 hover:text-ore-400">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-rock-900">
        <div className="container-content py-5 text-xs text-rock-500">
          © {new Date().getFullYear()} {site.name}. Built with Next.js & TailwindCSS.
        </div>
      </div>
    </footer>
  );
}
