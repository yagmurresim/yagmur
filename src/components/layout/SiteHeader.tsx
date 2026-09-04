"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import {
  NAV_LINKS,
  CTA_LABEL,
  whatsappUrl,
  BRAND,
  TEL_URL,
  ADDRESS_FULL,
} from "@/content/site";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
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
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300",
        scrolled || menuOpen
          ? "bg-paper/95 backdrop-blur-sm border-b border-line"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container-x">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Logo />

          <nav className="hidden lg:flex items-center gap-10" aria-label="Ana navigasyon">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[14px] tracking-[0.02em] transition-colors py-1",
                  "after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-gold after:transition-[width] after:duration-300",
                  isActive(link.href)
                    ? "text-ink after:w-full"
                    : "text-ink-muted hover:text-ink after:w-0 hover:after:w-full"
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button asChild variant="primary" size="md">
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                {CTA_LABEL}
              </a>
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="lg:hidden text-ink p-2 -mr-2 relative z-50"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-20 bg-paper z-40 flex flex-col lg:hidden overflow-y-auto"
          >
            <div className="container-x flex flex-col flex-1 pt-10 pb-12">
              <nav aria-label="Mobil navigasyon" className="flex flex-col">
                {NAV_LINKS.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-baseline justify-between font-display text-[2.5rem] leading-none py-5 border-b border-line transition-colors",
                      isActive(link.href) ? "text-plum" : "text-ink hover:text-plum"
                    )}
                    aria-current={isActive(link.href) ? "page" : undefined}
                  >
                    <span>{link.label}</span>
                    <span className="eyebrow" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mt-10 flex flex-col gap-4">
                <Button asChild variant="primary" size="xl" className="w-full">
                  <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                    {CTA_LABEL}
                  </a>
                </Button>
                <a
                  href={TEL_URL}
                  className="text-center text-[15px] text-ink-muted hover:text-ink transition-colors"
                >
                  {BRAND.phoneDisplay}
                </a>
              </div>

              <div className="mt-auto pt-12 flex flex-col gap-2 text-sm text-ink-muted">
                <p className="eyebrow mb-2">Karşıyaka, İzmir</p>
                <p>{ADDRESS_FULL}</p>
                <a
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors"
                >
                  {BRAND.instagramHandle}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
