/** True during `next dev`. */
export const isDev = process.env.NODE_ENV === "development";

/**
 * GSAP / Lenis / Three.js animations are disabled in dev by default
 * (they hammer the main thread). Set NEXT_PUBLIC_DEV_ANIMATIONS=true to enable.
 */
export const shouldAnimate =
  !isDev || process.env.NEXT_PUBLIC_DEV_ANIMATIONS === "true";
