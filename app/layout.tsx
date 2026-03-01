import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const title = "Spider SEO Auditor — Audit Any Website's SEO";
const description =
  "Audit SEO on any website. Check titles, meta descriptions, headings, image alt text, and Open Graph tags. Powered by Spider Cloud.";
const url = process.env.PUBLIC_NEXT_SITENAME || "https://seo-auditor.spider.cloud";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(url),
  keywords: ["SEO audit", "SEO checker", "meta tags", "Open Graph", "web crawler", "spider cloud"],
  authors: [{ name: "Spider", url: "https://spider.cloud" }],
  creator: "Spider",
  publisher: "Spider",
  openGraph: {
    type: "website",
    url,
    title,
    description,
    siteName: "Spider Cloud",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@spider_rust",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  alternates: {
    canonical: url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Spider SEO Auditor",
              url: "https://seo-auditor.spider.cloud",
              description:
                "Audit on-page SEO for any website. Analyze titles, meta tags, headings, and more.",
              applicationCategory: "WebApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "Spider",
                url: "https://spider.cloud",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
