"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A single continuous gold line that begins as a brush stroke and resolves
 * into a treble clef — the one piece of motion on the site.
 */
export function BrandLine({ className }: { className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;

    if (shouldReduceMotion) {
      path.style.strokeDashoffset = "0";
      path.style.opacity = "1";
      return;
    }

    path.style.strokeDashoffset = `${length}`;
    const animation = path.animate(
      [
        { strokeDashoffset: length, opacity: 0 },
        { strokeDashoffset: length, opacity: 1, offset: 0.05 },
        { strokeDashoffset: 0, opacity: 1 },
      ],
      {
        duration: 2800,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        fill: "forwards",
        delay: 500,
      }
    );
    return () => animation.cancel();
  }, [shouldReduceMotion]);

  return (
    <svg
      viewBox="0 0 520 760"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Faint staff — five hairlines */}
      {[300, 330, 360, 390, 420].map((y) => (
        <line
          key={y}
          x1="60"
          y1={y}
          x2="460"
          y2={y}
          stroke="var(--color-plum)"
          strokeWidth="0.75"
          opacity="0.12"
        />
      ))}

      {/* Brush → clef, one line */}
      <path
        ref={pathRef}
        d="M 40 720
           C 90 690, 130 640, 150 580
           C 172 512, 160 470, 200 440
           C 236 412, 300 420, 310 380
           C 322 332, 250 300, 236 260
           C 224 224, 250 190, 276 160
           C 302 130, 318 90, 300 64
           C 282 40, 250 60, 246 100
           C 240 160, 258 240, 268 330
           C 278 420, 290 500, 292 570
           C 294 620, 270 650, 240 640
           C 210 632, 214 596, 246 592"
        stroke="var(--color-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0"
      />

      {/* Terminal — the clef's dot */}
      <circle cx="246" cy="592" r="6" fill="var(--color-plum)" opacity="0.9" />
    </svg>
  );
}
