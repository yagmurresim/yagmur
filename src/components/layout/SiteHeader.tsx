"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { introWhatsAppUrl } from "@/lib/contact";
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

export function SiteHeader({ settings }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Body scroll lock when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Escape key closes menu and returns focus to trigger button
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

  // Focus trap inside mobile menu
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const focusable = menuRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    // Move initial focus into menu
    first?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-paper/95 backdrop-blur-md border-b border-line shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1320px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-none"
            aria-label={`${settings.brand_name} - Ana Sayfa`}
          >
            <span className="font-display text-lg text-ink tracking-tight">
              Yağmur Sanat
            </span>
            <span className="text-[11px] font-medium text-ink-muted tracking-widest uppercase">
              Akademisi
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Ana navigasyon">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-plum"
                    : "text-ink-muted hover:text-ink"
                )}
                aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button asChild variant="primary" size="sm">
              <a href={introWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                Ücretsiz Tanışma Dersi Oluşturun
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="lg:hidden text-ink p-2 -mr-2"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigasyon menüsü"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 bg-paper z-40 flex flex-col px-6 pt-8 pb-16 overflow-y-auto lg:hidden"
          >
            <nav aria-label="Mobil navigasyon" className="flex flex-col gap-1 mb-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xl font-display py-3 border-b border-line transition-colors",
                    pathname.startsWith(link.href)
                      ? "text-plum"
                      : "text-ink hover:text-plum"
                  )}
                  aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <Button asChild variant="primary" size="lg" className="w-full">
              <a href={introWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                Ücretsiz Tanışma Dersi Oluşturun
              </a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}