"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FileText, Info, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: "easeOut" } },
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
      className={`glass-raised rounded-2xl p-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)] ${className}`}
    >
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{subtitle}</p> : null}
      </div>
      {children}
    </motion.section>
  );
}

export function StatusBadge({ label }: { label: string }) {
  const risk = label.includes("Risk") || label.includes("Near") || label.includes("Blocked") || label.includes("Rejected") || label.includes("High");
  const review = label.includes("Review") || label.includes("Approval") || label.includes("Pending") || label.includes("Waiting") || label.includes("Medium");
  const color = risk ? "#F87171" : review ? "#FBBF24" : label.includes("Available") || label.includes("Approved") || label.includes("Completed") || label.includes("Low") ? "#00B4D8" : "#4ADE80";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--card-bg)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)]">
      <motion.span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 1.8, repeat: Infinity }} />
      {label}
    </span>
  );
}

export function RiskBadge({ label }: { label: string }) {
  return <StatusBadge label={`${label} Risk`} />;
}

export function ProgressBar({ value, color = "#6D5DFB" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--card-bg)]">
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: "easeOut" }} />
    </div>
  );
}

export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3">
      <p className="text-xl font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#00B4D8]" />
      {label}
    </span>
  );
}

export function ActionButton({
  children,
  className,
  disabled,
  doneLabel = "Saved",
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  className: string;
  disabled?: boolean;
  doneLabel?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}) {
  const [confirmed, setConfirmed] = useState(false);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    setConfirmed(true);
    window.setTimeout(() => onClick?.(event), 140);
    window.setTimeout(() => setConfirmed(false), 900);
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
      className={`${className} ${confirmed ? "pulse-action-confirmed" : ""}`}
    >
      <motion.span
        key={confirmed ? "confirmed" : "idle"}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="inline-flex items-center gap-2"
      >
        {confirmed ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            {doneLabel}
          </>
        ) : (
          children
        )}
      </motion.span>
    </motion.button>
  );
}

export function TooltipInfo({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <Info className="h-4 w-4 text-[var(--text-muted)]" />
      <span className="pointer-events-none absolute left-1/2 top-6 z-20 w-64 -translate-x-1/2 rounded-xl border border-[var(--border-subtle)] bg-[var(--pulse-panel)] p-3 text-xs leading-5 text-[var(--text-secondary)] opacity-0 shadow-2xl transition group-hover:opacity-100 group-focus-within:opacity-100">
        {text}
      </span>
    </span>
  );
}

export function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--card-bg)] p-6 text-center">
      <FileText className="mx-auto h-6 w-6 text-[#8B7FFF]" />
      <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
    </div>
  );
}

const askFallback =
  "Website Redesign is the highest-risk project. It is 3 days behind pace because design approval is still pending.";

export function AskPulseCard({ answer = askFallback }: { answer?: string }) {
  const [response, setResponse] = useState(answer);
  const [activePrompt, setActivePrompt] = useState("What is at risk?");
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<"openrouter" | "fallback" | "error">("fallback");

  async function askPulse(prompt: string) {
    setActivePrompt(prompt);
    setIsLoading(true);

    try {
      const result = await fetch("/api/ask-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await result.json();
      setResponse(typeof data.answer === "string" ? data.answer : askFallback);
      setSource(data.source === "openrouter" ? "openrouter" : "fallback");
    } catch {
      setResponse(answer || askFallback);
      setSource("error");
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
                : "border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
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
          {!isLoading ? <span className="ml-auto rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">{source === "openrouter" ? "Live AI" : source === "error" ? "Workspace answer" : "Workspace answer"}</span> : null}
        </div>
        {isLoading ? <LoadingSpinner label="Reading project, approval, workload, and expense context..." /> : <p className="text-sm leading-6 text-[var(--text-secondary)]">{response}</p>}
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
            <div className="border-b border-[var(--border-subtle)] pb-3 last:border-0 last:pb-0">
              <p className="text-sm leading-5 text-[var(--text-secondary)]">{item}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{index + 8} min ago</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
