import { NextResponse } from "next/server";
import { DEMO_USER_EMAIL, DEMO_USER_ID, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  if (process.env.ENABLE_DEMO_LOGIN === "false") {
    return NextResponse.json({ error: "Demo login is disabled." }, { status: 404 });
  }

  await setSessionCookie({
    userId: DEMO_USER_ID,
    email: DEMO_USER_EMAIL,
    role: "owner",
  });

  return NextResponse.json({ ok: true, redirectTo: "/app" });
}
