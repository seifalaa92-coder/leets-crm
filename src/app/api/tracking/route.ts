import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

// Helper to parse user agent
function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  return {
    deviceType: parser.getDevice().type || "desktop",
    browser: parser.getBrowser().name || "Unknown",
    browserVersion: parser.getBrowser().version || "",
    os: parser.getOS().name || "Unknown",
    osVersion: parser.getOS().version || "",
  };
}

// Helper to generate session ID
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// POST /api/tracking - Track a page visit
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const headersList = await headers();
    
    // Get visitor data from request
    const body = await request.json();
    const {
      pageUrl,
      pageTitle,
      referrer,
      sessionId: existingSessionId,
      scrollDepth = 0,
      duration = 0,
      utmParams = {},
    } = body;

    // Get IP and user agent from headers
    const forwardedFor = headersList.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : headersList.get("x-real-ip");
    const userAgent = headersList.get("user-agent") || "";
    
    // Parse user agent
    const deviceInfo = parseUserAgent(userAgent);
    
    // Generate or use existing session ID
    const sessionId = existingSessionId || generateSessionId();
    
    // Check if this is a unique visit (no visits in last 30 minutes from same session)
    const { data: recentVisits } = await supabase
      .from("visitor_tracking")
      .select("id")
      .eq("session_id", sessionId)
      .gte("created_at", new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .limit(1);
    
    const isUniqueVisit = !recentVisits || recentVisits.length === 0;
    
    // Insert tracking record
    const { data, error } = await supabase
      .from("visitor_tracking")
      .insert({
        session_id: sessionId,
        ip_address: ipAddress,
        user_agent: userAgent,
        page_url: pageUrl,
        page_title: pageTitle,
        referrer: referrer,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        browser_version: deviceInfo.browserVersion,
        os: deviceInfo.os,
        os_version: deviceInfo.osVersion,
        scroll_depth: scrollDepth,
        duration_seconds: duration,
        is_unique_visit: isUniqueVisit,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_content: utmParams.utm_content,
        utm_term: utmParams.utm_term,
      })
      .select()
      .single();

    if (error) {
      console.error("Error tracking visit:", error);
      return NextResponse.json(
        { error: "Failed to track visit" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId,
      trackingId: data.id,
    });
  } catch (error) {
    console.error("Error in tracking API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/tracking - Update visit duration/exit
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { trackingId, duration, scrollDepth, exitedAt } = body;

    const updates: any = {};
    if (duration !== undefined) updates.duration_seconds = duration;
    if (scrollDepth !== undefined) updates.scroll_depth = scrollDepth;
    if (exitedAt) updates.exited_at = exitedAt;

    const { error } = await supabase
      .from("visitor_tracking")
      .update(updates)
      .eq("id", trackingId);

    if (error) {
      console.error("Error updating tracking:", error);
      return NextResponse.json(
        { error: "Failed to update tracking" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in tracking PATCH:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
