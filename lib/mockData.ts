export const workspace = {
  name: "Acme Ops",
  user: "Mithilessh",
  role: "Owner",
};

export const teamMembers = [
  {
    name: "Maya",
    initials: "MY",
    role: "Product Lead",
    load: 87,
    status: "Near Capacity",
    currentTasks: 9,
    completedThisWeek: 7,
    supportNeeded: "Design review coverage",
    confidence: "Medium",
  },
  {
    name: "Alex",
    initials: "AL",
    role: "Designer",
    load: 62,
    status: "On Track",
    currentTasks: 6,
    completedThisWeek: 5,
    supportNeeded: "Client feedback",
    confidence: "High",
  },
  {
    name: "Jordan",
    initials: "JO",
    role: "Engineer",
    load: 34,
    status: "Available",
    currentTasks: 4,
    completedThisWeek: 8,
    supportNeeded: "Ready for sprint work",
    confidence: "High",
  },
  {
    name: "Sam",
    initials: "SM",
    role: "Operations",
    load: 55,
    status: "On Track",
    currentTasks: 5,
    completedThisWeek: 4,
    supportNeeded: "Finance approval",
    confidence: "High",
  },
];

export const projects = [
  {
    name: "Q3 Launch Review",
    progress: 68,
    status: "on-track" as const,
    statusLabel: "On Track",
    owner: "Maya",
    ownerInitials: "MY",
    predictedFinish: "Jul 22",
    budget: "$2,400",
    tasks: 18,
    team: 4,
    daysLeft: 12,
    column: "In Progress",
  },
  {
    name: "Website Redesign",
    progress: 42,
    status: "at-risk" as const,
    statusLabel: "At Risk",
    owner: "Alex",
    ownerInitials: "AL",
    predictedFinish: "Jul 26",
    budget: "$3,200",
    tasks: 24,
    team: 3,
    daysLeft: 5,
    column: "Review",
  },
  {
    name: "Mobile App Launch",
    progress: 74,
    status: "on-track" as const,
    statusLabel: "On Track",
    owner: "Jordan",
    ownerInitials: "JO",
    predictedFinish: "Jul 31",
    budget: "$4,100",
    tasks: 31,
    team: 6,
    daysLeft: 21,
    column: "In Progress",
  },
  {
    name: "Internal Hiring Sprint",
    progress: 31,
    status: "needs-review" as const,
    statusLabel: "Needs Review",
    owner: "Sam",
    ownerInitials: "SM",
    predictedFinish: "Aug 6",
    budget: "$1,200",
    tasks: 12,
    team: 2,
    daysLeft: 28,
    column: "Planning",
  },
  {
    name: "Customer Onboarding Flow",
    progress: 56,
    status: "on-track" as const,
    statusLabel: "On Track",
    owner: "Maya",
    ownerInitials: "MY",
    predictedFinish: "Aug 9",
    budget: "$1,850",
    tasks: 16,
    team: 3,
    daysLeft: 31,
    column: "Review",
  },
  {
    name: "Investor Update Deck",
    progress: 84,
    status: "on-track" as const,
    statusLabel: "On Track",
    owner: "Sam",
    ownerInitials: "SM",
    predictedFinish: "Jul 19",
    budget: "$650",
    tasks: 8,
    team: 2,
    daysLeft: 9,
    column: "Done",
  },
];

