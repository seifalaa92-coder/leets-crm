import Link from "next/link";
import Image from "next/image";

export function KidsSpotlight() {
  return (
    <section className="relative border-t border-white/10 bg-[#0A0F1E] py-20 overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-[#EA553B]/30 bg-gradient-to-r from-[#1E293B]/90 via-[#0F172A]/90 to-[#0A0F1E]/95 p-8 md:p-14 shadow-2xl">
          {/* Subtle Orange Gradient Bloom */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#EA553B]/20 blur-[120px]" />

          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#EA553B]/40 bg-[#EA553B]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#EA553B] mb-4">
                <span>Leets Kids Academy</span>
                <span className="h-1 w-1 rounded-full bg-[#EA553B]" />
                <span>Ages 5–13</span>
              </div>

              <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white leading-[0.92]">
                Raise The Next
                <span className="block text-[#EA553B]">Padel Superstar</span>
              </h2>

              <p className="mt-4 text-base sm:text-lg text-white/75 max-w-xl leading-relaxed">
                Small groups (max 6 players), certified international coaches, and an energetic court experience your child will count down the days to each week.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm font-semibold text-white/80">
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3.5 py-2 border border-white/10">
                  <span className="text-[#EA553B]">✓</span> Max 6 Kids / Group
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3.5 py-2 border border-white/10">
                  <span className="text-[#EA553B]">✓</span> Certified WPT Instructors
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-3.5 py-2 border border-white/10">
                  <span className="text-[#EA553B]">✓</span> 100% Free First Session
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/kids#register"
                  className="min-h-[48px] inline-flex items-center gap-2 rounded-xl bg-[#EA553B] px-8 py-3 font-[family-name:var(--font-display,'Barlow_Condensed')] text-base font-bold uppercase tracking-wider text-white shadow-[0_4px_24px_rgba(234,85,59,0.4)] transition hover:bg-[#FF6B4F] active:scale-[0.98]"
                >
                  <span>Register Free Session</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/kids"
                  className="min-h-[48px] inline-flex items-center rounded-xl border border-white/20 px-6 py-3 font-[family-name:var(--font-display,'Barlow_Condensed')] text-base font-bold uppercase tracking-wider text-white/80 transition hover:border-white hover:text-white"
                >
                  Program Details
                </Link>
              </div>
            </div>

            {/* Right Visual Collages */}
            <div className="lg:col-span-5 relative grid grid-cols-2 gap-3">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-xl">
                <Image
                  src="/images/kids-promo-1.webp"
                  alt="Kids Padel Academy Training"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-xl mt-6">
                <Image
                  src="/images/kids-promo-2.webp"
                  alt="Kids Padel Academy Match Play"
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
