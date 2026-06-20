"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthField from "@/components/auth/AuthField";
import AuthMessage from "@/components/auth/AuthMessage";
import SubmitButton from "@/components/auth/SubmitButton";

type VerifyFormProps = {
  email: string;
};

export default function VerifyForm({ email }: VerifyFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const safeEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!safeEmail) {
      setError("Open the verification link from your email, or return to sign in.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: safeEmail, code }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to verify account.");
        return;
      }

      setSuccess("Email verified. Opening your workspace.");
      router.push(data.redirectTo);
      router.refresh();
    } catch {
      setError("Unable to verify account. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      const response = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: safeEmail }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to request a new code.");
        return;
      }

      if (data.redirectTo) {
        router.push(data.redirectTo);
        return;
      }

      setSuccess(data.message || "A new code was generated.");
    } catch {
      setError("Unable to request a new code. Try again in a moment.");
    } finally {
      setResending(false);
    }
  }

  return (
    <>
      <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.035] px-3.5 py-3">
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#4D5E78]">
          Verification email
        </p>
        <p className="mt-1 break-words text-sm text-[#C8D0E8]">{safeEmail || "Missing email"}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="6-digit code"
          name="code"
          value={code}
          placeholder="123456"
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={6}
          onChange={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
        />
        {error ? <AuthMessage type="error">{error}</AuthMessage> : null}
        {success ? <AuthMessage type="success">{success}</AuthMessage> : null}
        <SubmitButton loading={loading} loadingText="Verifying code">
          Verify and continue
        </SubmitButton>
      </form>
      <div className="mt-6 flex flex-col items-center gap-3 text-sm text-[#6B7A9F] sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={resendCode}
          disabled={resending || !safeEmail}
          className="font-medium text-[#8B7FFF] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resending ? "Generating code" : "Request a new code"}
        </button>
        <Link href="/signin" className="font-medium text-[#8B7FFF] transition hover:text-white">
          Back to sign in
        </Link>
      </div>
    </>
  );
}
