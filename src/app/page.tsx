import Link from "next/link";
import Image from "next/image";
import { SiteHeader, SiteFooter, StatusBadge } from "@/components/leets/Shell";
import { COMPANY, STATS, CLUBS } from "@/data/company";

export const metadata = {
  title: "Leets Sports — Sports Management Company | Egypt & KSA",
  description:
    "Leets Sports owns and operates sports facilities across Egypt and Saudi Arabia — padel clubs, academies and boutique fitness studios.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-new.jpg"
            alt="Professional sports facility"
            fill
            priority
            className="scale-105 object-cover transition-transform duration-[20s]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/90 via-[#0F172A]/60 to-[#0F172A]/95" />
        </div>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-12rem] top-1/4 h-[600px] w-[600px] rounded-full bg-[#EA553B]/20 blur-[120px]" />
          <div className="absolute bottom-1/4 right-[-12rem] h-[600px] w-[600px] rounded-full bg-[#EA553B]/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#EA553B]/30 bg-[#EA553B]/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#EA553B]" />
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#EA553B]">
              {COMPANY.tagline}
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-bold uppercase leading-[0.9] tracking-tight md:text-7xl">
            {COMPANY.heroLine1}
            <br />
            <span className="mt-2 block text-[#EA553B]">{COMPANY.heroLine2}</span>
            <span className="mt-2 block text-4xl text-white/90 md:text-6xl">
              Experience
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">{COMPANY.heroSub}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/clubs"
              className="rounded-lg bg-[#EA553B] px-8 py-3.5 font-[family-name:var(--font-display,'Barlow_Condensed')] text-sm font-bold uppercase tracking-wide text-white shadow-[0_4px_24px_rgba(234,85,59,0.35)] transition hover:bg-[#FF6B4F] hover:shadow-[0_8px_40px_rgba(234,85,59,0.45)]"
            >
              Explore our facilities
            </Link>
            <Link
              href="/company"
              className="rounded-lg border-2 border-white/50 px-8 py-3.5 font-[family-name:var(--font-display,'Barlow_Condensed')] text-sm font-bold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
            >
              Company profile
            </Link>
          </div>

          <div className="mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-[#EA553B]/20 pt-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl font-bold text-[#EA553B]">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#EA553B]/20 bg-[#0A0F1E]">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl font-bold uppercase tracking-tight">
              Our Facilities
            </h2>
            <Link href="/clubs" className="text-sm font-semibold text-[#EA553B] hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {CLUBS.map((club) => (
              <Link
                key={club.slug}
                href={`/clubs/${club.slug}`}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#EA553B]/60 hover:bg-white/[0.06]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <StatusBadge status={club.status} />
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    {club.country}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl font-bold uppercase group-hover:text-[#EA553B]">
                  {club.name}
                </h3>
                <p className="mt-1 text-sm text-white/50">{club.city}</p>
                <p className="mt-3 text-sm text-white/70">{club.short}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#EA553B]">
                  {club.role}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>



      <SiteFooter />
    </div>
  );
}
