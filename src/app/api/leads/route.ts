import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for lead submission
const leadSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(8, "Phone number is required"),
  interestType: z.enum(["court_booking", "coaching", "membership", "general"]),
  message: z.string().optional(),
  sessionId: z.string().optional(),
  formLocation: z.string().default("landing_page_modal"),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
  utmParams: z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_content: z.string().optional(),
    utm_term: z.string().optional(),
  }).optional(),
});

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validationResult = leadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if lead with this email already exists (optional - prevent duplicates)
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("email", data.email)
      .eq("status", "new")
      .single();

    if (existingLead) {
      // Update existing lead instead of creating duplicate
      const { error: updateError } = await supabase
        .from("leads")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          interest_type: data.interestType,
          notes: data.message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLead.id);

      if (updateError) {
        console.error("Error updating existing lead:", updateError);
        return NextResponse.json(
          { error: "Failed to update lead" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Lead updated successfully",
        leadId: existingLead.id,
        isUpdate: true,
      });
    }

    // Get visitor tracking data if sessionId provided
    let deviceInfo = {};
    if (data.sessionId) {
      const { data: visitorData } = await supabase
        .from("visitor_tracking")
        .select("device_type, browser, country, city")
        .eq("session_id", data.sessionId)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (visitorData) {
        deviceInfo = {
          device_type: visitorData.device_type,
          browser: visitorData.browser,
          country: visitorData.country,
          city: visitorData.city,
        };
      }
    }

    // Insert new lead
    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        interest_type: data.interestType,
        notes: data.message,
        session_id: data.sessionId,
        form_location: data.formLocation,
        landing_page: data.landingPage,
        referrer: data.referrer,
        utm_source: data.utmParams?.utm_source,
        utm_medium: data.utmParams?.utm_medium,
        utm_campaign: data.utmParams?.utm_campaign,
        utm_content: data.utmParams?.utm_content,
        utm_term: data.utmParams?.utm_term,
        status: "new",
        source: data.utmParams?.utm_source || "website",
        ...deviceInfo,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating lead:", error);
      return NextResponse.json(
        { error: "Failed to create lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead created successfully",
      leadId: lead.id,
      isUpdate: false,
    });
  } catch (error) {
    console.error("Error in leads API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/leads - Get leads (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user has admin/manager role
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["super_admin", "manager", "front_desk"].includes(profile.role)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query
    let query = supabase
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }
    if (source) {
      query = query.eq("source", source);
    }
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data: leads, error, count } = await query;

    if (error) {
      console.error("Error fetching leads:", error);
      return NextResponse.json(
        { error: "Failed to fetch leads" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      leads,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error in leads GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
