"use client";

import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "+201222288617";

const STEPS = [
  { key: "name", question: "What's your name?", placeholder: "Your name", emoji: "👋" },
  { key: "age", question: "How old are you?", placeholder: "Your age", emoji: "🎂" },
  { key: "interest", question: "What are you interested in?", placeholder: "e.g. Padel, Fitness, Yoga", emoji: "🏋️" },
  { key: "phone", question: "What's your WhatsApp number?", placeholder: "e.g. +966 5X XXX XXXX", emoji: "📱" },
];

export default function LeadCaptureWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", age: "", interest: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
  }

  function next() {
    const key = STEPS[step].key;
    const val = form[key as keyof typeof form].trim();
    if (!val) {
      setError("Please fill this in");
      return;
    }
    if (key === "phone" && val.length < 8) {
      setError("Please enter a valid number");
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      submit();
    }
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again!");
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") next();
  }

  const current = STEPS[step];
  const value = form[current.key as keyof typeof form];

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(234,85,59,0.5)} 50%{box-shadow:0 0 0 16px rgba(234,85,59,0)} }
      `}</style>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-[99998] animate-[fadeIn_0.3s_ease-out]" onClick={() => setOpen(false)} />
      )}

      {open && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none" style={{ fontFamily: "'Inter','DM Sans',sans-serif" }}>
          <div className="pointer-events-auto w-full max-w-[420px] max-[480px]:fixed max-[480px]:inset-0 max-[480px]:max-h-full max-[480px]:rounded-none rounded-[20px] bg-[#0F0F0F] border border-[rgba(234,85,59,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-[slideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#222] px-4 py-3.5 border-b border-[rgba(234,85,59,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D14028] to-[#EA553B] flex items-center justify-center text-xl shadow-[0_0_14px_rgba(234,85,59,0.4)] flex-shrink-0">🎾</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#FFF5F3] font-semibold text-[14px] truncate">Leets Sports</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA553B] shadow-[0_0_5px_#EA553B] inline-block" />
                    <span className="text-[#FF8A6F] text-[11px]">Get Started</span>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="ml-auto bg-[rgba(255,255,255,0.06)] border-none text-[#FF8A6F] rounded-lg w-7 h-7 text-lg cursor-pointer flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors">×</button>
              </div>
              {!done && (
                <div className="mt-2 flex gap-1">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-[#EA553B]" : "bg-[rgba(255,255,255,0.08)]"}`} />
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 px-5 py-8 flex flex-col justify-center">
              {!done ? (
                <>
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">{current.emoji}</div>
                    <p className="text-[#FFF5F3] text-lg font-semibold">{current.question}</p>
                  </div>
                  <input
                    value={value}
                    onChange={e => update(current.key, e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={current.placeholder}
                    type={current.key === "age" ? "number" : "text"}
                    className="w-full bg-[rgba(209,64,40,0.1)] border border-[rgba(234,85,59,0.2)] rounded-xl px-4 py-3 text-[15px] text-[#FFE8E4] outline-none transition-[border-color] duration-200 placeholder:text-[#6B2A1A] text-center mb-4"
                    autoFocus
                  />
                  {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}
                  <button
                    onClick={next}
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D14028] to-[#EA553B] text-white font-semibold text-[14px] transition-all disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : step < STEPS.length - 1 ? "Next" : "Send"}
                  </button>
                </>
              ) : (
                /* Success */
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full mx-auto mb-3 bg-gradient-to-br from-[#D14028] to-[#EA553B] flex items-center justify-center text-2xl shadow-[0_0_28px_rgba(234,85,59,0.5)]">✓</div>
                  <h3 className="text-[#FFF5F3] text-[17px] font-bold mb-1">Thanks, {form.name}!</h3>
                  <p className="text-[#FF8A6F] text-xs mb-4 leading-relaxed">
                    We&apos;ll reach out to you soon on WhatsApp to help you get started.
                  </p>
                  <div className="bg-[rgba(209,64,40,0.15)] border border-[rgba(234,85,59,0.25)] rounded-xl px-3.5 py-2.5 mb-4 text-left">
                    {[["👤", "Name", form.name], ["🎂", "Age", form.age], ["🏋️", "Interest", form.interest], ["📱", "Phone", form.phone]].map(([icon, label, val]) => (
                      <div key={label as string} className="flex justify-between text-[11.5px] mb-1 last:mb-0">
                        <span className="text-[#FF6B4F]">{icon} {label as string}</span>
                        <span className="text-[#FFF5F3] font-medium">{val || "—"}</span>
                      </div>
                    ))}
                  </div>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi! I'm ${form.name}, interested in ${form.interest}.`)}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-2.5 px-4 font-semibold text-[13px] mb-2 no-underline hover:opacity-90 transition-opacity"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.997 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.985-1.418A9.945 9.945 0 0011.997 22C17.517 22 22 17.523 22 12S17.517 2 11.997 2zm0 18c-1.68 0-3.25-.46-4.6-1.26l-.33-.196-3.403.968.932-3.374-.214-.347A8 8 0 1120 12a7.997 7.997 0 01-8.003 8z"/></svg>
                    Message us on WhatsApp
                  </a>
                  <button onClick={() => { setDone(false); setOpen(false); }} className="bg-transparent border border-[rgba(255,138,111,0.25)] text-[#FF8A6F] rounded-lg py-1.5 px-4 text-xs cursor-pointer w-full">Close</button>
                </div>
              )}
            </div>

            {!done && (
              <p className="text-center text-[#5B2010] text-[10px] pb-3">We&apos;ll reach out on WhatsApp — no spam</p>
            )}
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[99999] flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#D14028] to-[#EA553B] border border-[rgba(234,85,59,0.4)] shadow-[0_4px_20px_rgba(234,85,59,0.45)] animate-[pulse-ring_2.5s_ease-in-out_infinite]"
          style={{ fontFamily: "'Inter','DM Sans',sans-serif" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          <span className="text-white text-sm font-semibold">Get Started</span>
        </button>
      )}
    </>
  );
}
