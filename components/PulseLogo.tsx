import { useId } from "react";

export function PulseLogo() {
  const gradientId = useId().replace(/:/g, "");

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]"
      style={{
        background: "#0B1020",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="48" height="48" rx="14" fill="#0B1020" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="13"
          stroke="white"
          strokeOpacity="0.08"
          strokeWidth="2"
        />

        <defs>
          <linearGradient
            id={`pulseGradient-${gradientId}`}
            x1="12"
            y1="10"
            x2="36"
            y2="38"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00D4FF" />
            <stop offset="1" stopColor="#6D5DFB" />
          </linearGradient>
        </defs>

        <circle cx="24" cy="24" r="3.2" fill={`url(#pulseGradient-${gradientId})`} />

        <path
          d="M24 12C30.6274 12 36 17.3726 36 24C36 30.6274 30.6274 36 24 36"
          stroke={`url(#pulseGradient-${gradientId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        <path
          d="M24 17C27.866 17 31 20.134 31 24C31 27.866 27.866 31 24 31"
          stroke={`url(#pulseGradient-${gradientId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.72"
        />

        <path
          d="M24 7C33.3888 7 41 14.6112 41 24C41 33.3888 33.3888 41 24 41"
          stroke={`url(#pulseGradient-${gradientId})`}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.32"
        />

        <path
          d="M14 24H24"
          stroke={`url(#pulseGradient-${gradientId})`}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}