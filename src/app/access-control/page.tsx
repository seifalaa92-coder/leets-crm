/**
 * QR Scanner Page
 * 
 * For staff to scan member QR codes for access control.
 */

"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ScanResult {
  success: boolean;
  message: string;
  clientName?: string;
  membershipType?: string;
  accessType: "entry" | "exit";
}

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [accessType, setAccessType] = useState<"entry" | "exit">("entry");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const supabase = createClient();

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setScanResult(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setScanResult({
        success: false,
        message: "Could not access camera. Please check permissions.",
        accessType,
      });
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleScan = async (qrData: string) => {
    try {
      const parsed = JSON.parse(qrData);
      
      // Validate QR code
      if (!parsed.clientId || !parsed.expiresAt) {
        throw new Error("Invalid QR code");
      }

      // Check if QR code is expired
      if (new Date(parsed.expiresAt) < new Date()) {
        setScanResult({
          success: false,
          message: "QR code has expired",
          accessType,
        });
        return;
      }

      // Get client details
      const { data: client } = await supabase
        .from("clients")
        .select(`
          id,
          first_name,
          last_name,
          current_membership_id,
          memberships:memberships!current_membership_id(status, tier:membership_tiers(name))
        `)
        .eq("id", parsed.clientId)
        .single();

      if (!client) {
        setScanResult({
          success: false,
          message: "Client not found",
          accessType,
        });
        return;
      }

      // Check membership status
      const membership = client.memberships;
      if (!membership || membership.status !== "active") {
        setScanResult({
          success: false,
          message: `Membership ${membership?.status || "inactive"}`,
          clientName: `${client.first_name} ${client.last_name}`,
          accessType,
        });
        return;
      }

      // Log access
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("access_logs").insert({
        client_id: client.id,
        qr_code_id: parsed.clientId,
        access_type: accessType,
        status: "granted",
        scanned_by: user?.id,
        scanned_at: new Date().toISOString(),
      });

      setScanResult({
        success: true,
        message: `${accessType === "entry" ? "Entry" : "Exit"} granted`,
        clientName: `${client.first_name} ${client.last_name}`,
        membershipType: membership.tier?.name,
        accessType,
      });

      // Auto-hide success after 3 seconds
      setTimeout(() => {
        setScanResult(null);
      }, 3000);

    } catch (error) {
      setScanResult({
        success: false,
        message: "Invalid QR code",
        accessType,
      });
    }
  };

  // Simulate scan for demo (in production, use actual QR scanner library)
  const simulateScan = () => {
    const mockQRData = JSON.stringify({
      clientId: "123e4567-e89b-12d3-a456-426614174000",
      userId: "123e4567-e89b-12d3-a456-426614174001",
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });
    handleScan(mockQRData);
    stopScanning();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">QR Code Scanner</h1>

      {/* Access Type Toggle */}
      <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
        <button
          onClick={() => setAccessType("entry")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            accessType === "entry"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Entry Check-in
        </button>
        <button
          onClick={() => setAccessType("exit")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            accessType === "exit"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Exit Check-out
        </button>
      </div>

      {/* Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Scan Member QR Code</span>
            {isScanning && (
              <span className="text-sm font-normal text-gray-500 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
                Scanning...
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Video Feed */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-lg font-medium">Camera Preview</p>
                  <p className="text-sm opacity-75">Point camera at member QR code</p>
                </div>
              </div>
            )}
            
            {/* Scan Overlay */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-primary/50">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {!isScanning ? (
              <Button onClick={startScanning} className="flex-1">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Start Scanner
              </Button>
            ) : (
              <Button variant="outline" onClick={stopScanning} className="flex-1">
                Stop Scanner
              </Button>
            )}
            
            {/* Demo button - remove in production */}
            <Button variant="secondary" onClick={simulateScan}>
              Demo Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scan Result */}
      {scanResult && (
        <div className={`mt-6 p-6 rounded-lg border-2 ${
          scanResult.success 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              scanResult.success ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {scanResult.success ? (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${scanResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {scanResult.message}
              </h3>
              {scanResult.clientName && (
                <p className="text-gray-700 mt-1">
                  <span className="font-medium">Member:</span> {scanResult.clientName}
                </p>
              )}
              {scanResult.membershipType && (
                <p className="text-gray-700">
                  <span className="font-medium">Plan:</span> {scanResult.membershipType}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {scanResult.accessType === "entry" ? "Entry" : "Exit"} logged at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Instructions:</h3>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Select Entry or Exit mode</li>
          <li>Click "Start Scanner" to activate camera</li>
      <li>Ask member to show their QR code from the app</li>
          <li>Hold code within the frame until beep</li>
          <li>Verify member details on screen</li>
        </ol>
      </div>
    </div>
  );
}
