"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import { LeetsWordmark } from "@/components/ui/LeetsWordmark";

const NAV_LINKS = [
  { href: "/clubs", label: "FACILITIES" },
  { href: "/kids", label: "ACADEMY" },
  { href: "/company", label: "COMMUNITY" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    setScrolled(scrollY.get() > 6);
    return scrollY.on("change", (latest) => {
      setScrolled(latest > 6);
    });
  }, [scrollY]);

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

  const spring = reduceMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, bounce: 0, duration: 0.3 };

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200 border-b border-[#E7E8EC] ${
        scrolled
          ? "bg-[#FAFAFC]/90 backdrop-blur-md"
          : "bg-[#FAFAFC]"
      }`}
    >
      <div className="mx-auto flex h-[62px] max-w-7xl items-center justify-between px-[5%] sm:px-[6%]">
        {/* Authentic Leets wordmark on left */}
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-85"
          aria-label="Leets Sports Home"
        >
          <LeetsWordmark variant="dark" width={76} priority />
        </Link>

        {/* Minimal Central Navigation */}
        <nav className="hidden items-center gap-[34px] md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-[13px] sm:text-[14px] font-bold tracking-[0.5px] uppercase transition-colors duration-150 ${
                  isActive ? "text-[#111F35]" : "text-[#111F35]/85 hover:text-[#111F35]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Login & Navy Pill Booking Button */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          <Link
            href="/auth/login"
            className="hidden text-[10px] font-normal tracking-[0.1px] uppercase text-[#667080] transition-colors hover:text-[#111F35] sm:inline-block"
          >
            LOG IN
          </Link>

          <Link
            href="/classes/book-court"
            className="rounded-full bg-[#172D4D] px-3.5 sm:px-[17px] py-[8px] sm:py-[9px] text-[9px] font-medium tracking-[0.2px] text-white transition-all duration-200 hover:bg-[#304865] hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          >
            BOOK NOW ↗
          </Link>

          {/* Accessible Mobile Hamburger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#111F35] transition-colors hover:bg-black/5 md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <motion.line
                x1="2"
                x2="18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                animate={menuOpen ? { y1: 10, y2: 10, rotate: 45 } : { y1: 6, y2: 6, rotate: 0 }}
                transition={spring}
                style={{ originX: "10px", originY: "10px" }}
              />
              <motion.line
                x1="2"
                x2="18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                animate={menuOpen ? { y1: 10, y2: 10, rotate: -45 } : { y1: 14, y2: 14, rotate: 0 }}
                transition={spring}
                style={{ originX: "10px", originY: "10px" }}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
            className="overflow-hidden border-t border-[#E7E8EC] bg-[#FAFAFC] md:hidden"
          >
            <ul className="flex flex-col px-[6%] py-4 space-y-1">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-[48px] items-center border-b border-[#E7E8EC]/60 text-[14px] font-bold tracking-wide text-[#111F35] active:text-[#172D4D]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/classes/book-court"
                  className="flex min-h-[44px] items-center border-b border-[#E7E8EC]/60 text-[11px] font-medium tracking-wide text-[#172D4D]"
                >
                  BOOK A COURT ↗
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="flex min-h-[44px] items-center text-[11px] font-normal tracking-wide text-[#667080]"
                >
                  LOG IN
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
