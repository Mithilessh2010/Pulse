"use client";

import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AtSign, CheckSquare, Copy, Hash, MessageSquare, MoreHorizontal, Paperclip, Pencil, PhoneCall, Pin, Search, Send, SmilePlus, Trash2, Users, Video } from "lucide-react";
import { Modal } from "@/components/app/Modal";
import { usePulseStore, type ChatMessage } from "@/stores/usePulseStore";

type Section = "Work Rooms" | "Direct Messages" | "Teams" | "Mentions" | "Saved";

const sections: { label: Section; Icon: typeof Hash }[] = [
  { label: "Work Rooms", Icon: Hash }, { label: "Direct Messages", Icon: MessageSquare },
  { label: "Teams", Icon: Users }, { label: "Mentions", Icon: AtSign }, { label: "Saved", Icon: Pin },
];

const subtleButton = "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50";

export function ChatHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rooms = usePulseStore((state) => state.chatRooms);
  const conversations = usePulseStore((state) => state.directMessages);
  const members = usePulseStore((state) => state.members);
  const tasks = usePulseStore((state) => state.tasks);
  const approvals = usePulseStore((state) => state.approvals);
  const sendChatMessage = usePulseStore((state) => state.sendChatMessage);
  const sendDirectMessage = usePulseStore((state) => state.sendDirectMessage);
  const markConversationRead = usePulseStore((state) => state.markConversationRead);
  const addReaction = usePulseStore((state) => state.addReaction);
  const removeReaction = usePulseStore((state) => state.removeReaction);
  const pinMessage = usePulseStore((state) => state.pinMessage);
  const editMessage = usePulseStore((state) => state.editMessage);
  const deleteMessage = usePulseStore((state) => state.deleteMessage);
  const convertMessageToTask = usePulseStore((state) => state.convertMessageToTask);
  const pinMessageAsDecision = usePulseStore((state) => state.pinMessageAsDecision);
  const summarizeChatRoom = usePulseStore((state) => state.summarizeChatRoom);
  const createCall = usePulseStore((state) => state.createCall);
  const scheduleMeeting = usePulseStore((state) => state.scheduleMeeting);

  const requestedDm = searchParams.get("dm");
  const requestedRoom = searchParams.get("room");
  const [section, setSection] = useState<Section>(requestedDm ? "Direct Messages" : "Work Rooms");
  const [selectedId, setSelectedId] = useState(requestedDm ? `dm-${requestedDm}` : requestedRoom ?? "website");
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [agenda, setAgenda] = useState("");

  useEffect(() => {
    if (requestedDm) { setSection("Direct Messages"); setSelectedId(`dm-${requestedDm}`); }
    else if (requestedRoom) { setSection("Work Rooms"); setSelectedId(requestedRoom); }
  }, [requestedDm, requestedRoom]);

  const isDm = selectedId.startsWith("dm-");
  const room = rooms.find((item) => item.id === selectedId);
  const direct = conversations.find((item) => item.id === selectedId);
  const member = members.find((item) => item.id === direct?.memberId);
  const messages = useMemo(() => room?.messages ?? direct?.messages ?? [], [direct?.messages, room?.messages]);
  const title = room?.name ?? member?.name ?? "Conversation";
  const context = room?.linkedProject ?? room?.linkedTeam ?? member?.team ?? "Workspace";
  const filteredMessages = useMemo(() => search.trim() ? messages.filter((message) => `${message.sender} ${message.body}`.toLowerCase().includes(search.toLowerCase())) : messages, [messages, search]);
  const savedMessages = useMemo(() => [...rooms.flatMap((item) => item.messages), ...conversations.flatMap((item) => item.messages)].filter((message) => message.pinned), [conversations, rooms]);

  const visibleRooms = section === "Teams" ? rooms.filter((item) => item.linkedTeam) : rooms;
  const list = section === "Direct Messages" ? conversations : visibleRooms;

  function selectConversation(id: string) {
    setSelectedId(id); setNotice(""); setSearch(""); markConversationRead(id);
    if (id.startsWith("dm-")) router.replace(`/app/chat?dm=${id.replace("dm-", "")}`);
    else router.replace(`/app/chat?room=${id}`);
  }

  function sendMessage() {
    const sent = isDm && direct ? sendDirectMessage(direct.memberId, draft) : room ? sendChatMessage(room.id, draft) : null;
    if (sent) { setDraft(""); setNotice("Message saved."); }
  }

  function onComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); }
  }

  function startHuddle() {
    const callId = createCall({ title: `${title} Huddle`, participants: ["You", ...(member ? [member.name] : ["Maya", "Jordan"])], relatedProject: room?.linkedProject, relatedTeam: room?.linkedTeam ?? member?.team, reason: `Started from ${title}.`, status: "In progress", startedAt: "Now", notes: [`Huddle started from ${title}.`] });
    router.push(`/app/calls?call=${callId}`);
  }

  function schedule(event: FormEvent) {
    event.preventDefault();
    const meetingId = scheduleMeeting({ title: `${title} Check-in`, participants: ["You", ...(member ? [member.name] : ["Maya", "Jordan"])], project: room?.linkedProject ?? member?.team ?? "Workspace", agenda: agenda || `Review updates from ${title}` });
    setScheduleOpen(false); setAgenda(""); router.push(`/app/meetings?meeting=${meetingId}`);
  }

  function messageAction(message: ChatMessage, action: "task" | "decision") {
    if (action === "task") convertMessageToTask(selectedId, message.id);
    else pinMessageAsDecision(selectedId, message.id);
    setNotice(action === "task" ? "Task created and linked." : "Decision pinned and linked.");
  }

  const listRows = section === "Saved" ? [] : list;

  return (
    <div className="min-h-[calc(100dvh-128px)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--pulse-panel)] lg:grid lg:grid-cols-[280px_minmax(0,1fr)_320px]">
      <aside className="border-b border-[var(--border-subtle)] lg:border-b-0 lg:border-r">
        <div className="border-b border-[var(--border-subtle)] p-3">
          <p className="px-2 text-sm font-semibold text-[var(--text-primary)]">Communication</p>
          <div className="mt-3 flex gap-1 overflow-x-auto lg:grid lg:grid-cols-2">
            {sections.map(({ label, Icon }) => <button key={label} onClick={() => setSection(label)} className={`flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium ${section === label ? "bg-[var(--accent)] text-white" : "text-[var(--text-muted)] hover:bg-[var(--card-bg)]"}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}
          </div>
        </div>
        <div className="max-h-[260px] overflow-y-auto p-2 lg:max-h-[calc(100dvh-260px)]">
          {section === "Saved" ? savedMessages.map((message) => <div key={message.id} className="mb-2 rounded-lg border border-[var(--border-subtle)] p-3 text-xs text-[var(--text-secondary)]"><Pin className="mb-2 h-3.5 w-3.5 text-[var(--accent-2)]" />{message.body}</div>) : listRows.map((item) => {
            const dm = "memberId" in item;
            const person = dm ? members.find((candidate) => candidate.id === item.memberId) : undefined;
            const rowMessages = item.messages;
            const last = rowMessages[rowMessages.length - 1];
            const label = dm ? person?.name ?? item.memberId : item.name;
            return <button key={item.id} onClick={() => selectConversation(item.id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${selectedId === item.id ? "bg-[var(--card-raised-bg)] ring-1 ring-[var(--accent)]/40" : "hover:bg-[var(--card-bg)]"}`}><div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/20 text-xs font-bold text-[var(--text-primary)]">{label.slice(0, 2).toUpperCase()}{dm ? <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--pulse-panel)] bg-emerald-400" /> : null}</div><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-[var(--text-primary)]">{label}</span><span className="text-[10px] text-[var(--text-muted)]">{last?.createdAt}</span></span><span className="mt-0.5 block truncate text-xs text-[var(--text-muted)]">{last?.body ?? "No messages yet"}</span></span>{item.unreadCount ? <span className="min-w-5 rounded-full bg-[var(--accent)] px-1.5 text-center text-[10px] font-bold text-white">{item.unreadCount}</span> : null}</button>;
          })}
        </div>
      </aside>

      <section className="flex min-h-[620px] min-w-0 flex-col border-b border-[var(--border-subtle)] lg:border-b-0 lg:border-r">
        <header className="flex flex-wrap items-center gap-3 border-b border-[var(--border-subtle)] p-4">
          <div className="min-w-0 flex-1"><h1 className="truncate text-base font-semibold text-[var(--text-primary)]">{title}</h1><p className="mt-0.5 text-xs text-[var(--text-muted)]">{isDm ? `${member?.status ?? "Available"} · ${member?.role ?? "Team member"}` : context}</p></div>
          <button onClick={startHuddle} className={subtleButton}><PhoneCall className="h-3.5 w-3.5" />Huddle</button>
          <button onClick={() => setScheduleOpen(true)} className={subtleButton}><Video className="h-3.5 w-3.5" />Schedule</button>
          <button onClick={() => setSearch((value) => value ? "" : " ")} aria-label="Search in chat" className={subtleButton}><Search className="h-3.5 w-3.5" /></button>
          <button disabled title="More conversation integrations are available soon" className={subtleButton}><MoreHorizontal className="h-3.5 w-3.5" /></button>
          {search !== "" ? <input autoFocus aria-label="Search messages" value={search.trimStart()} onChange={(event) => setSearch(` ${event.target.value}`)} placeholder="Search this conversation" className="h-9 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 text-sm outline-none" /> : null}
        </header>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 md:p-5">
          {filteredMessages.map((message) => <MessageRow key={message.id} message={message} conversationId={selectedId} onReact={(reaction) => (message.reactions?.[reaction] ?? []).includes("You") ? removeReaction(selectedId, message.id, reaction) : addReaction(selectedId, message.id, reaction)} onPin={() => pinMessage(selectedId, message.id, !message.pinned)} onTask={() => messageAction(message, "task")} onDecision={() => messageAction(message, "decision")} onEdit={(body) => editMessage(selectedId, message.id, body)} onDelete={() => deleteMessage(selectedId, message.id)} />)}
          {!filteredMessages.length ? <div className="rounded-xl border border-dashed border-[var(--border-subtle)] p-8 text-center text-sm text-[var(--text-muted)]">No matching messages.</div> : null}
        </div>
        {notice ? <p className="mx-4 rounded-lg bg-[var(--accent)]/10 px-3 py-2 text-xs text-[var(--text-secondary)]">{notice}</p> : null}
        <div className="sticky bottom-0 border-t border-[var(--border-subtle)] bg-[var(--pulse-panel)] p-3 md:p-4">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-2 focus-within:border-[var(--accent)]/60">
            <textarea aria-label={`Write a message in ${title}`} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onComposerKeyDown} placeholder={`Message ${title}`} rows={2} className="max-h-32 w-full resize-none bg-transparent px-2 py-1 text-sm text-[var(--text-primary)] outline-none" />
            <div className="flex items-center justify-between"><div className="flex gap-1"><button disabled title="Attachments require storage integration" aria-label="Attachment requires integration" className="rounded-lg p-2 text-[var(--text-muted)] disabled:opacity-50"><Paperclip className="h-4 w-4" /></button><button type="button" onClick={() => setDraft((value) => `${value}@`)} aria-label="Mention someone" className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--card-raised-bg)]"><AtSign className="h-4 w-4" /></button></div><button type="button" onClick={sendMessage} disabled={!draft.trim()} className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"><Send className="h-3.5 w-3.5" />Send</button></div>
          </div>
          <p className="mt-1.5 text-[10px] text-[var(--text-muted)]">Enter to send · Shift+Enter for a new line</p>
        </div>
      </section>

      <aside className="p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Conversation context</p>
        {isDm && member ? <div className="mt-4"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-bold text-white">{member.initials}</div><div><p className="font-semibold text-[var(--text-primary)]">{member.name}</p><p className="text-xs text-[var(--text-muted)]">{member.role} · {member.team}</p></div></div><dl className="mt-4 grid grid-cols-2 gap-2 text-xs"><ContextStat label="Availability" value={member.availability} /><ContextStat label="Capacity" value={`${member.workloadCapacity}%`} /><ContextStat label="Tasks" value={String(member.assignedTasks)} /><ContextStat label="Confidence" value={member.deliveryConfidence} /></dl></div> : <><p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{room?.aiSummary ?? "Select a work room to see its linked context."}</p><div className="mt-4 grid grid-cols-2 gap-2"><ContextStat label="Open tasks" value={String(tasks.filter((task) => task.project === room?.linkedProject && task.status !== "Completed").length)} /><ContextStat label="Approvals" value={String(approvals.filter((approval) => approval.project === room?.linkedProject && approval.status === "Waiting").length)} /><ContextStat label="Pinned" value={String(messages.filter((message) => message.pinned).length)} /><ContextStat label="Project" value={context} /></div></>}
        <div className="mt-4 grid gap-2"><button onClick={startHuddle} className={`${subtleButton} bg-[var(--accent)] text-white`}><PhoneCall className="h-3.5 w-3.5" />Start huddle</button><button onClick={() => setScheduleOpen(true)} className={subtleButton}>Schedule check-in</button>{room ? <button onClick={() => { summarizeChatRoom(room.id); setNotice("Summary refreshed and saved."); }} className={subtleButton}>Summarize conversation</button> : null}</div>
      </aside>

      <Modal open={scheduleOpen} onClose={() => setScheduleOpen(false)} title={`Schedule ${title} check-in`} description="Creates a persistent meeting in Pulse." footer={<button form="schedule-chat-meeting" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">Schedule meeting</button>}><form id="schedule-chat-meeting" onSubmit={schedule}><label className="text-sm text-[var(--text-secondary)]">Agenda<textarea value={agenda} onChange={(event) => setAgenda(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 outline-none" placeholder="What should this meeting resolve?" /></label></form></Modal>
    </div>
  );
}

