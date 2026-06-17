import { NextResponse } from "next/server";
import { approvals, blockers, expenses, meetings, members, projects, tasks, teams, workspaceSummary } from "@/lib/mockData";

export const runtime = "nodejs";

const OPENROUTER_TIMEOUT_MS = 12000;

type AutopilotAction = {
  id: string;
  category: "approval" | "reassignment" | "message" | "meeting" | "report" | "risk" | "invite";
  title: string;
  reason: string;
  relatedObject: string;
  riskLevel: "Low" | "Medium" | "High";
  confidence: number;
  status: "Suggested" | "Ready to run" | "Needs review";
};

type AutopilotPlan = {
  summary: string;
  actions: AutopilotAction[];
};

const categories = ["approval", "reassignment", "message", "meeting", "report", "risk", "invite"] as const;
const riskLevels = ["Low", "Medium", "High"] as const;
const statuses = ["Suggested", "Ready to run", "Needs review"] as const;

const fallbackPlan: AutopilotPlan = {
  summary:
    "Pulse found a manager-safe action plan: clear the highest-confidence approvals, reduce Maya's workload, schedule a Website Redesign unblock, and prepare a concise leadership update.",
  actions: [
    {
      id: "approve-q3-proof",
      category: "approval",
      title: "Review Maya's Q3 dashboard proof",
      reason: "The approval has complete proof attached and is the highest-priority review item in the queue.",
      relatedObject: "Q3 Launch Review",
      riskLevel: "Medium",
      confidence: 84,
      status: "Needs review",
    },
    {
      id: "request-website-proof",
      category: "approval",
      title: "Request missing mobile proof for Website Redesign",
      reason: "Website Redesign is behind pace and engineering cannot start cleanly until the mobile proof is attached.",
      relatedObject: "Website Redesign",
      riskLevel: "High",
      confidence: 91,
      status: "Suggested",
    },
    {
      id: "rebalance-maya",
      category: "reassignment",
      title: "Move one support task from Maya to Jordan",
      reason: "Maya is near capacity while Jordan has available workload room this week.",
      relatedObject: "Team workload",
      riskLevel: "Low",
      confidence: 88,
      status: "Ready to run",
    },
    {
      id: "message-alex",
      category: "message",
      title: "Draft a message to Alex about design approval",
      reason: "Alex owns the Website Redesign dependency that is currently delaying delivery.",
      relatedObject: "Website Redesign",
      riskLevel: "Low",
      confidence: 86,
      status: "Ready to run",
    },
    {
      id: "schedule-unblock",
      category: "meeting",
      title: "Schedule a 20-minute Website Redesign unblock",
      reason: "A short review with Alex, Maya, and Jordan can resolve the approval owner and handoff time.",
      relatedObject: "Meeting Hub",
      riskLevel: "Medium",
      confidence: 81,
      status: "Suggested",
    },
    {
      id: "leadership-update",
      category: "report",
      title: "Generate today's leadership update",
      reason: "The workspace has clear status, risks, spend, and next actions ready to summarize.",
      relatedObject: "Reports",
      riskLevel: "Low",
      confidence: 89,
      status: "Ready to run",
    },
  ],
};

function normalizeCategory(value: unknown): AutopilotAction["category"] {
  if (typeof value !== "string") return "risk";
  const normalized = value.toLowerCase();
  if (categories.some((category) => category === normalized)) return normalized as AutopilotAction["category"];
  if (normalized.includes("approv")) return "approval";
  if (normalized.includes("assign") || normalized.includes("workload")) return "reassignment";
  if (normalized.includes("message") || normalized.includes("follow")) return "message";
  if (normalized.includes("meeting") || normalized.includes("schedule")) return "meeting";
  if (normalized.includes("report") || normalized.includes("update")) return "report";
  if (normalized.includes("invite")) return "invite";
  return "risk";
}

function normalizeRiskLevel(value: unknown): AutopilotAction["riskLevel"] {
  return riskLevels.find((level) => level === value) ?? "Medium";
}

function normalizeStatus(value: unknown): AutopilotAction["status"] {
  return statuses.find((status) => status === value) ?? "Suggested";
}

function cleanPlan(plan: Partial<AutopilotPlan>): AutopilotPlan {
  const actions = Array.isArray(plan.actions)
    ? plan.actions
        .filter((item): item is AutopilotAction => Boolean(item && typeof item === "object" && "title" in item))
        .slice(0, 8)
        .map((item, index) => ({
          id: typeof item.id === "string" ? item.id : `autopilot-${index}`,
          category: normalizeCategory(item.category),
          title: item.title,
          reason: typeof item.reason === "string" ? item.reason : "Pulse recommends manager review before taking action.",
          relatedObject: typeof item.relatedObject === "string" ? item.relatedObject : "Workspace",
          riskLevel: normalizeRiskLevel(item.riskLevel),
          confidence: typeof item.confidence === "number" ? Math.max(0, Math.min(100, item.confidence)) : 75,
          status: normalizeStatus(item.status),
        }))
    : [];

  return {
    summary: typeof plan.summary === "string" && plan.summary.trim() ? plan.summary.trim() : fallbackPlan.summary,
    actions: actions.length ? actions : fallbackPlan.actions,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const command = typeof body.command === "string" ? body.command.trim() : "";

    if (!command) {
      return NextResponse.json({ summary: "Autopilot needs a command before it can build a plan.", actions: [] }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return NextResponse.json({ ...fallbackPlan, source: "fallback" });

    const workspaceContext = {
      workspaceSummary,
      projects,
      tasks: Array.from(tasks),
      approvals,
      expenses: Array.from(expenses),
      blockers,
      members,
      teams,
      meetings,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OPENROUTER_TIMEOUT_MS);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "Pulse",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are Pulse Autopilot, a cautious manager copilot. Use only the provided workspace data. Return strict JSON with summary and actions. Actions must include id, category, title, reason, relatedObject, riskLevel, confidence, and status. Never claim an action has been executed.",
          },
          { role: "system", content: `Workspace context: ${JSON.stringify(workspaceContext)}` },
          { role: "user", content: command },
        ],
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error("[Autopilot] AI provider request failed", response.status, await response.text());
      return NextResponse.json({ ...fallbackPlan, source: "fallback" });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") return NextResponse.json({ ...fallbackPlan, source: "fallback" });

    try {
      return NextResponse.json({ ...cleanPlan(JSON.parse(content)), source: "openrouter" });
    } catch {
      return NextResponse.json({ ...fallbackPlan, source: "fallback" });
    }
  } catch (error) {
    console.error("[Autopilot] Failed to build plan", error);
    return NextResponse.json({ ...fallbackPlan, source: "fallback" });
  }
}
