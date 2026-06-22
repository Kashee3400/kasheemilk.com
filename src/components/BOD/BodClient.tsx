"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Linkedin, MapPin, Calendar, Award } from "lucide-react";
import { clsx } from "clsx";
import type { BodData, BodMember } from "@/types/bod";
import s from "./BOD.module.css";

// ── Feature flag helper ──────────────────────────────────────
function f(flags: BodData["featureFlags"], key: string): boolean {
  return flags?.[key] ?? true;
}

// ── Group members by role — SORTED by role_sort_order ────────
// Returns groups in ascending role priority order.
// Members DB already comes sorted (ORDER BY r.sort_order, m.sort_order)
// so we just group while preserving order.
interface RoleGroupData {
  role_key: string;
  role_label: string;
  role_sort_order: number;
  members: BodMember[];
}

function groupByRole(members: BodMember[]): RoleGroupData[] {
  const map = new Map<string, RoleGroupData>();

  for (const m of members) {
    const key = m.role_key ?? "director";
    if (!map.has(key)) {
      map.set(key, {
        role_key:        m.role_key,
        role_label:      m.role_label,
        role_sort_order: m.role_sort_order ?? 99,
        members:         [],
      });
    }
    map.get(key)!.members.push(m);
  }

  // Sort groups by role_sort_order ascending (lower = higher priority = shown first)
  return Array.from(map.values()).sort((a, b) => a.role_sort_order - b.role_sort_order);
}

// ── Section label — pluralise sensibly ───────────────────────
function sectionLabel(role_label: string, count: number): string {
  if (count === 1) return role_label;
  // Simple pluralisation — extend if needed
  if (role_label.endsWith("or"))  return role_label + "s";
  if (role_label.endsWith("man")) return role_label.replace(/man$/, "men");
  return role_label + "s";
}

// ── Member card ───────────────────────────────────────────────
function MemberCard({
  member,
  ff,
  appointedPrefix,
}: {
  member: BodMember;
  ff: BodData["featureFlags"];
  appointedPrefix: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const bioExpandable = f(ff, "bod.bio_expandable");

  return (
    <div className={s.card}>
      {/* Photo */}
      <div className={s.photoRing}>
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.full_name}
            width={100}
            height={100}
            className={s.photo}
            unoptimized
          />
        ) : (
          <div className={s.photoPlaceholder}>👤</div>
        )}
      </div>

      {/* Name + role */}
      <p className={s.cardName}>{member.full_name}</p>
      <p className={s.cardRole}>{member.designation || member.role_label}</p>
      <div className={s.cardDivider} />

      {/* Qualification */}
      {f(ff, "bod.show_qualification") && member.qualification && (
        <p className={s.cardQual}>
          <Award size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
          {member.qualification}
        </p>
      )}

      {/* Bio */}
      {member.bio && (
        <>
          <p className={clsx(
            s.cardBio,
            bioExpandable && !expanded && s.cardBioShort,
            expanded && s.cardBioExpanded,
          )}>
            {member.bio}
          </p>
          {bioExpandable && (
            <button className={s.cardReadMore} onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Show less ↑" : "Read more ↓"}
            </button>
          )}
        </>
      )}

      {/* Meta tags */}
      <div className={s.cardMeta}>
        {f(ff, "bod.show_appointed_date") && member.appointed_on && (
          <span className={s.cardMetaTag}>
            <Calendar size={10} />
            {appointedPrefix} {member.appointed_on}
          </span>
        )}
        {f(ff, "bod.show_district") && member.district && (
          <span className={s.cardMetaTag}>
            <MapPin size={10} />
            {member.district}
          </span>
        )}
      </div>

      {/* LinkedIn */}
      {f(ff, "bod.show_linkedin") && member.linkedin_url && (
        <Link href={member.linkedin_url} target="_blank" rel="noopener" className={s.cardLinkedIn}>
          <Linkedin size={14} />
        </Link>
      )}
    </div>
  );
}

