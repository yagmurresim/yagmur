"use client";

import { motion, useReducedMotion } from "framer-motion";

const PIECES = [
  {
    src: "https://stories.freepiklabs.com/storage/30614/Artist_Mesa-de-trabajo-1.svg",
    alt: "Resim çizen",
    label: "Resim",
  },
  {
    src: "https://stories.freepiklabs.com/storage/70085/Jazz-piano-01.svg",
    alt: "Piyano çalan",
    label: "Piyano",
  },
  {
    src: "https://stories.freepiklabs.com/storage/4526/More-Music_Mesa-de-trabajo-1-(7).svg",
    alt: "Keman çalan",
    label: "Keman",
  },
  {
    src: "https://stories.freepiklabs.com/storage/13378/Playing-Music-01.svg",
    alt: "Gitar çalan",
    label: "Gitar",
  },
];

export function StudioScene() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        {PIECES.map((piece, i) => (
          <motion.figure
            key={piece.label}
            className="overflow-hidden"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, y: [0, -7, 0] }
            }
            transition={
              reduce
                ? { duration: 0 }
                : {
                    opacity: { duration: 0.55, delay: i * 0.12 },
                    y: {
                      duration: 5.2 + i * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    },
                  }
            }
          >
            <img
              src={piece.src}
              alt={piece.alt}
              className="pointer-events-none h-auto w-full"
            />
            <figcaption className="mt-1 text-center text-[12px] font-medium text-ink-muted">
              {piece.label}
            </figcaption>
          </motion.figure>
        ))}
      </div>
      <p className="mt-3 text-right text-[10px] text-ink-muted/70">
        İllüstrasyon:{" "}
        <a
          href="https://storyset.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          Storyset
        </a>
      </p>
    </div>
  );
}
