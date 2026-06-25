// Project data. Add new projects to this array — the list page and detail
// pages are generated from it automatically.

export type ProjectSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type Project = {
  slug: string;
  number: string; // e.g. "01"
  title: string;
  location: string;
  category: string;
  summary: string;
  tags: string[];
  featured?: boolean;
  thumbnail?: string; // path under /public, optional
  github?: string;
  downloads?: { label: string; href: string }[];
  sections: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "kalgoorlie-structural-control",
    number: "01",
    title: "Structural Control of Gold Deposits",
    location: "Kalgoorlie Region, Western Australia",
    category: "Structural Analysis",
    summary:
      "Spatial analysis of the relationship between major fault systems and gold deposit distribution across the Eastern Goldfields, using GIS and remote sensing.",
    tags: ["QGIS", "Structural Geology", "Remote Sensing", "Python"],
    featured: true,
    github: "https://github.com/alexandrosmartin0422-cpu/My_Website",
    downloads: [
      { label: "Kalgoorlie_Report.pdf", href: "/downloads/Kalgoorlie_Report.pdf" },
    ],
    sections: [
      {
        heading: "Overview",
        body: [
          "Kalgoorlie, in the Eastern Goldfields of Western Australia, hosts world-class orogenic gold deposits whose distribution is strongly governed by crustal-scale shear zones. This project investigates the spatial correlation between mapped fault systems and known gold occurrences.",
          "The goal was to build a reproducible GIS workflow that quantifies fault–gold proximity and highlights prospective corridors for further exploration.",
        ],
      },
      {
        heading: "Data",
        body: ["The analysis combined open geoscience datasets:"],
        bullets: [
          "GSWA 1:500k geological linework (faults, lithology)",
          "MINEDEX / known gold occurrence points",
          "Sentinel-2 multispectral imagery for surface mapping",
          "SRTM 30 m DEM for terrain and structural lineament context",
        ],
      },
      {
        heading: "Workflow",
        body: [
          "A repeatable pipeline was built so the analysis can be re-run as new data arrives.",
        ],
        bullets: [
          "Reproject all layers to GDA2020 / MGA Zone 51",
          "Clean and filter fault linework by type and rank",
          "Generate multi-ring buffers (250 m – 5 km) around faults",
          "Spatial join of gold occurrences to buffer zones",
          "Density and distance-to-fault analysis",
        ],
      },
      {
        heading: "Methods",
        body: [
          "Proximity analysis was performed in QGIS and automated with Python (GeoPandas) for repeatability. Distance-to-nearest-fault was computed for each gold occurrence, and kernel density estimation was used to identify clustering.",
        ],
        bullets: [
          "Euclidean distance-to-fault rasters",
          "Multi-ring buffer spatial joins",
          "Kernel Density Estimation (KDE) of occurrences",
          "Sentinel-2 band ratios for alteration mapping",
        ],
      },
      {
        heading: "Results",
        body: [
          "A clear majority of significant gold occurrences fall within a few kilometers of mapped first- and second-order shear zones, confirming strong structural control. The resulting prospectivity map highlights under-explored corridors along the same structural trend.",
        ],
        bullets: [
          "~80% of occurrences within 2 km of major faults",
          "Prospective corridors identified along strike",
          "Reproducible Python workflow for future datasets",
        ],
      },
      {
        heading: "Maps",
        body: [
          "Output maps include a regional structural overview, fault-buffer prospectivity, and gold occurrence density. (Interactive web maps are planned in a future phase.)",
        ],
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
