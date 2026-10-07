import React from "react";
import type { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Zey Vision</span>,
  project: {
    link: "https://github.com/<your-github-username>/zey-vision",
  },
  docsRepositoryBase: "https://github.com/<your-github-username>/zey-vision/tree/main/docs-site",
  footer: {
    content: "MIT — Zey Vision, part of the Zey Ecosystem.",
  },
};

export default config;
