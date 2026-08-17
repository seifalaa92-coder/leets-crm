import Link from "next/link";
import Image from "next/image";
import { COMPANY } from "@/data/company";

export { SiteHeader } from "./SiteHeader";

const FOOTER_LINKS = [
  { href: "/clubs", label: "Our Clubs" },
  { href: "/company", label: "Company Profile" },
  { href: "/classes/book-court", label: "Book a Court" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0F172A] py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Image
              src="/leets-logo.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <p className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-xl font-bold uppercase tracking-widest">
              Leets<span className="text-[#EA553B]">Sports</span>
            </p>
          </div>
          <p className="mt-2 text-sm text-white/70">{COMPANY.tagline}</p>
          <p className="mt-1 text-sm text-white/70">{COMPANY.locations}</p>
        </div>
        <div className="text-sm text-white/70">
          <p className="mb-2 font-semibold uppercase tracking-wide text-white/80">Contact</p>
          <a
            href={`mailto:${COMPANY.email}`}
            className="inline-flex min-h-[44px] items-center transition-colors duration-100 hover:text-white active:text-[#EA553B]"
          >
            {COMPANY.email}
          </a>
        </div>
        <div className="text-sm text-white/70">
          <p className="mb-2 font-semibold uppercase tracking-wide text-white/80">Explore</p>
          <ul>
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-[44px] items-center transition-colors duration-100 hover:text-white active:text-[#EA553B]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-white/50">
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
    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/70">
      Delivered
    </span>
  );
}
