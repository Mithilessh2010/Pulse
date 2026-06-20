"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Command,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Palette,
  PhoneCall,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { PulseLogo } from "@/components/PulseLogo";
import { Modal } from "@/components/app/Modal";
import type { AuthUser } from "@/lib/auth";
import { usePulseStore } from "@/stores/usePulseStore";

type ControlModal = "New Message" | "Start Huddle" | "Schedule Meeting";

const teamOptions = ["All teams", "Product", "Design", "Engineering", "Operations", "Finance"];

const appearanceOptions = [
  { id: "midnight", name: "Midnight Pulse" },
  { id: "graphite", name: "Graphite" },
  { id: "aurora", name: "Aurora" },
  { id: "light", name: "Light Executive" },
];

const suggestions = [
  { type: "Ask Pulse", label: "What needs attention?", href: "/app/ask?prompt=What%20needs%20attention%3F", Icon: Sparkles },
  { type: "Project", label: "Website Redesign", href: "/app/projects?project=website-redesign", Icon: BriefcaseBusiness },
  { type: "Person", label: "Maya Chen", href: "/app/team?member=maya", Icon: Users },
  { type: "Approval", label: "Q3 dashboard proof", href: "/app/approvals?approval=q3-dashboard-proof", Icon: CheckCircle2 },
  { type: "Task", label: "Review pricing page copy", href: "/app/tasks?task=review-pricing-page-copy", Icon: Plus },
  { type: "Team", label: "Product", href: "/app/teams", Icon: LayoutGrid },
];

const pageLabels: Record<string, string> = {
  "/app": "Command center",
  "/app/autopilot": "Autopilot",
  "/app/inbox": "Inbox",
  "/app/ask": "Ask Pulse",
  "/app/projects": "Projects",
  "/app/tasks": "Tasks",
  "/app/approvals": "Approvals",
  "/app/reports": "Reports",
  "/app/settings": "Settings",
};

