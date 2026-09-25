"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PulseLogo } from "@/components/PulseLogo";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0D0C] px-6 py-8 text-white">
      <div className="absolute inset-0 grid-bg opacity-35" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 35% at 22% 20%, rgba(47,125,104,0.08), transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10"
        animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.22, 0.38, 0.22] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/10"
        animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.28, 0.14, 0.28] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col">
        <Link href="/" className="flex w-fit items-center gap-3">
          <PulseLogo />
          <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
            Pulse
          </span>
        </Link>

        <section className="flex flex-1 items-center justify-center py-12">
          <motion.div
            className="w-full max-w-[460px] rounded-2xl border border-white/[0.08] bg-[#111412] p-6 sm:p-8"
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="mb-7">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D5BC7A]">
                {eyebrow}
              </p>
              <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#F4F1EA] sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#737A74]">{description}</p>
            </div>

            {children}

            {footer ? <div className="mt-6 text-center text-sm text-[#737A74]">{footer}</div> : null}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
