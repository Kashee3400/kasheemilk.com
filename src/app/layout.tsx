import type { Metadata } from "next";
import "@/styles/globals.css";
import ScrollToTop from "@/components/ui/ScrollToTop";
import HeaderServer from "@/components/layout/HeaderServer";
import FooterServer from "@/components/layout/FooterServer";

export const metadata: Metadata = {
  // metadataBase is highly recommended in Next.js so relative links in OG/Twitter tags resolve correctly
  metadataBase: new URL("https://www.kasheemilk.com"),

  title: {
    // Shortened slightly to keep it under Google's ~60 character display limit
    default: "Kashee Milk Producer Company | Varanasi, UP",
    template: "%s | Kashee Milk Producer Company",
  },

  description:
    "Empowering women milk producers in Eastern Uttar Pradesh through sustainable dairy farming, quality milk production, and expert veterinary services.",

  keywords: [
    "Kashee Milk",
    "dairy farming Varanasi",
    "women empowerment UP",
    "milk producer company",
    "veterinary services Uttar Pradesh",
    "KMPO",
    "sustainable dairy India",
  ],

  authors: [{ name: "Kashee Milk Producer Company Limited" }],
  creator: "Kashee Milk",

  alternates: {
    canonical: "/", 
  },

  openGraph: {
    title: "Kashee Milk Producer Company | Varanasi",
    description: "Empowering Women Through Dairy in Eastern Uttar Pradesh.",
    url: "https://www.kasheemilk.com",
    siteName: "Kashee Milk",
    locale: "en_IN",
    type: "website",
    // It's crucial for SEO/social sharing to have an OG image. 
    // Place an 'og-image.jpg' (1200x630px) in your /public folder.
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kashee Milk Producer Company Limited",
      },
    ],
  },

  // Twitter cards are essential for sharing links on X/Twitter and other messaging apps
  twitter: {
    card: "summary_large_image",
    title: "Kashee Milk Producer Company",
    description: "Empowering Women Through Dairy in Eastern Uttar Pradesh.",
    images: ["/og-image.jpg"],
  },

  // Explicitly tell search engines to index and follow the site
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <link rel="icon" href="./favicon.ico" />
      <body className="grain-overlay antialiased">
        <HeaderServer />
        <main>{children}</main>
        <FooterServer />
        <ScrollToTop />
      </body>
    </html>
  );
}