export const tasks = Object.assign([
  {
    title: "Finalize Q3 deck",
    owner: "Maya",
    priority: "High",
    due: "Today",
    status: "Due Today",
    project: "Q3 Launch Review",
    proof: "Submitted",
    subtasks: ["Update metrics", "Add final summary", "Attach design proof"],
  },
  {
    title: "Review design specs",
    owner: "Alex",
    priority: "Medium",
    due: "Today",
    status: "Waiting Approval",
    project: "Website Redesign",
    proof: "Needs review",
    subtasks: ["Check mobile states", "Confirm handoff", "Post review note"],
  },
  {
    title: "Approve AWS estimate",
    owner: "Sam",
    priority: "High",
    due: "Today",
    status: "Blocked",
    project: "Mobile App Launch",
    proof: "Estimate attached",
    subtasks: ["Finance review", "Owner approval", "Update budget"],
  },
  {
    title: "Send client update",
    owner: "Maya",
    priority: "Medium",
    due: "Today",
    status: "Due Today",
    project: "Website Redesign",
    proof: "Draft ready",
    subtasks: ["Summarize blockers", "Confirm timeline", "Send update"],
  },
  {
    title: "Record demo walkthrough",
    owner: "Jordan",
    priority: "Low",
    due: "Today",
    status: "Due Today",
    project: "Customer Onboarding Flow",
    proof: "Not submitted",
    subtasks: ["Record video", "Upload link", "Request review"],
  },
  {
    title: "Create onboarding checklist",
    owner: "Jordan",
    priority: "Medium",
    due: "Tomorrow",
    status: "Completed",
    project: "Customer Onboarding Flow",
    proof: "Approved",
    subtasks: ["Draft checklist", "Review steps", "Publish"],
  },
  {
    title: "Review pricing page copy",
    owner: "Sam",
    priority: "Medium",
    due: "Friday",
    status: "My Tasks",
    project: "Investor Update Deck",
    proof: "Not submitted",
    subtasks: ["Review tiers", "Check disclaimers", "Add notes"],
  },
  {
    title: "Upload product screenshots",
    owner: "Alex",
    priority: "Low",
    due: "Friday",
    status: "Waiting Approval",
    project: "Website Redesign",
    proof: "Screenshots attached",
    subtasks: ["Export desktop", "Export mobile", "Attach proof"],
  },
], {
  dueToday: 5,
  overdue: 2,
  items: [
    { title: "Finalize Q3 deck", priority: "high", assignee: "MY" },
    { title: "Review design specs", priority: "medium", assignee: "AL" },
    { title: "Approval for AWS upgrade", priority: "high", assignee: "JO" },
    { title: "Update roadmap doc", priority: "low", assignee: "SM" },
    { title: "Kickoff retrospective", priority: "medium", assignee: "MY" },
  ],
});

export const approvals = [
  {
    title: "Maya submitted proof for Q3 dashboard design.",
    submittedBy: "Maya",
    type: "Task Proof",
    project: "Q3 Launch Review",
    time: "18 min ago",
    summary: "Final dashboard proof includes KPI cards, status states, and executive summary.",
    attachments: ["Figma link", "Screenshot", "Spec file"],
    aiNote: "Submission matches 4 of 5 task requirements. Missing final mobile screenshot.",
  },
  {
    title: "Alex requested approval on Website Redesign.",
    submittedBy: "Alex",
    type: "Task Proof",
    project: "Website Redesign",
    time: "44 min ago",
    summary: "Homepage design pass is ready, but mobile proof is still incomplete.",
    attachments: ["Preview link", "Design notes"],
    aiNote: "Design proof is strong. Waiting on mobile breakpoint evidence.",
  },
  {
    title: "Linear subscription needs expense approval.",
    submittedBy: "Sam",
    type: "Expenses",
    project: "Internal Hiring Sprint",
    time: "1 hr ago",
    summary: "Monthly Linear subscription renewal for operations workflow.",
    attachments: ["Receipt", "Invoice"],
    aiNote: "Expense category and amount match prior month.",
  },
  {
    title: "Client update waiting for review.",
    submittedBy: "Maya",
    type: "Client Updates",
    project: "Website Redesign",
    time: "2 hr ago",
    summary: "Client update explains current blocker and revised approval timeline.",
    attachments: ["Draft update"],
    aiNote: "Message is clear but should include next checkpoint date.",
  },
];

