"use client";
import { motion } from "framer-motion";
import {
  AlertTriangle, CheckSquare, ChevronRight, Clock,
  CreditCard, Home, LayoutGrid, TrendingUp, Users
} from "lucide-react";
import ProgressBar from "./ProgressBar";
import { projects, teamWorkload, expenses, tasks } from "@/lib/mockData";
import TypingCommand from "./TypingCommand";

const sidebarItems = [
  { icon: Home, label: "Overview", active: true },
  { icon: LayoutGrid, label: "Projects" },
  { icon: CheckSquare, label: "Tasks" },
  { icon: Users, label: "Team" },
  { icon: CreditCard, label: "Expenses" },
  { icon: TrendingUp, label: "Reports" },
];

const projectColors: Record<string, string> = {
  "on-track": "#4ADE80",
  "at-risk": "#F87171",
};

const projectStatusLabel: Record<string, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
};

export default function DashboardPreview() {
  return (
    <div className="relative w-full flex items-center justify-center" style={{ minHeight: 560 }}>
      {/* Reduced, softer glow behind */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 60% 50%, rgba(109,93,251,0.10) 0%, rgba(0,212,255,0.04) 60%, transparent 100%)",
        }}
      />

      {/* Main Dashboard */}
      <motion.div
        className="relative rounded-xl overflow-hidden"
        style={{
          width: "100%",
          maxWidth: 640,
          background: "#0C1220",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(109,93,251,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
          transform: "perspective(1200px) rotateY(-4deg) rotateX(2deg)",
        }}
        initial={{ opacity: 0, y: 36, rotateY: -10 }}
        animate={{ opacity: 1, y: 0, rotateY: -4 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
      >
        {/* App Shell Header — no traffic lights, real app feel */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#090E1A" }}
        >
          {/* Left: workspace context */}
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ background: "#6D5DFB" }}
            >
              <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                <path d="M0.5 3.5H2L3.5 1L5 6L6.5 2.5L7.5 4.5H9.5" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[11px] font-medium" style={{ color: "#8896B4" }}>Acme Ops</span>
            <ChevronRight size={10} color="#3D4F6F" />
             <span className="text-[11px] font-sans font-medium" style={{ color: "#D5DBEB" }}>Q3 Launch Review</span>
          </div>
          {/* Right: user avatar + status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ADE80" }} />
               <span className="text-[9px] font-medium font-mono" style={{ color: "#4ADE80" }}>Live</span>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#6D5DFB" }}>
              MY
            </div>
          </div>
        </div>

          <div
            className="px-4 py-3"
            style={{
              background: "linear-gradient(180deg, rgba(9,14,26,0.86), rgba(10,16,28,0.96))",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <motion.div
              className="flex items-center gap-3 rounded-xl px-3 py-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px rgba(109,93,251,0.05)",
              }}
              animate={{ boxShadow: ["inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px rgba(109,93,251,0.05)", "inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px rgba(109,93,251,0.10)", "inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1px rgba(109,93,251,0.05)"] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-[10px] font-mono tracking-[0.18em] text-[#7A86A4] shrink-0">
                ASK PULSE
              </span>
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
              <span className="hidden sm:inline-flex h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(135deg, #00D4FF, #6D5DFB)", boxShadow: "0 0 0 4px rgba(109,93,251,0.08)" }} />
            </motion.div>
          </div>

        {/* Dashboard Body */}
        <div className="flex" style={{ minHeight: 460 }}>
          {/* Sidebar — icon-only, Lucide icons, no emoji */}
          <div
            className="flex flex-col gap-0.5 py-3 px-2"
            style={{ width: 46, background: "rgba(0,0,0,0.15)", borderRight: "1px solid rgba(255,255,255,0.04)" }}
          >
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
                  style={{
                    background: item.active ? "rgba(109,93,251,0.15)" : "transparent",
                    color: item.active ? "#8B7FFF" : "#3D4F6F",
                  }}
                  title={item.label}
                >
                  <Icon size={14} />
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-hidden">
            {/* Top stat row */}
            <div className="grid grid-cols-3 gap-2">
              {/* Today's blockers */}
              <div className="rounded-lg p-2.5 transition-transform duration-300 hover:-translate-y-0.5" style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.12)" }}>
                <p className="text-[9px] font-medium mb-1 font-mono tracking-[0.16em]" style={{ color: "#6B7A9F" }}>PROJECT HEALTH</p>
                <p className="text-[18px] font-semibold leading-none mb-0.5" style={{ color: "#F87171" }}>2</p>
                <p className="text-[9px] font-sans" style={{ color: "#4D5E78" }}>today</p>
              </div>
              {/* Approval queue */}
              <div className="rounded-lg p-2.5 transition-transform duration-300 hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[9px] font-medium mb-1 font-mono tracking-[0.16em]" style={{ color: "#6B7A9F" }}>APPROVAL QUEUE</p>
                <p className="text-[18px] font-semibold leading-none mb-0.5" style={{ color: "#F0F2F8" }}>4</p>
                <p className="text-[9px] font-sans" style={{ color: "#4D5E78" }}>pending</p>
              </div>
              {/* Budget usage */}
              <div className="rounded-lg p-2.5 transition-transform duration-300 hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[9px] font-medium mb-1 font-mono tracking-[0.16em]" style={{ color: "#6B7A9F" }}>WORKLOAD</p>
                <p className="text-[18px] font-semibold leading-none mb-0.5" style={{ color: "#F0F2F8" }}>64%</p>
                <p className="text-[9px] font-sans" style={{ color: "#4D5E78" }}>$4.8k / $7.5k</p>
              </div>
            </div>

            {/* Projects table */}
            <div className="rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-[10px] font-semibold font-mono tracking-[0.14em]" style={{ color: "#8896B4" }}>PROJECTS</span>
                <span className="text-[9px] font-sans" style={{ color: "#3D4F6F" }}>3 active</span>
              </div>
              {projects.map((p, i) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 px-3 py-2"
                  style={{ borderBottom: i < projects.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium font-sans truncate" style={{ color: "#D5DBEB" }}>{p.name}</span>
                      <span className="text-[9px] ml-2 shrink-0 font-mono" style={{ color: projectColors[p.status] }}>
                        {projectStatusLabel[p.status]}
                      </span>
                    </div>
                    <ProgressBar value={p.progress} color={projectColors[p.status]} height={2} />
                  </div>
                  <span className="text-[9px] shrink-0 w-7 text-right font-mono" style={{ color: "#4D5E78" }}>{p.daysLeft}d</span>
                </div>
              ))}
            </div>

            {/* Bottom row: workload + tasks */}
            <div className="grid grid-cols-2 gap-2 flex-1">
              {/* Team capacity */}
              <div className="rounded-lg p-2.5 transition-transform duration-300 hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[9px] font-semibold mb-2 font-mono tracking-[0.16em]" style={{ color: "#6B7A9F" }}>TEAM CAPACITY</p>
                <div className="flex flex-col gap-1.5">
                  {teamWorkload.map((m) => (
                    <div key={m.name} className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0" style={{ background: "#1E2D45" }}>
                        <span style={{ color: "#8896B4" }}>{m.initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <ProgressBar
                          value={m.load}
                          color={m.load > 80 ? "#F87171" : m.load > 60 ? "#FBBF24" : "#4ADE80"}
                          height={2}
                        />
                      </div>
                      <span className="text-[8px] shrink-0 w-6 text-right font-mono" style={{ color: "#4D5E78" }}>{m.load}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks today */}
              <div className="rounded-lg p-2.5 transition-transform duration-300 hover:-translate-y-0.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-semibold font-mono tracking-[0.16em]" style={{ color: "#6B7A9F" }}>DUE TODAY</p>
                  <Clock size={10} color="#3D4F6F" />
                </div>
                <div className="flex flex-col gap-1.5">
                  {tasks.items.slice(0, 4).map((t, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <div
                        className="w-3 h-3 rounded-sm border shrink-0 mt-0.5"
                        style={{ borderColor: "rgba(255,255,255,0.1)" }}
                      />
                      <span className="text-[9px] leading-tight truncate font-sans" style={{ color: "#6B7A9F" }}>
                        {t.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating alert — more restrained, no emoji */}
      <motion.div
        className="absolute rounded-lg px-3 py-2 shadow-xl"
        style={{
          right: "-3%",
          top: "10%",
          maxWidth: 188,
          background: "rgba(13,20,34,0.92)",
          border: "1px solid rgba(248,113,113,0.2)",
          backdropFilter: "blur(16px)",
        }}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
        transition={{
          opacity: { delay: 1.1, duration: 0.5 },
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.1 },
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle size={10} color="#F87171" />
          <span className="text-[10px] font-semibold font-mono" style={{ color: "#F87171" }}>
            Approval delayed
          </span>
        </div>
        <p className="text-[9px] leading-relaxed font-sans" style={{ color: "#6B7A9F" }}>
          Website Redesign is 3 days behind pace.
        </p>
      </motion.div>

      {/* Floating capacity card — calmer */}
      <motion.div
        className="absolute rounded-lg px-3 py-2 shadow-xl"
        style={{
          left: "-2%",
          bottom: "20%",
          background: "rgba(13,20,34,0.92)",
          border: "1px solid rgba(74,222,128,0.15)",
          backdropFilter: "blur(16px)",
        }}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0, y: [0, 5, 0] }}
        transition={{
          opacity: { delay: 1.4, duration: 0.5 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
        }}
      >
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ADE80" }} />
          <p className="text-[10px] font-medium font-sans" style={{ color: "#C4CEDF" }}>
            Jordan has capacity
          </p>
        </div>
        <p className="text-[9px] font-sans" style={{ color: "#4D5E78" }}>
          34% load · available to assign
        </p>
      </motion.div>
    </div>
  );
}
