export const COMPANY = {
  name: "Leets Sports",
  tagline: "A Social Sporty Lifestyle for All the Family",
  heroLine1: "Elevate your sports",
  heroLine2: "experience every day.",
  heroSub:
    "Leets Sports delivers a social and active lifestyle experience across Egypt and Saudi Arabia — padel clubs, academies and boutique fitness studios for the whole family.",
  phone: "+20 122 228 8617",
  email: "info@leetssports.com",
  instagram: "https://instagram.com/leets.sports",
  locations: "Jeddah, KSA · Cairo, Egypt",
};

export const STATS = [
  { value: "3", label: "Facilities delivered & operated" },
  { value: "2", label: "Countries" },
  { value: "1", label: "Academy — Jeddah, KSA" },
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

export const ACADEMY = {
  name: "Leets Padel Academy",
  city: "Obhur, North Jeddah — Saudi Arabia",
  blurb:
    "Our academy in Jeddah runs structured coaching programs, court bookings and player development for all levels — led by professional coaches.",
  bookCourtHref: "/classes/book-court",
  bookCoachHref: "/classes/book-coach",
};

export const FOUNDER = {
  name: "Seif Alaa",
  title: "Founder & CEO",
  bio: "Founder & CEO of Leets Sports. Competitive padel player with a Premier Padel debut in 2024, building and operating padel clubs across Egypt and Saudi Arabia.",
  photo: "",
};

export const COMPANY_PROFILE_INTRO =
  "Leets Sports is a sports management company founded in Egypt and headquartered in Jeddah, Saudi Arabia. We take sports facilities from concept to daily operation: builds and fit-outs, coaching structures, academies, tournaments and community growth. Our track record covers three clubs across Cairo and a padel academy in Jeddah.";
