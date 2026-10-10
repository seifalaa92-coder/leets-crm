import { SiteHeader, SiteFooter } from "@/components/leets/Shell";
import KidsAcademyForm from "@/components/forms/KidsAcademyForm";
import Image from "next/image";

export const metadata = {
  title: "Kids Academy | Leets Sports",
  description:
    "Register your child for the Leets Sports padel academy - coaching for ages 5 to 13 from certified padel instructors.",
};

const FEATURES = [
  {
    icon: "👥",
    title: "Small Groups",
    body: "Maximum 6 kids per session so every child gets real coaching attention and ball touches.",
  },
  {
    icon: "🏆",
    title: "Certified Coaches",
    body: "WPT & FEP certified instructors specially trained in children's motor and athletic development.",
  },
  {
    icon: "🎾",
    title: "All Levels Welcome",
    body: "From complete beginners picking up their first racket to kids developing tactical match play.",
  },
];

export default function KidsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111F35]">
      <SiteHeader />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-16 text-center">
        <p className="text-[10px] font-medium tracking-[1.5px] uppercase text-[#697789]">
          LEETS KIDS ACADEMY · AGES 5–13
        </p>

        <h1 className="mx-auto mt-4 max-w-3xl text-4xl sm:text-6xl font-medium tracking-[-1.5px] text-[#111F35] leading-tight">
          Small beginnings.
          <br />
          <em className="not-italic text-[#61768D]">Big possibilities.</em>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-[#687383] leading-relaxed">
          A place for young players to learn the game, grow in confidence and have fun on court.
          Small groups, certified coaches, and an active family community.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#register"
            className="rounded-full bg-[#172D4D] px-7 py-3.5 text-[11px] font-medium tracking-[0.2px] text-white shadow-sm transition-all duration-200 hover:bg-[#304865] hover:-translate-y-0.5"
          >
            REGISTER MY CHILD ↗
          </a>
        </div>

        {/* Hero Photo Card */}
        <div className="relative mx-auto mt-12 max-w-4xl aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-[28px] border border-[#E7E8EC] bg-white shadow-md">
          <Image
            src="/images/kids-promo-2.webp"
            alt="Leets Kids Academy session in progress"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <span className="absolute bottom-4 left-6 rounded-full bg-black/50 backdrop-blur-md px-3.5 py-1 text-[9px] font-medium tracking-wider uppercase text-white">
            LEETS JUNIOR PADEL PROGRAM · AGES 5–13
          </span>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section className="border-y border-[#E7E8EC] bg-white">
        <div className="mx-auto grid max-w-4xl grid-cols-3 divide-x divide-[#E7E8EC]">
          {[
            { value: "2019", label: "In the market since" },
            { value: "4", label: "Venues delivered" },
            { value: "600+", label: "Players coached" },
          ].map((s) => (
            <div key={s.label} className="py-8 text-center">
              <p className="text-3xl sm:text-4xl font-semibold text-[#172D4D]">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-[#758191]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-[24px] border border-[#E7E8EC] bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#111F35]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#687383]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REGISTRATION ─────────────────────────────────────── */}
      <section id="register" className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: copy + trust notes */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[2px] text-[#172D4D]">
                AGES 5 TO 13
              </p>
              <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-[#111F35] leading-tight">
                Register
                <br />
                <span className="text-[#61768D]">your child</span>
              </h2>
              <p className="mt-4 text-[#687383] leading-relaxed">
                Fill in the form and our coaching team will message you on WhatsApp to arrange a first
                session and answer any questions.
              </p>
            </div>

            {/* Trust note */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#E7E8EC] bg-white p-5 shadow-sm">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#172D4D]/10 text-[#172D4D]">
                ✓
              </div>
              <p className="text-sm text-[#687383]">
                <strong className="text-[#111F35]">First introductory session available.</strong>{" "}
                No long-term commitment required — let your child experience the court and meet the coaches first.
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
