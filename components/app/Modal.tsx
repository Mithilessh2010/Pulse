"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "xl" | "2xl" | "3xl";
};

const widths = { xl: "max-w-xl", "2xl": "max-w-2xl", "3xl": "max-w-3xl" };

export function Modal({ open, onClose, title, description, children, footer, maxWidth = "xl" }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden p-3 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}>
          <button type="button" aria-label="Close modal backdrop" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`relative flex max-h-[calc(100vh-48px)] max-h-[calc(100dvh-48px)] w-[calc(100vw-24px)] ${widths[maxWidth]} min-w-0 flex-col overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--pulse-panel)] shadow-2xl`}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border-subtle)] p-4 sm:p-5">
              <div className="min-w-0">
                <h2 id={titleId} className="break-words text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
                {description ? <p id={descriptionId} className="mt-1 break-words text-sm leading-5 text-[var(--text-muted)]">{description}</p> : null}
              </div>
              <button type="button" aria-label="Close modal" onClick={onClose} className="shrink-0 rounded-lg border border-[var(--border-subtle)] p-2 text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"><X className="h-4 w-4" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">{children}</div>
            {footer ? <div className="sticky bottom-0 z-10 shrink-0 border-t border-[var(--border-subtle)] bg-[var(--pulse-panel)] p-4 sm:p-5">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
