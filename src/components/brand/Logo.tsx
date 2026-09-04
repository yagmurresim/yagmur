import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  showTagline?: boolean;
}

export function Logo({ className, variant = "default", showTagline = false }: LogoProps) {
  const isWhite = variant === "white";

  return (
    <Link
      href="/"
      aria-label="Yağmur Sanat Akademisi — Ana sayfa"
      className={cn("inline-flex flex-col items-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-sm", className)}
    >
      <div className="flex items-center gap-2.5">
        {/* Brand mark SVG */}
        <BrandMark variant={variant} />
        <div className="flex flex-col">
          <span
            className={cn(
              "font-display text-base font-medium leading-tight tracking-[-0.02em]",
              isWhite ? "text-white" : "text-ink"
            )}
          >
            Yağmur Sanat
          </span>
          <span
            className={cn(
              "font-display text-base font-medium leading-tight tracking-[-0.02em]",
              isWhite ? "text-white/70" : "text-plum"
            )}
          >
            Akademisi
          </span>
        </div>
      </div>
      {showTagline && (
        <span
          className={cn(
            "mt-0.5 ml-11 text-[11px] tracking-wide font-body",
            isWhite ? "text-white/50" : "text-ink-muted"
          )}
        >
          Sanatla kendini keşfet.
        </span>
      )}
    </Link>
  );
}

function BrandMark({ variant }: { variant: "default" | "white" }) {
  const strokeColor = variant === "white" ? "#ffffff" : "#7841A0";
  const accentColor = variant === "white" ? "rgba(255,255,255,0.6)" : "#D63177";

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Palette circle */}
      <circle cx="18" cy="18" r="13" stroke={strokeColor} strokeWidth="1.5" />
      {/* Brush stroke — musical line */}
      <path
        d="M 8 20 C 10 16, 14 14, 18 16 C 22 18, 26 14, 28 18"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Music note */}
      <circle cx="14" cy="22" r="2" fill={strokeColor} />
      <line x1="16" y1="22" x2="16" y2="16" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="16" x2="20" y2="15" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="21" r="2" fill={strokeColor} />
      <line x1="22" y1="21" x2="22" y2="15" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}