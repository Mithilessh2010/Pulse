"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  Download,
  FileCheck,
  Filter,
  Plus,
  Table2,
} from "lucide-react";
import { useState } from "react";
import {
  activityFeed,
  approvals,
  askPulsePrompts,
  askPulseResponses,
  blockers,
  expenses,
  integrations,
  projects,
  reports,
  tasks,
  teamMembers,
} from "@/lib/mockData";
import {
  ActivityFeed,
  AskPulseCard,
  DashboardCard,
  DemoButton,
  EmptyState,
  MetricPill,
  PageHeader,
  ProgressBar,
  StatusBadge,
  cardVariants,
  containerVariants,
} from "@/components/app-shell/AppUI";

function priorityColor(priority: string) {
  if (priority === "High") return "#F87171";
  if (priority === "Medium") return "#FBBF24";
  return "#00B4D8";
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <motion.div variants={cardVariants} className="glass-raised rounded-2xl p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F0F2F8]">{project.name}</h3>
          <p className="mt-1 text-xs text-[#6B7A9F]">Owner {project.owner} · {project.tasks} tasks</p>
        </div>
        <StatusBadge label={project.statusLabel} />
      </div>
      <div className="mb-1.5 flex justify-between text-xs text-[#C8D0E8]">
        <span>Progress</span>
        <span>{project.progress}%</span>
      </div>
      <ProgressBar value={project.progress} color={project.statusLabel === "At Risk" ? "#F87171" : "#6D5DFB"} />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <MetricPill label="Predicted finish" value={project.predictedFinish} />
        <MetricPill label="Budget" value={project.budget} />
      </div>
    </motion.div>
  );
}

