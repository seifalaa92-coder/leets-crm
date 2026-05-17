import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, age, interest, phone } = await req.json();

    if (!name || !interest || !phone) {
      return NextResponse.json({ error: "Name, interest, and phone are required" }, { status: 400 });
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase.from("leads").insert({
      first_name: name,
      last_name: "-",
      phone,
      interest_type: interest,
      source: "website",
      status: "new",
      notes: `Age: ${age || "Not provided"}. Captured via website lead widget.`,
    });

    if (error) {
      console.error("Error saving lead:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in lead capture:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
