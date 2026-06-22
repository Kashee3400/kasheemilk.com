import Image from "next/image";
import Link from "next/link";
import { FileText, MessageSquare, Download, BarChart2, ArrowUpRight, Users, ShieldCheck } from "lucide-react";

const MEMBER_LINKS = [
  {
    href: "/annual-reports",
    icon: FileText,
    title: "Annual Reports",
    desc: "Yearly financial & impact reports",
    badge: "2024 Available",
  },
  {
    href: "/grievance-redressal",
    icon: MessageSquare,
    title: "Grievance Redressal",
    desc: "Submit and track your concerns",
    badge: null,
  },
  {
    href: "/downloads",
    icon: Download,
    title: "Downloads",
    desc: "Forms, policies and resources",
    badge: "12 Files",
  },
  {
    href: "/annual-returns",
    icon: BarChart2,
    title: "Annual Returns",
    desc: "Statutory filings and returns",
    badge: null,
  },
];

const TRUST_ITEMS = [
  { icon: <Users size={14} />, text: "10,000+ Active Members" },
  { icon: <ShieldCheck size={14} />, text: "Transparent Governance" },
];

export function MemberSection() {
  return (
    <section className="relative overflow-hidden bg-[#faf7ee] py-24">
      {/* Subtle background grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Ambient top-left glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#18402c]/[0.05]" />
      {/* Bottom-right warm glow */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-500/[0.07]" />

      <div className="relative z-10 mx-auto max-w-[1300px] px-12 max-md:px-5">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── LEFT: Content ── */}
          <div>
            {/* Eyebrow */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-8 bg-gradient-to-r from-amber-500 to-amber-400" />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-amber-600">
                For Members
              </span>
            </div>

            {/* Heading */}
            <h2 className="mb-4 font-display text-[clamp(30px,3.5vw,46px)] font-bold leading-[1.08] tracking-tight text-[#18402c]">
              Member's <em className="not-italic text-amber-600">Corner</em>
            </h2>

            {/* Subtitle */}
            <p className="mb-10 max-w-[440px] text-[15px] leading-[1.7] text-[#5c7060]">
              Exclusive resources and services for our cooperative members. Stay informed, address concerns, and access all member-related documents in one place.
            </p>

            {/* Links grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MEMBER_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      group relative flex items-start gap-4
                      overflow-hidden rounded-2xl
                      border border-[#18402c]/8 bg-white
                      p-5 shadow-sm
                      transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                      hover:-translate-y-1
                      hover:border-[#18402c]/0
                      hover:shadow-[0_16px_48px_rgba(24,64,44,0.14)]
                    "
                  >
                    {/* Hover bg fill */}
                    <div className="
                      absolute inset-0 -z-0
                      bg-gradient-to-br from-[#18402c] to-[#2a6d47]
                      opacity-0 transition-opacity duration-300
                      group-hover:opacity-100
                    " />

                    {/* Icon */}
                    <div className="
                      relative z-10 flex h-11 w-11 flex-shrink-0 items-center justify-center
                      rounded-[12px] bg-amber-500/10 text-amber-600
                      transition-all duration-300
                      group-hover:bg-white/15 group-hover:text-amber-300
                    ">
                      <Icon size={19} />
                    </div>

                    {/* Text */}
                    <div className="relative z-10 min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[14px] font-semibold leading-tight text-[#1a2e1e] transition-colors duration-300 group-hover:text-white">
                          {item.title}
                        </h3>
                        <ArrowUpRight
                          size={14}
                          className="
                            mt-0.5 flex-shrink-0 text-[#18402c]/25
                            transition-all duration-300
                            group-hover:-translate-y-0.5 group-hover:translate-x-0.5
                            group-hover:text-white/60
                          "
                        />
                      </div>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-[#5c7060] transition-colors duration-300 group-hover:text-white/60">
                        {item.desc}
                      </p>
                      {item.badge && (
                        <span className="
                          mt-2.5 inline-block rounded-full px-2.5 py-0.5
                          text-[10px] font-semibold tracking-[0.06em] uppercase
                          bg-amber-500/10 text-amber-700
                          transition-colors duration-300
                          group-hover:bg-white/15 group-hover:text-amber-200
                        ">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Trust strip */}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              {TRUST_ITEMS.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] bg-[#18402c]/8 text-[#18402c]">
                    {icon}
                  </span>
                  <span className="text-[12.5px] font-medium text-[#5c7060]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Image ── */}
          <div className="relative">
            {/* Decorative blocks */}
            <div className="absolute -right-5 -top-5 -z-10 h-28 w-28 rounded-2xl bg-amber-500/15" />
            <div className="absolute -bottom-5 -left-5 -z-10 h-20 w-20 rounded-full bg-[#18402c]/8" />

            {/* Dashed border frame */}
            <div className="
              absolute -inset-3 -z-10 rounded-[32px]
              border-2 border-dashed border-[#18402c]/10
            " />

            {/* Main image card */}
            <div className="
              overflow-hidden rounded-[28px]
              shadow-[0_24px_80px_rgba(24,64,44,0.16),0_4px_20px_rgba(0,0,0,0.06)]
            ">
              <div className="relative">
                <Image
                  src="https://www.kasheemilk.com/wp-content/uploads/2024/04/Member-corner.jpg"
                  alt="Member Corner — Kashee Milk women farmers"
                  width={600}
                  height={500}
                  className="block w-full object-cover object-top"
                  style={{ maxHeight: 480 }}
                  unoptimized
                />
                {/* Top gradient */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />
                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />

                {/* Floating label top-right */}
                <div className="
                  absolute right-5 top-5 flex items-center gap-2
                  rounded-full border border-white/20 bg-white/15 px-3 py-1.5
                  backdrop-blur-[8px]
                ">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-semibold tracking-wide text-white">
                    Member Portal Live
                  </span>
                </div>
              </div>

              {/* Quote card pinned at bottom */}
              <div className="
                absolute inset-x-4 bottom-4 rounded-[18px]
                border border-white/20 bg-white/90 p-4 backdrop-blur-md
                shadow-[0_8px_32px_rgba(0,0,0,0.14)]
              ">
                <div className="mb-1 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-500/40 to-transparent" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-amber-600">
                    Our Mission
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-amber-500/40 to-transparent" />
                </div>
                <p className="font-display text-[15px] font-semibold italic leading-snug text-[#18402c]">
                  "Empowering women through dairy"
                </p>
                <p className="mt-1 text-[11px] font-medium text-[#5c7060]">
                  Kashee Milk Producer Company Limited
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}