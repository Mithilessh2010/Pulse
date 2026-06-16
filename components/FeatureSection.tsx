"use client";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckSquare,
  Users,
  CreditCard,
  Radio,
  MessageSquare,
} from "lucide-react";
import { features } from "@/lib/mockData";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  CheckSquare,
  Users,
  CreditCard,
  Radio,
  Sparkles: MessageSquare, // replace Sparkles with something less AI-gimmicky
};

// Muted, professional accent colors
const mutedAccents: Record<string, string> = {
  "#6D5DFB": "#6D5DFB",
  "#00D4FF": "#0EA5E9",
  "#31D67B": "#34D399",
  "#F8C14A": "#FBBF24",
  "#FF5C7A": "#F87171",
};

// Tone-down feature titles slightly
const cleanTitles: Record<string, string> = {
  "AI Project Pacing": "Project pacing",
  "Proof-Based Approvals": "Approval workflows",
  "Team Workload Visibility": "Workload visibility",
  "Expense Tracking": "Expense tracking",
  "Daily Standups": "Daily standups",
  "Ask Pulse": "Natural language search",
};

export default function FeatureSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-3" style={{ color: "#4D5E78" }}>
            What's inside
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-[-0.04em] leading-[1.02]" style={{ color: "#F0F2F8" }}>
            One place for everything
            <br />
            <span style={{ color: "#4D5E78", fontWeight: 400 }}>
              your team actually needs.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            const accent = mutedAccents[feature.accent] || feature.accent;
            const title = cleanTitles[feature.title] || feature.title;
            return (
              <motion.div
                key={feature.id}
                className="group relative flex flex-col gap-3.5 p-5 rounded-xl cursor-default"
                style={{
                  background: "rgba(12,18,32,0.8)",
                  border: "1px solid rgba(255,255,255,0.055)",
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={{
                  y: -2,
                  borderColor: `${accent}30`,
                  boxShadow: `0 12px 40px rgba(0,0,0,0.25), 0 0 16px ${accent}14`,
                }}
              >
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${accent}12`,
                    border: `1px solid ${accent}20`,
                  }}
                >
                  {Icon && <Icon size={16} color={accent} />}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-semibold text-[14px] font-display" style={{ color: "#D0D8EC" }}>
                    {title}
                  </h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#4D5E78" }}>
                    {feature.description.replace(/AI-generated /g, "").replace(/AI /g, "")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
