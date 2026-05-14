import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
      .from("kids_registrations")
      .insert({
        parent_first_name: data.parentFirstName,
        parent_last_name: data.parentLastName,
        parent_email: data.parentEmail,
        parent_phone: data.parentPhone,
        kid_name: data.kidName,
        kid_age: parseInt(data.kidAge),
        sport_interest: data.sportInterest,
        notes: data.notes || null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating kids registration:", error);
      return NextResponse.json(
        { error: "Failed to create registration" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration created successfully",
      registrationId: registration.id,
    });
  } catch (error) {
    console.error("Error in kids-registration API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
