import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { normalizeEmail, isValidEmail } from "@/lib/auth";
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

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = normalizeEmail(typeof body.email === "string" ? body.email : "");
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
    const workspaceName =
      typeof body.workspaceName === "string" ? body.workspaceName.trim() : "";

    if (!name || !email || !password || !confirmPassword || !workspaceName) {
      return NextResponse.json({ error: "Please complete every field." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const users = await getUsersCollection();
    const existingUser = await users.findOne({ email }, { projection: { _id: 1 } });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const now = new Date();
    const passwordHash = await bcrypt.hash(password, 12);

    await users.insertOne({
      name,
      email,
      passwordHash,
      workspaceName,
      emailVerified: false,
      role: "owner",
      createdAt: now,
      updatedAt: now,
    });

    await createVerificationCode(email);

    return NextResponse.json({
      ok: true,
      redirectTo: `/verify?email=${encodeURIComponent(email)}`,
    });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    console.error("[Pulse auth] Signup failed", error);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
