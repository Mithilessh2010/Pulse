"use client";
import { motion } from "framer-motion";

// The central glowing Pulse mark — waveform in a rounded square, breathing glow
export function PulseLogoMark({ size = 56 }: { size?: number }) {
  return (
    <motion.div
      className="relative flex items-center justify-center rounded-2xl"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #6D5DFB 0%, #5546e8 100%)",
        boxShadow: "0 0 0 1px rgba(109,93,251,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
      animate={{
        boxShadow: [
          "0 0 0 1px rgba(109,93,251,0.4), 0 0 20px rgba(109,93,251,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
          "0 0 0 1px rgba(109,93,251,0.6), 0 0 36px rgba(109,93,251,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
          "0 0 0 1px rgba(109,93,251,0.4), 0 0 20px rgba(109,93,251,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
        ],
      }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.35}
        viewBox="0 0 30 18"
        fill="none"
      >
        <motion.path
          d="M0.5 9H5L8.5 2L12.5 16L16 5L19.5 11.5L22.5 9H29.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>
    </motion.div>
  );
}

// Navbar-sized logo mark
export function NavPulseMark() {
  return (
    <div
      className="w-[28px] h-[28px] rounded-[7px] flex items-center justify-center shrink-0"
      style={{ background: "#6D5DFB" }}
    >
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
        <path
          d="M0.5 5H3.5L6 1L9 9L11.5 3.5L13.5 6.5H15.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
