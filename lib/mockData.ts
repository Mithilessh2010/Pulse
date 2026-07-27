export type RiskLevel = "Low" | "Medium" | "High";
export type ProjectHealth = "On Track" | "At Risk" | "Blocked" | "Needs Review" | "Completed";
export type Priority = "Low" | "Medium" | "High";
export type ApprovalStatus = "Waiting" | "Approved" | "Changes Requested";
export type ExpenseStatus = "Pending" | "Needs Approval" | "Approved" | "Rejected";

export const workspace = {
  name: "Acme Ops",
  user: "Mithilessh",
  role: "Owner",
  url: "acme-ops.pulse.app",
  teamSize: 4,
  industry: "B2B SaaS",
};

export const workspaceSummary = {
  companyHealth: 82,
  healthStatus: "Stable",
  weeklyTrend: "+6%",
  tasksDueToday: 5,
  overdueTasks: 2,
  approvalsWaiting: 6,
  highPriorityApprovals: 2,
  budgetUsedPercent: 64,
  budgetUsed: 4820,
  budgetTotal: 7500,
  activeBlockers: 4,
  highImpactBlockers: 2,
  highestExpenseCategory: "Software",
};

export type TeamMember = {
  id: string;
  name: string;
  shortName: string;
  role: string;
  initials: string;
  workloadCapacity: number;
  capacity: number;
  load: number;
  focusLoad: "High" | "Balanced" | "Light";
  status: "Available" | "Balanced" | "Near Capacity" | "Needs Support" | "Limited Availability" | "On Track";
  supportNeeded: boolean;
  availability: "Limited" | "Available" | "Open";
  deliveryConfidence: "Low" | "Medium" | "High";
  confidence: "Low" | "Medium" | "High";
  currentTasks: number;
  assignedTasks: number;
  blockedTasks: number;
  completedThisWeek: number;
  suggestedAction: string;
};

export const teamMembers: TeamMember[] = [
  {
    id: "maya",
    name: "Maya Chen",
    shortName: "Maya",
    role: "Product Lead",
    initials: "MC",
    workloadCapacity: 87,
    capacity: 87,
    load: 87,
    focusLoad: "High",
    status: "Near Capacity",
    supportNeeded: true,
    availability: "Limited",
    deliveryConfidence: "Medium",
    confidence: "Medium",
    currentTasks: 9,
    assignedTasks: 9,
    blockedTasks: 2,
    completedThisWeek: 7,
    suggestedAction: "Move one task from Maya to Jordan.",
  },
  {
    id: "alex",
    name: "Alex Rivera",
    shortName: "Alex",
    role: "Designer",
    initials: "AR",
    workloadCapacity: 62,
    capacity: 62,
    load: 62,
    focusLoad: "Balanced",
    status: "Balanced",
    supportNeeded: false,
    availability: "Available",
    deliveryConfidence: "High",
    confidence: "High",
    currentTasks: 6,
    assignedTasks: 6,
    blockedTasks: 1,
    completedThisWeek: 5,
    suggestedAction: "Ask Alex whether design approval is blocked.",
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    shortName: "Jordan",
    role: "Engineer",
    initials: "JL",
    workloadCapacity: 34,
    capacity: 34,
    load: 34,
    focusLoad: "Light",
    status: "Available",
    supportNeeded: false,
    availability: "Open",
    deliveryConfidence: "High",
    confidence: "High",
    currentTasks: 3,
    assignedTasks: 3,
    blockedTasks: 0,
    completedThisWeek: 8,
    suggestedAction: "Jordan has capacity to take on one additional task.",
  },
  {
    id: "sam",
    name: "Sam Patel",
    shortName: "Sam",
    role: "Operations",
    initials: "SP",
    workloadCapacity: 55,
    capacity: 55,
    load: 55,
    focusLoad: "Balanced",
    status: "Balanced",
    supportNeeded: false,
    availability: "Available",
    deliveryConfidence: "Medium",
    confidence: "Medium",
    currentTasks: 5,
    assignedTasks: 5,
    blockedTasks: 1,
    completedThisWeek: 4,
    suggestedAction: "Sam needs finance numbers before Investor Update can continue.",
  },
];

export type Project = {
  id: string;
  name: string;
  progress: number;
  health: ProjectHealth;
  status: "on-track" | "at-risk" | "blocked" | "needs-review" | "completed";
  statusLabel: ProjectHealth;
  deadlineRisk: RiskLevel;
  budgetRisk: RiskLevel;
  owner: string;
  ownerInitials: string;
  dueDate: string;
  due: string;
  predictedFinish: string;
  budget: number;
  budgetLabel: string;
  spend: number;
  spendLabel: string;
  tasksTotal: number;
  tasks: number;
  tasksCompleted: number;
  completedTasks: number;
  blockers: number;
  blockersCount: number;
  mainBlocker?: string;
  team: number;
  daysLeft: number;
  column: "Planning" | "In Progress" | "Review" | "Done";
  insight: string;
};

