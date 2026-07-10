import { NextResponse } from "next/server";
import { TEMP_TEST_EMAIL, TEMP_TEST_USER_ID, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_TEMP_LOGIN !== "true") {
    return NextResponse.json({ error: "Temporary login is disabled." }, { status: 404 });
  }

  await setSessionCookie({
    userId: TEMP_TEST_USER_ID,
    email: TEMP_TEST_EMAIL,
    role: "owner",
  });

  return NextResponse.json({ ok: true, redirectTo: "/app" });
}
