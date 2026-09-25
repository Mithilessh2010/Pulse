"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./motion/Reveal";

export default function CTASection() {
  return (
    <section className="px-6 pb-24 pt-8 md:px-10">
      <Reveal>
        <motion.div
          className="cta-motion-panel relative mx-auto flex max-w-7xl flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111412] p-7 md:flex-row md:items-center md:p-10"
          whileHover={{ borderColor: "rgba(255,255,255,0.13)" }}
        >
          <div aria-hidden="true" className="cta-orbit" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#F4F1EA] md:text-4xl">See if Pulse fits the way your team already works.</h2>
            <p className="mt-3 text-sm leading-6 text-[#8E958F]">The live demo uses sample data and opens without an account.</p>
          </div>
          <div className="relative z-10 flex shrink-0 flex-wrap gap-3">
            <motion.a href="/demo" className="pulse-magnetic-button inline-flex items-center gap-2 rounded-lg bg-[#2F7D68] px-5 py-3 text-sm font-semibold text-white" whileHover={{ y: -2, scale: 1.015 }} whileTap={{ scale: 0.98 }}>Open demo <ArrowRight className="h-4 w-4" /></motion.a>
            <motion.a href="/signup" className="inline-flex items-center rounded-lg border border-white/10 px-5 py-3 text-sm font-medium text-[#C8CCC7] transition-colors hover:border-white/20 hover:text-white" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>Create workspace</motion.a>
          </div>
        </motion.div>
      </Reveal>
    </section>
  );
}