export const projects: Project[] = [
  {
    id: "q3-launch-review",
    name: "Q3 Launch Review",
    progress: 68,
    health: "On Track",
    status: "on-track",
    statusLabel: "On Track",
    deadlineRisk: "Low",
    budgetRisk: "Medium",
    owner: "Maya Chen",
    ownerInitials: "MC",
    dueDate: "Jul 24",
    due: "Jul 24",
    predictedFinish: "Jul 22",
    budget: 7500,
    budgetLabel: "$7,500",
    spend: 4820,
    spendLabel: "$4,820",
    tasksTotal: 24,
    tasks: 24,
    tasksCompleted: 16,
    completedTasks: 16,
    blockers: 0,
    blockersCount: 0,
    team: 4,
    daysLeft: 12,
    column: "In Progress",
    insight: "Launch review is pacing ahead, but budget needs a tighter review before final approval.",
  },
  {
    id: "website-redesign",
    name: "Website Redesign",
    progress: 42,
    health: "At Risk",
    status: "at-risk",
    statusLabel: "At Risk",
    deadlineRisk: "High",
    budgetRisk: "Low",
    owner: "Alex Rivera",
    ownerInitials: "AR",
    dueDate: "Jul 18",
    due: "Jul 18",
    predictedFinish: "Jul 26",
    budget: 5000,
    budgetLabel: "$5,000",
    spend: 2100,
    spendLabel: "$2,100",
    tasksTotal: 19,
    tasks: 19,
    tasksCompleted: 8,
    completedTasks: 8,
    blockers: 1,
    blockersCount: 1,
    mainBlocker: "Design approval pending",
    team: 3,
    daysLeft: 5,
    column: "Review",
    insight: "Design approval is the critical path. Moving review today could recover two days.",
  },
  {
    id: "mobile-app-launch",
    name: "Mobile App Launch",
    progress: 74,
    health: "On Track",
    status: "on-track",
    statusLabel: "On Track",
    deadlineRisk: "Low",
    budgetRisk: "Low",
    owner: "Jordan Lee",
    ownerInitials: "JL",
    dueDate: "Aug 2",
    due: "Aug 2",
    predictedFinish: "Jul 31",
    budget: 12000,
    budgetLabel: "$12,000",
    spend: 6900,
    spendLabel: "$6,900",
    tasksTotal: 31,
    tasks: 31,
    tasksCompleted: 23,
    completedTasks: 23,
    blockers: 0,
    blockersCount: 0,
    team: 6,
    daysLeft: 21,
    column: "In Progress",
    insight: "Engineering is pacing well and has room for one extra task without creating overload risk.",
  },
  {
    id: "internal-hiring-sprint",
    name: "Internal Hiring Sprint",
    progress: 31,
    health: "Needs Review",
    status: "needs-review",
    statusLabel: "Needs Review",
    deadlineRisk: "Medium",
    budgetRisk: "Low",
    owner: "Sam Patel",
    ownerInitials: "SP",
    dueDate: "Aug 8",
    due: "Aug 8",
    predictedFinish: "Aug 10",
    budget: 3000,
    budgetLabel: "$3,000",
    spend: 900,
    spendLabel: "$900",
    tasksTotal: 13,
    tasks: 13,
    tasksCompleted: 4,
    completedTasks: 4,
    blockers: 1,
    blockersCount: 1,
    team: 2,
    daysLeft: 28,
    column: "Planning",
    insight: "Candidate review volume is lower than planned. Revisit sourcing goals by Friday.",
  },
  {
    id: "customer-onboarding-flow",
    name: "Customer Onboarding Flow",
    progress: 56,
    health: "On Track",
    status: "on-track",
    statusLabel: "On Track",
    deadlineRisk: "Medium",
    budgetRisk: "Low",
    owner: "Maya Chen",
    ownerInitials: "MC",
    dueDate: "Aug 14",
    due: "Aug 14",
    predictedFinish: "Aug 12",
    budget: 4000,
    budgetLabel: "$4,000",
    spend: 1700,
    spendLabel: "$1,700",
    tasksTotal: 16,
    tasks: 16,
    tasksCompleted: 9,
    completedTasks: 9,
    blockers: 0,
    blockersCount: 0,
    team: 3,
    daysLeft: 31,
    column: "Review",
    insight: "Onboarding can stay on track if the product walkthrough is approved this week.",
  },
  {
    id: "investor-update-deck",
    name: "Investor Update Deck",
    progress: 22,
    health: "Blocked",
    status: "blocked",
    statusLabel: "Blocked",
    deadlineRisk: "High",
    budgetRisk: "Low",
    owner: "Sam Patel",
    ownerInitials: "SP",
    dueDate: "Jul 30",
    due: "Jul 30",
    predictedFinish: "Unknown",
    budget: 1000,
    budgetLabel: "$1,000",
    spend: 200,
    spendLabel: "$200",
    tasksTotal: 9,
    tasks: 9,
    tasksCompleted: 2,
    completedTasks: 2,
    blockers: 1,
    blockersCount: 1,
    mainBlocker: "Waiting for finance numbers",
    team: 2,
    daysLeft: 9,
    column: "Planning",
    insight: "Finance numbers are blocking narrative and chart finalization.",
  },
];

export type Task = {
  id: string;
  title: string;
  project: string;
  owner: string;
  priority: Priority;
  dueDate: string;
  due: string;
  status: "Due Today" | "Blocked" | "Waiting Approval" | "Completed" | "My Tasks" | "In Progress";
  proofRequired: boolean;
  proofStatus: "Missing" | "Draft" | "Submitted" | "Waiting" | "Approved";
  proof: string;
  blocked: boolean;
  subtasks: string[];
  commentsCount: number;
  comments: number;
  aiReview: string;
};

