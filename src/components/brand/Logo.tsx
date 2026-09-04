import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Yağmur Sanat Akademisi — Ana sayfa"
      className={cn(
        "inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet rounded-sm",
        className
      )}
    >
      <Image
        src="/brand/logo.png"
        alt="Özel Yağmur Sanat Akademisi"
        width={180}
        height={120}
        priority
        className={cn(
          "h-9 w-auto lg:h-11 object-contain",
          variant === "white" && "brightness-0 invert"
        )}
      />
    </Link>
  );
}
