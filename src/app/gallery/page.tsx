// app/gallery/page.tsx
// ─── Gallery Page ──────────────────────────────────────────────────────────────
// Server component: fetches initial data, passes to client GalleryGrid.

import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GalleryGrid from "@/components/ui/Gallery/GalleryGrid";
import styles from "@/components/ui/Gallery/Gallery.module.css";
import { GalleryResponse } from "@/types/db";
import { getBaseUrl } from "@/lib/db";

const GALLERY_BANNER =
  "https://www.kasheemilk.com/wp-content/uploads/2025/01/gallerybanner-.jpg";

export const metadata: Metadata = {
  title: "Gallery | Kashee Milk",
  description:
    "Visual stories from Kashee Milk — events, milestones, and the faces behind our journey.",
  openGraph: {
    title: "Gallery | Kashee Milk",
    description:
      "Browse our photo gallery — events, milestones, team, and community moments.",
    images: [{ url: GALLERY_BANNER }],
  },
};

// ── Server-side data fetch ──────────────────────────────────────────────────
async function getGalleryData(): Promise<GalleryResponse> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/gallery`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Failed to fetch gallery data");
    return res.json();
  } catch {
    return { items: [], meta: { totalCount: 0, categories: [] } };
  }
}

// ── Page ────────────────────────────────────────────────────────────────────
export default async function GalleryPage() {
  const { items, meta } = await getGalleryData();

  return (
    <div style={{ minHeight: "100vh", background: "var(--kashee-ivory, #faf8f3)" }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        {/* Full-bleed banner image — sits behind all pseudo-element overlays */}
        <Image
          src={GALLERY_BANNER}
          alt="Kashee Milk gallery banner"
          fill
          priority
          unoptimized
          className={styles.heroBg}
          sizes="100vw"
        />

        {/* Scrim + grain — controlled by CSS :hover on .hero */}
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={styles.heroGrain} aria-hidden="true" />

        <div className={styles.heroInner}>
          <SectionHeading
            label="Visual Stories"
            title="Gallery"
            subtitle="Moments from our journey — events, milestones, and the faces behind Kashee Milk."
            light
          />
        </div>
      </div>

      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Gallery" },
        ]}
      />

      {/* ── Gallery Body ──────────────────────────────────────────────────── */}
      <div className={styles.container}>
        <GalleryGrid initialItems={items} meta={meta} />
      </div>

    </div>
  );
}