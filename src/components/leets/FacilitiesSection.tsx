import Link from "next/link";
import Image from "next/image";
import { LeetsWordmark } from "@/components/ui/LeetsWordmark";

export function FacilitiesSection() {
  return (
    <section className="bg-[#F5F5F7] py-16 sm:py-20 px-[5%] sm:px-[6%]" id="facilities">
      <div className="mx-auto max-w-6xl">
        {/* Section Top */}
        <div className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] sm:text-[12px] font-semibold tracking-[1.8px] uppercase text-[#707D8F]">
              THE LEETS FOOTPRINT
            </p>
            <h2 className="mt-2 text-[34px] sm:text-[44px] md:text-[52px] font-medium leading-[1.12] tracking-[-1.5px] text-[#111F35]">
              Exceptional spaces.
              <br />
              Everyday connections.
            </h2>
          </div>
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-[#5F6B7C] max-w-sm">
            Places to play. Space to belong.
            <br />
            Explore the venues behind our story.
          </p>
        </div>

        {/* Venue Grid: Large Flagship on left, Two stacked cards on right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
          {/* Flagship Card: Pyramids Park View */}
          <article className="group flex flex-col rounded-[28px] overflow-hidden bg-white border border-[#E7E8EC] transition-shadow duration-300 hover:shadow-[0_15px_35px_rgba(17,31,53,0.06)]">
            {/* Visual Header */}
            <div className="relative h-[280px] sm:h-[320px] w-full overflow-hidden bg-gradient-to-br from-[#283C55] to-[#0A172B]">
              <Image
                src="/clubs/pyramids-park-view/poster.jpg"
                alt="Pyramids Park View Padel Club"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center opacity-85 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111F35]/70 via-[#111F35]/20 to-transparent" />

              {/* Status Pill */}
              <span className="absolute top-4 left-4 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-white">
                ACTIVE · OWNED & OPERATED
              </span>

              {/* Monogram Overlay */}
              <div className="absolute bottom-5 left-5 text-white">
                <LeetsWordmark variant="white" width={140} />
                <span className="block text-[11px] font-semibold tracking-[2.5px] uppercase mt-2 text-white/90">
                  ON COURT.
                </span>
              </div>
            </div>

            {/* Flagship Copy */}
            <div className="p-7 sm:p-9 flex flex-col justify-between flex-1">
              <div>
                <small className="text-[11px] font-semibold tracking-[1.4px] uppercase text-[#707D8F]">
                  SHEIKH ZAYED, CAIRO
                </small>
                <h3 className="mt-2 text-[26px] sm:text-[28px] font-semibold tracking-[-0.5px] text-[#111F35]">
                  PYRAMIDS PARK VIEW
                </h3>
                <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-[#5F6B7C]">
                  Our flagship home for courts, coaching and community. Built and operated end-to-end by Leets Sports.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/clubs/pyramids-park-view"
                  className="inline-flex items-center text-[12px] sm:text-[13px] font-semibold tracking-[0.5px] uppercase text-[#172D4D] transition-colors hover:text-[#304865]"
                >
                  EXPLORE OUR FLAGSHIP ↗
                </Link>
              </div>
            </div>
          </article>

          {/* Stacked Venue Cards on Right */}
          <div className="flex flex-col gap-6">
            {/* Westmark Mall Club */}
            <article className="rounded-[28px] bg-white p-7 sm:p-9 border border-[#E7E8EC] transition-shadow duration-300 hover:shadow-[0_15px_35px_rgba(17,31,53,0.06)] flex flex-col justify-between">
              <div>
                <small className="text-[11px] font-semibold tracking-[1.4px] uppercase text-[#707D8F]">
                  DELIVERED · SHEIKH ZAYED
                </small>
                <h3 className="mt-3 text-[26px] sm:text-[30px] font-medium tracking-[-0.5px] text-[#111F35] leading-tight">
                  WESTMARK
                  <br />
                  MALL CLUB
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-[#5F6B7C]">
                  Club operations in the heart of a commercial destination. Delivered and operated by Leets Sports.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/clubs/westmark-mall"
                  className="inline-flex items-center text-[12px] sm:text-[13px] font-semibold tracking-[0.5px] uppercase text-[#172D4D] transition-colors hover:text-[#304865]"
                >
                  VIEW PROJECT DETAILS ↗
                </Link>
              </div>
            </article>

            {/* Padel Ace */}
            <article className="rounded-[28px] bg-white p-7 sm:p-9 border border-[#E7E8EC] transition-shadow duration-300 hover:shadow-[0_15px_35px_rgba(17,31,53,0.06)] flex flex-col justify-between">
              <div>
                <small className="text-[11px] font-semibold tracking-[1.4px] uppercase text-[#707D8F]">
                  DELIVERED · NEW CAIRO
                </small>
                <h3 className="mt-3 text-[26px] sm:text-[30px] font-medium tracking-[-0.5px] text-[#111F35] leading-tight">
                  PADEL ACE
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-[#5F6B7C]">
                  Club operations and coaching programs in East Cairo. Coaching and community delivered by Leets.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/clubs/padel-ace"
                  className="inline-flex items-center text-[12px] sm:text-[13px] font-semibold tracking-[0.5px] uppercase text-[#172D4D] transition-colors hover:text-[#304865]"
                >
                  VIEW PROJECT DETAILS ↗
                </Link>
              </div>
            </article>
          </div>
        </div>

        {/* View All Venues Link */}
        <div className="mt-10 text-center sm:text-right">
          <Link
            href="/clubs"
            className="text-[12px] sm:text-[13px] font-semibold tracking-[0.5px] uppercase text-[#5F6B7C] hover:text-[#111F35] transition-colors"
          >
            VIEW ALL LEETS FACILITIES →
          </Link>
        </div>
      </div>
    </section>
  );
}
