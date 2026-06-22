"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowRight, Images, ChevronLeft, ChevronRight,
  Maximize2, X, Pause, Play, ZoomIn, ZoomOut,
  Download, Share2, Grid3X3,
} from "lucide-react";
import { GALLERY_IMAGES } from "@/lib/data";

// ─── Types / constants ────────────────────────────────────────────────────────
type CardSize = "wide" | "normal" | "tall";

const CARD_SIZES: Record<CardSize, { w: number; h: number }> = {
  wide: { w: 380, h: 260 },
  normal: { w: 280, h: 260 },
  tall: { w: 240, h: 300 },
};

// Add this array to your @/lib/data or customise here
const CATEGORIES = ["All", "Farmers", "Products", "Events", "Farm Life", "Veterinary"];

const AUTO_SPEED = 0.7; // px per rAF frame — tweak for faster/slower drift

// ─── Component ────────────────────────────────────────────────────────────────
export function GalleryPreview() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const userPausedRef = useRef(false);
  const dragRef = useRef({
    active: false, startX: 0, scrollLeft: 0,
    velocity: 0, lastX: 0, lastT: 0,
  });

  const [category, setCategory] = useState("All");
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [progress, setProgress] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [lbZoom, setLbZoom] = useState(1);

  const filtered =
    category === "All"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((g) => g.category === category);

  // ── Scroll state sync ──────────────────────────────────────────────────────
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft < max - 2);
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = 0;
    el.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => el.removeEventListener("scroll", sync);
  }, [sync, filtered]);

  // ── Auto-scroll (rAF) ──────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const el = trackRef.current;
      const paused = userPausedRef.current || hovered || dragRef.current.active;
      if (el && !paused) {
        const max = el.scrollWidth - el.clientWidth;
        el.scrollLeft = el.scrollLeft >= max ? 0 : el.scrollLeft + AUTO_SPEED;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered]);

  // ── Manual arrow scroll ────────────────────────────────────────────────────
  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({
      left: (trackRef.current.clientWidth * 0.72) * dir,
      behavior: "smooth",
    });
  };

  // ── Pointer drag + momentum ────────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = {
      active: true, startX: e.clientX, scrollLeft: el.scrollLeft,
      velocity: 0, lastX: e.clientX, lastT: performance.now(),
    };
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active || !trackRef.current) return;
    const now = performance.now();
    trackRef.current.scrollLeft =
      dragRef.current.scrollLeft - (e.clientX - dragRef.current.startX) * 1.3;
    dragRef.current.velocity =
      (e.clientX - dragRef.current.lastX) /
      Math.max(now - dragRef.current.lastT, 1) * 15;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastT = now;
  };
  const onPointerUp = () => {
    dragRef.current.active = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    let v = -dragRef.current.velocity;
    const coast = () => {
      if (Math.abs(v) < 0.5 || !trackRef.current) return;
      trackRef.current.scrollLeft += v;
      v *= 0.93;
      requestAnimationFrame(coast);
    };
    requestAnimationFrame(coast);
  };

  // ── Lightbox keyboard nav ──────────────────────────────────────────────────
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setLightbox((i) => Math.min((i ?? 0) + 1, filtered.length - 1));
      if (e.key === "ArrowLeft") setLightbox((i) => Math.max((i ?? 0) - 1, 0));
      if (e.key === "Escape") closeLightbox();
      if (e.key === "+") setLbZoom((z) => Math.min(z + 0.25, 3));
      if (e.key === "-") setLbZoom((z) => Math.max(z - 0.25, 0.5));
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightbox, filtered.length]);

  const openLightbox = (i: number) => { setLightbox(i); setLbZoom(1); };
  const closeLightbox = () => { setLightbox(null); setLbZoom(1); };
  const toggleAuto = () => {
    userPausedRef.current = !userPausedRef.current;
    setAutoPaused((p) => !p);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <section
        className="relative overflow-hidden bg-[#faf7ee] py-10"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Grain texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="pointer-events-none absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-amber-500/[0.09]" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-80 w-80 rounded-full bg-[#18402c]/[0.06]" />

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto mb-6 max-w-[1300px] px-12 max-md:px-5">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">

            <div>
              <div className="mb-2 flex items-center gap-2.5">
                <span className="h-0.5 w-7 flex-shrink-0 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-amber-600">
                  Visual Stories
                </span>
              </div>
              <h2 className="font-display text-[clamp(28px,3vw,42px)] font-bold leading-[1.08] tracking-tight text-[#18402c]">
                Our <em className="not-italic text-amber-600">Gallery</em>
              </h2>
            </div>

            {/* Controls */}
            <div className="flex flex-shrink-0 items-center gap-2.5">
              <Link
                href="/gallery"
                className="
                  hidden md:flex items-center gap-2 rounded-[10px]
                  bg-[#18402c] px-4 py-2.5 text-[13px] font-semibold text-white
                  shadow-[0_2px_14px_rgba(24,64,44,0.25)]
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(24,64,44,0.3)]
                  [&:hover_svg:last-child]:translate-x-0.5
                "
              >
                <Images size={14} /> View All
                <ArrowRight size={13} className="transition-transform duration-200" />
              </Link>

              {/* Pause/Play */}
              <button
                onClick={toggleAuto}
                aria-label={autoPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                className="
                  flex h-10 w-10 items-center justify-center rounded-[12px]
                  border-[1.5px] border-[#18402c]/15 bg-white text-[#5c7060]
                  shadow-[0_2px_8px_rgba(24,64,44,0.08)]
                  transition-all duration-200
                  hover:border-[#18402c] hover:bg-[#18402c] hover:text-white hover:scale-105
                "
              >
                {autoPaused ? <Play size={15} /> : <Pause size={15} />}
              </button>

              {/* Prev / Next */}
              {([{ dir: -1 as const, icon: <ChevronLeft size={17} />, disabled: !canLeft, label: "Scroll left" },
              { dir: 1 as const, icon: <ChevronRight size={17} />, disabled: !canRight, label: "Scroll right" }
              ] as const).map(({ dir, icon, disabled, label }) => (
                <button
                  key={label}
                  onClick={() => scrollBy(dir)}
                  disabled={disabled}
                  aria-label={label}
                  className="
                    flex h-10 w-10 items-center justify-center rounded-[12px]
                    border-[1.5px] border-[#18402c]/15 bg-white text-[#5c7060]
                    shadow-[0_2px_8px_rgba(24,64,44,0.08)]
                    transition-all duration-200
                    hover:border-[#18402c] hover:bg-[#18402c] hover:text-white hover:scale-105
                    disabled:opacity-30 disabled:cursor-not-allowed
                    disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-[#5c7060]
                  "
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const count =
                c === "All"
                  ? GALLERY_IMAGES.length
                  : GALLERY_IMAGES.filter((g) => g.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => { setCategory(c); if (trackRef.current) trackRef.current.scrollLeft = 0; }}
                  className={`
                    rounded-full px-4 py-1.5 text-[12.5px] font-medium border-[1.5px]
                    transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${category === c
                      ? "border-[#18402c] bg-[#18402c] text-white shadow-[0_4px_16px_rgba(24,64,44,0.2)]"
                      : "border-[#18402c]/15 bg-transparent text-[#5c7060] hover:border-[#18402c] hover:text-[#18402c] hover:bg-[#18402c]/5"}
                  `}
                >
                  {c}{c !== "All" && <span className="ml-1.5 text-[11px] opacity-55">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── SLIDER ─────────────────────────────────────────────────────── */}
        <div className="relative z-10">
          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-20 transition-opacity duration-300"
            style={{ background: "linear-gradient(90deg,#faf7ee 0%,transparent 100%)", opacity: canLeft ? 1 : 0 }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-20 transition-opacity duration-300"
            style={{ background: "linear-gradient(270deg,#faf7ee 0%,transparent 100%)", opacity: canRight ? 1 : 0 }}
          />

          <div
            ref={trackRef}
            className="
              flex items-center gap-3.5 overflow-x-auto overflow-y-visible
              px-12 pb-6 pt-1.5 max-md:px-5
              [scroll-snap-type:x_mandatory] [-webkit-overflow-scrolling:touch]
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              cursor-grab select-none
            "
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {filtered.map((item, i) => {
              const sz = CARD_SIZES[(item.size as CardSize) ?? "normal"];
              return (
                <button
                  key={item.id}
                  onClick={() => openLightbox(i)}
                  className="
                    group relative flex-shrink-0 overflow-hidden rounded-[18px]
                    bg-[#e8e3d5] p-0 border-none [scroll-snap-align:start]
                    shadow-[0_4px_20px_rgba(24,64,44,0.09),0_1px_4px_rgba(0,0,0,0.06)]
                    transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    hover:-translate-y-1.5 hover:scale-[1.015]
                    hover:shadow-[0_20px_50px_rgba(24,64,44,0.18),0_4px_16px_rgba(0,0,0,0.1)]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
                  "
                  style={{ width: sz.w, height: sz.h }}
                  aria-label={`View: ${item.alt}`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes={`${sz.w}px`}
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] pointer-events-none"
                    unoptimized
                    draggable={false}
                  />

                  {/* Category badge */}
                  <span className="
                    absolute right-3 top-3 rounded-full border border-white/25
                    bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase
                    tracking-[0.08em] text-white backdrop-blur-[6px]
                    opacity-0 transition-opacity duration-300 group-hover:opacity-100
                  ">
                    {item.category}
                  </span>

                  {/* Hover overlay */}
                  <div className="
                    absolute inset-0 flex flex-col justify-end p-4
                    bg-gradient-to-t from-[#18402c]/80 via-[#18402c]/10 to-transparent
                    opacity-0 transition-opacity duration-300 group-hover:opacity-100
                  ">
                    <p className="
                      mb-2.5 text-[13px] font-medium leading-snug text-white
                      translate-y-2 transition-transform duration-300 group-hover:translate-y-0
                    ">
                      {item.alt}
                    </p>
                    <div className="
                      ml-auto flex h-8 w-8 items-center justify-center rounded-[9px]
                      border border-white/30 bg-white/20 text-white backdrop-blur-[6px]
                      translate-y-2 transition-all duration-300 group-hover:translate-y-0
                      hover:bg-amber-500
                    ">
                      <Maximize2 size={12} />
                    </div>
                  </div>
                </button>
              );
            })}

            {/* "View All" end card */}
            <Link
              href="/gallery"
              className="
                flex-shrink-0 rounded-[18px] [scroll-snap-align:start]
                flex flex-col items-center justify-center gap-3
                border-2 border-dashed border-[#18402c]/20
                bg-[#18402c]/[0.03] text-[#18402c]
                transition-all duration-250
                hover:bg-[#18402c]/[0.07] hover:border-[#18402c]/40 hover:-translate-y-1
              "
              style={{ width: 200, height: 260 }}
            >
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-[#18402c]/8">
                <Grid3X3 size={22} />
              </div>
              <div className="text-center">
                <div className="font-display text-base font-bold">View All</div>
                <div className="mt-1 text-[11px] text-[#5c7060]">Full Gallery →</div>
              </div>
            </Link>
          </div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto flex max-w-[1300px] items-center gap-4 px-12 max-md:px-5">
          <div className="h-[3px] max-w-[240px] flex-1 overflow-hidden rounded-full bg-[#18402c]/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#18402c] to-amber-500 transition-[width] duration-100 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <span className="flex-shrink-0 text-[12.5px] text-[#8a9e8e]">
            <span className="font-display text-sm font-bold text-[#18402c]">
              {filtered.length}
            </span>
            &nbsp;photos
          </span>

          {/* Live auto-scroll indicator */}
          {!autoPaused && (
            <div className="ml-auto flex items-center gap-2">
              <span
                className="h-[5px] w-[5px] rounded-full bg-amber-500"
                style={{ animation: "galPulse 1.4s ease-in-out infinite" }}
              />
              <span className="text-[11.5px] text-[#8a9e8e]">Auto-scrolling</span>
            </div>
          )}

          {/* Mobile view all */}
          <Link
            href="/gallery"
            className="
              ml-auto flex items-center gap-1.5 md:hidden
              text-[13px] font-semibold text-[#18402c]
              hover:text-amber-600 transition-colors duration-200
            "
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <style jsx>{`
          @keyframes galPulse {
            0%, 100% { opacity: 1;    transform: scale(1);    }
            50%       { opacity: 0.35; transform: scale(0.65); }
          }
        `}</style>
      </section>

      {/* ── LIGHTBOX ───────────────────────────────────────────────────────── */}
      {lightbox !== null && (() => {
        const item = filtered[lightbox];
        if (!item) return null;
        return (
          <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#071510]/95 backdrop-blur-2xl"
            onClick={closeLightbox}
            role="dialog"
            aria-modal
            aria-label="Photo lightbox"
          >
            {/* Top toolbar */}
            <div
              className="fixed inset-x-0 top-0 z-10 flex h-[60px] items-center justify-between bg-gradient-to-b from-black/50 to-transparent px-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-0.5 w-7 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">Gallery</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setLbZoom((z) => Math.max(z - 0.25, 0.5))} title="Zoom out (-)" className="lb-tbtn flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/15 bg-white/8 text-white/75 backdrop-blur-md transition-all hover:bg-white/18 hover:text-white"><ZoomOut size={15} /></button>
                <span className="min-w-[38px] text-center text-[12px] text-white/45">{Math.round(lbZoom * 100)}%</span>
                <button onClick={() => setLbZoom((z) => Math.min(z + 0.25, 3))} title="Zoom in (+)" className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/15 bg-white/8 text-white/75 backdrop-blur-md transition-all hover:bg-white/18 hover:text-white"><ZoomIn size={15} /></button>
                <div className="mx-1 h-5 w-px bg-white/12" />
                <a href={item.image} download onClick={(e) => e.stopPropagation()} title="Download" className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/15 bg-white/8 text-white/75 backdrop-blur-md transition-all hover:bg-white/18 hover:text-white"><Download size={15} /></a>
                <button onClick={(e) => { e.stopPropagation(); navigator.share?.({ title: item.alt, url: item.image }); }} title="Share" className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/15 bg-white/8 text-white/75 backdrop-blur-md transition-all hover:bg-white/18 hover:text-white"><Share2 size={15} /></button>
                <div className="mx-1 h-5 w-px bg-white/12" />
                <button onClick={closeLightbox} title="Close (Esc)" className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/15 bg-white/8 text-white/75 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"><X size={16} /></button>
              </div>
            </div>

            {/* Counter */}
            <div className="fixed left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/35 px-4 py-1.5 backdrop-blur-md">
              <span className="font-display text-sm font-semibold text-amber-300">{lightbox + 1}</span>
              <span className="text-sm text-white/40"> / {filtered.length}</span>
            </div>

            {/* Prev */}
            <button
              className="fixed left-5 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/12 bg-white/9 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-amber-500 hover:bg-amber-500 disabled:opacity-20 disabled:cursor-not-allowed"
              disabled={lightbox === 0}
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i ?? 0) - 1); setLbZoom(1); }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Image */}
            <div
              className={`relative max-h-[70vh] max-w-[min(88vw,920px)] overflow-hidden rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] ${lbZoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"}`}
              style={{ animation: "lbIn 0.28s cubic-bezier(0.16,1,0.3,1)" }}
              onClick={(e) => { e.stopPropagation(); setLbZoom((z) => z > 1 ? 1 : 2); }}
            >
              <Image
                key={lightbox}
                src={item.image}
                alt={item.alt}
                width={1200}
                height={800}
                className="block max-h-[70vh] w-full object-contain"
                style={{ transform: `scale(${lbZoom})`, transition: "transform 0.3s", transformOrigin: "center" }}
                unoptimized
                draggable={false}
              />
            </div>

            {/* Next */}
            <button
              className="fixed right-5 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/12 bg-white/9 text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-amber-500 hover:bg-amber-500 disabled:opacity-20 disabled:cursor-not-allowed"
              disabled={lightbox === filtered.length - 1}
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i ?? 0) + 1); setLbZoom(1); }}
              aria-label="Next photo"
            >
              <ChevronRight size={20} />
            </button>

            {/* Caption bar */}
            <div
              className="fixed bottom-[108px] left-1/2 z-10 -translate-x-1/2 flex items-center gap-2.5 rounded-[12px] border border-white/10 bg-black/45 px-4 py-2.5 backdrop-blur-md max-w-[min(88vw,600px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="flex-shrink-0 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-300">
                {item.category}
              </span>
              <span className="truncate text-[13px] text-white/80">{item.alt}</span>
            </div>

            {/* Thumbnail filmstrip */}
            <div
              className="fixed bottom-5 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2 rounded-[16px] border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md max-w-[min(92vw,700px)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {filtered.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => { setLightbox(i); setLbZoom(1); }}
                  className={`
                    relative h-9 w-11 flex-shrink-0 overflow-hidden rounded-[8px] border-2 p-0
                    transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    ${i === lightbox
                      ? "border-amber-500 opacity-100 scale-110"
                      : "border-transparent opacity-45 hover:opacity-75"}
                  `}
                  aria-label={`Jump to: ${t.alt}`}
                >
                  <Image src={t.image} alt="" fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>

            <style jsx>{`
              @keyframes lbIn {
                from { transform: scale(0.93); opacity: 0; }
                to   { transform: scale(1);    opacity: 1; }
              }
            `}</style>
          </div>
        );
      })()}
    </>
  );
}