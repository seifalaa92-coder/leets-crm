# Kids Academy Landing Page — Design

**Date:** 2026-08-18
**Status:** Approved

## Purpose

A standalone landing page at `/kids` that a Leets sales rep sends to a parent over
WhatsApp. The parent fills in one short form and the submission lands as a row in a
Google Sheet the team watches. One link for everyone — no per-rep attribution.

Success = a parent on a phone can complete it in under a minute, and the row appears
in the Sheet.

## Decisions

| Question | Decision |
|---|---|
| Sheet mechanism | Google Apps Script web app, called server-side |
| Storage | Google Sheet only (no Supabase write) |
| Placement | `/kids`, linked in the main nav |
| Attribution | None — single shared link |
| Language | English only |
| After submit | Thank-you state replaces the form, in place |
| Age range | Dropdown, 5 to 13 |
| Email field | Optional (WhatsApp is the real follow-up channel) |

## Architecture

Browser form → `POST /api/kids` (Next.js route) → Apps Script web app → Sheet row.

The Apps Script URL is held in a Vercel environment variable and read only on the
server. It never reaches the client bundle.

**Rejected alternatives:**

- *Browser posts directly to Apps Script.* The endpoint URL would ship in the public
  JS bundle, and CORS prevents the page from reading Google's response — the form
  would have to claim success without knowing the row saved.
- *Next.js Server Action.* Works, but every existing form in this codebase goes
  client → `/api/...` → external service. Matching the established pattern wins.

## Page

Reuses `SiteHeader` and `SiteFooter`. Mobile-first: links arrive via WhatsApp and are
opened on phones. Inherits the mobile nav, 48px targets, press states and Sora
typography from the Apple-design pass.

Sections: hero (headline, one line of copy, three proof points sourced from the real
figures in `src/data/company.ts`), form, footer.

## Form fields

| Group | Field | Type | Required |
|---|---|---|---|
| Child | Full name | text | yes |
| Child | Age | select 5–13 | yes |
| Child | Gender | Boy / Girl | yes |
| Parent | Name | text | yes |
| Parent | WhatsApp number | tel | yes |
| Parent | Email | email | no |
| Fit | Experience | Never played / Played a little / Plays regularly | yes |
| Fit | Preferred days | Weekdays / Weekends / Either | yes |
| Fit | Preferred time | Morning / Afternoon / Evening | yes |

Plus a hidden honeypot field, unlabelled and visually removed, to absorb bots. A
submission with the honeypot filled returns success to the caller and writes nothing.

## Sheet columns

`Timestamp · Child name · Age · Gender · Parent name · WhatsApp · Email · Experience · Preferred days · Preferred time`

## Error handling

Sheet-only storage means there is no second copy, so failures must not silently
swallow leads:

- Validation runs server-side with zod, mirroring `/api/kids-registration`.
- If the Apps Script call fails or returns a non-OK body, `/api/kids` responds 502.
- The form shows an honest error, keeps every entered value, and lets one tap retry.
- The API logs the full submission payload via `console.error`, so a lost row is
  recoverable from Vercel logs.
- A shared secret token accompanies each request; the Apps Script rejects anything
  without it. Necessary because the web app must be deployed as "Anyone can access".

## Apps Script

```javascript
var SECRET = 'REPLACE_WITH_SHARED_SECRET';

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.token !== SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Registrations') || ss.insertSheet('Registrations');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Child name', 'Age', 'Gender', 'Parent name',
                       'WhatsApp', 'Email', 'Experience', 'Preferred days', 'Preferred time']);
    }
    sheet.appendRow([new Date(), body.childName, body.age, body.gender, body.parentName,
                     body.whatsapp, body.email, body.experience, body.days, body.time]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Setup required from the user

1. Create a Google Sheet.
2. Extensions → Apps Script, paste the script above, replace the secret.
3. Deploy → New deployment → Web app. Execute as **Me**, access **Anyone**. Copy the
   `/exec` URL.
4. In Vercel → project → Settings → Environment Variables, add:
   - `KIDS_SHEET_WEBHOOK_URL` — the `/exec` URL
   - `KIDS_SHEET_SECRET` — the same secret string
5. Redeploy so the variables are picked up.

Claude has no access to this Vercel account, so step 4 cannot be automated.

## Files

| Path | Change |
|---|---|
| `src/app/kids/page.tsx` | new — landing page |
| `src/components/forms/KidsAcademyForm.tsx` | new — client form + thank-you state |
| `src/app/api/kids/route.ts` | new — validation and Apps Script call |
| `src/components/leets/SiteHeader.tsx` | edit — add `/kids` to `NAV` |

The orphaned `KidsRegistrationForm.tsx` is left alone; it is a generic coaching
enquiry form, unreferenced, and not what this page needs.

## Out of scope

Per-rep attribution, Arabic, Supabase persistence, email notification, club-location
selection, admin UI for the Sheet.
