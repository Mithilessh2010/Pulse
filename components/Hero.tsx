"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-20 pb-16 flex items-center overflow-hidden">
      {/* Background — subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      {/* Very soft ambient glow — toned down from before */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 15% 65%, rgba(109,93,251,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 85% 25%, rgba(0,212,255,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 w-full grid md:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5"
        >
          {/* Badge — cleaner, no pulse dot */}
          <motion.div variants={itemVariants} className="inline-flex w-fit">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-medium tracking-wide"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#6B7A9F",
                letterSpacing: "0.03em",
              }}
            >
              Operating system for fast-moving teams
            </span>
          </motion.div>

          {/* Headline — white-dominant, one subtle accent */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.06] tracking-[-0.02em]"
            style={{ color: "#F0F2F8" }}
          >
            Run your team
            <br />
            from one{" "}
            <span style={{ color: "#8B7FFF" }}>place.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-[17px] leading-relaxed max-w-md"
            style={{ color: "#6B7A9F" }}
          >
            Projects, approvals, expenses, workload, and blockers — unified in a single workspace your whole team will actually use.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 pt-1">
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white"
              style={{
                background: "#6D5DFB",
                boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 24px rgba(109,93,251,0.18)",
              }}
              whileHover={{ background: "#7C6EFC", scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              Request access
              <ArrowRight size={14} />
            </motion.a>
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#9BA8C7",
              }}
              whileHover={{
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#F0F2F8",
              }}
              whileTap={{ scale: 0.98 }}
            >
              View demo
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right — Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
}
