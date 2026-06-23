// app/join-us/page.tsx
// ─── Join Us Page — Server Component ──────────────────────────────────────────
// Zero hardcoded text. Everything fetched from /api/careers at build/request time.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import type { CareersData } from "@/types/db";
import styles from "@/components/ui/JoinUs/JoinUs.module.css";
import JoinUsClient from "@/components/ui/JoinUs/JoinUsClient";
import { getBaseUrl } from "@/lib/db";

// ── Metadata ───────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: "Join Us | Kashee Milk",
    description: "Build something that matters. Explore open roles at Kashee Milk.",
    openGraph: {
        title: "Careers at Kashee Milk",
        description: "Join a team delivering the purest dairy to India. See open positions.",
    },
};

async function getCareersData(): Promise<CareersData> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/careers/content`, {
            // jobs change more frequently than copy — use the lower TTL
            next: { revalidate: 300 },
        });
        if (!res.ok) throw new Error("Failed to fetch careers data");
        const json = await res.json();
        return json.data;
    } catch {
        return {
            hero: null,
            stats: [],
            values: [],
            benefits: [],
            testimonials: [],
            hiringProcess: [],
            departments: [],
            jobs: [],
            config: {},
            featureFlags: {},
        };
    }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function JoinUsPage() {
    const data = await getCareersData();
    const { hero, stats } = data;

    return (
        <div className={styles.page}>

            {/* ── Hero ──────────────────────────────────────────────────────────── */}
            <section className={styles.hero} aria-label="Careers hero">
                {hero?.banner_image_url && (
                    <Image
                        src={hero.banner_image_url}
                        alt="Kashee Milk team"
                        fill priority unoptimized
                        className={styles.heroBg}
                        sizes="100vw"
                    />
                )}
                <div className={styles.heroOverlay} aria-hidden="true" />

                <div className={styles.heroContent}>
                    <div className={styles.heroLeft}>
                        <p className={styles.heroEyebrow}>
                            <span className={styles.heroEyebrowDot} aria-hidden="true" />
                            Careers at Kashee Milk
                        </p>

                        {hero && (
                            <>
                                <h1 className={styles.heroHeadline}>
                                    {hero.headline?.split(" ").slice(0, -1).join(" ") || "Join Our Team"}{" "}
                                    <span className={styles.heroHeadlineAccent}>
                                        {hero.headline?.split(" ").at(-1) || ""}
                                    </span>
                                </h1>
                                <p className={styles.heroSubheadline}>{hero.subheadline || ""}</p>
                                {hero.description && <p className={styles.heroDescription}>{hero.description}</p>}
                                {/* cta_anchor → cta_href (column rename in page_heroes) */}
                                {hero.cta_href && hero.cta_label && (
                                    <Link href={hero.cta_href} className={styles.heroCta}>
                                        {hero.cta_label}
                                        <svg
                                            className={styles.heroCtaArrow}
                                            width="16" height="16"
                                            viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor"
                                            strokeWidth="2.5" strokeLinecap="round"
                                        >
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Stats card grid */}
                    <div className={styles.heroStats} aria-label="Company statistics">
                        {stats.map((s) => (
                            <div key={s.stat_key} className={styles.heroStat}>
                                {/* display_value replaces value (column rename in page_stats) */}
                                <p className={styles.heroStatValue}>{s.display_value}</p>
                                <p className={styles.heroStatLabel}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Join Us" }]} />

            {/* ── All interactive client sections ─────────────────────────────── */}
            <JoinUsClient data={data} />

        </div>
    );
}