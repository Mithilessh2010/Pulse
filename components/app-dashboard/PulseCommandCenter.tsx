"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Command,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  Plus,
  ReceiptText,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { PulseLogo } from "@/components/PulseLogo";

const navItems = [
  { label: "Command Center", Icon: LayoutDashboard, active: true },
  { label: "Projects", Icon: FolderKanban },
  { label: "Tasks", Icon: ListChecks },
  { label: "Approvals", Icon: ClipboardCheck },
  { label: "Expenses", Icon: ReceiptText },
  { label: "Team", Icon: Users },
  { label: "Reports", Icon: Activity },
  { label: "Settings", Icon: Settings },
];

const projects = [
  {
    name: "Q3 Launch Review",
    progress: 68,
    status: "On Track",
    owner: "Maya",
    initials: "MC",
    finish: "Jul 22",
  },
  {
    name: "Website Redesign",
    progress: 42,
    status: "At Risk",
    owner: "Alex",
    initials: "AK",
    finish: "Jul 26",
  },
  {
    name: "Mobile App Launch",
    progress: 74,
    status: "On Track",
    owner: "Jordan",
    initials: "JR",
    finish: "Jul 31",
  },
  {
    name: "Internal Hiring Sprint",
    progress: 31,
    status: "Needs Review",
    owner: "Sam",
    initials: "SP",
    finish: "Aug 6",
  },
];

const teamCapacity = [
  { name: "Maya", load: 87, status: "Near Capacity" },
  { name: "Alex", load: 62, status: "On Track" },
  { name: "Jordan", load: 34, status: "Available" },
  { name: "Sam", load: 55, status: "On Track" },
];

const blockers = [
  "Design approval delaying Website Redesign",
  "AWS estimate waiting on finance",
  "Client feedback missing for landing page",
];

const tasks = [
  "Finalize Q3 deck",
  "Review design specs",
  "Approve AWS estimate",
  "Send client update",
  "Record demo walkthrough",
];

const activities = [
  "Maya submitted proof for Q3 dashboard task",
  "Alex requested approval on Website Redesign",
  "Jordan completed onboarding checklist",
  "Sam uploaded receipt for Linear subscription",
];

const promptChips = [
  "What is at risk?",
  "Who is overloaded?",
  "What needs approval?",
  "Write today's update",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
};

function statusTone(status: string) {
  if (status === "At Risk" || status === "Near Capacity") {
    return {
      border: "rgba(248,113,113,0.25)",
      background: "rgba(248,113,113,0.1)",
      color: "#FCA5A5",
      dot: "#F87171",
    };
  }

  if (status === "Needs Review") {
    return {
      border: "rgba(251,191,36,0.25)",
      background: "rgba(251,191,36,0.1)",
      color: "#FCD34D",
      dot: "#FBBF24",
    };
  }

  if (status === "Available") {
    return {
      border: "rgba(0,180,216,0.25)",
      background: "rgba(0,180,216,0.1)",
      color: "#67E8F9",
      dot: "#00B4D8",
    };
  }

  return {
    border: "rgba(74,222,128,0.22)",
    background: "rgba(74,222,128,0.1)",
    color: "#86EFAC",
    dot: "#4ADE80",
  };
}

function StatusBadge({ label }: { label: string }) {
  const tone = statusTone(label);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium"
      style={{ borderColor: tone.border, background: tone.background, color: tone.color }}
    >
      <motion.span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: tone.dot }}
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
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
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}

