type AuthMessageProps = {
  type: "error" | "success";
  children: React.ReactNode;
};

export default function AuthMessage({ type, children }: AuthMessageProps) {
  const styles =
    type === "error"
      ? "border-red-400/20 bg-red-400/10 text-red-200"
      : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";

  return (
    <div className={`rounded-lg border px-3.5 py-3 text-sm leading-5 ${styles}`}>
      {children}
    </div>
  );
}
