"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthField from "@/components/auth/AuthField";
import AuthMessage from "@/components/auth/AuthMessage";
import SubmitButton from "@/components/auth/SubmitButton";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    if (!name || !email || !password || !confirmPassword || !workspaceName) {
      setLoading(false);
      setError("Please complete every field.");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword, workspaceName }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Unable to create account.");
        return;
      }

      setSuccess("Account created. Opening verification.");
      router.push(typeof data.redirectTo === "string" ? data.redirectTo : `/verify?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Unable to create account. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Full name"
          name="name"
          value={name}
          placeholder="Maya Chen"
          autoComplete="name"
          onChange={setName}
        />
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
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          onChange={setPassword}
          rightElement={
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((visible) => !visible)}
              className="rounded-md p-1.5 text-[#6B7A9F] transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#6D5DFB]/40"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <AuthField
          label="Confirm password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          placeholder="Retype your password"
          autoComplete="new-password"
          onChange={setConfirmPassword}
          rightElement={
            <button
              type="button"
              aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
              title={showConfirmPassword ? "Hide password" : "Show password"}
              onClick={() => setShowConfirmPassword((visible) => !visible)}
              className="rounded-md p-1.5 text-[#6B7A9F] transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#6D5DFB]/40"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <AuthField
          label="Workspace name"
          name="workspaceName"
          value={workspaceName}
          placeholder="Northstar Ops"
          autoComplete="organization"
          onChange={setWorkspaceName}
        />
        {error ? <AuthMessage type="error">{error}</AuthMessage> : null}
        {success ? <AuthMessage type="success">{success}</AuthMessage> : null}
        <SubmitButton loading={loading} loadingText="Creating workspace">
          Create account
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-[#6B7A9F]">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-[#8B7FFF] transition hover:text-white">
          Sign in
        </Link>
      </p>
    </>
  );
}