const taskRows: Task[] = [
  ["finalize-q3-deck", "Finalize Q3 deck", "Q3 Launch Review", "Maya", "High", "Today 2:00 PM", "Due Today", true, "Submitted", false, 6],
  ["review-design-specs", "Review design specs", "Website Redesign", "Alex", "Medium", "Today 4:30 PM", "Waiting Approval", true, "Waiting", true, 4],
  ["approve-aws-estimate", "Approve AWS estimate", "Mobile App Launch", "Sam", "High", "Today 5:00 PM", "Blocked", true, "Submitted", true, 3],
  ["send-client-update", "Send client update", "Website Redesign", "Maya", "Medium", "Today 5:30 PM", "Due Today", false, "Draft", false, 2],
  ["record-product-walkthrough", "Record product walkthrough", "Customer Onboarding Flow", "Jordan", "Low", "Today 6:00 PM", "Due Today", true, "Missing", false, 1],
  ["create-onboarding-checklist", "Create onboarding checklist", "Customer Onboarding Flow", "Jordan", "Medium", "Tomorrow", "Completed", true, "Approved", false, 5],
  ["review-pricing-copy", "Review pricing page copy", "Investor Update Deck", "Sam", "Medium", "Friday", "My Tasks", false, "Draft", false, 2],
  ["upload-product-screenshots", "Upload product screenshots", "Website Redesign", "Alex", "Low", "Friday", "Waiting Approval", true, "Submitted", false, 3],
  ["validate-mobile-dashboard", "Validate mobile dashboard layout", "Website Redesign", "Jordan", "High", "Tomorrow", "In Progress", true, "Submitted", false, 4],
  ["draft-investor-metrics", "Draft investor metrics slide", "Investor Update Deck", "Sam", "High", "Jul 22", "Blocked", false, "Draft", true, 5],
  ["prepare-launch-notes", "Prepare feature launch notes", "Q3 Launch Review", "Maya", "Medium", "Jul 23", "In Progress", false, "Draft", false, 2],
  ["review-expense-export", "Review expense export format", "Internal Hiring Sprint", "Sam", "Low", "Jul 24", "Waiting Approval", true, "Waiting", false, 1],
].map(([id, title, project, owner, priority, dueDate, status, proofRequired, proofStatus, blocked, commentsCount]) => ({
  id: id as string,
  title: title as string,
  project: project as string,
  owner: owner as string,
  priority: priority as Priority,
  dueDate: dueDate as string,
  due: dueDate as string,
  status: status as Task["status"],
  proofRequired: proofRequired as boolean,
  proofStatus: proofStatus as Task["proofStatus"],
  proof: proofStatus as string,
  blocked: blocked as boolean,
  commentsCount: commentsCount as number,
  comments: commentsCount as number,
  subtasks: ["Review requirements", "Attach work proof", "Notify owner"],
  aiReview: blocked ? "This task is blocked and should be escalated before the next planning review." : "Task context is clear and ready for owner follow-up.",
}));

export const tasks = Object.assign(taskRows, {
  dueToday: 5,
  overdue: 2,
  items: taskRows.slice(0, 5).map((task) => ({ title: task.title, priority: task.priority.toLowerCase(), assignee: task.owner.slice(0, 2).toUpperCase() })),
});

export type Approval = {
  id: string;
  type: "Task Proof" | "Expenses" | "Client Updates" | "Design Approval" | "Report Approval";
  title: string;
  submittedBy: string;
  project: string;
  submittedAt: string;
  time: string;
  priority: Priority;
  summary: string;
  attachments: string[];
  aiReviewNote: string;
  aiNote: string;
  status: ApprovalStatus;
  auditTrail: string[];
};

export const approvals: Approval[] = [
  ["q3-dashboard-proof", "Task Proof", "Maya submitted proof for Q3 dashboard design.", "Maya", "Q3 Launch Review", "18 min ago", "High", "Submission matches 4 of 5 task requirements. Missing final mobile screenshot."],
  ["website-redesign-proof", "Task Proof", "Alex requested approval on Website Redesign.", "Alex", "Website Redesign", "44 min ago", "High", "Design proof is strong. Waiting on mobile breakpoint evidence."],
  ["linear-subscription", "Expenses", "Linear subscription needs expense approval.", "Sam", "Internal Hiring Sprint", "1 hr ago", "Medium", "Expense category and amount match prior month."],
  ["client-update", "Client Updates", "Client update waiting for review.", "Maya", "Website Redesign", "2 hr ago", "Medium", "Message is clear but should include next checkpoint date."],
  ["aws-estimate", "Expenses", "AWS estimate requires finance review.", "Jordan", "Mobile App Launch", "1 day ago", "High", "Cost is within expected range but needs finance confirmation."],
  ["design-approval", "Design Approval", "Design approval blocking Website Redesign.", "Alex", "Website Redesign", "1 day ago", "High", "Approval is the critical path for Website Redesign recovery."],
  ["weekly-report", "Report Approval", "Weekly leadership update ready for review.", "Maya", "Q3 Launch Review", "2 days ago", "Medium", "Report is clear and should call out budget risk."],
  ["landing-copy", "Client Updates", "Landing page copy ready for client approval.", "Alex", "Website Redesign", "2 days ago", "Low", "Tone is consistent. Client feedback is the remaining dependency."],
].map(([id, type, title, submittedBy, project, submittedAt, priority, aiReviewNote]) => ({
  id: id as string,
  type: type as Approval["type"],
  title: title as string,
  submittedBy: submittedBy as string,
  project: project as string,
  submittedAt: submittedAt as string,
  time: submittedAt as string,
  priority: priority as Priority,
  summary: `${submittedBy} submitted context for ${project} with proof, notes, and review history attached.`,
  attachments: ["Proof link", "Screenshot", "Notes"],
  aiReviewNote: aiReviewNote as string,
  aiNote: aiReviewNote as string,
  status: "Waiting",
  auditTrail: ["Submitted", "AI review complete", "Owner notified"],
}));

