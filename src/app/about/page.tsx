import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const facts = [
    { label: "Name", value: site.name },
    { label: "Location", value: site.location },
    { label: "Focus", value: "GIS · Geological Mapping · Remote Sensing" },
    { label: "Career Goal", value: "Mineral Exploration GIS Specialist" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="About Me"
        title="GIS & Geological Mapping Specialist"
        description="Aspiring GIS and Geological Mapping Specialist focused on mineral exploration, remote sensing and spatial analysis."
      />

      <section className="section">
        <div className="container-content grid gap-12 md:grid-cols-[1fr_320px]">
          <div className="space-y-6 text-rock-300 leading-relaxed">
            <p>
              I am an aspiring GIS and Geological Mapping Specialist with a strong
              interest in mineral exploration across Western Australia. My work
              centers on turning raw geoscience data — geological linework,
              satellite imagery and terrain models — into clear, decision-ready
              spatial analysis.
            </p>
            <p>
              My technical background spans the full GIS stack: desktop tools such
              as QGIS and ArcGIS, spatial databases with PostGIS, and automation
              with Python (GeoPandas, GDAL). I pair this with remote sensing
              techniques using Sentinel-2 and Landsat imagery, and DEM-based
              terrain modeling.
            </p>
            <p>
              My goal is to contribute to mineral exploration teams by building
              reproducible spatial workflows that link geology, structure and
              prospectivity — starting with my study of structural control on gold
              deposits in the Kalgoorlie region.
            </p>

            <div className="pt-4">
              <h2 className="text-lg font-semibold text-rock-50">
                Technical Background
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {[
                  "GIS analysis & cartography (QGIS, ArcGIS)",
                  "Spatial databases (PostgreSQL / PostGIS)",
                  "Remote sensing (Sentinel-2, Landsat)",
                  "DEM & terrain analysis",
                  "Python geospatial automation",
                  "Structural & lithological mapping",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-rock-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ore-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick facts */}
          <aside className="h-fit rounded-xl border border-rock-700/60 bg-rock-900/60 p-6">
            <p className="eyebrow mb-4">Quick Facts</p>
            <dl className="space-y-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-mono uppercase tracking-wider text-rock-500">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 text-sm text-rock-100">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
