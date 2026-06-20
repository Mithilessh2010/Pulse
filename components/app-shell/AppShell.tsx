"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Command,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  MessageSquare,
  PhoneCall,
  Moon,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  Upload,
  Users,
  Wand2,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { PulseLogo } from "@/components/PulseLogo";
import { ManagerControlBar } from "@/components/app/ManagerControlBar";
import { Modal } from "@/components/app/Modal";
import { askPulseResponses } from "@/lib/mockData";
import type { AuthUser } from "@/lib/auth";
import { usePulseStore } from "@/stores/usePulseStore";

const navGroups = [
  {
    label: "Operate",
    items: [
      { label: "Command Center", href: "/app", Icon: LayoutDashboard },
      { label: "Autopilot", href: "/app/autopilot", Icon: Wand2 },
      { label: "Inbox", href: "/app/inbox", Icon: Inbox },
      { label: "Ask Pulse", href: "/app/ask", Icon: Command },
    ],
  },
  {
    label: "Work",
    items: [
      { label: "Projects", href: "/app/projects", Icon: FolderKanban },
      { label: "Tasks", href: "/app/tasks", Icon: ListChecks },
      { label: "Approvals", href: "/app/approvals", Icon: ClipboardCheck },
      { label: "Expenses", href: "/app/expenses", Icon: ReceiptText },
    ],
  },
  {
    label: "Organization",
    items: [
      { label: "Teams", href: "/app/teams", Icon: BriefcaseBusiness },
      { label: "People", href: "/app/team", Icon: Users },
      { label: "Chat", href: "/app/chat", Icon: MessageSquare },
      { label: "Calls", href: "/app/calls", Icon: PhoneCall },
      { label: "Meetings", href: "/app/meetings", Icon: CalendarDays },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Reports", href: "/app/reports", Icon: Activity },
      { label: "Decisions", href: "/app/decisions", Icon: ShieldCheck },
      { label: "Playbooks", href: "/app/playbooks", Icon: BookOpen },
      { label: "Import Data", href: "/app/import", Icon: Upload },
    ],
  },
  { label: "Admin", items: [{ label: "Settings", href: "/app/settings", Icon: Settings }] },
];

const allNavItems = navGroups.flatMap((group) => group.items);

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/app": { title: "Command Center", subtitle: "Live overview of work, people, approvals, spend, and risk" },
  "/app/autopilot": { title: "Pulse Autopilot", subtitle: "Turn messy manager instructions into organized actions" },
  "/app/inbox": { title: "Manager Inbox", subtitle: "Everything needing review in one calm queue" },
  "/app/chat": { title: "Work Rooms", subtitle: "Team chat connected to projects, approvals, and decisions" },
  "/app/calls": { title: "Calls", subtitle: "Work-tied huddles, agendas, notes, and follow-up actions" },
  "/app/meetings": { title: "Meeting Hub", subtitle: "Fewer, better meetings with clear agendas and follow-ups" },
  "/app/teams": { title: "Teams", subtitle: "Team health, ownership, workload, and focus areas" },
  "/app/team": { title: "People", subtitle: "Support needs, capacity, availability, and delivery confidence" },
  "/app/projects": { title: "Projects", subtitle: "Track delivery, owners, budgets, and pacing" },
  "/app/tasks": { title: "Tasks", subtitle: "Manage due dates, proof, blockers, and review states" },
  "/app/approvals": { title: "Approvals", subtitle: "Review proof, expenses, and client updates in one queue" },
  "/app/expenses": { title: "Expenses", subtitle: "Monitor spend, budgets, and expense approvals" },
  "/app/ask": { title: "Ask Pulse", subtitle: "Query workspace context without digging through tabs" },
  "/app/reports": { title: "Reports", subtitle: "Generate summaries, exports, and leadership updates" },
  "/app/decisions": { title: "Decision Log", subtitle: "Keep important decisions out of scattered chat history" },
  "/app/playbooks": { title: "Playbooks", subtitle: "Reusable operating systems for repeated team workflows" },
  "/app/import": { title: "Import Data", subtitle: "Paste messy updates and let Pulse structure the work" },
  "/app/onboarding": { title: "Onboarding", subtitle: "Set up teams, projects, members, and themes" },
  "/app/settings": { title: "Settings", subtitle: "Enterprise controls, roles, integrations, AI, and theme" },
  "/app/dev/qa": { title: "Pulse QA", subtitle: "Internal stabilization checklist and route audit notes" },
};

