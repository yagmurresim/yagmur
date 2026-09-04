"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
                className="flex items-center justify-between w-full py-6 text-left gap-6 group"
              >
                <span className="font-display text-[18px] text-ink group-hover:text-plum transition-colors">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-ink-muted group-hover:text-plum transition-colors"
                  aria-hidden="true"
                >
                  <ChevronDown size={20} />
                </motion.span>
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
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-[16px] text-ink-muted leading-relaxed max-w-[65ch]">
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