# Kids Academy Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/kids`, a mobile-first landing page whose form writes each submission as a row in a Google Sheet.

**Architecture:** Client form → `POST /api/kids` (zod validation, honeypot check) → Google Apps Script web app → Sheet row. The Apps Script URL and shared secret live in Vercel environment variables and are read server-side only, so neither reaches the browser bundle.

**Tech Stack:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS 3, zod 4. No new dependencies.

## Global Constraints

- **No new npm packages.** zod is already a dependency; everything else is stdlib or existing.
- **Payload contract.** The form, the API route and the Apps Script must agree on exactly these keys: `childName`, `age`, `gender`, `parentName`, `whatsapp`, `email`, `experience`, `days`, `time`, `website` (honeypot), `token` (added server-side only).
- **Exact option strings**, because they are written verbatim into Sheet cells:
  - `gender`: `Boy` | `Girl`
  - `experience`: `Never played` | `Played a little` | `Plays regularly`
  - `days`: `Weekdays` | `Weekends` | `Either`
  - `time`: `Morning` | `Afternoon` | `Evening`
  - `age`: string, `5` through `13`
- **Email is optional.** Every other field is required.
- **Env vars:** `KIDS_SHEET_WEBHOOK_URL`, `KIDS_SHEET_SECRET`. Both server-side; never prefix with `NEXT_PUBLIC_`.
- **Styling:** match the existing dark theme — background `#0F172A`, accent `#EA553B`, display font via `font-[family-name:var(--font-display,'Barlow_Condensed')]`.
- **Touch targets:** minimum 48px on every control; every control needs an `active:` state. Do not regress the Apple-design pass.

## Testing Note

This repo has no test framework, no test runner and no existing test files. Rather than introduce one for a single landing page, each task verifies through `npx tsc --noEmit`, `curl` against the local dev server asserting exact HTTP status codes, and DOM assertions in the browser. Every verification step states the exact command and the exact expected output.

## File Structure

| Path | Responsibility |
|---|---|
| `src/app/api/kids/route.ts` | Validate submission, reject bots, forward to Apps Script, report honest failure |
| `src/components/forms/KidsAcademyForm.tsx` | Client form: fields, inline validation, submit, error and thank-you states |
| `src/app/kids/page.tsx` | Server component: metadata, hero, proof points, mounts the form |
| `src/components/leets/SiteHeader.tsx` | Modify: add `/kids` to the `NAV` array |

---

### Task 1: API route

**Files:**
- Create: `src/app/api/kids/route.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `POST /api/kids`. Request body is the payload contract above minus `token`. Responses: `200 {ok:true}`, `400 {error, details?}`, `502 {error}`.

- [ ] **Step 1: Create the route**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const submissionSchema = z.object({
  childName: z.string().trim().min(2, "Child's name is required"),
  age: z.string().regex(/^(5|6|7|8|9|10|11|12|13)$/, "Age must be between 5 and 13"),
  gender: z.enum(["Boy", "Girl"]),
  parentName: z.string().trim().min(2, "Parent's name is required"),
  whatsapp: z.string().trim().min(8, "A valid WhatsApp number is required"),
  email: z.union([z.string().trim().email(), z.literal("")]).optional(),
  experience: z.enum(["Never played", "Played a little", "Plays regularly"]),
  days: z.enum(["Weekdays", "Weekends", "Either"]),
  time: z.enum(["Morning", "Afternoon", "Evening"]),
  website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot: real people never fill a hidden field. Report success so bots
  // do not learn they were caught, but write nothing.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const url = process.env.KIDS_SHEET_WEBHOOK_URL;
  const secret = process.env.KIDS_SHEET_SECRET;

  if (!url || !secret) {
    console.error("Kids signup not saved - env vars missing. Payload:", JSON.stringify(data));
    return NextResponse.json(
      { error: "Registration is temporarily unavailable. Please try again shortly." },
      { status: 502 }
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, token: secret }),
      redirect: "follow",
    });

    const text = await res.text();
    if (!res.ok || !text.includes('"ok":true')) {
      console.error(
        "Kids signup not saved - sheet rejected it. Payload:",
        JSON.stringify(data),
        "Response:",
        text
      );
      return NextResponse.json(
        { error: "We could not save your registration. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      "Kids signup not saved - request failed. Payload:",
      JSON.stringify(data),
      "Error:",
      err
    );
    return NextResponse.json(
      { error: "We could not save your registration. Please try again." },
      { status: 502 }
    );
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

- [ ] **Step 3: Start the dev server** (skip if already running)

Use `preview_start` with the `leets-site` config. Note the assigned port; `PORT` below stands for it.

- [ ] **Step 4: Verify a malformed payload is rejected**

Run:
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:PORT/api/kids -H "Content-Type: application/json" -d '{"childName":"A"}'
```
Expected: `400`

