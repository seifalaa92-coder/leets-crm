/**
 * QR Code Display Component
 * 
 * Shows the member's QR code for access control.
 * QR codes refresh daily for security.
 */

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import QRCode from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyQRCodePage() {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    generateQRCode();
    // Refresh QR code every minute to update expiration time
    const interval = setInterval(generateQRCode, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get client profile
      const { data: client } = await supabase
        .from("clients")
        .select("id, current_membership_id, memberships(status)")
        .eq("user_id", user.id)
        .single();

      if (!client) return;

      // Set membership status
      const membership = client.memberships?.[0];
      setMembershipStatus(membership?.status || "none");

      // Calculate expiration (end of today)
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(23, 59, 59, 999);
      setExpiresAt(midnight);

      // Generate unique QR code data
      const qrData = JSON.stringify({
        clientId: client.id,
        userId: user.id,
        timestamp: now.toISOString(),
        expiresAt: midnight.toISOString(),
      });

      // Generate QR code image
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#FF6B00",
          light: "#FFFFFF",
        },
      });

      setQrDataUrl(dataUrl);

      // Save QR code to database
      await supabase.from("qr_codes").upsert({
        client_id: client.id,
        code: qrData,
        expires_at: midnight.toISOString(),
      }, {
        onConflict: "client_id",
      });

    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeUntilExpiry = () => {
    if (!expiresAt) return "";
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const isActive = membershipStatus === "active";

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Access QR Code</h1>

      <Card className={!isActive ? "opacity-75" : ""}>
        <CardHeader className="text-center">
          <CardTitle>Show this code at the entrance</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {/* QR Code Display */}
          <div className={`relative p-6 rounded-xl ${isActive ? 'bg-white' : 'bg-gray-100'}`}>
            {isLoading ? (
              <div className="w-[300px] h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : qrDataUrl ? (
              <>
                <img 
                  src={qrDataUrl} 
                  alt="Access QR Code" 
                  className={`w-[300px] h-[300px] ${!isActive ? 'grayscale' : ''}`}
                />
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-red-600 font-semibold">Membership Expired</p>
                      <p className="text-sm text-gray-600 mt-1">Please renew to access</p>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Status & Info */}
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isActive ? '✓ Membership Active' : '✗ Membership Inactive'}
              </span>
            </div>
            
            {isActive && expiresAt && (
              <p className="text-sm text-gray-500">
                Code refreshes in: <span className="font-medium text-primary">{getTimeUntilExpiry()}</span>
              </p>
            )}
            
            <p className="text-xs text-gray-400">
              QR code refreshes daily at midnight for security
            </p>
          </div>

          {/* Refresh Button */}
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={generateQRCode}
            isLoading={isLoading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Code
          </Button>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Show this QR code to the front desk staff</li>
          <li>Or scan at the self-service kiosk</li>
          <li>Wait for the green confirmation light</li>
          <li>Enjoy your session!</li>
        </ol>
      </div>
    </div>
  );
}
