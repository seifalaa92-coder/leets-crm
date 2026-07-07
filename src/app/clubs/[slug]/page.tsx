import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter, StatusBadge } from "@/components/leets/Shell";
import { CLUBS } from "@/data/company";

export const dynamic = "force-static";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const VIDEO_EXT = [".mp4", ".webm", ".mov"];

function getMedia(slug: string) {
  const dir = path.join(process.cwd(), "public", "clubs", slug);
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => !f.startsWith("."));
  } catch {
    files = [];
  }
  const images = files.filter((f) => IMAGE_EXT.includes(path.extname(f).toLowerCase()));
  const videos = files.filter((f) => VIDEO_EXT.includes(path.extname(f).toLowerCase()));
  return { images, videos };
}

export function generateStaticParams() {
  return CLUBS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const club = CLUBS.find((c) => c.slug === params.slug);
  return {
    title: club ? `${club.name} — Leets Sports` : "Club — Leets Sports",
    description: club?.short ?? "",
  };
}

export default function ClubPage({ params }: { params: { slug: string } }) {
  const club = CLUBS.find((c) => c.slug === params.slug);
  if (!club) notFound();

  const { images, videos } = getMedia(club.slug);
  const hasMedia = images.length > 0 || videos.length > 0;

  return (
    <div className="min-h-screen bg-[#0B1420] text-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <Link href="/clubs" className="text-sm font-semibold text-[#2E7CF6] hover:underline">
          ← All clubs
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StatusBadge status={club.status} />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2E7CF6]">
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

          {videos.length > 0 && (
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {videos.map((v) => (
                <video
                  key={v}
                  controls
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
                // eslint-disable-next-line @next/next/no-img-element
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
