// ── app/board-of-directors/page.tsx ──────────────────────────
import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import s from "@/components/BOD/BOD.module.css";
import { fetchBodData } from "@/lib/helper/fetchBodData";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { BodClient } from "@/components/BOD/BodClient";

// ── Dynamic metadata from DB hero ────────────────────────────
export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await fetchBodData();
  return {
    title: `${hero?.headline ?? "Board of Directors"} | Kashee Milk`,
    description: hero?.subheadline,
    openGraph: {
      title: `${hero?.headline} | Kashee Milk`,
      description: hero?.subheadline,
      images: hero?.banner_image_url ? [{ url: hero.banner_image_url }] : [],
    },
  };
}

export default async function BodPage() {
  const data = await fetchBodData();
  const { hero, config: cfg } = data;

  return (
    <div className={s.page}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className={s.hero}>
        <div className={s.heroAccent} />

        {hero?.banner_image_url && (
          <Image
            src={hero.banner_image_url}
            alt={hero.headline ?? "Board of Directors"}
            fill
            priority
            unoptimized
            className={s.heroBg}
            sizes="100vw"
          />
        )}

        <div className={s.heroOverlay} />

        <div className={s.heroInner}>
          <SectionHeading
            label={hero?.label ?? cfg.bod_section_eyebrow}
            title={hero?.headline ?? cfg.bod_section_title}
            subtitle={hero?.subheadline ?? cfg.bod_section_subtitle}
            light
          />
        </div>
      </div>

      {/* ── BREADCRUMB ───────────────────────────────────── */}
      <div className={s.breadcrumbStrip}>
        <div className={s.breadcrumbInner}>
          <Breadcrumb
            items={[
              { label: "Home",            href: "/" },
              { label: "About Us",        href: "/about-us" },
              { label: "Board of Directors" },
            ]}
            showHomeIcon
          />
        </div>
      </div>

      {/* ── BOD BODY (client — carousel + cards) ─────────── */}
      <BodClient data={data} />

    </div>
  );
}