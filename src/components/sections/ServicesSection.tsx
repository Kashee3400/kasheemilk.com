import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Stethoscope } from "lucide-react";
import { SERVICES } from "@/lib/data";

// ─── SVG Wave Separator ───────────────────────────────────────────────────────
function WaveSeparator({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className="relative h-16 w-full overflow-hidden"
      style={{ transform: flip ? "scaleY(-1)" : "none" }}
      aria-hidden="true"
    >
      {/* Base fill matches the section bg */}
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
      >
        {/* Layer 1 — deep forest */}
        <path
          d="M0,32 C240,64 480,0 720,32 C960,64 1200,0 1440,32 L1440,64 L0,64 Z"
          fill="#18402c"
          fillOpacity="0.06"
        />
        {/* Layer 2 — amber shimmer */}
        <path
          d="M0,48 C180,16 360,56 540,32 C720,8 900,56 1080,40 C1260,24 1380,48 1440,40 L1440,64 L0,64 Z"
          fill="#c8960c"
          fillOpacity="0.07"
        />
        {/* Layer 3 — solid bg fill */}
        <path
          d="M0,56 C360,32 1080,64 1440,48 L1440,64 L0,64 Z"
          fill="#f0ebe0"
        />
      </svg>
    </div>
  );
}

// ─── ServicesSection ──────────────────────────────────────────────────────────
export function ServicesSection() {
  return (
    <>
      {/* ── TOP SEPARATOR ── */}
      <WaveSeparator />

      <section className="relative overflow-hidden bg-[#f0ebe0] py-20">

        {/* ── BACKGROUND TEXTURE ── */}
        {/* Linen-style cross-hatch */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 28px,
                rgba(24,64,44,0.5) 28px,
                rgba(24,64,44,0.5) 29px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 28px,
                rgba(24,64,44,0.5) 28px,
                rgba(24,64,44,0.5) 29px
              )
            `,
          }}
        />
        {/* Diagonal stripe overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              rgba(200,150,12,0.8) 0px,
              rgba(200,150,12,0.8) 1px,
              transparent 1px,
              transparent 18px
            )`,
          }}
        />
        {/* Noise grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── AMBIENT BLOBS ── */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-[#18402c]/[0.06]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-amber-500/[0.08]" />

        {/* ── CONTENT ── */}
        <div className="relative z-10 mx-auto max-w-[1300px] px-12 max-md:px-5">

          {/* Header */}
          <div className="mx-auto mb-14 max-w-2xl text-center">
            {/* Eyebrow pill */}
            <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-[#18402c]/12 bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-sm">
              <Stethoscope size={12} className="text-amber-600" />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                What We Offer
              </span>
            </div>

            <h2 className="mb-4 font-display text-[clamp(30px,3.5vw,46px)] font-bold leading-[1.08] tracking-tight text-[#18402c]">
              Veterinary Services{" "}
              <em className="not-italic text-amber-600">&amp; Products</em>
            </h2>

            {/* Ornamental divider */}
            <div className="mb-5 flex items-center justify-center gap-3" aria-hidden="true">
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#18402c]/20" />
              <div className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-amber-500" />
                <div className="h-1.5 w-1.5 rounded-full bg-[#18402c]/40" />
                <div className="h-1 w-1 rounded-full bg-amber-500" />
              </div>
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#18402c]/20" />
            </div>

            <p className="text-[15px] leading-[1.75] text-[#5c7060]">
              Comprehensive support to dairy farmers — from animal health to
              feed nutrition, breeding, and hands-on training.
            </p>
          </div>

          {/* ── GRID ── */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM SEPARATOR ── */}
      <WaveSeparator flip />
    </>
  );
}

// ─── ServiceCard ──────────────────────────────────────────────────────────────
function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[0];
  index: number;
}) {
  return (
    <Link
      href={service.href}
      className="
        group flex flex-col overflow-hidden rounded-[22px]
        bg-white/85 backdrop-blur-sm
        border border-[#18402c]/8
        shadow-[0_4px_24px_rgba(24,64,44,0.08),0_1px_4px_rgba(0,0,0,0.04)]
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:-translate-y-2 hover:shadow-[0_20px_56px_rgba(24,64,44,0.16),0_4px_16px_rgba(0,0,0,0.08)]
        hover:border-[#18402c]/0
        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500
      "
    >
      {/* ── Image zone ── */}
      <div className="relative h-[200px] flex-shrink-0 overflow-hidden bg-[#e8e3d5]">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />

        {/* Dark gradient at bottom of image for label bleed */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Number badge */}
        <div className="
          absolute left-4 top-4 flex h-8 w-8 items-center justify-center
          rounded-full bg-[#18402c] text-white
          font-display text-[11px] font-bold tracking-wide
          shadow-[0_4px_12px_rgba(24,64,44,0.4)]
          transition-transform duration-300 group-hover:scale-110
        ">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Hover: full-bleed overlay */}
        <div className="
          absolute inset-0
          bg-gradient-to-br from-[#18402c]/70 to-[#18402c]/30
          opacity-0 transition-opacity duration-300 group-hover:opacity-100
        " />

        {/* Arrow icon — appears on hover at top-right */}
        <div className="
          absolute right-4 top-4
          flex h-9 w-9 items-center justify-center rounded-[10px]
          border border-white/30 bg-white/15 text-white backdrop-blur-[6px]
          opacity-0 translate-y-1
          transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0
        ">
          <ArrowUpRight size={16} />
        </div>
      </div>

      {/* ── Content zone ── */}
      <div className="flex flex-1 flex-col p-6">
        {/* Title */}
        <h3 className="
          mb-2.5 font-display text-[17px] font-bold leading-snug tracking-tight
          text-[#1a2e1e] transition-colors duration-200 group-hover:text-[#18402c]
        ">
          {service.title}
        </h3>

        {/* Description */}
        <p className="mb-5 flex-1 text-[13.5px] leading-[1.7] text-[#5c7060]">
          {service.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          {/* CTA */}
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-700">
            <span className="transition-colors duration-200 group-hover:text-[#18402c]">
              Learn More
            </span>
            <ArrowUpRight
              size={14}
              className="
                transition-all duration-200
                group-hover:text-[#18402c]
                group-hover:-translate-y-0.5 group-hover:translate-x-0.5
              "
            />
          </div>

          {/* Animated underline indicator */}
          <div className="
            h-[2px] w-6 rounded-full
            bg-gradient-to-r from-amber-500 to-amber-400
            transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            group-hover:w-12
          " />
        </div>
      </div>

      {/* Bottom accent bar — slides in from left on hover */}
      <div className="
        h-[3px] w-full overflow-hidden
        bg-gradient-to-r from-[#18402c] via-amber-500 to-amber-400
        scale-x-0 origin-left
        transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        group-hover:scale-x-100
      " />
    </Link>
  );
}