import Link from "next/link";
import { COMPANY } from "@/data/company";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/clubs", label: "Clubs" },
  { href: "/company", label: "Company" },
  { href: "/classes/book-court", label: "Book a Court" },
  { href: "/classes/book-coach", label: "Book a Coach" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl font-bold uppercase tracking-widest text-white"
        >
          <img src="/leets-logo.png" alt="Leets Logo" className="h-8 w-8 object-contain" />
          Leets<span className="text-[#EA553B]">Sports</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/auth/login"
            className="rounded-md bg-[#EA553B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#FF6B4F]"
          >
            Log in
          </Link>
        </nav>
        <Link
          href="/clubs"
          className="rounded-md bg-[#EA553B] px-3 py-2 text-sm font-semibold text-white md:hidden"
        >
          Clubs
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0F172A] py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <img src="/leets-logo.png" alt="Leets Logo" className="h-8 w-8 object-contain" />
            <p className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-xl font-bold uppercase tracking-widest">
              Leets<span className="text-[#EA553B]">Sports</span>
            </p>
          </div>
          <p className="mt-2 text-sm text-white/60">{COMPANY.tagline}</p>
          <p className="mt-1 text-sm text-white/60">{COMPANY.locations}</p>
        </div>
        <div className="text-sm text-white/60">
          <p className="mb-2 font-semibold uppercase tracking-wide text-white/80">Contact</p>
          <p>{COMPANY.phone}</p>
          <p>{COMPANY.email}</p>
        </div>
        <div className="text-sm text-white/60">
          <p className="mb-2 font-semibold uppercase tracking-wide text-white/80">Explore</p>
          <p><Link href="/clubs" className="hover:text-white">Our Clubs</Link></p>
          <p><Link href="/company" className="hover:text-white">Company Profile</Link></p>
          <p><Link href="/classes/book-court" className="hover:text-white">Book a Court</Link></p>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Leets Sports. All rights reserved.
      </p>
    </footer>
  );
}

export function StatusBadge({ status }: { status: "active" | "delivered" }) {
  return status === "active" ? (
    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
      Active
    </span>
  ) : (
    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/60">
      Delivered
    </span>
  );
}