const themes = [
  { id: "midnight", name: "Midnight Pulse", bg: "#07090F", sidebar: "rgba(7,9,15,0.92)", panel: "#0A0F1C", card: "rgba(17,24,39,0.86)", cardSoft: "rgba(255,255,255,0.035)", text: "#F0F2F8", secondary: "#C8D0E8", muted: "#6B7A9F", border: "rgba(255,255,255,0.08)", borderStrong: "rgba(255,255,255,0.14)", accent: "#6D5DFB", accent2: "#00B4D8", success: "#4ADE80", warning: "#FBBF24", risk: "#F87171" },
  { id: "graphite", name: "Graphite", bg: "#080808", sidebar: "rgba(8,8,8,0.94)", panel: "#111111", card: "rgba(24,24,27,0.88)", cardSoft: "rgba(255,255,255,0.045)", text: "#F5F5F5", secondary: "#D4D4D8", muted: "#A1A1AA", border: "rgba(255,255,255,0.10)", borderStrong: "rgba(255,255,255,0.18)", accent: "#60A5FA", accent2: "#A78BFA", success: "#34D399", warning: "#FBBF24", risk: "#FB7185" },
  { id: "aurora", name: "Aurora", bg: "#061211", sidebar: "rgba(6,18,17,0.94)", panel: "#0B1B20", card: "rgba(11,27,32,0.88)", cardSoft: "rgba(20,184,166,0.075)", text: "#EFFDFB", secondary: "#C9F4EE", muted: "#7BA8A3", border: "rgba(148,255,235,0.12)", borderStrong: "rgba(148,255,235,0.22)", accent: "#14B8A6", accent2: "#8B5CF6", success: "#5EEAD4", warning: "#FACC15", risk: "#FB7185" },
  { id: "light", name: "Light Executive", bg: "#F6F8FB", sidebar: "rgba(255,255,255,0.94)", panel: "#FFFFFF", card: "rgba(255,255,255,0.94)", cardSoft: "rgba(79,70,229,0.055)", text: "#111827", secondary: "#334155", muted: "#64748B", border: "rgba(15,23,42,0.12)", borderStrong: "rgba(15,23,42,0.20)", accent: "#4F46E5", accent2: "#0891B2", success: "#059669", warning: "#B45309", risk: "#DC2626" },
];

type ModalKind = "Create Project" | "Create Task" | "Invite Member" | "Create Team" | "Submit Expense" | "Generate Report";

