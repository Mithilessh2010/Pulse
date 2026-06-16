export const projects = [
  { name: "Q3 Launch Review", progress: 68, status: "on-track" as const, team: 4, daysLeft: 12 },
  { name: "Website Redesign", progress: 42, status: "at-risk" as const, team: 3, daysLeft: 5 },
  { name: "Mobile App Launch", progress: 74, status: "on-track" as const, team: 6, daysLeft: 21 },
];

export const teamWorkload = [
  { name: "Maya", initials: "MY", status: "near-capacity" as const, load: 87, color: "#6D5DFB" },
  { name: "Alex", initials: "AL", status: "on-track" as const, load: 62, color: "#60A5FA" },
  { name: "Jordan", initials: "JO", status: "available" as const, load: 34, color: "#34D399" },
  { name: "Sam", initials: "SM", status: "on-track" as const, load: 55, color: "#FBBF24" },
];

export const expenses = {
  pending: 3,
  spent: 4820,
  budget: 7500,
  items: [
    { label: "AWS Infrastructure", amount: 1240, status: "pending" },
    { label: "Design Tools", amount: 890, status: "approved" },
    { label: "Team Offsite", amount: 2690, status: "pending" },
  ],
};

export const tasks = {
  dueToday: 5,
  overdue: 2,
  items: [
    { title: "Finalize Q3 deck", priority: "high", assignee: "MY" },
    { title: "Review design specs", priority: "medium", assignee: "AL" },
    { title: "Approval for AWS upgrade", priority: "high", assignee: "JO" },
    { title: "Update roadmap doc", priority: "low", assignee: "SM" },
    { title: "Kickoff retrospective", priority: "medium", assignee: "MY" },
  ],
};

export const toolsReplaced = [
  { name: "Slack", color: "#4A154B", icon: "SL", category: "Communication" },
  { name: "Jira", color: "#0052CC", icon: "JI", category: "Project Tracking" },
  { name: "Asana", color: "#F06A6A", icon: "AS", category: "Task Management" },
  { name: "Notion", color: "#FFFFFF", icon: "NO", category: "Docs & Wiki" },
  { name: "Expensify", color: "#01C569", icon: "EX", category: "Expenses" },
  { name: "Toggl", color: "#E57CD8", icon: "TG", category: "Time Tracking" },
  { name: "Geekbot", color: "#7C3AED", icon: "GB", category: "Standups" },
  { name: "Lattice", color: "#F59E0B", icon: "LA", category: "Performance" },
];

export const features = [
  {
    id: "pacing",
    icon: "TrendingUp",
    title: "Project pacing",
    description:
      "Real-time pace tracking with risk signals. Know before deadlines slip — not after.",
    accent: "#6D5DFB",
  },
  {
    id: "approvals",
    icon: "CheckSquare",
    title: "Approval workflows",
    description:
      "Attach evidence to every approval. No more chasing context or paper trails.",
    accent: "#0EA5E9",
  },
  {
    id: "workload",
    icon: "Users",
    title: "Workload visibility",
    description:
      "See who's at capacity before you assign. Balance the team with one glance.",
    accent: "#34D399",
  },
  {
    id: "expenses",
    icon: "CreditCard",
    title: "Expense tracking",
    description:
      "Submit, approve, and audit expenses inside the same system your projects live in.",
    accent: "#FBBF24",
  },
  {
    id: "standups",
    icon: "Radio",
    title: "Daily standups",
    description:
      "Async standups that actually surface blockers — not just status theater.",
    accent: "#F87171",
  },
  {
    id: "ask",
    icon: "Sparkles",
    title: "Natural language search",
    description:
      "Ask anything about your team in plain English. Get answers, not dashboards.",
    accent: "#6D5DFB",
  },
];

export const chatHistory = [
  { role: "user" as const, text: "Which projects are at risk?" },
  {
    role: "pulse" as const,
    text: "Website Redesign is behind pace. Design approval is blocked — 5 days left, 3 days behind.",
  },
];
