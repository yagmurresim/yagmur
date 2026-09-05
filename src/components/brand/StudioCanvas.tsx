"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Stamp = { x: number; y: number; w: number; rgb: string; born: number };
type Note = {
  x: number;
  y: number;
  rgb: string;
  born: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  kind: 0 | 1 | 2;
};

const NOTE_LIFE = 1800;
const NOTE_GAP = 56;

const INK = [
  [236, 150, 186],
  [176, 142, 204],
  [164, 210, 230],
  [140, 214, 206],
];

const LIFE = 1400;

function mixInk(travel: number): string {
  const t = (travel / 280) % INK.length;
  const i = Math.floor(t) % INK.length;
  const n = (i + 1) % INK.length;
  const f = t - Math.floor(t);
  const r = INK[i][0] + (INK[n][0] - INK[i][0]) * f;
  const g = INK[i][1] + (INK[n][1] - INK[i][1]) * f;
  const b = INK[i][2] + (INK[n][2] - INK[i][2]) * f;
  return `${r | 0}, ${g | 0}, ${b | 0}`;
}

export function StudioCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let last: { x: number; y: number; w: number; t: number } | null = null;
    let travel = 0;
    let sinceNote = 0;
    let width = 18;
    const trail: Stamp[] = [];
    const notes: Note[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width: cw, height: ch } = canvas.getBoundingClientRect();
      const nextW = Math.max(1, Math.floor(cw * dpr));
      const nextH = Math.max(1, Math.floor(ch * dpr));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnNote = (x: number, y: number, now: number) => {
      notes.push({
        x,
        y,
        rgb: mixInk(travel),
        born: now,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.35 - Math.random() * 0.45,
        rot: (Math.random() - 0.5) * 0.4,
        vr: (Math.random() - 0.5) * 0.012,
        size: 14 + Math.random() * 8,
        kind: ((Math.random() * 3) | 0) as 0 | 1 | 2,
      });
    };

    const drawNote = (n: Note, a: number) => {
      const s = n.size;
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(n.rot);
      ctx.fillStyle = `rgba(${n.rgb}, ${0.72 * a})`;
      ctx.strokeStyle = `rgba(${n.rgb}, ${0.72 * a})`;
      ctx.lineWidth = Math.max(1.2, s * 0.12);
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.38, s * 0.26, -0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(s * 0.32, -s * 0.04);
      ctx.lineTo(s * 0.32, -s * 1.15);
      ctx.stroke();

      if (n.kind > 0) {
        ctx.beginPath();
        ctx.moveTo(s * 0.32, -s * 1.15);
        ctx.quadraticCurveTo(s * 0.85, -s * 0.85, s * 0.38, -s * 0.55);
        ctx.stroke();
      }
      if (n.kind === 2) {
        ctx.beginPath();
        ctx.moveTo(s * 0.32, -s * 0.95);
        ctx.quadraticCurveTo(s * 0.78, -s * 0.68, s * 0.38, -s * 0.4);
        ctx.stroke();
      }

      ctx.restore();
    };

    const push = (x: number, y: number, w: number, now: number, dist = 0) => {
      trail.push({ x, y, w, rgb: mixInk(travel), born: now });
      sinceNote += dist;
      if (sinceNote >= NOTE_GAP) {
        sinceNote = 0;
        spawnNote(x + (Math.random() - 0.5) * 10, y - 8, now);
      }
    };

    const drawTo = (x: number, y: number, now: number) => {
      if (!last) {
        last = { x, y, w: width, t: now };
        push(x, y, width, now);
        return;
      }

      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.8) return;

      const dt = Math.max(8, now - last.t);
      const speed = dist / dt;
      const target = Math.max(10, Math.min(32, 24 - speed * 12));
      width += (target - width) * 0.25;

      const steps = Math.max(1, Math.ceil(dist / 2.2));
      for (let i = 1; i <= steps; i++) {
        const p = i / steps;
        travel += dist / steps;
        push(
          last.x + dx * p,
          last.y + dy * p,
          last.w + (width - last.w) * p,
          now,
          dist / steps
        );
      }

      last = { x, y, w: width, t: now };
    };

    const tick = (now: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (reduce) {
        raf = requestAnimationFrame(tick);
        return;
      }

      let write = 0;
      for (let i = 0; i < trail.length; i++) {
        const s = trail[i];
        const age = now - s.born;
        if (age > LIFE) continue;
        const fade = 1 - age / LIFE;
        const a = fade * fade;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.w);
        g.addColorStop(0, `rgba(${s.rgb}, ${0.2 * a})`);
        g.addColorStop(0.55, `rgba(${s.rgb}, ${0.08 * a})`);
        g.addColorStop(1, `rgba(${s.rgb}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.w, 0, Math.PI * 2);
        ctx.fill();
        trail[write++] = s;
      }
      trail.length = write;

      let nWrite = 0;
      for (let i = 0; i < notes.length; i++) {
        const n = notes[i];
        const age = now - n.born;
        if (age > NOTE_LIFE) continue;
        n.x += n.vx;
        n.y += n.vy;
        n.rot += n.vr;
        const fade = 1 - age / NOTE_LIFE;
        drawNote(n, fade * fade);
        notes[nWrite++] = n;
      }
      notes.length = nWrite;

      raf = requestAnimationFrame(tick);
    };

    const paintFromClient = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < -48 || y < -48 || x > rect.width + 48 || y > rect.height + 48) {
        last = null;
        return;
      }
      drawTo(x, y, performance.now());
    };

    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      paintFromClient(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (reduce || e.touches.length === 0) return;
      paintFromClient(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onLeave = () => {
      last = null;
    };

    resize();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