function ContextStat({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3"><dt className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</dt><dd className="mt-1 truncate font-semibold text-[var(--text-primary)]">{value}</dd></div>;
}

function MessageRow({ message, conversationId, onReact, onPin, onTask, onDecision, onEdit, onDelete }: { message: ChatMessage; conversationId: string; onReact: (reaction: string) => void; onPin: () => void; onTask: () => void; onDecision: () => void; onEdit: (body: string) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(message.body);
  const mine = message.sender === "You" || message.sender === "Mithilessh";
  return <article className="group flex gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/20 text-xs font-bold text-[var(--text-primary)]">{message.senderInitials}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-[var(--text-primary)]">{message.sender}</p><span className="text-[10px] text-[var(--text-muted)]">{message.createdAt}{message.edited ? " · edited" : ""}</span>{message.pinned ? <Pin className="h-3 w-3 text-[var(--accent-2)]" /> : null}</div>{editing ? <form onSubmit={(event) => { event.preventDefault(); onEdit(body); setEditing(false); }} className="mt-2 flex gap-2"><input aria-label="Edit message" value={body} onChange={(event) => setBody(event.target.value)} className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 text-sm outline-none" /><button className="rounded-lg bg-[var(--accent)] px-3 text-xs text-white">Save</button></form> : <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--text-secondary)]">{message.body}</p>}<div className="mt-2 flex flex-wrap items-center gap-1.5">{Object.entries(message.reactions ?? {}).filter(([, people]) => people.length).map(([reaction, people]) => <button key={reaction} onClick={() => onReact(reaction)} className="rounded-full border border-[var(--border-subtle)] bg-[var(--card-bg)] px-2 py-0.5 text-xs">{reaction} {people.length}</button>)}<button onClick={() => onReact("👍")} title="React" className="rounded-md p-1.5 text-[var(--text-muted)] opacity-70 hover:bg-[var(--card-bg)] hover:opacity-100"><SmilePlus className="h-3.5 w-3.5" /></button><button onClick={onPin} title={message.pinned ? "Unpin" : "Pin"} className="rounded-md p-1.5 text-[var(--text-muted)] opacity-70 hover:bg-[var(--card-bg)] hover:opacity-100"><Pin className="h-3.5 w-3.5" /></button><button onClick={onTask} disabled={Boolean(message.convertedToTaskId)} title="Convert to task" className="rounded-md p-1.5 text-[var(--text-muted)] opacity-70 hover:bg-[var(--card-bg)] hover:opacity-100 disabled:opacity-30"><CheckSquare className="h-3.5 w-3.5" /></button><button onClick={onDecision} disabled={Boolean(message.pinnedAsDecisionId)} title="Pin as decision" className="rounded-md p-1.5 text-[var(--text-muted)] opacity-70 hover:bg-[var(--card-bg)] hover:opacity-100 disabled:opacity-30"><Pin className="h-3.5 w-3.5" /></button><button onClick={() => navigator.clipboard?.writeText(message.body)} title="Copy message" className="rounded-md p-1.5 text-[var(--text-muted)] opacity-70 hover:bg-[var(--card-bg)] hover:opacity-100"><Copy className="h-3.5 w-3.5" /></button>{mine ? <><button onClick={() => setEditing(true)} title="Edit message" className="rounded-md p-1.5 text-[var(--text-muted)] opacity-70 hover:bg-[var(--card-bg)] hover:opacity-100"><Pencil className="h-3.5 w-3.5" /></button><button onClick={onDelete} title="Delete message" className="rounded-md p-1.5 text-[var(--text-muted)] opacity-70 hover:bg-red-400/10 hover:text-red-300 hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button></> : null}</div></div></article>;
}
