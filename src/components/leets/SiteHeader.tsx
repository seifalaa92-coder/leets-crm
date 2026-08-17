"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/clubs", label: "Clubs" },
  { href: "/company", label: "Company" },
  { href: "/classes/book-court", label: "Book a Court" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  // Scroll edge effect: the divider and the material only appear once content
  // actually passes under the header.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change, and never leave the menu open behind a resize to desktop.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => mq.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onDesktop);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onDesktop);
    };
  }, [menuOpen]);

  // Tap carries no momentum, so the spring is critically damped — no overshoot.
  const spring = reduceMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, bounce: 0, duration: 0.34 };

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200 ${
        scrolled || menuOpen
          ? "border-b border-white/10 bg-[#0F172A]/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-[#0F172A]/95"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl font-bold uppercase tracking-widest text-white transition-transform duration-100 active:scale-[0.97]"
        >
          <Image
            src="/leets-logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
          Leets<span className="text-[#EA553B]">Sports</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`-my-3 py-3 text-sm font-medium transition-colors duration-100 hover:text-white active:text-[#EA553B] ${
                pathname === item.href ? "text-white" : "text-white/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="rounded-md bg-[#EA553B] px-4 py-2 text-sm font-semibold text-white transition-[background-color,transform] duration-100 hover:bg-[#FF6B4F] active:scale-[0.97] active:bg-[#D14028]"
          >
            Log in
          </Link>
        </nav>

        <button
          ref={triggerRef}
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-2 flex h-12 w-12 items-center justify-center rounded-md text-white transition-[background-color,transform] duration-100 active:scale-[0.94] active:bg-white/10 md:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <motion.line
              x1="2" x2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              animate={menuOpen ? { y1: 11, y2: 11, rotate: 45 } : { y1: 6, y2: 6, rotate: 0 }}
              transition={spring}
              style={{ originX: "11px", originY: "11px" }}
            />
            <motion.line
              x1="2" x2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              animate={menuOpen ? { y1: 11, y2: 11, rotate: -45 } : { y1: 16, y2: 16, rotate: 0 }}
              transition={spring}
              style={{ originX: "11px", originY: "11px" }}
            />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            key="mobile-nav"
            // Enters and exits along the same path, anchored to the header it came from.
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <ul className="mx-auto max-w-6xl px-4 py-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`flex min-h-[48px] items-center border-b border-white/5 text-[15px] font-medium transition-colors duration-100 active:text-[#EA553B] ${
                      pathname === item.href ? "text-white" : "text-white/75"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pb-3 pt-4">
                <Link
                  href="/auth/login"
                  className="flex min-h-[48px] items-center justify-center rounded-md bg-[#EA553B] text-sm font-semibold text-white transition-[background-color,transform] duration-100 active:scale-[0.98] active:bg-[#D14028]"
                >
                  Log in
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
