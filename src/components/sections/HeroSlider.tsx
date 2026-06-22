"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { clsx } from "clsx";
import { HeroData } from "@/types/db";
import { f } from "@/lib/helper/feature_flag";

// ── Main Component ───────────────────────────────────────────
export function HeroSlider({ data }: { data: HeroData }) {
  const { slides, config, featureFlags: ff } = data;

  const [current, setCurrent] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = slides.length;

  // Entrance animation
  useEffect(() => {
    if (!f(ff, "hero.entrance_animation")) { setContentVisible(true); return; }
    const t = setTimeout(() => setContentVisible(true), 200);
    return () => clearTimeout(t);
  }, [ff]);

  const goTo = useCallback((index: number) => {
    if (isTransitioning || total === 0) return;
    setIsTransitioning(true);
    setPrevIdx(current);
    setCurrent(index);
    setProgress(0);
    setTimeout(() => {
      setPrevIdx(null);
      setIsTransitioning(false);
    }, Number(config.hero_transition_ms));
  }, [isTransitioning, current, total, config.hero_transition_ms]);

  const goNext = useCallback(() => goTo((current + 1) % total), [current, goTo, total]);
  const goPrev = useCallback(() => goTo((current - 1 + total) % total), [current, goTo, total]);

  // Autoplay + progress bar
  const startAutoPlay = useCallback(() => {
    if (!f(ff, "hero.autoplay")) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    let p = 0;
    const step = (100 / Number(config.hero_autoplay_ms)) * 100; // % per 100ms tick
    progressRef.current = setInterval(() => {
      p += step;
      setProgress(Math.min(p, 100));
    }, 100);
    intervalRef.current = setInterval(goNext, Number(config.hero_autoplay_ms));
  }, [goNext, ff, config.hero_autoplay_ms]);

  useEffect(() => {
    if (!isHovered) {
      startAutoPlay();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isHovered, startAutoPlay]);

  // Nothing to render if no slides
  if (!slides.length) return null;

  const slide = slides[current] ?? slides[0];
  const transitionDuration = `${config.hero_transition_ms}ms`;

  return (
    <section
      className="relative w-full bg-primary-900 overflow-hidden"
      style={{ height: config.hero_height_clamp }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Background slides ──────────────────────────────── */}
      {slides.map((sl, i) => (
        <div
          key={sl.id}
          className={clsx(
            "absolute inset-0 ease-in-out",
            i === current ? "opacity-100 z-[1] scale-100" : "opacity-0 z-0 scale-[1.03]",
            i === prevIdx && "opacity-0 scale-[0.98]"
          )}
          style={{ transition: `all ${transitionDuration}` }}
        >
          <Image
            src={sl.image_url}
            alt={sl.image_alt}
            fill
            className={clsx(
              "object-cover object-center",
              f(ff, "hero.hover_parallax") && i === current && isHovered
                ? "scale-[1.04]"
                : "scale-100"
            )}
            style={{ transition: "transform 8000ms linear" }}
            priority={i === 0}
            sizes="100vw"
            unoptimized
          />
        </div>
      ))}

      {/* ── Overlays ───────────────────────────────────────── */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-primary-900/85 via-primary-900/50 to-transparent" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
      <div className={clsx(
        "absolute inset-0 z-[2] bg-gradient-to-r from-primary-900/20 to-transparent transition-opacity duration-500",
        isHovered ? "opacity-100" : "opacity-0"
      )} />

      {/* ── Left accent line ───────────────────────────────── */}
      {f(ff, "hero.accent_line") && (
        <div className="absolute left-0 top-0 bottom-0 z-[4] w-[3px] bg-gradient-to-b from-transparent via-gold-400 to-transparent opacity-70" />
      )}

      {/* ── Main content ───────────────────────────────────── */}
      <div className="absolute inset-0 z-[5] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-lg">

            {/* Eyebrow */}
            {slide.eyebrow && (
              <div className={clsx(
                "flex items-center gap-2.5 mb-4 transition-all duration-500",
                contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}>
                <MapPin size={11} className="text-gold-400 flex-shrink-0" />
                <span
                  key={`eyebrow-${slide.id}`}
                  className="font-body text-[0.68rem] font-bold tracking-[0.2em] uppercase text-white/60"
                  style={{ animation: "heroFadeIn 0.4s ease forwards" }}
                >
                  {slide.eyebrow}
                </span>
                <span className="h-px flex-1 max-w-[40px] bg-white/20" />
              </div>
            )}

            {/* Title */}
            {(slide.title || slide.title_accent) && (
              <h1 className={clsx(
                "font-display leading-[1.05] mb-4 transition-all duration-600 delay-100",
                contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              )}>
                {slide.title && (
                  <span
                    key={`t1-${slide.id}`}
                    className="block text-white font-semibold"
                    style={{
                      fontSize: "clamp(1.9rem, 4vw, 3.25rem)",
                      animation: `heroSlideUp ${Number(config.hero_transition_ms) * 0.7}ms cubic-bezier(0.16,1,0.3,1) 0.05s both`,
                    }}
                  >
                    {slide.title}
                  </span>
                )}
                {slide.title_accent && (
                  <em
                    key={`t2-${slide.id}`}
                    className="block not-italic font-semibold"
                    style={{
                      fontSize: "clamp(1.9rem, 4vw, 3.25rem)",
                      background: "linear-gradient(90deg, #F5A623 0%, #FBCA6E 50%, #F5A623 100%)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      animation: `heroSlideUp ${Number(config.hero_transition_ms) * 0.7}ms cubic-bezier(0.16,1,0.3,1) 0.13s both, shimmerGold 3s linear 0.7s infinite`,
                    }}
                  >
                    {slide.title_accent}
                  </em>
                )}
              </h1>
            )}

            {/* Description */}
            {slide.description && (
              <p
                key={`desc-${slide.id}`}
                className={clsx(
                  "font-body text-white/65 leading-relaxed mb-6 transition-all duration-500 delay-200",
                  contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
                style={{
                  fontSize: "clamp(0.82rem, 1.4vw, 0.95rem)",
                  maxWidth: "380px",
                  animation: "heroFadeIn 0.5s ease 0.28s both",
                }}
              >
                {slide.description}
              </p>
            )}

            {/* CTA row */}
            <div style={{ animation: "heroFadeIn 0.5s ease 0.38s both", opacity: 0 }}
              className="flex items-center gap-3 flex-wrap"
            >
              {/* Primary CTA */}
              {slide.cta_label && slide.cta_href && (
                <Link
                  href={slide.cta_href}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-semibold text-white bg-gradient-gold shadow-gold-sm hover:-translate-y-0.5 hover:shadow-gold-md active:translate-y-0 transition-all duration-200 ease-spring"
                >
                  {slide.cta_label}
                  <ArrowRight size={14} className="transition-transform duration-200 ease-spring group-hover:translate-x-1" />
                </Link>
              )}

              {/* Explore link */}
              {f(ff, "hero.explore_link") && config.hero_explore_href && (
                <Link
                  href={config.hero_explore_href}
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
                >
                  <span className="w-4 h-px bg-current" />
                  {config.hero_explore_label}
                </Link>
              )}

              {/* Tag pill */}
              {f(ff, "hero.tag_pill") && slide.tag_label && (
                <span
                  key={`tag-${slide.id}`}
                  className="ml-auto hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 font-body text-[0.68rem] font-semibold tracking-wide text-white/70"
                  style={{ animation: "heroFadeIn 0.4s ease 0.5s both", opacity: 0 }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse-dot" />
                  {slide.tag_label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Thumbnail nav (right, hover) ───────────────────── */}
      {f(ff, "hero.thumbnail_nav") && (
        <div className={clsx(
          "absolute right-5 top-1/2 -translate-y-1/2 z-[6] flex flex-col items-center gap-3 transition-all duration-400",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
        )}>
          {slides.map((sl, i) => (
            <button
              key={sl.id}
              onClick={() => goTo(i)}
              className={clsx(
                "relative overflow-hidden rounded-md border transition-all duration-300 ease-spring",
                i === current
                  ? "w-[52px] h-[38px] border-gold-400 shadow-gold-sm scale-105"
                  : "w-[44px] h-[32px] border-white/20 opacity-60 hover:opacity-100 hover:border-white/50 hover:scale-105"
              )}
              aria-label={`Slide ${i + 1}`}
            >
              <Image src={sl.image_url} alt={sl.image_alt} fill className="object-cover" unoptimized sizes="52px" />
              {i === current && (
                <div className="absolute inset-0 ring-1 ring-gold-400 ring-inset rounded-md" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Arrow navigation ───────────────────────────────── */}
      {f(ff, "hero.arrow_nav") && (
        <>
          <button
            onClick={goPrev}
            className={clsx(
              "absolute left-4 top-1/2 -translate-y-1/2 z-[6] w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ease-spring",
              "bg-white/10 border-white/20 text-white/70 backdrop-blur-sm",
              "hover:bg-gold-500 hover:border-gold-400 hover:text-white hover:scale-110 hover:shadow-gold-sm",
              "active:scale-95",
              isHovered ? "opacity-100" : "opacity-0 -translate-x-2"
            )}
            aria-label="Previous"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goNext}
            className={clsx(
              "absolute top-1/2 -translate-y-1/2 z-[6] w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ease-spring",
              "bg-white/10 border-white/20 text-white/70 backdrop-blur-sm",
              "hover:bg-gold-500 hover:border-gold-400 hover:text-white hover:scale-110 hover:shadow-gold-sm",
              "active:scale-95",
              // Shift left of thumbnail strip if visible, else near right edge
              f(ff, "hero.thumbnail_nav") ? "right-[5.5rem]" : "right-4",
              isHovered ? "opacity-100" : "opacity-0 translate-x-2"
            )}
            aria-label="Next"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* ── Bottom bar ─────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-[6] flex items-center gap-4 px-6 lg:px-12 pb-4">

        {/* Slide counter */}
        {f(ff, "hero.slide_counter") && (
          <div className={clsx(
            "flex items-baseline gap-1.5 transition-all duration-400",
            isHovered ? "opacity-100" : "opacity-40"
          )}>
            <span className="font-display text-2xl font-bold text-gold-400 leading-none">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="font-body text-[0.6rem] text-white/30 font-medium">
              / {String(total).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Progress bar */}
        {f(ff, "hero.progress_bar") && (
          <div className="flex-1 h-px bg-white/15 relative max-w-[200px]">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 6px rgba(245,166,35,0.6)",
                transition: "none",
              }}
            />
          </div>
        )}

        {/* Dot nav */}
        {f(ff, "hero.dot_nav") && (
          <div className="flex items-center gap-1.5 ml-auto">
            {slides.map((sl, i) => (
              <button
                key={sl.id}
                onClick={() => goTo(i)}
                className={clsx(
                  "rounded-full transition-all duration-300 ease-spring",
                  i === current
                    ? "w-5 h-1.5 bg-gold-400"
                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Keyframes ──────────────────────────────────────── */}
      <style>{`
        @keyframes heroSlideUp {
          from { opacity: 0; transform: translateY(22px) skewY(1deg); }
          to   { opacity: 1; transform: translateY(0)    skewY(0deg); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerGold {
          0%   { background-position: 0%   center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
}


// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
// import { clsx } from "clsx";
// import { SLIDER_IMAGES } from "@/lib/data";

// const SLIDE_META = [
//   {
//     eyebrow: "Est. 2021 · Eastern UP",
//     title: "Empowering Women,",
//     titleAccent: "Nourishing Lives",
//     description: "A women-owned dairy cooperative transforming livelihoods across 7 districts.",
//     cta: { label: "Our Story", href: "/about-us" },
//     tag: "45,000+ Members",
//   },
//   {
//     eyebrow: "Community & Growth",
//     title: "Rooted in Villages,",
//     titleAccent: "Reaching the Nation",
//     description: "1,000+ villages. One mission — sustainable dairy for every woman farmer.",
//     cta: { label: "Meet Members", href: "/membership" },
//     tag: "7 Districts",
//   },
//   {
//     eyebrow: "Dairy Value Chain",
//     title: "From Farm to Table,",
//     titleAccent: "With Care",
//     description: "Pure milk and premium dairy products crafted with love by the women of Eastern UP.",
//     cta: { label: "Our Products", href: "/milk-milk-products" },
//     tag: "Since March 2022",
//   },
//   {
//     eyebrow: "Veterinary Services",
//     title: "Healthier Animals,",
//     titleAccent: "Better Yields",
//     description: "Comprehensive veterinary care, breeding, and nutrition programs at your doorstep.",
//     cta: { label: "Our Services", href: "/animal-breeding-services" },
//     tag: "Mobile Vet Units",
//   },
//   {
//     eyebrow: "Impact & Progress",
//     title: "Growing Together,",
//     titleAccent: "Every Single Day",
//     description: "A cooperative built on trust, transparency, and the power of collective ownership.",
//     cta: { label: "Annual Reports", href: "/annual-reports" },
//     tag: "UPSRLM · NDDB",
//   },
// ];

// export function HeroSlider() {
//   const [current, setCurrent] = useState(0);
//   const [prevIdx, setPrevIdx] = useState<number | null>(null);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [contentVisible, setContentVisible] = useState(false);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const total = SLIDER_IMAGES.length;

//   // Mount entrance animation
//   useEffect(() => {
//     const t = setTimeout(() => setContentVisible(true), 200);
//     return () => clearTimeout(t);
//   }, []);

//   const goTo = useCallback((index: number) => {
//     if (isTransitioning) return;
//     setIsTransitioning(true);
//     setPrevIdx(current);
//     setCurrent(index);
//     setProgress(0);
//     setTimeout(() => { setPrevIdx(null); setIsTransitioning(false); }, 800);
//   }, [isTransitioning, current]);

//   const goNext = useCallback(() => goTo((current + 1) % total), [current, goTo, total]);
//   const goPrev = useCallback(() => goTo((current - 1 + total) % total), [current, goTo, total]);

//   const startAutoPlay = useCallback(() => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     if (progressRef.current) clearInterval(progressRef.current);
//     setProgress(0);
//     let p = 0;
//     progressRef.current = setInterval(() => { p += 2; setProgress(Math.min(p, 100)); }, 100);
//     intervalRef.current = setInterval(goNext, 5000);
//   }, [goNext]);

//   useEffect(() => {
//     if (!isHovered) startAutoPlay();
//     else {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       if (progressRef.current) clearInterval(progressRef.current);
//     }
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//       if (progressRef.current) clearInterval(progressRef.current);
//     };
//   }, [isHovered, startAutoPlay]);

//   const meta = SLIDE_META[current] ?? SLIDE_META[0];

//   return (
//     <section
//       className="relative w-full bg-primary-900 overflow-hidden"
//       style={{ height: "clamp(340px, 46vw, 520px)" }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* ── Background slides ── */}
//       {SLIDER_IMAGES.map((slide, i) => (
//         <div
//           key={i}
//           className={clsx(
//             "absolute inset-0 transition-all duration-[800ms] ease-in-out",
//             i === current ? "opacity-100 z-[1] scale-100" : "opacity-0 z-0 scale-[1.03]",
//             i === prevIdx && "opacity-0 scale-[0.98]"
//           )}
//         >
//           <Image
//             src={slide.src}
//             alt={slide.alt}
//             fill
//             className={clsx(
//               "object-cover object-center transition-transform duration-[8000ms] ease-linear",
//               i === current && isHovered ? "scale-[1.04]" : "scale-100"
//             )}
//             priority={i === 0}
//             sizes="100vw"
//             unoptimized
//           />
//         </div>
//       ))}

//       {/* ── Overlays ── */}
//       {/* Left panel dark wash */}
//       <div className="absolute inset-0 z-[2] bg-gradient-to-r from-primary-900/85 via-primary-900/50 to-transparent" />
//       {/* Bottom fade */}
//       <div className="absolute inset-0 z-[2] bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
//       {/* Hover depth boost */}
//       <div className={clsx(
//         "absolute inset-0 z-[2] bg-gradient-to-r from-primary-900/20 to-transparent transition-opacity duration-500",
//         isHovered ? "opacity-100" : "opacity-0"
//       )} />

//       {/* ── Vertical accent line ── */}
//       <div className="absolute left-0 top-0 bottom-0 z-[4] w-[3px] bg-gradient-to-b from-transparent via-gold-400 to-transparent opacity-70" />

//       {/* ── Main content ── */}
//       <div className="absolute inset-0 z-[5] flex items-center">
//         <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
//           <div className="max-w-lg">

//             {/* Eyebrow */}
//             <div className={clsx(
//               "flex items-center gap-2.5 mb-4 transition-all duration-500",
//               contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
//             )}>
//               <MapPin size={11} className="text-gold-400 flex-shrink-0" />
//               <span
//                 key={`eyebrow-${current}`}
//                 className="font-body text-[0.68rem] font-bold tracking-[0.2em] uppercase text-white/60"
//                 style={{ animation: "heroFadeIn 0.4s ease forwards" }}
//               >
//                 {meta.eyebrow}
//               </span>
//               <span className="h-px flex-1 max-w-[40px] bg-white/20" />
//             </div>

//             {/* Title */}
//             <h1 className={clsx(
//               "font-display leading-[1.05] mb-4 transition-all duration-600 delay-100",
//               contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
//             )}>
//               <span
//                 key={`t1-${current}`}
//                 className="block text-white font-semibold"
//                 style={{
//                   fontSize: "clamp(1.9rem, 4vw, 3.25rem)",
//                   animation: "heroSlideUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.05s both"
//                 }}
//               >
//                 {meta.title}
//               </span>
//               <em
//                 key={`t2-${current}`}
//                 className="block not-italic font-semibold"
//                 style={{
//                   fontSize: "clamp(1.9rem, 4vw, 3.25rem)",
//                   background: "linear-gradient(90deg, #F5A623 0%, #FBCA6E 50%, #F5A623 100%)",
//                   backgroundSize: "200% auto",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   backgroundClip: "text",
//                   animation: "heroSlideUp 0.55s cubic-bezier(0.16,1,0.3,1) 0.13s both, shimmerGold 3s linear 0.7s infinite"
//                 }}
//               >
//                 {meta.titleAccent}
//               </em>
//             </h1>

//             {/* Description */}
//             <p
//               key={`desc-${current}`}
//               className={clsx(
//                 "font-body text-white/65 leading-relaxed mb-6 transition-all duration-500 delay-200",
//                 contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
//               )}
//               style={{
//                 fontSize: "clamp(0.82rem, 1.4vw, 0.95rem)",
//                 maxWidth: "380px",
//                 animation: "heroFadeIn 0.5s ease 0.28s both"
//               }}
//             >
//               {meta.description}
//             </p>

//             {/* CTA row */}
//             <div
//               style={{ animation: "heroFadeIn 0.5s ease 0.38s both", opacity: 0 }}
//               className="flex items-center gap-3 flex-wrap"
//             >
//               <Link
//                 href={meta.cta.href}
//                 className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-semibold text-white bg-gradient-gold shadow-gold-sm hover:-translate-y-0.5 hover:shadow-gold-md active:translate-y-0 transition-all duration-200 ease-spring"
//               >
//                 {meta.cta.label}
//                 <ArrowRight size={14} className="transition-transform duration-200 ease-spring group-hover:translate-x-1" />
//               </Link>

//               <Link
//                 href="/about-us"
//                 className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
//               >
//                 <span className="w-4 h-px bg-current" />
//                 Explore
//               </Link>

//               {/* Tag pill */}
//               <span
//                 key={`tag-${current}`}
//                 className="ml-auto hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 font-body text-[0.68rem] font-semibold tracking-wide text-white/70"
//                 style={{ animation: "heroFadeIn 0.4s ease 0.5s both", opacity: 0 }}
//               >
//                 <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse-dot" />
//                 {meta.tag}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Right side: slide number + thumbs ── */}
//       <div className={clsx(
//         "absolute right-5 top-1/2 -translate-y-1/2 z-[6] flex flex-col items-center gap-3 transition-all duration-400",
//         isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
//       )}>
//         {SLIDER_IMAGES.map((slide, i) => (
//           <button
//             key={i}
//             onClick={() => goTo(i)}
//             className={clsx(
//               "relative overflow-hidden rounded-md border transition-all duration-300 ease-spring",
//               i === current
//                 ? "w-[52px] h-[38px] border-gold-400 shadow-gold-sm scale-105"
//                 : "w-[44px] h-[32px] border-white/20 opacity-60 hover:opacity-100 hover:border-white/50 hover:scale-105"
//             )}
//             aria-label={`Slide ${i + 1}`}
//           >
//             <Image src={slide.src} alt={slide.alt} fill className="object-cover" unoptimized sizes="52px" />
//             {i === current && (
//               <div className="absolute inset-0 ring-1 ring-gold-400 ring-inset rounded-md" />
//             )}
//           </button>
//         ))}
//       </div>

//       {/* ── Nav arrows ── */}
//       <button
//         onClick={goPrev}
//         className={clsx(
//           "absolute left-4 top-1/2 -translate-y-1/2 z-[6] w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ease-spring",
//           "bg-white/10 border-white/20 text-white/70 backdrop-blur-sm",
//           "hover:bg-gold-500 hover:border-gold-400 hover:text-white hover:scale-110 hover:shadow-gold-sm",
//           "active:scale-95",
//           isHovered ? "opacity-100" : "opacity-0 -translate-x-2"
//         )}
//         aria-label="Previous"
//       >
//         <ChevronLeft size={16} />
//       </button>
//       <button
//         onClick={goNext}
//         className={clsx(
//           "absolute right-[5.5rem] top-1/2 -translate-y-1/2 z-[6] w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ease-spring",
//           "bg-white/10 border-white/20 text-white/70 backdrop-blur-sm",
//           "hover:bg-gold-500 hover:border-gold-400 hover:text-white hover:scale-110 hover:shadow-gold-sm",
//           "active:scale-95",
//           isHovered ? "opacity-100" : "opacity-0 translate-x-2"
//         )}
//         aria-label="Next"
//       >
//         <ChevronRight size={16} />
//       </button>

//       {/* ── Bottom bar: progress + counter ── */}
//       <div className="absolute bottom-0 left-0 right-0 z-[6] flex items-center gap-4 px-6 lg:px-12 pb-4">
//         {/* Slide counter */}
//         <div className={clsx(
//           "flex items-baseline gap-1.5 transition-all duration-400",
//           isHovered ? "opacity-100" : "opacity-40"
//         )}>
//           <span className="font-display text-2xl font-bold text-gold-400 leading-none">
//             {String(current + 1).padStart(2, "0")}
//           </span>
//           <span className="font-body text-[0.6rem] text-white/30 font-medium">
//             / {String(total).padStart(2, "0")}
//           </span>
//         </div>

//         {/* Progress track */}
//         <div className="flex-1 h-px bg-white/15 relative max-w-[200px]">
//           <div
//             className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-none rounded-full"
//             style={{
//               width: `${progress}%`,
//               boxShadow: "0 0 6px rgba(245,166,35,0.6)"
//             }}
//           />
//         </div>

//         {/* Dot nav */}
//         <div className="flex items-center gap-1.5 ml-auto">
//           {SLIDER_IMAGES.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => goTo(i)}
//               className={clsx(
//                 "rounded-full transition-all duration-300 ease-spring",
//                 i === current
//                   ? "w-5 h-1.5 bg-gold-400"
//                   : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
//               )}
//               aria-label={`Slide ${i + 1}`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ── Keyframes injected inline ── */}
//       <style>{`
//         @keyframes heroSlideUp {
//           from { opacity: 0; transform: translateY(22px) skewY(1deg); }
//           to   { opacity: 1; transform: translateY(0)    skewY(0deg); }
//         }
//         @keyframes heroFadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes shimmerGold {
//           0%   { background-position: 0%   center; }
//           100% { background-position: 200% center; }
//         }
//       `}</style>
//     </section>
//   );
// }