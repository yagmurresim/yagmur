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
        width={240}
        height={160}
        priority
        className={cn(
          "h-16 w-auto lg:h-[5.5rem] object-contain",
          variant === "white" && "brightness-0 invert"
        )}
      />
    </Link>
  );
}
