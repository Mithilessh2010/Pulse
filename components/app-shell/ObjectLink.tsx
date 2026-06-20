"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { hrefForObject, type ObjectLinkType } from "@/lib/routes";

type ObjectLinkProps = {
  type: ObjectLinkType;
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  variant?: "inline" | "card" | "badge" | "row";
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  children?: ReactNode;
};

const variants = {
  inline:
    "inline-flex items-center gap-1 rounded-md text-[var(--text-primary)] underline-offset-4 transition hover:text-[var(--accent-2)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45",
  badge:
    "inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--card-bg)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent-2)]/45 hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45",
  row:
    "flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-3 text-left text-sm text-[var(--text-secondary)] transition hover:border-[var(--accent)]/45 hover:bg-[var(--card-raised-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45",
  card:
    "block rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--accent)]/45 hover:bg-[var(--card-raised-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45",
};

export function ObjectLink({ type, id, label, href, icon, variant = "inline", className = "", onClick, children }: ObjectLinkProps) {
  return (
    <Link href={href ?? hrefForObject(type, id)} onClick={onClick} className={`${variants[variant]} ${className}`}>
      {icon}
      {children ?? label}
      {variant === "row" || variant === "card" ? <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" /> : null}
    </Link>
  );
}

type ClickableCardProps = {
  href: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
};

export function ClickableCard({ href, title, subtitle, children, className = "" }: ClickableCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }}>
      <Link
        href={href}
        className={`block rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 transition hover:border-[var(--accent)]/45 hover:bg-[var(--card-raised-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
            {subtitle ? <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{subtitle}</p> : null}
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        </div>
        {children ? <div className="mt-3">{children}</div> : null}
      </Link>
    </motion.div>
  );
}
