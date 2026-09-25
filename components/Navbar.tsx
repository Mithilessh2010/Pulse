"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { PulseLogo } from "./PulseLogo";

const navLinks = [
  { label: "Product", href: "/product" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Security", href: "/security" },
  { label: "Build log", href: "/devlog" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#0B0D0C]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1360px] items-center justify-between px-5 md:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <PulseLogo compact />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#F4F1EA]">Pulse</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-[13px] font-medium text-[#858B87] transition hover:text-[#F4F1EA]">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a href="/demo" className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#AEB4AF] transition hover:bg-white/[0.05] hover:text-white">Live demo</a>
          <a href="/signin" className="rounded-lg border border-white/10 px-3.5 py-2 text-[13px] font-medium text-[#D7D9D4] transition hover:border-white/20">Sign in</a>
          <a href="/signup" className="rounded-lg bg-[#2F7D68] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#378B74]">Start free</a>
        </div>

        <button type="button" aria-label="Toggle navigation" onClick={() => setMobileOpen((value) => !value)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#AEB4AF] md:hidden">
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/[0.07] bg-[#0B0D0C] px-5 py-4 md:hidden">
          <div className="grid gap-1">
            {navLinks.map((link) => <a key={link.label} href={link.href} className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#AEB4AF] hover:bg-white/[0.05] hover:text-white">{link.label}</a>)}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a href="/demo" className="rounded-lg border border-white/10 px-3 py-2.5 text-center text-sm font-medium text-[#D7D9D4]">Live demo</a>
            <a href="/signup" className="rounded-lg bg-[#2F7D68] px-3 py-2.5 text-center text-sm font-semibold text-white">Start free</a>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
