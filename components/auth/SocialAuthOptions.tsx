"use client";

import { Github } from "lucide-react";

function GoogleLogo() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function MicrosoftLogo() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
      <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}

const providers = [
  { id: "google", label: "Google", Logo: GoogleLogo },
  { id: "github", label: "GitHub", Logo: Github },
  { id: "microsoft", label: "Microsoft", Logo: MicrosoftLogo },
];

type SocialAuthOptionsProps = {
  onUnavailable: (message: string) => void;
};

export default function SocialAuthOptions({ onUnavailable }: SocialAuthOptionsProps) {
  return (
    <div className="mb-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#4D5E78]">
          Continue with
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {providers.map(({ id, label, Logo }) => (
          <button
            key={id}
            type="button"
            aria-label={`Continue with ${label}`}
            title={`Continue with ${label}`}
            onClick={() =>
              onUnavailable(
                `${label} sign-in is coming soon. Use the demo email flow for now.`,
              )
            }
            className="group flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-[12px] font-medium text-[#9BA8C7] transition hover:border-[#6D5DFB]/50 hover:bg-white/[0.055] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#6D5DFB]/40"
          >
            <Logo className="h-4 w-4 transition group-hover:scale-105" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
