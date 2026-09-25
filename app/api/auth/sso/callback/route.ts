import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { normalizeEmail, setSessionCookie } from "@/lib/auth";
import { getUsersCollection } from "@/lib/mongodb";
import { getOidcDiscovery, getSsoRedirectUri, getSsoSettings } from "@/lib/sso";

export const runtime = "nodejs";

function errorRedirect(origin: string, reason: string) {
  return NextResponse.redirect(new URL(`/signin?sso=${encodeURIComponent(reason)}`, origin));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const settings = getSsoSettings();
  const cookieStore = cookies();
  const expectedState = cookieStore.get("pulse_sso_state")?.value;
  const expectedNonce = cookieStore.get("pulse_sso_nonce")?.value;
  const verifier = cookieStore.get("pulse_sso_verifier")?.value;

  if (!settings || !code || !state || !expectedState || !expectedNonce || !verifier || state !== expectedState) {
    return errorRedirect(origin, "invalid-request");
  }

  try {
    const discovery = await getOidcDiscovery(settings.issuer);
    const redirectUri = getSsoRedirectUri(origin);
    const tokenResponse = await fetch(discovery.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: settings.clientId,
        client_secret: settings.clientSecret,
        code_verifier: verifier,
      }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      throw new Error("Identity provider rejected the authorization code.");
    }

    const tokens = (await tokenResponse.json()) as { id_token?: string };
    if (!tokens.id_token) {
      throw new Error("Identity provider did not return an ID token.");
    }

    const jwks = createRemoteJWKSet(new URL(discovery.jwks_uri));
    const { payload } = await jwtVerify(tokens.id_token, jwks, {
      issuer: discovery.issuer,
      audience: settings.clientId,
    });

    if (payload.nonce !== expectedNonce) {
      throw new Error("OIDC nonce did not match.");
    }

    const email = normalizeEmail(typeof payload.email === "string" ? payload.email : "");
    if (!email || payload.email_verified === false) {
      return errorRedirect(origin, "unverified-email");
    }

    const users = await getUsersCollection();
    let user = await users.findOne({ email });

    if (!user) {
      if (process.env.SSO_AUTO_PROVISION === "false") {
        return errorRedirect(origin, "not-provisioned");
      }

      const now = new Date();
      const name = typeof payload.name === "string" && payload.name.trim()
        ? payload.name.trim()
        : email.split("@")[0];
      const domain = email.split("@")[1]?.split(".")[0] || "Company";
      const passwordHash = await bcrypt.hash(randomBytes(32).toString("hex"), 12);
      const insert = await users.insertOne({
        name,
        email,
        passwordHash,
        workspaceName: `${domain.charAt(0).toUpperCase()}${domain.slice(1)} Workspace`,
        emailVerified: true,
        role: "owner",
        createdAt: now,
        updatedAt: now,
      });
      user = await users.findOne({ _id: insert.insertedId });
    }

    if (!user?._id) {
      throw new Error("Unable to load the signed-in user.");
    }

    await setSessionCookie({ userId: user._id.toString(), email: user.email, role: user.role });

    const response = NextResponse.redirect(new URL("/app", origin));
    response.cookies.delete("pulse_sso_state");
    response.cookies.delete("pulse_sso_nonce");
    response.cookies.delete("pulse_sso_verifier");
    return response;
  } catch (error) {
    console.error("[Pulse SSO] OIDC callback failed", error);
    return errorRedirect(origin, "sign-in-failed");
  }
}
