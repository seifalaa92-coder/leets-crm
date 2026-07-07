import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter, StatusBadge } from "@/components/leets/Shell";
import type { Club } from "@/data/company";

const CLUBS: (Club & { localVideos?: string[]; localImages?: string[] })[] = [
  {
    slug: "pyramids-park-view",
    name: "Pyramids Park View",
    city: "Sheikh Zayed, Cairo",
    country: "Egypt",
    status: "active",
    role: "Owned & Operated by Leets",
    short: "Our flagship club in Sheikh Zayed — courts, coaching and community.",
    about: "Pyramids Park View is the Leets flagship in Sheikh Zayed, Cairo. Built and run end-to-end by Leets Sports, the club covers everything from court operations and maintenance to coaching programs, tournaments and a growing members' community.",
    videoUrls: ["https://kvppvvsuynsyvxyzgadt.supabase.co/storage/v1/object/public/club-media/pyramids-main-video.mp4"],
  },
  {
    slug: "westmark-mall",
    name: "Westmark Mall Club",
    city: "Sheikh Zayed, Cairo",
    country: "Egypt",
    status: "delivered",
    role: "Operated by Leets",
    short: "Full club operation inside Westmark Mall, Sheikh Zayed.",
    about: "At Westmark Mall in Sheikh Zayed, Leets Sports ran the complete padel operation — bookings, coaching staff, academies and events — turning a mall location into a destination for the local padel community.",
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
    title: club ? `${club.name} — Leets Sports` : "Club — Leets Sports",
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
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <Link href="/clubs" className="text-sm font-semibold text-[#EA553B] hover:underline">
          ← All facilities
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StatusBadge status={club.status} />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#EA553B]">
            {club.role}
          </span>
        </div>
        <h1 className="mt-3 font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-bold uppercase tracking-tight">
          {club.name}
        </h1>
        <p className="mt-2 text-white/50">
          {club.city} · {club.country}
        </p>
        <p className="mt-6 max-w-3xl text-lg text-white/75">{club.about}</p>

        <section className="mt-14">
          <h2 className="mb-6 font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl font-bold uppercase tracking-tight">
            Gallery
          </h2>

          {!hasMedia && (
            <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-white/50">
              Media coming soon.
            </div>
          )}

          {club.videoUrls && club.videoUrls.length > 0 && (
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {club.videoUrls.map((url) => (
                <video
                  key={url}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full rounded-xl border border-white/10"
                >
                  <source src={url} />
                </video>
              ))}
            </div>
          )}

          {videos.length > 0 && (
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {videos.map((v) => (
                <video
                  key={v}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full rounded-xl border border-white/10"
                >
                  <source src={`/clubs/${club.slug}/${v}`} />
                </video>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {images.map((img) => (
                <img
                  key={img}
                  src={`/clubs/${club.slug}/${img}`}
                  alt={`${club.name} — ${img}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl border border-white/10 object-cover"
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
