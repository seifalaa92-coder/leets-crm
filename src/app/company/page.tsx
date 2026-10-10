import Link from "next/link";
import { SiteHeader, SiteFooter, StatusBadge } from "@/components/leets/Shell";
import { COMPANY_PROFILE_INTRO, ABOUT_STATS, VENUES, CLUBS } from "@/data/company";

export const metadata = {
  title: "About | Sports Management Since 2019",
  description:
    "Leets Sports builds, operates and runs sports facilities. Home of the first certified padel academy in the region. 600+ players coached, 4 venues built in Egypt.",
};

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111F35]">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl px-4 py-16">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[2px] text-[#172D4D]">
          WHO WE ARE
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-1.5px] text-[#111F35]">
          About Leets Sports
        </h1>

        <div className="mt-6 max-w-3xl space-y-4 text-base sm:text-lg text-[#687383] leading-relaxed">
          {COMPANY_PROFILE_INTRO.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-[#E7E8EC] py-8 md:grid-cols-4">
          {ABOUT_STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-semibold text-[#172D4D]">
                {s.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-[#758191]">{s.label}</p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="mb-6 text-2xl sm:text-3xl font-medium tracking-tight text-[#111F35]">
            Venues Built by Leets
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {VENUES.map((v) => (
              <div
                key={v.name}
                className="rounded-2xl border border-[#E7E8EC] bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-[#111F35]">
                  {v.name}
                </h3>
                <p className="mt-2 text-sm text-[#687383] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-6 text-2xl sm:text-3xl font-medium tracking-tight text-[#111F35]">
            Projects & Clubs
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {CLUBS.map((club) => (
              <Link
                key={club.slug}
                href={`/clubs/${club.slug}`}
                className="group rounded-2xl border border-[#E7E8EC] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <StatusBadge status={club.status} />
                <h3 className="mt-4 text-xl font-semibold text-[#111F35] transition-colors group-hover:text-[#172D4D]">
                  {club.name}
                </h3>
                <p className="mt-1 text-xs text-[#758191]">
                  {club.city} · {club.country}
                </p>
                <p className="mt-3 text-sm text-[#687383] leading-relaxed">{club.short}</p>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-[#172D4D]">
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
