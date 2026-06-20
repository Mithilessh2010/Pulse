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
  Link,
  Plus,
  Search,
  SlidersHorizontal,
  Table2,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  askPulsePrompts,
  askPulseResponses,
  integrations,
  roles,
  type Approval,
  type Project,
  type Task,
} from "@/lib/mockData";
import { usePulseStore } from "@/stores/usePulseStore";
import {
  ActivityFeed,
  AskPulseCard,
  DashboardCard,
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
import { ObjectLink } from "@/components/app-shell/ObjectLink";
import {
  approvalHref,
  approvalsForProjectHref,
  expenseHref,
  expensesHref,
  memberHref,
  projectHref,
  slugify,
  taskHref,
  tasksForProjectHref,
} from "@/lib/routes";

function stopAction(event: MouseEvent) {
  event.stopPropagation();
}

function projectIdFromName(projects: Project[], name: string) {
  return projects.find((project) => project.name === name)?.id ?? slugify(name);
}

function memberIdFromName(name: string) {
  const first = name.split(" ")[0]?.toLowerCase() ?? name.toLowerCase();
  return slugify(first);
}

function projectMatchesTeam(projectName: string, selectedTeam: string, teams: { name: string; activeProjects: string[] }[]) {
  if (selectedTeam === "All teams") return true;
  return teams.some((team) => team.name === selectedTeam && team.activeProjects.includes(projectName));
}

function memberMatchesTeam(role: string, selectedTeam: string) {
  if (selectedTeam === "All teams") return true;
  if (selectedTeam === "Product") return role.includes("Product");
  if (selectedTeam === "Design") return role.includes("Design");
  if (selectedTeam === "Engineering") return role.includes("Engineer");
  if (selectedTeam === "Operations") return role.includes("Operations");
  if (selectedTeam === "Finance") return role.includes("Finance");
  return true;
}

function priorityColor(priority: string) {
  if (priority === "High") return "#F87171";
  if (priority === "Medium") return "#FBBF24";
  return "#00B4D8";
}

function downloadWorkspaceFile(filename: string, content: string, type = "text/plain") {
  if (typeof window === "undefined") return;

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function ProjectCard({ project, onView }: { project: Project; onView?: () => void }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3 }}
      onClick={onView}
      onKeyDown={(event) => {
        if (onView && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onView();
        }
      }}
      role={onView ? "button" : undefined}
      tabIndex={onView ? 0 : undefined}
      className={`glass-raised rounded-2xl p-4 outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 ${onView ? "cursor-pointer hover:border-[var(--accent)]/35" : ""}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">{project.name}</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Owner{" "}
            <ObjectLink type="member" id={memberIdFromName(project.owner)} label={project.owner} onClick={stopAction} />
            {" "}·{" "}
            <ObjectLink type="task" id="" href={tasksForProjectHref(project.id)} label={`${project.completedTasks}/${project.tasks} tasks`} onClick={stopAction} />
            {" "}· Due {project.due}
          </p>
        </div>
        <ObjectLink type="project" id={project.id} href={projectHref(project.id, project.statusLabel === "At Risk" ? "risk" : undefined)} label={project.statusLabel} variant="badge" onClick={stopAction}>
          <StatusBadge label={project.statusLabel} />
        </ObjectLink>
      </div>
      <div className="mb-1.5 flex justify-between text-xs text-[var(--text-secondary)]">
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
        <ObjectLink type="expense" id="" href={expensesHref({ project: project.id })} label={`Budget ${project.budgetLabel}`} variant="badge" onClick={stopAction}>
          <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Budget</span>
          <span className="font-semibold text-[var(--text-primary)]">{project.budgetLabel}</span>
        </ObjectLink>
      </div>
      {onView ? (
        <button type="button" onClick={(event) => { stopAction(event); onView(); }} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[#6D5DFB]/40 hover:text-[var(--text-primary)]">
          View details
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </motion.div>
  );
}

function TaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-left transition hover:border-[#6D5DFB]/35 hover:bg-[var(--card-bg)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{task.title}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{task.project} · Owner {task.owner} · Due {task.due}</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-md border border-[var(--border-subtle)] px-2 py-1 text-[11px] text-[var(--text-secondary)]" style={{ color: priorityColor(task.priority) }}>{task.priority}</span>
          <StatusBadge label={task.status} />
        </div>
      </div>
      <p className="mt-3 text-xs text-[var(--text-muted)]">Proof: {task.proof} · Comments: {task.comments} · {task.proofRequired ? "Proof required" : "No proof required"}</p>
    </button>
  );
}

function ApprovalCard({ approval, onOpen }: { approval: Approval; onOpen?: () => void }) {
  const approveApproval = usePulseStore((state) => state.approveApproval);
  const requestApprovalChanges = usePulseStore((state) => state.requestApprovalChanges);
  const statusLabel = approval.status === "Waiting" ? approval.type : approval.status;

  return (
    <div onClick={onOpen} role={onOpen ? "button" : undefined} tabIndex={onOpen ? 0 : undefined} className={`rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 ${onOpen ? "cursor-pointer hover:border-[var(--accent)]/40" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{approval.title}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{approval.type} · {approval.project} · {approval.time}</p>
        </div>
        <div className="flex flex-wrap gap-2"><StatusBadge label={approval.priority} /><StatusBadge label={statusLabel} /></div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{approval.summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {approval.attachments.map((chip) => (
          <span key={chip} className="rounded-full border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-1.5 text-xs text-[var(--text-muted)]">{chip}</span>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm leading-6 text-[var(--text-secondary)]">{approval.aiNote}</div>
      <div className="mt-3 flex flex-wrap gap-2">{approval.auditTrail.map((event) => <span key={event} className="rounded-md border border-[var(--border-subtle)] bg-[var(--card-bg)] px-2 py-1 text-[11px] text-[var(--text-muted)]">{event}</span>)}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={(event) => { stopAction(event); approveApproval(approval.id); }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#6D5DFB] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#7C6EFC]"
        >
          <Check className="h-3.5 w-3.5" />
          Approve
        </button>
        <button
          type="button"
          onClick={(event) => { stopAction(event); requestApprovalChanges(approval.id); }}
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          Request Changes
        </button>
      </div>
    </div>
  );
}

function AttachmentChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--card-bg)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)]">
      <Link className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function ApprovalDetail({ approval }: { approval: Approval & { resolvedAt?: string } }) {
  const approveApproval = usePulseStore((state) => state.approveApproval);
  const requestApprovalChanges = usePulseStore((state) => state.requestApprovalChanges);
  const projects = usePulseStore((state) => state.projects);
  const resolved = approval.status !== "Waiting";

  return (
    <DashboardCard title="Review detail" subtitle={approval.project}>
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-[var(--text-primary)]">{approval.title}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{approval.type} · Submitted by <ObjectLink type="member" id={memberIdFromName(approval.submittedBy)} label={approval.submittedBy} /> · <ObjectLink type="project" id={projectIdFromName(projects, approval.project)} label={approval.project} /> · {approval.time}</p>
          </div>
          <StatusBadge label={approval.status} />
        </div>
        {resolved ? <p className="mt-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-2 text-xs text-[var(--text-secondary)]">{approval.status === "Approved" ? "Approved by Mithilessh" : "Changes requested"} · {approval.resolvedAt ?? "Saved"}</p> : null}
      </div>
      <div className="mt-4 grid gap-3">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Proof summary</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{approval.summary}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Requirements</p>
          <div className="mt-3 space-y-2">
            {[
              ["Owner attached proof", "Matched", "Proof link"],
              ["Screenshots included", approval.priority === "High" ? "Missing" : "Matched", "Screenshot"],
              ["Review notes included", "Matched", "Notes"],
            ].map(([requirement, status, evidence]) => (
              <div key={requirement} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-raised-bg)] p-2 text-xs">
                <span className="text-[var(--text-secondary)]">{requirement}</span>
                <StatusBadge label={status} />
                <span className="text-[var(--text-muted)]">{evidence}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--accent-2)]/20 bg-[var(--card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-2)]">Pulse review note</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{approval.aiNote}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Attachments</p>
          <div className="mt-3 flex flex-wrap gap-2">{[...approval.attachments, "Walkthrough video", "File"].slice(0, 5).map((chip) => <AttachmentChip key={chip} label={chip} />)}</div>
        </div>
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Review history</p>
          <div className="mt-3 flex flex-wrap gap-2">{approval.auditTrail.map((event) => <span key={event} className="rounded-md border border-[var(--border-subtle)] px-2 py-1 text-[11px] text-[var(--text-muted)]">{event}</span>)}</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => approveApproval(approval.id)} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">Approve</button>
        <button type="button" onClick={() => requestApprovalChanges(approval.id)} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]">Request Changes</button>
      </div>
    </DashboardCard>
  );
}

