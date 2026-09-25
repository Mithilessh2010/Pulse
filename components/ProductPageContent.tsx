"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckSquare, CircleDollarSign, Gauge, Kanban, MessageSquareText, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Reveal } from "@/components/motion/Reveal";
import { TiltSurface } from "@/components/motion/TiltSurface";

const workflow = [
  { Icon: Kanban, title: "Plan", text: "Projects, owners, milestones, and tasks live in the same workspace." },
  { Icon: CheckSquare, title: "Review", text: "Proof and change feedback stay attached to the approval instead of disappearing in chat." },
  { Icon: Gauge, title: "Operate", text: "Capacity, blockers, spend, and delivery signals update the command center." },
  { Icon: MessageSquareText, title: "Ask", text: "Use Ask Pulse when a direct answer is faster than opening another report." },
];

const rows = [
  ["Website redesign", "72%", "Needs approval", "Oct 4"],
  ["Q3 launch review", "86%", "On track", "Sep 29"],
  ["Mobile onboarding", "48%", "At risk", "Oct 12"],
  ["Partner rollout", "64%", "On track", "Oct 8"],
];

export default function ProductPageContent() {
  return (
    <main className="min-h-screen bg-[#0B0D0C] text-white">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-10 md:pt-36">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9EA59F]">Product</p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#F4F1EA] md:text-6xl">A calmer place to run the team.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#8E958F]">Pulse connects projects, approvals, workload, spend, and team updates without making every workflow feel like a separate app.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.a href="/demo" className="pulse-magnetic-button inline-flex items-center gap-2 rounded-lg bg-[#2F7D68] px-5 py-3 text-sm font-semibold text-white" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>Open live demo <ArrowRight className="h-4 w-4" /></motion.a>
              <motion.a href="/features" className="inline-flex items-center rounded-lg border border-white/10 px-5 py-3 text-sm font-medium text-[#C8CCC7] transition-colors hover:border-white/20 hover:text-white" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>Browse features</motion.a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <TiltSurface>
              <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111412] shadow-[0_26px_70px_rgba(0,0,0,0.24)]">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                  <div><p className="text-sm font-semibold text-[#E5E7E4]">Project portfolio</p><p className="mt-0.5 text-xs text-[#69706A]">4 active projects</p></div>
                  <span className="rounded-md border border-white/[0.08] px-2 py-1 text-[11px] text-[#8E958F]">This quarter</span>
                </div>
                <div className="hidden grid-cols-[1.5fr_.55fr_.8fr_.55fr] gap-4 border-b border-white/[0.06] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#555B56] sm:grid">
                  <span>Project</span><span>Progress</span><span>Health</span><span>Target</span>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {rows.map(([name, progress, health, target], index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.018)" }}
                      className="grid gap-2 px-5 py-4 sm:grid-cols-[1.5fr_.55fr_.8fr_.55fr] sm:items-center sm:gap-4"
                    >
                      <span className="text-sm font-medium text-[#E5E7E4]">{name}</span><span className="text-xs text-[#AEB4AF]">{progress}</span><span className="text-xs text-[#8E958F]">{health}</span><span className="text-xs text-[#69706A]">{target}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TiltSurface>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#0E100F] py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal className="max-w-2xl"><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#737A74]">One operating loop</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#F4F1EA]">From work to decision without losing context.</h2></Reveal>
          <div className="mt-10 grid border-l border-t border-white/[0.07] md:grid-cols-4">
            {workflow.map(({ Icon, title, text }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ delay: index * 0.055, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.018)" }}
                className="border-b border-r border-white/[0.07] p-6"
              >
                <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-[#D5BC7A]" /><span className="text-xs text-[#555B56]">0{index + 1}</span></div>
                <h3 className="mt-8 text-base font-semibold text-[#E5E7E4]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#737A74]">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-20 md:grid-cols-3 md:px-10">
        <Stat Icon={Users} label="Team capacity" value="Visible" text="Workload signals sit next to delivery work." index={0} />
        <Stat Icon={CheckSquare} label="Change feedback" value="Recorded" text="Approvals keep the submitter feedback and history." index={1} />
        <Stat Icon={CircleDollarSign} label="Project spend" value="Connected" text="Budget context stays with the work it supports." index={2} />
      </section>
    </main>
  );
}

function Stat({ Icon, label, value, text, index }: { Icon: typeof Users; label: string; value: string; text: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.14)" }}
      className="rounded-xl border border-white/[0.08] bg-[#111412] p-5"
    >
      <Icon className="h-5 w-5 text-[#D5BC7A]" /><p className="mt-6 text-xs text-[#69706A]">{label}</p><p className="mt-1 text-xl font-semibold text-[#F4F1EA]">{value}</p><p className="mt-2 text-sm leading-6 text-[#737A74]">{text}</p>
    </motion.div>
  );
}
