import { NextResponse } from "next/server";
import { normalizeEmail, isValidEmail } from "@/lib/auth";
import { getUsersCollection } from "@/lib/mongodb";
import { createVerificationCode } from "@/lib/verification";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(typeof body.email === "string" ? body.email : "");

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ email }, { projection: { emailVerified: 1 } });

    if (!user) {
      return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ ok: true, redirectTo: "/signin" });
    }

    await createVerificationCode(email);
    return NextResponse.json({ ok: true, message: "A new code was generated." });
  } catch (error) {
    console.error("[Pulse auth] Resend code failed", error);
    return NextResponse.json({ error: "Unable to generate a new code." }, { status: 500 });
  }
}
