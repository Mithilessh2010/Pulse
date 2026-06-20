"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, FileText, Mic, PhoneCall, Upload, Video, Wand2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardCard, EmptyState, MetricPill, PageHeader, ProgressBar, StatusBadge, containerVariants } from "@/components/app-shell/AppUI";
import { ObjectLink } from "@/components/app-shell/ObjectLink";
import { callHref, chatRoomHref, decisionHref, meetingHref, memberHref, playbookHref, projectHref, slugify, teamHref } from "@/lib/routes";
import { usePulseHydrated, usePulseStore, type AutopilotAction } from "@/stores/usePulseStore";

const buttonClass = "rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:border-[#6D5DFB]/40 hover:text-[var(--text-primary)]";

function memberIdFromName(name: string) {
  const first = name.split(" ")[0]?.toLowerCase() ?? name.toLowerCase();
  return slugify(first);
}

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
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <DashboardCard title="Manager command" subtitle="Pulse prepares actions, explains why, and never silently runs high-risk work.">
          <textarea value={command} onChange={(event) => setCommand(event.target.value)} className="min-h-32 max-h-56 w-full resize-y overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 text-sm leading-6 text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/60" />
          <div className="mt-3 flex flex-wrap gap-2">{["Handle today's blockers", "Clear safe approvals", "Reduce overloaded work", "Prepare leadership update", "Plan tomorrow's priorities"].map((chip) => <button key={chip} onClick={() => setCommand(chip)} className={buttonClass}>{chip}</button>)}</div>
          <button onClick={generatePlan} className="mt-4 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white">{loading ? "Generating action plan..." : "Generate action plan"}</button>
        </DashboardCard>
        <DashboardCard title="Autopilot history" subtitle={`${autopilotPlans.length} saved plans`}>
          <div className="space-y-2">{autopilotPlans.slice(0, 5).map((item) => <div key={item.id} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3"><p className="line-clamp-2 text-sm text-[var(--text-secondary)]">{item.command}</p><p className="mt-2 text-xs text-[var(--text-muted)]">{item.createdAt} · {item.actions.length} actions</p></div>)}{!autopilotPlans.length ? <EmptyState title="No plans yet" description="Generate an action plan to build your Autopilot history." /> : null}</div>
        </DashboardCard>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {(plan ?? []).map((action) => <ActionPlanCard key={action.id} action={action} onApprove={approveAutopilotAction} onSkip={skipAutopilotAction} onEdit={(id) => editAutopilotAction(id, { status: "Needs review" })} />)}
        {plan && !plan.length ? <EmptyState title="No action plan generated" description="Try another command with more workspace context." /> : null}
      </div>
    </motion.div>
  );
}

function ActionPlanCard({ action, onApprove, onSkip, onEdit }: { action: AutopilotAction; onApprove: (id: string) => void; onSkip: (id: string) => void; onEdit: (id: string) => void }) {
  return <DashboardCard title={action.title} subtitle={`${action.category} · ${action.relatedObject}`}><p className="text-sm leading-6 text-[var(--text-secondary)]">{action.reason}</p><div className="mt-3 flex flex-wrap gap-2"><StatusBadge label={action.riskLevel} /><StatusBadge label={action.status} /><span className="rounded-md border border-[var(--border-subtle)] px-2 py-1 text-xs text-[var(--text-muted)]">{action.confidence}% confidence</span></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => onApprove(action.id)} className={buttonClass}>Approve action</button><button onClick={() => onSkip(action.id)} className={buttonClass}>Skip</button><button onClick={() => onEdit(action.id)} className={buttonClass}>Edit</button></div></DashboardCard>;
}

