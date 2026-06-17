"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      {/* Very subtle, calm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(109,93,251,0.09) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(109,93,251,0.2), transparent)" }}
      />

      <div className="relative max-w-[780px] mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-7"
        >
          {/* Headline — white, confident, no gradient */}
          <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-[-0.04em] leading-[1.02]" style={{ color: "#F0F2F8" }}>
            One workspace for
            <br />
            <span style={{ color: "#6B7A9F", fontWeight: 400 }}>
              the whole team.
            </span>
          </h2>

          {/* Subtext — no fake numbers */}
          <p className="text-base md:text-[17px] font-sans max-w-md leading-[1.7]" style={{ color: "#7F8BA6" }}>
            Projects, approvals, expenses, and workload — in a single product built for teams that move fast.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #00D4FF 0%, #6D5DFB 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 24px rgba(109,93,251,0.18)",
              }}
              whileHover={{ y: -1, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
            >
              Request access
              <ArrowRight size={14} />
            </motion.a>
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-medium backdrop-blur-md"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#C4CEDF",
              }}
              whileHover={{
                y: -1,
                border: "1px solid rgba(255,255,255,0.14)",
                color: "#F0F2F8",
                background: "rgba(255,255,255,0.05)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              View demo
            </motion.a>
          </div>

          {/* Clean trust line */}
          <div className="flex flex-wrap justify-center gap-5 mt-1">
            {["No credit card required", "5-minute setup", "Cancel anytime"].map((item) => (
              <span key={item} className="text-[12px] font-mono" style={{ color: "#3D4F6F" }}>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
