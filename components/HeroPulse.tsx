"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import { DecryptText } from "./motion/DecryptText";
import { TiltSurface } from "./motion/TiltSurface";

const ease = [0.16, 1, 0.3, 1] as const;

export default function HeroPulse() {
  return (
    <section className="hero-motion-field relative overflow-hidden bg-[#0B0D0C] pt-14 text-white">
      <div aria-hidden="true" className="hero-orbit hero-orbit-a" />
      <div aria-hidden="true" className="hero-orbit hero-orbit-b" />
      <div aria-hidden="true" className="hero-signal hero-signal-a" />
      <div aria-hidden="true" className="hero-signal hero-signal-b" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-56px)] max-w-[1360px] items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:py-20">
        <motion.div
          className="max-w-[620px]"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.075, delayChildren: 0.06 } },
          }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium text-[#959C96]"
          >
            <span className="hero-status-dot h-1.5 w-1.5 rounded-full bg-[#4B9B7C]" />
            One operating view for your team
          </motion.div>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 24, filter: "blur(9px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.78, ease } } }}
            className="text-[48px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#F4F1EA] sm:text-[60px] lg:text-[72px]"
          >
            Your team,<br />without the{" "}
            <DecryptText text="tab sprawl." className="text-[#D5BC7A]" />
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } }}
            className="mt-7 max-w-[560px] text-[16px] leading-7 text-[#8E958F] md:text-[17px]"
          >
            Pulse keeps projects, approvals, spend, workload, and decisions in one workspace—so managers can see what changed and act without hunting through five different tools.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
            className="mt-8 flex flex-wrap gap-2.5"
          >
            <motion.a
              href="/signup"
              className="pulse-magnetic-button inline-flex items-center gap-2 rounded-lg bg-[#2F7D68] px-5 py-2.5 text-[13px] font-semibold text-white"
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              Start a workspace <ArrowRight className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="/demo"
              className="inline-flex items-center rounded-lg border border-white/10 px-5 py-2.5 text-[13px] font-medium text-[#C8CCC7] transition-colors hover:border-white/20 hover:text-white"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              Explore the demo
            </motion.a>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.7, ease } } }}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#747B75]"
          >
            {["No card required", "Demo needs no account", "Exportable workspace data"].map((item, index) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.72 + index * 0.08, duration: 0.45, ease }}
                className="inline-flex items-center gap-1.5"
              >
                <Check className="h-3.5 w-3.5 text-[#4B9B7C]" />{item}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="relative lg:pl-4"
          initial={{ opacity: 0, y: 26, scale: 0.975 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.22, ease }}
        >
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_45%,rgba(75,155,124,0.09),transparent_62%)]" />
          <TiltSurface className="relative">
            <DashboardPreview />
          </TiltSurface>
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#59605B] md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <span>Scroll</span><span className="hero-scroll-line" />
      </motion.div>
    </section>
  );
}
