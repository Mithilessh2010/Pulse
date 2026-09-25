export type OidcDiscovery = {
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  issuer: string;
};

export function getSsoSettings() {
  const issuer = process.env.SSO_ISSUER_URL?.replace(/\/$/, "");
  const clientId = process.env.SSO_CLIENT_ID;
  const clientSecret = process.env.SSO_CLIENT_SECRET;

  if (!issuer || !clientId || !clientSecret) {
    return null;
  }

  return { issuer, clientId, clientSecret };
}

export function getSsoRedirectUri(origin: string) {
  return process.env.SSO_REDIRECT_URI || `${origin}/api/auth/sso/callback`;
}

export async function getOidcDiscovery(issuer: string): Promise<OidcDiscovery> {
  const response = await fetch(`${issuer}/.well-known/openid-configuration`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load the identity provider configuration.");
  }

  const value = (await response.json()) as Partial<OidcDiscovery>;

  if (
    !value.authorization_endpoint ||
    !value.token_endpoint ||
    !value.jwks_uri ||
    !value.issuer
  ) {
    throw new Error("The identity provider is missing required OIDC endpoints.");
  }

  return value as OidcDiscovery;
}
