import { CheckCircle2, KeyRound, LockKeyhole, ScrollText, ShieldCheck, UserCheck } from "lucide-react";
import Navbar from "@/components/Navbar";

const controls = [
  { Icon: LockKeyhole, title: "Protected sessions", text: "Pulse signs session tokens and stores them in HTTP-only cookies with SameSite protection. Production cookies are marked Secure." },
  { Icon: KeyRound, title: "Credential protection", text: "Password accounts use bcrypt hashing. Email verification is required before a standard account can enter the workspace." },
  { Icon: UserCheck, title: "Optional company SSO", text: "Business deployments can connect an OpenID Connect identity provider with authorization code flow, PKCE, state, and nonce checks." },
  { Icon: ScrollText, title: "Workspace audit trail", text: "Approval decisions and change requests are recorded so teams can trace what happened and why." },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#0B0D0C] text-white">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-32 md:px-10 md:pt-36">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9EA59F]">Security</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#F4F1EA] md:text-6xl">Security that can be explained, not just badged.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#8E958F]">Pulse is still an early product. This page documents the controls implemented in the codebase today and avoids claiming certifications the project has not completed.</p>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-2">
          {controls.map(({ Icon, title, text }) => (
            <article key={title} className="rounded-xl border border-white/[0.08] bg-[#111412] p-5">
              <Icon className="h-5 w-5 text-[#D5BC7A]" />
              <h2 className="mt-4 text-base font-semibold text-[#E5E7E4]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#737A74]">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-white/[0.08] bg-[#0E100F] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#4B9B7C]" />
            <h2 className="text-lg font-semibold text-[#F4F1EA]">OIDC SSO configuration</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#8E958F]">Set the issuer, client ID, client secret, and redirect URI in the deployment environment. Pulse discovers the provider endpoints, uses PKCE for the authorization code exchange, and validates the signed ID token against the provider&apos;s JWKS.</p>
          <div className="mt-5 grid gap-2 text-sm text-[#AEB4AF] sm:grid-cols-2">
            {["Authorization code + PKCE", "State and nonce validation", "Verified ID-token signature", "Optional just-in-time provisioning"].map((item) => (
              <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#4B9B7C]" />{item}</div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
