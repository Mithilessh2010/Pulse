import AuthShell from "@/components/auth/AuthShell";
import SigninForm from "@/components/auth/SigninForm";

export const metadata = {
  title: "Sign in — Pulse",
};

export default function SigninPage() {
  return (
    <AuthShell
      eyebrow="Secure session"
      title="Sign in to Pulse"
      description="Access your workspace dashboard with a verified account session."
    >
      <SigninForm />
    </AuthShell>
  );
}
