"use client";

import { useEffect, useState } from "react";

interface TypingCommandProps {
  phrases: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDelay?: number;
}

export default function TypingCommand({
  phrases,
  className = "",
  typingSpeed = 44,
  deletingSpeed = 26,
  pauseDelay = 1100,
}: TypingCommandProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex % phrases.length] ?? "";
    const isPhraseComplete = displayText === currentPhrase;

    const timer = window.setTimeout(() => {
      if (isDeleting) {
        if (displayText.length === 0) {
          setIsDeleting(false);
          setPhraseIndex((idx) => (idx + 1) % phrases.length);
          return;
        }

        setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        return;
      }

      if (isPhraseComplete) {
        setTimeout(() => setIsDeleting(true), pauseDelay);
        return;
      }

      setDisplayText(currentPhrase.slice(0, displayText.length + 1));
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => window.clearTimeout(timer);
  }, [deletingSpeed, displayText, isDeleting, pauseDelay, phraseIndex, phrases, typingSpeed]);

  return (
    <span className={`inline-flex max-w-full items-center gap-1.5 overflow-hidden text-[12px] font-mono tracking-[-0.01em] ${className}`}>
      <span className="shrink-0 text-[#6D5DFB]">&gt;</span>
      <span aria-live="polite" className="min-w-0 truncate whitespace-nowrap text-[#D4DBEF]">
        {displayText}
      </span>
      <span className="typing-cursor inline-block h-4 w-[1px] shrink-0 bg-[#D4DBEF] align-middle" />
    </span>
  );
}