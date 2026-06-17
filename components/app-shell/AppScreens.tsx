"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileCheck,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Table2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
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
  RiskBadge,
  StatusBadge,
  LoadingSpinner,
  TooltipInfo,
  cardVariants,
  containerVariants,
} from "@/components/app-shell/AppUI";

function priorityColor(priority: string) {
  if (priority === "High") return "#F87171";
  if (priority === "Medium") return "#FBBF24";
  return "#00B4D8";
}

function ProjectCard({ project, onView }: { project: (typeof projects)[number]; onView?: () => void }) {
  return (
    <motion.div variants={cardVariants} whileHover={{ y: -3 }} className="glass-raised rounded-2xl p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#F0F2F8]">{project.name}</h3>
          <p className="mt-1 text-xs text-[#6B7A9F]">Owner {project.owner} · {project.completedTasks}/{project.tasks} tasks · Due {project.due}</p>
        </div>
        <StatusBadge label={project.statusLabel} />
      </div>
      <div className="mb-1.5 flex justify-between text-xs text-[#C8D0E8]">
        <span>Progress</span>
        <span>{project.progress}%</span>
      </div>
      <ProgressBar value={project.progress} color={project.statusLabel === "At Risk" ? "#F87171" : "#6D5DFB"} />
      <div className="mt-3 flex flex-wrap gap-2">
        <RiskBadge label={project.deadlineRisk} />
        <RiskBadge label={project.budgetRisk} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <MetricPill label="Predicted finish" value={project.predictedFinish} />
        <MetricPill label="Budget" value={project.budgetLabel} />
      </div>
      {onView ? (
        <button type="button" onClick={onView} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-semibold text-[#C8D0E8] transition hover:border-[#6D5DFB]/40 hover:text-white">
          View details
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </motion.div>
  );
}

function TaskCard({ task, onClick }: { task: (typeof tasks)[number]; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-xl border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-[#6D5DFB]/35 hover:bg-white/[0.055]">
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
      <p className="mt-3 text-xs text-[#7F8BA6]">Proof: {task.proof} · Comments: {task.comments} · {task.proofRequired ? "Proof required" : "No proof required"}</p>
    </button>
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
        <div className="flex flex-wrap gap-2"><StatusBadge label={approval.priority} /><StatusBadge label={statusLabel} /></div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#C8D0E8]">{approval.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {approval.attachments.map((chip) => (
          <span key={chip} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-[#9BA8C7]">{chip}</span>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm leading-6 text-[#D7E1F7]">{approval.aiNote}</div>
      <div className="mt-3 flex flex-wrap gap-2">{approval.auditTrail.map((event) => <span key={event} className="rounded-md border border-white/10 bg-white/[0.025] px-2 py-1 text-[11px] text-[#7F8BA6]">{event}</span>)}</div>
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
  const blockersRef = useRef<HTMLDivElement>(null);
  const [briefingUpdate, setBriefingUpdate] = useState("");
  const [commandPrompt, setCommandPrompt] = useState("");
  const [commandAnswer, setCommandAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  function viewBlockers() {
    blockersRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    blockersRef.current?.classList.add("ring-2", "ring-red-400/40");
    window.setTimeout(() => blockersRef.current?.classList.remove("ring-2", "ring-red-400/40"), 1400);
  }

  async function askCommand(prompt = commandPrompt) {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;
    setCommandPrompt(cleanPrompt);
    setIsAsking(true);
    try {
      const response = await fetch("/api/ask-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cleanPrompt }),
      });
      const data = await response.json();
      setCommandAnswer(typeof data.answer === "string" ? data.answer : askPulseResponses[cleanPrompt] ?? askPulseResponses["What projects are at risk?"]);
    } catch {
      setCommandAnswer(askPulseResponses[cleanPrompt] ?? askPulseResponses["What projects are at risk?"]);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4 xl:grid-cols-4">
      <DashboardCard title="AI Morning Briefing" subtitle="Priority signals across the workspace" className="xl:col-span-2">
        <div className="rounded-xl border border-[#6D5DFB]/20 bg-[linear-gradient(135deg,rgba(109,93,251,0.15),rgba(0,180,216,0.08))] p-4">
          <p className="text-[15px] leading-7 text-[#F0F2F8]">Today: 5 tasks are due, 3 approvals are waiting, 2 blockers need attention, and Website Redesign is 3 days behind pace.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={viewBlockers} className="rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-[#07090F] transition hover:bg-[#D7E1F7]">View blockers</button>
            <button type="button" onClick={() => setBriefingUpdate(askPulseResponses["Write a weekly leadership update"])} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-[13px] font-medium text-[#C8D0E8] transition hover:border-white/20 hover:text-white">Generate update</button>
            <a href="/app/ask" className="rounded-lg border border-[#00B4D8]/20 bg-[#00B4D8]/10 px-3 py-2 text-[13px] font-medium text-[#D7E1F7] transition hover:border-[#00B4D8]/40">Ask Pulse</a>
          </div>
          {briefingUpdate ? <div className="mt-4 rounded-xl border border-white/10 bg-[#07090F]/45 p-3 text-sm leading-6 text-[#D7E1F7]">{briefingUpdate}</div> : null}
        </div>
      </DashboardCard>
      <DashboardCard title="Command Bar" subtitle="Ask Pulse what needs attention" className="xl:col-span-2">
        <form onSubmit={(event) => { event.preventDefault(); askCommand(); }} className="flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4D5E78]" />
            <input value={commandPrompt} onChange={(event) => setCommandPrompt(event.target.value)} placeholder="Ask Pulse what needs attention..." className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-9 pr-3 text-sm text-[#F0F2F8] outline-none transition placeholder:text-[#4D5E78] focus:border-[#6D5DFB]/60" />
          </label>
          <button disabled={isAsking} className="rounded-xl bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7C6EFC] disabled:opacity-60">Submit</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">{["What is at risk?", "Who needs support?", "What needs approval?", "Write today's update"].map((prompt) => <button key={prompt} type="button" onClick={() => askCommand(prompt)} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-[#9BA8C7] transition hover:border-white/20 hover:text-white">{prompt}</button>)}</div>
        {isAsking ? <div className="mt-4"><LoadingSpinner label="Checking workspace context..." /></div> : null}
        {commandAnswer && !isAsking ? <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm leading-6 text-[#D7E1F7]">{commandAnswer}</motion.div> : null}
      </DashboardCard>
      <DashboardCard title="Company Health" subtitle="+6% from last week">
        <p className="text-5xl font-semibold tracking-[-0.04em] text-white">82%</p>
        <div className="mt-3 flex items-center gap-2"><StatusBadge label="Stable" /><span className="text-xs text-emerald-300">+6%</span></div>
        <p className="mt-4 text-xs leading-5 text-[#6B7A9F]">Combines project health, blockers, approval queue pressure, and budget risk.</p>
      </DashboardCard>
      <DashboardCard title="Expenses/Budget" subtitle="Monthly workspace spend">
        <p className="text-2xl font-semibold text-white">$4,820 <span className="text-sm font-normal text-[#6B7A9F]">of $7,500</span></p>
        <div className="mt-3"><ProgressBar value={64} color="#FBBF24" /></div>
        <p className="mt-3 text-sm text-[#C8D0E8]">64% used · 3 pending expenses · Software highest category</p>
      </DashboardCard>
      <DashboardCard title="Project Health" subtitle="Predicted finish and risk" className="xl:col-span-2">
        <div className="space-y-3">{projects.map((project) => <ProjectCard key={project.name} project={project} />)}</div>
        <a href="/app/projects" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#00B4D8]">Open projects <ArrowRight className="h-4 w-4" /></a>
      </DashboardCard>
      <DashboardCard title="Approval Queue" subtitle="3 task approvals · 2 expense approvals · 1 client update" className="xl:col-span-2">
        <ApprovalCard approval={approvals[0]} />
      </DashboardCard>
      <DashboardCard title="Team Workload Health" subtitle="Capacity, availability, and support needs">
        <div className="mb-3 flex items-center gap-2 text-xs text-[#6B7A9F]">
          Workload estimate
          <TooltipInfo text="Pulse estimates workload health from assigned tasks, deadlines, blockers, and meeting load. It is not a productivity score." />
        </div>
        <div className="space-y-4">{teamMembers.map((m) => <div key={m.name}><div className="mb-2 flex justify-between text-sm"><span className="text-[#F0F2F8]">{m.shortName}</span><span className="text-[#C8D0E8]">{m.capacity}% · {m.availability}</span></div><ProgressBar value={m.capacity} color={m.status === "Near Capacity" ? "#F87171" : "#00B4D8"} /><p className="mt-1 text-xs text-[#6B7A9F]">Focus load: {m.focusLoad} · Support: {m.supportNeeded ? "Yes" : "No"}</p></div>)}</div>
      </DashboardCard>
      <DashboardCard title="Blockers" subtitle="Items slowing active work" className="transition" >
        <div ref={blockersRef} className="space-y-2 rounded-xl transition">
          {blockers.map((b) => <div key={b.id} className="rounded-xl border border-red-400/15 bg-red-400/[0.06] p-3"><div className="flex gap-3 text-sm text-[#F0F2F8]"><AlertTriangle className="h-4 w-4 shrink-0 text-[#F87171]" />{b.title}</div><p className="mt-2 text-xs leading-5 text-[#9BA8C7]">Owner {b.owner} · {b.impact}</p><p className="mt-1 text-xs leading-5 text-[#FBBF24]">Next: {b.suggestedNextAction}</p></div>)}
        </div>
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
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Risk");
  const [selectedProject, setSelectedProject] = useState(projects[1]);
  const filteredProjects = projects
    .filter((project) => status === "All" || project.health === status)
    .filter((project) => project.name.toLowerCase().includes(query.toLowerCase()) || project.owner.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sort === "Progress") return b.progress - a.progress;
      if (sort === "Due date") return a.daysLeft - b.daysLeft;
      const score = { High: 3, Medium: 2, Low: 1 };
      return (score[b.deadlineRisk as keyof typeof score] ?? 0) - (score[a.deadlineRisk as keyof typeof score] ?? 0);
    });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Projects" description="Plan work, track health, and see predicted delivery across active initiatives." action={<button className="inline-flex items-center gap-2 rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Create Project</button>} />
      <div className="mb-4 flex flex-wrap gap-2">{["Grid", "Kanban", "Timeline"].map((option) => <button key={option} type="button" onClick={() => setView(option)} className={`rounded-lg border border-white/10 px-3 py-2 text-sm ${view === option ? "bg-[#6D5DFB] text-white" : "bg-white/[0.035] text-[#9BA8C7]"}`}>{option}</button>)}</div>
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects or owners..." className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-[#F0F2F8] outline-none placeholder:text-[#6B7A9F] focus:border-[#6D5DFB]/50" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-white/10 bg-[#0A0F1C] px-3 py-2 text-sm text-[#C8D0E8] outline-none">
          {["All", "On Track", "At Risk", "Needs Review", "Blocked"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-white/10 bg-[#0A0F1C] px-3 py-2 text-sm text-[#C8D0E8] outline-none">
          {["Risk", "Progress", "Due date"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {view === "Grid" ? <div className="grid gap-4 lg:grid-cols-3">{filteredProjects.map((project) => <ProjectCard key={project.name} project={project} onView={() => setSelectedProject(project)} />)}</div> : null}
      {view === "Kanban" ? <div className="grid gap-3 md:grid-cols-4">{["Planning","In Progress","Review","Done"].map((col) => <DashboardCard key={col} title={col} subtitle={`${projects.filter((p) => p.column === col).length} projects`}><div className="space-y-2">{projects.filter((p) => p.column === col).map((p) => <button type="button" onClick={() => setSelectedProject(p)} key={p.name} className="w-full rounded-lg border border-white/10 bg-white/[0.035] p-3 text-left text-xs text-[#C8D0E8] transition hover:border-[#6D5DFB]/35"><span className="font-semibold text-[#F0F2F8]">{p.name}</span><span className="mt-1 block">{p.progress}% · {p.health}</span></button>)}</div></DashboardCard>)}</div> : null}
      {view === "Timeline" ? <DashboardCard title="Timeline" subtitle="Predicted finish against due date"><div className="space-y-4">{filteredProjects.map((project) => <div key={project.id}><div className="mb-2 flex justify-between text-sm"><span className="text-[#F0F2F8]">{project.name}</span><span className="text-[#6B7A9F]">Due {project.due} · Finish {project.predictedFinish}</span></div><div className="h-8 rounded-full border border-white/10 bg-white/[0.035] p-1"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(project.progress, 18)}%` }} className="h-full rounded-full bg-[linear-gradient(90deg,#6D5DFB,#00B4D8)]" /></div></div>)}</div></DashboardCard> : null}
      {!filteredProjects.length ? <EmptyState title="No projects found" description="Try another status, search term, or sort option." /> : null}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard title="Project Detail" subtitle={`${selectedProject.name} pacing preview`}><ProjectCard project={selectedProject} /><p className="mt-4 text-sm leading-6 text-[#C8D0E8]">AI pacing insight: {selectedProject.insight}</p></DashboardCard>
        <DashboardCard title="Risk Breakdown" subtitle="Deadline, budget, blockers, and team context"><div className="grid gap-3 sm:grid-cols-2"><MetricPill label="Deadline risk" value={selectedProject.deadlineRisk} /><MetricPill label="Budget risk" value={selectedProject.budgetRisk} /><MetricPill label="Spend" value={selectedProject.spendLabel} /><MetricPill label="Blockers" value={String(selectedProject.blockersCount)} /></div><div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-[#C8D0E8]">Owner {selectedProject.owner} · Team size {selectedProject.team} · {selectedProject.completedTasks}/{selectedProject.tasks} tasks complete</div></DashboardCard>
      </div>
    </motion.div>
  );
}

export function TasksScreen() {
  const [filter, setFilter] = useState("All");
  const [priority, setPriority] = useState("All priorities");
  const [owner, setOwner] = useState("All owners");
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState(tasks[1]);
  const [taskDecision, setTaskDecision] = useState("Waiting Review");
  const filters = ["All", "My Tasks", "Due Today", "Blocked", "Waiting Approval", "Completed"];
  const visible = (filter === "All" ? tasks : tasks.filter((task) => task.status === filter || (filter === "My Tasks" && task.owner === "Sam")))
    .filter((task) => priority === "All priorities" || task.priority === priority)
    .filter((task) => owner === "All owners" || task.owner === owner)
    .filter((task) => {
      const text = `${task.title} ${task.project} ${task.owner} ${task.priority}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Tasks" description="Review priorities, proof status, due dates, owners, and task detail context." />
      <div className="mb-4 flex flex-wrap gap-2">{filters.map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-lg border border-white/10 px-3 py-2 text-sm ${filter === f ? "bg-[#6D5DFB] text-white" : "bg-white/[0.035] text-[#9BA8C7]"}`}><Filter className="mr-1 inline h-3.5 w-3.5" />{f}</button>)}</div>
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <select value={priority} onChange={(event) => setPriority(event.target.value)} className="rounded-lg border border-white/10 bg-[#0A0F1C] px-3 py-2 text-sm text-[#C8D0E8] outline-none">{["All priorities", "High", "Medium", "Low"].map((item) => <option key={item}>{item}</option>)}</select>
        <select value={owner} onChange={(event) => setOwner(event.target.value)} className="rounded-lg border border-white/10 bg-[#0A0F1C] px-3 py-2 text-sm text-[#C8D0E8] outline-none">{["All owners", ...Array.from(new Set(tasks.map((task) => task.owner)))].map((item) => <option key={item}>{item}</option>)}</select>
        <div className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-[#9BA8C7]"><SlidersHorizontal className="mr-2 inline h-4 w-4" />Sorted by urgency</div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <DashboardCard title="Task List" subtitle="Search and review active work"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="mb-3 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-[#F0F2F8] outline-none transition placeholder:text-[#6B7A9F] focus:border-[#6D5DFB]/50" /><div className="space-y-2">{visible.length ? visible.map((task) => <TaskCard key={task.title} task={task} onClick={() => { setSelectedTask(task); setTaskDecision("Waiting Review"); }} />) : <EmptyState title="No tasks found" description="Try a different search or filter." />}</div></DashboardCard>
        <DashboardCard title="Task Detail" subtitle="Proof submission and review mockup"><div className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><p className="text-sm font-semibold text-[#F0F2F8]">{selectedTask.title}</p><p className="mt-1 text-xs leading-5 text-[#6B7A9F]">{selectedTask.project} · {selectedTask.owner} · {selectedTask.due}</p><div className="mt-3 flex flex-wrap gap-2"><StatusBadge label={selectedTask.priority} /><StatusBadge label={taskDecision} /></div></div><div className="mt-4 space-y-2">{selectedTask.subtasks.map((s) => <div key={s} className="flex items-center gap-2 text-sm text-[#C8D0E8]"><Check className="h-4 w-4 text-emerald-300" />{s}</div>)}</div><div className="mt-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm leading-6 text-[#D7E1F7]">AI review: {selectedTask.aiReview}</div><div className="mt-4 flex flex-wrap gap-2">{["Link","File","Screenshot","Video"].map((chip) => <span key={chip} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#9BA8C7]">{chip}</span>)}</div><div className="mt-4 flex gap-2"><button type="button" onClick={() => setTaskDecision("Approved")} className="rounded-lg bg-[#6D5DFB] px-3 py-2 text-xs font-semibold text-white">Approve</button><button type="button" onClick={() => setTaskDecision("Changes Requested")} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#C8D0E8]">Request Changes</button></div></DashboardCard>
      </div>
    </motion.div>
  );
}

export function ApprovalsScreen() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Waiting");
  const tabs = ["All", "Task Proof", "Expenses", "Client Updates"];
  const visible = (tab === "All" ? approvals : approvals.filter((a) => a.type === tab))
    .filter((approval) => statusFilter === "All statuses" || approval.status === statusFilter)
    .filter((approval) => `${approval.title} ${approval.project} ${approval.submittedBy}`.toLowerCase().includes(search.toLowerCase()));

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Approvals" description="Proof, expense, and client update reviews with context attached." action={<button className="rounded-lg border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-[#C8D0E8]">Bulk approve demo</button>} /><div className="mb-4 grid gap-4 lg:grid-cols-4"><MetricPill label="Waiting" value="6" /><MetricPill label="High priority" value="2" /><MetricPill label="Avg review time" value="4.2h" /><MetricPill label="Oldest item" value="2 days" /></div><div className="mb-4 flex flex-wrap gap-2">{tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-lg border border-white/10 px-3 py-2 text-sm ${tab === t ? "bg-[#6D5DFB] text-white" : "bg-white/[0.035] text-[#9BA8C7]"}`}>{t}</button>)}</div><div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search approvals..." className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-[#F0F2F8] outline-none placeholder:text-[#6B7A9F] focus:border-[#6D5DFB]/50" /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-white/10 bg-[#0A0F1C] px-3 py-2 text-sm text-[#C8D0E8] outline-none">{["Waiting", "All statuses"].map((item) => <option key={item}>{item}</option>)}</select></div><div className="grid gap-4 lg:grid-cols-2">{visible.length ? visible.map((approval) => <ApprovalCard key={approval.title} approval={approval} />) : <EmptyState title="No approvals match" description="Clear your search or choose another tab." />}</div></motion.div>;
}

export function ExpensesScreen() {
  const [expenseRows, setExpenseRows] = useState(Array.from(expenses));
  const [tab, setTab] = useState("All");
  const [showSubmit, setShowSubmit] = useState(false);

  function updateExpense(item: string, status: (typeof expenses)[number]["status"]) {
    setExpenseRows((rows) => rows.map((row) => (row.item === item ? { ...row, status } : row)));
  }
  const visibleExpenses = expenseRows.filter((expense) => tab === "All" || expense.status === tab);

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Expenses" description="Track spend, approve expenses, and keep budgets tied to project work." action={<button type="button" onClick={() => setShowSubmit(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Submit expense</button>} />{showSubmit ? <div className="mb-4 rounded-2xl border border-[#6D5DFB]/25 bg-[#6D5DFB]/10 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-[#F0F2F8]">Submit expense demo</p><p className="mt-1 text-sm text-[#9BA8C7]">Real reimbursement submission will connect after accounting integrations are configured.</p></div><button aria-label="Close submit expense demo" onClick={() => setShowSubmit(false)} className="rounded-lg border border-white/10 p-2 text-[#9BA8C7]"><X className="h-4 w-4" /></button></div></div> : null}<div className="grid gap-4 lg:grid-cols-4"><MetricPill label="Budget used" value="$4,820" /><MetricPill label="Budget total" value="$7,500" /><MetricPill label="Used" value="64%" /><MetricPill label="Pending" value={String(expenseRows.filter((e) => e.status !== "Approved").length)} /></div><div className="mt-4 flex flex-wrap gap-2">{["All", "Pending", "Needs Approval", "Approved", "Rejected"].map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-lg border border-white/10 px-3 py-2 text-sm ${tab === item ? "bg-[#6D5DFB] text-white" : "bg-white/[0.035] text-[#9BA8C7]"}`}>{item}</button>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><DashboardCard title="Expense Approval Queue" subtitle="Local approval workflow for the MVP"><div className="space-y-2">{visibleExpenses.length ? visibleExpenses.map((e) => <div key={e.item} className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><div className="flex flex-wrap justify-between gap-3"><p className="text-sm font-semibold text-[#F0F2F8]">{e.vendor}</p><StatusBadge label={e.status} /></div><p className="mt-1 text-xs text-[#6B7A9F]">{e.amount} · {e.category} · {e.submittedBy} · {e.project}</p><p className="mt-2 text-xs text-[#7F8BA6]">Receipt: {e.receiptStatus} · AI category: {e.aiCategorySuggestion}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => updateExpense(e.item, "Approved")} className="rounded-lg bg-[#6D5DFB] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#7C6EFC]">Approve</button><button type="button" onClick={() => updateExpense(e.item, "Rejected")} className="rounded-lg border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-xs text-red-200 transition hover:border-red-300/40">Reject</button><button type="button" onClick={() => updateExpense(e.item, "Needs Approval")} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-[#C8D0E8] transition hover:border-white/20 hover:text-white">Request Changes</button></div></div>) : <EmptyState title="No expenses in this tab" description="Choose another expense status to review." />}</div></DashboardCard><DashboardCard title="Budget and Categories" subtitle="Alerts, project spend, and exports"><StatusBadge label="Medium Risk" /><ProgressBar value={64} color="#FBBF24" /><p className="mt-3 text-sm text-[#C8D0E8]">$4,820 used of $7,500. Highest category: Software.</p><div className="mt-4 grid gap-2">{["Software", "Infrastructure", "Meals", "Design"].map((c) => <div key={c} className="rounded-lg border border-white/10 p-3 text-sm text-[#C8D0E8]">{c}</div>)}</div><div className="mt-4 overflow-hidden rounded-xl border border-white/10"><table className="w-full text-left text-xs text-[#C8D0E8]"><tbody>{projects.slice(0, 4).map((project) => <tr key={project.id} className="border-b border-white/10 last:border-0"><td className="p-2">{project.name}</td><td className="p-2 text-right">{project.spendLabel}</td></tr>)}</tbody></table></div><div className="mt-4 flex gap-2"><button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#9BA8C7]"><Download className="mr-1 inline h-3.5 w-3.5" />CSV</button><button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#9BA8C7]"><Download className="mr-1 inline h-3.5 w-3.5" />PDF</button></div></DashboardCard></div></motion.div>;
}

export function TeamScreen() {
  const [selectedMember, setSelectedMember] = useState(teamMembers[0]);

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Team" description="Workload health, support needed, availability, and delivery confidence without surveillance." /><DashboardCard title="Workload philosophy" subtitle="How Pulse frames team visibility"><p className="text-sm leading-6 text-[#C8D0E8]">Pulse does not score people. It helps managers spot workload risk and support needs using tasks, deadlines, blockers, and capacity.</p><div className="mt-3 flex items-center gap-2 text-xs text-[#6B7A9F]">Workload Health <TooltipInfo text="Pulse estimates workload health from assigned tasks, deadlines, blockers, and meeting load. It is not a productivity score." /></div></DashboardCard><div className="mt-4 grid gap-4 lg:grid-cols-4">{teamMembers.map((m) => <DashboardCard key={m.name} title={m.name} subtitle={m.role}><button type="button" onClick={() => setSelectedMember(m)} className="mb-3 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-left transition hover:border-[#6D5DFB]/35"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6D5DFB] text-sm font-semibold text-white">{m.initials}</span><span><span className="block text-sm font-semibold text-[#F0F2F8]">{m.shortName}</span><span className="text-xs text-[#6B7A9F]">{m.availability}</span></span></button><div className="mb-3 flex items-center justify-between"><StatusBadge label={m.status} /><span className="text-sm text-[#C8D0E8]">{m.capacity}%</span></div><ProgressBar value={m.capacity} color={m.status === "Near Capacity" ? "#F87171" : "#00B4D8"} /><div className="mt-4 space-y-2 text-sm text-[#C8D0E8]"><p>Focus load: {m.focusLoad}</p><p>Support needed: {m.supportNeeded ? "Yes" : "No"}</p><p>Assigned tasks: {m.assignedTasks}</p><p>Blocked tasks: {m.blockedTasks}</p><p>Delivery confidence: {m.deliveryConfidence}</p></div></DashboardCard>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.9fr]"><DashboardCard title="Team Member Detail" subtitle={`${selectedMember.name} workload context`}><div className="grid gap-3 sm:grid-cols-2"><MetricPill label="Capacity" value={`${selectedMember.capacity}%`} /><MetricPill label="Availability" value={selectedMember.availability} /><MetricPill label="Completed this week" value={String(selectedMember.completedThisWeek)} /><MetricPill label="Blocked tasks" value={String(selectedMember.blockedTasks)} /></div><div className="mt-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm leading-6 text-[#D7E1F7]">Suggested action: {selectedMember.suggestedAction}</div></DashboardCard><DashboardCard title="Capacity Recommendations" subtitle="Balancing support without surveillance"><div className="space-y-2">{["Move one task from Maya to Jordan", "Ask Alex whether design approval is blocked", "Sam needs finance numbers before Investor Update can continue"].map((action) => <div key={action} className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-[#C8D0E8]">{action}</div>)}</div></DashboardCard></div></motion.div>;
}

export function AskScreen() {
  const [prompt, setPrompt] = useState(askPulsePrompts[0]);
  const [answer, setAnswer] = useState(askPulseResponses[askPulsePrompts[0]]);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<"openrouter" | "fallback" | "error">("fallback");
  const [history, setHistory] = useState([{ prompt: askPulsePrompts[0], answer: askPulseResponses[askPulsePrompts[0]], source: "fallback" }]);

  async function askPulse(nextPrompt = prompt) {
    const cleanPrompt = nextPrompt.trim();
    if (!cleanPrompt) return;

    setPrompt(cleanPrompt);
    setIsLoading(true);
    try {
      const response = await fetch("/api/ask-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: cleanPrompt }),
      });
      const data = await response.json();
      const nextAnswer = typeof data.answer === "string" ? data.answer : askPulseResponses[cleanPrompt] ?? askPulseResponses[askPulsePrompts[0]];
      const nextSource = data.source === "openrouter" ? "openrouter" : "fallback";
      setAnswer(nextAnswer);
      setSource(nextSource);
      setHistory((items) => [...items, { prompt: cleanPrompt, answer: nextAnswer, source: nextSource }]);
    } catch {
      const nextAnswer = askPulseResponses[cleanPrompt] ?? askPulseResponses[askPulsePrompts[0]];
      setAnswer(nextAnswer);
      setSource("error");
      setHistory((items) => [...items, { prompt: cleanPrompt, answer: nextAnswer, source: "error" }]);
    } finally {
      setIsLoading(false);
    }
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Ask Pulse" description="A premium command interface for questions about projects, tasks, approvals, workload, and spend." /><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><DashboardCard title="Command Center Chat" subtitle="AI responses use mock workspace data"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about blockers, workload, approvals, budget, or what to do next..." className="min-h-[130px] w-full resize-none rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-lg text-[#F0F2F8] outline-none transition placeholder:text-[#6B7A9F] focus:border-[#6D5DFB]/50" /><div className="mt-4 flex flex-wrap gap-2">{askPulsePrompts.map((p) => <button key={p} type="button" onClick={() => askPulse(p)} className={`rounded-full border px-3 py-1.5 text-xs ${prompt === p ? "border-[#6D5DFB]/50 bg-[#6D5DFB]/15 text-white" : "border-white/10 bg-white/[0.035] text-[#9BA8C7]"}`}>{p}</button>)}</div><div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={() => askPulse()} disabled={isLoading} className="rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7C6EFC] disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Generating answer..." : "Ask Pulse"}</button><button type="button" onClick={() => navigator.clipboard?.writeText(answer)} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-[#C8D0E8]"><Copy className="mr-1 inline h-3.5 w-3.5" />Copy response</button><StatusBadge label={source === "openrouter" ? "Live AI" : source === "error" ? "Fallback" : "Demo-safe"} /></div><motion.div key={answer} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-4 text-sm leading-6 text-[#D7E1F7]">{isLoading ? <LoadingSpinner label="Reviewing projects, tasks, approvals, workload, and spend..." /> : answer}</motion.div><div className="mt-4 space-y-3">{history.slice(-4).map((item, index) => <div key={`${item.prompt}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.025] p-3"><p className="text-xs font-semibold text-[#9BA8C7]">{item.prompt}</p><p className="mt-2 text-sm leading-6 text-[#D7E1F7]">{item.answer}</p></div>)}</div></DashboardCard><DashboardCard title="Context Panel" subtitle="What Ask Pulse can read"><div className="grid gap-2">{["Projects","Tasks","Approvals","Expenses","Team workload","Reports"].map((item) => <div key={item} className="rounded-lg border border-white/10 p-3 text-sm text-[#C8D0E8]">{item}</div>)}</div><div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7A9F]">Suggested follow-ups</p><div className="mt-3 space-y-2">{["What should I do next?", "Which project needs an owner decision?", "Draft a client update."].map((item) => <button key={item} onClick={() => askPulse(item)} className="block w-full rounded-lg border border-white/10 px-3 py-2 text-left text-xs text-[#C8D0E8] hover:border-[#6D5DFB]/35">{item}</button>)}</div></div></DashboardCard></div></motion.div>;
}

export function ReportsScreen() {
  const [generated, setGenerated] = useState(false);

  const summary = "This week, the team completed 24 tasks, moved Q3 Launch to 68%, and resolved 4 blockers. Website Redesign remains at risk due to delayed design approval. Maya is near capacity, while Jordan has room to take on additional work.";

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Reports" description="Generate summaries and export-ready views from workspace activity." action={<button type="button" onClick={() => setGenerated(true)} className="rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7C6EFC]">Generate report</button>} /><div className="grid gap-4 lg:grid-cols-3">{reports.map((report) => <DashboardCard key={report} title={report} subtitle={generated ? "Generated from current mock data" : "Report template ready"}><p className="text-sm leading-6 text-[#C8D0E8]">{generated ? "Generated report is ready for review and export." : "Prepared from mock projects, approvals, workload, and expense data."}</p><div className="mt-4 flex gap-2"><button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#9BA8C7]"><FileCheck className="mr-1 inline h-3.5 w-3.5" />PDF</button><button className="rounded-lg border border-white/10 px-3 py-2 text-xs text-[#9BA8C7]"><Table2 className="mr-1 inline h-3.5 w-3.5" />CSV</button></div></DashboardCard>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]"><DashboardCard title="Leadership Update Draft" subtitle={generated ? "Freshly generated summary" : "Mock weekly summary"}><p className="text-sm leading-6 text-[#D7E1F7]">{generated ? summary : "Click Generate report to prepare an executive-ready weekly update from mock workspace activity."}</p><button type="button" onClick={() => navigator.clipboard?.writeText(summary)} className="mt-4 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-[#C8D0E8]"><Copy className="mr-1 inline h-3.5 w-3.5" />Copy update</button></DashboardCard><DashboardCard title="Report Preview" subtitle="Executive signals"><div className="space-y-3">{["Website Redesign at risk", "Maya near capacity", "64% budget used", "6 approvals waiting"].map((item) => <div key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-[#C8D0E8]"><CheckCircle2 className="h-4 w-4 text-[#00B4D8]" />{item}</div>)}</div></DashboardCard></div></motion.div>;
}

export function SettingsScreen() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "Daily briefing": true,
    "Approval reminders": true,
    "Budget alerts": true,
    "Blocker alerts": true,
    "Weekly reports": true,
  });

  function toggleSetting(item: string) {
    setToggles((current) => ({ ...current, [item]: !current[item] }));
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Settings" description="Workspace profile, team roles, notifications, integrations, billing, and security placeholders." />
      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardCard title="Workspace Profile" subtitle="Demo workspace settings">
          <div className="space-y-3 text-sm text-[#C8D0E8]">
            <p>Workspace: Acme Ops</p>
            <p>Workspace URL: acme-ops.pulse.app</p>
            <p>Team size: 4</p>
            <p>Industry: B2B SaaS</p>
          </div>
        </DashboardCard>
        <DashboardCard title="Members and Roles" subtitle="Demo team access">
          <div className="grid gap-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3 text-sm text-[#C8D0E8]">
                <span>{member.name}</span>
                <StatusBadge label={member.name === "Maya Chen" ? "Manager" : "Member"} />
              </div>
            ))}
          </div>
        </DashboardCard>
        <DashboardCard title="Notification Settings" subtitle="Demo toggles">
          <div className="grid gap-2">
            {Object.entries(toggles).map(([item, enabled]) => (
              <button key={item} type="button" onClick={() => toggleSetting(item)} className="flex items-center justify-between rounded-lg border border-white/10 p-3 text-left text-sm text-[#C8D0E8] transition hover:border-[#6D5DFB]/35">
                <span>{item}</span>
                <span className={`flex h-6 w-11 items-center rounded-full p-1 transition ${enabled ? "bg-[#6D5DFB]" : "bg-white/10"}`}>
                  <span className={`h-4 w-4 rounded-full bg-white transition ${enabled ? "translate-x-5" : ""}`} />
                </span>
              </button>
            ))}
          </div>
        </DashboardCard>
        <DashboardCard title="API and AI Settings" subtitle="OpenRouter placeholder">
          <div className="space-y-3 text-sm text-[#C8D0E8]">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <p className="font-semibold text-[#F0F2F8]">OpenRouter status</p>
              <p className="mt-1 text-xs text-[#6B7A9F]">Configured when OPENROUTER_API_KEY is present.</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <p className="font-semibold text-[#F0F2F8]">Model env var</p>
              <p className="mt-1 text-xs text-[#6B7A9F]">OPENROUTER_MODEL</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
              <p className="font-semibold text-[#F0F2F8]">API key security</p>
              <p className="mt-1 text-xs text-[#6B7A9F]">The OpenRouter key stays on the server and is never exposed to the browser.</p>
            </div>
            <StatusBadge label="Server-side" />
          </div>
        </DashboardCard>
        <DashboardCard title="Integrations Preview" subtitle="Demo-safe connect buttons">
          <div className="grid gap-2 sm:grid-cols-2">
            {integrations.map((item) => (
              <div key={item.name} className="rounded-lg border border-white/10 p-3 text-sm text-[#C8D0E8]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#F0F2F8]">{item.name}</span>
                  <StatusBadge label={item.status} />
                </div>
                <p className="mt-2 text-xs leading-5 text-[#6B7A9F]">{item.description}</p>
                <button disabled className="mt-3 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#6B7A9F]">Connect</button>
              </div>
            ))}
          </div>
        </DashboardCard>
        <DashboardCard title="Billing and Security" subtitle="Placeholders for later">
          <div className="space-y-3">
            <EmptyState title="Billing placeholder" description="Stripe billing is not connected in this demo MVP." />
            <EmptyState title="Security placeholder" description="SSO and enterprise controls belong on the future security roadmap." />
          </div>
        </DashboardCard>
        <DashboardCard title="Data and Export Settings" subtitle="Demo-safe workspace data controls">
          <div className="space-y-2">
            {["Export workspace CSV", "Download audit log", "Data retention policy"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm text-[#C8D0E8]">
                {item}
                <p className="mt-1 text-xs text-[#6B7A9F]">Coming soon</p>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </motion.div>
  );
}
