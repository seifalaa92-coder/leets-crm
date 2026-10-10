import Link from "next/link";
import Image from "next/image";
import { LeetsWordmark } from "@/components/ui/LeetsWordmark";

export function FacilitiesSection() {
  return (
    <section className="bg-[#F5F5F7] py-16 sm:py-20 px-[5%] sm:px-[6%]" id="facilities">
      <div className="mx-auto max-w-6xl">
        {/* Section Top */}
        <div className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[9px] font-medium tracking-[1.5px] uppercase text-[#7B8695]">
              THE LEETS FOOTPRINT
            </p>
            <h2 className="mt-2 text-[30px] sm:text-[38px] md:text-[46px] font-medium leading-[1.15] tracking-[-1.5px] text-[#111F35]">
              Exceptional spaces.
              <br />
              Everyday connections.
            </h2>
          </div>
          <p className="text-[12px] sm:text-[13px] leading-relaxed text-[#697383] max-w-xs">
            Places to play. Space to belong.
            <br />
            Explore the venues behind our story.
          </p>
        </div>

        {/* Venue Grid: Large Flagship on left, Two stacked cards on right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
          {/* Flagship Card: Pyramids Park View */}
          <article className="group flex flex-col rounded-[24px] overflow-hidden bg-white border border-[#E7E8EC] transition-shadow duration-300 hover:shadow-[0_15px_35px_rgba(17,31,53,0.06)]">
            {/* Visual Header */}
            <div className="relative h-[260px] sm:h-[280px] w-full overflow-hidden bg-gradient-to-br from-[#283C55] to-[#0A172B]">
              <Image
                src="/clubs/pyramids-park-view/poster.jpg"
                alt="Pyramids Park View Padel Club"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center opacity-85 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111F35]/70 via-[#111F35]/20 to-transparent" />

              {/* Status Pill */}
              <span className="absolute top-4 left-4 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-[8px] font-semibold tracking-wider uppercase text-white">
                ACTIVE · OWNED & OPERATED
              </span>

              {/* Monogram Overlay */}
              <div className="absolute bottom-5 left-5 text-white">
                <LeetsWordmark variant="white" width={130} />
                <span className="block text-[9px] font-medium tracking-[2.5px] uppercase mt-2 text-white/80">
                  ON COURT.
                </span>
              </div>
            </div>

            {/* Flagship Copy */}
            <div className="p-7 sm:p-8 flex flex-col justify-between flex-1">
              <div>
                <small className="text-[9px] font-medium tracking-[1.2px] uppercase text-[#758191]">
                  SHEIKH ZAYED, CAIRO
                </small>
                <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.5px] text-[#111F35]">
                  PYRAMIDS PARK VIEW
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-[#687383]">
                  Our flagship home for courts, coaching and community. Built and operated end-to-end by Leets Sports.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/clubs/pyramids-park-view"
                  className="inline-flex items-center text-[10px] font-medium tracking-[0.5px] uppercase text-[#253E5F] transition-colors hover:text-[#172D4D]"
                >
                  EXPLORE OUR FLAGSHIP ↗
                </Link>
              </div>
            </div>
          </article>

          {/* Stacked Venue Cards on Right */}
          <div className="flex flex-col gap-5">
            {/* Westmark Mall Club */}
            <article className="rounded-[24px] bg-white p-7 sm:p-8 border border-[#E7E8EC] transition-shadow duration-300 hover:shadow-[0_15px_35px_rgba(17,31,53,0.06)] flex flex-col justify-between">
              <div>
                <small className="text-[9px] font-medium tracking-[1.2px] uppercase text-[#758191]">
                  DELIVERED · SHEIKH ZAYED
                </small>
                <h3 className="mt-4 text-[24px] sm:text-[27px] font-medium tracking-[-0.5px] text-[#111F35] leading-tight">
                  WESTMARK
                  <br />
                  MALL CLUB
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-[#76808E]">
                  Club operations in the heart of a commercial destination. Delivered and operated by Leets Sports.
                </p>
              </div>

              <div className="mt-5">
                <Link
                  href="/clubs/westmark-mall"
                  className="inline-flex items-center text-[10px] font-medium tracking-[0.5px] uppercase text-[#253E5F] transition-colors hover:text-[#172D4D]"
                >
                  VIEW PROJECT DETAILS ↗
                </Link>
              </div>
            </article>

            {/* Padel Ace */}
            <article className="rounded-[24px] bg-white p-7 sm:p-8 border border-[#E7E8EC] transition-shadow duration-300 hover:shadow-[0_15px_35px_rgba(17,31,53,0.06)] flex flex-col justify-between">
              <div>
                <small className="text-[9px] font-medium tracking-[1.2px] uppercase text-[#758191]">
                  DELIVERED · NEW CAIRO
                </small>
                <h3 className="mt-4 text-[24px] sm:text-[27px] font-medium tracking-[-0.5px] text-[#111F35] leading-tight">
                  PADEL ACE
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-[#76808E]">
                  Club operations and coaching programs in East Cairo. Coaching and community delivered by Leets.
                </p>
              </div>

              <div className="mt-5">
                <Link
                  href="/clubs/padel-ace"
                  className="inline-flex items-center text-[10px] font-medium tracking-[0.5px] uppercase text-[#253E5F] transition-colors hover:text-[#172D4D]"
                >
                  VIEW PROJECT DETAILS ↗
                </Link>
              </div>
            </article>
          </div>
        </div>

        {/* View All Venues Link */}
        <div className="mt-8 text-center sm:text-right">
          <Link
            href="/clubs"
            className="text-[10px] font-medium tracking-[0.5px] uppercase text-[#697383] hover:text-[#111F35] transition-colors"
          >
            VIEW ALL LEETS FACILITIES →
          </Link>
        </div>
      </div>
    </section>
  );
}
