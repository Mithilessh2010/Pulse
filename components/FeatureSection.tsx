import { BarChart3, CheckSquare, CircleDollarSign, MessageSquareText, Users, Workflow } from "lucide-react";

const features = [
  { Icon: BarChart3, title: "Project health", text: "Progress, owners, pace, and blockers without opening five reports." },
  { Icon: CheckSquare, title: "Approvals with context", text: "Proof, feedback, decisions, and audit history stay attached to the work." },
  { Icon: Users, title: "Workload visibility", text: "See who has room, who is near capacity, and where work is getting stuck." },
  { Icon: CircleDollarSign, title: "Spend next to work", text: "Track expenses and budget movement next to the project that created them." },
  { Icon: Workflow, title: "Team updates", text: "Turn recurring status work into a consistent operating rhythm." },
  { Icon: MessageSquareText, title: "Ask Pulse", text: "Query workspace context in plain language when a dashboard is not the fastest answer." },
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#737A74]">Core workflow</p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#F4F1EA] md:text-5xl">Built around the questions a team asks every day.</h2>
        </div>

        <div className="mt-12 grid border-l border-t border-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ Icon, title, text }) => (
            <article key={title} className="min-h-[190px] border-b border-r border-white/[0.07] p-6">
              <Icon className="h-5 w-5 text-[#D5BC7A]" />
              <h3 className="mt-8 text-base font-semibold text-[#E5E7E4]">{title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#737A74]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
