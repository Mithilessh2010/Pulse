"use client";

import { CheckCircle2, CircleDollarSign, FolderKanban, Search, Users2 } from "lucide-react";
import { projects, teamWorkload } from "@/lib/mockData";

function Dot({ tone }: { tone: "good" | "warn" | "risk" }) {
  const color = tone === "good" ? "#66B58F" : tone === "warn" ? "#D5BC7A" : "#D77B73";
  return <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />;
}

export default function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111412] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
      <div className="flex h-12 items-center justify-between border-b border-white/[0.07] px-4">
        <div className="flex items-center gap-2 text-[11px] font-medium text-[#7F8781]">
          <span className="rounded-md bg-[#2F7D68]/15 px-2 py-1 text-[#7FC0A7]">Acme Ops</span>
          <span>/</span>
          <span>Command center</span>
        </div>
        <div className="hidden h-8 w-[210px] items-center gap-2 rounded-lg sm:flex border border-white/[0.08] bg-[#0D0F0E] px-2.5 text-[10px] text-[#626863]">
          <Search className="h-3.5 w-3.5" /> Search workspace
        </div>
      </div>

      <div className="grid min-h-[430px] grid-cols-[52px_1fr]">
        <aside className="border-r border-white/[0.07] bg-[#0D0F0E] py-3">
          {[FolderKanban, CheckCircle2, Users2, CircleDollarSign].map((Icon, index) => (
            <div key={index} className={`mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-lg ${index === 0 ? "bg-white/[0.07] text-[#D5BC7A]" : "text-[#59605B]"}`}>
              <Icon className="h-4 w-4" />
            </div>
          ))}
        </aside>

        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#5F665F]">Tuesday overview</p>
              <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#F2F0E9]">What needs attention</h3>
            </div>
            <span className="w-fit rounded-md border border-[#D5BC7A]/20 bg-[#D5BC7A]/[0.08] px-2 py-1 text-[10px] font-medium text-[#D5BC7A]">2 items at risk</span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {[['Due today','5'],['Approvals','3'],['Budget used','64%']].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/[0.07] bg-[#151816] p-3">
                <p className="text-[16px] font-semibold text-[#F2F0E9] sm:text-xl">{value}</p>
                <p className="mt-1 text-[9px] text-[#737A74] sm:text-[10px]">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.07] bg-[#121512]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2.5">
              <span className="text-[10px] font-semibold text-[#A8AEA8]">Projects</span>
              <span className="text-[9px] text-[#5F665F]">{projects.length} active</span>
            </div>
            {projects.slice(0, 5).map((project) => {
              const tone = project.status === "on-track" ? "good" : project.status === "at-risk" ? "risk" : "warn";
              return (
                <div key={project.id} className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/[0.05] px-3 py-2.5 last:border-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Dot tone={tone} />
                      <span className="truncate text-[10px] font-medium text-[#D8DAD5] sm:text-[11px]">{project.name}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-[#4B9B7C]" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-[#A0A6A0]">{project.progress}%</p>
                    <p className="mt-1 text-[9px] text-[#5F665F]">{project.daysLeft}d left</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.07] bg-[#121512] p-3">
              <p className="text-[10px] font-semibold text-[#A8AEA8]">Team capacity</p>
              <div className="mt-3 space-y-2">
                {teamWorkload.slice(0, 3).map((member) => (
                  <div key={member.name} className="grid grid-cols-[30px_1fr_32px] items-center gap-2 text-[9px] text-[#687069]">
                    <span>{member.initials}</span><div className="h-1 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#D5BC7A]" style={{ width: `${member.load}%` }} /></div><span className="text-right">{member.load}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-[#121512] p-3">
              <p className="text-[10px] font-semibold text-[#A8AEA8]">Next decision</p>
              <p className="mt-2 text-[10px] leading-5 text-[#8E958F]">Approve mobile proof so Website Redesign can move to engineering.</p>
              <div className="mt-3 inline-flex rounded-md bg-[#2F7D68] px-2.5 py-1.5 text-[9px] font-semibold text-white">Review approval</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