export function CommandCenterScreen() {
  const router = useRouter();
  const projects = usePulseStore((state) => state.projects);
  const teams = usePulseStore((state) => state.teams);
  const selectedTeam = usePulseStore((state) => state.selectedTeamContext);
  const tasks = usePulseStore((state) => state.tasks);
  const approvals = usePulseStore((state) => state.approvals);
  const expenses = usePulseStore((state) => state.expenses);
  const blockers = usePulseStore((state) => state.blockers);
  const teamMembers = usePulseStore((state) => state.teamMembers);
  const activityFeed = usePulseStore((state) => state.activityFeed);
  const blockersRef = useRef<HTMLDivElement>(null);
  const [briefingUpdate, setBriefingUpdate] = useState("");
  const [commandPrompt, setCommandPrompt] = useState("");
  const [commandAnswer, setCommandAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const contextProjects = projects.filter((project) => projectMatchesTeam(project.name, selectedTeam, teams));
  const contextProjectNames = new Set(contextProjects.map((project) => project.name));
  const contextTasks = tasks.filter((task) => selectedTeam === "All teams" || contextProjectNames.has(task.project));
  const contextBlockers = blockers.filter((blocker) => selectedTeam === "All teams" || contextProjectNames.has(blocker.project));
  const contextTeamMembers = teamMembers.filter((member) => memberMatchesTeam(member.role, selectedTeam));
  const pendingApprovals = approvals.filter((approval) => approval.status === "Waiting" && (selectedTeam === "All teams" || contextProjectNames.has(approval.project)));
  const approvalSummary = pendingApprovals.length
    ? `${pendingApprovals.filter((approval) => approval.type === "Task Proof").length} task approvals · ${pendingApprovals.filter((approval) => approval.type === "Expenses").length} expense approvals · ${pendingApprovals.filter((approval) => approval.type === "Client Updates").length} client updates`
    : "No approvals waiting.";

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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <div className="grid items-start gap-4 xl:grid-cols-4">
      <DashboardCard title="AI Morning Briefing" subtitle="Priority signals across the workspace" className="xl:col-span-2">
        <div className="rounded-xl border border-[#6D5DFB]/20 bg-[linear-gradient(135deg,rgba(109,93,251,0.15),rgba(0,180,216,0.08))] p-4">
          <p className="text-[15px] leading-7 text-[var(--text-primary)]">Today: {contextTasks.filter((task) => task.status === "Due Today").length} tasks are due, {pendingApprovals.length} approvals are waiting, {contextBlockers.length} blockers need attention, and Website Redesign is 3 days behind pace.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={viewBlockers} className="rounded-lg bg-white px-3 py-2 text-[13px] font-semibold text-[#07090F] transition hover:bg-[#D7E1F7]">View blockers</button>
            <button type="button" onClick={() => setBriefingUpdate(askPulseResponses["Write a weekly leadership update"])} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-[13px] font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]">Generate update</button>
            <a href="/app/ask" className="rounded-lg border border-[#00B4D8]/20 bg-[#00B4D8]/10 px-3 py-2 text-[13px] font-medium text-[var(--text-secondary)] transition hover:border-[#00B4D8]/40">Ask Pulse</a>
          </div>
          {briefingUpdate ? <div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[#07090F]/45 p-3 text-sm leading-6 text-[var(--text-secondary)]">{briefingUpdate}</div> : null}
        </div>
      </DashboardCard>
      <DashboardCard title="Command Bar" subtitle="Ask Pulse what needs attention" className="xl:col-span-2">
        <form onSubmit={(event) => { event.preventDefault(); askCommand(); }} className="flex flex-col gap-3 sm:flex-row">
          <label className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input aria-label="Ask Pulse what needs attention" value={commandPrompt} onChange={(event) => setCommandPrompt(event.target.value)} placeholder="Ask Pulse what needs attention..." className="h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#6D5DFB]/60" />
          </label>
          <button disabled={isAsking} className="rounded-xl bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7C6EFC] disabled:opacity-60">Submit</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">{["What is at risk?", "Who needs support?", "What needs approval?", "Write today's update"].map((prompt) => <button key={prompt} type="button" onClick={() => askCommand(prompt)} className="rounded-full border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]">{prompt}</button>)}</div>
        {isAsking ? <div className="mt-4"><LoadingSpinner label="Checking workspace context..." /></div> : null}
        {commandAnswer && !isAsking ? <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm leading-6 text-[var(--text-secondary)]">{commandAnswer}</motion.div> : null}
      </DashboardCard>
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-4">
        <div className="grid gap-4 xl:col-span-2 xl:grid-cols-2">
      <DashboardCard title="Company Health" subtitle="+6% from last week">
        <p className="text-5xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">82%</p>
        <div className="mt-3 flex items-center gap-2"><StatusBadge label="Stable" /><span className="text-xs text-emerald-300">+6%</span></div>
        <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">Combines project health, blockers, approval queue pressure, and budget risk.</p>
      </DashboardCard>
      <DashboardCard title="Expenses/Budget" subtitle="Monthly workspace spend">
        <p className="text-2xl font-semibold text-[var(--text-primary)]">${expenses.filter((expense) => expense.status === "Approved").reduce((sum, expense) => sum + expense.amountValue, 0).toLocaleString()} <span className="text-sm font-normal text-[var(--text-muted)]">of $7,500</span></p>
        <div className="mt-3"><ProgressBar value={64} color="#FBBF24" /></div>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          <ObjectLink type="expense" id="" href="/app/expenses" label="64% used" />
          {" "}·{" "}
          <ObjectLink type="expense" id="" href={expensesHref({ status: "Pending" })} label={`${expenses.filter((expense) => expense.status !== "Approved").length} pending expenses`} />
          {" "}· Software highest category
        </p>
      </DashboardCard>
        </div>
      <DashboardCard title="Project Health" subtitle="Predicted finish and risk" className="xl:col-span-2">
        <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">{contextProjects.map((project) => <ProjectCard key={project.name} project={project} onView={() => router.push(projectHref(project.id))} />)}</div>
        <a href="/app/projects" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#00B4D8]">Open projects <ArrowRight className="h-4 w-4" /></a>
      </DashboardCard>
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-4">
      <DashboardCard title="Approval Queue" subtitle={approvalSummary} className="xl:col-span-2">
        {pendingApprovals.length ? <div className="grid gap-3 md:grid-cols-2">{pendingApprovals.slice(0, 4).map((approval) => <ApprovalCard key={approval.id} approval={approval} onOpen={() => router.push(approvalHref(approval.id))} />)}</div> : <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"><EmptyState title="Approval queue clear" description="There are no items waiting for review." /><a href="/app/approvals" className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-center text-xs font-semibold text-[var(--text-secondary)]">View approved history</a><a href="/app/tasks" className="rounded-lg bg-[var(--accent)] px-3 py-2 text-center text-xs font-semibold text-white">Go to Tasks</a></div>}
      </DashboardCard>
      <DashboardCard title="Team Workload Health" subtitle="Capacity, availability, and support needs">
        <div className="mb-3 flex items-center gap-2 text-xs text-[var(--text-muted)]">
          Workload estimate
          <TooltipInfo text="Pulse estimates workload health from assigned tasks, deadlines, blockers, and meeting load. It is not a productivity score." />
        </div>
        <div className="space-y-4">{contextTeamMembers.map((m) => <div key={m.name}><div className="mb-2 flex justify-between text-sm"><ObjectLink type="member" id={m.id} label={m.shortName} /><span className="text-[var(--text-secondary)]">{m.capacity}% · {m.availability}</span></div><ProgressBar value={m.capacity} color={m.status === "Near Capacity" ? "#F87171" : "#00B4D8"} /><p className="mt-1 text-xs text-[var(--text-muted)]">Focus load: {m.focusLoad} · Support: {m.supportNeeded ? "Yes" : "No"}</p></div>)}</div>
      </DashboardCard>
      <DashboardCard title="Blockers" subtitle="Items slowing active work" className="transition" >
        <div ref={blockersRef} className="space-y-2 rounded-xl transition">
          {contextBlockers.map((b) => {
            const linkedProjectId = projectIdFromName(projects, b.project);
            return <button key={b.id} type="button" onClick={() => router.push(projectHref(linkedProjectId, b.id))} className="block w-full rounded-xl border border-red-400/15 bg-red-400/[0.06] p-3 text-left transition hover:border-red-300/35"><div className="flex gap-3 text-sm text-[var(--text-primary)]"><AlertTriangle className="h-4 w-4 shrink-0 text-[#F87171]" />{b.title}</div><p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">Owner {b.owner} · {b.impact}</p><p className="mt-1 text-xs leading-5 text-[#FBBF24]">Next: {b.suggestedNextAction}</p></button>;
          })}
        </div>
      </DashboardCard>
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-3">
      <DashboardCard title="Tasks Due Today" subtitle="Work needing movement">
        <div className="space-y-2">{contextTasks.slice(0, 5).map((task) => <TaskCard key={task.title} task={task} onClick={() => router.push(taskHref(task.id))} />)}</div>
      </DashboardCard>
      <AskPulseCard answer={askPulseResponses["What projects are at risk?"]} />
      <ActivityFeed items={activityFeed} />
      </div>
    </motion.div>
  );
}

export function ProjectsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projects = usePulseStore((state) => state.projects);
  const teams = usePulseStore((state) => state.teams);
  const selectedTeam = usePulseStore((state) => state.selectedTeamContext);
  const createProject = usePulseStore((state) => state.createProject);
  const [view, setView] = useState("Grid");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Risk");
  const [notice, setNotice] = useState("");
  const queryProjectId = searchParams.get("project");
  const focus = searchParams.get("focus");
  const [selectedProjectId, setSelectedProjectId] = useState(queryProjectId ?? projects[1]?.id ?? projects[0]?.id);
  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];
  const filteredProjects = projects
    .filter((project) => projectMatchesTeam(project.name, selectedTeam, teams))
    .filter((project) => status === "All" || project.health === status)
    .filter((project) => project.name.toLowerCase().includes(query.toLowerCase()) || project.owner.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sort === "Progress") return b.progress - a.progress;
      if (sort === "Due date") return a.daysLeft - b.daysLeft;
      const score = { High: 3, Medium: 2, Low: 1 };
      return (score[b.deadlineRisk as keyof typeof score] ?? 0) - (score[a.deadlineRisk as keyof typeof score] ?? 0);
    });

  useEffect(() => {
    if (queryProjectId && projects.some((project) => project.id === queryProjectId)) {
      setSelectedProjectId(queryProjectId);
    }
  }, [projects, queryProjectId]);

  function selectProject(projectId: string) {
    setSelectedProjectId(projectId);
    router.push(projectHref(projectId));
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Projects" description="Plan work, track health, and see predicted delivery across active initiatives." action={<button type="button" onClick={() => { const id = createProject(); setSelectedProjectId(id); setNotice("Project saved to the workspace."); }} className="inline-flex items-center gap-2 rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Create Project</button>} />
      {notice ? <div className="mb-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm text-[var(--text-secondary)]">{notice}</div> : null}
      <div className="mb-4 flex flex-wrap gap-2">{["Grid", "Kanban", "Timeline"].map((option) => <button key={option} type="button" onClick={() => setView(option)} className={`rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm ${view === option ? "bg-[#6D5DFB] text-white" : "bg-[var(--card-bg)] text-[var(--text-muted)]"}`}>{option}</button>)}</div>
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <input aria-label="Search projects or owners" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects or owners..." className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[#6D5DFB]/50" />
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--pulse-panel)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none">
          {["All", "On Track", "At Risk", "Needs Review", "Blocked"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--pulse-panel)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none">
          {["Risk", "Progress", "Due date"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {view === "Grid" ? <div className="grid gap-4 lg:grid-cols-3">{filteredProjects.map((project) => <ProjectCard key={project.name} project={project} onView={() => selectProject(project.id)} />)}</div> : null}
      {view === "Kanban" ? <div className="grid gap-3 md:grid-cols-4">{["Planning","In Progress","Review","Done"].map((col) => <DashboardCard key={col} title={col} subtitle={`${filteredProjects.filter((p) => p.column === col).length} projects`}><div className="space-y-2">{filteredProjects.filter((p) => p.column === col).map((p) => <button type="button" onClick={() => selectProject(p.id)} key={p.name} className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-left text-xs text-[var(--text-secondary)] transition hover:border-[#6D5DFB]/35"><span className="font-semibold text-[var(--text-primary)]">{p.name}</span><span className="mt-1 block">{p.progress}% · {p.health}</span></button>)}</div></DashboardCard>)}</div> : null}
      {view === "Timeline" ? <DashboardCard title="Timeline" subtitle="Predicted finish against due date"><div className="space-y-4">{filteredProjects.map((project) => <div key={project.id}><div className="mb-2 flex justify-between text-sm"><span className="text-[var(--text-primary)]">{project.name}</span><span className="text-[var(--text-muted)]">Due {project.due} · Finish {project.predictedFinish}</span></div><div className="h-8 rounded-full border border-[var(--border-subtle)] bg-[var(--card-bg)] p-1"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(project.progress, 18)}%` }} className="h-full rounded-full bg-[linear-gradient(90deg,#6D5DFB,#00B4D8)]" /></div></div>)}</div></DashboardCard> : null}
      {!filteredProjects.length ? <EmptyState title="No projects found" description="Try another status, search term, or sort option." /> : null}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        {selectedProject ? <DashboardCard title="Project Detail" subtitle={`${selectedProject.name} pacing preview${focus ? ` · focused on ${focus}` : ""}`}><ProjectCard project={selectedProject} /><p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">AI pacing insight: {selectedProject.insight}</p></DashboardCard> : null}
        {selectedProject ? <DashboardCard title="Risk Breakdown" subtitle="Deadline, budget, blockers, and team context"><div className="grid gap-3 sm:grid-cols-2"><MetricPill label="Deadline risk" value={selectedProject.deadlineRisk} /><MetricPill label="Budget risk" value={selectedProject.budgetRisk} /><MetricPill label="Spend" value={selectedProject.spendLabel} /><MetricPill label="Blockers" value={String(selectedProject.blockersCount)} /></div><div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm leading-6 text-[var(--text-secondary)]">Owner <ObjectLink type="member" id={memberIdFromName(selectedProject.owner)} label={selectedProject.owner} /> · Team size {selectedProject.team} · <ObjectLink type="task" id="" href={tasksForProjectHref(selectedProject.id)} label={`${selectedProject.completedTasks}/${selectedProject.tasks} tasks complete`} /> · <ObjectLink type="approval" id="" href={approvalsForProjectHref(selectedProject.id)} label="linked approvals" /> · <ObjectLink type="expense" id="" href={expensesHref({ project: selectedProject.id })} label="budget detail" /></div></DashboardCard> : null}
      </div>
    </motion.div>
  );
}

export function TasksScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projects = usePulseStore((state) => state.projects);
  const teams = usePulseStore((state) => state.teams);
  const selectedTeam = usePulseStore((state) => state.selectedTeamContext);
  const tasks = usePulseStore((state) => state.tasks);
  const updateTask = usePulseStore((state) => state.updateTask);
  const toggleSubtask = usePulseStore((state) => state.toggleSubtask);
  const completeTask = usePulseStore((state) => state.completeTask);
  const submitTaskProof = usePulseStore((state) => state.submitTaskProof);
  const [filter, setFilter] = useState("All");
  const [priority, setPriority] = useState("All priorities");
  const [owner, setOwner] = useState("All owners");
  const [search, setSearch] = useState("");
  const queryTaskId = searchParams.get("task");
  const queryProjectId = searchParams.get("project");
  const queryProjectName = queryProjectId ? projects.find((project) => project.id === queryProjectId)?.name : null;
  const [selectedTaskId, setSelectedTaskId] = useState(queryTaskId ?? tasks[1]?.id ?? tasks[0]?.id);
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? tasks[0];
  const [taskDecision, setTaskDecision] = useState("Waiting Review");
  const filters = ["All", "My Tasks", "Due Today", "Blocked", "Waiting Approval", "Completed"];
  const contextProjectNames = new Set(projects.filter((project) => projectMatchesTeam(project.name, selectedTeam, teams)).map((project) => project.name));
  const contextTasks = tasks.filter((task) => selectedTeam === "All teams" || contextProjectNames.has(task.project));
  const visible = (filter === "All" ? contextTasks : contextTasks.filter((task) => task.status === filter || (filter === "My Tasks" && task.owner === "Sam")))
    .filter((task) => !queryProjectName || task.project === queryProjectName)
    .filter((task) => priority === "All priorities" || task.priority === priority)
    .filter((task) => owner === "All owners" || task.owner === owner)
    .filter((task) => {
      const text = `${task.title} ${task.project} ${task.owner} ${task.priority}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });

  useEffect(() => {
    if (queryTaskId && tasks.some((task) => task.id === queryTaskId)) {
      const nextTask = tasks.find((task) => task.id === queryTaskId);
      setSelectedTaskId(queryTaskId);
      if (nextTask) setTaskDecision(nextTask.proofStatus);
    }
  }, [queryTaskId, tasks]);

  function selectTask(task: Task) {
    setSelectedTaskId(task.id);
    setTaskDecision(task.proofStatus);
    router.push(taskHref(task.id));
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Tasks" description="Review priorities, proof status, due dates, owners, and task detail context." />
      <div className="mb-4 flex flex-wrap gap-2">{filters.map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm ${filter === f ? "bg-[#6D5DFB] text-white" : "bg-[var(--card-bg)] text-[var(--text-muted)]"}`}><Filter className="mr-1 inline h-3.5 w-3.5" />{f}</button>)}</div>
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <select value={priority} onChange={(event) => setPriority(event.target.value)} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--pulse-panel)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none">{["All priorities", "High", "Medium", "Low"].map((item) => <option key={item}>{item}</option>)}</select>
        <select value={owner} onChange={(event) => setOwner(event.target.value)} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--pulse-panel)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none">{["All owners", ...Array.from(new Set(contextTasks.map((task) => task.owner)))].map((item) => <option key={item}>{item}</option>)}</select>
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-muted)]"><SlidersHorizontal className="mr-2 inline h-4 w-4" />Sorted by urgency</div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <DashboardCard title="Task List" subtitle={queryProjectName ? `Focused on ${queryProjectName}` : "Search and review active work"}><input aria-label="Search tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks..." className="mb-3 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#6D5DFB]/50" /><div className="space-y-2">{visible.length ? visible.map((task) => <TaskCard key={task.title} task={task} onClick={() => selectTask(task)} />) : <EmptyState title="No tasks found" description="Try a different search or filter." />}</div></DashboardCard>
        {selectedTask ? <DashboardCard title="Task Detail" subtitle="Proof submission and review"><div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3"><p className="text-sm font-semibold text-[var(--text-primary)]">{selectedTask.title}</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]"><ObjectLink type="project" id={projectIdFromName(projects, selectedTask.project)} label={selectedTask.project} /> · <ObjectLink type="member" id={memberIdFromName(selectedTask.owner)} label={selectedTask.owner} /> · Due {selectedTask.due}</p><div className="mt-3 flex flex-wrap gap-2"><StatusBadge label={selectedTask.priority} /><StatusBadge label={selectedTask.status} /><StatusBadge label={taskDecision} /></div></div><div className="mt-4 space-y-2">{selectedTask.subtasks.map((s) => { const checked = selectedTask.completedSubtasks?.includes(s) ?? false; return <button type="button" key={s} aria-pressed={checked} onClick={() => toggleSubtask(selectedTask.id, s)} className={`flex w-full items-center gap-2 rounded-lg border p-2 text-left text-sm transition ${checked ? "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-100" : "border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:border-[#6D5DFB]/35"}`}><Check className={`h-4 w-4 ${checked ? "text-emerald-300" : "text-[var(--text-muted)]"}`} />{s}</button>; })}</div><div className="mt-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm leading-6 text-[var(--text-secondary)]">AI review: {selectedTask.aiReview}</div><div className="mt-4 flex flex-wrap gap-2">{["Link","File","Screenshot","Video"].map((chip) => <button type="button" key={chip} onClick={() => submitTaskProof(selectedTask.id, `${chip} proof submitted`)} className="rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--text-muted)]">{chip}</button>)}</div><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => { completeTask(selectedTask.id); setTaskDecision("Approved"); }} className="rounded-lg bg-[#6D5DFB] px-3 py-2 text-xs font-semibold text-white">Complete task</button><button type="button" onClick={() => submitTaskProof(selectedTask.id)} className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-[var(--text-secondary)]">Submit proof</button><button type="button" onClick={() => { updateTask(selectedTask.id, { proofStatus: "Missing", proof: "Changes Requested" }); setTaskDecision("Changes Requested"); }} className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-[var(--text-secondary)]">Request Changes</button></div></DashboardCard> : null}
      </div>
    </motion.div>
  );
}

export function ApprovalsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projects = usePulseStore((state) => state.projects);
  const approvals = usePulseStore((state) => state.approvals);
  const approveApproval = usePulseStore((state) => state.approveApproval);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Waiting");
  const [bulkNotice, setBulkNotice] = useState("");
  const queryApprovalId = searchParams.get("approval");
  const queryProjectId = searchParams.get("project");
  const queryStatus = searchParams.get("status");
  const queryProjectName = queryProjectId ? projects.find((project) => project.id === queryProjectId)?.name : null;
  const [selectedApprovalId, setSelectedApprovalId] = useState(queryApprovalId ?? approvals.find((approval) => approval.status === "Waiting")?.id ?? approvals[0]?.id);
  const tabs = ["All", "Task Proof", "Expenses", "Client Updates"];
  const visible = (tab === "All" ? approvals : approvals.filter((a) => a.type === tab))
    .filter((approval) => !queryProjectName || approval.project === queryProjectName)
    .filter((approval) => statusFilter === "All statuses" || approval.status === statusFilter)
    .filter((approval) => `${approval.title} ${approval.project} ${approval.submittedBy}`.toLowerCase().includes(search.toLowerCase()));
  const selectedApproval = approvals.find((approval) => approval.id === selectedApprovalId) ?? visible[0] ?? approvals[0];
  const waiting = approvals.filter((approval) => approval.status === "Waiting");
  const oldestPending = waiting[waiting.length - 1]?.time ?? "None";
  const visibleWaiting = visible.filter((approval) => approval.status === "Waiting");

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (queryApprovalId && approvals.some((approval) => approval.id === queryApprovalId)) {
      setSelectedApprovalId(queryApprovalId);
    }
    if (queryStatus) {
      setStatusFilter(queryStatus === "pending" ? "Waiting" : queryStatus);
    }
  }, [approvals, queryApprovalId, queryStatus]);

  function selectApproval(approvalId: string) {
    setSelectedApprovalId(approvalId);
    router.push(approvalHref(approvalId));
  }

  function approveVisible() {
    visibleWaiting.forEach((approval) => approveApproval(approval.id));
    setBulkNotice(`${visibleWaiting.length} approvals approved and saved.`);
    setStatusFilter("Approved");
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Approvals" description={queryProjectName ? `Focused on ${queryProjectName} approvals.` : "Proof, expense, and client update reviews with context attached."} action={<button type="button" onClick={approveVisible} disabled={!ready || !visibleWaiting.length} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-55">{ready ? "Approve visible" : "Preparing approvals"}</button>} />{bulkNotice ? <div className="mb-4 rounded-xl border border-[var(--accent-2)]/20 bg-[var(--card-bg)] p-3 text-sm text-[var(--text-secondary)]">{bulkNotice}</div> : null}<div className="mb-4 grid gap-4 lg:grid-cols-4"><MetricPill label="Waiting approvals" value={String(waiting.length)} /><MetricPill label="High priority" value={String(waiting.filter((approval) => approval.priority === "High").length)} /><MetricPill label="Average review time" value={waiting.length ? "4.2h" : "0h"} /><MetricPill label="Oldest pending" value={oldestPending} /></div><div className="mb-4 flex flex-wrap gap-2">{tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm ${tab === t ? "bg-[var(--accent)] text-white" : "bg-[var(--card-bg)] text-[var(--text-secondary)]"}`}>{t}</button>)}</div><div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]"><input aria-label="Search approvals" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search approvals..." className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/50" /><select aria-label="Filter approvals by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--pulse-panel)] px-3 py-2 text-sm text-[var(--text-secondary)] outline-none">{["Waiting", "Approved", "Changes Requested", "All statuses"].map((item) => <option key={item}>{item}</option>)}</select></div>{visible.length ? <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]"><DashboardCard title="Approval list" subtitle={`${visible.length} items in view`}><div className="max-h-[680px] space-y-2 overflow-y-auto pr-1">{visible.map((approval) => <div key={approval.id} role="button" tabIndex={0} onClick={() => selectApproval(approval.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") selectApproval(approval.id); }} className={`block w-full rounded-xl border p-3 text-left transition ${selectedApproval?.id === approval.id ? "border-[var(--accent)]/50 bg-[var(--card-bg)]" : "border-[var(--border-subtle)] bg-[var(--card-bg)] hover:border-[var(--border-strong)]"}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold text-[var(--text-primary)]">{approval.title}</p><p className="mt-1 text-xs text-[var(--text-muted)]"><ObjectLink type="member" id={memberIdFromName(approval.submittedBy)} label={approval.submittedBy} onClick={stopAction} /> · <ObjectLink type="project" id={projectIdFromName(projects, approval.project)} label={approval.project} onClick={stopAction} /></p></div><StatusBadge label={approval.status} /></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">{approval.aiNote}</p><div className="mt-3 flex flex-wrap gap-1.5"><StatusBadge label={approval.type} /><StatusBadge label={approval.priority} /></div></div>)}</div></DashboardCard>{selectedApproval ? <ApprovalDetail approval={selectedApproval} /> : null}</div> : <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center"><EmptyState title="Approval queue clear" description="There are no items waiting for review." /><button type="button" onClick={() => setStatusFilter("Approved")} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]">View approved history</button><a href="/app/tasks" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-center text-sm font-semibold text-white">Go to Tasks</a></div>}</motion.div>;
}

export function ExpensesScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projects = usePulseStore((state) => state.projects);
  const expenseRows = usePulseStore((state) => state.expenses);
  const approveExpense = usePulseStore((state) => state.approveExpense);
  const rejectExpense = usePulseStore((state) => state.rejectExpense);
  const submitExpense = usePulseStore((state) => state.submitExpense);
  const [tab, setTab] = useState("All");
  const [showSubmit, setShowSubmit] = useState(false);
  const [exportNotice, setExportNotice] = useState("");
  const queryExpenseId = searchParams.get("expense");
  const queryStatus = searchParams.get("status");
  const queryProjectId = searchParams.get("project");
  const queryProjectName = queryProjectId ? projects.find((project) => project.id === queryProjectId)?.name : null;

  useEffect(() => {
    if (queryStatus) setTab(queryStatus === "pending" ? "Pending" : queryStatus);
  }, [queryStatus]);

  const visibleExpenses = expenseRows
    .filter((expense) => tab === "All" || expense.status === tab)
    .filter((expense) => !queryProjectName || expense.project === queryProjectName);
  const approvedTotal = expenseRows.filter((expense) => expense.status === "Approved").reduce((sum, expense) => sum + expense.amountValue, 0);

  function downloadExpenseCsv() {
    const header = ["Vendor", "Amount", "Category", "Submitted by", "Project", "Status", "Receipt status", "Suggested category"];
    const rows = expenseRows.map((expense) => [
      expense.vendor,
      expense.amount,
      expense.category,
      expense.submittedBy,
      expense.project,
      expense.status,
      expense.receiptStatus,
      expense.aiCategorySuggestion,
    ]);
    downloadWorkspaceFile("pulse-expenses.csv", [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n"), "text/csv");
    setExportNotice("Expense CSV downloaded from the current workspace view.");
  }

  function downloadBudgetBrief() {
    const pendingCount = expenseRows.filter((expense) => expense.status !== "Approved").length;
    const content = [
      "Pulse budget brief",
      "",
      `$${approvedTotal.toLocaleString()} used of $7,500`,
      "64% budget used",
      `${pendingCount} pending expenses`,
      "Highest category: Software",
      "",
      "Recent expenses:",
      ...expenseRows.map((expense) => `- ${expense.vendor}: ${expense.amount} · ${expense.category} · ${expense.status}`),
    ].join("\n");
    downloadWorkspaceFile("pulse-budget-brief.txt", content);
    setExportNotice("Budget brief downloaded.");
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Expenses" description={queryProjectName ? `Focused on ${queryProjectName} spend.` : "Track spend, approve expenses, and keep budgets tied to project work."} action={<button type="button" onClick={() => setShowSubmit(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Submit expense</button>} />{exportNotice ? <div className="mb-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm text-[var(--text-secondary)]">{exportNotice}</div> : null}{showSubmit ? <div className="mb-4 rounded-2xl border border-[#6D5DFB]/25 bg-[#6D5DFB]/10 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-[var(--text-primary)]">Submit expense</p><p className="mt-1 text-sm text-[var(--text-muted)]">Expense intake is ready for review workflows. The saved expense persists after refresh.</p><button type="button" onClick={() => { submitExpense(); setShowSubmit(false); }} className="mt-3 rounded-lg bg-[#6D5DFB] px-3 py-2 text-xs font-semibold text-white">Save expense</button></div><button aria-label="Close submit expense panel" onClick={() => setShowSubmit(false)} className="rounded-lg border border-[var(--border-subtle)] p-2 text-[var(--text-muted)]"><X className="h-4 w-4" /></button></div></div> : null}<div className="grid gap-4 lg:grid-cols-4"><MetricPill label="Budget used" value={`$${approvedTotal.toLocaleString()}`} /><MetricPill label="Budget total" value="$7,500" /><MetricPill label="Used" value="64%" /><MetricPill label="Pending" value={String(expenseRows.filter((e) => e.status !== "Approved").length)} /></div><div className="mt-4 flex flex-wrap gap-2">{["All", "Pending", "Needs Approval", "Approved", "Rejected"].map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm ${tab === item ? "bg-[#6D5DFB] text-white" : "bg-[var(--card-bg)] text-[var(--text-muted)]"}`}>{item}</button>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><DashboardCard title="Expense Approval Queue" subtitle="Review spend, receipts, and budget impact"><div className="space-y-2">{visibleExpenses.length ? visibleExpenses.map((e) => <div key={e.id} onClick={() => router.push(expenseHref(e.id))} className={`rounded-xl border bg-[var(--card-bg)] p-3 transition hover:border-[var(--accent)]/40 ${queryExpenseId === e.id ? "border-[var(--accent)]/60" : "border-[var(--border-subtle)]"}`}><div className="flex flex-wrap justify-between gap-3"><p className="text-sm font-semibold text-[var(--text-primary)]">{e.vendor}</p><StatusBadge label={e.status} /></div><p className="mt-1 text-xs text-[var(--text-muted)]">{e.amount} · {e.category} · <ObjectLink type="member" id={memberIdFromName(e.submittedBy)} label={e.submittedBy} onClick={stopAction} /> · <ObjectLink type="project" id={projectIdFromName(projects, e.project)} label={e.project} onClick={stopAction} /></p><p className="mt-2 text-xs text-[var(--text-muted)]">Receipt: {e.receiptStatus} · Suggested category: {e.aiCategorySuggestion}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={(event) => { stopAction(event); approveExpense(e.id); }} className="rounded-lg bg-[#6D5DFB] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#7C6EFC]">Approve</button><button type="button" onClick={(event) => { stopAction(event); rejectExpense(e.id); }} className="rounded-lg border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-xs text-red-200 transition hover:border-red-300/40">Reject</button></div></div>) : <EmptyState title="No expenses in this tab" description="Choose another expense status to review." />}</div></DashboardCard><DashboardCard title="Budget and Categories" subtitle="Alerts, project spend, and exports"><StatusBadge label="Medium Risk" /><ProgressBar value={64} color="#FBBF24" /><p className="mt-3 text-sm text-[var(--text-secondary)]"><ObjectLink type="expense" id="" href="/app/expenses" label="$4,820 used of $7,500" />. Highest category: Software.</p><div className="mt-4 grid gap-2">{["Software", "Infrastructure", "Meals", "Design"].map((c) => <div key={c} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm text-[var(--text-secondary)]">{c}</div>)}</div><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={downloadExpenseCsv} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"><Download className="mr-1 inline h-3.5 w-3.5" />Download CSV</button><button type="button" onClick={downloadBudgetBrief} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"><Download className="mr-1 inline h-3.5 w-3.5" />Download brief</button></div></DashboardCard></div></motion.div>;
}

export function TeamScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamMembers = usePulseStore((state) => state.teamMembers);
  const createCall = usePulseStore((state) => state.createCall);
  const queryMemberId = searchParams.get("member");
  const [selectedMemberId, setSelectedMemberId] = useState(queryMemberId ?? teamMembers[0]?.id);
  const selectedMember = teamMembers.find((member) => member.id === selectedMemberId) ?? teamMembers[0];

  useEffect(() => {
    if (queryMemberId && teamMembers.some((member) => member.id === queryMemberId)) {
      setSelectedMemberId(queryMemberId);
    }
  }, [queryMemberId, teamMembers]);

  function selectMember(memberId: string) {
    setSelectedMemberId(memberId);
    router.push(memberHref(memberId));
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Team" description="Workload health, support needed, availability, and delivery confidence without surveillance." /><DashboardCard title="Workload philosophy" subtitle="How Pulse frames team visibility"><p className="text-sm leading-6 text-[var(--text-secondary)]">Pulse does not score people. It helps managers spot workload risk and support needs using tasks, deadlines, blockers, and capacity.</p><div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-muted)]">Workload Health <TooltipInfo text="Pulse estimates workload health from assigned tasks, deadlines, blockers, and meeting load. It is not a productivity score." /></div></DashboardCard><div className="mt-4 grid gap-4 lg:grid-cols-4">{teamMembers.map((m) => <DashboardCard key={m.name} title={m.name} subtitle={m.role}><button type="button" onClick={() => selectMember(m.id)} className={`mb-3 flex w-full items-center gap-3 rounded-xl border bg-[var(--card-bg)] p-3 text-left transition hover:border-[#6D5DFB]/35 ${selectedMemberId === m.id ? "border-[var(--accent)]/55" : "border-[var(--border-subtle)]"}`}><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6D5DFB] text-sm font-semibold text-white">{m.initials}</span><span><span className="block text-sm font-semibold text-[var(--text-primary)]">{m.shortName}</span><span className="text-xs text-[var(--text-muted)]">{m.availability}</span></span></button><div className="mb-3 flex items-center justify-between"><StatusBadge label={m.status} /><span className="text-sm text-[var(--text-secondary)]">{m.capacity}%</span></div><ProgressBar value={m.capacity} color={m.status === "Near Capacity" ? "#F87171" : "#00B4D8"} /><div className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]"><p>Focus load: {m.focusLoad}</p><p>Support needed: {m.supportNeeded ? "Yes" : "No"}</p><p>Assigned tasks: {m.assignedTasks}</p><p>Blocked tasks: {m.blockedTasks}</p><p>Delivery confidence: {m.deliveryConfidence}</p></div><div className="mt-4 flex gap-2"><button onClick={() => router.push(`/app/chat?dm=${m.id}`)} className="flex-1 rounded-lg border border-[var(--border-subtle)] px-2 py-2 text-xs text-[var(--text-secondary)]">Message</button><button onClick={() => { const id = createCall({ title: `${m.name} Check-in`, participants: ["You", m.name], reason: `Direct huddle with ${m.name}.`, status: "In progress", startedAt: "Now" }); router.push(`/app/calls?call=${id}`); }} className="flex-1 rounded-lg bg-[var(--accent)] px-2 py-2 text-xs font-semibold text-white">Huddle</button></div></DashboardCard>)}</div>{selectedMember ? <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.9fr]"><DashboardCard title="Team Member Detail" subtitle={`${selectedMember.name} workload context`}><div className="grid gap-3 sm:grid-cols-2"><MetricPill label="Capacity" value={`${selectedMember.capacity}%`} /><MetricPill label="Availability" value={selectedMember.availability} /><MetricPill label="Completed this week" value={String(selectedMember.completedThisWeek)} /><MetricPill label="Blocked tasks" value={String(selectedMember.blockedTasks)} /></div><div className="mt-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm leading-6 text-[var(--text-secondary)]">Suggested action: {selectedMember.suggestedAction}</div></DashboardCard><DashboardCard title="Capacity Recommendations" subtitle="Balancing support without surveillance"><div className="space-y-2">{["Move one task from Maya to Jordan", "Ask Alex whether design approval is blocked", "Sam needs finance numbers before Investor Update can continue"].map((action) => <div key={action} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm text-[var(--text-secondary)]">{action}</div>)}</div></DashboardCard></div> : null}</motion.div>;
}

export function AskScreen() {
  const searchParams = useSearchParams();
  const queryPrompt = searchParams.get("prompt") ?? searchParams.get("q");
  const initialPrompt = queryPrompt || askPulsePrompts[0];
  const [prompt, setPrompt] = useState(initialPrompt);
  const [answer, setAnswer] = useState(askPulseResponses[initialPrompt] ?? askPulseResponses[askPulsePrompts[0]]);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<"openrouter" | "fallback" | "error">("fallback");
  const [history, setHistory] = useState([{ prompt: initialPrompt, answer: askPulseResponses[initialPrompt] ?? askPulseResponses[askPulsePrompts[0]], source: "fallback" }]);

  useEffect(() => {
    if (!queryPrompt) return;
    setPrompt(queryPrompt);
    setAnswer(askPulseResponses[queryPrompt] ?? askPulseResponses[askPulsePrompts[0]]);
  }, [queryPrompt]);

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

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Ask Pulse" description="A premium command interface for questions about projects, tasks, approvals, workload, and spend." /><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><DashboardCard title="Command Center Chat" subtitle="Answers are grounded in workspace context"><textarea aria-label="Ask Pulse prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about blockers, workload, approvals, budget, or what to do next..." className="min-h-[130px] w-full resize-none rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 text-lg text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[#6D5DFB]/50" /><div className="mt-4 flex flex-wrap gap-2">{askPulsePrompts.map((p) => <button key={p} type="button" onClick={() => askPulse(p)} className={`rounded-full border px-3 py-1.5 text-xs ${prompt === p ? "border-[#6D5DFB]/50 bg-[#6D5DFB]/15 text-white" : "border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-muted)]"}`}>{p}</button>)}</div><div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={() => askPulse()} disabled={isLoading} className="rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7C6EFC] disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Generating answer..." : "Ask Pulse"}</button><button type="button" onClick={() => navigator.clipboard?.writeText(answer)} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-xs text-[var(--text-secondary)]"><Copy className="mr-1 inline h-3.5 w-3.5" />Copy response</button><StatusBadge label={source === "openrouter" ? "Live AI" : source === "error" ? "Workspace answer" : "Workspace answer"} /></div><motion.div key={answer} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-4 text-sm leading-6 text-[var(--text-secondary)]">{isLoading ? <LoadingSpinner label="Reviewing projects, tasks, approvals, workload, and spend..." /> : answer}</motion.div><div className="mt-4 space-y-3">{history.slice(-4).map((item, index) => <div key={`${item.prompt}-${index}`} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3"><p className="text-xs font-semibold text-[var(--text-muted)]">{item.prompt}</p><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.answer}</p></div>)}</div></DashboardCard><DashboardCard title="Context Panel" subtitle="What Ask Pulse can read"><div className="grid gap-2">{["Projects","Tasks","Approvals","Expenses","Team workload","Reports"].map((item) => <div key={item} className="rounded-lg border border-[var(--border-subtle)] p-3 text-sm text-[var(--text-secondary)]">{item}</div>)}</div><div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Suggested follow-ups</p><div className="mt-3 space-y-2">{["What should I do next?", "Which project needs an owner decision?", "Draft a client update."].map((item) => <button key={item} onClick={() => askPulse(item)} className="block w-full rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-left text-xs text-[var(--text-secondary)] hover:border-[#6D5DFB]/35">{item}</button>)}</div></div></DashboardCard></div></motion.div>;
}

export function ReportsScreen() {
  const reports = usePulseStore((state) => state.reports);
  const generatedReports = usePulseStore((state) => state.generatedReports);
  const generateReport = usePulseStore((state) => state.generateReport);
  const copyReport = usePulseStore((state) => state.copyReport);
  const [reportNotice, setReportNotice] = useState("");
  const generated = generatedReports.length > 0;

  const summary = "This week, the team completed 24 tasks, moved Q3 Launch to 68%, and resolved 4 blockers. Website Redesign remains at risk due to delayed design approval. Maya is near capacity, while Jordan has room to take on additional work.";

  function reportBody(report: string) {
    return [
      report,
      "",
      generated ? generatedReports[0].body : summary,
      "",
      "Workspace signals:",
      "- Website Redesign at risk",
      "- Maya near capacity",
      "- 64% budget used",
      "- 6 approvals waiting",
    ].join("\n");
  }

  function downloadReportBrief(report: string) {
    downloadWorkspaceFile(`pulse-${report.toLowerCase().replaceAll(" ", "-")}.txt`, reportBody(report));
    setReportNotice(`${report} downloaded as a workspace brief.`);
  }

  function downloadReportCsv(report: string) {
    const rows = [
      ["Report", "Signal", "Value"],
      [report, "Website Redesign", "At risk"],
      [report, "Team capacity", "Maya near capacity"],
      [report, "Budget used", "64%"],
      [report, "Approvals waiting", "6"],
    ];
    downloadWorkspaceFile(`pulse-${report.toLowerCase().replaceAll(" ", "-")}.csv`, rows.map((row) => row.map(csvEscape).join(",")).join("\n"), "text/csv");
    setReportNotice(`${report} CSV downloaded.`);
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Reports" description="Generate summaries and export-ready views from workspace activity." action={<button type="button" onClick={() => { generateReport(); setReportNotice("Workspace report generated and saved to history."); }} className="rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#7C6EFC]">Generate report</button>} />{reportNotice ? <div className="mb-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm text-[var(--text-secondary)]">{reportNotice}</div> : null}<div className="grid gap-4 lg:grid-cols-3">{reports.map((report) => <DashboardCard key={report} title={report} subtitle={generated ? "Generated from current workspace data" : "Report template ready"}><p className="text-sm leading-6 text-[var(--text-secondary)]">{generated ? "Generated report is ready for review and export." : "Prepared from projects, approvals, workload, and expense data."}</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => downloadReportBrief(report)} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"><FileCheck className="mr-1 inline h-3.5 w-3.5" />Download brief</button><button type="button" onClick={() => downloadReportCsv(report)} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"><Table2 className="mr-1 inline h-3.5 w-3.5" />Download CSV</button></div></DashboardCard>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]"><DashboardCard title="Leadership Update Draft" subtitle={generated ? generatedReports[0].title : "Weekly summary ready"}><p className="text-sm leading-6 text-[var(--text-secondary)]">{generated ? generatedReports[0].body : "Click Generate report to prepare an executive-ready weekly update from workspace activity."}</p><button type="button" onClick={() => { if (generatedReports[0]) copyReport(generatedReports[0].id); navigator.clipboard?.writeText(generated ? generatedReports[0].body : summary); setReportNotice("Leadership update copied."); }} className="mt-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-xs text-[var(--text-secondary)]"><Copy className="mr-1 inline h-3.5 w-3.5" />Copy update</button></DashboardCard><DashboardCard title="Report History" subtitle={`${generatedReports.length} generated reports`}><div className="space-y-3">{generatedReports.slice(0, 5).map((report) => <div key={report.id} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm text-[var(--text-secondary)]"><p className="font-semibold text-[var(--text-primary)]">{report.title}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{report.tone} · {report.createdAt}{report.copied ? " · Copied" : ""}</p></div>)}{!generatedReports.length ? ["Website Redesign at risk", "Maya near capacity", "64% budget used", "6 approvals waiting"].map((item) => <div key={item} className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm text-[var(--text-secondary)]"><CheckCircle2 className="h-4 w-4 text-[#00B4D8]" />{item}</div>) : null}</div></DashboardCard></div></motion.div>;
}

export function SettingsScreen() {
  const enterprise = usePulseStore((state) => state.enterprise);
  const members = usePulseStore((state) => state.members);
  const invites = usePulseStore((state) => state.invites);
  const teams = usePulseStore((state) => state.teams);
  const settings = usePulseStore((state) => state.settings);
  const createTeam = usePulseStore((state) => state.createTeam);
  const inviteMember = usePulseStore((state) => state.inviteMember);
  const resetDemoData = usePulseStore((state) => state.resetDemoData);
  const toggleSettingAction = usePulseStore((state) => state.toggleSetting);
  const updateSettings = usePulseStore((state) => state.updateSettings);
  const setSelectedTheme = usePulseStore((state) => state.setSelectedTheme);
  const tabs = ["General", "Members", "Teams", "Roles", "Notifications", "Integrations", "Billing", "Security", "AI Assistant", "Appearance", "Workspace Data"];
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const [settingsNotice, setSettingsNotice] = useState("");
  const toggles = settings.toggles;
  const theme = settings.theme;
  const density = settings.density;
  const sidebarStyle = settings.sidebarStyle;

  useEffect(() => setReady(true), []);

  function toggleSetting(item: string) {
    toggleSettingAction(item);
  }

  const ToggleRow = ({ label, description }: { label: string; description?: string }) => (
    <button key={label} type="button" onClick={() => toggleSetting(label)} className="flex w-full items-center justify-between gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-left transition hover:border-[#6D5DFB]/35">
      <span>
        <span className="block text-sm font-semibold text-[var(--text-primary)]">{label}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-[var(--text-muted)]">{description}</span> : null}
      </span>
      <span className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${toggles[label] ? "bg-[#6D5DFB]" : "bg-white/10"}`}>
        <span className={`h-4 w-4 rounded-full bg-white transition ${toggles[label] ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );

  const PillButton = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick} disabled={!ready} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${selected ? "border-[var(--accent)]/50 bg-[var(--accent)]/20 text-[var(--text-primary)]" : "border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>
      {label}
    </button>
  );

  const themeCards = [
    { id: "midnight", name: "Midnight Pulse", description: "Dark navy command center with cyan and purple accents.", swatches: ["#07090F", "#0A0F1C", "#6D5DFB", "#00B4D8"] },
    { id: "graphite", name: "Graphite", description: "Serious enterprise dark mode with slate, white, and blue accents.", swatches: ["#080808", "#18181B", "#60A5FA", "#F5F5F5"] },
    { id: "aurora", name: "Aurora", description: "Modern dark theme with teal and violet glow accents.", swatches: ["#061211", "#0B1B20", "#14B8A6", "#8B5CF6"] },
    { id: "light", name: "Light Executive", description: "Clean light workspace for business and presentation use.", swatches: ["#F6F8FB", "#FFFFFF", "#4F46E5", "#111827"] },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Settings" description="Manage your workspace, members, AI assistant, security, and preferences." />
      {settingsNotice ? <div className="mb-4 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-sm text-[var(--text-secondary)]">{settingsNotice}</div> : null}
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <div role="tablist" aria-label="Settings sections" className="flex gap-2 overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-2 lg:block lg:overflow-visible">
          {tabs.map((tab) => (
            <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} aria-controls={`settings-panel-${tab.toLowerCase().replaceAll(" ", "-")}`} disabled={!ready} onClick={(event) => { setActiveTab(tab); event.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); }} className={`shrink-0 scroll-mx-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-55 lg:mb-1 lg:block lg:w-full lg:last:mb-0 ${activeTab === tab ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)]"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div id={`settings-panel-${activeTab.toLowerCase().replaceAll(" ", "-")}`} role="tabpanel" className="min-w-0">
          {activeTab === "General" ? (
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
              <DashboardCard title="Enterprise Profile" subtitle="Workspace identity and operating health">
                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricPill label="Workspace name" value={enterprise.name} />
                  <MetricPill label="Plan" value={enterprise.plan} />
                  <MetricPill label="Industry" value={enterprise.industry} />
                  <MetricPill label="Team size" value={enterprise.size} />
                  <MetricPill label="Owner" value={enterprise.owner} />
                  <MetricPill label="Workspace health" value={`${enterprise.health}%`} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setSettingsNotice("Profile changes are ready to review in this workspace draft.")} className="rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white">Edit profile</button>
                  <button type="button" onClick={() => setSettingsNotice("Workspace controls are active for members, teams, roles, notifications, and AI settings.")} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]">Manage workspace</button>
                </div>
              </DashboardCard>
              <DashboardCard title="Workspace Health" subtitle="Signals used in the command center">
                <ProgressBar value={enterprise.health} color="#00B4D8" />
                <div className="mt-4 grid gap-2">
                  {["Projects are pacing within expected range", "Approval queue needs same-day attention", "Budget usage remains controlled", "Two teams need workload support"].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm text-[var(--text-secondary)]">
                      <CheckCircle2 className="h-4 w-4 text-[#00B4D8]" />
                      {item}
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          ) : null}

          {activeTab === "Members" ? (
            <DashboardCard title="Members & Invites" subtitle="Access, roles, teams, and pending invitations">
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <MetricPill label="Active members" value={String(members.length)} />
                <MetricPill label="Pending invites" value={String(invites.length)} />
                <MetricPill label="Manager roles" value={String(members.filter((member) => member.permission === "Manager").length)} />
              </div>
              <button type="button" onClick={() => { const email = inviteMember(); setSettingsNotice(`Invite saved for ${email}.`); }} className="mb-4 rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white">Invite Member</button>
              <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {members.slice(0, 8).map((member) => (
                      <tr key={member.id} className="border-b border-[var(--border-subtle)] last:border-0">
                        <td className="p-3 font-semibold text-[var(--text-primary)]">{member.name}</td>
                        <td className="p-3 text-[var(--text-muted)]">{member.email}</td>
                        <td className="p-3"><StatusBadge label={member.permission} /></td>
                        <td className="p-3"><span className="rounded-md border border-[var(--border-subtle)] px-2 py-1 text-xs text-[var(--text-secondary)]">{member.team}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid gap-2 md:grid-cols-3">
                {invites.map((invite) => <div key={invite.email} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm text-[var(--text-secondary)]"><p className="font-semibold text-[var(--text-primary)]">{invite.email}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{invite.team} · {invite.role}</p><StatusBadge label={invite.status} /></div>)}
              </div>
            </DashboardCard>
          ) : null}

          {activeTab === "Teams" ? (
            <DashboardCard title="Teams" subtitle="Team ownership, focus areas, and workload">
              <div className="mb-4 flex flex-wrap gap-2"><button type="button" onClick={() => { createTeam(); setSettingsNotice("Team saved to the workspace."); }} className="rounded-lg bg-[#6D5DFB] px-4 py-2 text-sm font-semibold text-white">Create Team</button><a href="/app/teams" className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]">View teams</a></div>
              <div className="grid gap-3 md:grid-cols-2">
                {teams.map((team) => <div key={team.id} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[var(--text-primary)]">{team.name}</p><p className="mt-1 text-sm text-[var(--text-muted)]">Lead {team.lead} · {team.members} members</p></div><StatusBadge label={team.health} /></div><p className="mt-3 text-sm text-[var(--text-secondary)]">{team.currentFocus}</p><ProgressBar value={team.workloadAverage} color={team.supportNeeded ? "#F87171" : "#00B4D8"} /></div>)}
              </div>
            </DashboardCard>
          ) : null}

          {activeTab === "Roles" ? (
            <DashboardCard title="Roles & Permissions" subtitle="Human-readable access controls">
              <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {roles.map((role) => <tr key={role.name} className="border-b border-[var(--border-subtle)] last:border-0"><td className="w-36 p-3 font-semibold text-[var(--text-primary)]">{role.name}</td><td className="p-3"><div className="flex flex-wrap gap-2">{role.permissions.map((permission) => <span key={permission} className="rounded-md border border-[var(--border-subtle)] bg-[var(--card-bg)] px-2 py-1 text-xs text-[var(--text-secondary)]">{permission}</span>)}</div></td></tr>)}
                  </tbody>
                </table>
              </div>
            </DashboardCard>
          ) : null}

          {activeTab === "Notifications" ? (
            <DashboardCard title="Notifications" subtitle="Choose which operating signals Pulse sends">
              <div className="grid gap-3 md:grid-cols-2">{["Daily briefing", "Approval reminders", "Budget alerts", "Blocker alerts", "Weekly reports", "Team support alerts"].map((item) => <ToggleRow key={item} label={item} />)}</div>
            </DashboardCard>
          ) : null}

          {activeTab === "Integrations" ? (
            <DashboardCard title="Integrations" subtitle="Connect the systems your team already uses">
              <div className="grid gap-3 md:grid-cols-3">
                {integrations.map((item) => <div key={item.name} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4"><div className="flex items-start justify-between gap-3"><p className="font-semibold text-[var(--text-primary)]">{item.name}</p><StatusBadge label={item.status} /></div><p className="mt-3 min-h-10 text-sm leading-5 text-[var(--text-muted)]">{item.description}</p><button type="button" onClick={() => setSettingsNotice(`${item.name} setup added to the workspace checklist.`)} className="mt-4 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]">Prepare setup</button></div>)}
              </div>
            </DashboardCard>
          ) : null}

          {activeTab === "Billing" ? (
            <DashboardCard title="Billing" subtitle="Plan, seats, and billing controls">
              <div className="grid gap-3 sm:grid-cols-3"><MetricPill label="Current plan" value={enterprise.plan} /><MetricPill label="Seats" value="12" /><MetricPill label="Billing status" value="Owner review" /></div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  ["Next invoice", "Owner approval required"],
                  ["Seat usage", "12 active seats"],
                  ["Controls", "Plan, invoice, and seat review"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-[var(--border-strong)] bg-[var(--card-raised-bg)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-xl border border-[var(--border-strong)] bg-[var(--card-raised-bg)] p-4 text-sm leading-6 text-[var(--text-secondary)]">Workspace owners can review plan details, seat usage, and invoice readiness before payments are connected.</p>
              <button type="button" onClick={() => setSettingsNotice("Billing review opened for the workspace owner.")} className="mt-4 rounded-lg border border-[var(--border-strong)] bg-[var(--card-raised-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)]/45 hover:text-[var(--text-primary)]">Open billing review</button>
            </DashboardCard>
          ) : null}

          {activeTab === "Security" ? (
            <DashboardCard title="Security" subtitle="Workspace controls designed for teams">
              <div className="grid gap-3 md:grid-cols-2">{["Role-based access", "Workspace permissions", "Activity audit trail", "Data export controls", "Secure AI processing"].map((item) => <div key={item} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4"><p className="font-semibold text-[var(--text-primary)]">{item}</p><p className="mt-2 text-sm leading-5 text-[var(--text-muted)]">Configured for controlled workspace access and reviewable team operations.</p></div>)}</div>
            </DashboardCard>
          ) : null}

          {activeTab === "AI Assistant" ? (
            <DashboardCard title="AI Assistant" subtitle="Control how Ask Pulse and Autopilot help your team">
              <div className="grid gap-3 md:grid-cols-2">{["Ask Pulse enabled", "Autopilot suggestions enabled", "Require manager confirmation", "Include expenses in AI context", "Include team workload in AI context", "Include approval queue", "Save AI activity to audit trail"].map((item) => <ToggleRow key={item} label={item} />)}</div>
              <div className="mt-4 rounded-2xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-4"><p className="font-semibold text-[var(--text-primary)]">AI status</p><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Ask Pulse is ready to answer questions using your workspace data.</p></div>
            </DashboardCard>
          ) : null}

          {activeTab === "Appearance" ? (
            <DashboardCard title="Appearance" subtitle="Tune Pulse for the way your team works">
              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Theme</p>
                  <div className="grid gap-3 xl:grid-cols-2">
                    {themeCards.map((item) => (
                      <button key={item.id} type="button" aria-label={`Select ${item.name} theme`} disabled={!ready} onClick={() => { setSelectedTheme(item.id); setSettingsNotice(`${item.name} theme selected.`); }} className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${theme === item.name ? "border-[var(--accent)] bg-[var(--card-bg)] shadow-[0_18px_45px_rgba(0,0,0,0.16)]" : "border-[var(--border-subtle)] bg-[var(--card-bg)] hover:border-[var(--border-strong)]"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">{item.name}</p>
                            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{item.description}</p>
                          </div>
                          {theme === item.name ? <StatusBadge label="Selected" /> : null}
                        </div>
                        <div className="mt-4 flex gap-2">{item.swatches.map((swatch) => <span key={swatch} className="h-6 w-10 rounded-lg border border-[var(--border-subtle)]" style={{ background: swatch }} />)}</div>
                        <div className="mt-4 rounded-xl border border-[var(--border-subtle)] p-3" style={{ background: item.swatches[1], color: item.swatches[3] }}>
                          <div className="h-2 w-16 rounded-full" style={{ background: item.swatches[2] }} />
                          <div className="mt-3 grid grid-cols-3 gap-2"><span className="h-7 rounded-lg border opacity-70" /><span className="h-7 rounded-lg border opacity-70" /><span className="h-7 rounded-lg border opacity-70" /></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div><p className="mb-2 text-sm font-semibold text-[var(--text-primary)]">Density</p><div className="flex flex-wrap gap-2">{["Comfortable", "Compact"].map((item) => <PillButton key={item} label={item} selected={density === item} onClick={() => updateSettings({ density: item })} />)}</div></div>
                <div><p className="mb-2 text-sm font-semibold text-[var(--text-primary)]">Sidebar style</p><div className="flex flex-wrap gap-2">{["Expanded", "Compact"].map((item) => <PillButton key={item} label={item} selected={sidebarStyle === item} onClick={() => updateSettings({ sidebarStyle: item })} />)}</div></div>
                <ToggleRow label="Reduce motion" description="Use quieter transitions across workspace panels." />
              </div>
            </DashboardCard>
          ) : null}

          {activeTab === "Workspace Data" ? (
            <DashboardCard title="Workspace Data" subtitle="Restore the local workspace">
              <p className="text-sm leading-6 text-[var(--text-secondary)]">Restore local workspace records back to the original operating state.</p>
              <button type="button" onClick={() => { resetDemoData(); setSettingsNotice("Workspace data restored to the original operating state."); }} className="mt-4 rounded-lg border border-red-400/30 bg-red-400/[0.08] px-4 py-2 text-sm font-semibold text-red-100 transition hover:border-red-300/50">Restore workspace data</button>
            </DashboardCard>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
