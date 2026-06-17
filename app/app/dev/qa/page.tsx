import { Activity, CheckCircle2, MousePointerClick, Route, ShieldAlert, type LucideIcon } from "lucide-react";
import { DashboardCard, StatusBadge } from "@/components/app-shell/AppUI";

const checkedRoutes = [
  "/", "/product", "/features", "/pricing", "/demo", "/signin", "/signup",
  "/app", "/app/autopilot", "/app/inbox", "/app/chat", "/app/calls", "/app/meetings",
  "/app/teams", "/app/team", "/app/projects", "/app/tasks", "/app/approvals",
  "/app/expenses", "/app/ask", "/app/reports", "/app/decisions",
  "/app/playbooks", "/app/import", "/app/onboarding", "/app/settings",
];

const interactionChecks = [
  "Sidebar desktop layout uses a fixed-height flex column with footer pinned below scrollable navigation.",
  "Mobile sidebar opens and closes from the top bar without covering the footer content.",
  "Create menu opens customer-ready draft modals from the global top bar.",
  "Notifications drawer opens, marks single items read, and marks all items read.",
  "Command search routes to Ask Pulse with the entered query.",
  "Visible dashboard actions either change local state, navigate, download a local export, or show a workspace setup notice.",
  "Auth forms submit to API routes instead of acting as static mockups.",
  "Marketing mock controls that are not real actions are rendered as display elements.",
];

const auditedButtons = [
  "Command Center briefing actions",
  "Project, task, approval, expense, report, team, and settings actions",
  "Chat room actions and meeting follow-up controls",
  "Onboarding navigation and finish state",
  "Public CTAs for request access, demo, sign in, product, features, and pricing",
];

const knownLimitations = [
  "Workspace data is still mock data until the product dashboard is connected to MongoDB collections.",
  "AI responses fall back to local context when provider keys or network calls are unavailable.",
  "Exports and bulk approval run locally; payment processing is staged behind the billing setup workflow.",
  "Visual browser automation was not linked into the app UI; this page is for internal QA reference only.",
];

function ChecklistCard({ title, icon: Icon, items }: { title: string; icon: LucideIcon; items: string[] }) {
  return (
    <DashboardCard title={title}>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-sm leading-5 text-[var(--text-secondary)]">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#00B4D8]" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

export default function QaPage() {
  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[var(--card-bg)] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00B4D8]">Internal QA</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[var(--text-primary)]">Pulse stabilization checklist</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">Route, layout, and interaction notes for the current product polish pass. This page is intentionally not linked in the sidebar.</p>
          </div>
          <StatusBadge label="Dev-only reference" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardCard title="Routes checked" subtitle={`${checkedRoutes.length} Pulse routes in the audit set`}>
          <div className="grid gap-2 sm:grid-cols-2">
            {checkedRoutes.map((path) => (
              <a key={path} href={path} className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:border-[#6D5DFB]/40 hover:text-[var(--text-primary)]">
                <Route className="h-3.5 w-3.5 text-[#6D5DFB]" />
                {path}
              </a>
            ))}
          </div>
        </DashboardCard>

        <div className="space-y-4">
          <ChecklistCard title="Interaction checklist" icon={MousePointerClick} items={interactionChecks} />
          <ChecklistCard title="Buttons audited" icon={CheckCircle2} items={auditedButtons} />
        </div>
      </div>

      <ChecklistCard title="Known limitations" icon={ShieldAlert} items={knownLimitations} />

      <DashboardCard title="QA status" subtitle="Current pass">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Layout", "Sidebar overlap fixed"],
            ["Routes", "Ready for HTTP sweep"],
            ["Build", "Run after this page compiles"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]"><Activity className="h-3.5 w-3.5" />{label}</div>
              <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{value}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
