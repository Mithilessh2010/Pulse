"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthField from "@/components/auth/AuthField";
import AuthMessage from "@/components/auth/AuthMessage";
import SubmitButton from "@/components/auth/SubmitButton";

export default function SigninForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      setError("Enter your email and password.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Unable to sign in.");
        return;
      }

      setSuccess(data.needsVerification ? "Verification required. Opening code screen." : "Signed in. Opening Pulse.");
      router.push(typeof data.redirectTo === "string" ? data.redirectTo : "/app");
    } catch {
      setError("Unable to sign in. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/temp-login", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Demo login is unavailable.");
        return;
      }

      setSuccess("Demo session ready. Opening Pulse.");
      router.push(typeof data.redirectTo === "string" ? data.redirectTo : "/app");
    } catch {
      setError("Demo login is unavailable. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Email"
          name="email"
          type="email"
          value={email}
          placeholder="maya@company.com"
          autoComplete="email"
          onChange={setEmail}
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          value={password}
          placeholder="Your password"
          autoComplete="current-password"
          onChange={setPassword}
        />
        {error ? <AuthMessage type="error">{error}</AuthMessage> : null}
        {success ? <AuthMessage type="success">{success}</AuthMessage> : null}
        <SubmitButton loading={loading} loadingText="Checking credentials">
          Sign in
        </SubmitButton>
      </form>
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={loading}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#C8D0E8] transition hover:border-[#6D5DFB]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        Try the demo
      </button>
      <p className="mt-6 text-center text-sm text-[#6B7A9F]">
        New to Pulse?{" "}
        <Link href="/signup" className="font-medium text-[#8B7FFF] transition hover:text-white">
          Create an account
        </Link>
      </p>
    </>
  );
}
