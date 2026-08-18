"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // Escape closes, focus returns to the button that opened it, and Tab stays
  // inside the sheet while it's up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;
      const focusable = sheetRef.current.querySelectorAll<HTMLElement>(
        'button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    return () => {
      document.removeEventListener("keydown", onKey);
      (triggerRef.current ?? previouslyFocused)?.focus();
    };
  }, [open]);

  function back() {
    setError("");
    setStep((prev) => Math.max(0, prev - 1));
  }

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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again!";
      setError(msg);
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
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[99998]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            key="sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Get started with Leets Sports"
            // Grows from the button that opened it, and shrinks back the same
            // way. A tap carries no momentum, so the spring doesn't overshoot.
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 24 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 24 }}
            transition={reduceMotion ? { duration: 0.2 } : { type: "spring", bounce: 0, duration: 0.35 }}
            style={{ transformOrigin: "bottom right" }}
            className="pointer-events-auto w-full max-w-[420px] max-[480px]:fixed max-[480px]:inset-0 max-[480px]:max-h-full max-[480px]:rounded-none rounded-[20px] bg-neutral-dark-alt border border-brand/20 shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-neutral-dark-alt to-neutral-dark px-4 py-3.5 border-b border-brand/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center text-xl shadow-[0_0_14px_rgba(234,85,59,0.4)] flex-shrink-0">🎾</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white/95 font-semibold text-[14px] truncate">Leets Sports</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_5px_#EA553B] inline-block" />
                    <span className="text-brand-light text-[11px]">Get Started</span>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="ml-auto bg-white/5 border-none text-brand-light rounded-lg w-11 h-11 text-xl cursor-pointer flex items-center justify-center hover:bg-white/10 active:bg-white/15 active:scale-[0.94] transition-[background-color,transform] duration-100"
                >
                  ×
                </button>
              </div>
              {!done && (
                <div className="mt-2 flex gap-1">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-brand" : "bg-white/10"}`} />
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
                    <p className="text-white/95 text-lg font-semibold">{current.question}</p>
                  </div>
                  <input
                    value={value}
                    onChange={e => update(current.key, e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={current.placeholder}
                    type={current.key === "age" ? "number" : "text"}
                    className="w-full min-h-[48px] bg-brand/10 border border-brand/20 rounded-xl px-4 py-3 text-[16px] text-brand-100 outline-none focus:border-brand transition-colors duration-200 placeholder:text-[#8A4530] text-center mb-4"
                    // No autoFocus on touch — it throws the keyboard up over the
                    // question before the sheet has finished arriving.
                    ref={(el) => {
                      if (el && !window.matchMedia("(pointer: coarse)").matches) el.focus();
                    }}
                  />
                  {error && <p className="text-red-400 text-xs text-center mb-3" role="alert">{error}</p>}
                  <div className="flex gap-2">
                    {step > 0 && (
                      <button
                        onClick={back}
                        disabled={submitting}
                        className="min-h-[48px] px-5 rounded-xl border border-brand/25 text-brand-light font-semibold text-[14px] transition-[background-color,transform] duration-100 hover:bg-brand/10 active:scale-[0.97] active:bg-brand/20 disabled:opacity-50"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={next}
                      disabled={submitting}
                      className="flex-1 min-h-[48px] rounded-xl bg-brand hover:bg-brand-dark text-white font-semibold text-[14px] transition-[background-color,transform] duration-100 active:scale-[0.98] disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : step < STEPS.length - 1 ? "Next" : "Send"}
                    </button>
                  </div>
                </>
              ) : (
                /* Success */
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full mx-auto mb-3 bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center text-2xl shadow-[0_0_28px_rgba(234,85,59,0.5)]">✓</div>
                  <h3 className="text-white/95 text-[17px] font-bold mb-1">Thanks, {form.name}!</h3>
                  <p className="text-brand-light text-xs mb-4 leading-relaxed">
                    We&apos;ll reach out to you soon on WhatsApp to help you get started.
                  </p>
                  <div className="bg-brand/15 border border-brand/25 rounded-xl px-3.5 py-2.5 mb-4 text-left">
                    {[["👤", "Name", form.name], ["🎂", "Age", form.age], ["🏋️", "Interest", form.interest], ["📱", "Phone", form.phone]].map(([icon, label, val]) => (
                      <div key={label as string} className="flex justify-between text-[11.5px] mb-1 last:mb-0">
                        <span className="text-brand-light">{icon} {label as string}</span>
                        <span className="text-white/95 font-medium">{val || "—"}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => { setDone(false); setOpen(false); }}
                    className="bg-transparent border border-brand/25 text-brand-light rounded-lg min-h-[44px] px-4 text-xs cursor-pointer w-full transition-[background-color,transform] duration-100 hover:bg-brand/10 active:scale-[0.98] active:bg-brand/20"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            {!done && (
              <p className="text-center text-[#7A3520] text-[10px] pb-3">We&apos;ll reach out on WhatsApp — no spam</p>
            )}
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {!open && (
        <button
          ref={triggerRef}
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[99999] flex min-h-[48px] items-center gap-2.5 px-4 py-2.5 rounded-full bg-brand hover:bg-brand-dark border border-brand/40 shadow-brand transition-[background-color,box-shadow,transform] duration-100 hover:shadow-brand-lg active:scale-[0.95] active:bg-brand-dark"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          <span className="text-white text-sm font-semibold">Get Started</span>
        </button>
      )}
    </>
  );
}