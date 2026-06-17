"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  Check,
  ClipboardCheck,
  Command,
  Github,
  Kanban,
  Layers,
  Link2,
  Receipt,
  Slack,
  TrendingUp,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const featureCards = [
  {
    title: "AI Project Pacing",
    label: "Best for delivery risk",
    description: "See whether projects are ahead, on track, or falling behind based on real task progress.",
    Icon: TrendingUp,
  },
  {
    title: "Proof-Based Approvals",
    label: "Best for manager review",
    description: "Employees submit summaries, links, files, screenshots, or videos before work is marked approved.",
    Icon: ClipboardCheck,
  },
  {
    title: "Team Workload Visibility",
    label: "Best for capacity planning",
    description: "Understand who is overloaded, who has capacity, and where support is needed.",
    Icon: Users,
  },
  {
    title: "Expense Tracking",
    label: "Best for project spend",
    description: "Submit, review, and approve expenses while tracking project budgets.",
    Icon: Receipt,
  },
  {
    title: "Ask Pulse",
    label: "Best for fast answers",
    description: "Ask natural questions about projects, blockers, approvals, workload, and spend.",
    Icon: Command,
  },
  {
    title: "AI Standups",
    label: "Best for async teams",
    description: "Generate daily updates from real workspace activity instead of endless check-ins.",
    Icon: CalendarCheck,
  },
  {
    title: "Reports & Insights",
    label: "Best for leadership updates",
    description: "Turn team activity into weekly summaries, progress reports, and leadership updates.",
    Icon: BarChart3,
  },
  {
    title: "Unified Workspace",
    label: "Best for operating rhythm",
    description: "Bring tasks, approvals, updates, budgets, and team visibility into one operating system.",
    Icon: Layers,
  },
];

const heroTiles = [
  ["Project Pacing", "68%", "#00B4D8"],
  ["Proof Approvals", "3 waiting", "#FBBF24"],
  ["Team Capacity", "Maya 87%", "#F87171"],
  ["Expense Tracking", "$4.8k used", "#6D5DFB"],
  ["Ask Pulse", "At risk?", "#00B4D8"],
  ["Reports", "Weekly ready", "#4ADE80"],
];

const projectRows = [
  ["Q3 Launch Review", "68%", "On Track", "Predicted Jul 22", "#4ADE80"],
  ["Website Redesign", "42%", "At Risk", "Predicted Jul 26", "#F87171"],
  ["Mobile App Launch", "74%", "On Track", "Predicted Jul 31", "#4ADE80"],
];

const capacityRows = [
  ["Maya", 87, "Near Capacity", "#F87171"],
  ["Alex", 62, "On Track", "#4ADE80"],
  ["Jordan", 34, "Available", "#00B4D8"],
  ["Sam", 55, "On Track", "#4ADE80"],
];

const comparisonRows = [
  ["Project progress", "Manual updates", "Live pacing and predicted finish dates"],
  ["Task completion", "Click done", "Submit proof and approve work"],
  ["Team visibility", "Hard to see capacity", "Workload health and support needed"],
  ["Expenses", "Separate expense app", "Connected to projects and approvals"],
  ["Updates", "Manual standups", "AI-generated daily and weekly summaries"],
  ["Reporting", "Spreadsheets", "Live dashboard and export-ready insights"],
];

const integrations = [
  "Slack",
  "Microsoft Teams",
  "GitHub",
  "Google Calendar",
  "Google Drive",
  "Notion",
  "QuickBooks",
  "Jira",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" } },
};

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto mb-10 max-w-3xl text-center"
    >
      {eyebrow ? (
        <motion.p variants={itemVariants} className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00B4D8]">
          {eyebrow}
        </motion.p>
      ) : null}
      <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-[-0.02em] text-[#F0F2F8] md:text-5xl">
        {title}
      </motion.h2>
      {description ? (
        <motion.p variants={itemVariants} className="mt-4 text-base leading-7 text-[#7F8BA6]">
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.035] px-2 py-1 text-[11px] font-medium text-[#C8D0E8]">
      <motion.span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      {label}
    </span>
  );
}

function ProgressBar({ value, color = "#6D5DFB" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: "easeOut" }}
      />
    </div>
  );
}

