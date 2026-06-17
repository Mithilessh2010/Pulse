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
    insight: "Onboarding can stay on track if the demo walkthrough is approved this week.",
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
  ["record-demo-walkthrough", "Record demo walkthrough", "Customer Onboarding Flow", "Jordan", "Low", "Today 6:00 PM", "Due Today", true, "Missing", false, 1],
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

export type Integration = {
  name: string;
  status: "Coming soon" | "Not configured yet";
  description: string;
};

export const integrations: Integration[] = [
  { name: "Google", status: "Coming soon", description: "Calendar, Drive, and identity signals." },
  { name: "GitHub", status: "Not configured yet", description: "Pull requests, code activity, and engineering proof." },
  { name: "Microsoft", status: "Coming soon", description: "Teams, Outlook, and Microsoft 365 workspace context." },
  { name: "Slack", status: "Not configured yet", description: "Approvals, updates, and blocker alerts." },
  { name: "Discord", status: "Coming soon", description: "Community and team notification support." },
  { name: "Notion", status: "Not configured yet", description: "Docs, specs, and decision records." },
  { name: "Jira", status: "Not configured yet", description: "Issues, sprints, and delivery state." },
  { name: "Asana", status: "Coming soon", description: "Tasks and project timelines." },
  { name: "QuickBooks", status: "Coming soon", description: "Expense and budget reconciliation." },
  { name: "Xero", status: "Coming soon", description: "Finance and accounting sync." },
];

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
