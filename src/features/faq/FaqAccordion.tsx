"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Faq } from "@/types";

interface FaqAccordionProps {
  faqs: Faq[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div className="divide-y divide-line" role="list">
      {faqs.map((faq) => {
        const isOpen = open === faq.id;
        const headingId = `faq-q-${faq.id}`;
        const panelId = `faq-panel-${faq.id}`;

        return (
          <div key={faq.id} role="listitem">
            <h2>
              <button
                id={headingId}
                onClick={() => setOpen(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group flex w-full items-baseline justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-[1.35rem] leading-snug text-ink group-hover:text-plum">
                  {faq.question}
                </span>
                <span
                  className="font-display shrink-0 text-2xl leading-none text-plum"
                  aria-hidden="true"
                >
                  {isOpen ? "–" : "+"}
                </span>
              </button>
            </h2>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[60ch] pb-6 text-[16px] text-ink-muted">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
