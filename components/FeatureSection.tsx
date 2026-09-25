"use client";

import { motion } from "framer-motion";
import { BarChart3, CheckSquare, CircleDollarSign, MessageSquareText, Users, Workflow } from "lucide-react";
import { Reveal } from "./motion/Reveal";

const features = [
  { Icon: BarChart3, title: "Project health", text: "Progress, owners, pace, and blockers without opening five reports." },
  { Icon: CheckSquare, title: "Approvals with context", text: "Proof, feedback, decisions, and audit history stay attached to the work." },
  { Icon: Users, title: "Workload visibility", text: "See who has room, who is near capacity, and where work is getting stuck." },
  { Icon: CircleDollarSign, title: "Spend next to work", text: "Track expenses and budget movement next to the project that created them." },
  { Icon: Workflow, title: "Team updates", text: "Turn recurring status work into a consistent operating rhythm." },
  { Icon: MessageSquareText, title: "Ask Pulse", text: "Query workspace context in plain language when a dashboard is not the fastest answer." },
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#737A74]">Core workflow</p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#F4F1EA] md:text-5xl">Built around the questions a team asks every day.</h2>
        </Reveal>

        <div className="mt-12 grid border-l border-t border-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, text }, index) => (
            <motion.article
              key={title}
              className="feature-motion-card group relative min-h-[190px] overflow-hidden border-b border-r border-white/[0.07] p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.55, delay: (index % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.018)" }}
            >
              <div aria-hidden="true" className="feature-card-sweep" />
              <motion.div whileHover={{ rotate: -4, scale: 1.08 }} transition={{ type: "spring", stiffness: 360, damping: 24 }}>
                <Icon className="h-5 w-5 text-[#D5BC7A]" />
              </motion.div>
              <h3 className="mt-8 text-base font-semibold text-[#E5E7E4]">{title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#737A74]">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
