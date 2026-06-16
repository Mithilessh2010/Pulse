"use client";
import React from "react";

type Status = "on-track" | "at-risk" | "available" | "near-capacity" | "pending" | "approved";

const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  "on-track": { label: "On Track", color: "#31D67B", bg: "rgba(49,214,123,0.12)" },
  "at-risk": { label: "At Risk", color: "#FF5C7A", bg: "rgba(255,92,122,0.12)" },
  available: { label: "Available", color: "#00D4FF", bg: "rgba(0,212,255,0.12)" },
  "near-capacity": { label: "Near Capacity", color: "#F8C14A", bg: "rgba(248,193,74,0.12)" },
  pending: { label: "Pending", color: "#F8C14A", bg: "rgba(248,193,74,0.12)" },
  approved: { label: "Approved", color: "#31D67B", bg: "rgba(49,214,123,0.12)" },
};

interface StatusBadgeProps {
  status: Status;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${padding}`}
      style={{ color: config.color, background: config.bg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: config.color }}
      />
      {config.label}
    </span>
  );
}
