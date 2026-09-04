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
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src="/brand/logo.png"
        alt="Özel Yağmur Sanat Akademisi"
        width={480}
        height={322}
        priority
        className={cn(
          "h-10 w-auto lg:h-12 object-contain",
          variant === "white" && "brightness-0 invert opacity-90"
        )}
      />
    </Link>
  );
}
