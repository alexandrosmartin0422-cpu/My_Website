import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import DownloadLink from "@/components/DownloadLink";

export const metadata: Metadata = { title: "Downloads" };

const files = [
  {
    name: "Resume.pdf",
    desc: "One-page resume — GIS & geological mapping.",
    href: "/downloads/Resume.pdf",
  },
  {
    name: "CV.pdf",
    desc: "Full curriculum vitae with detailed experience.",
    href: "/downloads/CV.pdf",
  },
  {
    name: "Kalgoorlie_Report.pdf",
    desc: "Structural control of gold deposits — full project report.",
    href: "/downloads/Kalgoorlie_Report.pdf",
  },
  {
    name: "GIS_Portfolio.pdf",
    desc: "Selected GIS map outputs and project summaries.",
    href: "/downloads/GIS_Portfolio.pdf",
  },
];

export default function DownloadsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Downloads"
        title="Resume & Portfolio Files"
        description="Downloadable documents for recruiters and collaborators. (Add the PDF files to /public/downloads/.)"
      />

      <section className="section">
        <div className="container-content grid gap-4 sm:grid-cols-2">
          {files.map((file) => (
            <DownloadLink
              key={file.href}
              href={file.href}
              className="group card flex items-center gap-4"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-rock-800 text-ore-400">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
                  <path d="M14 2v6h6" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="flex-1">
                <p className="font-medium text-rock-50 group-hover:text-ore-400">
                  {file.name}
                </p>
                <p className="mt-0.5 text-sm text-rock-400">{file.desc}</p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rock-500 transition group-hover:text-ore-400">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </DownloadLink>
          ))}
        </div>

        <div className="container-content mt-8">
          <p className="text-sm text-rock-500">
            Note: Place the actual PDF files in{" "}
            <code className="font-mono text-rock-300">public/downloads/</code> so
            these links resolve.
          </p>
        </div>
      </section>
    </>
  );
}
