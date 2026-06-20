"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ClipboardCheck,
  Command,
  Kanban,
  LayoutDashboard,
  Receipt,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const productPillars = [
  {
    title: "Command Center",
    description: "Live overview of projects, blockers, approvals, team capacity, and spend.",
    Icon: LayoutDashboard,
  },
  {
    title: "Projects & Tasks",
    description: "Plan work, assign owners, track progress, and predict delivery.",
    Icon: Kanban,
  },
  {
    title: "Approvals",
    description: "Review task proof, expense requests, and client updates in one queue.",
    Icon: ClipboardCheck,
  },
  {
    title: "Team Workload",
    description: "See capacity, overloaded teammates, and available support at a glance.",
    Icon: Users,
  },
  {
    title: "Expenses & Budgets",
    description: "Track spend, approve expenses, and monitor project budgets.",
    Icon: Receipt,
  },
  {
    title: "Ask Pulse",
    description: "Ask questions about work, blockers, approvals, and project pacing.",
    Icon: Command,
  },
];

const previewRows = [
  { label: "Tasks due today", value: "5", tone: "#00B4D8" },
  { label: "Approvals waiting", value: "3", tone: "#FBBF24" },
  { label: "Projects at risk", value: "2", tone: "#F87171" },
  { label: "Budget used", value: "64%", tone: "#6D5DFB" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" } },
};

export default function ProductPageContent() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090F] text-white">
      <Navbar />
      <div className="absolute inset-0 grid-bg opacity-35" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 38% at 18% 18%, rgba(109,93,251,0.13), transparent 70%), radial-gradient(ellipse 42% 32% at 82% 18%, rgba(0,180,216,0.09), transparent 70%)",
        }}
      />

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 pb-16 pt-28 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
      >
        <div>
          <motion.p
            variants={itemVariants}
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00B4D8]"
          >
            Pulse Product
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="max-w-2xl text-5xl font-bold leading-[1.04] tracking-[-0.02em] text-[#F0F2F8] md:text-6xl"
          >
            One command center for how startup teams actually operate.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-base leading-8 text-[#7F8BA6] md:text-[17px]"
          >
            Pulse brings projects, tasks, approvals, expenses, workload, blockers, and team progress into a single operating layer built for fast-moving teams.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
            <motion.a
              href="/app"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6D5DFB] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(109,93,251,0.24)]"
              whileHover={{ y: -1, backgroundColor: "#7C6EFC" }}
              whileTap={{ scale: 0.98 }}
            >
              Open demo dashboard
              <ArrowRight className="h-4 w-4" />
            </motion.a>
            <a
              href="/signup"
              className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[13px] font-medium text-[#C8D0E8] transition hover:border-white/20 hover:text-white"
            >
              Request access
            </a>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="glass-raised rounded-[24px] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="rounded-[20px] border border-white/[0.06] bg-[#07090F]/45 p-4">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#F0F2F8]">Live operating system preview</p>
                <p className="mt-1 text-xs text-[#6B7A9F]">A compact read on work, risk, and spend.</p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-200">
                Stable
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {previewRows.map((row) => (
                <div key={row.label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="mb-5 h-1.5 w-10 rounded-full" style={{ background: row.tone }} />
                  <p className="text-3xl font-semibold tracking-[-0.03em] text-[#F0F2F8]">{row.value}</p>
                  <p className="mt-1 text-sm text-[#6B7A9F]">{row.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-[#6D5DFB]/20 bg-[linear-gradient(135deg,rgba(109,93,251,0.16),rgba(0,180,216,0.07))] p-4">
              <p className="text-sm font-medium text-[#F0F2F8]">Website Redesign is 3 days behind pace.</p>
              <p className="mt-2 text-sm leading-6 text-[#9BA8C7]">
                Design approval is still pending, and two blocker signals are affecting the predicted finish date.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
        >
          {productPillars.map(({ title, description, Icon }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.13)" }}
              className="glass-raised rounded-2xl p-5"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-[#8B7FFF]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-[#F0F2F8]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6B7A9F]">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
