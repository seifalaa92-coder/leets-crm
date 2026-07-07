import Link from "next/link";
import { SiteHeader, SiteFooter, StatusBadge } from "@/components/leets/Shell";
import { COMPANY, STATS, CLUBS, ACADEMY } from "@/data/company";

export const metadata = {
  title: "Leets Sports — Sports Management Company | Padel Clubs in Egypt & KSA",
  description:
    "Leets Sports builds, owns and operates padel clubs across Egypt and Saudi Arabia — club operations, academies, coaching programs and tournaments.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B1420] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#2E7CF6 1px, transparent 1px), linear-gradient(90deg, #2E7CF6 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#2E7CF6]">
            {COMPANY.tagline}
          </p>
          <h1 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl">
            {COMPANY.heroLine1}
            <br />
            <span className="text-[#2E7CF6]">{COMPANY.heroLine2}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">{COMPANY.heroSub}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/clubs"
              className="rounded-md bg-[#2E7CF6] px-6 py-3 font-semibold transition hover:bg-[#4A90F8]"
            >
              Explore our clubs
            </Link>
            <Link
              href="/company"
              className="rounded-md border border-white/20 px-6 py-3 font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
            >
              Company profile
            </Link>
          </div>

          <div className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl font-bold text-[#2E7CF6]">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0E1926]">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl font-bold uppercase tracking-tight">
              Our Clubs
            </h2>
            <Link href="/clubs" className="text-sm font-semibold text-[#2E7CF6] hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {CLUBS.map((club) => (
              <Link
                key={club.slug}
                href={`/clubs/${club.slug}`}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#2E7CF6]/60 hover:bg-white/[0.06]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <StatusBadge status={club.status} />
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    {club.country}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl font-bold uppercase group-hover:text-[#2E7CF6]">
                  {club.name}
                </h3>
                <p className="mt-1 text-sm text-white/50">{club.city}</p>
                <p className="mt-3 text-sm text-white/70">{club.short}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#2E7CF6]">
                  {club.role}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-20 md:flex md:items-center md:justify-between md:gap-12">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#2E7CF6]">
              Jeddah · Saudi Arabia
            </p>
            <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl font-bold uppercase tracking-tight">
              {ACADEMY.name}
            </h2>
            <p className="mt-2 text-sm text-white/50">{ACADEMY.city}</p>
            <p className="mt-4 text-white/70">{ACADEMY.blurb}</p>
          </div>
          <div className="mt-8 flex shrink-0 flex-col gap-4 md:mt-0">
            <Link
              href={ACADEMY.bookCourtHref}
              className="rounded-md bg-[#2E7CF6] px-8 py-3 text-center font-semibold transition hover:bg-[#4A90F8]"
            >
              Book a Court
            </Link>
            <Link
              href={ACADEMY.bookCoachHref}
              className="rounded-md border border-white/20 px-8 py-3 text-center font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
            >
              Book a Coach
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