export function InboxScreen() {
  const inboxItems = usePulseStore((state) => state.inboxItems);
  const markInboxDone = usePulseStore((state) => state.markInboxDone);
  const snoozeInboxItem = usePulseStore((state) => state.snoozeInboxItem);
  const [filter, setFilter] = useState("All");
  const visible = inboxItems.filter((item) => !item.done && (filter === "All" || item.type === filter));
  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Manager Inbox" description="A calm review queue for approvals, blockers, expenses, support alerts, meeting follow-ups, and invites." /><div className="mb-4 flex flex-wrap gap-2">{["All", "Task Proof", "Expenses", "Blocker", "Pending invites"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`${buttonClass} ${filter === item ? "bg-[#6D5DFB] text-white" : ""}`}>{item}</button>)}</div><div className="grid gap-3">{visible.length ? visible.map((item) => <DashboardCard key={item.id} title={item.title} subtitle={`${item.type} · ${item.time}`}><div className="flex flex-wrap items-center justify-between gap-3"><StatusBadge label={item.priority} /><p className="text-sm text-[var(--text-secondary)]">{item.action}</p><div className="flex gap-2"><button onClick={() => markInboxDone(item.id)} className={buttonClass}>Mark done</button><button onClick={() => snoozeInboxItem(item.id)} className={buttonClass}>Snooze</button></div></div></DashboardCard>) : <EmptyState title="Inbox clear" description="No visible items in this filter." />}</div></motion.div>;
}

export function ChatScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatRooms = usePulseStore((state) => state.chatRooms);
  const sendChatMessage = usePulseStore((state) => state.sendChatMessage);
  const markRoomRead = usePulseStore((state) => state.markRoomRead);
  const summarizeChatRoom = usePulseStore((state) => state.summarizeChatRoom);
  const convertMessageToTask = usePulseStore((state) => state.convertMessageToTask);
  const pinMessageAsDecision = usePulseStore((state) => state.pinMessageAsDecision);
  const startHuddleFromRoom = usePulseStore((state) => state.startHuddleFromRoom);
  const queryRoomId = searchParams.get("room");
  const [roomId, setRoomId] = useState(queryRoomId ?? "website");
  const room = chatRooms.find((item) => item.id === roomId) ?? chatRooms[0];
  const [draft, setDraft] = useState("");
  const [roomNotice, setRoomNotice] = useState("");
  const latestMessage = room?.messages[room.messages.length - 1];
  useEffect(() => {
    if (queryRoomId && chatRooms.some((item) => item.id === queryRoomId)) {
      setRoomId(queryRoomId);
    }
  }, [chatRooms, queryRoomId]);

  function selectRoom(nextRoomId: string) {
    setRoomId(nextRoomId);
    setRoomNotice("");
    router.push(chatRoomHref(nextRoomId));
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Work Rooms" description="Team chat tied to projects, decisions, approvals, and context." /> <div className="grid gap-4 lg:grid-cols-[260px_1fr_320px]"><DashboardCard title="Rooms">{chatRooms.map((item) => <button key={item.id} onClick={() => selectRoom(item.id)} className={`mb-2 block w-full rounded-xl border p-3 text-left text-sm ${room?.id === item.id ? "border-[var(--accent)]/55 bg-[var(--card-bg)] text-[var(--text-primary)]" : "border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-secondary)]"}`}>{item.name}<span className="block text-xs text-[var(--text-muted)]">{item.description}</span><span className="mt-2 block text-[11px] text-[var(--accent-2)]">{item.isRead ? "Read" : `${item.unreadCount} unread`}</span></button>)}</DashboardCard>{room ? <DashboardCard title={room.name} subtitle="Work-tied conversation"><div className="mb-3 flex flex-wrap gap-2">{room.linkedProject ? <ObjectLink type="project" id={slugify(room.linkedProject)} label={room.linkedProject} variant="badge" /> : null}{room.linkedTeam ? <ObjectLink type="team" id={slugify(room.linkedTeam)} label={room.linkedTeam} variant="badge" /> : null}</div><div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1">{room.messages.map((message) => <div key={message.id} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3"><ObjectLink type="member" id={memberIdFromName(message.sender)} label={message.sender} className="text-sm font-semibold" /><p className="mt-1 text-sm text-[var(--text-secondary)]">{message.body}</p><p className="mt-2 text-xs text-[var(--text-muted)]">{message.createdAt}{message.convertedToTaskId ? " · Converted to task" : ""}{message.pinnedAsDecisionId ? " · Pinned decision" : ""}</p></div>)}</div><form onSubmit={(event) => { event.preventDefault(); const sent = sendChatMessage(room.id, draft); if (sent) setRoomNotice("Message saved to this room."); setDraft(""); }} className="mt-4 flex gap-2"><input aria-label={`Write a message in ${room.name}`} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message..." className="h-10 min-w-0 flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 text-sm text-[var(--text-primary)] outline-none" /><button type="submit" className="rounded-xl bg-[var(--accent)] px-3 text-sm font-semibold text-white">Send</button></form></DashboardCard> : null}{room ? <DashboardCard title="Room Context" subtitle="AI summary, huddle, decisions, and linked work"><p className="text-sm leading-6 text-[var(--text-secondary)]">{room.aiSummary}</p>{roomNotice ? <p className="mt-3 rounded-xl border border-[var(--accent-2)]/20 bg-[var(--card-bg)] p-3 text-xs leading-5 text-[var(--text-secondary)]">{roomNotice}</p> : null}<div className="mt-4 grid gap-2"><button onClick={() => { const callId = startHuddleFromRoom(room.id); if (callId) router.push(callHref(callId)); else setRoomNotice("Unable to start huddle."); }} className={`${buttonClass} flex items-center justify-center gap-2 bg-[var(--accent)] text-white`}><PhoneCall className="h-3.5 w-3.5" />Start huddle</button><a href="/app/calls" className={`${buttonClass} text-center`}>Open related calls</a><button onClick={() => { summarizeChatRoom(room.id); setRoomNotice("Thread summary saved."); }} className={buttonClass}>Summarize thread</button><button onClick={() => { if (latestMessage) { convertMessageToTask(room.id, latestMessage.id); setRoomNotice("Task created from latest message and saved."); } }} className={buttonClass}>Convert message to task</button><button onClick={() => { if (latestMessage) { pinMessageAsDecision(room.id, latestMessage.id); setRoomNotice("Decision pinned and saved."); } }} className={buttonClass}>Pin decision</button><button onClick={() => { markRoomRead(room.id); setRoomNotice(`${room.name} marked read.`); }} className={buttonClass}>Mark room read</button></div><div className="mt-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Pinned decisions</p><p className="mt-2 text-sm text-[var(--text-secondary)]">{room.pinnedDecisionIds.length ? `${room.pinnedDecisionIds.length} decisions pinned from this room.` : "No pinned decisions yet."}</p></div></DashboardCard> : null}</div></motion.div>;
}

export function CallsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = usePulseHydrated();
  const calls = usePulseStore((state) => state.calls);
  const startCall = usePulseStore((state) => state.startCall);
  const endCall = usePulseStore((state) => state.endCall);
  const generateCallAgenda = usePulseStore((state) => state.generateCallAgenda);
  const createCallFollowUpTasks = usePulseStore((state) => state.createCallFollowUpTasks);
  const updateCallNotes = usePulseStore((state) => state.updateCallNotes);
  const queryCallId = searchParams.get("call");
  const [selectedId, setSelectedId] = useState(queryCallId ?? calls.find((call) => call.status === "In progress")?.id ?? calls[0]?.id);
  const selected = calls.find((call) => call.id === selectedId) ?? calls[0];
  const active = calls.find((call) => call.status === "In progress");
  const suggested = calls.filter((call) => call.status === "Suggested" || call.status === "Scheduled");
  const history = calls.filter((call) => call.status === "Completed");

  useEffect(() => {
    if (queryCallId && calls.some((call) => call.id === queryCallId)) {
      setSelectedId(queryCallId);
    }
  }, [calls, queryCallId]);

  function selectCall(callId: string) {
    setSelectedId(callId);
    router.push(callHref(callId));
  }

  if (!hydrated) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <PageHeader title="Calls & Huddles" description="Preparing saved huddles, agendas, notes, and follow-up actions." action={<a href="/app/meetings" className={buttonClass}>Open meetings</a>} />
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
          <DashboardCard title="Loading huddle workspace" subtitle="Syncing saved calls before controls become active">
            <div className="grid gap-3 md:grid-cols-3">
              {["Active huddles", "Suggested calls", "Completed"].map((item) => <div key={item} className="h-24 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)]" />)}
            </div>
          </DashboardCard>
          <DashboardCard title="Call room" subtitle="Loading">
            <div className="h-80 rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)]" />
          </DashboardCard>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Calls & Huddles" description="Lightweight work-tied huddles with agendas, live notes, decisions, and follow-up tasks." action={<a href="/app/meetings" className={buttonClass}>Open meetings</a>} />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricPill label="Active huddles" value={String(calls.filter((call) => call.status === "In progress").length)} />
            <MetricPill label="Suggested calls" value={String(suggested.length)} />
            <MetricPill label="Completed" value={String(history.length)} />
          </div>
          {active ? (
            <DashboardCard title="Active huddle" subtitle={`${active.duration} · ${active.relatedProject ?? active.relatedTeam ?? "Workspace"}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{active.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{active.reason}</p>
                </div>
                <button type="button" onClick={() => endCall(active.id)} className="rounded-lg border border-[var(--risk)]/30 bg-[var(--risk)]/10 px-3 py-2 text-xs font-semibold text-[var(--risk)]">End call</button>
              </div>
            </DashboardCard>
          ) : null}
          <DashboardCard title="Suggested calls" subtitle="Pulse recommends huddles only when work is blocked or coordination is faster than another comment.">
            <div className="grid gap-3 lg:grid-cols-2">
              {suggested.map((call) => (
                <div key={call.id} role="button" tabIndex={0} onClick={() => selectCall(call.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") selectCall(call.id); }} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 text-left transition hover:border-[var(--border-strong)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{call.title}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{call.relatedProject ? <ObjectLink type="project" id={slugify(call.relatedProject)} label={call.relatedProject} onClick={(event) => event.stopPropagation()} /> : call.relatedTeam ? <ObjectLink type="team" id={slugify(call.relatedTeam)} label={call.relatedTeam} onClick={(event) => event.stopPropagation()} /> : null} · {call.duration}</p>
                    </div>
                    <StatusBadge label={call.status} />
                  </div>
                  <p className="mt-3 text-sm leading-5 text-[var(--text-secondary)]">{call.reason}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{call.participants.map((person) => <span key={person} className="rounded-md border border-[var(--border-subtle)] px-2 py-1 text-[11px] text-[var(--text-muted)]">{person}</span>)}</div>
                </div>
              ))}
            </div>
          </DashboardCard>
          <div className="grid gap-4 lg:grid-cols-2">
            <DashboardCard title="Call history" subtitle="Completed huddles and captured outcomes">
              <div className="space-y-2">{history.length ? history.map((call) => <button key={call.id} type="button" onClick={() => selectCall(call.id)} className="block w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-left"><p className="text-sm font-semibold text-[var(--text-primary)]">{call.title}</p><p className="mt-1 text-xs text-[var(--text-muted)]">Ended {call.endedAt ?? "recently"} · {call.actionItemIds.length} action items</p></button>) : <EmptyState title="No completed calls yet" description="Start and end a call to build call history." />}</div>
            </DashboardCard>
            <DashboardCard title="Action items from calls" subtitle="Follow-up tasks created from huddles">
              <div className="space-y-2">{calls.flatMap((call) => call.actionItemIds.map((taskId) => ({ taskId, call }))).slice(0, 5).map(({ taskId, call }) => <div key={taskId} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm text-[var(--text-secondary)]">{call.title}<span className="block text-xs text-[var(--text-muted)]">{taskId}</span></div>)}{!calls.some((call) => call.actionItemIds.length) ? <EmptyState title="No call action items" description="Create follow-up tasks from a call to populate this panel." /> : null}</div>
            </DashboardCard>
          </div>
        </div>
        {selected ? (
          <DashboardCard title="Call room" subtitle={selected.status}>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{selected.title}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{selected.relatedProject ?? selected.relatedTeam} · {selected.duration}</p>
                </div>
                <StatusBadge label={selected.status} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">{selected.participants.map((person) => <ObjectLink key={person} type="member" id={memberIdFromName(person)} label={person} variant="card" className="p-3 text-center"><div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-xs font-bold text-white">{person.slice(0, 2).toUpperCase()}</div><p className="mt-2 text-xs text-[var(--text-secondary)]">{person}</p></ObjectLink>)}</div>
              <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-muted)]"><Mic className="h-4 w-4" /><Video className="h-4 w-4" /><Clock className="h-4 w-4" /> Workspace room · {selected.status === "In progress" ? "Live now" : selected.startedAt ?? "not started"}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => startCall(selected.id)} disabled={selected.status === "In progress"} className={`rounded-lg px-3 py-2 text-xs font-semibold text-white transition ${selected.status === "In progress" ? "cursor-not-allowed bg-[var(--accent)]/45" : "bg-[var(--accent)] hover:brightness-110"}`}>{selected.status === "In progress" ? "Call in progress" : "Start call"}</button><button type="button" onClick={() => endCall(selected.id)} disabled={selected.status !== "In progress"} className={`${buttonClass} ${selected.status !== "In progress" ? "cursor-not-allowed opacity-55" : ""}`}>End call</button><button type="button" onClick={() => generateCallAgenda(selected.id)} className={buttonClass}>Generate agenda</button><button type="button" onClick={() => createCallFollowUpTasks(selected.id)} className={buttonClass}>Create follow-up tasks</button></div>
            <div className="mt-4 space-y-4">
              <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Agenda</p><div className="space-y-2">{(selected.agenda ?? []).map((item) => <div key={item} className="flex gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-2 text-sm text-[var(--text-secondary)]"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--accent-2)]" />{item}</div>)}</div></div>
              <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">AI live notes</p><textarea value={selected.notes.join("\n")} onChange={(event) => updateCallNotes(selected.id, event.target.value.split("\n").filter(Boolean))} className="min-h-28 max-h-56 w-full resize-y overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm text-[var(--text-primary)] outline-none" /></div>
              <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Decisions captured</p><div className="space-y-2">{selected.decisions.length ? selected.decisions.map((decision) => <div key={decision} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-2 text-sm text-[var(--text-secondary)]">{decision}</div>) : <p className="text-sm text-[var(--text-muted)]">No decisions captured yet.</p>}</div></div>
            </div>
          </DashboardCard>
        ) : null}
      </div>
    </motion.div>
  );
}

export function MeetingsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetings = usePulseStore((state) => state.meetings);
  const generateMeetingAgenda = usePulseStore((state) => state.generateMeetingAgenda);
  const createMeetingFollowUpTasks = usePulseStore((state) => state.createMeetingFollowUpTasks);
  const markMeetingNotesComplete = usePulseStore((state) => state.markMeetingNotesComplete);
  const queryMeetingId = searchParams.get("meeting");
  const [selectedMeetingId, setSelectedMeetingId] = useState(queryMeetingId ?? meetings[0]?.id);
  const [meetingNotice, setMeetingNotice] = useState("");
  useEffect(() => {
    if (queryMeetingId && meetings.some((meeting) => meeting.id === queryMeetingId)) {
      setSelectedMeetingId(queryMeetingId);
    }
  }, [meetings, queryMeetingId]);

  function selectMeeting(meetingId: string) {
    setSelectedMeetingId(meetingId);
    router.push(meetingHref(meetingId));
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Meeting Hub" description="Run fewer, better meetings with agendas, decisions, notes, and follow-up tasks." action={<a href="/app/calls" className={buttonClass}>Open Calls & Huddles</a>} /><div className="grid gap-4 lg:grid-cols-2">{meetings.map((meeting) => <DashboardCard key={meeting.id} title={meeting.title} subtitle={`${meeting.project} · ${meeting.duration}`} className={selectedMeetingId === meeting.id ? "ring-2 ring-[var(--accent)]/35" : ""}><div role="button" tabIndex={0} onClick={() => selectMeeting(meeting.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") selectMeeting(meeting.id); }} className="mb-3 block w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-left transition hover:border-[var(--accent)]/40"><p className="text-sm font-semibold text-[var(--text-primary)]">{meeting.title}</p><p className="mt-1 text-xs text-[var(--text-muted)]"><ObjectLink type="project" id={slugify(meeting.project)} label={meeting.project} onClick={(event) => event.stopPropagation()} /> · {meeting.duration}</p></div><p className="text-sm leading-6 text-[var(--text-secondary)]">{meeting.why}</p><div className="mt-3 flex flex-wrap gap-2">{meeting.participants.map((person) => <ObjectLink key={person} type="member" id={memberIdFromName(person)} label={person} variant="badge" />)}</div><div className="mt-3 space-y-2">{(meeting.generatedAgenda ?? meeting.agenda).map((item) => <div key={item} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-2 text-sm text-[var(--text-secondary)]">{item}</div>)}</div><div className="mt-3 flex flex-wrap gap-2">{meeting.notesComplete ? <StatusBadge label="Notes complete" /> : null}{meeting.followUpTaskIds?.length ? <StatusBadge label={`${meeting.followUpTaskIds.length} follow-up tasks`} /> : null}</div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => { generateMeetingAgenda(meeting.id); setMeetingNotice(`${meeting.title}: agenda generated and saved.`); }} className={buttonClass}>Generate agenda</button><button onClick={() => { createMeetingFollowUpTasks(meeting.id); setMeetingNotice(`${meeting.title}: follow-up task created and saved.`); }} className={buttonClass}>Create follow-up tasks</button><button onClick={() => { markMeetingNotesComplete(meeting.id); setMeetingNotice(`${meeting.title}: notes marked complete.`); }} className={buttonClass}>Mark notes complete</button></div></DashboardCard>)}</div>{meetingNotice ? <div className="mt-4"><DashboardCard title="Meeting action saved"><p className="text-sm text-[var(--text-secondary)]">{meetingNotice}</p></DashboardCard></div> : null}</motion.div>;
}

export function TeamsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teams = usePulseStore((state) => state.teams);
  const members = usePulseStore((state) => state.members);
  const invites = usePulseStore((state) => state.invites);
  const createTeam = usePulseStore((state) => state.createTeam);
  const inviteMember = usePulseStore((state) => state.inviteMember);
  const queryTeamId = searchParams.get("team");
  const [selectedId, setSelectedId] = useState(queryTeamId ?? teams[0]?.id);
  const selected = teams.find((team) => team.id === selectedId) ?? teams[0];
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (queryTeamId && teams.some((team) => team.id === queryTeamId)) {
      setSelectedId(queryTeamId);
    }
  }, [queryTeamId, teams]);

  function selectTeam(teamId: string) {
    setSelectedId(teamId);
    router.push(teamHref(teamId));
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Teams" description="Enterprise team overview, ownership, workload, and focus areas." action={<div className="flex gap-2"><button onClick={() => { const id = createTeam(); selectTeam(id); setNotice("Team saved to the workspace."); }} className={buttonClass}>Create Team</button><button onClick={() => { const email = inviteMember(); setNotice(`Invite saved for ${email}.`); }} className={buttonClass}>Invite Member</button></div>} />{notice ? <div className="mb-4 rounded-2xl border border-[#00B4D8]/20 bg-[#00B4D8]/10 p-4 text-sm text-[var(--text-secondary)]">{notice}</div> : null}<div className="grid gap-4 lg:grid-cols-5"><MetricPill label="Active teams" value={String(teams.length)} /><MetricPill label="Members" value={String(members.length)} /><MetricPill label="Pending invites" value={String(invites.length)} /><MetricPill label="Avg workload" value="61%" /><MetricPill label="Teams needing support" value={String(teams.filter((team) => team.supportNeeded).length)} /></div><div className="mt-4 grid gap-4 lg:grid-cols-3">{teams.map((team) => <DashboardCard key={team.id} title={team.name} subtitle={`Lead ${team.lead}`} className={selectedId === team.id ? "ring-2 ring-[var(--accent)]/35" : ""}><StatusBadge label={team.health} /><p className="mt-3 text-sm text-[var(--text-secondary)]">{team.currentFocus}</p><p className="mt-2 text-xs text-[var(--text-muted)]">Lead <ObjectLink type="member" id={memberIdFromName(team.lead)} label={team.lead} /></p><ProgressBar value={team.workloadAverage} /><button onClick={() => selectTeam(team.id)} className={`mt-4 ${buttonClass}`}>View details</button></DashboardCard>)}</div>{selected ? <div className="mt-4"><DashboardCard title={`${selected.name} detail`} subtitle="Members, projects, workload, and suggested actions"><p className="text-sm text-[var(--text-secondary)]">Active projects: {selected.activeProjects.length ? selected.activeProjects.map((project, index) => <span key={project}>{index > 0 ? ", " : ""}<ObjectLink type="project" id={slugify(project)} label={project} /></span>) : "No linked projects yet"}</p><p className="mt-2 text-sm text-[var(--text-secondary)]">Support needed: {selected.supportNeeded ? "Yes" : "No"}</p></DashboardCard></div> : null}</motion.div>;
}

export function DecisionsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const decisions = usePulseStore((state) => state.decisions);
  const addDecision = usePulseStore((state) => state.addDecision);
  const queryDecisionId = searchParams.get("decision");
  const [selectedId, setSelectedId] = useState(queryDecisionId ?? decisions[0]?.id);
  const selected = decisions.find((decision) => decision.id === selectedId) ?? decisions[0];
  useEffect(() => {
    if (queryDecisionId && decisions.some((decision) => decision.id === queryDecisionId)) {
      setSelectedId(queryDecisionId);
    }
  }, [decisions, queryDecisionId]);

  function selectDecision(decisionId: string) {
    setSelectedId(decisionId);
    router.push(decisionHref(decisionId));
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Decision Log" description="Capture decisions that would otherwise disappear in chat." action={<button onClick={() => { const id = addDecision(); selectDecision(id); }} className={buttonClass}>Add decision</button>} /><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><div className="space-y-3">{decisions.map((decision) => <button key={decision.id} onClick={() => selectDecision(decision.id)} className={`block w-full rounded-2xl border bg-[var(--card-bg)] p-4 text-left hover:border-[#6D5DFB]/40 ${selected?.id === decision.id ? "border-[var(--accent)]/55" : "border-[var(--border-subtle)]"}`}><p className="font-semibold">{decision.title}</p><p className="mt-1 text-sm text-[var(--text-muted)]">{decision.project} · {decision.team} · {decision.date}</p></button>)}</div>{selected ? <DashboardCard title="Decision detail" subtitle={selected.status}><p className="text-sm leading-6 text-[var(--text-secondary)]">{selected.summary}</p><p className="mt-3 text-sm text-[var(--text-muted)]">Impact: {selected.impact}</p><p className="mt-1 text-sm text-[var(--text-muted)]">Source: {selected.source}</p><div className="mt-4 flex flex-wrap gap-2"><ObjectLink type="project" id={slugify(selected.project)} label={selected.project} variant="badge" /><ObjectLink type="team" id={slugify(selected.team)} label={selected.team} variant="badge" /><ObjectLink type="member" id={memberIdFromName(selected.owner)} label={selected.owner} variant="badge" /></div></DashboardCard> : null}</div></motion.div>;
}

export function PlaybooksScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playbooks = usePulseStore((state) => state.playbooks);
  const queryPlaybookId = searchParams.get("playbook");
  const [selectedPlaybookId, setSelectedPlaybookId] = useState(queryPlaybookId ?? playbooks[0]?.id);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (queryPlaybookId && playbooks.some((playbook) => playbook.id === queryPlaybookId)) {
      setSelectedPlaybookId(queryPlaybookId);
    }
  }, [playbooks, queryPlaybookId]);

  function selectPlaybook(playbookId: string) {
    setSelectedPlaybookId(playbookId);
    router.push(playbookHref(playbookId));
  }

  return <motion.div variants={containerVariants} initial="hidden" animate="visible"><PageHeader title="Playbooks" description="Reusable operating workflows for repeated work." action={<button onClick={() => setMessage("Pulse drafted a playbook from the completed Q3 Launch project.")} className={buttonClass}>Generate from project</button>} />{message ? <div className="mb-4"><DashboardCard title="Playbook generated"><p className="text-sm text-[var(--text-secondary)]">{message}</p></DashboardCard></div> : null}<div className="grid gap-4 lg:grid-cols-3">{playbooks.map((playbook) => <DashboardCard key={playbook.id} title={playbook.name} subtitle={`${playbook.ownerRole} · ${playbook.estimatedTime}`} className={selectedPlaybookId === playbook.id ? "ring-2 ring-[var(--accent)]/35" : ""}><button type="button" onClick={() => selectPlaybook(playbook.id)} className="mb-3 block w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-left text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent)]/40">{playbook.name}</button><p className="text-sm text-[var(--text-secondary)]">Required proof: {playbook.requiredProof}</p><div className="mt-3 space-y-2">{playbook.steps.map((step) => <div key={step} className="rounded-lg border border-[var(--border-subtle)] p-2 text-sm text-[var(--text-secondary)]">{step}</div>)}</div><button onClick={() => { selectPlaybook(playbook.id); setMessage(`${playbook.name} is ready to apply to a new project.`); }} className={`mt-4 ${buttonClass}`}>Run playbook</button></DashboardCard>)}</div></motion.div>;
}

export function ImportScreen() {
  const [ready, setReady] = useState(false);
  const [text, setText] = useState("");
  const [extracted, setExtracted] = useState(false);
  useEffect(() => setReady(true), []);
  const detected = [
    { label: "Task", title: "Review mobile dashboard layout", meta: "Owner Jordan · Due tomorrow", status: "Ready" },
    { label: "Blocker", title: "Finance numbers missing", meta: "Investor Update Deck · Finance", status: "Needs owner" },
    { label: "Approval", title: "Website Redesign mobile proof", meta: "Design review · Maya", status: "Waiting" },
  ];
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Import Data" description="Paste updates and turn them into reviewed tasks, blockers, approvals, and decisions." />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <DashboardCard title="Source update" subtitle="Paste project notes, meeting notes, client updates, or task lists">
            <textarea aria-label="Source update text" value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste project update, meeting notes, or task list..." className="min-h-32 max-h-56 w-full resize-y overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 text-sm leading-6 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/60 sm:min-h-48" />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {["Tasks", "Blockers", "Approvals", "Decisions"].map((item) => <span key={item} className="rounded-md border border-[var(--border-subtle)] bg-[var(--card-bg)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)]">{item}</span>)}
              </div>
              <button type="button" onClick={() => setExtracted(true)} disabled={!ready} className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"><Wand2 className="h-4 w-4" />{ready ? "Extract with Pulse" : "Preparing import"}</button>
            </div>
          </DashboardCard>
          <div className="grid gap-4 lg:grid-cols-3">
            {(extracted ? detected : detected.map((item) => ({ ...item, status: "Pending" }))).map((item) => (
              <DashboardCard key={item.title} title={item.label} subtitle={item.status}>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{extracted ? item.title : "Waiting for source update"}</p>
                <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">{extracted ? item.meta : "Extracted items will appear here for review before they are saved."}</p>
              </DashboardCard>
            ))}
          </div>
        </div>
        <DashboardCard title="Import review" subtitle="Keep automation controlled before anything is saved">
          <div className="space-y-3">
            {[
              ["Classify work", "Pulse separates tasks, blockers, approvals, and decisions."],
              ["Confirm owners", "Each extracted item keeps an owner, team, and source note."],
              ["Review before save", "Nothing is added to the workspace until a manager confirms it."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]"><CheckCircle2 className="h-4 w-4 text-[var(--accent-2)]" />{title}</div>
                <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--accent)]/20 bg-[var(--card-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Review queue</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">{extracted ? detected.length : 0}</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{extracted ? "items ready for manager review" : "items waiting for extraction"}</p>
          </div>
        </DashboardCard>
      </div>
    </motion.div>
  );
}

export function OnboardingScreen() {
  const steps = ["Name your enterprise", "Choose company type", "Create first teams", "Invite members", "Add first project", "Choose theme", "Open Command Center"];
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  useEffect(() => setReady(true), []);
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <PageHeader title="Smart Onboarding" description="Set up Pulse in a focused, step-by-step wizard." />
      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
        <DashboardCard title="Setup path" subtitle={`${step + 1} of ${steps.length} completed`}>
          <div className="space-y-2">
            {steps.map((item, index) => (
              <button key={item} type="button" onClick={() => setStep(index)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${index === step ? "border-[var(--accent)] bg-[var(--card-bg)] text-[var(--text-primary)]" : "border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${index <= step ? "bg-[var(--accent)] text-white" : "bg-[var(--card-raised-bg)] text-[var(--text-muted)]"}`}>{index + 1}</span>
                {item}
              </button>
            ))}
          </div>
        </DashboardCard>
        <DashboardCard title={steps[step]} subtitle={`Step ${step + 1} of ${steps.length}`}>
          <ProgressBar value={((step + 1) / steps.length) * 100} />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {["Recommended default", "Workspace-ready", "Editable later", "Visible in command center"].map((item) => <div key={item} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 text-sm text-[var(--text-secondary)]"><CheckCircle2 className="mb-3 h-4 w-4 text-[var(--accent-2)]" />{item}</div>)}
          </div>
          <div className="mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-5">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Suggested setup</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Review the suggested defaults, adjust the current step if needed, and continue when the workspace setup looks right for your team.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2"><button disabled={!ready || step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-50`}>Back</button>{step === steps.length - 1 ? <a href="/app" className={buttonClass}>Finish</a> : <button disabled={!ready} onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} className={`${buttonClass} inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50`}>{ready ? "Next" : "Preparing"}<ArrowRight className="h-3.5 w-3.5" /></button>}<a href="/app" className={buttonClass}>Skip</a></div>
        </DashboardCard>
        <DashboardCard title="Launch readiness" subtitle="What Pulse will prepare">
          <div className="space-y-3">
            {[["Workspace", "Company profile, owner, team size"], ["People", "Teams, members, invites, roles"], ["Operations", "Projects, tasks, approvals, reports"]].map(([title, body]) => <div key={title} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3"><div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]"><FileText className="h-4 w-4 text-[var(--accent-2)]" />{title}</div><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{body}</p></div>)}
          </div>
          <a href="/app/import" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)]"><Upload className="h-4 w-4" />Import existing work</a>
        </DashboardCard>
      </div>
    </motion.div>
  );
}
