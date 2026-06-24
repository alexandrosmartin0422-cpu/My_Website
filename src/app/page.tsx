import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { featuredProjects, projects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";

export default function HomePage() {
  return (
    <>
      {/* Hero — full-bleed background image */}
      <section className="relative isolate overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/hero-gis-resources.png"
          alt="Satellite imagery, GIS data management and resource exploration workflow"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Light overlay — keeps the image vivid while softening it behind text */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-rock-950/75 via-rock-950/30 to-transparent"
        />

        <div className="container-content relative py-28 sm:py-36 lg:py-44">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">{site.role}</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-rock-50 drop-shadow sm:text-5xl lg:text-6xl">
              {site.taglines[0]}
              <span className="block text-rock-300">{site.taglines[1]}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-rock-200 drop-shadow">
              {site.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary">
                View Projects
              </Link>
              <Link href="/contact" className="btn-ghost bg-rock-950/40 backdrop-blur">
                Get in Touch
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-rock-200">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-terrain-400" />
                {site.location}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects — Kalgoorlie map as background */}
      <section className="relative isolate overflow-hidden border-t border-rock-800/80">
        {/* Background image */}
        <Image
          src="/images/kalgoorlie-gold-fault-map.png"
          alt="Structural control of gold deposits in the Kalgoorlie region — fault systems and gold occurrences"
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Light overlay — let the map show through */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-rock-950/45"
        />

        <div className="container-content section">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Selected Work</p>
              <h2 className="text-2xl font-bold tracking-tight text-rock-50 drop-shadow sm:text-3xl">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden text-sm font-medium text-ore-400 hover:text-ore-500 sm:inline"
            >
              All projects →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featuredProjects.length ? featuredProjects : projects)
              .slice(0, 3)
              .map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
          </div>
        </div>
      </section>

      {/* Focus areas — Python/GIS stack as background */}
      <section className="relative isolate overflow-hidden border-t border-rock-800/80">
        {/* Background image */}
        <Image
          src="/images/python-gis-stack.png"
          alt="Python connecting ArcGIS and QGIS in a geospatial data processing stack"
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Light overlay — let the tooling artwork show through */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-rock-950/40"
        />

        <div className="container-content section">
          <p className="eyebrow mb-3">What I Do</p>
          <h2 className="text-2xl font-bold tracking-tight text-rock-50 drop-shadow sm:text-3xl">
            Spatial analysis for the resources sector
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Geological Mapping",
                desc: "Lithological and structural mapping using QGIS, ArcGIS and field-ready GIS workflows.",
              },
              {
                title: "Remote Sensing",
                desc: "Sentinel-2 and Landsat band ratios, DEM/terrain analysis and alteration mapping.",
              },
              {
                title: "Spatial Automation",
                desc: "Reproducible Python (GeoPandas, GDAL) and PostGIS pipelines for repeatable analysis.",
              },
            ].map((item) => (
              <div key={item.title} className="card bg-rock-900/70 backdrop-blur">
                <h3 className="text-lg font-semibold text-rock-50">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-rock-200">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