export function ManagerControlBar({ currentUser, onOpenSidebar, onOpenPalette }: { currentUser: AuthUser; onOpenSidebar: () => void; onOpenPalette: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const commandRef = useRef<HTMLInputElement>(null);
  const enterprise = usePulseStore((state) => state.enterprise);
  const members = usePulseStore((state) => state.members);
  const notifications = usePulseStore((state) => state.notifications);
  const selectedTheme = usePulseStore((state) => state.selectedTheme);
  const setSelectedTheme = usePulseStore((state) => state.setSelectedTheme);
  const selectedTeam = usePulseStore((state) => state.selectedTeamContext);
  const setSelectedTeam = usePulseStore((state) => state.setSelectedTeamContext);
  const markNotificationRead = usePulseStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = usePulseStore((state) => state.markAllNotificationsRead);
  const resetDemoData = usePulseStore((state) => state.resetDemoData);
  const createTask = usePulseStore((state) => state.createTask);
  const inviteMember = usePulseStore((state) => state.inviteMember);
  const createCall = usePulseStore((state) => state.createCall);
  const generateReport = usePulseStore((state) => state.generateReport);
  const sendChatMessage = usePulseStore((state) => state.sendChatMessage);
  const sendDirectMessage = usePulseStore((state) => state.sendDirectMessage);
  const scheduleMeeting = usePulseStore((state) => state.scheduleMeeting);
  const chatRooms = usePulseStore((state) => state.chatRooms);

  const [command, setCommand] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modal, setModal] = useState<ControlModal | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftNotes, setDraftNotes] = useState("");

  const unreadCount = notifications.filter((item) => item.unread).length;
  const activeThemeName = appearanceOptions.find((item) => item.id === selectedTheme)?.name ?? "Midnight Pulse";
  const userInitial = currentUser.name.trim().charAt(0).toUpperCase() || "U";
  const filteredSuggestions = useMemo(() => {
    const clean = command.trim().toLowerCase();
    if (!clean) return suggestions;
    return suggestions.filter((item) => `${item.type} ${item.label}`.toLowerCase().includes(clean));
  }, [command]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenPalette();
      }
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        event.preventDefault();
        commandRef.current?.focus();
      }
      if (event.key === "Escape") closeMenus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenPalette]);

  function closeMenus() {
    setWorkspaceOpen(false);
    setTeamOpen(false);
    setActionsOpen(false);
    setRiskOpen(false);
    setNotificationsOpen(false);
    setAppearanceOpen(false);
    setProfileOpen(false);
    setSuggestionsOpen(false);
  }

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = command.trim();
    router.push(prompt ? `/app/ask?prompt=${encodeURIComponent(prompt)}` : "/app/ask");
    setSuggestionsOpen(false);
  }

  function openModal(kind: ControlModal) {
    closeMenus();
    setModal(kind);
    setDraftName("");
    setDraftNotes("");
  }

  function saveModal() {
    if (modal === "New Message") {
      const member = members.find((item) => item.id === draftName);
      const room = chatRooms.find((item) => item.id === draftName);
      if (member) { sendDirectMessage(member.id, draftNotes || `Hi ${member.name}, can we align on current priorities?`); router.push(`/app/chat?dm=${member.id}`); }
      else if (room) { sendChatMessage(room.id, draftNotes || "Sharing a manager update with this room."); router.push(`/app/chat?room=${room.id}`); }
    }
    if (modal === "Start Huddle") {
      const callId = createCall({ title: draftName || "Manager Huddle", relatedTeam: selectedTeam === "All teams" ? undefined : selectedTeam, reason: draftNotes || "Started from the Manager Control Bar.", status: "In progress", startedAt: "Now" });
      router.push(`/app/calls?call=${callId}`);
    }
    if (modal === "Schedule Meeting") {
      const meetingId = scheduleMeeting({ title: draftName || "Manager Check-in", participants: ["You", "Maya Chen", "Jordan Lee"], project: selectedTeam === "All teams" ? "Workspace" : selectedTeam, agenda: draftNotes || "Review priorities and assign next actions" });
      router.push(`/app/meetings?meeting=${meetingId}`);
    }
    setModal(null);
  }

  async function logout() {
    window.localStorage.removeItem("pulse-demo-session");
    window.localStorage.removeItem("pulse-demo-state-v1");
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/signin");
      router.refresh();
    }
  }

  const quickActions = [
    { label: "Message", tooltip: "New message", Icon: MessageSquare, action: () => openModal("New Message") },
    { label: "Huddle", tooltip: "Start huddle", Icon: PhoneCall, action: () => openModal("Start Huddle") },
    { label: "Meeting", tooltip: "Schedule meeting", Icon: CalendarClock, action: () => openModal("Schedule Meeting") },
    { label: "Approvals", tooltip: "Review approvals", Icon: CheckCircle2, action: () => router.push("/app/approvals") },
    { label: "Ask Pulse", tooltip: "Ask Pulse", Icon: Sparkles, action: () => router.push("/app/ask") },
  ];

  return (
    <header className="sticky top-0 z-40 min-w-0 border-b border-[var(--border-subtle)] bg-[var(--app-bg)]/78 px-3 py-3 backdrop-blur-2xl md:px-5">
      <div className="mx-auto flex min-h-[64px] max-w-[1680px] items-center gap-2 lg:gap-3">
        <button aria-label="Open sidebar" onClick={onOpenSidebar} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-muted)] lg:hidden">
          <Menu className="h-4 w-4" />
        </button>

        <div className="relative z-20 hidden min-w-0 shrink-0 items-center gap-2 lg:flex">
          <MenuButton open={workspaceOpen} onClick={() => { closeMenus(); setWorkspaceOpen(true); }} className="min-w-[150px]">
            <span className="[&>div]:h-6 [&>div]:w-6 [&_svg]:h-6 [&_svg]:w-6"><PulseLogo /></span>
            <span className="truncate">{currentUser.workspaceName}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          </MenuButton>
          <MenuButton open={teamOpen} onClick={() => { closeMenus(); setTeamOpen(true); }} className="min-w-[128px]">
            <Users className="h-3.5 w-3.5" />
            <span className="truncate">{selectedTeam}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          </MenuButton>
          <span className="hidden h-9 items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 text-xs font-medium text-[var(--text-muted)] 2xl:flex">{pageLabels[pathname] ?? "Workspace"}</span>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 lg:hidden">
          <button type="button" onClick={() => { closeMenus(); setWorkspaceOpen(true); }} className="min-w-0 flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-left text-sm font-semibold text-[var(--text-primary)]">
            <span className="block truncate">{currentUser.workspaceName}</span>
          </button>
          <button aria-label="Ask Pulse or search" onClick={() => commandRef.current?.focus()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-muted)]">
            <Search className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submitCommand} className="relative z-10 hidden min-w-0 flex-1 md:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            ref={commandRef}
            aria-label="Ask Pulse or search projects, people, tasks"
            value={command}
            onChange={(event) => { setCommand(event.target.value); setSuggestionsOpen(true); }}
            onFocus={() => setSuggestionsOpen(true)}
            placeholder="Ask Pulse or search projects, people, tasks..."
            className="h-12 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--card-raised-bg)]/70 pl-11 pr-28 text-sm text-[var(--text-primary)] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition placeholder:text-[var(--text-muted)] focus:border-[var(--pulse-accent)]/70 focus:bg-[var(--pulse-panel)]"
          />
          <button type="button" onClick={onOpenPalette} className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-[var(--border-subtle)] px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] lg:block">Cmd K</button>
          <AnimatePresence>
            {suggestionsOpen ? (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute left-0 right-0 top-14 z-50 max-h-[calc(100dvh-96px)] overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--pulse-panel)]/98 p-2 shadow-2xl backdrop-blur-xl">
                {filteredSuggestions.map(({ type, label, href, Icon }) => (
                  <button key={`${type}-${label}`} type="button" onClick={() => { router.push(href); setSuggestionsOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-[var(--card-bg)]">
                    <Icon className="h-4 w-4 text-[var(--text-muted)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-[var(--text-primary)]">{label}</span>
                      <span className="block text-xs text-[var(--text-muted)]">{type}</span>
                    </span>
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <div className="hidden items-center gap-1.5 xl:flex">
            {quickActions.map(({ label, tooltip, Icon, action }) => (
              <button key={label} title={tooltip} aria-label={tooltip} type="button" onClick={action} className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] 2xl:w-auto 2xl:px-3">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden 2xl:inline">{label}</span>
              </button>
            ))}
          </div>

          <button title="More actions" aria-label="Open quick actions" onClick={() => { closeMenus(); setActionsOpen(true); }} className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-muted)] xl:hidden">
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <button title="View risks" onClick={() => { closeMenus(); setRiskOpen(true); }} className="hidden h-10 items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/[0.07] px-3 text-xs font-semibold text-red-200 md:inline-flex">
            <AlertTriangle className="h-3.5 w-3.5" />
            4 risks
          </button>
          <button title="Open notifications" aria-label="Open notifications" onClick={() => { closeMenus(); setNotificationsOpen(true); }} className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] text-[var(--text-muted)]">
            <Bell className="h-4 w-4" />
            {unreadCount ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[var(--accent-2)] px-1.5 text-[10px] font-bold text-white">{unreadCount}</span> : null}
          </button>
          <button title={`Appearance: ${activeThemeName}`} aria-label="Open appearance menu" onClick={() => { closeMenus(); setAppearanceOpen(true); }} className="hidden h-10 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 text-xs font-semibold text-[var(--text-secondary)] lg:inline-flex">
            {selectedTheme === "light" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            <span className="hidden 2xl:inline">{activeThemeName}</span>
          </button>
          <button title={`Profile: ${currentUser.name}`} aria-label={`Open profile menu for ${currentUser.name}`} onClick={() => { closeMenus(); setProfileOpen(true); }} className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--pulse-accent)] text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.24)]">{userInitial}</button>
        </div>
      </div>

      <div className="mt-2 block md:hidden">
        <form onSubmit={submitCommand} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input ref={commandRef} value={command} onChange={(event) => { setCommand(event.target.value); setSuggestionsOpen(true); }} onFocus={() => setSuggestionsOpen(true)} placeholder="Ask Pulse or search anything..." className="h-10 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--card-raised-bg)] pl-9 pr-3 text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--pulse-accent)]/70" />
        </form>
      </div>

      <FloatingMenu open={workspaceOpen} onClose={() => setWorkspaceOpen(false)} className="left-3 top-[74px] w-[300px] lg:left-[305px]">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{currentUser.workspaceName}</p>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{enterprise.plan} · {members.length} members</p>
        <div className="mt-3 space-y-1">
          <div className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)]"><span className="truncate">{currentUser.workspaceName}</span><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-2)]">Current</span></div>
          <button disabled className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--text-muted)] opacity-55">Create workspace</button>
          <button onClick={() => router.push("/app/settings")} className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--card-bg)]">Manage workspace</button>
        </div>
      </FloatingMenu>

      <FloatingMenu open={teamOpen} onClose={() => setTeamOpen(false)} className="left-3 top-[74px] w-[230px] lg:left-[470px]">
        {teamOptions.map((team) => (
          <button key={team} onClick={() => { setSelectedTeam(team); setTeamOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${selectedTeam === team ? "bg-[var(--card-bg)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--card-bg)]"}`}>
            {team}
            {selectedTeam === team ? <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-2)]" /> : null}
          </button>
        ))}
      </FloatingMenu>

      <ActionSheet open={actionsOpen} onClose={() => setActionsOpen(false)} title="Quick actions">
        {quickActions.map(({ label, Icon, action }) => <button key={label} onClick={action} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--card-bg)]"><Icon className="h-4 w-4" />{label}</button>)}
      </ActionSheet>

      <ActionSheet open={riskOpen} onClose={() => setRiskOpen(false)} title="Workspace risks">
        {["Website Redesign at risk", "Investor Update blocked", "Product needs support", "Budget watch"].map((risk) => <button key={risk} onClick={() => router.push("/app/projects?filter=at-risk")} className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--card-bg)]"><AlertTriangle className="mt-0.5 h-4 w-4 text-red-300" />{risk}</button>)}
      </ActionSheet>

      <ActionSheet open={notificationsOpen} onClose={() => setNotificationsOpen(false)} title="Notifications" aside>
        <button onClick={markAllNotificationsRead} className="mb-3 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-[var(--text-secondary)]">Mark all read</button>
        <div className="space-y-2">
          {notifications.map((item) => <div key={item.id} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3"><div className="flex gap-3"><div className={`mt-1 h-2 w-2 rounded-full ${item.unread ? "bg-[var(--accent-2)]" : "bg-[var(--text-muted)]"}`} /><div><p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{item.description}</p><button onClick={() => markNotificationRead(item.id)} className="mt-2 text-xs font-semibold text-[var(--text-secondary)]">{item.unread ? "Mark read" : item.action}</button></div></div></div>)}
        </div>
      </ActionSheet>

      <FloatingMenu open={appearanceOpen} onClose={() => setAppearanceOpen(false)} className="right-14 top-[74px] w-[260px]">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Appearance</p>
        {appearanceOptions.map((theme) => <button key={theme.id} onClick={() => { setSelectedTheme(theme.id); setAppearanceOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${selectedTheme === theme.id ? "bg-[var(--card-bg)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--card-bg)]"}`}><span className="inline-flex items-center gap-2"><Palette className="h-3.5 w-3.5" />{theme.name}</span>{selectedTheme === theme.id ? <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent-2)]" /> : null}</button>)}
      </FloatingMenu>

      <FloatingMenu open={profileOpen} onClose={() => setProfileOpen(false)} className="right-3 top-[74px] w-[270px]">
        <div className="mb-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3">
          <p className="font-semibold text-[var(--text-primary)]">{currentUser.name}</p>
          <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{currentUser.email}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Owner · {currentUser.workspaceName}</p>
        </div>
        <button onClick={() => router.push("/app/settings")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--card-bg)]"><Settings className="h-4 w-4" />Settings</button>
        <button onClick={resetDemoData} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--card-bg)]"><Bot className="h-4 w-4" />Reset demo data</button>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--card-bg)]"><LogOut className="h-4 w-4" />Logout</button>
      </FloatingMenu>

      <Modal open={Boolean(modal)} onClose={() => setModal(null)} title={modal ?? "Quick action"} description={`${selectedTeam} context · saved to demo workspace`} footer={<button onClick={saveModal} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--pulse-accent)] px-4 py-3 text-sm font-semibold text-white sm:ml-auto sm:w-auto"><CheckCircle2 className="h-4 w-4" />Save</button>}>
              <div className="space-y-3">
                {modal === "New Message" ? <label className="block text-sm text-[var(--text-secondary)]">Recipient or room<select aria-label="Message recipient" value={draftName} onChange={(event) => setDraftName(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--pulse-panel)] px-3 text-sm outline-none"><option value="">Select a conversation</option><optgroup label="People">{members.filter((member) => member.id !== "mithilessh").map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</optgroup><optgroup label="Work rooms">{chatRooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</optgroup></select></label> : <input aria-label={`${modal} title`} value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder={`${modal} title`} className="h-11 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--pulse-accent)]/60" />}
                <textarea aria-label={modal === "New Message" ? "Message body" : "Action context"} value={draftNotes} onChange={(event) => setDraftNotes(event.target.value)} placeholder={modal === "New Message" ? "Write your message..." : modal === "Schedule Meeting" ? "Add an agenda..." : "Add context..."} className="min-h-32 max-h-56 w-full resize-y overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--pulse-accent)]/60" />
              </div>
      </Modal>
    </header>
  );
}

