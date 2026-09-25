"use client";

import { ArrowRight, CheckCircle2, ClipboardCheck, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { approvals, projects, teamMembers } from "@/lib/mockData";

const demoSteps = [
  { title: "See what needs attention", Icon: LayoutDashboard, text: "Due work, approvals, blockers, and project health in one view." },
  { title: "Review work in context", Icon: ClipboardCheck, text: "Open proof, leave feedback, approve, or request a change." },
  { title: "Check team capacity", Icon: Users, text: "Spot overloaded teammates before a deadline becomes a fire drill." },
  { title: "Explore safely", Icon: ShieldCheck, text: "The demo uses temporary sample data and does not require an account." },
];

export default function DemoPageContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openDemo() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/temp-login", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Demo mode is unavailable right now.");
        return;
      }

      window.location.assign(typeof data.redirectTo === "string" ? data.redirectTo : "/app");
    } catch {
      setError("Demo mode is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0D0C] text-white">
      <Navbar />

      <section className="mx-auto grid max-w-7xl gap-14 px-6 pb-16 pt-32 md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:pt-36">
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9EA59F]">Product demo</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#F4F1EA] md:text-6xl">
            Try the workspace before creating one.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#8E958F] md:text-[17px]">
            Open a populated Pulse workspace and click through projects, approvals, workload, expenses, and reports. No signup wall.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openDemo}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2F7D68] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#378B74] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Opening demo…" : "Open live demo"}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
            <a href="/signup" className="inline-flex items-center rounded-lg border border-white/10 bg-[#111412] px-5 py-3 text-[13px] font-medium text-[#C8CCC7] transition hover:border-white/20 hover:text-white">
              Create a workspace
            </a>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-[#737A74]">
            <CheckCircle2 className="h-4 w-4 text-[#4B9B7C]" />
            No account · Temporary demo session · Sample data only
          </div>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111412]">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[#F4F1EA]">Acme Launch</p>
              <p className="mt-0.5 text-xs text-[#737A74]">Workspace overview</p>
            </div>
            <span className="rounded-full border border-[#4B9B7C]/25 bg-[#4B9B7C]/10 px-2.5 py-1 text-[11px] font-medium text-[#85C9AF]">Demo data</span>
          </div>

          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-3">
            <Metric label="Open projects" value={String(projects.length)} />
            <Metric label="Waiting approval" value={String(approvals.filter((item) => item.status === "Waiting").length)} />
            <Metric label="Team members" value={String(teamMembers.length)} />
          </div>

          <div className="p-5">
            <div className="mb-3 grid grid-cols-[1fr_auto_auto] gap-4 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5F665F]">
              <span>Project</span><span>Progress</span><span>Health</span>
            </div>
            <div className="divide-y divide-white/[0.06] rounded-xl border border-white/[0.07]">
              {projects.slice(0, 4).map((project) => (
                <div key={project.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-3 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#E5E7E4]">{project.name}</p>
                    <p className="mt-0.5 truncate text-xs text-[#69706A]">{project.predictedFinish}</p>
                  </div>
                  <span className="text-xs tabular-nums text-[#AEB4AF]">{project.progress}%</span>
                  <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-[#AEB4AF]">{project.statusLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#0E100F]">
        <div className="mx-auto grid max-w-7xl gap-px px-6 md:grid-cols-4 md:px-10">
          {demoSteps.map(({ title, text, Icon }) => (
            <div key={title} className="border-white/[0.06] py-8 md:border-r md:px-6 first:md:pl-0 last:md:border-r-0">
              <Icon className="h-5 w-5 text-[#D5BC7A]" />
              <h2 className="mt-4 text-sm font-semibold text-[#E5E7E4]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#737A74]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0E100F] px-5 py-4">
      <p className="text-[11px] text-[#737A74]">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#F4F1EA]">{value}</p>
    </div>
  );
}
