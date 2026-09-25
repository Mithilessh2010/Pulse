import { ArrowRight, BarChart3, CheckSquare, CircleDollarSign, MessagesSquare, ShieldCheck, Users } from "lucide-react";
import Navbar from "@/components/Navbar";

const groups = [
  { Icon: BarChart3, title: "Projects", items: ["Portfolio health", "Project pacing", "Owners and milestones", "Blockers", "Grid and board views"] },
  { Icon: CheckSquare, title: "Approvals", items: ["Proof review", "Written change feedback", "Attachments", "Decision history", "Audit trail"] },
  { Icon: Users, title: "Team", items: ["Capacity view", "Workload signals", "Teams and roles", "Recurring updates", "Ownership visibility"] },
  { Icon: CircleDollarSign, title: "Spend", items: ["Expense queue", "Budget vs. actual", "Project-linked spend", "Approval status", "Reporting"] },
  { Icon: MessagesSquare, title: "Workspace answers", items: ["Ask Pulse", "Context-aware prompts", "Local fallback answers", "Follow-up questions", "Copyable summaries"] },
  { Icon: ShieldCheck, title: "Admin", items: ["Email verification", "Signed sessions", "OIDC SSO option", "Workspace settings", "Export controls"] },
];

export default function FeaturesPageContent() {
  return (
    <main className="min-h-screen bg-[#0B0D0C] text-white">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-32 md:px-10 md:pt-36">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9EA59F]">Features</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#F4F1EA] md:text-6xl">Enough structure to run the work. Not another maze of features.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#8E958F]">Pulse groups the common team-management workflows around a shared workspace, with progressive detail instead of putting every control on the first screen.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
        <div className="grid border-l border-t border-white/[0.07] md:grid-cols-2 lg:grid-cols-3">
          {groups.map(({ Icon, title, items }) => (
            <article key={title} className="border-b border-r border-white/[0.07] p-6">
              <div className="flex items-center gap-3"><Icon className="h-5 w-5 text-[#D5BC7A]" /><h2 className="text-base font-semibold text-[#E5E7E4]">{title}</h2></div>
              <ul className="mt-6 space-y-3">
                {items.map((item) => <li key={item} className="flex items-center gap-2.5 text-sm text-[#8E958F]"><span className="h-1 w-1 rounded-full bg-[#4B9B7C]" />{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#0E100F]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-12 md:flex-row md:items-center md:px-10">
          <div><h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#F4F1EA]">The easiest way to understand it is to click through it.</h2><p className="mt-2 text-sm text-[#737A74]">The demo opens with sample data and no account.</p></div>
          <a href="/demo" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#2F7D68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#378B74]">Open live demo <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>
    </main>
  );
}
