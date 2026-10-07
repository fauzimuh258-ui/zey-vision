import { Layout, Navbar, Footer } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";

export const metadata = {
  title: "Zey Vision",
  description: "Eye-friendly, circadian-adaptive design system for the Zey Ecosystem.",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={<Navbar logo={<span>Zey Vision</span>} />}
          footer={<Footer>MIT — part of the Zey Ecosystem.</Footer>}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/<your-github-username>/zey-vision/tree/main/docs-site"
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
