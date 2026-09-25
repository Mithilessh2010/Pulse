import { ArrowRight, Check } from "lucide-react";

const oldStack = ["Project tracker", "Team chat", "Approval inbox", "Expense sheet", "Standup bot", "Status deck"];
const pulseStack = ["Projects", "Approvals", "Workload", "Expenses", "Updates", "Reports"];

export default function ToolReplacementSection() {
  return (
    <section className="border-y border-white/[0.06] bg-[#0E100F] py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#737A74]">Less tool switching</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#F4F1EA] md:text-5xl">The work can stay connected without the stack feeling heavy.</h2>
            <p className="mt-5 text-base leading-7 text-[#8E958F]">Pulse keeps the day-to-day objects teams actually need together, so a decision in approvals can still make sense when you open the project a week later.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111412]">
            <div className="grid md:grid-cols-2">
              <div className="border-b border-white/[0.07] p-5 md:border-b-0 md:border-r">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#69706A]">Typical stack</p>
                <div className="mt-4 space-y-2">
                  {oldStack.map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#0B0D0C] px-3 py-2.5 text-sm text-[#8E958F]">
                      <span>{item}</span><span className="text-[11px] text-[#555B56]">separate</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#85C9AF]">Pulse workspace</p>
                  <span className="rounded-full bg-[#2F7D68]/12 px-2 py-1 text-[10px] text-[#85C9AF]">connected</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {pulseStack.map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-lg border border-[#2F7D68]/20 bg-[#2F7D68]/[0.06] px-3 py-2.5 text-sm text-[#C8CCC7]">
                      <Check className="h-3.5 w-3.5 text-[#4B9B7C]" />{item}
                    </div>
                  ))}
                </div>
                <a href="/product" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#D5BC7A] transition hover:text-[#E8D8AD]">See how the workspace fits together <ArrowRight className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
