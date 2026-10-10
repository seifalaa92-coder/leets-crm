import Link from "next/link";
import { LeetsWordmark } from "@/components/ui/LeetsWordmark";

export function ClosingCommunitySection() {
  return (
    <section className="px-[2%] sm:px-[3%] mb-12 sm:mb-16" id="community">
      <div
        className="mx-auto max-w-6xl rounded-[28px] py-16 sm:py-24 px-6 sm:px-12 text-center text-white shadow-lg"
        style={{
          background: "radial-gradient(ellipse at 50% 110%, #344B6C, #101D32 70%)",
        }}
      >
        <p className="text-[9px] sm:text-[10px] font-medium tracking-[1.8px] uppercase text-[#B9C6D7]">
          MORE THAN A MATCH
        </p>

        <h2 className="mt-4 text-[34px] sm:text-[46px] md:text-[54px] font-medium leading-[1.15] tracking-[-1.5px]">
          Your people.
          <br />
          Your game.
          <br />
          <span className="inline-flex items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-3 flex-wrap">
            <span>YOUR</span>
            <LeetsWordmark variant="white" width={200} className="w-[160px] sm:w-[220px]" />
          </span>
        </h2>

        <p className="mt-6 text-[13px] sm:text-[14px] leading-relaxed text-[#C1CBD9] max-w-md mx-auto">
          A social sporty lifestyle for all the family.
        </p>

        <div className="mt-8">
          <Link
            href="/classes/book-court"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-[11px] font-semibold tracking-[0.2px] text-[#172D4D] shadow-sm transition-all duration-200 hover:bg-[#F5F5F7] hover:scale-105 active:scale-100"
          >
            STEP ONTO THE COURT ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
