"use client";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  animate?: boolean;
}

export default function ProgressBar({
  value,
  color = "#6D5DFB",
  height = 4,
  animate = true,
}: ProgressBarProps) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: "rgba(255,255,255,0.06)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 8px ${color}66`,
        }}
        initial={animate ? { width: 0 } : { width: `${value}%` }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
      />
    </div>
  );
}
