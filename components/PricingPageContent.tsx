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
    suffix: "",
    subtitle: "For solo builders and tiny teams testing Pulse.",
    cta: "Start Free",
    featured: false,
    features: [
      "Up to 3 users",
      "1 workspace",
      "2 active projects",
      "Basic tasks",
      "Basic dashboard",
      "Demo Ask Pulse prompts",
      "Community support",
    ],
  },
  {
    name: "Startup",
    badge: "Best for early teams",
    monthly: "$15",
    yearly: "$12",
    suffix: "/user/month",
    subtitle: "For small teams that need project clarity.",
    cta: "Start Startup",
    featured: false,
    features: [
      "Unlimited projects",
      "Tasks and subtasks",
      "Project health dashboard",
      "AI morning briefing",
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
    suffix: "/user/month",
    subtitle: "For growing teams replacing multiple tools.",
    cta: "Start Team",
    featured: true,
    features: [
      "Everything in Startup",
      "Ask Pulse command assistant",
      "AI project pacing",
      "Approval queue",
      "Expense tracking",
      "Budget vs actual tracking",
      "Weekly leadership reports",
      "Advanced team capacity",
      "Planned integrations access",
    ],
  },
  {
    name: "Business",
    badge: "",
    monthly: "Custom",
    yearly: "Custom",
    suffix: "",
    subtitle: "For companies that need controls, integrations, and scale.",
    cta: "Contact sales",
    featured: false,
    features: [
      "Everything in Team",
      "Custom roles and permissions",
      "Advanced reporting",
      "Admin controls",
      "Priority support",
      "SSO-ready architecture later",
      "Custom onboarding",
      "Integration support",
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
  ["AI morning briefing", false, true, true, true],
  ["Proof-based approvals", false, true, true, true],
  ["Team workload view", false, true, true, true],
  ["Ask Pulse", "Demo prompts", false, true, true],
  ["Expense tracking", false, false, true, true],
  ["Budget tracking", false, false, true, true],
  ["Reports", "Basic", "Basic", "Weekly leadership", "Advanced"],
  ["Integrations", false, false, "Planned access", "Integration support"],
  ["Custom permissions", false, false, false, true],
  ["Priority support", false, false, false, true],
];

const faqs = [
  [
    "Can I use Pulse for free?",
    "Yes. The Free plan is designed for solo builders and tiny teams that want to test the workflow before upgrading.",
  ],
  ["Do I need a credit card to start?", "No. The Free plan should not require a credit card."],
  ["Is billing per user?", "Yes. Paid plans are priced per active workspace user."],
  [
    "Can Pulse replace all of our tools immediately?",
    "Pulse is designed to reduce tool switching by combining projects, approvals, workload, expenses, and reporting. Some integrations and advanced replacement workflows may be added over time.",
  ],
  [
    "Are integrations included?",
    "Basic planned integrations are included in the Team plan. Some advanced integrations may be part of Business later.",
  ],
  [
    "Is this pricing final?",
    "Since Pulse is early, pricing can be adjusted as the product grows. Keep the page structured so pricing is easy to update.",
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
      <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-[-0.02em] text-[#F0F2F8] md:text-5xl">
        {title}
      </motion.h2>
      {description ? (
        <motion.p variants={itemVariants} className="mt-4 text-base leading-7 text-[#7F8BA6]">
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
    return <Minus className="mx-auto h-4 w-4 text-[#4D5E78]" />;
  }

  return <span className="text-[#C8D0E8]">{value}</span>;
}

export default function PricingPageContent() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07090F] text-white">
      <Navbar />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 52% 34% at 18% 12%, rgba(109,93,251,0.12), transparent 70%), radial-gradient(ellipse 42% 30% at 84% 16%, rgba(0,180,216,0.08), transparent 70%)",
        }}
      />

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex min-h-[76vh] max-w-5xl flex-col items-center justify-center px-6 pb-12 pt-28 text-center md:px-10"
      >
        <motion.div
          aria-hidden="true"
          className="absolute top-32 h-[420px] w-[420px] rounded-full border border-[#00B4D8]/10"
          animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.2, 0.36, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.p variants={itemVariants} className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00B4D8]">
          Pricing
        </motion.p>
        <motion.h1 variants={itemVariants} className="max-w-4xl text-5xl font-bold leading-[1.04] tracking-[-0.02em] text-[#F0F2F8] md:text-6xl">
          Simple pricing for teams that want fewer tools.
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-6 max-w-2xl text-base leading-8 text-[#7F8BA6] md:text-[17px]">
          Pulse brings projects, approvals, expenses, workload, and team insights into one operating system — so teams can stop paying for scattered subscriptions.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-3">
          <motion.a
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#6D5DFB] px-5 py-3 text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(109,93,251,0.24)]"
            whileHover={{ y: -1, backgroundColor: "#7C6EFC" }}
            whileTap={{ scale: 0.98 }}
          >
            Start Free
            <ArrowRight className="h-4 w-4" />
          </motion.a>
          <a className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[13px] font-medium text-[#C8D0E8] transition hover:border-white/20 hover:text-white" href="/app">
            View Dashboard Demo
          </a>
        </motion.div>
        <motion.p variants={itemVariants} className="mt-4 text-sm text-[#6B7A9F]">
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
                  billingCycle === cycle ? "bg-[#6D5DFB] text-white" : "text-[#6B7A9F] hover:text-[#C8D0E8]"
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
              whileHover={{ y: -5, borderColor: plan.featured ? "rgba(109,93,251,0.55)" : "rgba(255,255,255,0.14)" }}
              className={`relative flex min-h-full flex-col rounded-[24px] border p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl ${
                plan.featured
                  ? "border-[#6D5DFB]/45 bg-[linear-gradient(145deg,rgba(109,93,251,0.18),rgba(0,180,216,0.06))]"
                  : "border-white/10 bg-white/[0.035]"
              }`}
            >
              {plan.badge ? (
                <div className="mb-4 w-fit rounded-full border border-[#00B4D8]/20 bg-[#00B4D8]/10 px-3 py-1 text-[11px] font-medium text-[#67E8F9]">
                  {plan.badge}
                </div>
              ) : <div className="mb-4 h-6" />}
              <h2 className="text-xl font-semibold text-[#F0F2F8]">{plan.name}</h2>
              <p className="mt-2 min-h-[44px] text-sm leading-6 text-[#7F8BA6]">{plan.subtitle}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-semibold tracking-[-0.04em] text-white">
                  {billingCycle === "yearly" ? plan.yearly : plan.monthly}
                </span>
                {plan.suffix ? <span className="pb-1 text-sm text-[#6B7A9F]">{plan.suffix}</span> : null}
              </div>
              <a
                href={plan.name === "Business" ? "mailto:sales@pulse.local" : "/signup"}
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition ${
                  plan.featured ? "bg-[#6D5DFB] text-white hover:bg-[#7C6EFC]" : "border border-white/10 bg-white/[0.035] text-[#C8D0E8] hover:border-white/20 hover:text-white"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex gap-2 text-sm leading-5 text-[#C8D0E8]">
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
            <h3 className="text-lg font-semibold text-[#F0F2F8]">Typical stack</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {toolCosts.map(([tool, cost]) => (
                <div key={tool} className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-sm font-medium text-[#F0F2F8]">{tool}</p>
                  <p className="mt-1 text-sm text-[#6B7A9F]">{cost}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm font-medium text-red-100">
              $58+/user/month before hidden admin time
            </p>
          </motion.div>

          <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-raised rounded-[24px] border-[#6D5DFB]/35 bg-[linear-gradient(145deg,rgba(109,93,251,0.18),rgba(0,180,216,0.06))] p-5">
            <h3 className="text-lg font-semibold text-[#F0F2F8]">Pulse Team</h3>
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#07090F]/40 p-5">
              <p className="text-5xl font-semibold tracking-[-0.04em] text-white">$25</p>
              <p className="mt-1 text-sm text-[#9BA8C7]">/user/month</p>
              <p className="mt-5 max-w-md text-sm leading-6 text-[#C8D0E8]">
                Projects, approvals, workload, expenses, reports, and Ask Pulse in one place.
              </p>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#6B7A9F]">
              Numbers are example estimates. Actual savings depend on the tools your team currently uses.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionHeader title="Compare plans" />
        <div className="hidden overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] backdrop-blur-xl lg:block">
          <div className="grid grid-cols-[1.3fr_repeat(4,1fr)] border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#4D5E78]">
            <span>Feature</span>
            {plans.map((plan) => <span key={plan.name} className="text-center">{plan.name}</span>)}
          </div>
          {comparisonRows.map(([feature, free, startup, team, business]) => (
            <div key={feature as string} className="grid grid-cols-[1.3fr_repeat(4,1fr)] border-b border-white/[0.06] px-4 py-4 text-center text-sm last:border-0">
              <span className="text-left font-medium text-[#F0F2F8]">{feature as string}</span>
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
              <h3 className="mb-4 text-lg font-semibold text-[#F0F2F8]">{plan.name}</h3>
              <div className="space-y-3">
                {comparisonRows.map((row) => (
                  <div key={row[0] as string} className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-2 text-sm last:border-0">
                    <span className="text-[#6B7A9F]">{row[0] as string}</span>
                    <span className="text-right text-[#C8D0E8]"><FeatureValue value={row[planIndex + 1] as string | boolean} /></span>
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
                <HelpCircle className="h-5 w-5 text-[#8B7FFF]" />
                <h3 className="text-base font-semibold text-[#F0F2F8]">{question}</h3>
              </div>
              <p className="text-sm leading-6 text-[#7F8BA6]">{answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 pb-20 md:px-10">
        <div className="glass-raised mx-auto max-w-5xl rounded-[28px] p-8 text-center md:p-12">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-[#8B7FFF]">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#F0F2F8] md:text-5xl">
            Start with fewer tools. Scale with one operating system.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#7F8BA6]">
            Give your team a command center for work, approvals, expenses, workload, and insights.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#6D5DFB] px-5 py-3 text-[13px] font-semibold text-white">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/app" className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-[13px] font-medium text-[#C8D0E8]">
              View Dashboard Demo
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
