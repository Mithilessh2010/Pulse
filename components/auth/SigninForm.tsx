"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthField from "@/components/auth/AuthField";
import AuthMessage from "@/components/auth/AuthMessage";
import SocialAuthOptions from "@/components/auth/SocialAuthOptions";
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

    window.localStorage.setItem("pulse-demo-session", "true");
    setSuccess("Demo session ready. Opening Pulse.");
    setTimeout(() => router.push("/app"), 300);
  }

  return (
    <>
      <SocialAuthOptions
        onUnavailable={(message) => {
          setSuccess("");
          setError(message);
        }}
      />
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
      <p className="mt-6 text-center text-sm text-[#6B7A9F]">
        New to Pulse?{" "}
        <Link href="/signup" className="font-medium text-[#8B7FFF] transition hover:text-white">
          Create an account
        </Link>
      </p>
    </>
  );
}
