"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, AlertTriangle, CheckCircle, CreditCard, Users, Zap } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import SignalRings from "./SignalRings";
import TypingCommand from "./TypingCommand";

// Floating workflow cards positioned around the dashboard on an oval path
// Each card has: a position (percent from center), content, accent color
const floatingCards = [
  {
    id: "blockers",
    label: "Today's blockers",
    value: "5",
    sub: "tasks blocked",
    accent: "#F87171",
    icon: AlertTriangle,
    pos: { top: "6%", right: "-5%" },
    drift: { y: [-6, 4, -6], x: [0, 3, 0] },
    driftDuration: 5.2,
    delay: 1.2,
    rotateX: 4,
    rotateY: -6,
  },
  {
    id: "approvals",
    label: "Approval queue",
    value: "3",
    sub: "awaiting review",
    accent: "#FBBF24",
    icon: CheckCircle,
    pos: { top: "38%", right: "-8%" },
    drift: { y: [4, -5, 4], x: [0, -2, 0] },
    driftDuration: 4.8,
    delay: 1.5,
    rotateX: -3,
    rotateY: -8,
  },
  {
    id: "budget",
    label: "Budget used",
    value: "64%",
    sub: "$4.8k of $7.5k",
    accent: "#6D5DFB",
    icon: CreditCard,
    pos: { bottom: "10%", right: "-3%" },
    drift: { y: [-4, 6, -4], x: [0, 2, 0] },
    driftDuration: 6.0,
    delay: 1.8,
    rotateX: 6,
    rotateY: -5,
  },
  {
    id: "capacity",
    label: "Maya — near capacity",
    value: "87%",
    sub: "workload this week",
    accent: "#34D399",
    icon: Users,
    pos: { top: "28%", left: "-6%" },
    drift: { y: [5, -3, 5], x: [0, 3, 0] },
    driftDuration: 5.6,
    delay: 2.0,
    rotateX: -4,
    rotateY: 7,
  },
  {
    id: "pulse",
    label: "Ask Pulse",
    value: "Q3 risk?",
    sub: "Website Redesign · 3d behind",
    accent: "#0EA5E9",
    icon: Zap,
    pos: { bottom: "18%", left: "-4%" },
    drift: { y: [-5, 5, -5], x: [0, -3, 0] },
    driftDuration: 4.5,
    delay: 2.2,
    rotateX: 3,
    rotateY: 8,
  },
];

// Text entrance variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const headlineLineVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

function FloatingWorkflowCard({
  card,
  reduced,
}: {
  card: typeof floatingCards[0];
  reduced: boolean | null;
}) {
  const Icon = card.icon;
  return (
    <motion.div
      className="absolute z-20"
      style={card.pos as React.CSSProperties}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={
        reduced
          ? { opacity: 1, scale: 1 }
          : {
              opacity: 1,
              scale: 1,
              y: card.drift.y,
              x: card.drift.x,
            }
      }
      transition={
        reduced
          ? { duration: 0.5, delay: card.delay }
          : {
              opacity: { duration: 0.5, delay: card.delay },
              scale: { duration: 0.5, delay: card.delay },
              y: {
                duration: card.driftDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: card.delay + 0.5,
              },
              x: {
                duration: card.driftDuration * 1.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: card.delay + 0.5,
              },
            }
      }
    >
      <motion.div
        className="rounded-xl px-3.5 py-2.5"
        style={{
          background: "rgba(10,16,28,0.88)",
          border: `1px solid ${card.accent}28`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)`,
          minWidth: 148,
          perspective: 400,
          rotateX: card.rotateX,
          rotateY: card.rotateY,
        }}
        whileHover={{ scale: 1.04, rotateX: 0, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Icon size={10} color={card.accent} />
          <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: card.accent }}>
            {card.label}
          </span>
        </div>
        <p className="text-[17px] font-semibold leading-none mb-0.5" style={{ color: "#F0F2F8" }}>
          {card.value}
        </p>
        <p className="text-[9px]" style={{ color: "#4D5E78" }}>
          {card.sub}
        </p>
      </motion.div>
    </motion.div>
  );
}

// SVG signal lines from card positions to dashboard center
// These are decorative — thin dashed lines with animated dots flowing toward center
function SignalLines() {
  // Lines defined as rough % paths — drawn as SVG paths on a 1000×700 coordinate space
  // Center of dashboard is approx (640, 350) in this space
  const lines = [
    // top-right card → center
    "M 895 80 Q 820 180 660 310",
    // mid-right card → center
    "M 920 280 Q 840 290 680 340",
    // bottom-right card → center
    "M 880 560 Q 800 480 680 390",
    // left-top card → center
    "M 120 220 Q 280 260 520 330",
    // left-bottom card → center
    "M 150 480 Q 290 420 520 370",
  ];

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      viewBox="0 0 1000 660"
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%", opacity: 0.35 }}
    >
      {lines.map((d, i) => (
        <g key={i}>
          {/* Static dashed line */}
          <motion.path
            d={d}
            fill="none"
            stroke="rgba(109,93,251,0.4)"
            strokeWidth="1"
            strokeDasharray="4 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.4 + i * 0.15, ease: "easeOut" }}
          />
          {/* Animated signal dot flowing along the line */}
          <motion.circle
            r="2"
            fill="rgba(109,93,251,0.9)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: 2 + i * 0.4,
              ease: "easeInOut",
            }}
          >
            <animateMotion
              dur="2.4s"
              repeatCount="indefinite"
              begin={`${2 + i * 0.4}s`}
            >
              <mpath href={`#line-path-${i}`} />
            </animateMotion>
          </motion.circle>
          {/* Named path for animateMotion */}
          <path id={`line-path-${i}`} d={d} fill="none" stroke="none" />
        </g>
      ))}
    </svg>
  );
}

