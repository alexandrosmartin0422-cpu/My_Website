import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import DownloadLink from "@/components/DownloadLink";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProject(params.slug);
  return { title: project ? project.title : "Project" };
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <>
      {/* Header */}
      <div className="border-b border-rock-800/80 bg-gradient-to-b from-rock-900/60 to-rock-950">
        <div className="container-content py-14 sm:py-20">
          <Link
            href="/projects"
            className="mb-6 inline-flex items-center gap-1 text-sm text-rock-400 hover:text-ore-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All projects
          </Link>

          <p className="eyebrow mb-3">Project {project.number}</p>
          <h1 className="text-3xl font-bold tracking-tight text-rock-50 sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-3 text-rock-400">{project.location}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 5 18.3 5.3 18.3 5.3c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
                </svg>
                GitHub
              </a>
            )}
            {project.downloads?.map((dl) => (
              <DownloadLink key={dl.href} href={dl.href} className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {dl.label}
              </DownloadLink>
            ))}
          </div>
        </div>
      </div>

      {/* Body: section nav + content */}
      <section className="section">
        <div className="container-content grid gap-12 md:grid-cols-[220px_1fr]">
          {/* Sticky section nav */}
          <nav className="hidden md:block">
            <div className="sticky top-24">
              <p className="eyebrow mb-4">Sections</p>
              <ul className="space-y-2 text-sm">
                {project.sections.map((s) => (
                  <li key={s.heading}>
                    <a
                      href={`#${slugify(s.heading)}`}
                      className="text-rock-400 hover:text-ore-400"
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Content */}
          <div className="max-w-2xl space-y-14">
            {project.sections.map((s) => (
              <div key={s.heading} id={slugify(s.heading)} className="scroll-mt-24">
                <h2 className="text-xl font-bold text-rock-50">{s.heading}</h2>
                <div className="mt-4 space-y-4 leading-relaxed text-rock-300">
                  {s.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                {s.bullets && (
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2 text-sm text-rock-300"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terrain-400" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Downloads at bottom */}
            {project.downloads && project.downloads.length > 0 && (
              <div id="downloads" className="scroll-mt-24 border-t border-rock-800 pt-10">
                <h2 className="text-xl font-bold text-rock-50">Downloads</h2>
                <ul className="mt-4 space-y-3">
                  {project.downloads.map((dl) => (
                    <li key={dl.href}>
                      <DownloadLink
                        href={dl.href}
                        className="inline-flex items-center gap-2 text-sm text-ore-400 hover:text-ore-500"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {dl.label}
                      </DownloadLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
