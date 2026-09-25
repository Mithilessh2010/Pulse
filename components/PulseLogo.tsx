export function PulseLogo({ compact = false }: { compact?: boolean }) {
  const size = compact ? "h-8 w-8" : "h-9 w-9";

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-[#141816]`}
      aria-label="Pulse"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12h4l2.15-4.25L13 16l2.15-4H20" stroke="#D5BC7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.4 5.7a8 8 0 0 1 0 12.6" stroke="#4B9B7C" strokeWidth="1.7" strokeLinecap="round" opacity=".95" />
      </svg>
    </div>
  );
}
