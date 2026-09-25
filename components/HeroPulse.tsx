"use client";

import { ArrowRight, Check } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

export default function HeroPulse() {
  return (
    <section className="relative overflow-hidden bg-[#0B0D0C] pt-14 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-56px)] max-w-[1360px] items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:py-20">
        <div className="max-w-[620px]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[11px] font-medium text-[#959C96]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4B9B7C]" />
            One operating view for your team
          </div>
          <h1 className="text-[48px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#F4F1EA] sm:text-[60px] lg:text-[72px]">
            Your team,<br />without the <span className="text-[#D5BC7A]">tab sprawl.</span>
          </h1>
          <p className="mt-7 max-w-[560px] text-[16px] leading-7 text-[#8E958F] md:text-[17px]">
            Pulse keeps projects, approvals, spend, workload, and decisions in one workspace—so managers can see what changed and act without hunting through five different tools.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <a href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-[#2F7D68] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#378B74]">
              Start a workspace <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/demo" className="inline-flex items-center rounded-lg border border-white/10 px-5 py-2.5 text-[13px] font-medium text-[#C8CCC7] transition hover:border-white/20 hover:text-white">
              Explore the demo
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#747B75]">
            {["No card required", "Demo needs no account", "Exportable workspace data"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#4B9B7C]" />{item}</span>
            ))}
          </div>
        </div>

        <div className="relative lg:pl-4">
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_45%,rgba(75,155,124,0.09),transparent_62%)]" />
          <div className="relative"><DashboardPreview /></div>
        </div>
      </div>
    </section>
  );
}
