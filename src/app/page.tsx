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
      <section className="relative bg-gradient-to-br from-neutral-black via-neutral-dark to-neutral-dark-alt overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 25% 50%, #EA553B 0%, transparent 50%), radial-gradient(circle at 75% 50%, #F97316 0%, transparent 50%)`
        }} />
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-label text-white/60">Jeddah&apos;s Premier Padel Academy</span>
          </div>
          <h1 className="font-display-bold text-display-2xl text-white mb-6">
            Practice &gt; Achieve &gt; Inspire
          </h1>
          <p className="font-body text-body-lg text-white/60 max-w-2xl mx-auto mb-10">
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
