"use client";

import { motion } from "framer-motion";
import { Check, FileText, Sparkles } from "lucide-react";
import { useState } from "react";

export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

export function DashboardCard({
  title,
  subtitle,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={cardVariants}
      whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.13)" }}
      className={`glass-raised rounded-2xl p-4 shadow-[0_18px_50px_rgba(0,0,0,0.26)] ${className}`}
    >
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#F0F2F8]">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs leading-5 text-[#6B7A9F]">{subtitle}</p> : null}
      </div>
      {children}
    </motion.section>
  );
}

export function StatusBadge({ label }: { label: string }) {
  const risk = label.includes("Risk") || label.includes("Near") || label.includes("Blocked");
  const review = label.includes("Review") || label.includes("Approval") || label.includes("Pending");
  const color = risk ? "#F87171" : review ? "#FBBF24" : label.includes("Available") || label.includes("Approved") || label.includes("Completed") ? "#00B4D8" : "#4ADE80";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.035] px-2 py-1 text-[11px] font-medium text-[#C8D0E8]">
      <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 1.8, repeat: Infinity }} />
      {label}
    </span>
  );
}

export function ProgressBar({ value, color = "#6D5DFB" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: "easeOut" }} />
    </div>
  );
}

export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
      <p className="text-xl font-semibold text-[#F0F2F8]">{value}</p>
      <p className="mt-1 text-xs text-[#6B7A9F]">{label}</p>
    </div>
  );
}

export function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#F0F2F8]">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7A9F]">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-6 text-center">
      <FileText className="mx-auto h-6 w-6 text-[#8B7FFF]" />
      <p className="mt-3 text-sm font-semibold text-[#F0F2F8]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#6B7A9F]">{description}</p>
    </div>
  );
}

const askFallback =
  "Website Redesign is the highest-risk project. It is 3 days behind pace because design approval is still pending.";

export function AskPulseCard({ answer = askFallback }: { answer?: string }) {
  const [response, setResponse] = useState(answer);
  const [activePrompt, setActivePrompt] = useState("What is at risk?");
  const [isLoading, setIsLoading] = useState(false);

  async function askPulse(prompt: string) {
    setActivePrompt(prompt);
    setIsLoading(true);

    try {
      const result = await fetch("/api/ask-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await result.json();
      setResponse(typeof data.answer === "string" ? data.answer : askFallback);
    } catch {
      setResponse(answer || askFallback);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DashboardCard title="Ask Pulse" subtitle="Command assistant for workspace context">
      <div className="flex flex-wrap gap-2">
        {["What is at risk?", "Who is overloaded?", "What needs approval?", "Write today's update"].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => askPulse(chip)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              activePrompt === chip
                ? "border-[#6D5DFB]/50 bg-[#6D5DFB]/15 text-white"
                : "border-white/10 bg-white/[0.035] text-[#9BA8C7] hover:border-white/20 hover:text-white"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>
      <motion.div
        key={response}
        className="mt-4 rounded-xl border border-[#00B4D8]/18 bg-[#00B4D8]/[0.07] p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#00B4D8]">
          <Sparkles className="h-3.5 w-3.5" />
          {isLoading ? "Thinking" : "Pulse answer"}
        </div>
        <p className="text-sm leading-6 text-[#D7E1F7]">{isLoading ? "Reading project, approval, workload, and expense context..." : response}</p>
      </motion.div>
    </DashboardCard>
  );
}

export function ActivityFeed({ items }: { items: string[] }) {
  return (
    <DashboardCard title="Recent Activity" subtitle="Latest workspace events">
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item} className="flex gap-3">
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.055] text-[11px] font-semibold text-[#8B7FFF]">{index + 1}</div>
            <div className="border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
              <p className="text-sm leading-5 text-[#C8D0E8]">{item}</p>
              <p className="mt-1 text-xs text-[#4D5E78]">{index + 8} min ago</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export function DemoButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-lg bg-[#6D5DFB] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#7C6EFC]">
      <Check className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
