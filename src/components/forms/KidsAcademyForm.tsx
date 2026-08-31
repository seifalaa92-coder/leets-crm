"use client";

import { useState } from "react";

const AGES = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];
const GENDERS = ["Boy", "Girl"];
const EXPERIENCE = ["Never played", "Played a little", "Plays regularly"];
const DAYS = ["Weekdays", "Weekends", "Either"];
const TIMES = ["2:00 PM – 3:00 PM", "3:00 PM – 4:00 PM", "4:00 PM – 5:00 PM", "5:00 PM – 6:00 PM"];

const EMPTY = {
  childName: "",
  age: "",
  gender: "",
  parentName: "",
  whatsapp: "",
  email: "",
  experience: "",
  days: "",
  time: "",
  website: "",
};

type Form = typeof EMPTY;

const field =
  "w-full min-h-[48px] rounded-lg border border-white/15 bg-white/[0.04] px-4 text-[16px] text-white " +
  "outline-none transition-colors duration-100 placeholder:text-white/35 focus:border-[#EA553B]";
const labelClass = "mb-2 block text-sm font-medium text-white/80";

interface SelectProps {
  name: keyof Form;
  label: string;
  options: string[];
  placeholder: string;
  value: string;
  error?: string;
  onChange: (key: keyof Form, value: string) => void;
}

function Select({ name, label, options, placeholder, value, error, onChange }: SelectProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={field}
      >
        <option value="" className="bg-[#0F172A]">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0F172A]">
            {o}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function KidsAcademyForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");
  const [done, setDone] = useState(false);

  function set(key: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setFailure("");
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Form, string>> = {};
    if (form.childName.trim().length < 2) next.childName = "Please enter your child's name";
    if (!form.age) next.age = "Please choose an age";
    if (!form.gender) next.gender = "Please choose one";
    if (form.parentName.trim().length < 2) next.parentName = "Please enter your name";
    if (form.whatsapp.trim().length < 8) next.whatsapp = "Please enter a valid number";
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      next.email = "That email doesn't look right";
    if (!form.experience) next.experience = "Please choose one";
    if (!form.days) next.days = "Please choose one";
    if (!form.time) next.time = "Please choose one";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setFailure("");
    try {
      const res = await fetch("/api/kids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "We could not save your registration. Please try again.");
      }
      setDone(true);
    } catch (err) {
      // Deliberately keep every entered value so one tap retries.
      setFailure(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[#EA553B]/30 bg-white/[0.04] p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EA553B] text-2xl">
          ✓
        </div>
        <h2 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl font-bold uppercase tracking-tight text-white">
          Thanks, {form.parentName.trim().split(" ")[0]}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/70">
          We&apos;ve got {form.childName.trim().split(" ")[0]}&apos;s details. Our team will message
          you on WhatsApp shortly to arrange a first session.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="grid gap-5">
        <div>
          <label className={labelClass} htmlFor="childName">
            Child&apos;s full name
          </label>
          <input
            id="childName"
            name="childName"
            value={form.childName}
            onChange={(e) => set("childName", e.target.value)}
            className={field}
            placeholder="Omar Hassan"
          />
          {errors.childName && <p className="mt-1.5 text-xs text-red-400">{errors.childName}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Select name="age" label="Age" options={AGES} placeholder="Select age" value={form.age} error={errors.age} onChange={set} />
          <Select name="gender" label="Boy or girl" options={GENDERS} placeholder="Select" value={form.gender} error={errors.gender} onChange={set} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="parentName">
              Your name
            </label>
            <input
              id="parentName"
              name="parentName"
              value={form.parentName}
              onChange={(e) => set("parentName", e.target.value)}
              className={field}
              placeholder="Hassan Ali"
            />
            {errors.parentName && <p className="mt-1.5 text-xs text-red-400">{errors.parentName}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="whatsapp">
              WhatsApp number
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
              className={field}
              placeholder="+20 100 123 4567"
            />
            {errors.whatsapp && <p className="mt-1.5 text-xs text-red-400">{errors.whatsapp}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            Email <span className="text-white/40">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={field}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
        </div>

        <Select
          name="experience"
          label="Has your child played padel before?"
          options={EXPERIENCE}
          placeholder="Select"
          value={form.experience}
          error={errors.experience}
          onChange={set}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Select name="days" label="Preferred days" options={DAYS} placeholder="Select" value={form.days} error={errors.days} onChange={set} />
          <Select name="time" label="Preferred time" options={TIMES} placeholder="Select" value={form.time} error={errors.time} onChange={set} />
        </div>

        {/* Honeypot - hidden from people, irresistible to bots. */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>

        {failure && (
          <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {failure}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="min-h-[52px] w-full rounded-lg bg-[#EA553B] font-[family-name:var(--font-display,'Barlow_Condensed')] text-base font-bold uppercase tracking-wide text-white shadow-[0_4px_24px_rgba(234,85,59,0.35)] transition-[background-color,transform,box-shadow] duration-100 hover:bg-[#FF6B4F] active:scale-[0.98] active:bg-[#D14028] disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Register my child"}
        </button>

        <p className="text-center text-xs text-white/50">
          We&apos;ll only use these details to contact you about the academy.
        </p>
      </div>
    </form>
  );
}
