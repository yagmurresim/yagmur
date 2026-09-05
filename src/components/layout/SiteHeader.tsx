"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import type { SiteSettings } from "@/types";

const NAV_LINKS = [
  { href: "/akademi", label: "Akademi" },
  { href: "/egitimler", label: "Eğitimler" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

interface SiteHeaderProps {
  settings: SiteSettings;
}

export function SiteHeader({ settings: _settings }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [menuOpen]);

  return (
    <>
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 border-b border-line/80 transition-colors duration-300",
        scrolled || menuOpen ? "bg-paper/92 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="flex h-[5.5rem] items-center justify-between lg:h-[6.5rem]">
          <Logo />

          <nav className="hidden items-center gap-2 lg:flex" aria-label="Ana navigasyon">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-[16px] font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "bg-ink/5 text-ink"
                    : "text-ink-muted hover:bg-ink/5 hover:text-ink"
                )}
                aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button asChild variant="primary" size="lg">
              <Link href="/ucretsiz-tanisma-dersi">Tanışma dersi</Link>
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="relative z-[60] p-2 -mr-2 text-ink lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigasyon menüsü"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[5.5rem] z-40 flex flex-col overflow-y-auto bg-paper px-6 pt-10 pb-16 lg:hidden"
          >
            <nav aria-label="Mobil navigasyon" className="mb-10 flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-display border-b border-line py-4 text-3xl",
                    pathname.startsWith(link.href) ? "text-plum" : "text-ink"
                  )}
                  aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button asChild variant="primary" size="lg" className="w-full">
              <Link href="/ucretsiz-tanisma-dersi">Tanışma dersi</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
