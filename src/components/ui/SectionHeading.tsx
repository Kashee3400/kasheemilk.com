import { clsx } from "clsx";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "left",
  light = false,
  className,
}: SectionHeadingProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[align];

  return (
    <div className={clsx("flex flex-col gap-3 mb-10", alignClass, className)}>
      {label && (
        <span
          className={clsx(
            "text-sm font-semibold tracking-[0.2em] uppercase font-body",
            light ? "text-kashee-amber-light" : "text-kashee-amber"
          )}
        >
          {label}
        </span>
      )}
      <h2
        className={clsx(
          "font-display text-3xl md:text-4xl lg:text-5xl leading-tight",
          light ? "text-white" : "text-kashee-charcoal"
        )}
      >
        {title}
      </h2>
      <div className={clsx("section-line", align === "center" && "mx-auto", align === "right" && "ml-auto")} />
      {subtitle && (
        <p
          className={clsx(
            "font-body text-base md:text-lg leading-relaxed max-w-2xl",
            light ? "text-white/70" : "text-kashee-charcoal/60",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
