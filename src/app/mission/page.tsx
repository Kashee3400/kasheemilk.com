import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "@/components/Contact/Contact.module.css";
import { ContactData } from "@/types/db";
import { getBaseUrl } from "@/lib/db";

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: "Contact Us ",
    description: "Get in touch with Kashee Milk. We would love to hear from you.",
    openGraph: {
        title: "Contact Kashee Milk",
        description: "Reach out to our team — product queries, partnerships, media and more.",
    },
};

async function getMissionContent(): Promise<ContactData | null> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/mission/content`, {
            next: { revalidate: 1800 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.data ?? null;
    } catch (error) {
        console.error("Contact API error:", error);
        return null;
    }
}

export default async function MissionPage() {
    let content: Record<string, any> | null = null;

    try {
        content = await getMissionContent();
    } catch (err) {
        console.error("Mission content fetch failed:", err);
    }

    // Safe defaults
    const hero = content?.hero ?? null;

    return (
        <div className={styles.page}>

            {/* ── Hero Section ───────────────────────── */}
            <section className={styles.hero} aria-label="Contact hero">

                {hero?.banner_image_url && (
                    <Image
                        src={hero.banner_image_url}
                        alt="Kashee Milk office"
                        fill
                        priority
                        unoptimized
                        className={styles.heroBg}
                        sizes="100vw"
                    />
                )}

                <div className={styles.heroOverlay} aria-hidden="true" />

                <div className={styles.heroContent}>
                    <p className={styles.heroEyebrow}>
                        <span className={styles.heroEyebrowDot} aria-hidden="true" />
                        Mission
                    </p>

                    <h1 className={styles.heroHeadline}>
                        {hero?.headline
                            ?.split(" ")
                            ?.slice(0, -1)
                            ?.join(" ") ?? ""}{" "}
                        <span className={styles.heroHeadlineAccent}>
                            {hero?.headline?.split(" ")?.at(-1) ?? ""}
                        </span>
                    </h1>

                    <p className={styles.heroSubheadline}>
                        {hero?.subheadline ?? ""}
                    </p>
                </div>
            </section>

            {/* ── Breadcrumb ───────────────────────── */}
            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Mission" },
                ]}
            />

            <section className={styles.missionSection}>
                <div className={styles.missionCard}>
                    <div className={styles.icon}>
                        🎯
                    </div>

                    <div className={styles.content}>
                        <h2>Our Mission</h2>

                        <p>
                            {hero?.description}
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}