function DashboardCard({
  title,
  subtitle,
  icon,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={cardVariants}
      whileHover={{ y: -3, borderColor: "rgba(255,255,255,0.13)" }}
      className={`glass-raised rounded-2xl p-4 shadow-[0_18px_50px_rgba(0,0,0,0.26)] ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#F0F2F8]">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs leading-5 text-[#6B7A9F]">{subtitle}</p> : null}
        </div>
        {icon ? (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-[#8B7FFF]">
            {icon}
          </div>
        ) : null}
      </div>
      {children}
    </motion.section>
  );
}

function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-[260px] shrink-0 border-r border-white/[0.06] bg-[#07090F]/88 px-4 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <PulseLogo />
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">Pulse</p>
          <p className="text-xs text-[#4D5E78]">Team operating system</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map(({ label, Icon, active }) => (
          <motion.button
            key={label}
            type="button"
            whileHover={{ x: 3 }}
            className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium transition ${
              active
                ? "border border-[#6D5DFB]/30 bg-[#6D5DFB]/12 text-white"
                : "text-[#6B7A9F] hover:bg-white/[0.035] hover:text-[#C8D0E8]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </motion.button>
        ))}
      </nav>

      <div className="absolute bottom-5 left-4 right-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#4D5E78]">Workspace</p>
        <p className="mt-2 text-sm font-semibold text-[#F0F2F8]">Acme Ops</p>
        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6D5DFB] text-sm font-semibold text-white">
            M
          </div>
          <div>
            <p className="text-sm font-medium text-[#F0F2F8]">Mithilessh</p>
            <p className="text-xs text-[#6B7A9F]">Owner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AppTopbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#07090F]/82 px-4 py-4 backdrop-blur-xl md:px-6"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00B4D8]">
            <Command className="h-3.5 w-3.5" />
            Command Center
          </p>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#F0F2F8] md:text-3xl">
            Command Center
          </h1>
          <p className="mt-1 text-sm text-[#6B7A9F]">Live overview of work, people, approvals, and spend</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative block md:w-[360px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4D5E78]" />
            <input
              placeholder="Ask Pulse or search workspace..."
              className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.035] pl-9 pr-3 text-sm text-[#F0F2F8] outline-none transition placeholder:text-[#4D5E78] focus:border-[#6D5DFB]/70 focus:bg-white/[0.055]"
            />
          </label>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-[#9BA8C7] transition hover:text-white">
              <Bell className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111827] text-sm font-semibold text-white ring-1 ring-white/10">
              M
            </button>
            <motion.button
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#6D5DFB] px-4 text-[13px] font-semibold text-white shadow-[0_10px_28px_rgba(109,93,251,0.22)]"
            >
              <Plus className="h-4 w-4" />
              Create
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function MorningBriefingCard() {
  return (
    <DashboardCard
      title="AI Morning Briefing"
      subtitle="Prioritized from projects, approvals, blockers, and workload"
      icon={<Sparkles className="h-4 w-4" />}
      className="lg:col-span-2"
    >
      <div className="rounded-xl border border-[#6D5DFB]/20 bg-[linear-gradient(135deg,rgba(109,93,251,0.15),rgba(0,180,216,0.08))] p-4">
        <p className="text-[15px] leading-7 text-[#F0F2F8]">
          Today: 5 tasks are due, 3 approvals are waiting, 2 blockers need attention, and Website Redesign is 3 days behind pace.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-[#07090F]">
            View blockers
          </button>
          <button className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-[13px] font-medium text-[#C8D0E8] transition hover:text-white">
            Generate update
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}

function CompanyHealthCard() {
  return (
    <DashboardCard title="Company Health" subtitle="Weighted project and workload signal" icon={<TrendingUp className="h-4 w-4" />}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-5xl font-semibold tracking-[-0.04em] text-[#F0F2F8]">82%</p>
          <div className="mt-3 flex items-center gap-2">
            <StatusBadge label="Stable" />
            <span className="text-xs text-emerald-300">+6% from last week</span>
          </div>
        </div>
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-[10px] border-white/[0.06]" />
          <motion.div
            className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-[#00B4D8] border-r-[#6D5DFB]"
            initial={{ rotate: -120, opacity: 0 }}
            animate={{ rotate: 70, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[#9BA8C7]">
            Stable
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}

function ProjectHealthCard() {
  return (
    <DashboardCard title="Project Health" subtitle="Predicted finish and risk by initiative" icon={<FolderKanban className="h-4 w-4" />} className="xl:col-span-2">
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-[#F0F2F8]">{project.name}</p>
                <p className="mt-1 text-xs text-[#6B7A9F]">Predicted finish {project.finish}</p>
              </div>
              <StatusBadge label={project.status} />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[11px] font-semibold text-[#C8D0E8]">
                {project.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="text-[#6B7A9F]">Owner {project.owner}</span>
                  <span className="font-medium text-[#C8D0E8]">{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} color={project.status === "At Risk" ? "#F87171" : "#6D5DFB"} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

function ApprovalQueueCard() {
  return (
    <DashboardCard title="Approval Queue" subtitle="Tasks, spend, and client updates waiting" icon={<ClipboardCheck className="h-4 w-4" />}>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          ["3", "task approvals"],
          ["2", "expense approvals"],
          ["1", "client update"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <p className="text-xl font-semibold text-[#F0F2F8]">{value}</p>
            <p className="mt-1 text-[11px] leading-4 text-[#6B7A9F]">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-[#FBBF24]/20 bg-[#FBBF24]/10 p-3">
        <p className="text-sm font-medium text-[#F0F2F8]">Maya submitted proof for Q3 dashboard design</p>
        <div className="mt-3 flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400/90 px-3 py-2 text-xs font-semibold text-[#06110A]">
            <Check className="h-3.5 w-3.5" />
            Approve
          </button>
          <button className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-medium text-[#C8D0E8]">
            Request Changes
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}

function TeamCapacityCard() {
  return (
    <DashboardCard title="Team Capacity" subtitle="Workload by owner" icon={<Users className="h-4 w-4" />}>
      <div className="space-y-4">
        {teamCapacity.map((member) => (
          <div key={member.name}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#111827] text-[11px] font-semibold text-white ring-1 ring-white/10">
                  {member.name.slice(0, 1)}
                </div>
                <span className="text-sm font-medium text-[#F0F2F8]">{member.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#C8D0E8]">{member.load}%</span>
                <StatusBadge label={member.status} />
              </div>
            </div>
            <ProgressBar value={member.load} color={member.status === "Near Capacity" ? "#F87171" : "#00B4D8"} />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

function BlockersCard() {
  return (
    <DashboardCard title="Blockers" subtitle="Items slowing active work" icon={<AlertTriangle className="h-4 w-4" />}>
      <div className="space-y-2">
        {blockers.map((blocker) => (
          <div key={blocker} className="flex items-start gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.06] p-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#F87171]" />
            <p className="text-sm leading-5 text-[#F0F2F8]">{blocker}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

function ExpenseCard() {
  return (
    <DashboardCard title="Expenses and Budget" subtitle="Spend against monthly operating budget" icon={<CircleDollarSign className="h-4 w-4" />}>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-[#F0F2F8]">$4,820</p>
          <p className="mt-1 text-sm text-[#6B7A9F]">used of $7,500</p>
        </div>
        <p className="text-sm font-medium text-[#C8D0E8]">64% budget used</p>
      </div>
      <ProgressBar value={64} color="#FBBF24" />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
          <p className="text-lg font-semibold text-[#F0F2F8]">3</p>
          <p className="text-xs text-[#6B7A9F]">pending expenses</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
          <p className="text-sm font-semibold text-[#F0F2F8]">Software</p>
          <p className="text-xs text-[#6B7A9F]">highest category</p>
        </div>
      </div>
    </DashboardCard>
  );
}

function TasksCard() {
  return (
    <DashboardCard title="Tasks Due Today" subtitle="Work that needs movement before EOD" icon={<ListChecks className="h-4 w-4" />}>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <span className="h-4 w-4 rounded border border-white/15 bg-white/[0.025]" />
            <p className="text-sm text-[#C8D0E8]">{task}</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

function AskPulseCard() {
  return (
    <DashboardCard title="Ask Pulse" subtitle="Command assistant for your operating system" icon={<MessageSquareText className="h-4 w-4" />} className="xl:col-span-2">
      <div className="flex flex-wrap gap-2">
        {promptChips.map((chip) => (
          <button key={chip} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-[#9BA8C7] transition hover:border-[#6D5DFB]/40 hover:text-white">
            {chip}
          </button>
        ))}
      </div>
      <motion.div
        className="mt-4 rounded-xl border border-[#00B4D8]/18 bg-[#00B4D8]/[0.07] p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.65 }}
      >
        <p className="text-sm leading-6 text-[#D7E1F7]">
          Website Redesign is the highest-risk project. It is 3 days behind pace because design approval is still pending.
        </p>
      </motion.div>
    </DashboardCard>
  );
}

function ActivityFeed() {
  return (
    <DashboardCard title="Recent Activity" subtitle="Latest workspace events" icon={<Activity className="h-4 w-4" />}>
      <div className="space-y-3">
        {activities.map((item, index) => (
          <div key={item} className="flex gap-3">
            <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.055] text-[11px] font-semibold text-[#8B7FFF]">
              {index + 1}
            </div>
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

export default function PulseCommandCenter() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090F] text-white">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 38% at 18% 8%, rgba(109,93,251,0.12), transparent 70%), radial-gradient(ellipse 45% 32% at 88% 18%, rgba(0,180,216,0.08), transparent 70%)",
        }}
      />
      <div className="relative z-10 flex">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <AppTopbar />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 p-4 md:p-6 xl:grid-cols-4"
          >
            <MorningBriefingCard />
            <CompanyHealthCard />
            <ApprovalQueueCard />
            <ProjectHealthCard />
            <TeamCapacityCard />
            <BlockersCard />
            <ExpenseCard />
            <TasksCard />
            <AskPulseCard />
            <ActivityFeed />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
