"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Phone, Mail, ArrowRight, ChevronRight,
  Milk, Leaf, Heart, Shield, Star, Award, CheckCircle,
  type LucideIcon,
} from "lucide-react";
import { FooterData } from "@/types/db";
import { f } from "@/lib/helper/feature_flag";
import { SOCIAL_ICONS } from "../ui/icons";

const BADGE_ICONS: Record<string, LucideIcon> = {
  Leaf, Heart, Shield, Star, Award, CheckCircle, Milk,
};

// ── Newsletter form (client island) ─────────────────────────────────────────
function NewsletterForm({ placeholder, btnLabel }: { placeholder: string; btnLabel: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit() {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    // Replace with your actual newsletter API call
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <div className="flex items-stretch flex-1 min-w-0 max-w-sm">
      <div className="
        flex items-center flex-1 min-w-0
        bg-white/10 backdrop-blur-sm
        border border-white/15 rounded-l-[10px]
        px-3.5 gap-2.5
        focus-within:border-white/35 transition-colors
      ">
        <Mail size={15} className="text-white/40 flex-shrink-0" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={status === "success" ? "You're subscribed! 🎉" : placeholder}
          disabled={status === "loading" || status === "success"}
          className="
            flex-1 bg-transparent text-white text-sm
            placeholder:text-white/40 outline-none h-11
          "
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={status === "loading" || status === "success"}
        className="
          h-11 px-5 rounded-r-[10px] flex-shrink-0
          flex items-center gap-2
          bg-gradient-to-br from-amber-500 to-amber-400
          text-[#122d1e] text-[13px] font-semibold tracking-wide
          hover:opacity-90 disabled:opacity-60
          transition-opacity
        "
      >
        {status === "loading" ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : status === "success" ? (
          <CheckCircle size={14} />
        ) : (
          <>{btnLabel} <ArrowRight size={13} /></>
        )}
      </button>
    </div>
  );
}

// ── Main Footer ──────────────────────────────────────────────────────────────
export default function KasheeFooter({ data }: { data: FooterData }) {
  const { config: cfg, stats, services, trustBadges,
    legalLinks, socialLinks, navItems, cmsPages, featureFlags: ff } = data;
  const darkMode = f(ff, "footer.dark_mode_support");
  return (
    <footer className={`
      bg-[#faf7ee] text-[#1a2e1e]
      ${darkMode ? "dark:bg-[#0e2418] dark:text-white/90" : ""}
      transition-colors duration-300
    `}>

      {/* ── CTA / NEWSLETTER BAND ──────────────────────────────────── */}
      {f(ff, "footer.cta_band") && (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0a2318] via-[#1f5437] to-[#2a6d47]">
          {/* Decorative blobs */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/8 pointer-events-none" />
          <div className="absolute left-[35%] -bottom-10 w-40 h-40 rounded-full bg-white/[0.03] pointer-events-none" />
          <div className="absolute left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-400/20 to-transparent" />

          <div className="relative z-10 max-w-[1300px] mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-amber-300 mb-2">
                  {cfg.newsletter_subtext || "Newsletter"}
                </p>
                <h2 className="font-display text-xl md:text-2xl font-bold text-white leading-tight max-w-xs">
                  {cfg.newsletter_heading || "Subscribe for Updates"}
                </h2>
              </div>

              {f(ff, "footer.newsletter_form") && (
                <NewsletterForm
                  placeholder={cfg.newsletter_placeholder || ""}
                  btnLabel={cfg.newsletter_btn_label || ""}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STATS STRIP ───────────────────────────────────────────── */}
      {/* ── STATS STRIP ───────────────────────────────────────────── */}
      {f(ff, "footer.stats_strip") && stats.length > 0 && (
        <div className={`
          bg-[#f0ebe0] border-b border-[#0a2318]/10
          ${darkMode ? "dark:bg-[#0a1f12] dark:border-white/8" : ""}
          transition-colors duration-300
        `}>
          <div className="max-w-[1300px] mx-auto px-6">
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)` }}
            >
              {/* Clone the array and sort it by sort_order before mapping */}
              {[...stats]
                .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                .map((stat, i, arr) => (
                  <div
                    key={stat.stat_key}
                    className={`
                      py-5 text-center
                      ${i < arr.length - 1 ? `border-r border-[#0a2318]/10 ${darkMode ? "dark:border-white/8" : ""}` : ""}
                    `}
                  >
                    <div className={`
                      font-display text-[22px] font-bold leading-none text-[#0a2318]
                      ${darkMode ? "dark:text-amber-300" : ""}
                    `}>
                      {stat.display_value}
                    </div>
                    <div className={`
                      mt-1 text-[10.5px] font-semibold tracking-[0.1em] uppercase text-[#5c7060]
                      ${darkMode ? "dark:text-white/45" : ""}
                    `}>
                      {stat.label}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* ── MAIN GRID ─────────────────────────────────────────────── */}
      <div className="max-w-[1300px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-10 lg:gap-12">

          {/* ── BRAND COLUMN ────────────────────────────────────── */}
          {f(ff, "footer.brand_column") && (
            <div>
              <Link href="/" className="inline-block mb-5">
                <Image
                  src={cfg.footer_logo_url || ""}
                  alt={cfg.footer_logo_alt || ""}
                  width={120}
                  height={88}
                  className={`h-14 w-auto transition-[filter] duration-300 ${darkMode ? "dark:brightness-[1.8]" : ""}`}
                  unoptimized
                />
              </Link>

              <p className={`
                text-sm leading-relaxed text-[#5c7060] mb-5 max-w-[260px]
                ${darkMode ? "dark:text-white/50" : ""}
              `}>
                {cfg.footer_tagline}
              </p>

              {/* Social icons */}
              {f(ff, "footer.social_icons") && socialLinks.length > 0 && (
                <div className="flex gap-2 mb-6">
                  {socialLinks.map(({ id, url, platform, icon_name }) => {
                    const Icon = SOCIAL_ICONS[icon_name || "instagram"] ?? null;
                    return (
                      <a
                        key={id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={platform}
                        className={`
                          w-[38px] h-[38px] rounded-[10px]
                          flex items-center justify-center
                          bg-[#0a2318]/7 text-[#0a2318]/70
                          hover:bg-amber-500 hover:text-white
                          ${darkMode ? "dark:bg-white/7 dark:text-white/60 dark:hover:bg-amber-500 dark:hover:text-white" : ""}
                          transition-all duration-200 hover:-translate-y-0.5
                        `}
                      >
                        {Icon ? <Icon size={15} /> : <span className="text-[10px]">{platform[0]}</span>}
                      </a>
                    );
                  })}
                </div>
              )}

              {/* Trust badges */}
              {f(ff, "footer.trust_badges") && trustBadges.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  {trustBadges.map(({ id, icon_name, text }) => {
                    const Icon = BADGE_ICONS[icon_name] ?? Leaf;
                    return (
                      <div key={id} className="flex items-center gap-2.5">
                        <span className="
                          w-[26px] h-[26px] rounded-[7px] flex-shrink-0
                          flex items-center justify-center
                          bg-amber-500/10 text-amber-600
                        ">
                          <Icon size={12} />
                        </span>
                        <span className={`
                          text-xs font-medium text-[#5c7060]
                          ${darkMode ? "dark:text-white/45" : ""}
                        `}>
                          {text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── QUICK LINKS ─────────────────────────────────────── */}
          {f(ff, "footer.quick_links") && (navItems.length > 0 || cmsPages.length > 0) && (
            <div>
              <SectionHeading darkMode={darkMode}>Quick Links</SectionHeading>
              <ul className="space-y-0.5">
                {navItems.slice(0, 6).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      target={item.open_in_new ? "_blank" : undefined}
                      rel={item.open_in_new ? "noopener noreferrer" : undefined}
                      className={`
                        group flex items-center gap-1.5 py-[6px]
                        text-[13.5px] text-[#5c7060]
                        hover:text-[#0a2318]
                        ${darkMode ? "dark:text-white/50 dark:hover:text-amber-300" : ""}
                        transition-colors duration-200
                      `}
                    >
                      <ChevronRight
                        size={13}
                        className="
                          text-amber-500 flex-shrink-0
                          opacity-0 -translate-x-1
                          group-hover:opacity-100 group-hover:translate-x-0
                          transition-all duration-200
                        "
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
                {cmsPages && cmsPages.map((page) => (
                  <li key={`cms-${page.id}`}>
                    <Link
                      href={page.href}
                      className={`
                        group flex items-center gap-1.5 py-[6px]
                        text-[13.5px] text-[#5c7060]
                        hover:text-[#0a2318]
                        ${darkMode ? "dark:text-white/50 dark:hover:text-amber-300" : ""}
                        transition-colors duration-200
                      `}
                    >
                      <ChevronRight
                        size={13}
                        className="
                          text-amber-500 flex-shrink-0
                          opacity-0 -translate-x-1
                          group-hover:opacity-100 group-hover:translate-x-0
                          transition-all duration-200
                        "
                      />
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── SERVICES ────────────────────────────────────────── */}
          {f(ff, "footer.services_column") && services.length > 0 && (
            <div>
              <SectionHeading darkMode={darkMode}>Our Services</SectionHeading>
              <ul className="space-y-2.5">
                {services.map((svc) => (
                  <li key={svc.id} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-[7px]" />
                    <Link
                      href={svc.href}
                      className={`
                        text-[13.5px] text-[#5c7060] leading-relaxed
                        hover:text-[#0a2318]
                        ${darkMode ? "dark:text-white/50 dark:hover:text-amber-300" : ""}
                        transition-colors duration-200
                      `}
                    >
                      {svc.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── CONTACT ─────────────────────────────────────────── */}
          {f(ff, "footer.contact_column") && (
            <div>
              <SectionHeading darkMode={darkMode}>Contact Us</SectionHeading>

              {/* Address */}
              {cfg.contact_address && (
                <ContactRow darkMode={darkMode} icon={<MapPin size={14} className="text-amber-600 dark:text-amber-400" />}>
                  <span className={`text-[13px] leading-relaxed text-[#5c7060] ${darkMode ? "dark:text-white/50" : ""}`}>
                    {cfg.contact_address}
                  </span>
                </ContactRow>
              )}

              {/* Phone */}
              {cfg.contact_phone && (
                <ContactRow darkMode={darkMode} icon={<Phone size={14} className="text-amber-600 dark:text-amber-400" />}>
                  <a
                    href={`tel:${cfg.contact_phone.replace(/\s/g, "")}`}
                    className={`
                      text-[13px] text-[#5c7060]
                      hover:text-[#0a2318]
                      ${darkMode ? "dark:text-white/50 dark:hover:text-amber-300" : ""}
                      transition-colors
                    `}
                  >
                    {cfg.contact_phone}
                  </a>
                </ContactRow>
              )}

              {/* Email */}
              {cfg.contact_email && (
                <ContactRow darkMode={darkMode} icon={<Mail size={14} className="text-amber-600 dark:text-amber-400" />}>
                  <a
                    href={`mailto:${cfg.contact_email}`}
                    className={`
                      text-[13px] break-all text-[#5c7060]
                      hover:text-[#0a2318]
                      ${darkMode ? "dark:text-white/50 dark:hover:text-amber-300" : ""}
                      transition-colors
                    `}
                  >
                    {cfg.contact_email}
                  </a>
                </ContactRow>
              )}

              {/* Office hours */}
              {f(ff, "footer.office_hours") && (cfg.office_hours_weekday || cfg.office_hours_weekend) && (
                <div className={`
                  mt-1 p-4 rounded-xl
                  bg-[#0a2318]/5 border border-[#0a2318]/10
                  ${darkMode ? "dark:bg-white/[0.04] dark:border-white/8" : ""}
                  transition-colors duration-300
                `}>
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-amber-600 dark:text-amber-400 mb-2">
                    Office Hours
                  </p>
                  <p className={`
                    text-[12.5px] text-[#5c7060] leading-[1.8]
                    ${darkMode ? "dark:text-white/45" : ""}
                  `}>
                    {cfg.office_hours_weekday && <>{cfg.office_hours_weekday}<br /></>}
                    {cfg.office_hours_weekend}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── GRADIENT DIVIDER ─────────────────────────────────────── */}
      <div className="max-w-[1300px] mx-auto px-6">
        <div className={`
          h-px bg-gradient-to-r from-transparent
          via-[#0a2318]/18
          to-transparent
          ${darkMode ? "dark:via-amber-400/35" : ""}
        `} />
      </div>

      {/* ── BOTTOM BAR ───────────────────────────────────────────── */}
      <div className={`
        bg-[#0a2318]/[0.04]
        ${darkMode ? "dark:bg-black/25" : ""}
        transition-colors duration-300
      `}>
        <div className="
          max-w-[1300px] mx-auto px-6 py-4
          flex flex-col md:flex-row
          justify-between items-center gap-3
        ">
          {/* Copyright */}
          <div className="flex items-center gap-2">
            <Milk size={13} className="text-amber-500" />
            <p className={`
              text-xs text-[#8a9e8e] text-center md:text-left
              ${darkMode ? "dark:text-white/28" : ""}
            `}>
              © {new Date().getFullYear()} {cfg.copyright_name}. All rights reserved.
            </p>
          </div>

          {/* Legal links + designed by */}
          <div className="flex items-center flex-wrap justify-center gap-x-1 gap-y-1">
            {f(ff, "footer.legal_links") && legalLinks.map((link, i) => (
              <span key={link.id} className="flex items-center">
                {i > 0 && (
                  <span className="inline-block w-1 h-1 rounded-full bg-amber-500 mx-2" />
                )}
                <Link
                  href={link.href}
                  target={link.open_in_new ? "_blank" : undefined}
                  className={`
                    text-xs text-[#8a9e8e]
                    hover:text-[#0a2318]
                    ${darkMode ? "dark:text-white/28 dark:hover:text-amber-300" : ""}
                    transition-colors duration-200
                  `}
                >
                  {link.label}
                </Link>
              </span>
            ))}

            {f(ff, "footer.designed_by") && cfg.designed_by_label && (
              <>
                <span className="inline-block w-1 h-1 rounded-full bg-amber-500 mx-2" />
                <span className={`text-xs text-[#8a9e8e] ${darkMode ? "dark:text-white/28" : ""}`}>
                  Designed by{" "}
                  <a
                    href={cfg.designed_by_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      hover:text-[#0a2318]
                      ${darkMode ? "dark:hover:text-amber-300" : ""}
                      transition-colors duration-200
                    `}
                  >
                    {cfg.designed_by_label}
                  </a>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Reusable sub-components ──────────────────────────────────────────────────

function SectionHeading({ children, darkMode }: { children: React.ReactNode; darkMode: boolean }) {
  return (
    <h3 className={`
      flex items-center gap-3 mb-5
      font-display text-base font-semibold
      text-[#0a2318]
      ${darkMode ? "dark:text-amber-300" : ""}
      after:block after:flex-1 after:h-px
      after:bg-gradient-to-r after:from-current after:to-transparent after:opacity-15
    `}>
      {children}
    </h3>
  );
}

function ContactRow({ children, icon, darkMode }: {
  children: React.ReactNode;
  icon: React.ReactNode;
  darkMode: boolean;
}) {
  return (
    <div className="flex gap-3 mb-3.5">
      <span className={`
        w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center
        bg-amber-500/10
        ${darkMode ? "dark:bg-amber-400/10" : ""}
      `}>
        {icon}
      </span>
      {children}
    </div>
  );
}
