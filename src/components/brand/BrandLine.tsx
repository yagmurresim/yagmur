"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export function BrandLine() {
  const pathRef = useRef<SVGPathElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path || shouldReduceMotion) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const animation = path.animate(
      [
        { strokeDashoffset: length, opacity: 0.2 },
        { strokeDashoffset: 0, opacity: 0.7 },
      ],
      {
        duration: 2200,
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        fill: "forwards",
        delay: 400,
      }
    );

    return () => animation.cancel();
  }, [shouldReduceMotion]);

  return (
    <svg
      viewBox="0 0 500 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[480px] max-h-[640px]"
      aria-hidden="true"
    >
      {/* Decorative compositional circles */}
      <circle cx="380" cy="180" r="120" fill="var(--color-lavender)" opacity="0.12" />
      <circle cx="140" cy="520" r="80" fill="var(--color-rose)" opacity="0.08" />

      {/* Brand line — fırçadan müziğe */}
      <path
        ref={pathRef}
        d="M 80 600
           C 120 560, 180 480, 200 400
           C 220 320, 160 280, 200 220
           C 240 160, 340 180, 360 140
           C 380 100, 350 60, 320 80
           C 290 100, 280 160, 300 200
           C 320 240, 380 220, 400 260
           C 420 300, 380 360, 340 380
           C 300 400, 240 380, 220 420
           C 200 460, 240 520, 260 560
           C 280 600, 260 660, 220 680"
        stroke="url(#brandGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Musical staff lines — subtle */}
      {[200, 220, 240, 260, 280].map((y, i) => (
        <line
          key={i}
          x1="300"
          y1={y}
          x2="460"
          y2={y}
          stroke="var(--color-plum)"
          strokeWidth="1"
          opacity="0.08"
        />
      ))}

      {/* Music note dots */}
      <circle cx="340" cy="218" r="5" fill="var(--color-plum)" opacity="0.15" />
      <circle cx="380" cy="232" r="4" fill="var(--color-violet)" opacity="0.12" />
      <circle cx="420" cy="210" r="3.5" fill="var(--color-magenta)" opacity="0.1" />

      {/* Palette dots — painterly feel */}
      <circle cx="160" cy="420" r="8" fill="var(--color-magenta)" opacity="0.15" />
      <circle cx="140" cy="440" r="5" fill="var(--color-rose)" opacity="0.12" />
      <circle cx="180" cy="445" r="4" fill="var(--color-violet)" opacity="0.1" />

      <defs>
        <linearGradient id="brandGradient" x1="80" y1="600" x2="220" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-plum)" />
          <stop offset="50%" stopColor="var(--color-violet)" />
          <stop offset="100%" stopColor="var(--color-magenta)" />
        </linearGradient>
      </defs>
    </svg>
  );
}