import Link from "next/link";
import { SiteHeader, SiteFooter, StatusBadge } from "@/components/leets/Shell";
import { COMPANY_PROFILE_INTRO, ABOUT_STATS, VENUES, CLUBS } from "@/data/company";

export const metadata = {
  // 2019 per ABOUT_STATS — the 2017 here was left behind by the date change.
  title: "About — Sports Management Since 2019",
  description:
    "Leets Sports builds, operates and runs sports facilities. Home of the first certified padel academy in the region. 600+ players coached, 4 venues built in Egypt.",
};

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl px-4 py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#EA553B]">
          Who we are
        </p>
        <h1 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-bold uppercase tracking-tight">
          About Leets Sports
        </h1>

        <div className="mt-6 max-w-3xl space-y-4 text-lg text-white/75">
          {COMPANY_PROFILE_INTRO.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-white/10 py-8 md:grid-cols-4">
          {ABOUT_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl font-bold text-[#EA553B]">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="mb-6 font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl font-bold uppercase tracking-tight">
            Venues Built by Leets
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {VENUES.map((v) => (
              <div
                key={v.name}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-xl font-bold uppercase">
                  {v.name}
                </h3>
                <p className="mt-1 text-sm text-white/60">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-6 font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl font-bold uppercase tracking-tight">
            Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {CLUBS.map((club) => (
              <Link
                key={club.slug}
                href={`/clubs/${club.slug}`}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#EA553B]/60 hover:bg-white/[0.06]"
              >
                <StatusBadge status={club.status} />
                <h3 className="mt-4 font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl font-bold uppercase group-hover:text-[#EA553B]">
                  {club.name}
                </h3>
                <p className="mt-1 text-sm text-white/50">
                  {club.city} · {club.country}
                </p>
                <p className="mt-3 text-sm text-white/70">{club.short}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#EA553B]">
                  {club.role}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
