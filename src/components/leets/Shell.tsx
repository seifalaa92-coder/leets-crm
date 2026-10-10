import Link from "next/link";
import { LeetsWordmark } from "@/components/ui/LeetsWordmark";
import { COMPANY } from "@/data/company";

export { SiteHeader } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E1E4E9] bg-[#F5F5F7] px-[5%] py-10 text-[#172D4D] sm:px-[6%]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-start">
        {/* Brand wordmark & locations */}
        <div className="space-y-3">
          <Link href="/" className="inline-block transition-opacity hover:opacity-85" aria-label="Leets Sports Home">
            <LeetsWordmark variant="dark" width={90} />
          </Link>
          <p className="text-[11px] leading-relaxed text-[#7C8490]">
            {COMPANY.locations}
            <br />
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-[#172D4D] transition-colors hover:underline"
            >
              {COMPANY.email}
            </a>
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-[10px] font-normal tracking-[0.5px] uppercase text-[#677383] sm:gap-8">
          <Link href="/clubs" className="transition-colors hover:text-[#111F35]">
            OUR FACILITIES
          </Link>
          <Link href="/kids" className="transition-colors hover:text-[#111F35]">
            KIDS ACADEMY
          </Link>
          <Link href="/company" className="transition-colors hover:text-[#111F35]">
            COMPANY
          </Link>
          <Link href="/classes/book-court" className="transition-colors hover:text-[#111F35]">
            BOOK A COURT
          </Link>
          <span className="text-[9px] text-[#8091AA]">
            © {new Date().getFullYear()} LEETS SPORTS
          </span>
        </div>
      </div>
    </footer>
  );
}

export function StatusBadge({ status }: { status: "active" | "delivered" }) {
  return status === "active" ? (
    <span className="rounded-full bg-[#172D4D]/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[#172D4D]">
      Active
    </span>
  ) : (
    <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[#667080]">
      Delivered
    </span>
  );
}
