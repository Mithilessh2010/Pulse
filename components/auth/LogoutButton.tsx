"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    window.localStorage.removeItem("pulse-demo-session");

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/signin");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 text-[13px] font-medium text-[#9BA8C7] transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Signing out" : "Sign out"}
    </button>
  );
}