// ── Role carousel section ─────────────────────────────────────
function RoleSection({
  group,
  ff,
  config,
  index,
}: {
  group: RoleGroupData;
  ff: BodData["featureFlags"];
  config: BodData["config"];
  index: number;  // section index — used for staggered reveal delay
}) {
  const trackRef     = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const cardsPerView = Number(config.bod_cards_per_view) || 3;
  const { members }  = group;
  const maxIdx       = Math.max(0, members.length - cardsPerView);
  const showControls = members.length > cardsPerView;

  // Auto-carousel
  useEffect(() => {
    if (!f(ff, "bod.auto_carousel") || !showControls) return;
    const id = setInterval(() => {
      setActive((v) => {
        const next = v >= maxIdx ? 0 : v + 1;
        doScrollTo(next);
        return next;
      });
    }, config.bod_carousel_speed_ms);
    return () => clearInterval(id);
  }, [showControls, maxIdx, config.bod_carousel_speed_ms, ff]);

  const doScrollTo = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    // Get first card width dynamically
    const firstCard = el.querySelector<HTMLElement>(`.${s.card}`);
    const gap   = 22;
    const cardW = firstCard ? firstCard.offsetWidth + gap : 282;
    el.scrollTo({ left: idx * cardW, behavior: "smooth" });
    setActive(idx);
  };

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>(`.${s.card}`);
    const gap   = 22;
    const cardW = firstCard ? firstCard.offsetWidth + gap : 282;
    setActive(Math.round(el.scrollLeft / cardW));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <div className={s.roleSection} style={{ animationDelay: `${index * 80}ms` }}>
      {/* Role divider heading */}
      <div className={s.roleDivider}>
        <div className={s.roleDividerLine} />
        <span className={s.roleDividerLabel}>
          {sectionLabel(group.role_label, members.length)}
          <span className={s.roleDividerCount}>{members.length}</span>
        </span>
        <div className={s.roleDividerLine} />
      </div>

      <div className={s.carouselWrap}>
        {/* Card track */}
        <div
          ref={trackRef}
          className={s.carouselTrack}
          style={
            // ≤ cardsPerView: use CSS grid centred; > cardsPerView: scroll
            members.length <= cardsPerView
              ? { gridTemplateColumns: `repeat(${members.length}, minmax(0, 280px))`, justifyContent: "center" }
              : undefined
          }
        >
          {members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              ff={ff}
              appointedPrefix={config.bod_appointed_prefix}
            />
          ))}
        </div>

        {/* Carousel controls */}
        {showControls && (
          <div className={s.carouselControls}>
            <button
              className={s.carouselBtn}
              onClick={() => doScrollTo(Math.max(0, active - 1))}
              disabled={active === 0}
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>

            <div className={s.carouselDots}>
              {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                <button
                  key={i}
                  className={clsx(s.dot, i === active && s.dotActive)}
                  onClick={() => doScrollTo(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              className={s.carouselBtn}
              onClick={() => doScrollTo(Math.min(maxIdx, active + 1))}
              disabled={active >= maxIdx}
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Chairman hero card ────────────────────────────────────────
function ChairmanHeroCard({ member, label }: { member: BodMember; label: string }) {
  return (
    <div className={s.chairmanWrap}>
      <div className={s.chairmanCard}>
        <div className={s.chairmanPhotoRing}>
          {member.photo_url ? (
            <Image
              src={member.photo_url}
              alt={member.full_name}
              width={140}
              height={140}
              className={s.chairmanPhoto}
              unoptimized
            />
          ) : (
            <div className={s.chairmanPhotoFallback}>👤</div>
          )}
        </div>
        <div className={s.chairmanContent}>
          <div className={s.chairmanBadge}>
            <span className={s.chairmanBadgeDot} />
            {label}
          </div>
          <h2 className={s.chairmanName}>{member.full_name}</h2>
          <p className={s.chairmanRole}>{member.designation || member.role_label}</p>
          {member.district && (
            <p className={s.chairmanDistrict}>
              <MapPin size={13} style={{ display: "inline", marginRight: 5 }} />
              {member.district}
            </p>
          )}
          {member.bio && <p className={s.chairmanBio}>{member.bio}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────
export function BodClient({ data }: { data: BodData }) {
  const { chairman, members, config: cfg, featureFlags: ff } = data;

  // Groups sorted by role_sort_order — CEO first, then Expert Directors, then Directors, etc.
  const groups = groupByRole(members);

  return (
    <div className={s.sectionWrap}>

      {/* Chairman — full-width dark hero card, always first */}
      {f(ff, "bod.chairman_hero") && chairman && (
        <ChairmanHeroCard member={chairman} label={cfg.bod_chairman_label} />
      )}

      {/* Role sections — each has its own carousel, in role_sort_order */}
      {groups.map((group, i) => (
        <RoleSection
          key={group.role_key}
          group={group}
          ff={ff}
          config={cfg}
          index={i}
        />
      ))}

    </div>
  );
}