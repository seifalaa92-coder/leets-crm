import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter, StatusBadge } from "@/components/leets/Shell";
import { ClubVideo } from "@/components/leets/ClubVideo";
import type { Club } from "@/data/company";

const CLUBS: (Club & { localVideos?: string[]; localImages?: string[] })[] = [
  {
    slug: "pyramids-park-view",
    name: "Pyramids Park View",
    city: "Sheikh Zayed, Cairo",
    country: "Egypt",
    status: "active",
    role: "Owned & Operated by Leets",
    short: "Our flagship club in Sheikh Zayed: courts, coaching and community.",
    about: "Pyramids Park View is the Leets flagship in Sheikh Zayed, Cairo. Built and run end-to-end by Leets Sports, the club covers everything from court operations and maintenance to coaching programs, tournaments and a growing members' community.",
    videoUrls: [],
    localVideos: ["Pyramids Main Video.mp4", "Pyramids Park Video 1.mp4"],
  },
  {
    slug: "westmark-mall",
    name: "Westmark Mall Club",
    city: "Sheikh Zayed, Cairo",
    country: "Egypt",
    status: "delivered",
    role: "Operated by Leets",
    short: "Full club operation inside Westmark Mall, Sheikh Zayed.",
    about: "At Westmark Mall in Sheikh Zayed, Leets Sports ran the complete padel operation (bookings, coaching staff, academies and events), turning a mall location into a destination for the local padel community.",
    videoUrls: [],
    localVideos: ["Westmark 1.mp4", "Westmark 2.mp4", "westmark 3.mp4"],
  },
  {
    slug: "padel-ace",
    name: "Padel Ace",
    city: "New Cairo",
    country: "Egypt",
    status: "delivered",
    role: "Operated by Leets",
    short: "Club operations and coaching programs in New Cairo.",
    about: "Padel Ace in New Cairo was operated by Leets Sports, with our team handling day-to-day club management, coaching programs and player development across all levels.",
    videoUrls: [],
    localVideos: ["Padel ACe 1.mp4", "Padel Ace 2.mp4", "Padel Ace 3.mp4"],
  },
];

export function generateStaticParams() {
  return CLUBS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = CLUBS.find((c) => c.slug === slug);
  return {
    title: club ? club.name : "Club",
    description: club?.short ?? "",
  };
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = CLUBS.find((c) => c.slug === slug);
  if (!club) notFound();

  const videos = club.localVideos ?? [];
  const images = club.localImages ?? [];
  const hasMedia = images.length > 0 || videos.length > 0 || (club.videoUrls?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111F35]">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl px-4 py-16">
        <Link
          href="/clubs"
          className="-my-3 inline-flex min-h-[44px] items-center py-3 text-xs font-medium uppercase tracking-wider text-[#172D4D] transition-colors duration-100 hover:underline"
        >
          ← All facilities
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StatusBadge status={club.status} />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#172D4D]">
            {club.role}
          </span>
        </div>
        <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-1px] text-[#111F35]">
          {club.name}
        </h1>
        <p className="mt-2 text-sm text-[#667080]">
          {club.city} · {club.country}
        </p>
        <p className="mt-6 max-w-3xl text-base sm:text-lg text-[#687383] leading-relaxed">{club.about}</p>

        <section className="mt-14">
          <h2 className="mb-6 text-2xl sm:text-3xl font-medium tracking-tight text-[#111F35]">
            Gallery & Media
          </h2>

          {!hasMedia && (
            <div className="rounded-2xl border border-dashed border-[#E7E8EC] bg-white p-10 text-center text-[#758191]">
              Media coming soon.
            </div>
          )}

          {club.videoUrls && club.videoUrls.length > 0 && (
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {club.videoUrls.map((url, i) => (
                <ClubVideo key={url} src={url} lead={i === 0} />
              ))}
            </div>
          )}

          {videos.length > 0 && (
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {videos.map((v, i) => (
                <ClubVideo
                  key={v}
                  src={`/clubs/${club.slug}/${encodeURIComponent(v)}`}
                  lead={i === 0 && !(club.videoUrls && club.videoUrls.length > 0)}
                />
              ))}
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {images.map((img) => (
                <img
                  key={img}
                  src={`/clubs/${club.slug}/${img}`}
                  alt={`${club.name} - ${img}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-2xl border border-[#E7E8EC] object-cover"
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
