"use client";
import { motion } from "framer-motion";
import React from "react";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
  floatAmplitude?: number;
}

export default function FloatingCard({
  children,
  className = "",
  delay = 0,
  x = 0,
  y = 0,
  floatAmplitude = 6,
}: FloatingCardProps) {
  return (
    <motion.div
      className={`glass rounded-2xl shadow-2xl ${className}`}
      initial={{ opacity: 0, y: y + 20, x }}
      animate={{
        opacity: 1,
        y: [y, y - floatAmplitude, y],
        x,
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
      }}
    >
      {children}
    </motion.div>
  );
}
