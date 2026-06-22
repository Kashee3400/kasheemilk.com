"use client";

// ─── Lightbox.tsx ──────────────────────────────────────────────────────────────
// Keyboard-navigable, carousel-feel lightbox with thumbnail strip.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";
import { GalleryItem } from "@/types/db";

interface LightboxProps {
    items: GalleryItem[];
    startIndex: number;
    onClose: () => void;
}

export default function Lightbox({ items, startIndex, onClose }: LightboxProps) {
    const [index, setIndex] = useState(startIndex);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [exiting, setExiting] = useState(false);
    const backdropRef = useRef<HTMLDivElement>(null);
    const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const current = items[index];
    const hasPrev = index > 0;
    const hasNext = index < items.length - 1;

    // Scroll active thumb into view
    useEffect(() => {
        thumbRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [index]);

    const navigate = useCallback(
        (dir: 1 | -1) => {
            const next = index + dir;
            if (next < 0 || next >= items.length) return;
            setImgLoaded(false);
            setIndex(next);
        },
        [index, items.length]
    );

    const handleClose = useCallback(() => {
        setExiting(true);
        setTimeout(onClose, 200);
    }, [onClose]);

    // Keyboard handler
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") navigate(1);
            else if (e.key === "ArrowLeft") navigate(-1);
            else if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [navigate, handleClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    // Click backdrop to close (but not lightbox itself)
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === backdropRef.current) handleClose();
    };

    return (
        <div
            className={styles.lightboxBackdrop}
            ref={backdropRef}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
        >
            {/* Counter */}
            <span className={styles.lightboxCounter} aria-live="polite">
                {index + 1} / {items.length}
            </span>

            {/* Close */}
            <button
                className={styles.lightboxClose}
                onClick={handleClose}
                aria-label="Close lightbox"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {/* Prev */}
            <button
                className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
                onClick={() => navigate(-1)}
                disabled={!hasPrev}
                aria-label="Previous image"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            {/* Main image */}
            <div className={styles.lightbox}>
                <div
                    className={`${styles.lightboxImageWrap} ${exiting ? styles.exiting : ""}`}
                    style={{ aspectRatio: "4/3" }}
                >
                    {!imgLoaded && <div className={styles.spinner} />}
                    <Image
                        key={current.id}
                        src={current.image_url}
                        alt={current.alt_text}
                        fill
                        sizes="(max-width: 768px) 100vw, 80vw"
                        className={styles.lightboxImg}
                        unoptimized
                        priority
                        onLoad={() => setImgLoaded(true)}
                        style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.3s" }}
                    />
                    {/* Info overlay */}
                    {(current.title || current.description) && (
                        <div className={styles.lightboxInfo}>
                            {current.title && (
                                <p className={styles.lightboxTitle}>{current.title}</p>
                            )}
                            {current.description && (
                                <p className={styles.lightboxDesc}>{current.description}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Next */}
            <button
                className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
                onClick={() => navigate(1)}
                disabled={!hasNext}
                aria-label="Next image"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {/* Thumbnail strip */}
            <div className={styles.thumbStrip} role="tablist" aria-label="Image thumbnails">
                {items.map((item, i) => (
                    <button
                        key={item.id}
                        ref={(el) => { thumbRefs.current[i] = el; }}
                        className={`${styles.thumb} ${i === index ? styles.activeThumb : ""}`}
                        onClick={() => { setImgLoaded(false); setIndex(i); }}
                        role="tab"
                        aria-selected={i === index}
                        aria-label={`View image ${i + 1}: ${item.alt_text}`}
                    >
                        <Image
                            src={item.thumbnail_url ?? item.image_url}
                            alt={item.alt_text}
                            fill
                            sizes="56px"
                            unoptimized
                            style={{ objectFit: "cover" }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}