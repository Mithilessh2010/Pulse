"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarClock, Copy, FileText, Link2, PhoneCall, Play, Plus, Sparkles } from "lucide-react";
import { Modal } from "@/components/app/Modal";
import { CallRoom } from "@/components/communication/CallRoom";
import { usePulseStore } from "@/stores/usePulseStore";

const button = "inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]";

export function CallsHub() {
  const router = useRouter();
  const params = useSearchParams();
  const calls = usePulseStore((state) => state.calls);
  const createCall = usePulseStore((state) => state.createCall);
  const generateCallAgenda = usePulseStore((state) => state.generateCallAgenda);
  const createCallFollowUpTasks = usePulseStore((state) => state.createCallFollowUpTasks);
  const [activeRoom, setActiveRoom] = useState<string | null>(params.get("call"));
  const [joinOpen, setJoinOpen] = useState(false);
  const [invite, setInvite] = useState("");

  useEffect(() => { const requested = params.get("call"); if (requested && calls.some((call) => call.id === requested)) setActiveRoom(requested); }, [calls, params]);

  function openCall(callId: string) { setActiveRoom(callId); router.replace(`/app/calls?call=${callId}`); }
  function instant() { const id = createCall({ title: "Instant Manager Huddle", status: "In progress", startedAt: "Now", participants: ["You", "Maya", "Jordan"], reason: "Instant alignment from Calls." }); openCall(id); }
  function joinLink() { const known = calls.find((call) => invite.includes(call.id)); if (known) openCall(known.id); else { const id = createCall({ title: "Joined Pulse Huddle", status: "In progress", startedAt: "Now", participants: ["You", "Guest participant"], reason: "Joined from a shared Pulse meeting link." }); openCall(id); } setJoinOpen(false); }

  const suggested = calls.filter((call) => call.status === "Suggested" || call.status === "Scheduled");
  const completed = calls.filter((call) => call.status === "Completed");
  const active = calls.filter((call) => call.status === "In progress");

  return <div className="space-y-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-xl font-semibold text-[var(--text-primary)]">Calls & Huddles</h1><p className="mt-1 text-sm text-[var(--text-muted)]">Work-tied calls with local media, persistent notes, chat, and follow-ups.</p></div><div className="flex gap-2"><button onClick={() => setJoinOpen(true)} className={button}><Link2 className="h-3.5 w-3.5" />Join by link</button><button onClick={instant} className={`${button} bg-[var(--accent)] text-white`}><Plus className="h-3.5 w-3.5" />Start instant huddle</button></div></div>
    {active.length ? <section className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent-2)]">Active huddle</p>{active.map((call) => <div key={call.id} className="mt-3 flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-[var(--text-primary)]">{call.title}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{call.participants.join(", ")} · started {call.startedAt}</p></div><button onClick={() => openCall(call.id)} className={`${button} bg-[var(--accent)] text-white`}><Play className="h-3.5 w-3.5" />Resume call</button></div>)}</section> : null}
    <section><h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Suggested & scheduled</h2><div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">{suggested.map((call) => <article key={call.id} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4"><div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15"><PhoneCall className="h-4 w-4 text-[var(--accent-2)]" /></div><span className="rounded-md border border-[var(--border-subtle)] px-2 py-1 text-[10px] text-[var(--text-muted)]">{call.status}</span></div><h3 className="mt-3 font-semibold text-[var(--text-primary)]">{call.title}</h3><p className="mt-1 text-xs text-[var(--text-muted)]">{call.participants.join(", ")} · {call.duration}</p><p className="mt-3 min-h-10 text-sm leading-5 text-[var(--text-secondary)]">{call.reason}</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => openCall(call.id)} className={`${button} bg-[var(--accent)] text-white`}><Play className="h-3.5 w-3.5" />{call.status === "Scheduled" ? "Join call" : "Start huddle"}</button><button onClick={() => generateCallAgenda(call.id)} className={button}><Sparkles className="h-3.5 w-3.5" />Agenda</button><button onClick={() => navigator.clipboard?.writeText(`${location.origin}/app/calls?call=${call.id}`)} title="Copy invite link" className={button}><Copy className="h-3.5 w-3.5" /></button></div></article>)}</div></section>
    <section className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4"><h2 className="font-semibold text-[var(--text-primary)]">Recent call history</h2><div className="mt-3 space-y-2">{completed.length ? completed.map((call) => <div key={call.id} className="rounded-xl border border-[var(--border-subtle)] p-3"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-[var(--text-primary)]">{call.title}</p><p className="mt-1 text-xs text-[var(--text-muted)]">Ended {call.endedAt ?? "recently"} · {call.actionItemIds.length} follow-ups</p></div><button onClick={() => openCall(call.id)} className={button}><FileText className="h-3.5 w-3.5" />View notes</button></div></div>) : <p className="text-sm text-[var(--text-muted)]">End a huddle to build call history.</p>}</div></div><div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4"><h2 className="font-semibold text-[var(--text-primary)]">Recordings & notes</h2><p className="mt-3 text-sm text-[var(--text-muted)]">Notes, summaries, decisions, and action items are saved locally. Cloud recording requires integration.</p><button disabled title="Cloud recording requires integration" className={`${button} mt-4 opacity-50`}><CalendarClock className="h-3.5 w-3.5" />Cloud recording requires integration</button>{completed[0] ? <button onClick={() => createCallFollowUpTasks(completed[0].id)} className={`${button} mt-2 w-full`}>Create follow-up task from latest call</button> : null}</div></section>
    {activeRoom ? <CallRoom callId={activeRoom} onClose={() => { setActiveRoom(null); router.replace("/app/calls"); }} onEnded={() => { setActiveRoom(null); router.replace("/app/calls"); }} /> : null}
    <Modal open={joinOpen} onClose={() => setJoinOpen(false)} title="Join a Pulse huddle" description="Paste a Pulse meeting link or call ID." footer={<button onClick={joinLink} disabled={!invite.trim()} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Join call</button>}><input aria-label="Meeting link" value={invite} onChange={(event) => setInvite(event.target.value)} placeholder="https://pulse.../app/calls?call=..." className="h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 text-sm outline-none" /></Modal>
  </div>;
}
