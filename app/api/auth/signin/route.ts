import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { normalizeEmail, isValidEmail, setSessionCookie } from "@/lib/auth";
import { getUsersCollection } from "@/lib/mongodb";
import { readJsonObject } from "@/lib/request";
import { createVerificationCode } from "@/lib/verification";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await readJsonObject(request);

    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const email = normalizeEmail(typeof body.email === "string" ? body.email : "");
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!user.emailVerified) {
      await createVerificationCode(email);
      return NextResponse.json({
        ok: true,
        needsVerification: true,
        redirectTo: `/verify?email=${encodeURIComponent(email)}`,
      });
    }

    await setSessionCookie({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ ok: true, redirectTo: "/app" });
  } catch (error) {
    console.error("[Pulse auth] Sign in failed", error);
    return NextResponse.json({ error: "Unable to sign in." }, { status: 500 });
  }
}
