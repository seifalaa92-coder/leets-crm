import Link from "next/link";
import Image from "next/image";

export function CreativeCTA() {
  return (
    <section className="relative border-t border-white/10 bg-[#0F172A] py-24 overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Image
          src="/images/lifestyle/padel-wide.webp"
          alt="Padel Arena"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-[#0F172A]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#EA553B] mb-6 backdrop-blur-sm">
          PRACTICE &gt; ACHIEVE &gt; INSPIRE
        </div>

        <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-[0.9]">
          Step Onto The Court.
          <span className="block text-[#EA553B] mt-2">Elevate Your Lifestyle.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-white/70">
          Whether booking court time with friends, enrolling your child in our youth academy, or exploring facility partnership opportunities — Leets is your home for sports.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/classes/book-court"
            className="min-h-[52px] inline-flex items-center gap-2.5 rounded-xl bg-[#EA553B] px-8 py-3.5 font-[family-name:var(--font-display,'Barlow_Condensed')] text-base font-bold uppercase tracking-wider text-white shadow-[0_4px_30px_rgba(234,85,59,0.4)] transition hover:bg-[#FF6B4F] active:scale-[0.98]"
          >
            <span>Book a Court</span>
            <span>→</span>
          </Link>

          <Link
            href="/company"
            className="min-h-[52px] inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 font-[family-name:var(--font-display,'Barlow_Condensed')] text-base font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:border-white hover:bg-white/20 active:scale-[0.98]"
          >
            Company Profile
          </Link>

          <a
            href="mailto:info@leetssports.com"
            className="min-h-[52px] inline-flex items-center rounded-xl border border-white/15 px-6 py-3.5 font-[family-name:var(--font-display,'Barlow_Condensed')] text-base font-bold uppercase tracking-wider text-white/70 transition hover:border-white/40 hover:text-white"
          >
            Contact Team
          </a>
        </div>
      </div>
    </section>
  );
}