function TaskCard({ task }: { task: (typeof tasks)[number] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#F0F2F8]">{task.title}</p>
          <p className="mt-1 text-xs text-[#6B7A9F]">{task.project} · Owner {task.owner} · Due {task.due}</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-md border border-white/10 px-2 py-1 text-[11px] text-[#C8D0E8]" style={{ color: priorityColor(task.priority) }}>{task.priority}</span>
          <StatusBadge label={task.status} />
        </div>
      </div>
      <p className="mt-3 text-xs text-[#7F8BA6]">Proof: {task.proof}</p>
    </div>
  );
}

function ApprovalCard({ approval }: { approval: (typeof approvals)[number] }) {
  const [decision, setDecision] = useState<"pending" | "approved" | "changes">("pending");
  const statusLabel = decision === "approved" ? "Approved" : decision === "changes" ? "Changes Requested" : approval.type;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#F0F2F8]">{approval.title}</p>
          <p className="mt-1 text-xs text-[#6B7A9F]">{approval.type} · {approval.project} · {approval.time}</p>
        </div>
        <StatusBadge label={statusLabel} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[#C8D0E8]">{approval.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {approval.attachments.map((chip) => (
          <span key={chip} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-[#9BA8C7]">{chip}</span>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm leading-6 text-[#D7E1F7]">{approval.aiNote}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDecision("approved")}
          className="inline-flex items-center gap-2 rounded-lg bg-[#6D5DFB] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#7C6EFC]"
        >
          <Check className="h-3.5 w-3.5" />
          Approve
        </button>
        <button
          type="button"
          onClick={() => setDecision("changes")}
          className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-medium text-[#C8D0E8] transition hover:border-white/20 hover:text-white"
        >
          Request Changes
        </button>
      </div>
    </div>
  );
}

export function CommandCenterScreen() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4 xl:grid-cols-4">
      <DashboardCard title="AI Morning Briefing" subtitle="Priority signals across the workspace" className="xl:col-span-2">
        <div className="rounded-xl border border-[#6D5DFB]/20 bg-[linear-gradient(135deg,rgba(109,93,251,0.15),rgba(0,180,216,0.08))] p-4">
          <p className="text-[15px] leading-7 text-[#F0F2F8]">Today: 5 tasks are due, 3 approvals are waiting, 2 blockers need attention, and Website Redesign is 3 days behind pace.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-[#07090F]">View blockers</button>
            <button className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-[13px] font-medium text-[#C8D0E8]">Generate update</button>
          </div>
        </div>
      </DashboardCard>
      <DashboardCard title="Company Health" subtitle="+6% from last week">
        <p className="text-5xl font-semibold tracking-[-0.04em] text-white">82%</p>
        <div className="mt-3 flex items-center gap-2"><StatusBadge label="Stable" /><span className="text-xs text-emerald-300">+6%</span></div>
      </DashboardCard>
      <DashboardCard title="Expenses/Budget" subtitle="Monthly workspace spend">
        <p className="text-2xl font-semibold text-white">$4,820 <span className="text-sm font-normal text-[#6B7A9F]">of $7,500</span></p>
        <div className="mt-3"><ProgressBar value={64} color="#FBBF24" /></div>
        <p className="mt-3 text-sm text-[#C8D0E8]">64% used · 3 pending expenses · Software highest category</p>
      </DashboardCard>
      <DashboardCard title="Project Health" subtitle="Predicted finish and risk" className="xl:col-span-2">
        <div className="space-y-3">{projects.slice(0, 4).map((project) => <ProjectCard key={project.name} project={project} />)}</div>
      </DashboardCard>
      <DashboardCard title="Approval Queue" subtitle="3 task approvals · 2 expense approvals · 1 client update" className="xl:col-span-2">
        <ApprovalCard approval={approvals[0]} />
      </DashboardCard>
      <DashboardCard title="Team Capacity" subtitle="Workload health and support needed">
        <div className="space-y-4">{teamMembers.map((m) => <div key={m.name}><div className="mb-2 flex justify-between text-sm"><span className="text-[#F0F2F8]">{m.name}</span><span className="text-[#C8D0E8]">{m.load}% · {m.status}</span></div><ProgressBar value={m.load} color={m.status === "Near Capacity" ? "#F87171" : "#00B4D8"} /></div>)}</div>
      </DashboardCard>
      <DashboardCard title="Blockers" subtitle="Items slowing active work">
        <div className="space-y-2">{blockers.map((b) => <div key={b} className="flex gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.06] p-3 text-sm text-[#F0F2F8]"><AlertTriangle className="h-4 w-4 shrink-0 text-[#F87171]" />{b}</div>)}</div>
      </DashboardCard>
      <DashboardCard title="Tasks Due Today" subtitle="Work needing movement">
        <div className="space-y-2">{tasks.slice(0, 5).map((task) => <TaskCard key={task.title} task={task} />)}</div>
      </DashboardCard>
      <AskPulseCard answer={askPulseResponses["What projects are at risk?"]} />
      <ActivityFeed items={activityFeed} />
    </motion.div>
  );
}

export function ProjectsScreen() {
  const [view, setView] = useState("Grid");

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Projects" description="Plan work, track health, and see predicted delivery across active initiatives." action={<button className="inline-flex items-center gap-2 rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Create Project</button>} />
      <div className="mb-4 flex flex-wrap gap-2">{["Grid", "Kanban", "Timeline"].map((option) => <button key={option} type="button" onClick={() => setView(option)} className={`rounded-lg border border-white/10 px-3 py-2 text-sm ${view === option ? "bg-[#6D5DFB] text-white" : "bg-white/[0.035] text-[#9BA8C7]"}`}>{option}</button>)}</div>
      <div className="grid gap-4 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.name} project={project} />)}</div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard title="Featured Project Detail" subtitle="Website Redesign pacing preview"><ProjectCard project={projects[1]} /><p className="mt-4 text-sm leading-6 text-[#C8D0E8]">AI pacing insight: design approval is the critical path dependency. Move review to today to recover two days.</p></DashboardCard>
        <DashboardCard title="Kanban Preview" subtitle="Planning, In Progress, Review, Done"><div className="grid gap-2 sm:grid-cols-4">{["Planning","In Progress","Review","Done"].map((col) => <div key={col} className="rounded-xl border border-white/10 bg-white/[0.025] p-3"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7A9F]">{col}</p>{projects.filter((p) => p.column === col).map((p) => <div key={p.name} className="mb-2 rounded-lg bg-white/[0.045] p-2 text-xs text-[#C8D0E8]">{p.name}</div>)}</div>)}</div></DashboardCard>
      </div>
    </motion.div>
  );
}

export function TasksScreen() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filters = ["All", "My Tasks", "Due Today", "Blocked", "Waiting Approval", "Completed"];
  const visible = (filter === "All" ? tasks : tasks.filter((task) => task.status === filter || (filter === "My Tasks" && task.owner === "Sam"))).filter((task) => {
    const text = `${task.title} ${task.project} ${task.owner} ${task.priority}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Tasks" description="Review priorities, proof status, due dates, owners, and task detail context." />
      <div className="mb-4 flex flex-wrap gap-2">{filters.map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-lg border border-white/10 px-3 py-2 text-sm ${filter === f ? "bg-[#6D5DFB] text-white" : "bg-white/[0.035] text-[#9BA8C7]"}`}><Filter className="mr-1 inline h-3.5 w-3.5" />{f}</button>)}</div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <DashboardCard title="Task List" subtitle="Search and review active work"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="mb-3 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-[#F0F2F8] outline-none transition placeholder:text-[#6B7A9F] focus:border-[#6D5DFB]/50" /><div className="space-y-2">{visible.length ? visible.map((task) => <TaskCard key={task.title} task={task} />) : <EmptyState title="No tasks found" description="Try a different search or filter." />}</div></DashboardCard>
        <DashboardCard title="Task Detail" subtitle="Proof submission and review mockup"><TaskCard task={tasks[0]} /><div className="mt-4 space-y-2">{tasks[0].subtasks.map((s) => <div key={s} className="flex items-center gap-2 text-sm text-[#C8D0E8]"><Check className="h-4 w-4 text-emerald-300" />{s}</div>)}</div><div className="mt-4 flex flex-wrap gap-2">{["Attach link","File","Screenshot","Video"].map((chip) => <span key={chip} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#9BA8C7]">{chip}</span>)}</div><div className="mt-4 flex gap-2"><DemoButton>Approve</DemoButton><button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#C8D0E8]">Request Changes</button></div></DashboardCard>
      </div>
    </motion.div>
  );
}

export function ApprovalsScreen() {
  const [tab, setTab] = useState("All");
  const tabs = ["Task Proof", "Expenses", "Client Updates", "All"];
  const visible = tab === "All" ? approvals : approvals.filter((a) => a.type === tab);
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Approvals" description="Proof, expense, and client update reviews with context attached." /><div className="mb-4 flex flex-wrap gap-2">{tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-lg border border-white/10 px-3 py-2 text-sm ${tab === t ? "bg-[#6D5DFB] text-white" : "bg-white/[0.035] text-[#9BA8C7]"}`}>{t}</button>)}</div><div className="grid gap-4 lg:grid-cols-2">{visible.map((approval) => <ApprovalCard key={approval.title} approval={approval} />)}</div></motion.div>;
}

export function ExpensesScreen() {
  const [expenseRows, setExpenseRows] = useState(Array.from(expenses));

  function updateExpense(item: string, status: string) {
    setExpenseRows((rows) => rows.map((row) => (row.item === item ? { ...row, status } : row)));
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Expenses" description="Track spend, approve expenses, and keep budgets tied to project work." action={<button className="inline-flex items-center gap-2 rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Submit expense</button>} /><div className="grid gap-4 lg:grid-cols-4"><MetricPill label="Budget used" value="$4,820" /><MetricPill label="Budget total" value="$7,500" /><MetricPill label="Used" value="64%" /><MetricPill label="Pending" value={String(expenseRows.filter((e) => e.status !== "Approved").length)} /></div><div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><DashboardCard title="Expense Approval Queue" subtitle="Local approval workflow for the MVP"><div className="space-y-2">{expenseRows.map((e) => <div key={e.item} className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><div className="flex flex-wrap justify-between gap-3"><p className="text-sm font-semibold text-[#F0F2F8]">{e.item}</p><StatusBadge label={e.status} /></div><p className="mt-1 text-xs text-[#6B7A9F]">{e.amount} · {e.category} · {e.owner}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => updateExpense(e.item, "Approved")} className="rounded-lg bg-[#6D5DFB] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#7C6EFC]">Approve</button><button type="button" onClick={() => updateExpense(e.item, "Needs Review")} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-[#C8D0E8] transition hover:border-white/20 hover:text-white">Request Changes</button></div></div>)}</div></DashboardCard><DashboardCard title="Category Breakdown" subtitle="Export buttons are demo only"><ProgressBar value={64} color="#FBBF24" /><div className="mt-4 grid gap-2">{["Software", "Infrastructure", "Meals", "Design"].map((c) => <div key={c} className="rounded-lg border border-white/10 p-3 text-sm text-[#C8D0E8]">{c}</div>)}</div><div className="mt-4 flex gap-2"><button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#9BA8C7]"><Download className="mr-1 inline h-3.5 w-3.5" />CSV</button><button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#9BA8C7]"><Download className="mr-1 inline h-3.5 w-3.5" />PDF</button></div></DashboardCard></div></motion.div>;
}

export function TeamScreen() {
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Team" description="Workload health, support needed, availability, and delivery confidence without surveillance." /><DashboardCard title="Workload philosophy" subtitle="How Pulse frames team visibility"><p className="text-sm leading-6 text-[#C8D0E8]">Pulse focuses on workload health and support needed, not surveillance-based productivity scoring.</p></DashboardCard><div className="mt-4 grid gap-4 lg:grid-cols-4">{teamMembers.map((m) => <DashboardCard key={m.name} title={m.name} subtitle={m.role}><div className="mb-3 flex items-center justify-between"><StatusBadge label={m.status} /><span className="text-sm text-[#C8D0E8]">{m.load}%</span></div><ProgressBar value={m.load} color={m.status === "Near Capacity" ? "#F87171" : "#00B4D8"} /><div className="mt-4 space-y-2 text-sm text-[#C8D0E8]"><p>Current tasks: {m.currentTasks}</p><p>Completed this week: {m.completedThisWeek}</p><p>Support needed: {m.supportNeeded}</p><p>Delivery confidence: {m.confidence}</p></div></DashboardCard>)}</div></motion.div>;
}

export function AskScreen() {
  const [prompt, setPrompt] = useState(askPulsePrompts[0]);
  const [answer, setAnswer] = useState(askPulseResponses[askPulsePrompts[0]]);
  const [isLoading, setIsLoading] = useState(false);

  async function askPulse(nextPrompt = prompt) {
    const cleanPrompt = nextPrompt.trim();
    if (!cleanPrompt) return;

    setPrompt(cleanPrompt);
    setIsLoading(true);
    try {
      const response = await fetch("/api/ask-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });
      const data = await response.json();
      setAnswer(typeof data.answer === "string" ? data.answer : askPulseResponses[cleanPrompt] ?? askPulseResponses[askPulsePrompts[0]]);
    } catch {
      setAnswer(askPulseResponses[cleanPrompt] ?? askPulseResponses[askPulsePrompts[0]]);
    } finally {
      setIsLoading(false);
    }
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Ask Pulse" description="A premium command interface for questions about projects, tasks, approvals, workload, and spend." /><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><DashboardCard title="Command" subtitle="AI responses use mock workspace data"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="min-h-[130px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-lg text-[#F0F2F8] outline-none transition placeholder:text-[#6B7A9F] focus:border-[#6D5DFB]/50" /><div className="mt-4 flex flex-wrap gap-2">{askPulsePrompts.map((p) => <button key={p} type="button" onClick={() => askPulse(p)} className={`rounded-full border px-3 py-1.5 text-xs ${prompt === p ? "border-[#6D5DFB]/50 bg-[#6D5DFB]/15 text-white" : "border-white/10 bg-white/[0.035] text-[#9BA8C7]"}`}>{p}</button>)}</div><button type="button" onClick={() => askPulse()} disabled={isLoading} className="mt-4 rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7C6EFC] disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Generating answer..." : "Ask Pulse"}</button><motion.div key={answer} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-4 text-sm leading-6 text-[#D7E1F7]">{isLoading ? "Reviewing projects, tasks, approvals, workload, and spend..." : answer}</motion.div></DashboardCard><DashboardCard title="Context Panel" subtitle="What Ask Pulse can read"><div className="grid gap-2">{["Projects","Tasks","Approvals","Expenses","Team workload","Reports"].map((item) => <div key={item} className="rounded-lg border border-white/10 p-3 text-sm text-[#C8D0E8]">{item}</div>)}</div></DashboardCard></div></motion.div>;
}

export function ReportsScreen() {
  const [generated, setGenerated] = useState(false);

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Reports" description="Generate summaries and export-ready views from workspace activity." action={<button type="button" onClick={() => setGenerated(true)} className="rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7C6EFC]">Generate report</button>} /><div className="grid gap-4 lg:grid-cols-3">{reports.map((report) => <DashboardCard key={report} title={report} subtitle={generated ? "Generated from current mock data" : "Report template ready"}><p className="text-sm leading-6 text-[#C8D0E8]">{generated ? "Generated report is ready for review and export." : "Prepared from mock projects, approvals, workload, and expense data."}</p><div className="mt-4 flex gap-2"><button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#9BA8C7]"><FileCheck className="mr-1 inline h-3.5 w-3.5" />PDF</button><button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#9BA8C7]"><Table2 className="mr-1 inline h-3.5 w-3.5" />CSV</button></div></DashboardCard>)}</div><div className="mt-4"><DashboardCard title="AI-generated leadership update" subtitle={generated ? "Freshly generated summary" : "Mock weekly summary"}><p className="text-sm leading-6 text-[#D7E1F7]">{generated ? "Generated: Website Redesign remains the highest-risk project, approvals are the main bottleneck, and budget is at 64% usage with software as the highest category." : "This week, the team completed 24 tasks, moved Q3 Launch to 68%, and resolved 4 blockers. Website Redesign remains at risk due to delayed design approval."}</p></DashboardCard></div></motion.div>;
}

export function SettingsScreen() {
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Settings" description="Workspace profile, team roles, notifications, integrations, billing, and security placeholders." /><div className="grid gap-4 lg:grid-cols-2"><DashboardCard title="Workspace Profile" subtitle="Demo workspace settings"><div className="space-y-3 text-sm text-[#C8D0E8]"><p>Workspace: Acme Ops</p><p>Owner: Mithilessh</p><p>Role: Owner</p></div></DashboardCard><DashboardCard title="Notification Settings" subtitle="Demo toggles"><div className="grid gap-2">{["Approval waiting", "Budget threshold", "Blocked task", "Weekly report"].map((item) => <div key={item} className="flex justify-between rounded-lg border border-white/10 p-3 text-sm text-[#C8D0E8]"><span>{item}</span><StatusBadge label="On" /></div>)}</div></DashboardCard><DashboardCard title="API and AI Settings" subtitle="OpenRouter placeholder"><div className="space-y-3 text-sm text-[#C8D0E8]"><div className="rounded-lg border border-white/10 bg-white/[0.035] p-3"><p className="font-semibold text-[#F0F2F8]">Ask Pulse model</p><p className="mt-1 text-xs text-[#6B7A9F]">Configured server-side with OPENROUTER_MODEL.</p></div><div className="rounded-lg border border-white/10 bg-white/[0.035] p-3"><p className="font-semibold text-[#F0F2F8]">API key security</p><p className="mt-1 text-xs text-[#6B7A9F]">The OpenRouter key stays on the server and is never exposed to the browser.</p></div><StatusBadge label="Connected" /></div></DashboardCard><DashboardCard title="Integrations Preview" subtitle="Not configured yet"><div className="grid gap-2 sm:grid-cols-2">{integrations.map((item) => <div key={item} className="rounded-lg border border-white/10 p-3 text-sm text-[#C8D0E8]">{item}<p className="mt-1 text-xs text-[#6B7A9F]">Coming soon</p></div>)}</div></DashboardCard><DashboardCard title="Billing and Security" subtitle="Placeholders for later"><div className="space-y-3"><EmptyState title="Billing placeholder" description="Stripe billing is not connected in this demo MVP." /><EmptyState title="Security placeholder" description="SSO and enterprise controls belong on the future security roadmap." /></div></DashboardCard></div></motion.div>;
}
