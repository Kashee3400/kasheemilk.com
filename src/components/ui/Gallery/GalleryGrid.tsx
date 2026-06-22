"use client";

// ─── GalleryGrid.tsx ───────────────────────────────────────────────────────────
// Client component: category filtering, grid/masonry toggle, lightbox trigger.

import { useState, useTransition, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { CATEGORY_CONFIG } from "@/lib/galleryData";
import styles from "./Gallery.module.css";
import { GalleryCategory, GalleryItem, GalleryMeta } from "@/types/db";

// Lazily load the heavy Lightbox only when opened
const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

// ── View modes ──────────────────────────────────────────────────────────────
type ViewMode = "grid4" | "grid3";

interface GalleryGridProps {
    initialItems: GalleryItem[];
    meta: GalleryMeta;
}

// ── Icon helpers ────────────────────────────────────────────────────────────
function Grid4Icon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="0" y="0" width="6" height="6" rx="1" />
            <rect x="10" y="0" width="6" height="6" rx="1" />
            <rect x="0" y="10" width="6" height="6" rx="1" />
            <rect x="10" y="10" width="6" height="6" rx="1" />
        </svg>
    );
}

function Grid3Icon() {
    return (
        <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor">
            <rect x="0" y="0" width="4" height="4" rx="1" />
            <rect x="7" y="0" width="4" height="4" rx="1" />
            <rect x="14" y="0" width="4" height="4" rx="1" />
            <rect x="0" y="7" width="4" height="4" rx="1" />
            <rect x="7" y="7" width="4" height="4" rx="1" />
            <rect x="14" y="7" width="4" height="4" rx="1" />
            <rect x="0" y="14" width="4" height="4" rx="1" />
            <rect x="7" y="14" width="4" height="4" rx="1" />
            <rect x="14" y="14" width="4" height="4" rx="1" />
        </svg>
    );
}

// ── Component ───────────────────────────────────────────────────────────────
export default function GalleryGrid({ initialItems, meta }: GalleryGridProps) {
    const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">("all");
    const [items, setItems] = useState<GalleryItem[]>(initialItems);
    const [viewMode, setViewMode] = useState<ViewMode>("grid4");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    // Filter by category via API
    const handleCategoryChange = useCallback((cat: GalleryCategory | "all") => {
        setActiveCategory(cat);
        startTransition(async () => {
            const url =
                cat === "all"
                    ? "/api/gallery"
                    : `/api/gallery?category=${cat}`;
            const res = await fetch(url);
            const data = await res.json();
            setItems(data.items);
        });
    }, []);

    // Keyboard: close lightbox handled inside Lightbox itself
    // Prefetch on hover (rudimentary, real app can use SWR/React Query)
    const openLightbox = useCallback((idx: number) => {
        setLightboxIndex(idx);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null);
    }, []);

    const gridClass =
        viewMode === "grid4"
            ? `${styles.grid} ${styles.cols4}`
            : `${styles.grid} ${styles.cols3}`;

    return (
        <>
            {/* ── Controls ─────────────────────────────────────────────────────── */}
            <div className={styles.controls}>
                {/* Category pills */}
                <div className={styles.filterBar} role="group" aria-label="Filter by category">
                    {meta.categories.map((cat) => {
                        const config = CATEGORY_CONFIG[cat.value as keyof typeof CATEGORY_CONFIG];
                        return (
                            <button
                                key={cat.value}
                                className={`${styles.filterBtn} ${activeCategory === cat.value ? styles.active : ""}`}
                                onClick={() => handleCategoryChange(cat.value)}
                                aria-pressed={activeCategory === cat.value}
                            >
                                {config?.emoji && <span aria-hidden="true">{config.emoji}</span>}
                                {cat.label}
                                <span className={styles.filterCount}>({cat.count})</span>
                            </button>
                        );
                    })}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {/* Result count */}
                    <span className={styles.resultMeta} aria-live="polite">
                        {isPending ? "Loading…" : `${items.length} photo${items.length !== 1 ? "s" : ""}`}
                    </span>

                    {/* View toggle */}
                    <div className={styles.viewToggle} role="group" aria-label="View mode">
                        <button
                            className={`${styles.viewBtn} ${viewMode === "grid4" ? styles.active : ""}`}
                            onClick={() => setViewMode("grid4")}
                            aria-pressed={viewMode === "grid4"}
                            aria-label="4-column grid"
                        >
                            <Grid4Icon />
                        </button>
                        <button
                            className={`${styles.viewBtn} ${viewMode === "grid3" ? styles.active : ""}`}
                            onClick={() => setViewMode("grid3")}
                            aria-pressed={viewMode === "grid3"}
                            aria-label="3-column grid"
                        >
                            <Grid3Icon />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Gallery Grid ─────────────────────────────────────────────────── */}
            <div className={gridClass} role="list" aria-label="Photo gallery">
                {isPending
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={styles.skeleton} aria-hidden="true" />
                    ))
                    : items.length === 0
                        ? (
                            <div className={styles.empty}>
                                <span className={styles.emptyIcon}>🌿</span>
                                <p className={styles.emptyText}>No photos in this category yet.</p>
                            </div>
                        )
                        : items.map((item, idx) => (
                            <div
                                key={item.id}
                                className={styles.card}
                                role="listitem"
                                tabIndex={0}
                                onClick={() => openLightbox(idx)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openLightbox(idx);
                                    }
                                }}
                                aria-label={`Open ${item.alt_text}`}
                            >
                                <Image
                                    src={item.image_url}
                                    alt={item.alt_text}
                                    fill
                                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className={styles.cardImage}
                                    unoptimized
                                />
                                <div className={styles.cardOverlay} aria-hidden="true">
                                    {item.title && (
                                        <p className={styles.cardTitle}>{item.title}</p>
                                    )}
                                    <p className={styles.cardCategory}>{item.category}</p>
                                </div>
                                {item.featured && (
                                    <span className={styles.featuredBadge} aria-label="Featured">
                                        ★ Featured
                                    </span>
                                )}
                            </div>
                        ))}
            </div>

            <p className={styles.footerNote}>More images coming soon — check back regularly.</p>

            {/* ── Lightbox ─────────────────────────────────────────────────────── */}
            {lightboxIndex !== null && (
                <Lightbox
                    items={items}
                    startIndex={lightboxIndex}
                    onClose={closeLightbox}
                />
            )}
        </>
    );
}