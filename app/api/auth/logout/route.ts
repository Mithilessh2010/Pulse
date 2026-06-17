import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ ok: true, redirectTo: "/signin" });
}

export async function GET(request: Request) {
  clearSessionCookie();
  return NextResponse.redirect(new URL("/signin", request.url));
}
