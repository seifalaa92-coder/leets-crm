"use client";

/**
 * Mobile Device Simulator Component - OPTIMIZED VERSION
 * Allows previewing the CRM in iPhone/iPad frames on desktop
 * Reduced animations for faster loading
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DeviceSimulatorProps {
  children: React.ReactNode;
}

type DeviceType = "iphone14" | "iphone15pro" | "ipad" | "desktop";
type Orientation = "portrait" | "landscape";

const devices = {
  iphone14: {
    name: "iPhone 14",
    width: 393,
    height: 852,
    frameWidth: 420,
    frameHeight: 880,
    borderRadius: 47,
    bezel: 13.5,
    hasNotch: true,
    hasDynamicIsland: false,
  },
  iphone15pro: {
    name: "iPhone 15 Pro",
    width: 393,
    height: 852,
    frameWidth: 420,
    frameHeight: 880,
    borderRadius: 47,
    bezel: 13.5,
    hasNotch: false,
    hasDynamicIsland: true,
  },
  ipad: {
    name: "iPad Pro 11\"",
    width: 834,
    height: 1194,
    frameWidth: 860,
    frameHeight: 1220,
    borderRadius: 25,
    bezel: 13,
    hasNotch: false,
    hasDynamicIsland: false,
  },
  desktop: {
    name: "Desktop",
    width: 0,
    height: 0,
    frameWidth: 0,
    frameHeight: 0,
    borderRadius: 0,
    bezel: 0,
    hasNotch: false,
    hasDynamicIsland: false,
  },
};

export function DeviceSimulator({ children }: DeviceSimulatorProps) {
  // Start with desktop for faster initial load
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [zoom, setZoom] = useState(0.85);
  const [showControls, setShowControls] = useState(true);

  const device = devices[deviceType];
  const isMobile = deviceType !== "desktop";

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "m") {
        e.preventDefault();
        setDeviceType(prev => prev === "desktop" ? "iphone15pro" : "desktop");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "r" && isMobile) {
        e.preventDefault();
        setOrientation(prev => prev === "portrait" ? "landscape" : "portrait");
      }
      if (e.key === "Escape" && isMobile) {
        setDeviceType("desktop");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile]);

  // Zoom controls
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setZoom(1);

  // Current dimensions based on orientation
  const currentWidth = orientation === "portrait" ? device.width : device.height;
  const currentHeight = orientation === "portrait" ? device.height : device.width;
  const currentFrameWidth = orientation === "portrait" ? device.frameWidth : device.frameHeight;
  const currentFrameHeight = orientation === "portrait" ? device.frameHeight : device.frameWidth;

  return (
    <div className="relative">
      {/* Simplified Controls - No heavy animations on initial load */}
      {showControls && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-black/90 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-white/10">
          <div className="flex items-center gap-3">
            {/* Device Selector */}
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value as DeviceType)}
              className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 border border-white/20 focus:outline-none focus:border-[#EA553B]"
            >
              <option value="desktop" className="text-black">Desktop</option>
              <option value="iphone14" className="text-black">iPhone 14</option>
              <option value="iphone15pro" className="text-black">iPhone 15 Pro</option>
              <option value="ipad" className="text-black">iPad Pro 11"</option>
            </select>

            {/* Orientation Toggle */}
            {isMobile && (
              <button
                onClick={() => setOrientation(prev => prev === "portrait" ? "landscape" : "portrait")}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Rotate Device"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* Zoom Controls */}
            {isMobile && (
              <div className="flex items-center gap-1 border-l border-white/20 pl-3">
                <button onClick={zoomOut} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-white text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={zoomIn} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button onClick={resetZoom} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white ml-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            )}

            {/* Close Controls */}
            <button
              onClick={() => setShowControls(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border-l border-white/20 ml-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Show Controls Button (when hidden) */}
      {!showControls && (
        <button
          onClick={() => setShowControls(true)}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#EA553B] hover:bg-[#D14028] text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      )}

      {/* Device Frame Container */}
      {isMobile ? (
        <div 
          className="min-h-screen flex items-center justify-center p-8"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          }}
        >
          {/* Device Frame - Simplified for performance */}
          <div
            className="relative transition-all duration-300"
            style={{
              width: currentFrameWidth,
              height: currentFrameHeight,
              transform: `scale(${zoom})`,
              borderRadius: device.borderRadius,
              boxShadow: `
                0 0 0 12px #1a1a1a,
                0 0 0 14px #333,
                0 25px 50px -12px rgba(0, 0, 0, 0.8)
              `,
            }}
          >
            {/* Device Bezel */}
            <div 
              className="absolute inset-0 rounded-[47px] pointer-events-none"
              style={{
                background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)",
              }}
            />

            {/* Screen Container */}
            <div 
              className="absolute overflow-hidden bg-black"
              style={{
                top: device.bezel,
                left: device.bezel,
                right: device.bezel,
                bottom: device.bezel,
                borderRadius: device.borderRadius - device.bezel,
              }}
            >
              {/* Status Bar */}
              <div className="absolute top-0 left-0 right-0 h-11 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-between px-6 text-white text-sm font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3C7.46 3 3.34 4.78.29 7.67c-.18.18-.29.43-.29.71 0 .28.11.53.29.71l11 11c.39.39 1.02.39 1.41 0l11-11c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71C20.66 4.78 16.54 3 12 3z"/>
                  </svg>
                  <div className="w-5 h-2.5 border border-white/50 rounded-sm relative">
                    <div className="absolute inset-0.5 bg-white rounded-sm" style={{ width: "70%" }} />
                  </div>
                </div>
              </div>

              {/* Dynamic Island */}
              {device.hasDynamicIsland && (
                <div 
                  className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-black rounded-full"
                  style={{ width: 90, height: 28 }}
                />
              )}

              {/* Notch */}
              {device.hasNotch && (
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-black"
                  style={{
                    width: 126,
                    height: 37,
                    borderBottomLeftRadius: 18,
                    borderBottomRightRadius: 18,
                  }}
                />
              )}

              {/* Content Area */}
              <div className="absolute inset-0 pt-11 pb-2 overflow-hidden bg-[#F5F5F5]">
                <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
                  {children}
                </div>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/80 rounded-full z-50" />
            </div>

            {/* Side Buttons */}
            <div className="absolute -left-[2px] top-28 w-[2px] h-8 bg-neutral-700 rounded-l-sm" />
            <div className="absolute -left-[2px] top-40 w-[2px] h-16 bg-neutral-700 rounded-l-sm" />
            <div className="absolute -right-[2px] top-36 w-[2px] h-20 bg-neutral-700 rounded-r-sm" />
          </div>

          {/* Device Label */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm font-body">
            {device.name} — {orientation === "portrait" ? "Portrait" : "Landscape"}
          </div>
        </div>
      ) : (
        // Desktop View - Direct render, no wrapper
        <div className="min-h-screen bg-[#F5F5F5]">
          {children}
        </div>
      )}

      {/* Keyboard Shortcuts Info */}
      <div className="fixed bottom-4 right-4 text-white/40 text-xs font-body hidden lg:block">
        Press <kbd className="bg-white/10 px-2 py-1 rounded">Ctrl/Cmd + M</kbd> to toggle mobile view
      </div>
    </div>
  );
}
