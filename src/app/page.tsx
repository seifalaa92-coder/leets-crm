import Link from "next/link";

const quickLinks = [
  { href: "/classes/book-court", label: "Book a Court", desc: "Reserve your padel court", color: "#EA553B" },
  { href: "/classes/book-coach", label: "Book a Coach", desc: "Train with the best", color: "#8B5CF6" },
  { href: "/dashboard", label: "Dashboard", desc: "Manage your activity", color: "#22C55E" },
  { href: "/marketplace", label: "Marketplace", desc: "Buy & sell gear", color: "#F59E0B" },
  { href: "/memberships", label: "Memberships", desc: "Join the community", color: "#3B82F6" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-off-white">
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/padel-court-hero.jpg"
            alt="Padel court"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/70" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="font-label text-white/80">Jeddah&apos;s Premier Padel Academy</span>
            </div>
            <h1 className="font-display-bold text-display-2xl text-white mb-6">
              Practice &gt; Achieve &gt; Inspire
            </h1>
            <p className="font-body text-body-lg text-white/70 max-w-2xl mx-auto mb-10">
              Saudi Arabia&apos;s premier padel coaching academy — expert coaching,
              padel-specific fitness, and a community that trains together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/classes/book-court" className="btn-primary">
                Book a Court
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/auth/signup" className="btn-ghost">
                Join Leets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Courts Gallery */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-h2 text-neutral-black mb-3">Our Courts</h2>
          <p className="font-body text-body-md text-neutral-gray">World-class padel facilities in the heart of Jeddah.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
            <img src="/images/padel-court-2.jpg" alt="Court view" className="w-full h-full object-cover" />
          </div>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
            <img src="/images/padel-court-3.jpg" alt="Court view" className="w-full h-full object-cover" />
          </div>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden md:col-span-2">
            <img src="/images/padel-court-4.jpg" alt="Court view" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Training Video */}
      <section className="bg-neutral-black py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-h2 text-white mb-3">Train with the Best</h2>
            <p className="font-body text-body-md text-neutral-gray">See what it&apos;s like to train at Leets.</p>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
            <video
              className="w-full h-full object-cover"
              src="/training.mp4"
              controls
              poster="/images/padel-court-hero.jpg"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-h2 text-neutral-black mb-3">Everything you need</h2>
          <p className="font-body text-body-md text-neutral-gray">From court bookings to community — all in one place.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="card-feature group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${link.color}15` }}>
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: link.color }} />
              </div>
              <h3 className="font-display text-h5 text-neutral-black mb-1">{link.label}</h3>
              <p className="font-body text-body-sm text-neutral-gray">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Kids Academy Video */}
      <section className="bg-gradient-to-br from-[#F28C38]/10 to-transparent py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-h2 text-neutral-black mb-3">Kids Academy</h2>
            <p className="font-body text-body-md text-neutral-gray">Building the next generation of padel champions.</p>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
            <video
              className="w-full h-full object-cover"
              src="/Videos/dunes-kids-academy.mp4"
              controls
              poster="/images/padel-court-hero.jpg"
            />
          </div>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="bg-neutral-black py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="font-display text-3xl tracking-[4px] text-white">LEETS</span>
            <span className="font-label text-brand/80">SPORTS</span>
          </div>
          <p className="font-body text-body-sm text-neutral-gray">Jeddah, Saudi Arabia</p>
        </div>
      </section>
    </div>
  );
}
