import Image from "next/image";
import Link from "next/link";
import { LIFESTYLE_PILLARS } from "@/data/company";

export function LifestyleBento() {
  const padel = LIFESTYLE_PILLARS.find((p) => p.id === "padel")!;
  const pilates = LIFESTYLE_PILLARS.find((p) => p.id === "pilates")!;
  const physio = LIFESTYLE_PILLARS.find((p) => p.id === "physio")!;
  const kids = LIFESTYLE_PILLARS.find((p) => p.id === "kids")!;
  const wellness = LIFESTYLE_PILLARS.find((p) => p.id === "wellness")!;

  return (
    <section className="relative border-t border-white/10 bg-[#0A0F1E] py-24 overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[#EA553B]/10 blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-[#EA553B]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#EA553B] mb-3">
              The Complete Ecosystem
            </div>
            <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white">
              More Than Just Courts.
              <span className="block text-white/50">A Social Sporty Lifestyle.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-white/70">
            From tournament-ready padel to reformer pilates and athlete recovery, Leets designs and operates full-service athletic destinations.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {/* Card 1: Padel Academy (Large 2 Cols x 2 Rows) */}
          <Link
            href={padel.href}
            className="group relative md:col-span-2 lg:col-span-2 md:row-span-2 overflow-hidden rounded-3xl border border-white/10 bg-[#0F172A] p-8 flex flex-col justify-end min-h-[420px] transition-all duration-300 hover:border-[#EA553B]/80 hover:shadow-[0_20px_50px_rgba(234,85,59,0.25)]"
          >
            <Image
              src={padel.image}
              alt={padel.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/60 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-[#EA553B] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                  {padel.badge}
                </span>
                <span className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                  {padel.category}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white group-hover:text-[#EA553B] transition-colors">
                {padel.title}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-white/80 max-w-lg leading-relaxed">
                {padel.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#EA553B]">
                <span>{padel.ctaText}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </Link>

          {/* Card 2: Reformer Pilates Studio */}
          <Link
            href={pilates.href}
            className="group relative md:col-span-1 lg:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-[#0F172A] p-7 flex flex-col justify-end min-h-[280px] transition-all duration-300 hover:border-[#EA553B]/60"
          >
            <Image
              src={pilates.image}
              alt={pilates.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/70 to-transparent" />

            <div className="relative z-10">
              <span className="text-xs uppercase tracking-wider text-[#EA553B] font-bold">
                {pilates.category}
              </span>
              <h3 className="mt-1 font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white group-hover:text-[#EA553B] transition-colors">
                {pilates.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-white/70 line-clamp-2">
                {pilates.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#EA553B]">
                <span>{pilates.ctaText}</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Card 3: Physio & Recovery */}
          <Link
            href={physio.href}
            className="group relative md:col-span-1 lg:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-[#0F172A] p-7 flex flex-col justify-end min-h-[280px] transition-all duration-300 hover:border-[#EA553B]/60"
          >
            <Image
              src={physio.image}
              alt={physio.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/70 to-transparent" />

            <div className="relative z-10">
              <span className="text-xs uppercase tracking-wider text-[#EA553B] font-bold">
                {physio.category}
              </span>
              <h3 className="mt-1 font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white group-hover:text-[#EA553B] transition-colors">
                {physio.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-white/70 line-clamp-2">
                {physio.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#EA553B]">
                <span>{physio.ctaText}</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Card 4: Kids Academy (Spotlight Card) */}
          <Link
            href={kids.href}
            className="group relative md:col-span-2 lg:col-span-2 overflow-hidden rounded-3xl border border-[#EA553B]/40 bg-gradient-to-br from-[#EA553B]/20 via-[#0F172A] to-[#0A0F1E] p-7 flex flex-col justify-end min-h-[300px] transition-all duration-300 hover:border-[#EA553B] hover:shadow-[0_12px_40px_rgba(234,85,59,0.3)]"
          >
            <Image
              src={kids.image}
              alt={kids.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/80 to-[#EA553B]/20" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-[#EA553B] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {kids.badge}
                </span>
                <span className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                  {kids.category}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white group-hover:text-[#EA553B] transition-colors">
                {kids.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-white/80 line-clamp-2">
                {kids.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#EA553B]">
                <span>{kids.ctaText}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </Link>

          {/* Card 5: Wellness & Social */}
          <Link
            href={wellness.href}
            className="group relative md:col-span-1 lg:col-span-2 overflow-hidden rounded-3xl border border-white/10 bg-[#0F172A] p-7 flex flex-col justify-end min-h-[300px] transition-all duration-300 hover:border-[#EA553B]/60"
          >
            <Image
              src={wellness.image}
              alt={wellness.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/70 to-transparent" />

            <div className="relative z-10">
              <span className="text-xs uppercase tracking-wider text-[#EA553B] font-bold">
                {wellness.category}
              </span>
              <h3 className="mt-1 font-[family-name:var(--font-display,'Barlow_Condensed')] text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white group-hover:text-[#EA553B] transition-colors">
                {wellness.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-white/70 line-clamp-2">
                {wellness.description}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#EA553B]">
                <span>{wellness.ctaText}</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
