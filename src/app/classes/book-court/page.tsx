import Link from "next/link";
import { SiteHeader } from "@/components/leets/Shell";

export default function BookCourtPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EA553B]/15">
          <svg className="h-10 w-10 text-[#EA553B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-bold uppercase tracking-tight">
          Book a Court
        </h1>
        <p className="mt-4 max-w-lg text-white/70">
          Court booking is powered by <strong className="text-white">Padel Finder</strong> — download the app to browse availability and reserve your court.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 text-[#0F172A] transition hover:bg-white/90"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <div className="text-left">
              <p className="text-xs text-[#0F172A]/50">Download on the</p>
              <p className="text-lg font-bold leading-tight">App Store</p>
            </div>
          </a>

          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 text-[#0F172A] transition hover:bg-white/90"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.61 2.5C2.72 3.04 2 4.33 2 5.78v12.44c0 1.45.72 2.74 1.61 3.28L12 12 3.61 2.5zM13.38 12l7.71 7.71c.57-.52.91-1.35.91-2.28V6.57c0-.93-.34-1.76-.91-2.28L13.38 12z"/>
            </svg>
            <div className="text-left">
              <p className="text-xs text-[#0F172A]/50">Get it on</p>
              <p className="text-lg font-bold leading-tight">Google Play</p>
            </div>
          </a>
        </div>

        <p className="mt-12 text-sm text-white/40">
          Already have the app?{" "}
          <Link href="/classes" className="font-semibold text-[#EA553B] hover:underline">
            Browse classes
          </Link>
        </p>
      </main>
    </div>
  );
}
