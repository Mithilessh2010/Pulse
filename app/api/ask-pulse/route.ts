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
} from "@/lib/mockData";

export const runtime = "nodejs";

const fallback =
  "Website Redesign is the highest-risk project. It is 3 days behind pace because design approval is still pending.";

function getFallback(prompt: string) {
  return askPulseResponses[prompt] ?? fallback;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

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
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
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
              "You are Ask Pulse, an executive command assistant for a team operating system. Answer using the workspace data provided. Be concise, direct, and useful. Focus on projects, tasks, blockers, approvals, workload, expenses, and reports. If data is missing, say what is unknown and suggest a next action.",
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
