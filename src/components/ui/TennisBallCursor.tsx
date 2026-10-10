"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Custom Tennis Ball Cursor for Leets Sports public marketing pages.
 *
 * Requirements:
 * - Real transparent PNG at /images/leets-cursor.png (trimmed).
 * - 28px default size, 36px on interactive elements with subtle navy outline.
 * - Center strictly aligned with pointer coordinates (0 position lag).
 * - Gentle rotation according to horizontal movement.
 * - Restrained squash/compression on pointerdown.
 * - Enabled only on fine pointer & hover capable devices.
 * - Disabled on mobile/touch and prefers-reduced-motion.
 * - Excludes CRM dashboards, booking forms, auth, and text inputs.
 */
export function TennisBallCursor() {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);

  // Check if current route is a public marketing page
  const isExcludedRoute =
    !pathname ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/leads") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/bookings") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/access-control") ||
    pathname.startsWith("/loyalty") ||
    pathname.startsWith("/marketplace") ||
    pathname.startsWith("/auth") ||
    pathname === "/classes/book-court";

  useEffect(() => {
    // If excluded route, do not activate
    if (isExcludedRoute) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }

    // Check device capabilities and motion preference
    const finePointerMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointerMq.matches || reducedMotionMq.matches) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }

    let isMounted = true;
    let isImageReady = false;
    let isVisible = false;
    let isHoveringInteractive = false;
    let isPressed = false;
    let isOverTextInput = false;

    // Direct mouse coordinates (zero lag)
    let mouseX = -100;
    let mouseY = -100;
    let lastX = -100;
    let currentRotation = 0;
    let targetRotation = 0;

    let rafId: number | null = null;

    // Preload cursor image before hiding native cursor
    const img = new Image();
    img.src = "/images/leets-cursor.png";
    img.onload = () => {
      if (!isMounted) return;
      isImageReady = true;
      if (finePointerMq.matches && !reducedMotionMq.matches) {
        document.documentElement.classList.add("has-custom-cursor");
      }
    };
    img.onerror = () => {
      // Restore native cursor immediately on asset failure
      document.documentElement.classList.remove("has-custom-cursor");
    };

    // Animation loop for smooth tilt damping & instantaneous 1:1 translation
    const updateCursor = () => {
      if (!cursorRef.current || !ballRef.current) return;

      if (!isImageReady || !isVisible || isOverTextInput) {
        cursorRef.current.style.opacity = "0";
      } else {
        cursorRef.current.style.opacity = "1";

        // Translate cursor wrapper strictly 1:1 to pointer coordinates (centered)
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

        // Smoothly decay rotational tilt toward neutral
        currentRotation += (targetRotation - currentRotation) * 0.15;
        targetRotation *= 0.88; // decay impulse

        // Scale: default ~1 (28px base), ~1.28 on hover (36px / 28px = 1.285)
        // Compression on press: multiply by 0.88
        const baseScale = isHoveringInteractive ? 1.285 : 1.0;
        const pressScale = isPressed ? 0.88 : 1.0;
        const finalScale = baseScale * pressScale;

        ballRef.current.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg) scale(${finalScale})`;

        // Visual styling for hover: subtle navy outline/drop shadow
        if (isHoveringInteractive) {
          ballRef.current.style.filter =
            "drop-shadow(0 0 1px #172D4D) drop-shadow(0 4px 10px rgba(23, 45, 77, 0.45))";
        } else {
          ballRef.current.style.filter =
            "drop-shadow(0 2px 5px rgba(17, 31, 53, 0.25))";
        }
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    // Pointer movement handler
    const onPointerMove = (e: PointerEvent) => {
      // Ignore touch / pen pointers
      if (e.pointerType && e.pointerType !== "mouse") return;

      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;

      // Calculate horizontal velocity for gentle rotational tilt
      if (lastX !== -100) {
        const deltaX = mouseX - lastX;
        // Restrain rotation to maximum ±25 degrees
        targetRotation = Math.max(-25, Math.min(25, deltaX * 1.8));
      }
      lastX = mouseX;

      // Inspect target element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect text inputs / editable content
      const textInput = target.closest(
        'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"], select'
      );
      isOverTextInput = !!textInput;

      // Detect disabled elements
      const isDisabled = target.closest(':disabled, [aria-disabled="true"]');

      // Detect interactive elements (links, buttons, interactive parents)
      const interactive = target.closest(
        'a, button, [role="button"], input[type="submit"], input[type="button"], label, select, summary, [data-cursor-interactive]'
      );

      isHoveringInteractive = !!interactive && !isDisabled && !isOverTextInput;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      isPressed = true;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      isPressed = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
      lastX = -100;
    };

    const onMouseEnter = () => {
      isVisible = true;
    };

    const onWindowBlur = () => {
      isVisible = false;
      isPressed = false;
      lastX = -100;
    };

    const onWindowFocus = () => {
      isVisible = true;
    };

    // Attach listeners
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("focus", onWindowFocus);

    rafId = requestAnimationFrame(updateCursor);

    // Media query change listeners
    const onMqChange = () => {
      if (!finePointerMq.matches || reducedMotionMq.matches) {
        document.documentElement.classList.remove("has-custom-cursor");
      } else if (isImageReady) {
        document.documentElement.classList.add("has-custom-cursor");
      }
    };
    finePointerMq.addEventListener("change", onMqChange);
    reducedMotionMq.addEventListener("change", onMqChange);

    return () => {
      isMounted = false;
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focus", onWindowFocus);
      finePointerMq.removeEventListener("change", onMqChange);
      reducedMotionMq.removeEventListener("change", onMqChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isExcludedRoute]);

  if (isExcludedRoute) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[999999] opacity-0 transition-opacity duration-150 ease-out will-change-transform"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ballRef}
        src="/images/leets-cursor.png"
        alt=""
        width={28}
        height={28}
        draggable={false}
        className="block select-none will-change-transform"
        style={{
          width: "28px",
          height: "28px",
          transformOrigin: "center center",
          transition: "filter 0.2s ease, transform 0.08s ease-out",
        }}
      />
    </div>
  );
}

export default TennisBallCursor;
