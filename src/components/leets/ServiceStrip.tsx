const SERVICES = [
  "PADEL COURTS",
  "LEETS ACADEMY",
  "COMMUNITY",
  "KIDS ACADEMY",
  "COACHING",
];

export function ServiceStrip() {
  return (
    <div className="border-b border-[#EAEBEF] bg-white py-5 px-[6%]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-around gap-4 text-center">
        {SERVICES.map((service, idx) => (
          <span
            key={idx}
            className="text-[9px] sm:text-[10px] font-normal tracking-[0.5px] text-[#667080] uppercase"
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}
