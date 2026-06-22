"use client";
import Link from "next/link";
import { clsx } from "clsx";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
  type?: "button" | "submit" | "reset";
}

const variants = {
  primary: "bg-kashee-amber hover:bg-kashee-amber-light text-white shadow-lg shadow-kashee-amber/25 hover:shadow-kashee-amber/40",
  secondary: "bg-kashee-forest hover:bg-kashee-forest-light text-white shadow-lg shadow-kashee-forest/25",
  outline: "border-2 border-kashee-amber text-kashee-amber hover:bg-kashee-amber hover:text-white",
  ghost: "text-kashee-amber hover:bg-kashee-amber/10 underline-offset-4 hover:underline",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  external,
  type = "button",
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 font-body cursor-pointer",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
