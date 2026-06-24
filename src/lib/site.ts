// Central site configuration & content.
// Edit values here to update your name, links, and contact details everywhere.

export const site = {
  name: "Alexandros Martin",
  role: "GIS Analyst",
  taglines: [
    "Geological Mapping Specialist",
    "Remote Sensing & Spatial Analysis",
  ],
  intro:
    "Spatial Analysis for Geology, Mineral Exploration and Mapping.",
  location: "Perth, Western Australia",
  // Primary email is used for the contact button and form.
  email: "alexandrosmartin0422@gmail.com",
  emailSecondary: "martinguku37@gmail.com",
  links: {
    github: "https://github.com/", // TODO: replace with your GitHub URL
    linkedin: "https://www.linkedin.com/", // TODO: replace with your LinkedIn URL
  },
};

// Two-letter monogram from the name, e.g. "Alexandros Martin" -> "AM".
export const initials = site.name
  .split(/\s+/)
  .map((w) => w[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/downloads", label: "Downloads" },
  { href: "/contact", label: "Contact" },
];