- [ ] **Step 5: Verify an out-of-range age is rejected**

Run:
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:PORT/api/kids -H "Content-Type: application/json" -d '{"childName":"Omar Hassan","age":"14","gender":"Boy","parentName":"Hassan Ali","whatsapp":"+201001234567","experience":"Never played","days":"Weekends","time":"Morning"}'
```
Expected: `400` — 14 is outside 5–13.

- [ ] **Step 6: Verify the honeypot silently absorbs bots**

Run:
```bash
curl -s -X POST http://localhost:PORT/api/kids -H "Content-Type: application/json" -d '{"childName":"Bot Name","age":"9","gender":"Boy","parentName":"Bot Parent","whatsapp":"+201001234567","experience":"Never played","days":"Either","time":"Morning","website":"http://spam.example"}'
```
Expected: `{"ok":true}` and nothing logged about a missing sheet — it returned before reaching the env check.

- [ ] **Step 7: Verify a valid payload fails loudly when env vars are absent**

Run:
```bash
curl -s -w "\n%{http_code}\n" -X POST http://localhost:PORT/api/kids -H "Content-Type: application/json" -d '{"childName":"Omar Hassan","age":"9","gender":"Boy","parentName":"Hassan Ali","whatsapp":"+201001234567","email":"","experience":"Never played","days":"Weekends","time":"Morning"}'
```
Expected: body contains `temporarily unavailable`, status `502`. Then check `preview_logs` and confirm the full payload was logged — this is the recovery path for lost leads.

- [ ] **Step 8: Commit**

```bash
git add src/app/api/kids/route.ts
git commit -m "feat: add /api/kids submission endpoint"
```

---

### Task 2: The form component

**Files:**
- Create: `src/components/forms/KidsAcademyForm.tsx`

**Interfaces:**
- Consumes: `POST /api/kids` from Task 1.
- Produces: default export `KidsAcademyForm`, a client component taking no props. Task 3 mounts it as `<KidsAcademyForm />`.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";

const AGES = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];
const GENDERS = ["Boy", "Girl"];
const EXPERIENCE = ["Never played", "Played a little", "Plays regularly"];
const DAYS = ["Weekdays", "Weekends", "Either"];
const TIMES = ["Morning", "Afternoon", "Evening"];

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

  const Select = ({
    name,
    label,
    options,
    placeholder,
  }: {
    name: keyof Form;
    label: string;
    options: string[];
    placeholder: string;
  }) => (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={form[name]}
        onChange={(e) => set(name, e.target.value)}
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
      {errors[name] && <p className="mt-1.5 text-xs text-red-400">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
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
          <Select name="age" label="Age" options={AGES} placeholder="Select age" />
          <Select name="gender" label="Boy or girl" options={GENDERS} placeholder="Select" />
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
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Select name="days" label="Preferred days" options={DAYS} placeholder="Select" />
          <Select name="time" label="Preferred time" options={TIMES} placeholder="Select" />
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/forms/KidsAcademyForm.tsx
git commit -m "feat: add kids academy registration form"
```

---

### Task 3: The landing page

**Files:**
- Create: `src/app/kids/page.tsx`

**Interfaces:**
- Consumes: `KidsAcademyForm` (Task 2), plus `SiteHeader` / `SiteFooter` from `@/components/leets/Shell` and `ABOUT_STATS` from `@/data/company`.
- Produces: the route `/kids`.

- [ ] **Step 1: Confirm the proof-point data exists**

Run: `grep -n "ABOUT_STATS" -A 6 src/data/company.ts`
Expected: an array of `{ value, label }` entries including `2019`, `4`, `600+`, `1st`. This task renders the first three.

- [ ] **Step 2: Create the page**

```tsx
import { SiteHeader, SiteFooter } from "@/components/leets/Shell";
import { ABOUT_STATS } from "@/data/company";
import KidsAcademyForm from "@/components/forms/KidsAcademyForm";

export const metadata = {
  title: "Kids Academy",
  description:
    "Register your child for the Leets Sports padel academy - coaching for ages 5 to 13 from the first certified padel academy in the region.",
};

export default function KidsPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#EA553B]">
          Ages 5 to 13
        </p>
        <h1 className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-5xl font-bold uppercase leading-[0.95] tracking-[-0.01em] [font-optical-sizing:auto] md:text-6xl md:tracking-[-0.025em]">
          Your child&apos;s first
          <br />
          <span className="text-[#EA553B]">padel racket</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/75">
          Coaching built for kids - small groups, proper technique, and a court they look
          forward to. Tell us about your child and our team will arrange a first session.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-6 border-y border-[#EA553B]/20 py-6">
          {ABOUT_STATS.slice(0, 3).map((s) => (
            <div key={s.label}>
              <p className="font-[family-name:var(--font-display,'Barlow_Condensed')] text-3xl font-bold text-[#EA553B]">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <KidsAcademyForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: exits 0, no output.

- [ ] **Step 4: Verify the page renders**

Run: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:PORT/kids`
Expected: `200`

