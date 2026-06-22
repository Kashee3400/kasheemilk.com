"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import type { StatsData } from "@/types/db";
import s from "./StatsSection.module.css";
import { f } from "@/lib/helper/feature_flag";

// ── Animated counter ─────────────────────────────────────────
function AnimatedCounter({
  target, suffix, started, durationMs,
}: {
  target: number;
  suffix: string;
  started: boolean;
  durationMs: number;
}) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!started) return;
    startRef.current = performance.now();
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now: number) => {
      const p = Math.min((now - startRef.current) / durationMs, 1);
      setCount(Math.floor(ease(p) * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setCount(target);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, target, durationMs]);

  return <>{count.toLocaleString()}{suffix}</>;
}

// ── Main component ───────────────────────────────────────────
export function StatsSection({ data }: { data: StatsData }) {
  const { stats, config: cfg, featureFlags: ff } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [canScrollL, setCanScrollL] = useState(false);
  const [canScrollR, setCanScrollR] = useState(false);

  // Many cards = force horizontal scroll even on desktop
  const forceScroll = stats.length > 5;

  // Intersection observer — start counters when visible
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Track scroll position to update dot indicator + arrow state
  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollL(el.scrollLeft > 8);
    setCanScrollR(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    // Estimate active card by scroll position
    const cardW = 190 + 16; // width + gap
    setActiveIdx(Math.round(el.scrollLeft / cardW));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // Check initial state
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll, stats]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = 190 + 16;
    el.scrollBy({ left: dir * cardW * 2, behavior: "smooth" });
  };

  const scrollToIdx = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const cardW = 190 + 16;
    el.scrollTo({ left: i * cardW, behavior: "smooth" });
  };

  const showCounter = f(ff, "stats.animated_counter");
  const snapEnabled = f(ff, "stats.scroll_snap");
  const showIcon = f(ff, "stats.show_icon");
  const showDivider = f(ff, "stats.show_divider");
  const offsetAlt = f(ff, "stats.offset_alt_cards");

  // Build heading with accent word highlighted
  const headingParts = cfg.stats_heading.split(cfg.stats_accent);

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.inner}>

        {/* ── Header ─────────────────────────────────────── */}
        <div className={s.header}>
          <div className={s.eyebrow}>
            <TrendingUp size={12} className={s.eyebrowIcon} />
            <span className={s.eyebrowText}>{cfg.stats_eyebrow}</span>
          </div>
          <h2 className={s.heading}>
            {headingParts[0]}
            <em className={s.headingAccent}>{cfg.stats_accent}</em>
            {headingParts[1]}
          </h2>
          <p className={s.subtext}>{cfg.stats_subtext}</p>
        </div>

        {/* ── Card track ─────────────────────────────────── */}
        <div
          ref={trackRef}
          className={clsx(
            s.track,
            snapEnabled && s.trackSnap,
            forceScroll && s.forceScroll
          )}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.stat_key}
              className={clsx(
                s.card,
                offsetAlt && i % 2 === 1 && s.cardOffset
              )}
            >
              {showIcon && (
                <div className={s.iconWrap}>
                  <span role="img" aria-label={stat.label}>{stat.icon}</span>
                </div>
              )}

              <div className={s.number}>
                {showCounter ? (
                  <AnimatedCounter
                    target={Number(stat.numeric_value)}
                    suffix={stat.suffix}
                    started={started}
                    durationMs={cfg.stats_counter_ms}
                  />
                ) : (
                  <>{stat.display_value.toLocaleString()}{stat.suffix}</>
                )}
              </div>

              {showDivider && <div className={s.divider} />}

              <p className={s.label}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Scroll controls (shown when forceScroll or mobile) ── */}
        {stats.length > 1 && (
          <>
            <div className={s.scrollHint}>
              <button
                className={s.scrollBtn}
                onClick={() => scrollBy(-1)}
                disabled={!canScrollL}
                aria-label="Scroll left"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                className={s.scrollBtn}
                onClick={() => scrollBy(1)}
                disabled={!canScrollR}
                aria-label="Scroll right"
              >
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Dot indicators */}
            <div className={s.dots}>
              {stats.map((_, i) => (
                <button
                  key={i}
                  className={clsx(s.dot, i === activeIdx && s.dotActive)}
                  onClick={() => scrollToIdx(i)}
                  aria-label={`Go to stat ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
