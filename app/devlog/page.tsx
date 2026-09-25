import Navbar from "@/components/Navbar";
import { Reveal } from "@/components/motion/Reveal";

const entries = [
  {
    date: "Sep 24, 2026",
    title: "Motion without the AI-dashboard noise",
    text: "Brought back the interaction style I like from my personal-site work: a short decrypt reveal, a smooth white cursor halo, restrained 3D tilt, staggered scroll entrances, and tiny interface micro-interactions. Kept it off the logged-in app shell where constant motion would get in the way of actual work.",
    tags: ["motion", "interaction", "performance"],
  },
  {
    date: "Sep 24, 2026",
    title: "The cleanup pass",
    text: "Pulled back the glow-heavy dashboard styling, simplified the command center, made navigation quieter, and switched the visual system to graphite, moss, and warm gold. The goal was to make the product feel like a tool teams use all day instead of a landing-page concept.",
    tags: ["UI", "mobile", "navigation"],
  },
  {
    date: "Sep 24, 2026",
    title: "Demo without the signup wall",
    text: "The public demo now creates a temporary sample-data session directly. Reviewers can open the product, click around, and leave without making an account.",
    tags: ["demo", "auth"],
  },
  {
    date: "Sep 24, 2026",
    title: "Approvals needed an actual conversation",
    text: "Request Changes used to be a dead-end action. It now requires written feedback, stores that feedback with the approval, and records it in the audit trail.",
    tags: ["approvals", "workflow"],
  },
  {
    date: "Sep 24, 2026",
    title: "Enterprise basics without enterprise theater",
    text: "Added optional OIDC SSO and a security page that documents real controls in the repository. No made-up compliance badges or vague security claims.",
    tags: ["security", "SSO"],
  },
];

export default function DevlogPage() {
  return (
    <main className="min-h-screen bg-[#0B0D0C] text-white">
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-32 md:px-10 md:pt-36">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9EA59F]">Build log</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.045em] text-[#F4F1EA] md:text-6xl">What changed, and why.</h1>
          <p className="mt-6 text-base leading-7 text-[#8E958F]">Short notes from building Pulse. Less launch-copy, more decisions, mistakes, and fixes.</p>
        </Reveal>

        <div className="mt-14 border-t border-white/[0.08]">
          {entries.map((entry, index) => (
            <Reveal key={entry.title} delay={Math.min(index * 0.035, 0.12)} distance={16}>
              <article className="grid gap-4 border-b border-white/[0.08] py-8 md:grid-cols-[160px_1fr] md:gap-8">
                <time className="text-xs font-medium text-[#69706A]">{entry.date}</time>
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#E5E7E4]">{entry.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8E958F]">{entry.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag) => <span key={tag} className="rounded-md border border-white/[0.08] px-2 py-1 text-[11px] text-[#737A74]">{tag}</span>)}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
