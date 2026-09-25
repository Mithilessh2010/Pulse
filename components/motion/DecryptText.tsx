"use client";

import { useEffect, useMemo, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scramble(text: string, resolved: number) {
  return text
    .split("")
    .map((char, index) => {
      if (char === " ") return " ";
      if (index < resolved) return char;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join("");
}

type DecryptTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
};

export function DecryptText({
  text,
  className = "",
  delay = 180,
  duration = 520,
}: DecryptTextProps) {
  const [display, setDisplay] = useState(text);
  const [running, setRunning] = useState(false);
  const nonSpaceCount = useMemo(() => text.replaceAll(" ", "").length, [text]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    let start = 0;
    let timer = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const resolvedNonSpaces = Math.floor(progress * nonSpaceCount);

      let seen = 0;
      const resolvedByIndex = text.split("").reduce((last, char, index) => {
        if (char !== " ") seen += 1;
        return seen <= resolvedNonSpaces ? index + 1 : last;
      }, 0);

      setDisplay(scramble(text, resolvedByIndex));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
        setRunning(false);
      }
    };

    timer = window.setTimeout(() => {
      setRunning(true);
      setDisplay(scramble(text, 0));
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [delay, duration, nonSpaceCount, text]);

  return (
    <span className={`decrypt-text ${className}`} aria-label={text}>
      <span aria-hidden="true">{display}</span>
      <span aria-hidden="true" className={`decrypt-cursor ${running ? "is-running" : ""}`}>_</span>
    </span>
  );
}