export type Expense = {
  id: string;
  item: string;
  vendor: string;
  amount: string;
  amountValue: number;
  category: string;
  owner: string;
  submittedBy: string;
  project: string;
  status: ExpenseStatus;
  date: string;
  receiptStatus: string;
  aiCategorySuggestion: string;
};

const expenseRows: Expense[] = [
  ["linear-subscription-expense", "Linear subscription", "Linear", "$96", 96, "Software", "Sam", "Internal Hiring Sprint", "Pending"],
  ["aws-estimate-expense", "AWS estimate", "AWS", "$340", 340, "Infrastructure", "Alex", "Mobile App Launch", "Needs Approval"],
  ["client-lunch-expense", "Client lunch", "Aster Hall", "$82", 82, "Meals", "Maya", "Q3 Launch Review", "Pending"],
  ["figma-seats-expense", "Figma seats", "Figma", "$144", 144, "Design", "Jordan", "Website Redesign", "Approved"],
  ["vercel-pro-expense", "Vercel Pro", "Vercel", "$240", 240, "Hosting", "Jordan", "Mobile App Launch", "Approved"],
  ["domain-renewal-expense", "Domain renewal", "Namecheap", "$18", 18, "Operations", "Sam", "Investor Update Deck", "Pending"],
  ["notion-export-expense", "Notion export", "Notion", "$60", 60, "Tools", "Maya", "Customer Onboarding Flow", "Rejected"],
  ["stock-assets-expense", "Stock assets", "Supply Family", "$45", 45, "Design", "Alex", "Website Redesign", "Pending"],
].map(([id, item, vendor, amount, amountValue, category, submittedBy, project, status], index) => ({
  id: id as string,
  item: item as string,
  vendor: vendor as string,
  amount: amount as string,
  amountValue: amountValue as number,
  category: category as string,
  owner: submittedBy as string,
  submittedBy: submittedBy as string,
  project: project as string,
  status: status as ExpenseStatus,
  date: `Jun ${14 - index}`,
  receiptStatus: status === "Rejected" ? "Needs replacement" : "Uploaded",
  aiCategorySuggestion: category as string,
}));

export const expenses = Object.assign(expenseRows, {
  pending: 3,
  spent: 4820,
  budget: 7500,
  items: expenseRows.slice(0, 4).map((expense) => ({ label: expense.item, amount: expense.amountValue, status: expense.status.toLowerCase() })),
});

export type Blocker = {
  id: string;
  title: string;
  owner: string;
  project: string;
  impact: string;
  suggestedNextAction: string;
  age: string;
};

export const blockers: Blocker[] = [
  { id: "design-approval", title: "Design approval delaying Website Redesign", owner: "Alex", project: "Website Redesign", impact: "Predicted finish slipped to Jul 26.", suggestedNextAction: "Schedule a 20-minute decision review today.", age: "3 days" },
  { id: "aws-finance", title: "AWS estimate waiting on finance", owner: "Sam", project: "Mobile App Launch", impact: "Mobile launch budget cannot be finalized.", suggestedNextAction: "Ask finance for approval or a cap by 5 PM.", age: "1 day" },
  { id: "client-feedback", title: "Client feedback missing for landing page", owner: "Maya", project: "Website Redesign", impact: "Website copy cannot move to final review.", suggestedNextAction: "Send the pending approval summary with deadline options.", age: "2 days" },
  { id: "finance-numbers", title: "Finance numbers blocking Investor Update Deck", owner: "Sam", project: "Investor Update Deck", impact: "Investor update charts cannot be finalized.", suggestedNextAction: "Escalate revenue and burn figures as today-only dependency.", age: "4 days" },
];

export const activityFeed = [
  "Maya submitted proof for Q3 dashboard task",
  "Alex requested approval on Website Redesign",
  "Jordan completed onboarding checklist",
  "Sam uploaded receipt for Linear subscription",
  "Finance was tagged on the AWS estimate",
  "Client update draft was added to Website Redesign",
  "Investor Update Deck moved to Blocked",
  "Website Redesign deadline risk changed to High",
  "Jordan finished mobile onboarding QA",
  "Weekly leadership report was generated",
];

export const reports = ["Weekly Summary", "Project Progress Report", "Team Capacity Report", "Expense Report", "Approval Bottleneck Report"];

export const askPulsePrompts = [
  "What projects are at risk?",
  "Who needs support this week?",
  "What needs approval?",
  "Are we on pace for Q3 Launch?",
  "Write a weekly leadership update",
  "Summarize blockers",
  "What can I reassign to reduce workload?",
  "Which expenses need attention?",
  "What changed since last week?",
];

