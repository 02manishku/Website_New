'use client';

import { ErrorBoundary } from 'react-error-boundary';
import type { ReactNode } from 'react';

// Silent error boundary. Wraps any component that touches video,
// GSAP / framer-motion, third-party JS, or browser APIs that might
// throw on older or quirky devices (iOS Safari decoder failure,
// IntersectionObserver missing, etc.).
//
// The fallback renders `null` deliberately: a single broken hero
// component must not take down the rest of the page. The user sees a
// quietly-empty slot where the broken thing was; everything else
// keeps working. Top-level catastrophic failure is handled by
// app/error.tsx instead.

export default function SafeBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundary fallbackRender={() => null}>{children}</ErrorBoundary>;
}
