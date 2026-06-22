// app/contact/page.tsx
// ─── Contact Us Page — Server Component ───────────────────────────────────────
// Zero hardcoded text. Everything fetched from /api/contact/content.
// Feature flags from DB control which sections render.

import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "@/components/Contact/Contact.module.css";
import { ContactData } from "@/types/db";
import ContactClient from "@/components/Contact/ContactClient";
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

async function getContactContent(): Promise<ContactData | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/contact/content`, {
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

export default async function ContactPage() {
  let content: ContactData | null = null;

  try {
    content = await getContactContent();
  } catch (err) {
    console.error("Contact content fetch failed:", err);
  }

  // Safe defaults
  const hero = content?.hero ?? null;
  const featureFlags = content?.featureFlags ?? {};
  const config = content?.config ?? {};

  return (
    <div className={styles.page}>

      {/* ── Hero Section ───────────────────────── */}
      {featureFlags?.["contact.hero_banner"] ? (
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
              {config?.["contact.page_label"] ?? "Contact"}
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
      ) : (
        /* ── Fallback Hero ───────────────────── */
        <div
          style={{
            background: "var(--c-surface)",
            borderBottom: "1px solid var(--c-border)",
            padding: "4rem 2rem 3rem",
          }}
        >
          <div className={styles.container}>
            <p className={styles.sectionLabel}>
              {config?.["contact.page_label"] ?? "Contact"}
            </p>

            <h1 className={styles.sectionHeading}>
              {hero?.headline ?? "Contact Us"}
            </h1>

            <p className={styles.sectionSubheading}>
              {hero?.subheadline ?? ""}
            </p>
          </div>
        </div>
      )}

      {/* ── Breadcrumb ───────────────────────── */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      {/* ── Client Section ───────────────────── */}
      {content && <ContactClient data={content} />}
    </div>
  );
}