"use client";

import { motion } from "framer-motion";
import { ArrowRight, ClipboardCheck, Command, LayoutDashboard, TrendingUp, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { approvals, askPulseResponses, projects, teamMembers } from "@/lib/mockData";

const demoSteps = [
  {
    title: "Morning Briefing",
    Icon: LayoutDashboard,
    text: "Start the day with due tasks, waiting approvals, blockers, and pacing risks.",
  },
  {
    title: "Project Health",
    Icon: TrendingUp,
    text: "See project progress, predicted finish dates, owners, and risk badges.",
  },
  {
    title: "Proof Approval",
    Icon: ClipboardCheck,
    text: "Review submitted work with proof, notes, attachments, and approval actions.",
  },
  {
    title: "Team Capacity",
    Icon: Users,
    text: "Understand capacity, support needed, and delivery confidence at a glance.",
  },
  {
    title: "Ask Pulse",
    Icon: Command,
    text: "Ask the workspace what is at risk, who is overloaded, and what needs approval.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" } },
};

export default function DemoPageContent() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090F] text-white">
      <Navbar />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 34% at 18% 12%, rgba(109,93,251,0.12), transparent 70%), radial-gradient(ellipse 42% 30% at 84% 16%, rgba(0,180,216,0.08), transparent 70%)",
        }}
      />
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid min-h-screen max-w-7xl gap-10 px-6 pb-16 pt-28 md:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"
      >
        <div>
          <motion.p variants={itemVariants} className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00B4D8]">Interactive demo</motion.p>
          <motion.h1 variants={itemVariants} className="text-5xl font-bold leading-[1.04] tracking-[-0.02em] text-[#F0F2F8] md:text-6xl">See Pulse in action.</motion.h1>
          <motion.p variants={itemVariants} className="mt-6 max-w-xl text-base leading-8 text-[#7F8BA6] md:text-[17px]">
            Walk through how Pulse helps a team spot blockers, approve work, track workload, and understand project health.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
            <a href="/app" className="inline-flex items-center gap-2 rounded-xl bg-[#6D5DFB] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(109,93,251,0.24)]">
              Open Demo Dashboard
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/signup" className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[13px] font-medium text-[#C8D0E8]">
              Start Free
            </a>
          </motion.div>
        </div>
        <motion.div variants={itemVariants} className="glass-raised rounded-[24px] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="space-y-3 rounded-[20px] border border-white/[0.06] bg-[#07090F]/45 p-4">
            <div className="rounded-2xl border border-[#6D5DFB]/20 bg-[linear-gradient(135deg,rgba(109,93,251,0.16),rgba(0,180,216,0.07))] p-4 text-sm leading-6 text-[#D7E1F7]">
              Today: 5 tasks are due, 3 approvals are waiting, 2 blockers need attention, and Website Redesign is 3 days behind pace.
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {projects.slice(0, 2).map((project) => (
                <div key={project.name} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-sm font-semibold text-[#F0F2F8]">{project.name}</p>
                  <p className="mt-1 text-xs text-[#6B7A9F]">{project.statusLabel} · {project.progress}% · {project.predictedFinish}</p>
                </div>
              ))}
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                <p className="text-sm font-semibold text-[#F0F2F8]">{approvals[0].submittedBy} proof waiting</p>
                <p className="mt-1 text-xs text-[#6B7A9F]">{approvals[0].aiNote}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                <p className="text-sm font-semibold text-[#F0F2F8]">{teamMembers[0].shortName} capacity</p>
                <p className="mt-1 text-xs text-[#6B7A9F]">{teamMembers[0].capacity}% · {teamMembers[0].status}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-4 text-sm leading-6 text-[#D7E1F7]">
              {askPulseResponses["What projects are at risk?"]}
            </div>
          </div>
        </motion.div>
      </motion.section>
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <div className="grid gap-3 md:grid-cols-5">
          {demoSteps.map(({ title, text, Icon }) => (
            <motion.div key={title} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-raised rounded-2xl p-4">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-[#8B7FFF]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-semibold text-[#F0F2F8]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6B7A9F]">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
