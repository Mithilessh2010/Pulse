"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  HelpCircle,
  Layers,
  Minus,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";

type BillingCycle = "monthly" | "yearly";

const plans = [
  {
    name: "Free",
    badge: "",
    monthly: "$0",
    yearly: "$0",
    annualTotal: "$0 / year",
    suffix: "",
    subtitle: "For solo builders and tiny teams starting with Pulse.",
    cta: "Start Free",
    featured: false,
    features: [
      "Up to 3 users",
      "1 workspace",
      "2 active projects",
      "Basic tasks",
      "Basic dashboard",
      "Guided Ask Pulse prompts",
      "Community support",
    ],
  },
  {
    name: "Startup",
    badge: "Best for early teams",
    monthly: "$15",
    yearly: "$12",
    annualTotal: "$144 / user / year",
    suffix: "/user/month",
    subtitle: "For small teams that need project clarity.",
    cta: "Start Startup",
    featured: false,
    features: [
      "Unlimited projects",
      "Tasks and subtasks",
      "Project health dashboard",
      "Daily team briefing",
      "Proof-based task approvals",
      "Team workload view",
      "Basic reports",
      "Email support",
    ],
  },
  {
    name: "Team",
    badge: "Most popular",
    monthly: "$25",
    yearly: "$20",
    annualTotal: "$240 / user / year",
    suffix: "/user/month",
    subtitle: "For growing teams replacing multiple tools.",
    cta: "Start Team",
    featured: true,
    features: [
      "Everything in Startup",
      "Ask Pulse command assistant",
      "Project pacing insights",
      "Approval queue",
      "Expense tracking",
      "Budget vs actual tracking",
      "Weekly leadership reports",
      "Advanced team capacity",
      "Workspace administration",
    ],
  },
  {
    name: "Business",
    badge: "",
    monthly: "Custom",
    yearly: "Custom",
    annualTotal: "Annual contract",
    suffix: "",
    subtitle: "For companies that need controls, support, and scale.",
    cta: "Security & SSO",
    featured: false,
    features: [
      "Everything in Team",
      "Custom roles and permissions",
      "Advanced reporting",
      "Admin controls",
      "Priority support",
      "OIDC single sign-on (SSO)",
      "Custom onboarding",
      "Migration support",
      "Security review support",
    ],
  },
];

const toolCosts = [
  ["Slack", "$8/user"],
  ["Asana/Jira", "$11/user"],
  ["Notion", "$10/user"],
  ["Expensify", "$5/user"],
  ["Toggl", "$10/user"],
  ["Geekbot", "$3/user"],
  ["Lattice", "$11/user"],
  ["Spreadsheet/reporting time", "hidden cost"],
];

const comparisonRows = [
  ["Users", "Up to 3", "Unlimited", "Unlimited", "Custom"],
  ["Active projects", "2", "Unlimited", "Unlimited", "Unlimited"],
  ["Tasks and subtasks", true, true, true, true],
  ["Project health dashboard", "Basic", true, true, true],
  ["Daily team briefing", false, true, true, true],
  ["Proof-based approvals", false, true, true, true],
  ["Team workload view", false, true, true, true],
  ["Ask Pulse", "Guided prompts", false, true, true],
  ["Expense tracking", false, false, true, true],
  ["Budget tracking", false, false, true, true],
  ["Reports", "Basic", "Basic", "Weekly leadership", "Advanced"],
  ["Custom permissions", false, false, false, true],
  ["OIDC single sign-on", false, false, false, true],
  ["Priority support", false, false, false, true],
];

