import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { featuredProjects, projects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";
import HeroSlideshow from "@/components/HeroSlideshow";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import CursorEffects from "@/components/CursorEffects";

export default function HomePage() {
  return (
    <>
      {/* Cursor smoke trail + click ripple/fireworks — Home page only */}
      <CursorEffects />

      {/* Hero — full-bleed background slideshow (4 cross-fading images) */}
      <section className="relative isolate overflow-hidden">
        {/* Rotating background images */}
        <HeroSlideshow />
        {/* Light overlay — keeps the image vivid while softening it behind text */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-rock-950/75 via-rock-950/30 to-transparent"
        />

        <div className="container-content relative py-28 sm:py-36 lg:py-44">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-rock-50 drop-shadow sm:text-5xl lg:text-6xl">
              <TextReveal as="span" className="block" text={site.taglines[0]} />
              <TextReveal
                as="span"
                className="mt-1 block text-rock-100 drop-shadow"
                text={site.taglines[1]}
                delay={site.taglines[0].split(" ").length * 90}
              />
            </h1>
            <Reveal delay={120}>
              <p className="mt-6 max-w-xl text-lg text-rock-200 drop-shadow">
                {site.intro}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/projects" className="btn-primary">
                  View Projects
                </Link>
                <Link href="/contact" className="btn-ghost bg-rock-950/40 backdrop-blur">
                  Get in Touch
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured projects — Kalgoorlie map as background */}
      <section className="relative isolate overflow-hidden border-t border-cyber-400/10">
        {/* Background image */}
        <Image
          src="/images/featured-projects-bg.png"
          alt="Satellite, global network and terrain data visualization"
          fill
          sizes="100vw"
          className="hidden -z-10 object-cover"
        />
        {/* Darker overlay over the background artwork — background stays faintly visible */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-rock-950/82"
        />

        <div className="container-content section">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Selected Work</p>
                <h2 className="text-2xl font-bold tracking-tight text-rock-50 drop-shadow sm:text-3xl">
                  Featured Projects
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden text-sm font-medium text-cyber-300 transition hover:text-cyber-400 sm:inline"
              >
                All projects →
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featuredProjects.length ? featuredProjects : projects)
              .slice(0, 3)
              .map((project, i) => (
                <Reveal key={project.slug} delay={i * 120} zoom>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      {/* Focus areas — Python/GIS stack as background */}
      <section className="relative isolate overflow-hidden border-t border-cyber-400/10">
        {/* Background image */}
        <Image
          src="/images/python-gis-stack.png"
          alt="Python connecting ArcGIS and QGIS in a geospatial data processing stack"
          fill
          sizes="100vw"
          className="hidden -z-10 object-cover"
        />
        {/* Very dark overlay — background artwork only faintly visible */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-rock-950/92"
        />

        <div className="container-content section">
          <Reveal>
            <p className="eyebrow mb-3">What I Do</p>
            <h2 className="text-2xl font-bold tracking-tight text-rock-50 drop-shadow sm:text-3xl">
              Spatial analysis for the resources sector
            </h2>
          </Reveal>

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
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 120} zoom>
                <div className="card group h-full bg-rock-900/70 backdrop-blur">
                  <h3 className="text-lg font-semibold text-rock-50 transition group-hover:text-cyber-300">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-rock-200">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