export const expenses = Object.assign([
  { item: "Linear subscription", amount: "$96", category: "Software", owner: "Sam", status: "Pending" },
  { item: "AWS estimate", amount: "$340", category: "Infrastructure", owner: "Alex", status: "Needs Approval" },
  { item: "Client lunch", amount: "$82", category: "Meals", owner: "Maya", status: "Pending" },
  { item: "Figma seats", amount: "$144", category: "Design", owner: "Jordan", status: "Approved" },
], {
  pending: 3,
  spent: 4820,
  budget: 7500,
  items: [
    { label: "AWS Infrastructure", amount: 1240, status: "pending" },
    { label: "Design Tools", amount: 890, status: "approved" },
    { label: "Team Offsite", amount: 2690, status: "pending" },
  ],
});

export const teamWorkload = teamMembers.map((member) => ({
  name: member.name,
  initials: member.initials,
  status:
    member.status === "Near Capacity"
      ? ("near-capacity" as const)
      : member.status === "Available"
        ? ("available" as const)
        : ("on-track" as const),
  load: member.load,
  color: member.status === "Near Capacity" ? "#6D5DFB" : member.status === "Available" ? "#34D399" : "#60A5FA",
}));

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
    title: "AI Project Pacing",
    description: "Real-time pace tracking with risk signals. Know before deadlines slip — not after.",
    accent: "#6D5DFB",
  },
  {
    id: "approvals",
    icon: "CheckSquare",
    title: "Proof-Based Approvals",
    description: "Attach evidence to every approval. No more chasing context or paper trails.",
    accent: "#0EA5E9",
  },
  {
    id: "workload",
    icon: "Users",
    title: "Team Workload Visibility",
    description: "See who is at capacity before you assign. Balance the team with one glance.",
    accent: "#34D399",
  },
  {
    id: "expenses",
    icon: "CreditCard",
    title: "Expense Tracking",
    description: "Submit, approve, and audit expenses inside the same system your projects live in.",
    accent: "#FBBF24",
  },
  {
    id: "standups",
    icon: "Radio",
    title: "Daily Standups",
    description: "Async standups that surface blockers, decisions, and work that needs attention.",
    accent: "#F87171",
  },
  {
    id: "ask",
    icon: "Sparkles",
    title: "Ask Pulse",
    description: "Ask anything about your team in plain English. Get answers, not dashboards.",
    accent: "#6D5DFB",
  },
];

export const blockers = [
  "Design approval delaying Website Redesign",
  "AWS estimate waiting on finance",
  "Client feedback missing for landing page",
];

export const activityFeed = [
  "Maya submitted proof for Q3 dashboard task",
  "Alex requested approval on Website Redesign",
  "Jordan completed onboarding checklist",
  "Sam uploaded receipt for Linear subscription",
];

export const reports = [
  "Weekly Summary",
  "Project Progress Report",
  "Team Capacity Report",
  "Expense Report",
  "Approval Bottleneck Report",
];

export const askPulsePrompts = [
  "What projects are at risk?",
  "Who is overloaded?",
  "What needs approval?",
  "Are we on pace for launch?",
  "Write a weekly leadership update",
  "Summarize blockers",
];

export const askPulseResponses: Record<string, string> = {
  "What projects are at risk?":
    "Website Redesign is the highest-risk project. It is 3 days behind pace because design approval is still pending.",
  "Who is overloaded?":
    "Maya is near capacity at 87%. Consider moving one review task to Jordan, who is currently available.",
  "What needs approval?":
    "There are 3 task approvals, 2 expense approvals, and 1 client update waiting. Maya's Q3 dashboard proof is the highest priority.",
  "Are we on pace for launch?":
    "Q3 Launch Review is on track at 68%, but Website Redesign is creating schedule risk for the launch narrative.",
  "Write a weekly leadership update":
    "This week, the team completed 24 tasks, moved Q3 Launch to 68%, and resolved 4 blockers. Website Redesign remains at risk due to delayed design approval.",
  "Summarize blockers":
    "The main blockers are design approval for Website Redesign, finance review for AWS estimate, and missing client feedback for the landing page.",
};

export const integrations = [
  "Google",
  "GitHub",
  "Microsoft",
  "Slack",
  "Discord",
  "Notion",
  "Jira",
  "Asana",
  "QuickBooks",
  "Xero",
];
