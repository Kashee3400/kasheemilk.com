// components/ui/Breadcrumb.tsx
// ─── Reusable Breadcrumb ───────────────────────────────────────────────────────
// Usage:
//   <Breadcrumb items={[
//     { label: "Home", href: "/" },
//     { label: "About", href: "/about" },
//     { label: "Team" },           ← last item has no href → rendered as current page
//   ]} />

import Link from "next/link";
import styles from "@/components/ui/Gallery/Gallery.module.css";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    /** Show a home icon as the very first crumb (default: true) */
    showHomeIcon?: boolean;
}

function HomeIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
            <polyline points="9 21 9 12 15 12 15 21" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

export default function Breadcrumb({
    items,
    showHomeIcon = true,
}: BreadcrumbProps) {
    // Build JSON-LD for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            ...(item.href ? { item: item.href } : {}),
        })),
    };

    return (
        <>
            {/* Structured data for Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <nav className={styles.breadcrumbBar} aria-label="Breadcrumb">
                <ol className={styles.breadcrumbInner}>
                    {/* Optional home icon */}
                    {showHomeIcon && (
                        <li className={styles.breadcrumbItem}>
                            <Link href="/" className={styles.breadcrumbHomeIcon} aria-label="Home">
                                <HomeIcon />
                            </Link>
                            <span className={styles.breadcrumbSep} aria-hidden="true">
                                <ChevronIcon />
                            </span>
                        </li>
                    )}

                    {items.map((item, i) => {
                        const isLast = i === items.length - 1;
                        return (
                            <li key={i} className={styles.breadcrumbItem}>
                                {isLast || !item.href ? (
                                    <span
                                        className={styles.breadcrumbCurrent}
                                        aria-current="page"
                                    >
                                        {item.label}
                                    </span>
                                ) : (
                                    <>
                                        <Link href={item.href} className={styles.breadcrumbLink}>
                                            {item.label}
                                        </Link>
                                        <span className={styles.breadcrumbSep} aria-hidden="true">
                                            <ChevronIcon />
                                        </span>
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}