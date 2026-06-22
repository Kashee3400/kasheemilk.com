"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Leaf, X, Search, ChevronDown, Phone, ArrowUpRight, Menu,
  Facebook, Linkedin, Youtube, Twitter, Instagram,
  type LucideIcon,
} from "lucide-react";

import s from "./Header.module.css";
import type {
  HeaderData,
  HeaderConfig,
  HeaderFeatureFlags,
  HeaderNavRow,
  NavItemChild,
} from "@/types/db";

// ══════════════════════════════════════════════════════════════════════════════
// Derived payload types
// ── was: SocialLinkRow  → DB row type (has sections[], created_at, updated_at…)
// ── now: HeaderData["socialLinks"][number] → API Pick — only the 5 sent fields
// ── was: TickerItem     → never defined anywhere in the codebase
// ── now: HeaderData["announcements"][number] → correct API payload shape
// ══════════════════════════════════════════════════════════════════════════════
type SocialLink   = HeaderData["socialLinks"][number];
type Announcement = HeaderData["announcements"][number];

// ── Icon registry ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Facebook, Linkedin, Youtube, Twitter, Instagram,
};

// ── Feature flag helper ───────────────────────────────────────────────────────
// was: key: string  → too wide, silently accepted any string, no TS protection
// now: key: keyof HeaderFeatureFlags → compile error if wrong key or wrong section
function flag(
  flags: HeaderData["featureFlags"],
  key:   keyof HeaderFeatureFlags,
): boolean {
  return flags?.[key] ?? true;
}

// ── Config accessor ───────────────────────────────────────────────────────────
// cfg is Partial<HeaderConfig> — every key is undefined if that DB row is absent
// was: cfg.logo_url, cfg.phone_href etc. — undefined crash at runtime
// now: c(cfg, "logo_url") → always returns string, falls back to ""
function c(cfg: HeaderData["config"], key: keyof HeaderConfig): string {
  return cfg?.[key] ?? "";
}

// ── cx() — tiny classname joiner ─────────────────────────────────────────────
function cx(...args: (string | false | undefined | null)[]): string {
  return args.filter(Boolean).join(" ");
}


