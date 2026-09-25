"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

export function TiltSurface({ children, className = "" }: { children: ReactNode; className?: string }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 170, damping: 26, mass: 0.34 });
  const sy = useSpring(my, { stiffness: 170, damping: 26, mass: 0.34 });
  const rotateY = useTransform(sx, [0, 1], [-2.4, 2.4]);
  const rotateX = useTransform(sy, [0, 1], [2.0, -2.0]);
  const shineX = useTransform(sx, [0, 1], ["25%", "75%"]);
  const shineY = useTransform(sy, [0, 1], ["20%", "80%"]);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width);
    my.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      className={`tilt-surface ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
      <motion.div
        aria-hidden="true"
        className="tilt-sheen"
        style={{ left: shineX, top: shineY }}
      />
    </motion.div>
  );
}
