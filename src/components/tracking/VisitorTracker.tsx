"use client";

import { useEffect, useRef, useCallback } from "react";
import { UAParser } from "ua-parser-js";

interface VisitorTrackerProps {
  pageUrl?: string;
  pageTitle?: string;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem("visitorSessionId");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("visitorSessionId", sessionId);
  }
  return sessionId;
};

// Parse UTM parameters from URL
const getUtmParams = () => {
  if (typeof window === "undefined") return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get("utm_source") || undefined,
    utm_medium: urlParams.get("utm_medium") || undefined,
    utm_campaign: urlParams.get("utm_campaign") || undefined,
    utm_content: urlParams.get("utm_content") || undefined,
    utm_term: urlParams.get("utm_term") || undefined,
  };
};

// Track page visit
const trackVisit = async (pageUrl: string, pageTitle: string) => {
  try {
    const sessionId = getSessionId();
    const utmParams = getUtmParams();
    
    // Get device info using UA Parser
    const parser = new UAParser();
    const device = parser.getDevice();
    const browser = parser.getBrowser();
    const os = parser.getOS();
    
    const response = await fetch("/api/tracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageUrl,
        pageTitle,
        sessionId,
        referrer: document.referrer,
        utmParams,
        deviceType: device.type || "desktop",
        browser: browser.name,
        browserVersion: browser.version,
        os: os.name,
        osVersion: os.version,
      }),
    });

    if (!response.ok) {
      console.error("Failed to track visit");
    }

    return await response.json();
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
};

// Update visit duration on page unload
const updateVisitDuration = async (trackingId: string, duration: number) => {
  try {
    await fetch("/api/tracking", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trackingId,
        duration,
        exitedAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Error updating visit duration:", error);
  }
};

export function VisitorTracker({ pageUrl, pageTitle }: VisitorTrackerProps) {
  const trackingIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);

  // Track scroll depth
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    if (scrollPercent > scrollDepthRef.current) {
      scrollDepthRef.current = scrollPercent;
    }
  }, []);

  // Track page visit on mount
  useEffect(() => {
    const track = async () => {
      const url = pageUrl || window.location.href;
      const title = pageTitle || document.title;
      
      const result = await trackVisit(url, title);
      if (result?.trackingId) {
        trackingIdRef.current = result.trackingId;
        // Store tracking ID in sessionStorage for this page
        sessionStorage.setItem("currentTrackingId", result.trackingId);
      }
    };

    track();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pageUrl, pageTitle, handleScroll]);

  // Update duration on unmount (page navigation)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (trackingIdRef.current) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        // Use sendBeacon for reliable delivery on page unload
        const data = JSON.stringify({
          trackingId: trackingIdRef.current,
          duration,
          scrollDepth: scrollDepthRef.current,
          exitedAt: new Date().toISOString(),
        });
        navigator.sendBeacon("/api/tracking", data);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      
      // Also update on component unmount (for SPA navigation)
      if (trackingIdRef.current) {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        updateVisitDuration(trackingIdRef.current, duration);
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}

// Hook to get session ID for linking with lead form
export const useSessionId = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("visitorSessionId");
};

// Hook to get current tracking ID
export const useTrackingId = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("currentTrackingId");
};