Then in the browser at `http://localhost:PORT/kids`:
```javascript
JSON.stringify({
  h1: document.querySelector('h1').innerText,
  fields: document.querySelectorAll('form input, form select').length,
  ages: [...document.querySelectorAll('#age option')].map(o => o.value).filter(Boolean),
  submitHeight: Math.round(document.querySelector('button[type=submit]').getBoundingClientRect().height),
  title: document.title
})
```
Expected: `fields` is `11` (5 inputs including the honeypot, 6 selects), `ages` is exactly `["5","6","7","8","9","10","11","12","13"]`, `submitHeight` at least `52`, `title` is `Kids Academy | Leets Sports`.

- [ ] **Step 5: Verify the honeypot is invisible to people**

```javascript
JSON.stringify({ offsetLeft: document.querySelector('#website').offsetLeft, visible: document.querySelector('#website').offsetParent !== null })
```
Expected: `offsetLeft` is a large negative number - the field is off-screen rather than `display:none`, so bots still fill it.

- [ ] **Step 6: Verify empty submission blocks with inline errors**

Click submit without filling anything, then:
```javascript
JSON.stringify([...document.querySelectorAll('p.text-red-400')].map(p => p.innerText))
```
Expected: 8 messages - one per required field, none for email.

- [ ] **Step 7: Commit**

```bash
git add src/app/kids/page.tsx
git commit -m "feat: add /kids landing page"
```

---

### Task 4: Nav link

**Files:**
- Modify: `src/components/leets/SiteHeader.tsx` - the `NAV` array near the top

**Interfaces:**
- Consumes: the `/kids` route from Task 3.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Add the entry**

Change the `NAV` array to:

```tsx
const NAV = [
  { href: "/", label: "Home" },
  { href: "/clubs", label: "Clubs" },
  { href: "/company", label: "Company" },
  { href: "/kids", label: "Kids Academy" },
  { href: "/classes/book-court", label: "Book a Court" },
];
```

- [ ] **Step 2: Verify it appears in both navs**

Desktop, browser at 1280px wide on `/`:
```javascript
JSON.stringify([...document.querySelectorAll('header nav a')].map(a => a.innerText.trim()))
```
Expected: includes `Kids Academy`.

Mobile: resize to 375px, click `button[aria-controls="mobile-nav"]`, wait 600ms, then:
```javascript
JSON.stringify([...document.querySelectorAll('#mobile-nav a')].map(a => a.innerText.trim() + ' ' + Math.round(a.getBoundingClientRect().height) + 'px'))
```
Expected: six entries, `Kids Academy` among them, each `48px`.

- [ ] **Step 3: Commit**

```bash
git add src/components/leets/SiteHeader.tsx
git commit -m "feat: link Kids Academy in site nav"
```

---

### Task 5: Build and ship

**Files:** none changed.

- [ ] **Step 1: Production build**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder npx next build
```
Expected: exits 0, with `/kids` and `/api/kids` both in the route table. The placeholder Supabase vars are needed because unrelated auth pages prerender at build time; this feature does not use them.

- [ ] **Step 2: Push a branch and open a PR**

```bash
git push -u origin kids-landing-page
```
Then create and merge the PR through GitHub in the user's Chrome - see the `leets-sports-site-edits` memory. Wait for Vercel's checks to pass before merging.

- [ ] **Step 3: Verify on production**

Against `https://www.leetssports.com/kids`:
```javascript
JSON.stringify({
  ages: [...document.querySelectorAll('#age option')].map(o => o.value).filter(Boolean),
  navHasKids: [...document.querySelectorAll('header a')].some(a => a.innerText.includes('Kids'))
})
```
Expected: ages `5` through `13`, `navHasKids` true.

- [ ] **Step 4: End-to-end check once the env vars are set**

Submit the form on production with a test child name such as `TEST - delete me`. Confirm a row appears in the Google Sheet with all ten columns populated and a sensible timestamp, then delete the test row.

**This step cannot pass until the user has completed the Apps Script deployment and added `KIDS_SHEET_WEBHOOK_URL` and `KIDS_SHEET_SECRET` in Vercel.** Until then the form correctly returns 502 and shows its error state.
