import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { ObjectId } from "mongodb";
import { getUsersCollection } from "@/lib/mongodb";

export const SESSION_COOKIE_NAME = "pulse_session";
export const DEMO_USER_ID = "64f000000000000000000001";
export const DEMO_USER_EMAIL = "demo@pulse.local";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type SessionPayload = {
  userId: string;
  email: string;
  role: "owner";
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  workspaceName: string;
  emailVerified: boolean;
  role: "owner";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      payload.role !== "owner"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);

  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

export function clearSessionCookie() {
  cookies().set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);

  if (!session || !ObjectId.isValid(session.userId)) {
    return null;
  }

  if (
    session.userId === DEMO_USER_ID &&
    session.email === DEMO_USER_EMAIL
  ) {
    return {
      id: DEMO_USER_ID,
      name: "Demo User",
      email: DEMO_USER_EMAIL,
      workspaceName: "Pulse Demo Workspace",
      emailVerified: true,
      role: "owner",
    };
  }

  const users = await getUsersCollection();
  const user = await users.findOne(
    { _id: new ObjectId(session.userId), email: session.email, emailVerified: true },
    { projection: { passwordHash: 0 } },
  );

  if (!user?._id) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    workspaceName: user.workspaceName,
    emailVerified: user.emailVerified,
    role: user.role,
  };
});

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
