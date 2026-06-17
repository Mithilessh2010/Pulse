"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { DashboardCard, EmptyState, MetricPill, PageHeader, ProgressBar, StatusBadge, containerVariants } from "@/components/app-shell/AppUI";
import { usePulseStore, type AutopilotAction } from "@/stores/usePulseStore";

const buttonClass = "rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-[#C8D0E8] transition hover:border-[#6D5DFB]/40 hover:text-white";

export function AutopilotScreen() {
  const autopilotPlans = usePulseStore((state) => state.autopilotPlans);
  const generateAutopilotPlan = usePulseStore((state) => state.generateAutopilotPlan);
  const approveAutopilotAction = usePulseStore((state) => state.approveAutopilotAction);
  const skipAutopilotAction = usePulseStore((state) => state.skipAutopilotAction);
  const editAutopilotAction = usePulseStore((state) => state.editAutopilotAction);
  const [command, setCommand] = useState("Handle what needs attention today. Clear safe approvals, reduce overloaded work, schedule a Website Redesign check-in, and write a leadership update.");
  const [loading, setLoading] = useState(false);
  const plan = autopilotPlans[0]?.actions ?? null;

  async function generatePlan() {
    setLoading(true);
    try {
      const response = await fetch("/api/autopilot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ command }) });
      const data = await response.json();
      generateAutopilotPlan(command, data.actions ?? []);
    } catch {
      generateAutopilotPlan(command, []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Pulse Autopilot" description="Turn messy manager instructions into organized actions that still wait for confirmation." />
      <DashboardCard title="Manager command" subtitle="Pulse prepares actions, explains why, and never silently runs high-risk work.">
        <textarea value={command} onChange={(event) => setCommand(event.target.value)} className="min-h-[170px] w-full rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-[#F0F2F8] outline-none focus:border-[#6D5DFB]/60" />
        <div className="mt-3 flex flex-wrap gap-2">{["Handle today's blockers", "Clear safe approvals", "Reduce overloaded work", "Prepare leadership update", "Plan tomorrow's priorities"].map((chip) => <button key={chip} onClick={() => setCommand(chip)} className={buttonClass}>{chip}</button>)}</div>
        <button onClick={generatePlan} className="mt-4 rounded-xl bg-[#6D5DFB] px-4 py-3 text-sm font-semibold text-white">{loading ? "Generating action plan..." : "Generate action plan"}</button>
      </DashboardCard>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {(plan ?? []).map((action) => <ActionPlanCard key={action.id} action={action} onApprove={approveAutopilotAction} onSkip={skipAutopilotAction} onEdit={(id) => editAutopilotAction(id, { status: "Needs review" })} />)}
        {plan && !plan.length ? <EmptyState title="Fallback plan unavailable" description="Try another command or check the API route." /> : null}
      </div>
    </motion.div>
  );
}

function ActionPlanCard({ action, onApprove, onSkip, onEdit }: { action: AutopilotAction; onApprove: (id: string) => void; onSkip: (id: string) => void; onEdit: (id: string) => void }) {
  return <DashboardCard title={action.title} subtitle={`${action.category} · ${action.relatedObject}`}><p className="text-sm leading-6 text-[#C8D0E8]">{action.reason}</p><div className="mt-3 flex flex-wrap gap-2"><StatusBadge label={action.riskLevel} /><StatusBadge label={action.status} /><span className="rounded-md border border-white/10 px-2 py-1 text-xs text-[#9BA8C7]">{action.confidence}% confidence</span></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => onApprove(action.id)} className={buttonClass}>Approve action</button><button onClick={() => onSkip(action.id)} className={buttonClass}>Skip</button><button onClick={() => onEdit(action.id)} className={buttonClass}>Edit</button></div></DashboardCard>;
}

export function InboxScreen() {
  const inboxItems = usePulseStore((state) => state.inboxItems);
  const markInboxDone = usePulseStore((state) => state.markInboxDone);
  const snoozeInboxItem = usePulseStore((state) => state.snoozeInboxItem);
  const [filter, setFilter] = useState("All");
  const visible = inboxItems.filter((item) => !item.done && (filter === "All" || item.type === filter));
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Manager Inbox" description="A calm review queue for approvals, blockers, expenses, support alerts, meeting follow-ups, and invites." /><div className="mb-4 flex flex-wrap gap-2">{["All", "Task Proof", "Expenses", "Blocker", "Pending invites"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`${buttonClass} ${filter === item ? "bg-[#6D5DFB] text-white" : ""}`}>{item}</button>)}</div><div className="grid gap-3">{visible.length ? visible.map((item) => <DashboardCard key={item.id} title={item.title} subtitle={`${item.type} · ${item.time}`}><div className="flex flex-wrap items-center justify-between gap-3"><StatusBadge label={item.priority} /><p className="text-sm text-[#C8D0E8]">{item.action}</p><div className="flex gap-2"><button onClick={() => markInboxDone(item.id)} className={buttonClass}>Mark done</button><button onClick={() => snoozeInboxItem(item.id)} className={buttonClass}>Snooze</button></div></div></DashboardCard>) : <EmptyState title="Inbox clear" description="No visible items in this filter." />}</div></motion.div>;
}

export function ChatScreen() {
  const chatRooms = usePulseStore((state) => state.chatRooms);
  const sendChatMessage = usePulseStore((state) => state.sendChatMessage);
  const markRoomRead = usePulseStore((state) => state.markRoomRead);
  const summarizeChatRoom = usePulseStore((state) => state.summarizeChatRoom);
  const convertMessageToTask = usePulseStore((state) => state.convertMessageToTask);
  const pinMessageAsDecision = usePulseStore((state) => state.pinMessageAsDecision);
  const [roomId, setRoomId] = useState("website");
  const room = chatRooms.find((item) => item.id === roomId) ?? chatRooms[0];
  const [draft, setDraft] = useState("");
  const [roomNotice, setRoomNotice] = useState("");
  const latestMessage = room?.messages[room.messages.length - 1];
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Work Rooms" description="Team chat tied to projects, decisions, approvals, and context." /><div className="grid gap-4 lg:grid-cols-[260px_1fr_320px]"><DashboardCard title="Rooms">{chatRooms.map((item) => <button key={item.id} onClick={() => { setRoomId(item.id); setRoomNotice(""); }} className={`mb-2 block w-full rounded-xl border border-white/10 p-3 text-left text-sm ${room?.id === item.id ? "bg-[#6D5DFB]/20 text-white" : "bg-white/[0.035] text-[#C8D0E8]"}`}>{item.name}<span className="block text-xs text-[#6B7A9F]">{item.description}</span><span className="mt-2 block text-[11px] text-[#00B4D8]">{item.isRead ? "Read" : `${item.unreadCount} unread`}</span></button>)}</DashboardCard>{room ? <DashboardCard title={room.name} subtitle="Work-tied conversation"><div className="space-y-3">{room.messages.map((message) => <div key={message.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-3"><p className="text-sm font-semibold">{message.sender}</p><p className="mt-1 text-sm text-[#C8D0E8]">{message.body}</p><p className="mt-2 text-xs text-[#6B7A9F]">{message.createdAt}{message.convertedToTaskId ? " · Converted to task" : ""}{message.pinnedAsDecisionId ? " · Pinned decision" : ""}</p></div>)}</div><form onSubmit={(event) => { event.preventDefault(); const sent = sendChatMessage(room.id, draft); if (sent) setRoomNotice("Message saved to this room."); setDraft(""); }} className="mt-4 flex gap-2"><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-sm outline-none" /><button type="submit" className="rounded-xl bg-[#6D5DFB] px-3 text-sm font-semibold text-white">Send</button></form></DashboardCard> : null}{room ? <DashboardCard title="Room Context" subtitle="AI summary and linked work"><p className="text-sm leading-6 text-[#D7E1F7]">{room.aiSummary}</p>{roomNotice ? <p className="mt-3 rounded-xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-3 text-xs leading-5 text-[#C8D0E8]">{roomNotice}</p> : null}<div className="mt-4 space-y-2"><button onClick={() => { summarizeChatRoom(room.id); setRoomNotice("Thread summary saved."); }} className={buttonClass}>Summarize thread</button><button onClick={() => { if (latestMessage) { convertMessageToTask(room.id, latestMessage.id); setRoomNotice("Task created from latest message and saved."); } }} className={buttonClass}>Convert message to task</button><button onClick={() => { if (latestMessage) { pinMessageAsDecision(room.id, latestMessage.id); setRoomNotice("Decision pinned and saved."); } }} className={buttonClass}>Pin decision</button><button onClick={() => { markRoomRead(room.id); setRoomNotice(`${room.name} marked read.`); }} className={buttonClass}>Mark room read</button></div></DashboardCard> : null}</div></motion.div>;
}

export function MeetingsScreen() {
  const meetings = usePulseStore((state) => state.meetings);
  const generateMeetingAgenda = usePulseStore((state) => state.generateMeetingAgenda);
  const createMeetingFollowUpTasks = usePulseStore((state) => state.createMeetingFollowUpTasks);
  const markMeetingNotesComplete = usePulseStore((state) => state.markMeetingNotesComplete);
  const [meetingNotice, setMeetingNotice] = useState("");
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Meeting Hub" description="Run fewer, better meetings with agendas, decisions, notes, and follow-up tasks." /><div className="grid gap-4 lg:grid-cols-2">{meetings.map((meeting) => <DashboardCard key={meeting.id} title={meeting.title} subtitle={`${meeting.project} · ${meeting.duration}`}><p className="text-sm leading-6 text-[#C8D0E8]">{meeting.why}</p><div className="mt-3 space-y-2">{(meeting.generatedAgenda ?? meeting.agenda).map((item) => <div key={item} className="rounded-lg border border-white/10 bg-white/[0.035] p-2 text-sm text-[#C8D0E8]">{item}</div>)}</div><div className="mt-3 flex flex-wrap gap-2">{meeting.notesComplete ? <StatusBadge label="Notes complete" /> : null}{meeting.followUpTaskIds?.length ? <StatusBadge label={`${meeting.followUpTaskIds.length} follow-up tasks`} /> : null}</div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => { generateMeetingAgenda(meeting.id); setMeetingNotice(`${meeting.title}: agenda generated and saved.`); }} className={buttonClass}>Generate agenda</button><button onClick={() => { createMeetingFollowUpTasks(meeting.id); setMeetingNotice(`${meeting.title}: follow-up task created and saved.`); }} className={buttonClass}>Create follow-up tasks</button><button onClick={() => { markMeetingNotesComplete(meeting.id); setMeetingNotice(`${meeting.title}: notes marked complete.`); }} className={buttonClass}>Mark notes complete</button></div></DashboardCard>)}</div>{meetingNotice ? <div className="mt-4"><DashboardCard title="Meeting action saved"><p className="text-sm text-[#D7E1F7]">{meetingNotice}</p></DashboardCard></div> : null}</motion.div>;
}

export function TeamsScreen() {
  const teams = usePulseStore((state) => state.teams);
  const members = usePulseStore((state) => state.members);
  const invites = usePulseStore((state) => state.invites);
  const createTeam = usePulseStore((state) => state.createTeam);
  const inviteMember = usePulseStore((state) => state.inviteMember);
  const [selectedId, setSelectedId] = useState(teams[0]?.id);
  const selected = teams.find((team) => team.id === selectedId) ?? teams[0];
  const [notice, setNotice] = useState("");
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Teams" description="Enterprise team overview, ownership, workload, and focus areas." action={<div className="flex gap-2"><button onClick={() => { const id = createTeam(); setSelectedId(id); setNotice("Team saved to the demo workspace."); }} className={buttonClass}>Create Team</button><button onClick={() => { const email = inviteMember(); setNotice(`Invite saved for ${email}.`); }} className={buttonClass}>Invite Member</button></div>} />{notice ? <div className="mb-4 rounded-2xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-4 text-sm text-[#C8D0E8]">{notice}</div> : null}<div className="grid gap-4 lg:grid-cols-5"><MetricPill label="Active teams" value={String(teams.length)} /><MetricPill label="Members" value={String(members.length)} /><MetricPill label="Pending invites" value={String(invites.length)} /><MetricPill label="Avg workload" value="61%" /><MetricPill label="Teams needing support" value={String(teams.filter((team) => team.supportNeeded).length)} /></div><div className="mt-4 grid gap-4 lg:grid-cols-3">{teams.map((team) => <DashboardCard key={team.id} title={team.name} subtitle={`Lead ${team.lead}`}><StatusBadge label={team.health} /><p className="mt-3 text-sm text-[#C8D0E8]">{team.currentFocus}</p><ProgressBar value={team.workloadAverage} /><button onClick={() => setSelectedId(team.id)} className={`mt-4 ${buttonClass}`}>View details</button></DashboardCard>)}</div>{selected ? <div className="mt-4"><DashboardCard title={`${selected.name} detail`} subtitle="Members, projects, workload, and suggested actions"><p className="text-sm text-[#C8D0E8]">Active projects: {selected.activeProjects.join(", ") || "No linked projects yet"}</p><p className="mt-2 text-sm text-[#C8D0E8]">Support needed: {selected.supportNeeded ? "Yes" : "No"}</p></DashboardCard></div> : null}</motion.div>;
}

export function DecisionsScreen() {
  const decisions = usePulseStore((state) => state.decisions);
  const addDecision = usePulseStore((state) => state.addDecision);
  const [selectedId, setSelectedId] = useState(decisions[0]?.id);
  const selected = decisions.find((decision) => decision.id === selectedId) ?? decisions[0];
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Decision Log" description="Capture decisions that would otherwise disappear in chat." action={<button onClick={() => { const id = addDecision(); setSelectedId(id); }} className={buttonClass}>Add decision</button>} /><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><div className="space-y-3">{decisions.map((decision) => <button key={decision.id} onClick={() => setSelectedId(decision.id)} className="block w-full rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left hover:border-[#6D5DFB]/40"><p className="font-semibold">{decision.title}</p><p className="mt-1 text-sm text-[#7F8BA6]">{decision.project} · {decision.team} · {decision.date}</p></button>)}</div>{selected ? <DashboardCard title="Decision detail" subtitle={selected.status}><p className="text-sm leading-6 text-[#C8D0E8]">{selected.summary}</p><p className="mt-3 text-sm text-[#9BA8C7]">Impact: {selected.impact}</p><p className="mt-1 text-sm text-[#9BA8C7]">Source: {selected.source}</p></DashboardCard> : null}</div></motion.div>;
}

export function PlaybooksScreen() {
  const playbooks = usePulseStore((state) => state.playbooks);
  const [message, setMessage] = useState("");
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Playbooks" description="Reusable operating workflows for repeated work." action={<button onClick={() => setMessage("Pulse drafted a playbook from the completed Q3 Launch project.")} className={buttonClass}>Generate from project</button>} />{message ? <div className="mb-4"><DashboardCard title="Playbook generated"><p className="text-sm text-[#D7E1F7]">{message}</p></DashboardCard></div> : null}<div className="grid gap-4 lg:grid-cols-3">{playbooks.map((playbook) => <DashboardCard key={playbook.id} title={playbook.name} subtitle={`${playbook.ownerRole} · ${playbook.estimatedTime}`}><p className="text-sm text-[#C8D0E8]">Required proof: {playbook.requiredProof}</p><div className="mt-3 space-y-2">{playbook.steps.map((step) => <div key={step} className="rounded-lg border border-white/10 p-2 text-sm text-[#C8D0E8]">{step}</div>)}</div><button onClick={() => setMessage(`${playbook.name} is ready to apply to a new project.`)} className={`mt-4 ${buttonClass}`}>Run playbook</button></DashboardCard>)}</div></motion.div>;
}

export function ImportScreen() {
  const [text, setText] = useState("");
  const [extracted, setExtracted] = useState(false);
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Import Data" description="Paste project notes, meeting notes, or task lists and turn them into structured work." /><DashboardCard title="Paste workspace update" subtitle="Pulse extracts tasks, owners, deadlines, blockers, and approvals."><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste project update, meeting notes, or task list..." className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm outline-none" /><button onClick={() => setExtracted(true)} className="mt-4 rounded-xl bg-[#6D5DFB] px-4 py-3 text-sm font-semibold text-white">Extract tasks with Pulse</button></DashboardCard>{extracted ? <div className="mt-4 grid gap-4 lg:grid-cols-3"><DashboardCard title="Detected tasks"><p className="text-sm text-[#C8D0E8]">Review mobile dashboard layout · Owner Jordan · Tomorrow</p></DashboardCard><DashboardCard title="Detected blocker"><p className="text-sm text-[#C8D0E8]">Finance numbers missing for Investor Update Deck.</p></DashboardCard><DashboardCard title="Approval needed"><p className="text-sm text-[#C8D0E8]">Website Redesign mobile proof requires design approval.</p></DashboardCard></div> : null}</motion.div>;
}

export function OnboardingScreen() {
  const steps = ["Name your enterprise", "Choose company type", "Create first teams", "Invite members", "Add first project", "Choose theme", "Open Command Center"];
  const [step, setStep] = useState(0);
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Smart Onboarding" description="Set up Pulse in a focused, step-by-step wizard." /><DashboardCard title={steps[step]} subtitle={`Step ${step + 1} of ${steps.length}`}><ProgressBar value={((step + 1) / steps.length) * 100} /><div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-6 text-sm leading-6 text-[#C8D0E8]">Configure this workspace step, review the suggested defaults, and continue when the setup looks right for your team.</div><div className="mt-4 flex flex-wrap gap-2"><button disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className={buttonClass}>Back</button>{step === steps.length - 1 ? <a href="/app" className={buttonClass}>Finish</a> : <button onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} className={buttonClass}>Next</button>}<a href="/app" className={buttonClass}>Skip</a></div></DashboardCard></motion.div>;
}