function FeatureMockShell({
  title,
  description,
  benefits,
  children,
  reverse = false,
}: {
  title: string;
  description: string;
  benefits: string[];
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`grid gap-8 py-16 lg:grid-cols-2 lg:items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#F0F2F8] md:text-4xl">{title}</h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#7F8BA6]">{description}</p>
        <div className="mt-6 grid gap-3">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3 text-sm text-[#C8D0E8]">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#00B4D8]/20 bg-[#00B4D8]/10 text-[#67E8F9]">
                <Check className="h-3.5 w-3.5" />
              </span>
              {benefit}
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="glass-raised rounded-[24px] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
        {children}
      </motion.div>
    </motion.section>
  );
}

export default function FeaturesPageContent() {
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
        className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-6 pb-16 pt-28 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
      >
        <div>
          <motion.p variants={itemVariants} className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00B4D8]">
            Features
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-5xl font-bold leading-[1.04] tracking-[-0.02em] text-[#F0F2F8] md:text-6xl">
            Features built for teams that move fast.
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 max-w-xl text-base leading-8 text-[#7F8BA6] md:text-[17px]">
            Pulse gives teams one place to plan work, track progress, approve deliverables, manage spend, understand capacity, and ask what needs attention.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-3">
            <motion.a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6D5DFB] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(109,93,251,0.24)]"
              whileHover={{ y: -1, backgroundColor: "#7C6EFC" }}
              whileTap={{ scale: 0.98 }}
            >
              Start Free
              <ArrowRight className="h-4 w-4" />
            </motion.a>
            <a className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[13px] font-medium text-[#C8D0E8] transition hover:border-white/20 hover:text-white" href="/app">
              View Dashboard Demo
            </a>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="relative">
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00B4D8]/10"
            animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.2, 0.38, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="glass-raised relative rounded-[24px] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="grid gap-3 sm:grid-cols-2">
              {heroTiles.map(([label, value, color]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <div className="mb-4 h-1.5 w-10 rounded-full" style={{ background: color }} />
                  <p className="text-sm font-semibold text-[#F0F2F8]">{label}</p>
                  <p className="mt-2 text-xl font-semibold text-[#C8D0E8]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionHeader title="Everything your team needs to stay aligned." />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          {featureCards.map(({ title, description, label, Icon }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              whileHover={{ y: -4, borderColor: "rgba(109,93,251,0.35)", boxShadow: "0 18px 52px rgba(109,93,251,0.11)" }}
              className="glass-raised rounded-2xl p-5"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-[#8B7FFF]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#4D5E78]">{label}</p>
              <h3 className="text-lg font-semibold text-[#F0F2F8]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B7A9F]">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <FeatureMockShell
          title="Know if you are on pace before deadlines slip."
          description="Pulse compares planned progress with actual completion, approval delays, blockers, and team capacity to show whether a project is truly on track."
          benefits={["Predict finish dates", "Flag delayed dependencies", "Surface bottlenecks early"]}
        >
          <div className="space-y-3 rounded-[20px] border border-white/[0.06] bg-[#07090F]/45 p-4">
            {projectRows.map(([name, percent, status, finish, color]) => (
              <div key={name} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#F0F2F8]">{name}</p>
                    <p className="mt-1 text-xs text-[#6B7A9F]">{finish}</p>
                  </div>
                  <StatusBadge label={status} color={color} />
                </div>
                <div className="mb-1.5 flex justify-between text-xs text-[#C8D0E8]">
                  <span>Progress</span>
                  <span>{percent}</span>
                </div>
                <ProgressBar value={Number(percent.replace("%", ""))} color={color} />
              </div>
            ))}
          </div>
        </FeatureMockShell>

        <FeatureMockShell
          reverse
          title="Completed does not mean approved."
          description="Pulse lets teams submit proof of work before tasks are officially approved, so managers can review deliverables without hunting through messages and files."
          benefits={["Clear review trail", "Fewer vague task completions", "Faster manager feedback"]}
        >
          <div className="rounded-[20px] border border-white/[0.06] bg-[#07090F]/45 p-4">
            <p className="text-sm font-semibold text-[#F0F2F8]">Finalize Q3 launch dashboard</p>
            <p className="mt-1 text-xs text-[#6B7A9F]">Submitted by Maya</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-[#C8D0E8]">
              Added final KPI sections, cleaned executive summary, and linked the handoff proof.
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Figma link", "Screenshot", "Spec file"].map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-[#9BA8C7]">{chip}</span>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm text-[#C8D0E8]">
              AI quality note: Submission matches 4 of 5 task requirements.
            </div>
            <div className="mt-4 flex gap-2">
              <span className="rounded-lg bg-emerald-400/90 px-3 py-2 text-xs font-semibold text-[#06110A]">Approve</span>
              <span className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-medium text-[#C8D0E8]">Request Changes</span>
            </div>
          </div>
        </FeatureMockShell>

        <FeatureMockShell
          title="See workload without turning work into surveillance."
          description="Pulse focuses on workload health, support needed, and delivery confidence — not individual surveillance metrics."
          benefits={["Spot overload early", "Reassign work fairly", "Protect team focus"]}
        >
          <div className="space-y-4 rounded-[20px] border border-white/[0.06] bg-[#07090F]/45 p-4">
            {capacityRows.map(([name, load, status, color]) => (
              <div key={name as string}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#F0F2F8]">{name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#C8D0E8]">{load}%</span>
                    <StatusBadge label={status as string} color={color as string} />
                  </div>
                </div>
                <ProgressBar value={load as number} color={color as string} />
              </div>
            ))}
          </div>
        </FeatureMockShell>

        <FeatureMockShell
          reverse
          title="Keep spend connected to the work."
          description="Pulse connects expenses to projects, approvals, and budgets so teams know where money is going before it becomes a surprise."
          benefits={["Project-based budgets", "Expense approval queue", "Export-ready reporting later"]}
        >
          <div className="rounded-[20px] border border-white/[0.06] bg-[#07090F]/45 p-4">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-3xl font-semibold text-[#F0F2F8]">$4,820</p>
                <p className="mt-1 text-sm text-[#6B7A9F]">used of $7,500</p>
              </div>
              <p className="text-sm text-[#C8D0E8]">64% budget used</p>
            </div>
            <ProgressBar value={64} color="#FBBF24" />
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {["3 expenses pending", "Highest category: Software", "Linear subscription — $96 — Sam"].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm leading-5 text-[#C8D0E8]">{item}</div>
              ))}
            </div>
          </div>
        </FeatureMockShell>

        <FeatureMockShell
          title="Ask your workspace what needs attention."
          description="Instead of digging through tabs, managers can ask Pulse direct questions and get answers from project, task, approval, workload, and budget data."
          benefits={["Faster decisions", "Less manual reporting", "Better team visibility"]}
        >
          <div className="rounded-[20px] border border-white/[0.06] bg-[#07090F]/45 p-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-[#F0F2F8]">
              Which projects are at risk?
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-3 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-4 text-sm leading-6 text-[#D7E1F7]"
            >
              Website Redesign is the highest-risk project. It is 3 days behind pace because design approval is still pending.
            </motion.div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["What is at risk?", "Who is overloaded?", "What needs approval?", "Write this week's update"].map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-[#9BA8C7]">{chip}</span>
              ))}
            </div>
          </div>
        </FeatureMockShell>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionHeader title="Not just another task board." />
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] backdrop-blur-xl"
        >
          <div className="grid min-w-[720px] grid-cols-[1fr_1.1fr_1.25fr] border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#4D5E78]">
            <span>Feature</span>
            <span>Traditional task tools</span>
            <span>Pulse</span>
          </div>
          <div className="overflow-x-auto">
            {comparisonRows.map(([feature, traditional, pulse]) => (
              <div key={feature} className="grid min-w-[720px] grid-cols-[1fr_1.1fr_1.25fr] border-b border-white/[0.06] px-4 py-4 text-sm last:border-0">
                <span className="font-medium text-[#F0F2F8]">{feature}</span>
                <span className="text-[#6B7A9F]">{traditional}</span>
                <span className="text-[#C8D0E8]">{pulse}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionHeader
          title="Built to connect with the tools teams already use."
          description="Pulse can start as your command center, then connect with the tools your team already uses as the product grows."
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {integrations.map((integration) => (
            <motion.div key={integration} variants={itemVariants} className="glass-raised flex items-center gap-3 rounded-2xl p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-[#8B7FFF]">
                {integration === "Slack" ? <Slack className="h-5 w-5" /> : integration === "GitHub" ? <Github className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F0F2F8]">{integration}</p>
                <p className="mt-1 text-xs text-[#6B7A9F]">Coming soon</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="relative z-10 px-6 pb-20 md:px-10">
        <div className="glass-raised mx-auto max-w-5xl rounded-[28px] p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#F0F2F8] md:text-5xl">
            Give your team one place to see what matters.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#7F8BA6]">
            Projects, approvals, expenses, workload, and insights — connected in one operating system.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#6D5DFB] px-5 py-3 text-[13px] font-semibold text-white">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/app" className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[13px] font-medium text-[#C8D0E8]">
              View Dashboard Demo
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