const faqs = [
  [
    "Can I use Pulse for free?",
    "Yes. The Free plan is designed for solo builders and tiny teams that want to try the workflow before upgrading.",
  ],
  ["Do I need a credit card to start?", "No. The Free plan does not require a credit card."],
  ["Is billing per user?", "Yes. Paid plans are priced per active workspace user."],
  [
    "Can Pulse replace all of our tools immediately?",
    "Pulse is designed to reduce tool switching by combining projects, approvals, workload, expenses, and reporting in one workspace.",
  ],
  [
    "Is this pricing final?",
    "Pulse is still early, so pricing may change as the product evolves. Existing customers should be notified before any pricing change.",
  ],
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" } },
};

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto mb-10 max-w-3xl text-center"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-[-0.02em] text-[#F4F1EA] md:text-5xl">
        {title}
      </motion.h2>
      {description ? (
        <motion.p variants={itemVariants} className="mt-4 text-base leading-7 text-[#8E958F]">
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return <Check className="mx-auto h-4 w-4 text-emerald-300" />;
  }

  if (value === false) {
    return <Minus className="mx-auto h-4 w-4 text-[#5F665F]" />;
  }

  return <span className="text-[#C8CCC7]">{value}</span>;
}

export default function PricingPageContent() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0D0C] text-white">
      <Navbar />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 28% at 20% 10%, rgba(47,125,104,0.08), transparent 72%)",
        }}
      />

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex min-h-[76vh] max-w-5xl flex-col items-center justify-center px-6 pb-12 pt-28 text-center md:px-10"
      >
        <motion.p variants={itemVariants} className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D5BC7A]">
          Pricing
        </motion.p>
        <motion.h1 variants={itemVariants} className="max-w-4xl text-5xl font-bold leading-[1.04] tracking-[-0.02em] text-[#F4F1EA] md:text-6xl">
          Simple pricing for teams that want fewer tools.
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-6 max-w-2xl text-base leading-8 text-[#8E958F] md:text-[17px]">
          Pulse brings projects, approvals, expenses, workload, and team insights into one operating system — so teams can stop paying for scattered subscriptions.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-3">
          <motion.a
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F7D68] px-5 py-3 text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            whileHover={{ y: -1, backgroundColor: "#378B74" }}
            whileTap={{ scale: 0.98 }}
          >
            Start Free
            <ArrowRight className="h-4 w-4" />
          </motion.a>
          <a className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[13px] font-medium text-[#C8CCC7] transition hover:border-white/20 hover:text-white" href="/demo">
            View live demo
          </a>
        </motion.div>
        <motion.p variants={itemVariants} className="mt-4 text-sm text-[#737A74]">
          No credit card required for the free plan.
        </motion.p>
      </motion.section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.035] p-1">
            {(["monthly", "yearly"] as const).map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setBillingCycle(cycle)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  billingCycle === cycle ? "bg-[#2F7D68] text-white" : "text-[#737A74] hover:text-[#C8CCC7]"
                }`}
              >
                {cycle}
              </button>
            ))}
          </div>
          {billingCycle === "yearly" ? (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-emerald-300">
              Save 20% with yearly billing
            </motion.p>
          ) : null}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 lg:grid-cols-4"
        >
          {plans.map((plan) => (
            <motion.article
              key={plan.name}
              variants={itemVariants}
              whileHover={{ borderColor: plan.featured ? "rgba(47,125,104,0.55)" : "rgba(255,255,255,0.14)" }}
              className={`relative flex min-h-full flex-col rounded-[24px] border p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl ${
                plan.featured
                  ? "border-[#2F7D68]/45 bg-[#121815]"
                  : "border-white/10 bg-white/[0.035]"
              }`}
            >
              {plan.badge ? (
                <div className="mb-4 w-fit rounded-full border border-[#D5BC7A]/20 bg-[#D5BC7A]/10 px-3 py-1 text-[11px] font-medium text-[#D5BC7A]">
                  {plan.badge}
                </div>
              ) : <div className="mb-4 h-6" />}
              <h2 className="text-xl font-semibold text-[#F4F1EA]">{plan.name}</h2>
              <p className="mt-2 min-h-[44px] text-sm leading-6 text-[#8E958F]">{plan.subtitle}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-semibold tracking-[-0.04em] text-white">
                  {billingCycle === "yearly" ? plan.yearly : plan.monthly}
                </span>
                {plan.suffix ? <span className="pb-1 text-sm text-[#737A74]">{plan.suffix}</span> : null}
              </div>
              {billingCycle === "yearly" && plan.name !== "Business" ? (
                <p className="mt-2 text-xs text-[#737A74]">{plan.annualTotal}, billed annually</p>
              ) : billingCycle === "yearly" && plan.name === "Business" ? (
                <p className="mt-2 text-xs text-[#737A74]">{plan.annualTotal}</p>
              ) : (
                <div className="h-[20px]" />
              )}
              <a
                href={plan.name === "Business" ? "/security" : "/signup"}
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition ${
                  plan.featured ? "bg-[#2F7D68] text-white hover:bg-[#378B74]" : "border border-white/10 bg-white/[0.035] text-[#C8CCC7] hover:border-white/20 hover:text-white"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex gap-2 text-sm leading-5 text-[#C8CCC7]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionHeader
          title="Replace scattered subscriptions with one operating system."
          description="A clear way to compare tool sprawl with a single command center."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-raised rounded-[24px] p-5">
            <h3 className="text-lg font-semibold text-[#F4F1EA]">Typical stack</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {toolCosts.map(([tool, cost]) => (
                <div key={tool} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-sm font-medium text-[#F4F1EA]">{tool}</p>
                  <p className="mt-1 text-sm text-[#737A74]">{cost}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm font-medium text-red-100">
              $58+/user/month before hidden admin time
            </p>
          </motion.div>

          <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[24px] border border-[#2F7D68]/35 bg-[#121815] p-5">
            <h3 className="text-lg font-semibold text-[#F4F1EA]">Pulse Team</h3>
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#0B0D0C]/40 p-5">
              <p className="text-5xl font-semibold tracking-[-0.04em] text-white">$25</p>
              <p className="mt-1 text-sm text-[#AEB4AF]">/user/month</p>
              <p className="mt-5 max-w-md text-sm leading-6 text-[#C8CCC7]">
                Projects, approvals, workload, expenses, reports, and Ask Pulse in one place.
              </p>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#737A74]">
              Numbers are example estimates. Actual savings depend on the tools your team currently uses.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionHeader title="Compare plans" />
        <div className="hidden overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] backdrop-blur-xl lg:block">
          <div className="grid grid-cols-[1.3fr_repeat(4,1fr)] border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5F665F]">
            <span>Feature</span>
            {plans.map((plan) => <span key={plan.name} className="text-center">{plan.name}</span>)}
          </div>
          {comparisonRows.map(([feature, free, startup, team, business]) => (
            <div key={feature as string} className="grid grid-cols-[1.3fr_repeat(4,1fr)] border-b border-white/[0.06] px-4 py-4 text-center text-sm last:border-0">
              <span className="text-left font-medium text-[#F4F1EA]">{feature as string}</span>
              <FeatureValue value={free as string | boolean} />
              <FeatureValue value={startup as string | boolean} />
              <FeatureValue value={team as string | boolean} />
              <FeatureValue value={business as string | boolean} />
            </div>
          ))}
        </div>

        <div className="grid gap-3 lg:hidden">
          {plans.map((plan, planIndex) => (
            <div key={plan.name} className="glass-raised rounded-2xl p-4">
              <h3 className="mb-4 text-lg font-semibold text-[#F4F1EA]">{plan.name}</h3>
              <div className="space-y-3">
                {comparisonRows.map((row) => (
                  <div key={row[0] as string} className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-2 text-sm last:border-0">
                    <span className="text-[#737A74]">{row[0] as string}</span>
                    <span className="text-right text-[#C8CCC7]"><FeatureValue value={row[planIndex + 1] as string | boolean} /></span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionHeader title="Pricing questions" />
        <div className="grid gap-3 md:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <motion.div key={question} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-raised rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-[#D5BC7A]" />
                <h3 className="text-base font-semibold text-[#F4F1EA]">{question}</h3>
              </div>
              <p className="text-sm leading-6 text-[#8E958F]">{answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 pb-20 md:px-10">
        <div className="glass-raised mx-auto max-w-5xl rounded-[28px] p-8 text-center md:p-12">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-[#D5BC7A]">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#F4F1EA] md:text-5xl">
            Start with fewer tools. Scale with one operating system.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#8E958F]">
            Give your team a command center for work, approvals, expenses, workload, and insights.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#2F7D68] px-5 py-3 text-[13px] font-semibold text-white">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/demo" className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[13px] font-medium text-[#C8CCC7]">
              View live demo
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
