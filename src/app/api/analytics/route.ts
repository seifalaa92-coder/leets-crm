import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/analytics - Get analytics data
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
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get visitor stats
    const { data: visitorStats, error: visitorError } = await supabase
      .from("visitor_tracking")
      .select("*")
      .gte("created_at", startDate.toISOString());

    if (visitorError) {
      console.error("Error fetching visitor stats:", visitorError);
      return NextResponse.json(
        { error: "Failed to fetch analytics" },
        { status: 500 }
      );
    }

    // Get lead stats
    const { data: leadStats, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .gte("created_at", startDate.toISOString());

    if (leadError) {
      console.error("Error fetching lead stats:", leadError);
      return NextResponse.json(
        { error: "Failed to fetch analytics" },
        { status: 500 }
      );
    }

    // Calculate metrics
    const totalVisits = visitorStats?.length || 0;
    const uniqueVisitors = new Set(visitorStats?.map(v => v.session_id)).size;
    const totalLeads = leadStats?.length || 0;
    const convertedLeads = leadStats?.filter(l => l.status === "converted").length || 0;
    const conversionRate = totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;

    // Get leads by source
    const leadsBySource = leadStats?.reduce((acc, lead) => {
      const source = lead.source || "direct";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get leads by status
    const leadsByStatus = leadStats?.reduce((acc, lead) => {
      const status = lead.status || "new";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get leads by interest type
    const leadsByInterest = leadStats?.reduce((acc, lead) => {
      const interest = lead.interest_type || "general";
      acc[interest] = (acc[interest] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get daily stats for chart
    const dailyStats = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const dayVisits = visitorStats?.filter(v => 
        v.created_at.startsWith(dateStr)
      ).length || 0;
      
      const dayLeads = leadStats?.filter(l => 
        l.created_at.startsWith(dateStr)
      ).length || 0;
      
      dailyStats.push({
        date: dateStr,
        visits: dayVisits,
        leads: dayLeads,
      });
    }

    // Get device breakdown
    const deviceBreakdown = visitorStats?.reduce((acc, visit) => {
      const device = visit.device_type || "unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get browser breakdown
    const browserBreakdown = visitorStats?.reduce((acc, visit) => {
      const browser = visit.browser || "unknown";
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return NextResponse.json({
      summary: {
        totalVisits,
        uniqueVisitors,
        totalLeads,
        convertedLeads,
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        avgTimeToConversion: 0, // Calculate from leads data
      },
      leadsBySource,
      leadsByStatus,
      leadsByInterest,
      dailyStats,
      deviceBreakdown,
      browserBreakdown,
    });
  } catch (error) {
    console.error("Error in analytics API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
