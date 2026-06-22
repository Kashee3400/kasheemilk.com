import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "./Journey.module.css";

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: "Our Journey | Kashee Milk",
    description:
        "From incorporation in 2021 to a nationwide presence — trace the milestones that shaped Kashee Milk into India's trusted A2 dairy cooperative.",
    openGraph: {
        title: "Our Journey | Kashee Milk",
        description: "Milestones that define the Kashee Milk story.",
    },
};

// ── Types ──────────────────────────────────────────────────────────────────────
interface Milestone {
    year: string;
    date?: string;
    heading: string;
    body: string;
    badge: string;
    side: "left" | "right";
    variant: "dark" | "mid" | "light";
}

// ── Static milestone data (swap with API call when ready) ─────────────────────
const MILESTONES: Milestone[] = [
    {
        year: "2021",
        date: "11 Nov, 2021",
        heading: "Incorporation",
        body: "Kashee Milk was founded with a singular vision — to bring pure A2 milk directly from cooperative farms to doorsteps across India.",
        badge: "Foundation",
        side: "left",
        variant: "dark",
    },
    {
        year: "2022",
        date: "2022",
        heading: "5,000 LPD Milestone",
        body: "Reached our first significant production milestone of 5,000 litres per day, establishing a reliable supply chain with farmers across Jharkhand.",
        badge: "Production",
        side: "right",
        variant: "mid",
    },
    {
        year: "2023",
        date: "2023",
        heading: "200,000 LPD Milestone",
        body: "Scaled to 200,000 litres per day — a 40× leap — powered by our proprietary PashuSewa platform connecting field staff, facilitators, and dairy cooperatives in real-time.",
        badge: "Scale",
        side: "left",
        variant: "dark",
    },
    {
        year: "2024",
        date: "2024",
        heading: "MCC Ballia Operationalization",
        body: "Operationalized our Milk Collection Centre in Ballia, expanding our farmer network and strengthening the cold-chain infrastructure across eastern UP.",
        badge: "Infrastructure",
        side: "right",
        variant: "mid",
    },
    {
        year: "2025",
        date: "2025",
        heading: "Nationwide Presence",
        body: "Achieved distribution across 12+ states, partnering with thousands of farmers and making Kashee A2 Milk a recognisable name in households nationwide.",
        badge: "National",
        side: "left",
        variant: "light",
    },
];

const FUTURE_MILESTONE = {
    year: "2026",
    date: "19 Jan, 2026",
    heading: "BMC Ramgarh Operationalization",
    body: "Commissioning our Bulk Milk Cooler facility in Ramgarh — expanding direct sourcing, reducing intermediaries, and deepening our commitment to fair farmer pricing.",
};

// ── Drop color palettes ────────────────────────────────────────────────────────
const DROP_GRADIENTS: Record<Milestone["variant"], { a: string; b: string; ring: string }> = {
    dark: { a: "#1a3d2b", b: "#0f2419", ring: "#c9a84c" },
    mid: { a: "#2a5c3f", b: "#1a3d2b", ring: "#e8c96a" },
    light: { a: "#3d7a56", b: "#2a5c3f", ring: "#f0d97a" },
};

