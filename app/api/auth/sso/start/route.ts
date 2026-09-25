import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getOidcDiscovery, getSsoRedirectUri, getSsoSettings } from "@/lib/sso";

export const runtime = "nodejs";

function base64Url(value: Buffer) {
  return value.toString("base64url");
}

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const settings = getSsoSettings();

  if (!settings) {
    return NextResponse.redirect(new URL("/signin?sso=not-configured", origin));
  }

  try {
    const discovery = await getOidcDiscovery(settings.issuer);
    const state = base64Url(randomBytes(24));
    const nonce = base64Url(randomBytes(24));
    const verifier = base64Url(randomBytes(48));
    const challenge = createHash("sha256").update(verifier).digest("base64url");
    const redirectUri = getSsoRedirectUri(origin);

    const authorizationUrl = new URL(discovery.authorization_endpoint);
    authorizationUrl.searchParams.set("client_id", settings.clientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", "openid email profile");
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set("nonce", nonce);
    authorizationUrl.searchParams.set("code_challenge", challenge);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");

    const response = NextResponse.redirect(authorizationUrl);
    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    };

    response.cookies.set("pulse_sso_state", state, cookieOptions);
    response.cookies.set("pulse_sso_nonce", nonce, cookieOptions);
    response.cookies.set("pulse_sso_verifier", verifier, cookieOptions);
    return response;
  } catch (error) {
    console.error("[Pulse SSO] Unable to start OIDC sign-in", error);
    return NextResponse.redirect(new URL("/signin?sso=provider-error", origin));
  }
}