export default function HeroPulse() {
  const reduced = useReducedMotion();

  return (
    <section className="relative min-h-screen pt-[52px] flex items-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-35 pointer-events-none" />

      {/* Left-side ambient glow only — very subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 10% 55%, rgba(109,93,251,0.07) 0%, transparent 65%)",
        }}
      />

      <div className="relative w-full max-w-[1360px] mx-auto px-6 md:px-10 py-16 grid md:grid-cols-[1fr_1.1fr] gap-8 items-center">

        {/* ── LEFT: Text + CTAs ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5 z-10"
        >
          {/* Animated badge with live pulse dot */}
          <motion.div variants={itemVariants} className="inline-flex w-fit items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#6D5DFB" }}
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span
              className="text-[11px] font-medium tracking-wide"
              style={{ color: "#4D5E78" }}
            >
              Operating system for fast-moving teams
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="text-5xl md:text-6xl lg:text-[68px] font-display font-semibold leading-[0.95] tracking-[-0.05em] text-white">
            <motion.span variants={headlineLineVariants} initial="hidden" animate="visible" className="block">
              Run your team
            </motion.span>
            <motion.span
              variants={headlineLineVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.08 }}
              className="block"
            >
              from one{" "}
              <span
                style={{
                  background: "linear-gradient(120deg, #00D4FF 0%, #6D5DFB 78%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                pulse.
              </span>
            </motion.span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-[17px] font-sans leading-[1.7] max-w-[520px]"
            style={{ color: "#7F8BA6" }}
          >
            Projects, approvals, expenses, workload, and team insights — unified in one command center for fast-moving teams.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 pt-1">
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #00D4FF 0%, #6D5DFB 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.12) inset, 0 10px 28px rgba(109,93,251,0.24)",
              }}
              whileHover={{ y: -1, scale: 1.015, boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 14px 32px rgba(109,93,251,0.32)" }}
              whileTap={{ scale: 0.98 }}
            >
              Start free
              <ArrowRight size={14} />
            </motion.a>
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium backdrop-blur-md"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#C8D0E8",
              }}
              whileHover={{
                y: -1,
                border: "1px solid rgba(255,255,255,0.16)",
                color: "#F0F2F8",
                background: "rgba(255,255,255,0.05)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              View live demo
            </motion.a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 rounded-2xl border px-4 py-3 max-w-[520px]"
            style={{
              background: "linear-gradient(180deg, rgba(13,20,34,0.9), rgba(8,12,20,0.94))",
              borderColor: "rgba(255,255,255,0.06)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div className="flex items-center gap-2 shrink-0 text-[10px] font-semibold tracking-[0.18em] text-[#8A96B2] font-mono">
              <span className="inline-flex h-5 items-center">
                <svg width="40" height="10" viewBox="0 0 40 10" fill="none" aria-hidden="true">
                  <path d="M0 5H7L10 2L13 8L16 3L19 6L22 5H40" stroke="url(#hero-wave)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="hero-wave" x1="0" y1="0" x2="40" y2="10" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00D4FF" />
                      <stop offset="1" stopColor="#6D5DFB" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              ASK PULSE
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <TypingCommand
                phrases={[
                  "Analyzing team signals…",
                  "Detecting blocked work…",
                  "Forecasting project pace…",
                  "Preparing morning briefing…",
                  "Syncing approvals and expenses…",
                ]}
                className="w-full"
              />
            </div>
          </motion.div>

        </motion.div>

        {/* ── RIGHT: Animated Pulse Command Center ── */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{ minHeight: 580 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Signal rings behind everything */}
          <SignalRings size={520} />

          {/* Signal lines connecting cards → dashboard */}
          <SignalLines />

          {/* Floating workflow cards */}
          {floatingCards.map((card) => (
            <FloatingWorkflowCard key={card.id} card={card} reduced={reduced} />
          ))}

          {/* The main dashboard — gently breathing */}
          <motion.div
            animate={reduced ? {} : { scale: [1, 1.005, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <DashboardPreview />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