export const askPulseExamples = askPulsePrompts;

export const askPulseResponses: Record<string, string> = {
  "What projects are at risk?": "Website Redesign and Investor Update Deck need attention. Website Redesign is 3 days behind pace because design approval is pending. Investor Update Deck is blocked by missing finance numbers.",
  "What is at risk?": "Website Redesign and Investor Update Deck need attention. Website Redesign is behind pace because design approval is pending, and Investor Update Deck is blocked by finance numbers.",
  "Who needs support this week?": "Maya appears near capacity at 87% workload with 9 active tasks and 2 blocked tasks. Jordan has available capacity at 34%, so one task could be reassigned.",
  "Who needs support?": "Maya appears near capacity at 87% workload with 9 active tasks and 2 blocked tasks. Jordan has available capacity at 34%, so one task could be reassigned.",
  "Who is overloaded?": "Maya is near capacity at 87%. Pulse recommends moving one review task to Jordan, who has open capacity.",
  "What needs approval?": "There are 6 approvals waiting: 3 task approvals, 2 expense approvals, and 1 client update. The highest priority item is Maya's Q3 dashboard proof.",
  "Are we on pace for Q3 Launch?": "Q3 Launch Review is on track at 68% with a predicted finish of Jul 22, two days before the Jul 24 due date. Budget risk is medium and should be watched.",
  "Are we on pace for launch?": "Q3 Launch Review is on track, but Website Redesign creates launch narrative risk unless design approval is resolved today.",
  "Write a weekly leadership update": "This week, the team completed 24 tasks, moved Q3 Launch to 68%, and resolved 4 blockers. Website Redesign remains at risk due to delayed design approval. Maya is near capacity, while Jordan has room to take on additional work.",
  "Write today's update": "Today, focus on design approval for Website Redesign, finance review for the AWS estimate, and the Q3 dashboard proof. Maya is near capacity, so Jordan can absorb one follow-up task.",
  "Summarize blockers": "The main blockers are design approval for Website Redesign, finance review for AWS estimate, missing client feedback for landing page, and finance numbers for Investor Update Deck.",
  "What can I reassign to reduce workload?": "Move one Q3 review task from Maya to Jordan. Jordan has 34% capacity, no blocked tasks, and high delivery confidence.",
  "Which expenses need attention?": "Budget usage is 64%, with $4,820 used of $7,500. Three expenses are pending, and Software is the highest category.",
  "What changed since last week?": "Q3 Launch moved to 68%, Jordan completed the onboarding checklist, and Website Redesign became at risk after design approval slipped.",
};

export const notifications = ["Maya submitted proof for review", "Website Redesign moved to At Risk", "AWS estimate needs finance approval", "Weekly leadership update is ready"];

