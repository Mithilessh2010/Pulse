"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  ClipboardCheck,
  Command,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Plus,
  ReceiptText,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { PulseLogo } from "@/components/PulseLogo";
import { workspace } from "@/lib/mockData";

const navItems = [
  { label: "Command Center", href: "/app", Icon: LayoutDashboard },
  { label: "Projects", href: "/app/projects", Icon: FolderKanban },
  { label: "Tasks", href: "/app/tasks", Icon: ListChecks },
  { label: "Approvals", href: "/app/approvals", Icon: ClipboardCheck },
  { label: "Expenses", href: "/app/expenses", Icon: ReceiptText },
  { label: "Team", href: "/app/team", Icon: Users },
  { label: "Ask Pulse", href: "/app/ask", Icon: Command },
  { label: "Reports", href: "/app/reports", Icon: Activity },
  { label: "Settings", href: "/app/settings", Icon: Settings },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  "/app": { title: "Command Center", subtitle: "Live overview of work, people, approvals, and spend" },
  "/app/projects": { title: "Projects", subtitle: "Track delivery, owners, budgets, and pacing" },
  "/app/tasks": { title: "Tasks", subtitle: "Manage due dates, proof, blockers, and review states" },
  "/app/approvals": { title: "Approvals", subtitle: "Review proof, expenses, and client updates in one queue" },
  "/app/expenses": { title: "Expenses", subtitle: "Monitor spend, budgets, and expense approvals" },
  "/app/team": { title: "Team", subtitle: "Understand capacity, support needed, and delivery confidence" },
  "/app/ask": { title: "Ask Pulse", subtitle: "Query workspace context without digging through tabs" },
  "/app/reports": { title: "Reports", subtitle: "Generate summaries, exports, and leadership updates" },
  "/app/settings": { title: "Settings", subtitle: "Manage workspace preferences and future integrations" },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const meta = pageMeta[pathname] ?? pageMeta["/app"];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [command, setCommand] = useState("");

  function logout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("pulse-demo-session");
    }
    router.push("/");
  }

  function submitCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = command.trim();
    router.push(query ? `/app/ask?q=${encodeURIComponent(query)}` : "/app/ask");
    setMobileOpen(false);
  }

  const SidebarContent = (
    <>
      <a href="/" className="mb-8 flex items-center gap-3">
        <PulseLogo />
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">Pulse</p>
          <p className="text-xs text-[#4D5E78]">Team operating system</p>
        </div>
      </a>
      <nav className="space-y-1">
        {navItems.map(({ label, href, Icon }) => {
          const active = pathname === href;
          return (
            <motion.a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              whileHover={{ x: 3 }}
              className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition focus:outline-none focus:ring-2 focus:ring-[#6D5DFB]/50 ${
                active
                  ? "border border-[#6D5DFB]/30 bg-[#6D5DFB]/12 text-white"
                  : "text-[#6B7A9F] hover:bg-white/[0.035] hover:text-[#C8D0E8]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </motion.a>
          );
        })}
      </nav>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-4 lg:absolute lg:bottom-5 lg:left-4 lg:right-4 lg:mt-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#4D5E78]">Workspace</p>
        <p className="mt-2 text-sm font-semibold text-[#F0F2F8]">{workspace.name}</p>
        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6D5DFB] text-sm font-semibold text-white">
            M
          </div>
          <div>
            <p className="text-sm font-medium text-[#F0F2F8]">{workspace.user}</p>
            <p className="text-xs text-[#6B7A9F]">{workspace.role}</p>
          </div>
        </div>
        <button onClick={logout} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-[#9BA8C7] transition hover:text-white focus:outline-none focus:ring-2 focus:ring-[#6D5DFB]/50">
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090F] text-white">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 34% at 12% 8%, rgba(109,93,251,0.12), transparent 70%), radial-gradient(ellipse 42% 30% at 88% 16%, rgba(0,180,216,0.08), transparent 70%)",
        }}
      />
      <div className="relative z-10 flex">
        <aside className="hidden min-h-screen w-[260px] shrink-0 border-r border-white/[0.06] bg-[#07090F]/88 px-4 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:block">
          {SidebarContent}
        </aside>
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button aria-label="Close sidebar overlay" className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="relative h-full w-[280px] overflow-y-auto border-r border-white/10 bg-[#07090F]/96 px-4 py-5 backdrop-blur-xl">
              <button aria-label="Close sidebar" onClick={() => setMobileOpen(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#9BA8C7]">
                <X className="h-4 w-4" />
              </button>
              {SidebarContent}
            </motion.aside>
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#07090F]/82 px-4 py-4 backdrop-blur-xl md:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00B4D8]">
                  <button aria-label="Open sidebar" onClick={() => setMobileOpen(true)} className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-[#9BA8C7] lg:hidden">
                    <Menu className="h-4 w-4" />
                  </button>
                  <Command className="h-3.5 w-3.5" />
                  Pulse
                </p>
                <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#F0F2F8] md:text-3xl">{meta.title}</h1>
                <p className="mt-1 text-sm text-[#6B7A9F]">{meta.subtitle}</p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <form onSubmit={submitCommand} className="relative block md:w-[360px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4D5E78]" />
                  <input
                    value={command}
                    onChange={(event) => setCommand(event.target.value)}
                    placeholder="Ask Pulse or search workspace..."
                    className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.035] pl-9 pr-3 text-sm text-[#F0F2F8] outline-none transition placeholder:text-[#4D5E78] focus:border-[#6D5DFB]/70 focus:bg-white/[0.055]"
                  />
                </form>
                <div className="flex items-center gap-2">
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-[#9BA8C7] transition hover:text-white">
                    <Bell className="h-4 w-4" />
                  </button>
                  <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#6D5DFB] px-4 text-[13px] font-semibold text-white">
                    <Plus className="h-4 w-4" />
                    Create
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111827] text-sm font-semibold text-white ring-1 ring-white/10">
                    M
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
