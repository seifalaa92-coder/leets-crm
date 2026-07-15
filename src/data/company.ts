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
  { value: "5", label: "Facilities delivered & operated" },
  { value: "2", label: "Countries" },

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
    about:
      "At Westmark Mall in Sheikh Zayed, Leets Sports ran the complete padel operation — bookings, coaching staff, academies and events — turning a mall location into a destination for the local padel community.",
    videoUrls: [],
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
  },
];

export const COMPANY_PROFILE_INTRO = `Leets Sports is a sports management company. We build, operate and run sports facilities — designing them from the ground up, then running them day to day: coaching, programming, and operations.

In the market since 2017, Leets is home of the first certified padel academy in the region, with more than 600 players coached and four venues built across Egypt. Some we built for partners, some we run ourselves — all carry the same standard.`;

export const ABOUT_STATS = [
  { value: "2017", label: "In the market since" },
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
