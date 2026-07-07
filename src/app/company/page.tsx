import Link from "next/link";
import { SiteHeader, SiteFooter, StatusBadge } from "@/components/leets/Shell";
import { FOUNDER, COMPANY_PROFILE_INTRO, CLUBS } from "@/data/company";

export const metadata = {
  title: "Company Profile — Leets Sports",
  description:
    "Leets Sports company profile: leadership, track record and sports facilities projects across Egypt and Saudi Arabia.",
};

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#EA553B]">
          Who we are
        </p>
        <h1 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-bold uppercase tracking-tight">
          Company Profile
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-white/75">{COMPANY_PROFILE_INTRO}</p>

        <section className="mt-16">
          <h2 className="mb-6 font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl font-bold uppercase tracking-tight">
            Leadership
          </h2>
          <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-white/[0.03] p-8 md:flex-row md:items-center">
            {FOUNDER.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={FOUNDER.photo}
                alt={FOUNDER.name}
                className="h-28 w-28 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#EA553B]/15 font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl font-bold text-[#EA553B]">
                SA
              </div>
            )}
            <div>
              <h3 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl font-bold uppercase">
                {FOUNDER.name}
              </h3>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#EA553B]">
                {FOUNDER.title}
              </p>
              <p className="mt-3 max-w-2xl text-white/70">{FOUNDER.bio}</p>
            </div>
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
