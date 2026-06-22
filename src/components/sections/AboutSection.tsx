"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { SectionHeading } from "@/components/ui/SectionHeading";
import s from "./AboutSection.module.css";
import type { AboutData } from "@/types/db";
import { f } from "@/lib/helper/feature_flag";

// ── Derived item type — API shape only, not the full DB row ──
type NewsItem = AboutData["newsItems"][number];
type District = AboutData["districts"][number];
type SdgBadge = AboutData["sdgBadges"][number];
type Paragraph = AboutData["paragraphs"][number];


// ══════════════════════════════════════════════════════════════
// News sub-components
// ══════════════════════════════════════════════════════════════

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <Link href={item.href} className={s.newsItem}>
      <div className={s.newsThumb}>
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          className={s.newsThumbImg}
          unoptimized
          sizes="60px"
        />
      </div>
      <div className={s.newsBody}>
        <p className={s.newsTitle}>{item.title}</p>
        {item.source && <p className={s.newsSource}>{item.source}</p>}
      </div>
      <ChevronRight size={14} className={s.newsArrow} />
    </Link>
  );
}

function NewsTicker({
  items,
  speedS,
  pauseOnHover,
  autoScroll,
}: {
  items: NewsItem[];
  speedS: number;
  pauseOnHover: boolean;
  autoScroll: boolean;
}) {
  const [paused, setPaused] = useState(false);

  // Static mode — fixed-height scrollable list, no duplication
  if (!autoScroll) {
    return (
      <div style={{ height: 220, overflowY: "auto", scrollbarWidth: "none" }}>
        {items.map((item) => (
          <NewsRow key={item.id} item={item} />
        ))}
      </div>
    );
  }

  // Auto-scroll mode — duplicate list for seamless infinite loop
  return (
    <div
      className={s.marqueeOuter}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={clsx(s.marqueeTrack, paused && s.marqueePaused)}
        style={{
          animation: `tickerScrollY ${speedS}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {/* Original set */}
        {items.map((item) => <NewsRow key={`a-${item.id}`} item={item} />)}
        {/* Exact duplicate — required for seamless loop (animates -50%) */}
        {items.map((item) => <NewsRow key={`b-${item.id}`} item={item} />)}
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
// District tag
// ══════════════════════════════════════════════════════════════

function DistrictTag({ district }: { district: District }) {
  const inner = (
    <>
      <span className={s.districtDot} />
      {district.name}
    </>
  );

  return district.href ? (
    <Link href={district.href} className={s.districtTag}>
      {inner}
    </Link>
  ) : (
    <span className={s.districtTag}>{inner}</span>
  );
}


// ══════════════════════════════════════════════════════════════
// SDG Badge
// ══════════════════════════════════════════════════════════════

function SdgBadge({ badge }: { badge: SdgBadge }) {
  const img = (
    <>
      <Image
        src={badge.image_url}
        alt={badge.label}
        width={64}
        height={64}
        className={s.sdgImg}
        unoptimized
      />
      <span className={s.sdgBadgeLabel}>{badge.label}</span>
    </>
  );

  return badge.href ? (
    <Link href={badge.href} className={s.sdgItem}>
      {img}
    </Link>
  ) : (
    <div className={s.sdgItem}>{img}</div>
  );
}


// ══════════════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════════════

export function AboutSection({ data }: { data: AboutData }) {
  const {
    paragraphs,
    districts,
    sdgBadges,
    newsItems,
    config: cfg,
    featureFlags: ff,
  } = data;

  return (
    <section className={s.section}>
      <div className={s.inner}>
        <div className={s.grid}>

          {/* ── LEFT — About ─────────────────────────────── */}
          <div className={s.aboutCol}>
            <SectionHeading
              label={cfg?.about_section_label || ""}
              title={cfg?.about_section_title || ""}
              subtitle={cfg?.about_subtitle || ""}
            />

            {/* Paragraphs — support <strong> inline HTML */}
            {paragraphs.length > 0 && (
              <div className={s.body}>
                {paragraphs.map((p: Paragraph) => (
                  <p
                    key={p.id}
                    className={s.bodyText}
                    dangerouslySetInnerHTML={{ __html: p.content }}
                  />
                ))}
              </div>
            )}

            {/* ── Districts ──────────────────────────────── */}
            {f(ff, "about.districts") && districts.length > 0 && (
              <div className={clsx(
                s.districtsWrap,
                !f(ff, "about.districts_scroll") && s.noScroll
              )}>
                <p className={s.districtsLabel}>Operating Districts</p>
                <div className={s.districtsScroll}>
                  {districts.map((d: District) => (
                    <DistrictTag key={d.id} district={d} />
                  ))}
                </div>
              </div>
            )}

            {/* ── SDG Badges ─────────────────────────────── */}
            {f(ff, "about.sdg_badges") && sdgBadges.length > 0 && (
              <div className={clsx(
                s.sdgWrap,
                !f(ff, "about.sdg_scroll") && s.noScroll
              )}>
                <p className={s.sdgLabel}>Sustainable Development Goals</p>
                <div className={s.sdgScroll}>
                  {sdgBadges.map((badge: SdgBadge) => (
                    <SdgBadge key={badge.id} badge={badge} />
                  ))}
                </div>
              </div>
            )}

            {/* ── CTA ────────────────────────────────────── */}
            {f(ff, "about.cta_button") && (
              <Link href={cfg.about_cta_href} className={s.cta}>
                {cfg.about_cta_label}
                <ArrowRight size={16} className={s.ctaIcon} />
              </Link>
            )}
          </div>

          {/* ── RIGHT — News ─────────────────────────────── */}
          <div className={s.newsCol}>
            <SectionHeading
              label={cfg.news_section_label}
              title={cfg.news_section_title}
            />

            {f(ff, "about.news_ticker") && newsItems.length > 0 && (
              <div className={s.newsCard}>

                {/* Header */}
                <div className={s.newsHeader}>
                  <div className={s.newsHeaderLeft}>
                    {f(ff, "about.news_live_dot") && (
                      <span className={s.newsLiveDot} />
                    )}
                    <span className={s.newsHeaderLabel}>Latest Updates</span>
                  </div>
                  <Link href={cfg.news_view_all_href} className={s.newsHeaderLink}>
                    View all
                  </Link>
                </div>

                {/* Ticker */}
                <NewsTicker
                  items={newsItems}
                  speedS={cfg.news_ticker_speed_s}
                  pauseOnHover={f(ff, "about.news_pause_hover")}
                  autoScroll={f(ff, "about.news_auto_scroll")}
                />

                {/* Footer */}
                <div className={s.newsFooter}>
                  <Link href={cfg.news_footer_href} className={s.newsFooterLink}>
                    {cfg.news_footer_label}
                    <ArrowRight size={13} className={s.newsFooterLinkIcon} />
                  </Link>
                  <span className={s.newsCount}>{newsItems.length} articles</span>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}