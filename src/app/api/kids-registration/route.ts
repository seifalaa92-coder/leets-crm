import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const kidsRegistrationSchema = z.object({
  parentFirstName: z.string().min(2, "First name is required"),
  parentLastName: z.string().min(2, "Last name is required"),
  parentEmail: z.string().email("Valid email is required"),
  parentPhone: z.string().min(8, "Phone number is required"),
  kidName: z.string().min(2, "Child name is required"),
  kidAge: z.string().min(1, "Age is required"),
  sportInterest: z.string().min(1, "Sport interest is required"),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const validationResult = kidsRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    const { data: registration, error } = await supabase
      .from("leads")
      .insert({
        first_name: data.parentFirstName,
        last_name: data.parentLastName,
        email: data.parentEmail,
        phone: data.parentPhone,
        interest_type: "kids_registration",
        notes: `Child: ${data.kidName}, Age: ${data.kidAge}, Sport: ${data.sportInterest}${data.notes ? `, Notes: ${data.notes}` : ""}`,
        status: "new",
        source: "kids_registration_form",

      })
      .select()
      .single();

    if (error) {
      console.error("Error creating kids registration:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration created successfully",
      registrationId: registration.id,
    });
  } catch (error: any) {
    console.error("Error in kids-registration API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
