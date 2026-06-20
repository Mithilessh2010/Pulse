"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { toolsReplaced } from "@/lib/mockData";

// Scattered tool cards get visually "pulled" toward the Pulse core
// Layout: cards scattered on left, Pulse core on right, animated lines connecting
const cardPositions = [
  { top: "5%",  left: "3%",  rotate: -7 },
  { top: "28%", left: "0%",  rotate:  4 },
  { top: "54%", left: "4%",  rotate: -3 },
  { top: "76%", left: "7%",  rotate:  6 },
  { top: "6%",  left: "28%", rotate:  5 },
  { top: "70%", left: "26%", rotate: -5 },
  { top: "38%", left: "20%", rotate: -8 },
  { top: "86%", left: "42%", rotate:  3 },
];

export default function ToolReplacementSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: "#4D5E78" }}>
            Consolidate your stack
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-[-0.04em] leading-[1.02]" style={{ color: "#F0F2F8" }}>
            Replace scattered tools
            <br />
            <span style={{ color: "#4D5E78", fontWeight: 400 }}>
              with one operating system.
            </span>
          </h2>
        </motion.div>

        {/* Main visual: scattered tools + Pulse core */}
        <div className="relative" style={{ minHeight: 460 }}>
          {/* SVG signal lines radiating from tool cards toward Pulse core */}
          {isInView && (
            <svg
              className="absolute inset-0 pointer-events-none z-10"
              viewBox="0 0 1000 460"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
            >
              {[
                "M 80 28 Q 420 100 680 220",
                "M 55 138 Q 400 180 680 230",
                "M 80 258 Q 380 260 680 240",
                "M 100 358 Q 400 320 680 260",
                "M 305 32 Q 480 100 680 215",
                "M 290 330 Q 460 310 680 258",
                "M 225 185 Q 440 210 680 238",
                "M 445 408 Q 580 360 680 280",
              ].map((d, i) => (
                <g key={i}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="rgba(109,93,251,0.25)"
                    strokeWidth="1"
                    strokeDasharray="5 7"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 1,
                      delay: 0.3 + i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                  {/* Flowing dot */}
                  <motion.circle
                    r="2.5"
                    fill="#6D5DFB"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: 1 + i * 0.22,
                      ease: "easeInOut",
                    }}
                  >
                    <animateMotion dur="1.8s" repeatCount="indefinite" begin={`${1 + i * 0.22}s`}>
                      <mpath href={`#tool-line-${i}`} />
                    </animateMotion>
                  </motion.circle>
                  <path id={`tool-line-${i}`} d={d} fill="none" stroke="none" />
                </g>
              ))}
            </svg>
          )}

          {/* Scattered tool cards */}
          {toolsReplaced.map((tool, i) => (
            <motion.div
              key={tool.name}
              className="absolute"
              style={{ top: cardPositions[i].top, left: cardPositions[i].left }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
            >
              <motion.div
                className="rounded-lg px-3 py-2.5 cursor-default"
                style={{
                  background: "rgba(10,16,28,0.85)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                  transform: `rotate(${cardPositions[i].rotate}deg)`,
                  minWidth: 110,
                }}
                whileHover={{
                  scale: 1.06,
                  border: "1px solid rgba(109,93,251,0.3)",
                  rotate: 0,
                }}
              >
                <p className="text-[11px] font-semibold mb-0.5 font-display" style={{ color: "#C4CEDF" }}>
                  {tool.name}
                </p>
                <p className="text-[9px] font-mono" style={{ color: "#3D4F6F" }}>
                  {tool.category}
                </p>
              </motion.div>
            </motion.div>
          ))}

          {/* Pulse Core — right side */}
          <motion.div
            className="absolute z-20 flex flex-col items-center gap-3"
            style={{ right: "4%", top: "50%", transform: "translateY(-50%)" }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          >
            {/* Pulse rings */}
            {[1, 2, 3].map((_, ri) => (
              <motion.div
                key={ri}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 160 + ri * 60,
                  height: 160 + ri * 60,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  border: "1px solid rgba(109,93,251,0.3)",
                }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: ri * 0.9,
                }}
              />
            ))}

            {/* Core card */}
            <div
              className="relative flex flex-col items-center gap-3 px-7 py-5 rounded-2xl"
              style={{
                background: "rgba(10,16,28,0.95)",
                border: "1px solid rgba(109,93,251,0.3)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 0 40px rgba(109,93,251,0.12), 0 20px 60px rgba(0,0,0,0.4)",
                minWidth: 170,
              }}
            >
              {/* Logo mark */}
              <motion.div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "#6D5DFB" }}
                animate={{ boxShadow: ["0 0 16px rgba(109,93,251,0.4)", "0 0 32px rgba(109,93,251,0.65)", "0 0 16px rgba(109,93,251,0.4)"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
                  <path d="M0.5 7H4L7 1.5L11 12.5L14 4L17 8.5H21.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-bold mb-0.5 font-display" style={{ color: "#F0F2F8" }}>Pulse</p>
                <p className="text-[9px] font-mono" style={{ color: "#4D5E78" }}>Operations platform</p>
              </div>
              {/* Feature chips */}
              <div className="grid grid-cols-2 gap-1.5">
                {["Projects", "Tasks", "Expenses", "Approvals", "Standups", "Insights"].map((f) => (
                  <div
                    key={f}
                    className="text-center px-2 py-1 rounded-md text-[9px] font-medium font-mono"
                    style={{
                      background: "rgba(109,93,251,0.08)",
                      color: "#6B7A9F",
                      border: "1px solid rgba(109,93,251,0.12)",
                    }}
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
