import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { normalizeEmail, isValidEmail, setSessionCookie } from "@/lib/auth";
import { getUsersCollection, getVerificationCodesCollection } from "@/lib/mongodb";
import { readJsonObject } from "@/lib/request";
import { compareVerificationCode } from "@/lib/verification";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const body = await readJsonObject(request);

    if (!body) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const email = normalizeEmail(typeof body.email === "string" ? body.email : "");
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Verification email is missing." }, { status: 400 });
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Enter the 6-digit verification code." }, { status: 400 });
    }

    const codes = await getVerificationCodesCollection();
    const verification = await codes.findOne({ email });

    if (!verification) {
      return NextResponse.json(
        { error: "No active verification code found. Request a new code." },
        { status: 404 },
      );
    }

    if (verification.expiresAt.getTime() <= Date.now()) {
      await codes.deleteOne({ email });
      return NextResponse.json(
        { error: "That verification code expired. Request a new code." },
        { status: 410 },
      );
    }

    const matches = await compareVerificationCode(code, verification.codeHash);

    if (!matches) {
      const attempts = verification.attempts + 1;

      if (attempts >= MAX_ATTEMPTS) {
        await codes.deleteOne({ email });
        return NextResponse.json(
          { error: "Too many incorrect attempts. Request a new code." },
          { status: 429 },
        );
      }

      await codes.updateOne({ email }, { $set: { attempts } });
      return NextResponse.json({ error: "Invalid verification code." }, { status: 401 });
    }

    const users = await getUsersCollection();
    const user = await users.findOneAndUpdate(
      { email },
      { $set: { emailVerified: true, updatedAt: new Date() } },
      { returnDocument: "after" },
    );

    if (!user || !ObjectId.isValid(user._id)) {
      return NextResponse.json({ error: "Unable to verify this account." }, { status: 404 });
    }

    await codes.deleteOne({ email });
    await setSessionCookie({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ ok: true, redirectTo: "/app" });
  } catch (error) {
    console.error("[Pulse auth] Verification failed", error);
    return NextResponse.json({ error: "Unable to verify account." }, { status: 500 });
  }
}
