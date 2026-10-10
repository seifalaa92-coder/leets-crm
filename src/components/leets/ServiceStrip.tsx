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
            className="text-[12px] sm:text-[14px] font-semibold tracking-[1px] text-[#475467] uppercase"
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}
