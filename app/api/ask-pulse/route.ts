import { NextResponse } from "next/server";
import {
  activityFeed,
  approvals,
  askPulseResponses,
  blockers,
  expenses,
  projects,
  reports,
  tasks,
  teamMembers,
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
  return fallback;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.message === "string" ? body.message.trim() : typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json({ answer: "Ask Pulse needs a question before it can respond." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ answer: getFallback(prompt), source: "fallback" });
    }

    const workspaceContext = {
      projects,
      tasks: Array.from(tasks),
      approvals,
      expenses: Array.from(expenses),
      teamWorkload: teamMembers,
      blockers,
      reports,
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
              "You are Ask Pulse, an executive command assistant inside a team operating system. Answer using only the workspace data provided. Be concise, direct, useful, and action-oriented. Focus on projects, tasks, blockers, approvals, workload, expenses, budgets, and reports. If information is missing, say what is unknown and suggest the next best action. Do not invent data.",
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
      console.error("[Ask Pulse] OpenRouter request failed", response.status, await response.text());
      return NextResponse.json({ answer: getFallback(prompt), source: "fallback" });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json({ answer: getFallback(prompt), source: "fallback" });
    }

    return NextResponse.json({ answer: answer.trim(), source: "openrouter" });
  } catch (error) {
    console.error("[Ask Pulse] Failed to answer", error);
    return NextResponse.json({ answer: fallback, source: "fallback" });
  }
}
