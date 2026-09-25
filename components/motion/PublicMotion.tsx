"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const PUBLIC_ROUTES = new Set(["/", "/product", "/features", "/pricing", "/security", "/devlog"]);

export function PublicMotion() {
  const pathname = usePathname();
  const enabled = PUBLIC_ROUTES.has(pathname);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.22 });
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const raf = useRef(0);
  const [interactive, setInteractive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    document.body.classList.add("pulse-custom-cursor");

    const draw = () => {
      current.current.x += (target.current.x - current.current.x) * 0.17;
      current.current.y += (target.current.y - current.current.y) * 0.17;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      setVisible(true);
      const element = event.target as HTMLElement | null;
      setInteractive(Boolean(element?.closest("a, button, input, textarea, select, [role='button']")));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(draw);

    return () => {
      document.body.classList.remove("pulse-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <motion.div className="public-scroll-progress" style={{ scaleX }} />
      <div ref={haloRef} className={`pulse-cursor-halo ${visible ? "is-visible" : ""} ${interactive ? "is-interactive" : ""}`} />
      <div ref={dotRef} className={`pulse-cursor-dot ${visible ? "is-visible" : ""} ${interactive ? "is-interactive" : ""}`} />
    </>
  );
}
