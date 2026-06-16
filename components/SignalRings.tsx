"use client";
import { motion } from "framer-motion";

// Expanding pulse rings — ECG/radar metaphor, not space
export default function SignalRings({ size = 600 }: { size?: number }) {
  const rings = [
    { delay: 0, duration: 3.6, opacity: 0.18 },
    { delay: 1.2, duration: 3.6, opacity: 0.12 },
    { delay: 2.4, duration: 3.6, opacity: 0.07 },
  ];

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(109,93,251,0.6)",
          }}
          initial={{ scale: 0.3, opacity: ring.opacity }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{
            duration: ring.duration,
            delay: ring.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Inner glow ring — stays static, pulses opacity */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "30%",
          border: "1px solid rgba(109,93,251,0.25)",
          background: "radial-gradient(circle, rgba(109,93,251,0.06) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