export const teamWorkload = teamMembers.map((member) => ({
  name: member.shortName,
  initials: member.initials,
  status: member.status === "Near Capacity" ? ("near-capacity" as const) : member.status === "Available" ? ("available" as const) : ("on-track" as const),
  load: member.workloadCapacity,
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
  { id: "pacing", icon: "TrendingUp", title: "AI Project Pacing", description: "Real-time pace tracking with risk signals. Know before deadlines slip, not after.", accent: "#6D5DFB" },
  { id: "approvals", icon: "CheckSquare", title: "Proof-Based Approvals", description: "Attach evidence to every approval. No more chasing context or paper trails.", accent: "#0EA5E9" },
  { id: "workload", icon: "Users", title: "Team Workload Visibility", description: "See who is at capacity before you assign. Balance the team with one glance.", accent: "#34D399" },
  { id: "expenses", icon: "CreditCard", title: "Expense Tracking", description: "Submit, approve, and audit expenses inside the same system your projects live in.", accent: "#FBBF24" },
  { id: "standups", icon: "Radio", title: "Daily Standups", description: "Async standups that surface blockers, decisions, and work that needs attention.", accent: "#F87171" },
  { id: "ask", icon: "Sparkles", title: "Ask Pulse", description: "Ask anything about your team in plain English. Get answers, not dashboards.", accent: "#6D5DFB" },
];

export const enterprise = {
  id: "acme-ops",
  name: "Acme Ops",
  plan: "Team",
  industry: "Software",
  size: "12 members",
  owner: "Mithilessh",
  health: 82,
  activeTeams: 5,
  activeProjects: 8,
  pendingInvites: 3,
  monthlySpend: 4820,
  budgetLimit: 7500,
};

export const teams = [
  { id: "product", name: "Product", lead: "Maya Chen", members: 4, activeProjects: ["Q3 Launch Review", "Customer Onboarding Flow"], workloadAverage: 78, health: "Needs Support", currentFocus: "Launch readiness", supportNeeded: true },
  { id: "design", name: "Design", lead: "Alex Rivera", members: 3, activeProjects: ["Website Redesign"], workloadAverage: 69, health: "At Risk", currentFocus: "Design approval", supportNeeded: true },
  { id: "engineering", name: "Engineering", lead: "Jordan Lee", members: 5, activeProjects: ["Mobile App Launch", "Dashboard Infrastructure"], workloadAverage: 54, health: "Stable", currentFocus: "Release readiness", supportNeeded: false },
  { id: "operations", name: "Operations", lead: "Sam Patel", members: 2, activeProjects: ["Investor Update Deck"], workloadAverage: 55, health: "Needs Review", currentFocus: "Finance coordination", supportNeeded: false },
  { id: "finance", name: "Finance", lead: "Priya Shah", members: 2, activeProjects: ["Budget Review"], workloadAverage: 48, health: "Stable", currentFocus: "Approval cleanup", supportNeeded: false },
];

export const members = [
  { id: "mithilessh", name: "Mithilessh", email: "mithilessh@acmeops.com", role: "Owner", permission: "Owner", team: "Executive", status: "Available", workloadCapacity: 41, focusLoad: "Balanced", availability: "Available", supportNeeded: false, deliveryConfidence: "High", assignedTasks: 4, blockedTasks: 0, completedThisWeek: 6, suggestedAction: "Review enterprise risks and unblock finance.", initials: "M" },
  ...teamMembers.map((member) => ({ ...member, email: `${member.id}@acmeops.com`, permission: member.id === "maya" || member.id === "sam" ? "Manager" : "Member", team: member.role.includes("Product") ? "Product" : member.role.includes("Designer") ? "Design" : member.role.includes("Engineer") ? "Engineering" : "Operations" })),
  { id: "priya", name: "Priya Shah", email: "priya@acmeops.com", role: "Finance Lead", permission: "Admin", team: "Finance", status: "Available", workloadCapacity: 48, capacity: 48, load: 48, focusLoad: "Balanced", availability: "Available", supportNeeded: false, deliveryConfidence: "High", confidence: "High", currentTasks: 4, assignedTasks: 4, blockedTasks: 0, completedThisWeek: 5, suggestedAction: "Provide final numbers for Investor Update Deck.", initials: "PS" },
  { id: "elena", name: "Elena Brooks", email: "elena@acmeops.com", role: "Product Manager", permission: "Member", team: "Product", status: "Available", workloadCapacity: 58, capacity: 58, load: 58, focusLoad: "Balanced", availability: "Available", supportNeeded: false, deliveryConfidence: "High", confidence: "High", currentTasks: 5, assignedTasks: 5, blockedTasks: 0, completedThisWeek: 6, suggestedAction: "Validate customer handoff flow.", initials: "EB" },
  { id: "chris", name: "Chris Morgan", email: "chris@acmeops.com", role: "Frontend Engineer", permission: "Member", team: "Engineering", status: "Available", workloadCapacity: 52, capacity: 52, load: 52, focusLoad: "Balanced", availability: "Available", supportNeeded: false, deliveryConfidence: "High", confidence: "High", currentTasks: 5, assignedTasks: 5, blockedTasks: 1, completedThisWeek: 7, suggestedAction: "Close dashboard infrastructure QA gaps.", initials: "CM" },
  { id: "nina", name: "Nina Park", email: "nina@acmeops.com", role: "QA Engineer", permission: "Member", team: "Engineering", status: "Available", workloadCapacity: 46, capacity: 46, load: 46, focusLoad: "Light", availability: "Open", supportNeeded: false, deliveryConfidence: "High", confidence: "High", currentTasks: 3, assignedTasks: 3, blockedTasks: 0, completedThisWeek: 8, suggestedAction: "Finish mobile launch QA matrix.", initials: "NP" },
  { id: "omar", name: "Omar Wilson", email: "omar@acmeops.com", role: "Customer Ops", permission: "Member", team: "Operations", status: "Available", workloadCapacity: 49, capacity: 49, load: 49, focusLoad: "Balanced", availability: "Available", supportNeeded: false, deliveryConfidence: "Medium", confidence: "Medium", currentTasks: 4, assignedTasks: 4, blockedTasks: 1, completedThisWeek: 4, suggestedAction: "Follow up on client landing page feedback.", initials: "OW" },
];

export const roles = [
  { name: "Owner", permissions: ["Manage workspace", "Invite members", "Manage teams", "Approve work", "View reports", "Submit tasks/expenses"] },
  { name: "Admin", permissions: ["Invite members", "Manage teams", "Approve work", "View reports", "Submit tasks/expenses"] },
  { name: "Manager", permissions: ["Manage teams", "Approve work", "View reports", "Submit tasks/expenses"] },
  { name: "Member", permissions: ["View reports", "Submit tasks/expenses"] },
  { name: "Viewer", permissions: ["View reports"] },
];

export const invites = [
  { email: "ryan@acmeops.com", team: "Engineering", role: "Member", status: "Pending" },
  { email: "sara@acmeops.com", team: "Product", role: "Manager", status: "Pending" },
  { email: "finance.contractor@acmeops.com", team: "Finance", role: "Viewer", status: "Pending" },
];

projects.push(
  { id: "dashboard-infrastructure", name: "Dashboard Infrastructure", progress: 61, health: "On Track", status: "on-track", statusLabel: "On Track", deadlineRisk: "Medium", budgetRisk: "Medium", owner: "Chris Morgan", ownerInitials: "CM", dueDate: "Aug 5", due: "Aug 5", predictedFinish: "Aug 4", budget: 9000, budgetLabel: "$9,000", spend: 4100, spendLabel: "$4,100", tasksTotal: 22, tasks: 22, tasksCompleted: 13, completedTasks: 13, blockers: 1, blockersCount: 1, team: 5, daysLeft: 24, column: "In Progress", insight: "Infrastructure is healthy, but QA coverage needs one more pass before launch." },
  { id: "budget-review", name: "Budget Review", progress: 38, health: "Needs Review", status: "needs-review", statusLabel: "Needs Review", deadlineRisk: "Medium", budgetRisk: "Medium", owner: "Priya Shah", ownerInitials: "PS", dueDate: "Aug 1", due: "Aug 1", predictedFinish: "Aug 3", budget: 2500, budgetLabel: "$2,500", spend: 980, spendLabel: "$980", tasksTotal: 11, tasks: 11, tasksCompleted: 4, completedTasks: 4, blockers: 1, blockersCount: 1, team: 2, daysLeft: 20, column: "Planning", insight: "Operations input is the missing dependency for budget cleanup." },
);

tasks.push(
  ...["Complete QA test matrix", "Confirm finance assumptions", "Draft board narrative", "Create mobile handoff checklist", "Review GitHub team seats", "Prepare onboarding email"].map((title, index) => ({
    id: `enterprise-task-${index}`,
    title,
    project: index < 2 ? "Mobile App Launch" : index < 4 ? "Investor Update Deck" : "Budget Review",
    owner: ["Nina", "Priya", "Sam", "Alex", "Chris", "Elena"][index],
    priority: index < 2 ? "High" as const : "Medium" as const,
    dueDate: index < 2 ? "Tomorrow" : "Next week",
    due: index < 2 ? "Tomorrow" : "Next week",
    status: index === 1 ? "Blocked" as const : "In Progress" as const,
    proofRequired: index % 2 === 0,
    proofStatus: "Draft" as const,
    proof: "Draft",
    blocked: index === 1,
    subtasks: ["Confirm owner", "Attach evidence", "Update status"],
    commentsCount: 2 + index,
    comments: 2 + index,
    aiReview: "Pulse recommends keeping this task visible in the manager inbox.",
  }))
);

approvals.push(
  { id: "mobile-qa-report", type: "Report Approval", title: "Mobile QA report ready for review.", submittedBy: "Nina", project: "Mobile App Launch", submittedAt: "3 days ago", time: "3 days ago", priority: "Medium", summary: "QA report covers release blockers and test pass rate.", attachments: ["QA report", "Test matrix"], aiReviewNote: "Report is complete but should call out missing Android test evidence.", aiNote: "Report is complete but should call out missing Android test evidence.", status: "Waiting", auditTrail: ["Submitted", "QA reviewed", "Manager notified"] },
  { id: "budget-review-approval", type: "Expenses", title: "Budget review adjustment needs approval.", submittedBy: "Priya", project: "Budget Review", submittedAt: "3 days ago", time: "3 days ago", priority: "Medium", summary: "Finance proposes reallocating unused design budget to infrastructure.", attachments: ["Budget sheet"], aiReviewNote: "Amount is reasonable but needs operations confirmation.", aiNote: "Amount is reasonable but needs operations confirmation.", status: "Waiting", auditTrail: ["Submitted", "Finance reviewed"] },
);

expenses.push(
  { id: "ai-workspace-credits-expense", item: "AI workspace credits", vendor: "Pulse AI", amount: "$50", amountValue: 50, category: "AI", owner: "Mithilessh", submittedBy: "Mithilessh", project: "Q3 Launch Review", status: "Pending", date: "Jun 6", receiptStatus: "Uploaded", aiCategorySuggestion: "AI" },
  { id: "github-team-seats-expense", item: "GitHub team seats", vendor: "GitHub", amount: "$128", amountValue: 128, category: "Engineering", owner: "Chris", submittedBy: "Chris", project: "Dashboard Infrastructure", status: "Approved", date: "Jun 5", receiptStatus: "Uploaded", aiCategorySuggestion: "Engineering" },
);

blockers.push(
  { id: "qa-test-matrix", title: "QA test matrix incomplete for Mobile App Launch", owner: "Nina", project: "Mobile App Launch", impact: "Release readiness cannot be confirmed.", suggestedNextAction: "Assign final QA owner and review by tomorrow.", age: "1 day" },
  { id: "budget-ops-review", title: "Budget review waiting on operations", owner: "Priya", project: "Budget Review", impact: "Finance cannot close budget recommendation.", suggestedNextAction: "Ask Operations for final expense notes.", age: "2 days" },
);

export const chatRooms = [
  { id: "company", name: "Company Updates", summary: "Leadership updates and cross-team decisions.", unread: 2 },
  { id: "product", name: "Product Team", summary: "Launch readiness and customer onboarding work.", unread: 4 },
  { id: "design", name: "Design Team", summary: "Website redesign proof and mobile approval.", unread: 3 },
  { id: "engineering", name: "Engineering Team", summary: "Release readiness and infrastructure work.", unread: 1 },
  { id: "q3-launch", name: "Q3 Launch Review", summary: "Launch proof, budget, and status updates.", unread: 2 },
  { id: "website", name: "Website Redesign", summary: "Design is ready, mobile screenshots missing.", unread: 5 },
  { id: "mobile", name: "Mobile App Launch", summary: "QA and release coordination.", unread: 1 },
  { id: "finance", name: "Finance Approvals", summary: "Budget and expense approvals.", unread: 2 },
];

export const chatMessages = [
  { author: "Alex", text: "Final mockups are ready, but I need approval before engineering starts.", time: "9:18 AM" },
  { author: "Maya", text: "Can you attach the mobile version too?", time: "9:24 AM" },
  { author: "Jordan", text: "Engineering can start once the design approval is cleared.", time: "9:31 AM" },
];

export const meetings = [
  { id: "website-unblock", title: "Website Redesign Unblock", participants: ["Alex", "Maya", "Jordan"], project: "Website Redesign", duration: "20 min", why: "Design approval is delaying engineering handoff.", agenda: ["Review missing mobile proof", "Confirm approval owner", "Set handoff time"] },
  { id: "q3-launch", title: "Q3 Launch Review", participants: ["Maya", "Sam", "Priya"], project: "Q3 Launch Review", duration: "30 min", why: "Budget risk needs leadership review.", agenda: ["Launch proof", "Budget watch", "Approval queue"] },
  { id: "pe-sync", title: "Product/Engineering Sync", participants: ["Maya", "Jordan", "Chris"], project: "Mobile App Launch", duration: "25 min", why: "Release readiness requires product signoff.", agenda: ["QA status", "Support task handoff", "Release risks"] },
  { id: "finance-check", title: "Finance Approval Check-in", participants: ["Sam", "Priya"], project: "Investor Update Deck", duration: "15 min", why: "Finance numbers are blocking the deck.", agenda: ["Revenue numbers", "Burn rate", "Final deadline"] },
  { id: "weekly-leadership", title: "Weekly Leadership Update", participants: ["Mithilessh", "Maya", "Sam"], project: "Acme Ops", duration: "30 min", why: "Summarize enterprise health and risks.", agenda: ["Health", "Risks", "Next actions"] },
];

export const decisions = [
  { id: "mobile-approval", title: "Website Redesign requires mobile approval before engineering starts", summary: "Engineering handoff waits until mobile proof is attached and approved.", owner: "Maya", project: "Website Redesign", team: "Design", date: "Jun 12", impact: "Prevents rework", source: "Design Team", status: "Active" },
  { id: "budget-cap", title: "Q3 Launch budget remains capped at $7,500", summary: "Spend must stay within cap until leadership review.", owner: "Mithilessh", project: "Q3 Launch Review", team: "Product", date: "Jun 10", impact: "Controls launch spend", source: "Leadership Update", status: "Active" },
  { id: "finance-block", title: "Investor Update Deck is blocked until Finance provides final numbers", summary: "No final deck narrative without revenue and burn figures.", owner: "Sam", project: "Investor Update Deck", team: "Operations", date: "Jun 11", impact: "Blocks investor reporting", source: "Finance Approvals", status: "Active" },
  { id: "eng-support", title: "Engineering can take one support task from Product this week", summary: "Jordan has available capacity and can absorb one task from Maya.", owner: "Jordan", project: "Q3 Launch Review", team: "Engineering", date: "Jun 13", impact: "Reduces product workload risk", source: "Pulse Recommendation", status: "Active" },
];

export const playbooks = [
  { id: "launch-checklist", name: "Launch Checklist", ownerRole: "Product Lead", estimatedTime: "45 min", requiredProof: "Launch plan, proof screenshots", approvalPoints: 3, steps: ["Confirm scope", "Review risks", "Approve proof", "Publish update"] },
  { id: "design-review", name: "Design Review Process", ownerRole: "Designer", estimatedTime: "30 min", requiredProof: "Desktop and mobile screenshots", approvalPoints: 2, steps: ["Attach proof", "Review breakpoints", "Request approval"] },
  { id: "expense-approval", name: "Expense Approval Process", ownerRole: "Operations", estimatedTime: "15 min", requiredProof: "Receipt", approvalPoints: 1, steps: ["Upload receipt", "Check category", "Approve or reject"] },
  { id: "client-update", name: "Client Update Workflow", ownerRole: "Product Lead", estimatedTime: "25 min", requiredProof: "Draft update", approvalPoints: 1, steps: ["Draft update", "Review risk", "Send"] },
  { id: "hiring-sprint", name: "Hiring Sprint Workflow", ownerRole: "Operations", estimatedTime: "60 min", requiredProof: "Candidate tracker", approvalPoints: 2, steps: ["Define role", "Review pipeline", "Approve next round"] },
  { id: "leadership-report", name: "Weekly Leadership Report", ownerRole: "Manager", estimatedTime: "20 min", requiredProof: "Workspace summary", approvalPoints: 1, steps: ["Summarize health", "List risks", "Publish update"] },
];

export const enterpriseNotifications = [
  { id: "n1", title: "Approval waiting", description: "Maya's Q3 dashboard proof needs review.", type: "Approval", time: "18 min ago", unread: true, action: "Review" },
  { id: "n2", title: "Expense submitted", description: "AWS estimate needs finance approval.", type: "Expense", time: "1 hr ago", unread: true, action: "Open" },
  { id: "n3", title: "Project at risk", description: "Website Redesign is behind pace.", type: "Risk", time: "2 hr ago", unread: true, action: "View" },
  { id: "n4", title: "Team support needed", description: "Product needs support this week.", type: "Team", time: "Today", unread: false, action: "Reassign" },
  { id: "n5", title: "Invite pending", description: "Ryan is waiting to join Engineering.", type: "Invite", time: "Yesterday", unread: false, action: "Resend" },
  { id: "n6", title: "Report generated", description: "Weekly leadership update is ready.", type: "Report", time: "Yesterday", unread: false, action: "Copy" },
];
