import { SiteHeader, SiteFooter } from "@/components/leets/Shell";
import KidsAcademyForm from "@/components/forms/KidsAcademyForm";

export const metadata = {
  title: "Kids Academy",
  description:
    "Register your child for the Leets Sports padel academy - coaching for ages 5 to 13 from the first certified padel academy in the region.",
};

const FEATURES = [
  {
    icon: "👥",
    title: "Small Groups",
    body: "Max 6 kids per session so every child gets real coaching time.",
  },
  {
    icon: "🏆",
    title: "Certified Coaches",
    body: "WPT & FEP certified instructors trained in children's development.",
  },
  {
    icon: "🎾",
    title: "All Levels Welcome",
    body: "From first-time players to kids ready to compete — we meet them where they are.",
  },
];

export default function KidsPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <SiteHeader />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        {/* Video background */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/Videos/dunes-kids-academy.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/70 via-[#0B1220]/40 to-[#0B1220]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/60 via-transparent to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
          {/* Location badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#EA553B]/40 bg-[#EA553B]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#EA553B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EA553B]" />
            Now open · Egypt &amp; Jeddah
          </div>

          <h1 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-6xl font-bold uppercase leading-[0.9] tracking-[-0.02em] sm:text-7xl md:text-8xl">
            Your child&apos;s first
            <br />
            <span className="text-[#EA553B]">padel racket</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70 sm:text-xl">
            Small groups, certified coaches, and a court they&apos;ll look forward to every week.
            Ages&nbsp;5–13.
          </p>

          {/* Scroll CTA */}
          <a
            href="#register"
            className="mt-10 inline-flex min-h-[52px] items-center gap-2 rounded-lg bg-[#EA553B] px-8 font-[family-name:var(--font-display,'Barlow_Condensed')] text-base font-bold uppercase tracking-wide text-white shadow-[0_4px_32px_rgba(234,85,59,0.45)] transition hover:bg-[#FF6B4F] active:scale-[0.98]"
          >
            Register My Child
          </a>
        </div>

        {/* Scroll arrow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 10l5 5 5-5" />
          </svg>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-white/10">
          {[
            { value: "2019", label: "In the market since" },
            { value: "4", label: "Venues built" },
            { value: "600+", label: "Players coached" },
          ].map((s) => (
            <div key={s.label} className="py-8 text-center">
              <p className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl font-bold text-[#EA553B]">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#EA553B]">
          Why Leets
        </p>
        <h2 className="mb-12 text-center font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl font-bold uppercase tracking-tight">
          Built for kids, not adults
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-[#EA553B]/30 hover:bg-white/[0.05]"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-4 font-[family-name:var(--font-display,'Barlow_Condensed')] text-xl font-bold uppercase tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REGISTRATION ─────────────────────────────────────── */}
      <section id="register" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

          {/* Left: images + copy */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#EA553B]">
                Ages 5 to 13
              </p>
              <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-bold uppercase leading-[0.95] tracking-tight">
                Register
                <br />
                <span className="text-[#EA553B]">your child</span>
              </h2>
              <p className="mt-4 text-white/65">
                Fill in the form and our team will message you on WhatsApp to arrange a first
                free&nbsp;session.
              </p>
            </div>

            {/* Image stack */}
            <div className="grid grid-cols-2 gap-3">
              <img
                src="/images/padel-court-2.jpg"
                alt="Kids padel training"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <img
                src="/images/padel-court-3.jpg"
                alt="Leets padel court"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <img
                src="/images/padel-court-4.jpg"
                alt="Padel coaching"
                className="col-span-2 aspect-video w-full rounded-xl object-cover"
              />
            </div>

            {/* Trust note */}
            <div className="flex items-start gap-3 rounded-xl border border-[#EA553B]/20 bg-[#EA553B]/5 p-4">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#EA553B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p className="text-sm text-white/70">
                <span className="font-semibold text-white">First session is free.</span>{" "}
                No commitment needed — just come and try.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <KidsAcademyForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
