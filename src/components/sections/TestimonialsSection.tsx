"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";
import { clsx } from "clsx";
import { TESTIMONIALS } from "@/lib/data";
import s from "./TestimonialsSection.module.css";

/* ─── Enrich testimonials with extra display data ─── */
const ENRICHED = [
  {
    ...TESTIMONIALS[0],
    role: "Member & Milk Producer",
    org: "Kashee Milk Producer Co. Ltd.",
    rating: 5,
    tag: "Member Story",
  },
  {
    ...TESTIMONIALS[1],
    role: TESTIMONIALS[1].role ?? "Executive – IT (Software Developer)",
    org: "Kashee Milk Producer Co. Ltd.",
    rating: 5,
    tag: "Team Voice",
  },
];

/* SVG progress ring */
const RING_R = 16;
const RING_C = 2 * Math.PI * RING_R;

function ProgressRing({ progress }: { progress: number }) {
  const offset = RING_C - (progress / 100) * RING_C;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className={s.progressRing}>
      <circle cx="20" cy="20" r={RING_R} className={s.ringTrack} />
      <circle
        cx="20" cy="20" r={RING_R}
        className={s.ringFill}
        strokeDasharray={RING_C}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [autoProgress, setAutoProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = ENRICHED.length;

  const go = useCallback((idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setAutoProgress(0);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 420);
  }, [animating, current]);

  const next = useCallback(() => go((current + 1) % total), [current, go, total]);
  const prev = useCallback(() => go((current - 1 + total) % total), [current, go, total]);

  /* Auto-advance every 7s */
  useEffect(() => {
    if (isPaused) return;
    let tick = 0;
    const id = setInterval(() => {
      tick += 1;
      setAutoProgress(Math.min((tick / 70) * 100, 100));
      if (tick >= 70) {
        tick = 0;
        setCurrent((c) => (c + 1) % total);
        setAutoProgress(0);
      }
    }, 100);
    return () => clearInterval(id);
  }, [isPaused, total]);

  /* Keyboard nav */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [next, prev]);

  const t = ENRICHED[current];

  return (
    <section
      className={s.section}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={s.inner}>

        {/* ── Header ── */}
        <div className={s.header}>
          <div className={s.eyebrow}>
            <span className={s.eyebrowDot} />
            <span className={s.eyebrowText}>Voices of Kashee</span>
          </div>
          <h2 className={s.heading}>
            What Our <em className={s.headingAccent}>People Say</em>
          </h2>
          <p className={s.subtext}>
            Real stories from members, farmers, and team members who make Kashee Milk what it is.
          </p>
        </div>

        {/* ── Main card ── */}
        <div className={s.card}>

          {/* Left — photo */}
          <div className={s.photoPanel}>
            <Image
              key={`photo-${t.id}`}
              src={t.image}
              alt={t.author}
              fill
              className={clsx(s.photo, s.animatePhoto)}
              unoptimized
              sizes="300px"
            />
            <div className={s.photoOverlay} />
            <span className={s.roleBadge}>{t.tag}</span>
            <div className={s.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className={i < t.rating ? s.star : s.starEmpty} />
              ))}
            </div>
            <ProgressRing progress={autoProgress} />
          </div>

          {/* Right — content */}
          <div className={s.contentPanel}>
            <span className={s.quoteDecor} aria-hidden="true">"</span>

            <div className={s.topMeta}>
              <div className={s.accentBar}>
                <div className={s.accentLine} />
                <span className={s.accentLabel}>Testimonial</span>
              </div>
              <span className={s.slideLabel}>
                {String(current + 1).padStart(2, "0")}&nbsp;&mdash;&nbsp;{String(total).padStart(2, "0")}
              </span>
            </div>

            <blockquote key={`q-${t.id}`} className={clsx(s.quote, s.animateIn)}>
              <span className={s.quoteOpen}>&ldquo;</span>
              {t.quote}
              <span className={s.quoteClose}>&rdquo;</span>
            </blockquote>

            <div key={`a-${t.id}`} className={clsx(s.author, s.animateInDelay)}>
              <div className={s.authorAvatar}>
                <Image
                  src={t.image} alt={t.author} fill
                  className={s.authorAvatarImg} unoptimized sizes="52px"
                />
              </div>
              <div className={s.authorInfo}>
                <div className={s.authorName}>{t.author}</div>
                <div className={s.authorRole}>{t.role}</div>
                <div className={s.authorOrg}>{t.org}</div>
              </div>
              <div className={s.verifiedBadge}>
                <BadgeCheck size={11} />
                Verified
              </div>
            </div>

            <div className={s.controls}>
              <div className={s.dots}>
                {ENRICHED.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={clsx(s.dot, i === current ? s.dotActive : s.dotInactive)}
                  />
                ))}
              </div>
              <span className={s.keyHint}>← → to navigate</span>
              <div className={s.arrows}>
                <button onClick={prev} className={s.arrow} aria-label="Previous testimonial">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={next} className={s.arrow} aria-label="Next testimonial">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Avatar strip ── */}
        <div className={s.avatarStrip}>
          {ENRICHED.map((item, i) => (
            <button
              key={item.id}
              onClick={() => go(i)}
              aria-label={`View ${item.author}'s testimonial`}
              className={clsx(s.avatarBtn, i === current ? s.avatarBtnActive : s.avatarBtnInactive)}
              style={{ width: i === current ? 56 : 44, height: i === current ? 56 : 44 }}
            >
              <Image
                src={item.image} alt={item.author} fill
                className={s.avatarImg} unoptimized sizes="56px"
              />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}