function MenuButton({ children, className = "", open, onClick }: { children: React.ReactNode; className?: string; open: boolean; onClick: () => void }) {
  return <button type="button" aria-expanded={open} onClick={onClick} className={`inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] ${className}`}>{children}</button>;
}

function FloatingMenu({ open, onClose, className, children }: { open: boolean; onClose: () => void; className: string; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open ? (
        <>
          <button aria-label="Close menu" className="fixed inset-0 z-40 cursor-default" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className={`fixed z-50 max-h-[calc(100vh-96px)] max-h-[calc(100dvh-96px)] max-w-[calc(100vw-24px)] overflow-x-hidden overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--pulse-panel)]/98 p-2 shadow-2xl backdrop-blur-xl ${className}`}>
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function ActionSheet({ open, onClose, title, aside = false, children }: { open: boolean; onClose: () => void; title: string; aside?: boolean; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close panel" className="absolute inset-0" onClick={onClose} />
          <motion.div initial={aside ? { x: 420 } : { y: 260 }} animate={aside ? { x: 0 } : { y: 0 }} exit={aside ? { x: 420 } : { y: 260 }} className={aside ? "absolute right-0 top-0 flex h-dvh w-full max-w-[420px] flex-col overflow-hidden border-l border-[var(--border-subtle)] bg-[var(--pulse-panel)] shadow-2xl" : "absolute bottom-0 left-0 right-0 flex max-h-[78dvh] flex-col overflow-hidden rounded-t-xl border-t border-[var(--border-subtle)] bg-[var(--pulse-panel)] shadow-2xl md:left-auto md:bottom-auto md:right-5 md:top-[74px] md:max-h-[calc(100dvh-96px)] md:w-[320px] md:rounded-xl md:border"}>
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border-subtle)] p-5">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
              <button aria-label="Close panel" onClick={onClose} className="rounded-lg border border-[var(--border-subtle)] p-2 text-[var(--text-muted)]"><X className="h-4 w-4" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
