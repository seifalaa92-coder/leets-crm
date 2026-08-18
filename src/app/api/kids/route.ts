import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const submissionSchema = z.object({
  childName: z.string().trim().min(2, "Child's name is required").max(100),
  age: z.string().regex(/^(5|6|7|8|9|10|11|12|13)$/, "Age must be between 5 and 13"),
  gender: z.enum(["Boy", "Girl"]),
  parentName: z.string().trim().min(2, "Parent's name is required").max(100),
  whatsapp: z.string().trim().min(8, "A valid WhatsApp number is required").max(30),
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
      { error: "Validation failed" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot: real people never fill a hidden field. Bots get success so they
  // do not learn they were caught. Log the hit so a spike is detectable.
  if (data.website && data.website.length > 0) {
    console.warn("Kids signup honeypot triggered. Payload:", JSON.stringify(data));
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
      signal: AbortSignal.timeout(8000),
    });

    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
    if (!res.ok || !(parsed && typeof parsed === 'object' && (parsed as Record<string, unknown>).ok === true)) {
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
