"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { PulseLogo } from "./PulseLogo";

const navLinks = ["Product", "Features", "Pricing", "Demo"];

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
      <div className="flex items-center gap-3 select-none transition duration-200 hover:opacity-90">
        <PulseLogo />
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
          Pulse
        </span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-7">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[13px] font-medium transition-colors duration-150"
            style={{ color: "#4D5E78" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8D0E8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#4D5E78")}
          >
            {link}
          </a>
        ))}
      </div>

      {/* Actions */}
      <div className="hidden md:flex items-center gap-2">
        <a
          href="#"
          className="text-[13px] font-medium px-3.5 py-1.5 rounded-md transition-colors"
          style={{ color: "#4D5E78" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C8D0E8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#4D5E78")}
        >
          Sign in
        </a>
        <motion.a
          href="#"
          className="text-[13px] font-semibold px-4 py-1.5 rounded-md text-white"
          style={{ background: "#6D5DFB" }}
          whileHover={{ background: "#7C6EFC", scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          Request access
        </motion.a>
      </div>

      {/* Mobile Burger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="w-5 h-0.5 bg-white/40 rounded" />
        <span className="w-5 h-0.5 bg-white/40 rounded" />
        <span className="w-3 h-0.5 bg-white/40 rounded" />
      </button>

      {mobileOpen && (
        <motion.div
          className="absolute top-full left-0 right-0 flex flex-col gap-1 p-3 md:hidden"
          style={{ background: "rgba(7,9,15,0.98)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {navLinks.map((link) => (
            <a key={link} href="#" className="text-sm font-medium py-2 px-3 rounded-md" style={{ color: "#6B7A9F" }}>
              {link}
            </a>
          ))}
          <a href="#" className="text-sm font-semibold px-4 py-2.5 rounded-md text-white text-center mt-1" style={{ background: "#6D5DFB" }}>
            Request access
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
