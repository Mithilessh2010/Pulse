import { NextResponse } from "next/server";
import {
  activityFeed,
  approvals,
  askPulseResponses,
  blockers,
  chatRooms,
  decisions,
  enterprise,
  expenses,
  invites,
  meetings,
  members,
  playbooks,
  projects,
  reports,
  tasks,
  teamMembers,
  teams,
  workspaceSummary,
} from "@/lib/mockData";

export const runtime = "nodejs";
const OPENROUTER_TIMEOUT_MS = 12000;

const fallback =
  "Pulse sees 4 active blockers, 6 waiting approvals, and Website Redesign as the highest-risk project. The next best action is to clear design approval and reassign one task from Maya to Jordan.";

function getFallback(prompt: string) {
  const normalized = prompt.toLowerCase();
  if (askPulseResponses[prompt]) return askPulseResponses[prompt];
  if (normalized.includes("risk")) {
    return "Website Redesign and Investor Update Deck need attention. Website Redesign is 3 days behind pace because design approval is pending. Investor Update Deck is blocked by missing finance numbers.";
  }
  if (normalized.includes("support") || normalized.includes("overloaded")) {
    return "Maya appears near capacity at 87% workload with 9 active tasks and 2 blocked tasks. Jordan has available capacity at 34%, so one task could be reassigned.";
  }
  if (normalized.includes("approval")) {
    return "There are 6 approvals waiting: 3 task approvals, 2 expense approvals, and 1 client update. The highest priority item is Maya's Q3 dashboard proof.";
  }
  if (normalized.includes("expense") || normalized.includes("budget")) {
    return "Budget usage is 64%, with $4,820 used of $7,500. Three expenses are pending, and Software is the highest category.";
  }
  if (normalized.includes("meeting")) {
    return "The most useful meeting to schedule is a 20-minute Website Redesign unblock with Alex, Maya, and Jordan because design approval is delaying engineering handoff.";
  }
  if (normalized.includes("invite") || normalized.includes("onboarding")) {
    return "There are 3 pending invites. Ryan is waiting for Engineering, Sara for Product, and a finance contractor for Finance.";
  }
  if (normalized.includes("decision")) {
    return "The key active decision is that Website Redesign needs mobile approval before engineering starts. This prevents rework and keeps the handoff clear.";
  }
  return fallback;
}

function getSuggestedActions(prompt: string) {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("approval")) return ["Review Maya's Q3 dashboard proof", "Request mobile proof for Website Redesign", "Open the approval queue"];
  if (normalized.includes("budget") || normalized.includes("expense")) return ["Review pending expenses", "Ask Finance for final numbers", "Open budget report"];
  if (normalized.includes("support") || normalized.includes("overloaded")) return ["Move one task from Maya to Jordan", "Open team capacity", "Create support follow-up"];
  if (normalized.includes("meeting")) return ["Generate Website Redesign agenda", "Create follow-up tasks", "Open Meeting Hub"];
  return ["Open manager inbox", "Generate leadership update", "Run Autopilot plan"];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.message === "string" ? body.message.trim() : typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json({ answer: "Ask Pulse needs a question before it can respond.", suggestedActions: [] }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ answer: getFallback(prompt), source: "fallback", suggestedActions: getSuggestedActions(prompt) });
    }

    const workspaceContext = {
      enterprise,
      projects,
      tasks: Array.from(tasks),
      approvals,
      expenses: Array.from(expenses),
      teamWorkload: teamMembers,
      members,
      teams,
      blockers,
      reports,
      meetings,
      decisions,
      playbooks,
      invites,
      chatRooms,
      activityFeed,
      workspaceSummary,
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
        messages: [
          {
            role: "system",
            content:
              "You are Ask Pulse, an executive command assistant inside a team operating system. Answer only using the workspace data provided. Be concise, clear, and action-oriented. Focus on projects, blockers, approvals, workload, team capacity, expenses, reports, meetings, decisions, and next best actions. If data is missing, say what is unknown and suggest the next action. Do not invent fake data.",
          },
          {
            role: "system",
            content: `Workspace context: ${JSON.stringify(workspaceContext)}`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error("[Ask Pulse] AI provider request failed", response.status, await response.text());
      return NextResponse.json({ answer: getFallback(prompt), source: "fallback", suggestedActions: getSuggestedActions(prompt) });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json({ answer: getFallback(prompt), source: "fallback", suggestedActions: getSuggestedActions(prompt) });
    }

    return NextResponse.json({ answer: answer.trim(), source: "openrouter", suggestedActions: getSuggestedActions(prompt) });
  } catch (error) {
    console.error("[Ask Pulse] Failed to answer", error);
    return NextResponse.json({ answer: fallback, source: "fallback", suggestedActions: getSuggestedActions("") });
  }
}
