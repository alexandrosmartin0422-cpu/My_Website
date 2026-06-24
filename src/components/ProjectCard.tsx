import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group card flex flex-col">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-ore-400">
          Project {project.number}
        </span>
        <span className="tag">{project.category}</span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-rock-50 group-hover:text-ore-400">
        {project.title}
      </h3>
      <p className="mt-1 text-sm text-rock-400">{project.location}</p>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-rock-300">
        {project.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ore-400">
        View project
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition group-hover:translate-x-1">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
