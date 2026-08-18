import { SiteHeader, SiteFooter } from "@/components/leets/Shell";
import { ABOUT_STATS } from "@/data/company";
import KidsAcademyForm from "@/components/forms/KidsAcademyForm";

export const metadata = {
  title: "Kids Academy",
  description:
    "Register your child for the Leets Sports padel academy - coaching for ages 5 to 13 from the first certified padel academy in the region.",
};

export default function KidsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#EA553B]">
          Ages 5 to 13
        </p>
        <h1 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-bold uppercase leading-[0.95] tracking-[-0.01em] [font-optical-sizing:auto] md:text-6xl md:tracking-[-0.025em]">
          Your child&apos;s first
          <br />
          <span className="text-[#EA553B]">padel racket</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/75">
          Coaching built for kids - small groups, proper technique, and a court they look
          forward to. Tell us about your child and our team will arrange a first session.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-6 border-y border-[#EA553B]/20 py-6">
          {ABOUT_STATS.slice(0, 3).map((s) => (
            <div key={s.label}>
              <p className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl font-bold text-[#EA553B]">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <KidsAcademyForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
