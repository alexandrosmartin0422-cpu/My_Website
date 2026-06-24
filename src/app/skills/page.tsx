import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "Skills" };

const skillGroups = [
  {
    title: "GIS",
    items: ["QGIS", "ArcGIS", "PostGIS", "GDAL", "GeoPandas"],
  },
  {
    title: "Programming",
    items: ["Python", "SQL", "PostgreSQL"],
  },
  {
    title: "Remote Sensing",
    items: ["Sentinel-2", "Landsat", "DEM Analysis", "Terrain Modeling"],
  },
  {
    title: "Geology",
    items: [
      "Geological Mapping",
      "Structural Geology",
      "Mineral Exploration",
      "Lithological Analysis",
    ],
  },
];

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title="Core Technical Skills"
        description="The GIS, programming, remote sensing and geology toolset I use to deliver spatial analysis for mineral exploration."
      />

      <section className="section">
        <div className="container-content grid gap-6 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.title} className="card">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-rock-800 font-mono text-sm text-ore-400">
                  {group.title.slice(0, 2).toUpperCase()}
                </span>
                <h2 className="text-lg font-semibold text-rock-50">
                  {group.title}
                </h2>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
