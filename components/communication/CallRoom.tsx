"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Camera, CameraOff, CheckSquare, Copy, FileText, MessageSquare, Mic, MicOff, MonitorUp, PhoneOff, ScreenShareOff, Send, Sparkles, Users, X } from "lucide-react";
import { usePulseStore } from "@/stores/usePulseStore";

export function CallRoom({ callId, onClose, onEnded }: { callId: string; onClose: () => void; onEnded?: () => void }) {
  const call = usePulseStore((state) => state.calls.find((item) => item.id === callId));
  const startCall = usePulseStore((state) => state.startCall);
  const endCall = usePulseStore((state) => state.endCall);
  const updateCallNotes = usePulseStore((state) => state.updateCallNotes);
  const sendCallMessage = usePulseStore((state) => state.sendCallMessage);
  const generateCallSummary = usePulseStore((state) => state.generateCallSummary);
  const createCallFollowUpTasks = usePulseStore((state) => state.createCallFollowUpTasks);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [displayStream, setDisplayStream] = useState<MediaStream | null>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [mediaNotice, setMediaNotice] = useState("Camera and microphone are off until you enable them.");
  const [panel, setPanel] = useState<"chat" | "notes" | "participants" | null>("notes");
  const [chatDraft, setChatDraft] = useState("");
  const [seconds, setSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (call && call.status !== "In progress") startCall(call.id);
  }, [call, startCall]);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, [stream]);
  useEffect(() => { if (screenRef.current) screenRef.current.srcObject = displayStream; }, [displayStream]);
  useEffect(() => () => { stream?.getTracks().forEach((track) => track.stop()); displayStream?.getTracks().forEach((track) => track.stop()); }, [displayStream, stream]);

  if (!call) return null;

  async function enableMedia() {
    if (!navigator.mediaDevices?.getUserMedia) { setMediaNotice("Camera and microphone are unavailable in this browser."); return; }
    try {
      const next = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setStream(next); setMuted(false); setCameraOff(false); setMediaNotice("Local camera and microphone connected.");
    } catch {
      setMediaNotice("Camera or microphone permission was denied. You can continue with the fallback tile.");
    }
  }

  function toggleMute() {
    if (!stream) { void enableMedia(); return; }
    const next = !muted; stream.getAudioTracks().forEach((track) => { track.enabled = !next; }); setMuted(next);
  }

  function toggleCamera() {
    if (!stream) { void enableMedia(); return; }
    const next = !cameraOff; stream.getVideoTracks().forEach((track) => { track.enabled = !next; }); setCameraOff(next);
  }

  async function toggleScreenShare() {
    if (displayStream) { displayStream.getTracks().forEach((track) => track.stop()); setDisplayStream(null); return; }
    if (!navigator.mediaDevices?.getDisplayMedia) { setMediaNotice("Screen sharing is not supported by this browser."); return; }
    try {
      const next = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      next.getVideoTracks()[0]?.addEventListener("ended", () => setDisplayStream(null));
      setDisplayStream(next); setMediaNotice("Screen share is active.");
    } catch { setMediaNotice("Screen share was cancelled or blocked."); }
  }

  function finishCall() {
    stream?.getTracks().forEach((track) => track.stop()); displayStream?.getTracks().forEach((track) => track.stop());
    endCall(callId); setStream(null); setDisplayStream(null); onEnded?.();
  }

  function submitChat(event: FormEvent) { event.preventDefault(); sendCallMessage(callId, chatDraft); setChatDraft(""); }
  const elapsed = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#05070c] text-white">
    <header className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3"><div className="min-w-0 flex-1"><p className="truncate font-semibold">{call.title}</p><p className="text-xs text-white/50">Live · {elapsed} · {call.relatedProject ?? call.relatedTeam ?? "Workspace"}</p></div><button onClick={onClose} aria-label="Minimize call room" className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white"><X className="h-4 w-4" /></button></header>
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <main className="flex min-h-0 flex-1 flex-col p-3 md:p-5"><div className={`grid min-h-0 flex-1 gap-3 ${call.participants.length > 2 ? "md:grid-cols-2" : ""}`}>
        <div className="relative min-h-48 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#171a2c] to-[#0b111c]">{displayStream ? <video ref={screenRef} autoPlay playsInline className="h-full w-full object-contain" /> : stream && !cameraOff ? <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover [transform:scaleX(-1)]" /> : <div className="flex h-full flex-col items-center justify-center"><div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#6D5DFB] text-2xl font-bold">Y</div><p className="mt-3 text-sm">You</p><p className="mt-1 max-w-xs text-center text-xs text-white/45">{mediaNotice}</p>{!stream ? <button onClick={enableMedia} className="mt-3 rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/5">Enable camera & mic</button> : null}</div>}<span className="absolute bottom-3 left-3 rounded-md bg-black/45 px-2 py-1 text-xs">You {muted ? "· Muted" : ""}</span></div>
        {call.participants.filter((person) => person !== "You" && person !== "Mithilessh").slice(0, 3).map((person, index) => <div key={person} className="relative min-h-40 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0a1220]"><div className="flex h-full flex-col items-center justify-center"><div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold ${index % 2 ? "bg-cyan-500/30" : "bg-violet-500/30"}`}>{person.slice(0, 2).toUpperCase()}</div><p className="mt-3 text-sm">{person}</p><p className="mt-1 text-xs text-emerald-300/70">Connected</p></div></div>)}
      </div><p className="mt-3 text-center text-xs text-white/45">{mediaNotice}</p></main>
      {panel ? <aside className="flex h-[42dvh] shrink-0 flex-col border-t border-white/10 bg-[#0a0d14] lg:h-auto lg:w-[360px] lg:border-l lg:border-t-0"><div className="flex items-center justify-between border-b border-white/10 p-4"><p className="font-semibold capitalize">{panel}</p><button onClick={() => setPanel(null)} aria-label="Close call panel" className="text-white/50"><X className="h-4 w-4" /></button></div><div className="min-h-0 flex-1 overflow-y-auto p-4">{panel === "notes" ? <div><textarea aria-label="Call notes" value={call.notes.join("\n")} onChange={(event) => updateCallNotes(call.id, event.target.value.split("\n"))} placeholder="Capture decisions, blockers, and action items..." className="min-h-40 w-full resize-y rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none focus:border-violet-400/60" /><div className="mt-3 grid gap-2"><button onClick={() => generateCallSummary(call.id)} className="rounded-lg border border-white/10 px-3 py-2 text-left text-xs hover:bg-white/5"><Sparkles className="mr-2 inline h-3.5 w-3.5" />Generate call summary</button><button onClick={() => createCallFollowUpTasks(call.id)} className="rounded-lg border border-white/10 px-3 py-2 text-left text-xs hover:bg-white/5"><CheckSquare className="mr-2 inline h-3.5 w-3.5" />Extract action items</button>{call.summary ? <div className="rounded-xl bg-violet-500/10 p-3 text-xs leading-5 text-white/70">{call.summary}<button onClick={() => navigator.clipboard?.writeText(call.summary ?? "")} className="mt-2 block text-violet-300"><Copy className="mr-1 inline h-3 w-3" />Copy summary</button></div> : null}</div></div> : panel === "chat" ? <div className="flex h-full flex-col"><div className="min-h-0 flex-1 space-y-3">{(call.chatMessages ?? []).map((message) => <div key={message.id} className="rounded-xl bg-white/5 p-3"><p className="text-xs font-semibold">{message.sender}</p><p className="mt-1 text-sm text-white/70">{message.body}</p></div>)}{!(call.chatMessages ?? []).length ? <p className="text-sm text-white/45">No in-call messages yet.</p> : null}</div><form onSubmit={submitChat} className="mt-3 flex gap-2"><input aria-label="In-call message" value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none" /><button disabled={!chatDraft.trim()} aria-label="Send in-call message" className="rounded-lg bg-violet-600 px-3 disabled:opacity-50"><Send className="h-4 w-4" /></button></form></div> : <div className="space-y-2">{["You", ...call.participants.filter((person) => person !== "You" && person !== "Mithilessh")].map((person) => <div key={person} className="flex items-center gap-3 rounded-xl bg-white/5 p-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold">{person.slice(0, 2).toUpperCase()}</div><span className="text-sm">{person}</span><span className="ml-auto text-xs text-emerald-300">In call</span></div>)}</div>}</div></aside> : null}
    </div>
    <footer className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-t border-white/10 bg-[#090c12] px-3 py-3"><Control active={!muted} label={muted ? "Unmute" : "Mute"} onClick={toggleMute} Icon={muted ? MicOff : Mic} /><Control active={!cameraOff} label={cameraOff ? "Camera on" : "Camera off"} onClick={toggleCamera} Icon={cameraOff ? CameraOff : Camera} /><Control active={Boolean(displayStream)} label={displayStream ? "Stop share" : "Share screen"} onClick={toggleScreenShare} Icon={displayStream ? ScreenShareOff : MonitorUp} /><Control active={panel === "chat"} label="Chat" onClick={() => setPanel(panel === "chat" ? null : "chat")} Icon={MessageSquare} /><Control active={panel === "notes"} label="Notes" onClick={() => setPanel(panel === "notes" ? null : "notes")} Icon={FileText} /><Control active={panel === "participants"} label="People" onClick={() => setPanel(panel === "participants" ? null : "participants")} Icon={Users} /><button onClick={finishCall} className="ml-1 inline-flex h-11 items-center gap-2 rounded-full bg-red-500 px-5 text-sm font-semibold"><PhoneOff className="h-4 w-4" />End</button></footer>
  </div>;
}

function Control({ active, label, onClick, Icon }: { active: boolean; label: string; onClick: () => void; Icon: typeof Mic }) {
  return <button onClick={onClick} title={label} aria-label={label} className={`inline-flex h-11 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition ${active ? "border-violet-400/40 bg-violet-500/15" : "border-white/10 bg-white/5 hover:bg-white/10"}`}><Icon className="h-4 w-4" /><span className="hidden sm:inline">{label}</span></button>;
}
