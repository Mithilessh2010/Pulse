import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Create account — Pulse",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Workspace access"
      title="Create your Pulse account"
      description="Start with a verified owner account and a private workspace for your team command center."
    >
      <SignupForm />
    </AuthShell>
  );
}
