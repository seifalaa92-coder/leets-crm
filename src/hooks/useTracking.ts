import { useState, useEffect, useCallback } from "react";

interface TrackingData {
  sessionId: string | null;
  trackingId: string | null;
}

export function useTracking(): TrackingData {
  const [data, setData] = useState<TrackingData>({
    sessionId: null,
    trackingId: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setData({
        sessionId: localStorage.getItem("visitorSessionId"),
        trackingId: sessionStorage.getItem("currentTrackingId"),
      });
    }
  }, []);

  return data;
}

// Hook to manually trigger tracking (e.g., for SPAs)
export function useTrackPageView() {
  const trackPageView = useCallback(async (pageUrl?: string, pageTitle?: string) => {
    if (typeof window === "undefined") return;

    const url = pageUrl || window.location.href;
    const title = pageTitle || document.title;
    const sessionId = localStorage.getItem("visitorSessionId");

    try {
      const response = await fetch("/api/tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageUrl: url,
          pageTitle: title,
          sessionId,
          referrer: document.referrer,
        }),
      });

      const result = await response.json();
      if (result?.trackingId) {
        sessionStorage.setItem("currentTrackingId", result.trackingId);
      }

      return result;
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  }, []);

  return trackPageView;
}

// Hook to get UTM parameters
export function useUtmParams() {
  const [utmParams, setUtmParams] = useState<{
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  }>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setUtmParams({
        utm_source: urlParams.get("utm_source") || undefined,
        utm_medium: urlParams.get("utm_medium") || undefined,
        utm_campaign: urlParams.get("utm_campaign") || undefined,
        utm_content: urlParams.get("utm_content") || undefined,
        utm_term: urlParams.get("utm_term") || undefined,
      });
    }
  }, []);

  return utmParams;
}