// ══════════════════════════════════════════════════════════════════════════════
// Ticker
// was: items: TickerItem[]     → TickerItem was never defined
//      <Ticker items={tickerItems} /> → tickerItems was never set anywhere
//      (announcements was never destructured from data)
// now: items: Announcement[]   → HeaderData["announcements"][number]
//      <Ticker items={announcements} /> → correctly wired from data
// ══════════════════════════════════════════════════════════════════════════════
function Ticker({ items }: { items: Announcement[] }) {
  const [idx, setIdx] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    const id = setInterval(() => {
      setOut(true);
      setTimeout(() => {
        setIdx((i) => (i + 1) % items.length);
        setOut(false);
      }, 350);
    }, 3800);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;
  const item = items[idx];

  return (
    <div className={s.tickerWrap}>
      <Leaf size={10} className={s.leaf} />
      <span className={cx(s.tick, out ? s.tickOut : s.tickIn)}>
        {item.emoji && <span className={s.tickEmoji}>{item.emoji}</span>}
        {item.link_url
          ? <a href={item.link_url} className={s.tickLink}>{item.text}</a>
          : item.text
        }
      </span>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// Social Icons
// was: links: SocialLinkRow[] → wrong; also ICON_MAP[icon_name] with no null guard
//      icon_name is string | null in the schema — crashes when null
// now: links: SocialLink[] + explicit null guard before ICON_MAP lookup
// ══════════════════════════════════════════════════════════════════════════════
function SocialIcons({ links }: { links: SocialLink[] }) {
  return (
    <div className={s.socials}>
      {links.map(({ id, url, platform, icon_name }) => {
        const Icon = icon_name ? (ICON_MAP[icon_name] ?? null) : null;
        return (
          <a
            key={id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform}
            className={s.socialBtn}
          >
            {Icon
              ? <Icon size={12} />
              : <span style={{ fontSize: 10 }}>{platform[0]}</span>
            }
          </a>
        );
      })}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// Dropdown Menu
// was: item: NavItemRow → flat DB row, has NO children[] property at all
//      item.children.map(…) → runtime crash "cannot read map of undefined"
// now: item: HeaderNavRow → the view type from vw_header_nav which carries
//      children: NavItemChild[] built by JSON agg in the SQL view
// ══════════════════════════════════════════════════════════════════════════════
function DropdownMenu({
  item, showDesc, isOpen, onEnter, onLeave,
}: {
  item:     HeaderNavRow;    // was: NavItemRow
  showDesc: boolean;
  isOpen:   boolean;
  onEnter:  () => void;
  onLeave:  () => void;
}) {
  return (
    <div
      className={cx(s.dropdown, isOpen && s.dropdownOpen)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={s.ddHeader}>
        <span className={s.ddStripe} />
        <span className={s.ddHeaderLabel}>{item.label}</span>
      </div>

      <div className={s.ddBody}>
        {item.children.map((ch: NavItemChild) => (
          <a
            key={ch.id}
            href={ch.href}
            target={ch.open_in_new ? "_blank" : undefined}
            rel={ch.open_in_new ? "noopener noreferrer" : undefined}
            className={s.ddRow}
          >
            <ArrowUpRight size={12} className={s.ddArrow} />
            <div>
              <div className={s.ddRowLabel}>{ch.label}</div>
              {showDesc && ch.description && (
                <div className={s.ddRowDesc}>{ch.description}</div>
              )}
            </div>
          </a>
        ))}
      </div>

      <div className={s.ddFoot} />
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════════════════════
export default function KasheeHeader({ data }: { data: HeaderData }) {
  const {
    navItems,
    announcements,   // was: missing → tickerItems was undefined throughout
    socialLinks,
    config:       cfg,
    featureFlags: ff,
  } = data;

  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeNav,  setActiveNav]  = useState<number | null>(null);
  const [mobileExp,  setMobileExp]  = useState<number | null>(null);
  const [query,      setQuery]      = useState("");
  const ddTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSticky = flag(ff, "header.sticky");
  const showBlur = flag(ff, "header.scroll_blur");

  useEffect(() => {
    if (!isSticky) return;
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [isSticky]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const enter = useCallback((id: number) => {
    if (ddTimer.current) clearTimeout(ddTimer.current);
    setActiveNav(id);
  }, []);

  const leave = useCallback(() => {
    ddTimer.current = setTimeout(() => setActiveNav(null), 150);
  }, []);

  const headerStyle: React.CSSProperties = {
    position: isSticky ? "sticky" : "relative",
    top:      isSticky ? 0 : undefined,
    ...(scrolled && showBlur ? {
      backdropFilter:       "blur(18px) saturate(160%)",
      WebkitBackdropFilter: "blur(18px) saturate(160%)",
    } : {}),
  };

  return (
    <div className={s.root}>

      {/* ── TOP BAR ──────────────────────────────────────────── */}
      {flag(ff, "header.topbar") && (
        <div className={s.topbar}>
          <div className={s.topbarInner}>
            {/* was: <Ticker items={tickerItems} />  tickerItems = undefined crash */}
            {flag(ff, "header.ticker") && <Ticker items={announcements} />}
            {flag(ff, "header.social_icons") && <SocialIcons links={socialLinks} />}
          </div>
        </div>
      )}

      {/* ── MAIN HEADER ──────────────────────────────────────── */}
      <header
        className={cx(
          s.header,
          scrolled && s.headerScrolled,
          scrolled && (showBlur ? s.headerScrolledBlur : s.headerScrolledNoBlur),
        )}
        style={headerStyle}
      >
        {flag(ff, "header.top_accent_bar") && <div className={s.accentBar} />}

        <div className={s.headerInner}>
          <div className={s.headerRow}>

            {/* Logo — all cfg.* replaced with c(cfg, *) for safe Partial access */}
            <a href="/" className={s.logo}>
              <div className={s.logoImgWrap}>
                <img
                  src={c(cfg, "logo_url")}
                  alt={c(cfg, "logo_alt")}
                  className={s.logoImg}
                />
              </div>
              <div>
                <div className={cx(s.logoName, s.serif)}>
                  {c(cfg, "logo_name_part1")}{" "}
                  <span className={s.logoNameAccent}>{c(cfg, "logo_name_part2")}</span>
                </div>
                <div className={s.logoSub}>{c(cfg, "site_tagline")}</div>
              </div>
            </a>

            {/* Desktop Nav — navItems: HeaderNavRow[], children[] now available */}
            <nav className={s.nav}>
              {navItems.map((item: HeaderNavRow) => {
                const hasCh  = item.children.length > 0;
                const isOpen = activeNav === item.id;
                return (
                  <div
                    key={item.id}
                    className={s.navItem}
                    onMouseEnter={() => hasCh && enter(item.id)}
                    onMouseLeave={leave}
                  >
                    <a
                      href={item.href}
                      target={item.open_in_new ? "_blank" : undefined}
                      rel={item.open_in_new ? "noopener noreferrer" : undefined}
                      className={cx(s.navLink, isOpen && s.navLinkActive)}
                    >
                      {item.label}
                      {hasCh && (
                        <ChevronDown
                          size={12}
                          className={cx(s.chevron, isOpen && s.chevronOpen)}
                        />
                      )}
                    </a>

                    {hasCh && (
                      <DropdownMenu
                        item={item}
                        showDesc={flag(ff, "header.dropdown_desc")}
                        isOpen={isOpen}
                        onEnter={() => enter(item.id)}
                        onLeave={leave}
                      />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className={s.actions}>
              {flag(ff, "header.cta_button") && (
                <a href={c(cfg, "phone_href")} className={s.cta}>
                  <Phone size={13} />
                  <span>{c(cfg, "cta_label")}</span>
                </a>
              )}

              {flag(ff, "header.search") && (
                <button
                  onClick={() => setSearchOpen((v) => !v)}
                  aria-label="Search"
                  className={cx(s.iconBtn, searchOpen && s.iconBtnActive)}
                >
                  {searchOpen ? <X size={16} /> : <Search size={16} />}
                </button>
              )}

              {flag(ff, "header.mobile_drawer") && (
                <button
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Menu"
                  className={cx(s.iconBtn, s.mobToggle)}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          {flag(ff, "header.search") && (
            <div className={cx(s.searchBar, searchOpen && s.searchBarOpen)}>
              <div className={s.searchInner}>
                <Search size={14} style={{ color: "var(--kh-mint)", flexShrink: 0 }} />
                <input
                  autoFocus={searchOpen}
                  type="text"
                  placeholder="Search products, services, news…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={s.searchInput}
                />
                {query && (
                  <button onClick={() => setQuery("")} className={s.searchClear}>
                    <X size={13} />
                  </button>
                )}
                <span className={s.searchDivider} />
                <button className={s.searchSubmit}>Search</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── MOBILE BACKDROP ──────────────────────────────────── */}
      <div
        className={cx(s.backdrop, mobileOpen && s.backdropOpen)}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── MOBILE DRAWER ────────────────────────────────────── */}
      {flag(ff, "header.mobile_drawer") && (
        <div className={cx(s.drawer, mobileOpen && s.drawerOpen)}>

          {/* Header */}
          <div className={s.drawerHead}>
            <div className={s.drawerLogo}>
              <div className={s.drawerLogoImg}>
                <img
                  src={c(cfg, "logo_url")}
                  alt={c(cfg, "logo_alt")}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div className={cx(s.drawerName, s.serif)}>
                  {c(cfg, "logo_name_part1")}{" "}
                  <span className={s.drawerNameAccent}>{c(cfg, "logo_name_part2")}</span>
                </div>
                <div className={s.drawerSub}>{c(cfg, "site_tagline")}</div>
              </div>
            </div>
            <button onClick={() => setMobileOpen(false)} className={s.drawerClose}>
              <X size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav className={s.drawerNav}>
            {navItems.map((item: HeaderNavRow) => {
              const hasCh = item.children.length > 0;
              const isExp = mobileExp === item.id;
              return (
                <div key={item.id} className={s.mobItem}>
                  <div className={s.mobRow}>
                    <a
                      href={item.href}
                      onClick={!hasCh ? () => setMobileOpen(false) : undefined}
                      className={s.mobLink}
                    >
                      {item.label}
                    </a>
                    {hasCh && (
                      <button
                        onClick={() => setMobileExp(isExp ? null : item.id)}
                        className={s.mobExpand}
                      >
                        <ChevronDown
                          size={16}
                          className={cx(s.mobChevron, isExp && s.mobChevronOpen)}
                        />
                      </button>
                    )}
                  </div>

                  {hasCh && (
                    <div
                      className={s.mobSub}
                      style={{ maxHeight: isExp ? `${item.children.length * 50}px` : 0 }}
                    >
                      {item.children.map((ch: NavItemChild) => (
                        <a
                          key={ch.id}
                          href={ch.href}
                          onClick={() => setMobileOpen(false)}
                          className={s.mobSubLink}
                        >
                          <span className={s.mobDot} />
                          {ch.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Drawer Footer */}
          <div className={s.drawerFoot}>
            {flag(ff, "header.cta_button") && (
              <a href={c(cfg, "phone_href")} className={s.drawerCta}>
                <Phone size={14} /> {c(cfg, "cta_label")}
              </a>
            )}
            {flag(ff, "header.social_icons") && (
              <div className={s.drawerSocials}>
                {socialLinks.map(({ id, url, platform, icon_name }: SocialLink) => {
                  // was: ICON_MAP[icon_name || ""] — falsy coercion masked the null
                  // now: explicit guard — icon_name is string | null in the schema
                  const Icon = icon_name ? (ICON_MAP[icon_name] ?? null) : null;
                  return (
                    <a
                      key={id}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform}
                      className={s.drawerSocBtn}
                    >
                      {Icon
                        ? <Icon size={14} />
                        : <span style={{ fontSize: 10 }}>{platform[0]}</span>
                      }
                    </a>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}