// ── Drop SVG component ─────────────────────────────────────────────────────────
function DropNode({
    year,
    variant,
    large = false,
}: {
    year: string;
    variant: Milestone["variant"];
    large?: boolean;
}) {
    const id = `drop-grad-${year}-${large ? "lg" : "sm"}`;
    const { a, b } = DROP_GRADIENTS[variant];
    const sz = large ? 110 : 80;

    return (
        <div className={`${styles.drop} ${large ? styles.dropLarge : ""}`}>
            <svg
                className={styles.dropShape}
                viewBox="0 0 80 90"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <radialGradient id={id} cx="40%" cy="30%" r="70%">
                        <stop offset="0%" stopColor={b} />
                        <stop offset="100%" stopColor={a} />
                    </radialGradient>
                </defs>
                {/* Water-drop / leaf path */}
                <path
                    d="M40 88 C18 72 4 54 4 38 C4 19 20 4 40 4 C60 4 76 19 76 38 C76 54 62 72 40 88Z"
                    fill={`url(#${id})`}
                />
                {/* Gold ring arc */}
                <path
                    d="M40 88 C18 72 4 54 4 38"
                    fill="none"
                    stroke="#c9a84c"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.6"
                />
            </svg>
            <span className={styles.dropYear}>{year}</span>
        </div>
    );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function JourneyPage() {
    return (
        <div className={styles.page}>

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <section className={styles.hero} aria-label="Journey hero">
                <div className={styles.heroContent}>
                    <p className={styles.heroEyebrow}>
                        <span className={styles.heroEyebrowDot} aria-hidden="true" />
                        Since 2021
                    </p>

                    <h1 className={styles.heroTitle}>
                        Our Growth{" "}
                        <span className={styles.heroTitleAccent}>Journey</span>
                    </h1>

                    <p className={styles.heroSub}>
                        From a single cooperative idea to a nationwide dairy movement — every
                        milestone rooted in the trust of farmers and families.
                    </p>

                    <div className={styles.heroStats} aria-label="Key figures">
                        <div className={styles.heroStat}>
                            <span className={styles.heroStatValue}>2L+</span>
                            <span className={styles.heroStatLabel}>Litres / Day</span>
                        </div>
                        <div className={styles.heroStat}>
                            <span className={styles.heroStatValue}>12+</span>
                            <span className={styles.heroStatLabel}>States</span>
                        </div>
                        <div className={styles.heroStat}>
                            <span className={styles.heroStatValue}>5yr</span>
                            <span className={styles.heroStatLabel}>of Growth</span>
                        </div>
                    </div>
                </div>

                {/* Scroll cue */}
                <div className={styles.scrollCue} aria-hidden="true">
                    <span className={styles.scrollLine} />
                    scroll
                </div>
            </section>

            {/* ── Breadcrumb ────────────────────────────────────────────── */}
            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Our Journey" },
                ]}
            />

            {/* ── Journey Timeline ───────────────────────────────────────── */}
            <section className={styles.journeySection} aria-label="Milestones timeline">

                {/* Decorative leaf shapes */}
                <svg
                    className={`${styles.leafDecor} ${styles.leafDecorLeft}`}
                    viewBox="0 0 300 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M20 480 C20 480 -20 300 80 180 C180 60 300 20 300 20 C300 20 240 120 160 220 C80 320 60 480 20 480Z"
                        fill="#1a3d2b"
                    />
                </svg>
                <svg
                    className={`${styles.leafDecor} ${styles.leafDecorRight}`}
                    viewBox="0 0 300 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M20 480 C20 480 -20 300 80 180 C180 60 300 20 300 20 C300 20 240 120 160 220 C80 320 60 480 20 480Z"
                        fill="#1a3d2b"
                    />
                </svg>

                {/* Section header */}
                <div className={styles.sectionLabel}>
                    <p className={styles.sectionEyebrow}>Milestones</p>
                    <h2 className={styles.sectionTitle}>
                        Growing <em>roots</em>, reaching <em>heights</em>
                    </h2>
                </div>

                {/* Timeline items */}
                <div className={styles.vineWrapper}>
                    {MILESTONES.map((m) => (
                        <article
                            key={m.year}
                            className={`${styles.milestone} ${styles[m.side]}`}
                            aria-label={`${m.date ?? m.year}: ${m.heading}`}
                        >
                            {/* Spacer for opposite side */}
                            <div className={styles.milestoneSpacer} aria-hidden="true" />

                            {/* Drop node */}
                            <div className={styles.milestoneNode}>
                                <DropNode year={m.year} variant={m.variant} />
                            </div>

                            {/* Card */}
                            <div className={styles.milestoneCard}>
                                <p className={styles.milestoneDate}>{m.date ?? m.year}</p>
                                <h3 className={styles.milestoneHeading}>{m.heading}</h3>
                                <p className={styles.milestoneBody}>{m.body}</p>
                                <span className={styles.milestoneBadge}>{m.badge}</span>
                            </div>
                        </article>
                    ))}

                    {/* Future / latest milestone — centered hero card */}
                    <div className={styles.milestoneFuture}>
                        <DropNode year={FUTURE_MILESTONE.year} variant="dark" large />
                        <div className={styles.futureCard}>
                            <p className={styles.futureDate}>{FUTURE_MILESTONE.date}</p>
                            <h3 className={styles.futureHeading}>{FUTURE_MILESTONE.heading}</h3>
                            <p className={styles.futureBody}>{FUTURE_MILESTONE.body}</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}