import Link from "next/link";
import Image from "next/image";

export function KidsAcademySection() {
  return (
    <section className="px-[2%] sm:px-[3%] mb-8" id="academy">
      <div className="mx-auto max-w-6xl rounded-[28px] bg-white border border-[#E7E8EC] p-8 sm:p-14 shadow-[0_10px_30px_rgba(17,31,53,0.03)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-14">
          {/* Real Academy Photography on Left */}
          <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-[#E9EDF1] to-[#D8E0E8] min-h-[350px] sm:min-h-[420px] aspect-[4/5] sm:aspect-auto">
            <Image
              src="/images/kids-promo-2.webp"
              alt="Leets Kids Academy session in progress"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111F35]/70 via-transparent to-black/20" />

            {/* In-photo Editorial Badge */}
            <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
              <span className="rounded-full bg-white/80 backdrop-blur-md px-3 py-1 text-[8px] sm:text-[9px] font-medium tracking-wider uppercase text-[#111F35]">
                AGES 5–13 · CERTIFIED COACHES
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-[20px] sm:text-[24px] font-medium leading-tight tracking-[-0.5px]">
                SMALL GROUPS.
                <br />
                BIG POSSIBILITIES.
              </p>
              <p className="text-[9px] tracking-wider uppercase text-white/80 mt-1">
                FIRST SESSION INTRODUCTORY EXPERIENCE AVAILABLE
              </p>
            </div>
          </div>

          {/* Copy and Registration Action on Right */}
          <div className="flex flex-col justify-center">
            <p className="text-[11px] sm:text-[12px] font-semibold tracking-[1.8px] uppercase text-[#707D8F]">
              LEETS KIDS ACADEMY · AGES 5–13
            </p>

            <h2 className="mt-3 text-[34px] sm:text-[42px] font-medium leading-[1.12] tracking-[-1px] text-[#111F35]">
              Small beginnings.
              <br />
              <em className="not-italic text-[#61768D]">Big possibilities.</em>
            </h2>

            <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.7] text-[#5F6B7C]">
              A place for young players to learn the game, grow in confidence and have fun on court.
              Led by certified instructors trained specifically in children&apos;s athletic and motor development.
            </p>

            <div className="mt-6 space-y-2.5 text-[14px] font-normal leading-[1.8] text-[#5F6B7C]">
              <div className="flex items-center gap-2.5">
                <span className="text-[#172D4D] font-bold">↗</span>
                <span>Small-group coaching (maximum 6 children per group)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#172D4D] font-bold">↗</span>
                <span>Skills, athletic movement, and tactical match play</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#172D4D] font-bold">↗</span>
                <span>A welcoming, family-first padel community</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/kids#register"
                className="rounded-full bg-[#172D4D] px-7 py-3.5 text-[13px] font-semibold tracking-[0.2px] text-white shadow-sm transition-all duration-200 hover:bg-[#304865] hover:-translate-y-0.5 active:translate-y-0"
              >
                REGISTER FOR ACADEMY ↗
              </Link>
              <Link
                href="/kids"
                className="text-[12px] sm:text-[13px] font-semibold tracking-[0.5px] uppercase text-[#5F6B7C] hover:text-[#111F35] transition-colors"
              >
                VIEW FULL PROGRAM →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
