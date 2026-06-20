import AuthShell from "@/components/auth/AuthShell";
import VerifyForm from "@/components/auth/VerifyForm";

export const metadata = {
  title: "Verify email — Pulse",
};

type VerifyPageProps = {
  searchParams: {
    email?: string;
  };
};

export default function VerifyPage({ searchParams }: VerifyPageProps) {
  const email = searchParams.email ?? "";

  return (
    <AuthShell
      eyebrow="Email verification"
      title="Enter your code"
      description="Use the 6-digit verification code for your account to unlock your workspace."
    >
      <VerifyForm email={email} />
    </AuthShell>
  );
}
