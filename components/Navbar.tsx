"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { PulseLogo } from "./PulseLogo";

const navLinks = [
  { label: "Product", href: "/product" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Demo", href: "/demo" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        height: 52,
        background: "rgba(7,9,15,0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <a
        href="/"
        className="flex items-center gap-3 rounded-xl select-none transition duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DFB]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090F]"
        aria-label="Pulse home"
      >
        <PulseLogo />
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
          Pulse
        </span>
      </a>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-7">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="rounded-md px-1.5 py-1 text-[13px] font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DFB]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090F]"
            style={{ color: "#4D5E78" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8D0E8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#4D5E78")}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Actions */}
      <div className="hidden md:flex items-center gap-2">
        <a
          href="/signin"
          className="rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DFB]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090F]"
          style={{ color: "#4D5E78" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C8D0E8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#4D5E78")}
        >
          Sign in
        </a>
        <motion.a
          href="/signup"
          className="rounded-md px-4 py-1.5 text-[13px] font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B92FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090F]"
          style={{ background: "#6D5DFB" }}
          whileHover={{ background: "#7C6EFC", scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          Request access
        </motion.a>
      </div>

      {/* Mobile Burger */}
      <button
        className="flex flex-col gap-1.5 rounded-lg p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DFB]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090F] md:hidden"
        type="button"
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        aria-controls="mobile-navigation"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="w-5 h-0.5 bg-white/40 rounded" />
        <span className="w-5 h-0.5 bg-white/40 rounded" />
        <span className="w-3 h-0.5 bg-white/40 rounded" />
      </button>

      {mobileOpen && (
        <motion.div
          id="mobile-navigation"
          className="absolute top-full left-0 right-0 flex flex-col gap-1 p-3 md:hidden"
          style={{ background: "rgba(7,9,15,0.98)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DFB]/60" style={{ color: "#6B7A9F" }}>
              {link.label}
            </a>
          ))}
          <a
            href="/signin"
            className="rounded-md px-3 py-2 text-center text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DFB]/60"
            style={{ color: "#C8D0E8", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Sign in
          </a>
          <a href="/signup" className="mt-1 rounded-md px-4 py-2.5 text-center text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B92FF]" style={{ background: "#6D5DFB" }}>
            Request access
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