export function AppShell({ children, currentUser }: { children: ReactNode; currentUser: AuthUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const meta = pageMeta[pathname] ?? pageMeta["/app"];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [floatingOpen, setFloatingOpen] = useState(false);
  const [modalKind, setModalKind] = useState<ModalKind | null>(null);
  const [createName, setCreateName] = useState("");
  const [createNotes, setCreateNotes] = useState("");
  const themeId = usePulseStore((state) => state.selectedTheme);
  const setSelectedTheme = usePulseStore((state) => state.setSelectedTheme);
  const notifications = usePulseStore((state) => state.notifications);
  const enterprise = usePulseStore((state) => state.enterprise);
  const markNotificationRead = usePulseStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = usePulseStore((state) => state.markAllNotificationsRead);
  const clearNotifications = usePulseStore((state) => state.clearNotifications);
  const createProject = usePulseStore((state) => state.createProject);
  const createTask = usePulseStore((state) => state.createTask);
  const inviteMember = usePulseStore((state) => state.inviteMember);
  const createTeam = usePulseStore((state) => state.createTeam);
  const submitExpense = usePulseStore((state) => state.submitExpense);
  const generateReport = usePulseStore((state) => state.generateReport);
  const [command, setCommand] = useState("");
  const [paletteQuery, setPaletteQuery] = useState("");
  const [miniPrompt, setMiniPrompt] = useState("");
  const [miniAnswer, setMiniAnswer] = useState(askPulseResponses["What is at risk?"]);
  const theme = themes.find((item) => item.id === themeId) ?? themes[0];
  const userInitial = currentUser.name.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setNotificationOpen(false);
        setCreateOpen(false);
        setFloatingOpen(false);
        setModalKind(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const paletteItems = [
    ...allNavItems.map((item) => ({ label: `Go to ${item.label}`, action: () => router.push(item.href), Icon: item.Icon })),
    { label: "Create Project", action: () => setModalKind("Create Project"), Icon: Plus },
    { label: "Invite Member", action: () => setModalKind("Invite Member"), Icon: Users },
    { label: "Create Team", action: () => setModalKind("Create Team"), Icon: BriefcaseBusiness },
    { label: "Generate Report", action: () => setModalKind("Generate Report"), Icon: FileText },
    { label: "Toggle Theme", action: () => cycleTheme(), Icon: Moon },
    { label: "Ask Pulse quick question", action: () => router.push("/app/ask"), Icon: Command },
  ];

  const filteredPalette = paletteItems.filter((item) => item.label.toLowerCase().includes(paletteQuery.toLowerCase()));

  function cycleTheme() {
    const currentIndex = themes.findIndex((item) => item.id === themeId);
    setSelectedTheme(themes[(currentIndex + 1) % themes.length].id);
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

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = command.trim();
    router.push(query ? `/app/ask?q=${encodeURIComponent(query)}` : "/app/ask");
    setMobileOpen(false);
  }

  async function askMini(prompt = miniPrompt) {
    const clean = prompt.trim();
    if (!clean) return;
    setMiniPrompt(clean);
    setMiniAnswer("Reading workspace context...");
    try {
      const response = await fetch("/api/ask-pulse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, mode: "floating" }),
      });
      const data = await response.json();
      setMiniAnswer(typeof data.answer === "string" ? data.answer : askPulseResponses["What is at risk?"]);
    } catch {
      setMiniAnswer(askPulseResponses[clean] ?? askPulseResponses["What is at risk?"]);
    }
  }

  function openCreate(kind: ModalKind) {
    setModalKind(kind);
    setCreateName("");
    setCreateNotes("");
    setCreateOpen(false);
  }

  function saveCreateDraft() {
    const name = createName.trim();
    const notes = createNotes.trim();

    if (modalKind === "Create Project") createProject({ name: name || "New workspace project", insight: notes || "Created from the Pulse command center." });
    if (modalKind === "Create Task") createTask({ title: name || "New workspace task", aiReview: notes || "Created from the Pulse command center." });
    if (modalKind === "Invite Member") inviteMember({ email: name.includes("@") ? name : undefined, team: notes || undefined });
    if (modalKind === "Create Team") createTeam({ name: name || "New Workspace Team", currentFocus: notes || "Workspace setup" });
    if (modalKind === "Submit Expense") submitExpense({ item: name || "Workspace expense", aiCategorySuggestion: notes || "Operations" });
    if (modalKind === "Generate Report") generateReport(name || "Workspace Report", notes || "Executive");
    setModalKind(null);
  }

  const SidebarHeader = (
    <div className="shrink-0 px-4 py-5">
      <a href="/" className="flex items-center gap-3">
        <PulseLogo />
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--pulse-text)]">Pulse</p>
          <p className="text-xs text-[var(--text-muted)]">Enterprise operating system</p>
        </div>
      </a>
    </div>
  );

  const SidebarNav = (
    <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
      <div className="space-y-5">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{group.label}</p>
            <div className="space-y-1">
              {group.items.map(({ label, href, Icon }) => {
                const active = pathname === href;
                return (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    whileHover={{ x: 3 }}
                    className={`flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition focus:outline-none focus:ring-2 focus:ring-[#6D5DFB]/50 ${
                      active ? "border border-[var(--pulse-accent)]/30 bg-white/[0.075] text-[var(--pulse-text)]" : "text-[var(--text-muted)] hover:bg-[var(--card-bg)] hover:text-[var(--pulse-text)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );

  const SidebarFooter = (
    <div className="shrink-0 border-t border-[var(--border-subtle)] p-4">
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">Workspace</p>
        <p className="mt-2 text-sm font-semibold text-[var(--pulse-text)]">{currentUser.workspaceName}</p>
        <div className="mt-4 flex items-center gap-3 border-t border-[var(--border-subtle)] pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--pulse-accent)] text-sm font-semibold text-white">{userInitial}</div>
          <div>
            <p className="text-sm font-medium text-[var(--pulse-text)]">{currentUser.name}</p>
            <p className="text-xs text-[var(--text-muted)]">Owner</p>
          </div>
        </div>
        <button onClick={logout} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--pulse-text)] focus:outline-none focus:ring-2 focus:ring-[#6D5DFB]/50">
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <main
      className="pulse-app relative min-h-screen overflow-x-hidden text-[var(--pulse-text)] transition-colors duration-300"
      style={{
        "--pulse-bg": theme.bg,
        "--app-bg": theme.bg,
        "--sidebar-bg": theme.sidebar,
        "--pulse-panel": theme.panel,
        "--card-bg": theme.cardSoft,
        "--card-raised-bg": theme.card,
        "--pulse-text": theme.text,
        "--text-primary": theme.text,
        "--text-secondary": theme.secondary,
        "--text-muted": theme.muted,
        "--border-subtle": theme.border,
        "--border-strong": theme.borderStrong,
        "--pulse-accent": theme.accent,
        "--accent": theme.accent,
        "--accent-2": theme.accent2,
        "--success": theme.success,
        "--warning": theme.warning,
        "--risk": theme.risk,
        background: theme.bg,
      } as CSSProperties}
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 52% 34% at 12% 8%, ${theme.accent}24, transparent 70%), radial-gradient(ellipse 42% 30% at 88% 16%, rgba(0,180,216,0.08), transparent 70%)` }} />
      <div className="relative z-10 flex min-h-screen min-w-0">
        <aside className="hidden h-screen h-dvh w-[280px] shrink-0 flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--sidebar-bg)] backdrop-blur-xl lg:sticky lg:top-0 lg:flex">
          {SidebarHeader}
          {SidebarNav}
          {SidebarFooter}
        </aside>
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button aria-label="Close sidebar overlay" className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} className="relative flex h-full w-[min(300px,calc(100vw-24px))] flex-col overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--sidebar-bg)] backdrop-blur-xl">
              <button aria-label="Close sidebar" onClick={() => setMobileOpen(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)]">
                <X className="h-4 w-4" />
              </button>
              {SidebarHeader}
              {SidebarNav}
              {SidebarFooter}
            </motion.aside>
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <ManagerControlBar currentUser={currentUser} onOpenSidebar={() => setMobileOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />
          <div className="min-w-0 p-4 pb-24 md:p-6 md:pb-28">{children}</div>
        </div>
      </div>

      <AnimatePresence>
        {paletteOpen ? (
          <motion.div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/55 px-3 py-6 pt-[max(24px,8vh)] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} className="max-h-[calc(100dvh-48px)] w-full max-w-2xl overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-[var(--pulse-panel)]/96 p-3 shadow-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input autoFocus aria-label="Search pages, create actions, or ask Pulse" value={paletteQuery} onChange={(event) => setPaletteQuery(event.target.value)} placeholder="Search pages, create actions, ask Pulse..." className="h-12 w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] pl-11 pr-4 text-sm outline-none focus:border-[var(--pulse-accent)]/60" />
              </div>
              <div className="mt-3 max-h-[min(420px,calc(100dvh-140px))] overflow-y-auto">
                {filteredPalette.length ? filteredPalette.map(({ label, action, Icon }) => (
                  <button key={label} onClick={() => { action(); setPaletteOpen(false); }} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:text-[var(--pulse-text)]">
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                )) : <div className="p-6 text-center text-sm text-[var(--text-muted)]">No matching command.</div>}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {notificationOpen ? (
          <motion.aside initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} className="fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-[400px] flex-col overflow-hidden border-l border-[var(--border-subtle)] bg-[var(--pulse-panel)]/96 shadow-2xl backdrop-blur-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] p-5">
              <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-sm text-[var(--text-muted)]">Signals that need manager attention.</p>
              </div>
              <button aria-label="Close notifications" onClick={() => setNotificationOpen(false)} className="rounded-lg border border-[var(--border-subtle)] p-2 text-[var(--text-muted)]"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 px-5 pt-5">
              <button type="button" onClick={markAllNotificationsRead} className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-[var(--text-secondary)]">Mark all read</button>
              <button type="button" onClick={clearNotifications} className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs text-[var(--text-secondary)]">Clear</button>
            </div>
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-5">
              {notifications.length ? notifications.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{item.description}</p></div>
                    {item.unread ? <span className="mt-1 h-2 w-2 rounded-full bg-[#00B4D8]" /> : null}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]"><span>{item.time}</span><button onClick={() => markNotificationRead(item.id)} className="text-[var(--text-secondary)]">{item.action}</button></div>
                </div>
              )) : <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-5 text-sm text-[var(--text-muted)]">Notification center is clear.</div>}
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <Modal open={Boolean(modalKind)} onClose={() => setModalKind(null)} title={modalKind ?? "Create"} description="Create a workspace draft and review it before sharing with the team." footer={<button onClick={saveCreateDraft} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--pulse-accent)] px-4 py-3 text-sm font-semibold text-white sm:ml-auto sm:w-auto"><CheckCircle2 className="h-4 w-4" />Save draft</button>}>
              <div className="space-y-4">
                <label className="block text-sm text-[var(--text-secondary)]">Name<input value={createName} onChange={(event) => setCreateName(event.target.value)} className="mt-2 h-10 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 outline-none focus:border-[var(--pulse-accent)]/60" placeholder={`${modalKind} name`} /></label>
                <label className="block text-sm text-[var(--text-secondary)]">Notes<textarea value={createNotes} onChange={(event) => setCreateNotes(event.target.value)} className="mt-2 min-h-32 max-h-56 w-full resize-y overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 outline-none focus:border-[var(--pulse-accent)]/60" placeholder="Add context..." /></label>
              </div>
      </Modal>

      <div className="fixed bottom-3 right-3 z-40 sm:bottom-5 sm:right-5">
        <AnimatePresence>
          {floatingOpen ? (
            <motion.div initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} className="mb-3 w-[min(360px,calc(100vw-40px))] rounded-[22px] border border-[var(--border-subtle)] bg-[var(--pulse-panel)]/96 p-4 shadow-2xl backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold">Ask Pulse</p><button onClick={() => setFloatingOpen(false)} className="text-[var(--text-muted)]"><X className="h-4 w-4" /></button></div>
              <div className="flex flex-wrap gap-2">{["What needs attention?", "Who needs support?", "What is blocked?", "Write update"].map((chip) => <button key={chip} onClick={() => askMini(chip)} className="rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--pulse-text)]">{chip}</button>)}</div>
              <form onSubmit={(event) => { event.preventDefault(); askMini(); }} className="mt-3 flex gap-2"><input aria-label="Ask Pulse in this modal" value={miniPrompt} onChange={(event) => setMiniPrompt(event.target.value)} placeholder="Ask Pulse..." className="h-10 min-w-0 flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 text-sm outline-none" /><button type="submit" className="rounded-xl bg-[var(--pulse-accent)] px-3 text-sm font-semibold text-white">Ask</button></form>
              <p className="mt-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-xs leading-5 text-[var(--text-secondary)]">{miniAnswer}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <button onClick={() => setFloatingOpen((open) => !open)} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--pulse-accent)] text-white shadow-[0_18px_45px_rgba(0,0,0,0.3)]">
          <Bot className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
}
