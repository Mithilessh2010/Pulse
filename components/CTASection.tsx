import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-6 pb-24 pt-8 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-2xl border border-white/[0.08] bg-[#111412] p-7 md:flex-row md:items-center md:p-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#F4F1EA] md:text-4xl">See if Pulse fits the way your team already works.</h2>
          <p className="mt-3 text-sm leading-6 text-[#8E958F]">The live demo uses sample data and opens without an account.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a href="/demo" className="inline-flex items-center gap-2 rounded-lg bg-[#2F7D68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#378B74]">Open demo <ArrowRight className="h-4 w-4" /></a>
          <a href="/signup" className="inline-flex items-center rounded-lg border border-white/10 px-5 py-3 text-sm font-medium text-[#C8CCC7] transition hover:border-white/20 hover:text-white">Create workspace</a>
        </div>
      </div>
    </section>
  );
}
