import Link from "next/link";
import { CalendarDays, Target, Users, Handshake } from "lucide-react";

const ACTIONS = [
  {
    icon: CalendarDays,
    title: "BOOK A COURT",
    desc: "Your next match starts here.",
    cta: "LET’S PLAY ↗",
    href: "/classes/book-court",
  },
  {
    icon: Target,
    title: "FIND YOUR GAME",
    desc: "Build confidence. Improve your play.",
    cta: "EXPLORE ACADEMY ↗",
    href: "/kids",
  },
  {
    icon: Users,
    title: "JOIN THE COMMUNITY",
    desc: "Good games. Great company.",
    cta: "DISCOVER LEETS ↗",
    href: "/company",
  },
  {
    icon: Handshake,
    title: "BUILD WITH US",
    desc: "Bring your next sports venue to life.",
    cta: "LET’S CONNECT ↗",
    href: "/company",
  },
];

export function QuickActions() {
  return (
    <section className="bg-white py-10 sm:py-12 px-[5%] sm:px-[6%] border-b border-[#EAEBEF]">
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
        {ACTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="group flex flex-col items-center justify-between p-3 rounded-2xl transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex flex-col items-center">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#273C57] mb-3.5 transition-transform duration-200 group-hover:scale-110" />
                <h3 className="text-[12px] sm:text-[13px] font-medium tracking-[-0.2px] text-[#111F35] uppercase mb-1.5">
                  {item.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-[#7A8390] min-h-[34px] max-w-[200px]">
                  {item.desc}
                </p>
              </div>
              <span className="mt-3 text-[9px] font-medium tracking-[0.5px] uppercase text-[#344F72] transition-colors group-hover:text-[#172D4D]">
                {item.cta}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
