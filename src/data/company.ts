export const COMPANY = {
  name: "Leets Sports",
  tagline: "A Social Sporty Lifestyle for All the Family",
  heroLine1: "Elevate your sports",
  heroLine2: "experience every day.",
  heroSub:
    "Leets Sports delivers a social and active lifestyle experience across Egypt — padel clubs, academies and boutique fitness studios for the whole family. Now expanding to Saudi Arabia in 2026",
  email: "info@leetssports.com",
  instagram: "https://instagram.com/leets.sports",
  locations: "Jeddah, KSA · Cairo, Egypt",
};

export const STATS = [
  { value: "2019", label: "In the market since" },
  { value: "4", label: "Facilities delivered" },
  { value: "600+", label: "Players coached" },
  { value: "2", label: "Countries (Egypt & KSA)" },
];

export type Club = {
  slug: string;
  name: string;
  city: string;
  country: string;
  status: "active" | "delivered";
  role: string;
  short: string;
  about: string;
  videoUrls?: string[];
  previewVideo?: string;
  posterImage?: string;
  highlights?: string[];
};

export const CLUBS: Club[] = [
  {
    slug: "pyramids-park-view",
    name: "Pyramids Park View",
    city: "Sheikh Zayed, Cairo",
    country: "Egypt",
    status: "active",
    role: "Owned & Operated by Leets",
    short: "Our flagship club in Sheikh Zayed — courts, coaching and community.",
    about:
      "Pyramids Park View is the Leets flagship in Sheikh Zayed, Cairo. Built and run end-to-end by Leets Sports, the club covers everything from court operations and maintenance to coaching programs, tournaments and a growing members' community.",
    videoUrls: [],
    previewVideo: "/clubs/pyramids-park-view/Pyramids%20Main%20Video.mp4",
    posterImage: "/clubs/pyramids-park-view/poster.jpg",
    highlights: ["Flagship Facility", "2 Courts + Gym & Pool", "Pro Academy"],
  },
  {
    slug: "westmark-mall",
    name: "Westmark Mall Club",
    city: "Sheikh Zayed, Cairo",
    country: "Egypt",
    status: "delivered",
    role: "Operated by Leets",
    short: "Full club operation inside Westmark Mall, Sheikh Zayed.",
    about:
      "At Westmark Mall in Sheikh Zayed, Leets Sports ran the complete padel operation — bookings, coaching staff, academies and events — turning a mall location into a destination for the local padel community.",
    videoUrls: [],
    previewVideo: "/clubs/westmark-mall/Westmark%201.mp4",
    posterImage: "/clubs/westmark-mall/poster.jpg",
    highlights: ["Commercial Hub", "Full Operations", "Leagues & Events"],
  },
  {
    slug: "padel-ace",
    name: "Padel Ace",
    city: "New Cairo",
    country: "Egypt",
    status: "delivered",
    role: "Operated by Leets",
    short: "Club operations and coaching programs in New Cairo.",
    about:
      "Padel Ace in New Cairo was operated by Leets Sports, with our team handling day-to-day club management, coaching programs and player development across all levels.",
    videoUrls: [],
    previewVideo: "/clubs/padel-ace/Padel%20ACe%201.mp4",
    posterImage: "/clubs/padel-ace/poster.jpg",
    highlights: ["East Cairo Destination", "Academy Sessions", "Player Coaching"],
  },
];

export interface LifestylePillar {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  href: string;
  ctaText: string;
  badge?: string;
  featured?: boolean;
}

export const LIFESTYLE_PILLARS: LifestylePillar[] = [
  {
    id: "padel",
    title: "Championship Padel Courts & Academies",
    category: "Performance Sports",
    description: "World-class panoramic glass courts, certified coach instruction, social leagues, and tournament play for all skill brackets.",
    image: "/images/lifestyle/padel-action.webp",
    href: "/clubs",
    ctaText: "Explore Facilities",
    badge: "Signature Sport",
    featured: true,
  },
  {
    id: "pilates",
    title: "Reformer Pilates & Mobility Studio",
    category: "Movement & Tone",
    description: "Precision reformer sessions engineered to unlock core strength, spinal flexibility, and athletic balance.",
    image: "/images/lifestyle/pilates-studio.webp",
    href: "/company",
    ctaText: "Discover Studio",
  },
  {
    id: "physio",
    title: "Sports Physio & High-Performance Recovery",
    category: "Athletic Wellness",
    description: "Targeted sports therapy, cold immersion, and recovery protocols keeping athletes resilient, pain-free, and game-ready.",
    image: "/images/lifestyle/physio-recovery.webp",
    href: "/company",
    ctaText: "View Recovery Hub",
  },
  {
    id: "kids",
    title: "Leets Kids Academy (Ages 5–13)",
    category: "Youth Development",
    description: "Small groups (max 6), WPT certified coaches, and fun skill drills designed to raise confident players.",
    image: "/images/kids-promo-1.webp",
    href: "/kids",
    ctaText: "Register Free Session",
    badge: "1st Session Free",
    featured: true,
  },
  {
    id: "wellness",
    title: "Sunset Rooftop Yoga & Social Hub",
    category: "Community & Lifestyle",
    description: "Breathwork, community coffee lounge, and family recreation fostering a vibrant social sporty lifestyle.",
    image: "/images/lifestyle/yoga-rooftop.webp",
    href: "/company",
    ctaText: "Our Vision",
  },
];

export const COMPANY_PROFILE_INTRO = `Leets Sports is a sports management company. We build, operate and run sports facilities — designing them from the ground up, then running them day to day: coaching, programming, and operations.

In the market since 2019, Leets is home of the first certified padel academy in the region, with more than 600 players coached and four venues built across Egypt. Some we built for partners, some we run ourselves — all carry the same standard.`;

export const ABOUT_STATS = [
  { value: "2019", label: "In the market since" },
  { value: "4", label: "Venues built" },
  { value: "600+", label: "Players coached" },
  { value: "1st", label: "Certified padel academy in the region" },
];

export const VENUES = [
  { name: "Pyramids Park, New Giza", description: "Full facility: 2 padel courts, gym and pool" },
  { name: "Padel Ace", description: "Run by Leets" },
  { name: "Westmark Mall", description: "Run by Leets" },
  { name: "Padel Dose", description: "Run by Leets" },
];
