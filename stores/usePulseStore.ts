"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  activityFeed as seedActivityFeed,
  approvals as seedApprovals,
  blockers as seedBlockers,
  chatMessages as seedChatMessages,
  chatRooms as seedChatRooms,
  decisions as seedDecisions,
  enterprise as seedEnterprise,
  enterpriseNotifications as seedNotifications,
  expenses as seedExpenses,
  invites as seedInvites,
  meetings as seedMeetings,
  members as seedMembers,
  playbooks as seedPlaybooks,
  projects as seedProjects,
  reports as seedReports,
  tasks as seedTasks,
  teams as seedTeams,
  teamMembers as seedTeamMembers,
  type Approval,
  type Blocker,
  type Expense,
  type Project,
  type Task,
  type TeamMember,
} from "@/lib/mockData";

export const STORAGE_KEY = "pulse-demo-state-v1";
export const STORE_VERSION = 1;

type Enterprise = typeof seedEnterprise;
type Team = (typeof seedTeams)[number];
type Member = (typeof seedMembers)[number];
type Invite = (typeof seedInvites)[number];
type Meeting = (typeof seedMeetings)[number] & {
  generatedAgenda?: string[];
  status?: "Upcoming" | "In progress" | "Completed";
  scheduledAt?: string;
  notes?: string;
  decisions?: string[];
  linkedCallId?: string;
  notesComplete?: boolean;
  followUpTaskIds?: string[];
};
type Decision = (typeof seedDecisions)[number];
type Playbook = (typeof seedPlaybooks)[number];
type Notification = (typeof seedNotifications)[number];
type DemoTask = Task & { completedSubtasks?: string[] };

export type ChatMessage = {
  id: string;
  roomId: string;
  sender: string;
  senderInitials: string;
  body: string;
  createdAt: string;
  type?: "message" | "system" | "ai-summary";
  reactions?: Record<string, string[]>;
  edited?: boolean;
  pinned?: boolean;
  convertedToTaskId?: string;
  pinnedAsDecisionId?: string;
};

export type DirectConversation = {
  id: string;
  memberId: string;
  unreadCount: number;
  isRead: boolean;
  messages: ChatMessage[];
};

export type ChatRoom = {
  id: string;
  name: string;
  description: string;
  linkedProject?: string;
  linkedTeam?: string;
  unreadCount: number;
  isRead: boolean;
  aiSummary?: string;
  pinnedDecisionIds: string[];
  messages: ChatMessage[];
};

export type InboxItem = {
  id: string;
  type: string;
  title: string;
  priority: string;
  time: string;
  action: string;
  done: boolean;
  snoozed?: boolean;
  linkedId?: string;
};

export type GeneratedReport = {
  id: string;
  type: string;
  tone: string;
  title: string;
  body: string;
  createdAt: string;
  copied?: boolean;
};

export type AutopilotAction = {
  id: string;
  category: string;
  title: string;
  reason: string;
  relatedObject: string;
  riskLevel: string;
  confidence: number;
  status: string;
};

export type AutopilotPlan = {
  id: string;
  command: string;
  actions: AutopilotAction[];
  createdAt: string;
};

export type CallRecord = {
  id: string;
  title: string;
  participants: string[];
  relatedProject?: string;
  relatedTeam?: string;
  reason: string;
  duration: string;
  status: "Suggested" | "Scheduled" | "In progress" | "Completed";
  agenda?: string[];
  notes: string[];
  decisions: string[];
  actionItemIds: string[];
  chatMessages?: ChatMessage[];
  summary?: string;
  startedAt?: string;
  endedAt?: string;
};

type SettingsState = {
  theme: string;
  density: string;
  reduceMotion: boolean;
  sidebarStyle: string;
  toggles: Record<string, boolean>;
};

type PulseState = {
  hasHydrated: boolean;
  enterprise: Enterprise;
  teams: Team[];
  members: Member[];
  teamMembers: TeamMember[];
  invites: Invite[];
  projects: Project[];
  tasks: DemoTask[];
  approvals: (Approval & { resolvedAt?: string; resolvedBy?: string; linkedTaskId?: string })[];
  expenses: Expense[];
  blockers: Blocker[];
  inboxItems: InboxItem[];
  notifications: Notification[];
  chatRooms: ChatRoom[];
  directMessages: DirectConversation[];
  calls: CallRecord[];
  meetings: Meeting[];
  decisions: Decision[];
  playbooks: Playbook[];
  reports: string[];
  generatedReports: GeneratedReport[];
  activityFeed: string[];
  auditTrail: string[];
  settings: SettingsState;
  generatedAiSummaries: Record<string, string>;
  autopilotPlans: AutopilotPlan[];
  selectedTheme: string;
  selectedTeamContext: string;
  setHasHydrated: (value: boolean) => void;
  resetDemoData: () => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  markInboxDone: (itemId: string) => void;
  snoozeInboxItem: (itemId: string) => void;
  sendChatMessage: (roomId: string, body: string) => ChatMessage | null;
  sendDirectMessage: (memberId: string, body: string) => ChatMessage | null;
  markConversationRead: (conversationId: string) => void;
  addReaction: (conversationId: string, messageId: string, reaction: string) => void;
  removeReaction: (conversationId: string, messageId: string, reaction: string) => void;
  pinMessage: (conversationId: string, messageId: string, pinned?: boolean) => void;
  editMessage: (conversationId: string, messageId: string, newBody: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  sendCallMessage: (callId: string, body: string) => void;
  markRoomRead: (roomId: string) => void;
  startHuddleFromRoom: (roomId: string) => string | null;
  summarizeChatRoom: (roomId: string) => string;
  convertMessageToTask: (roomId: string, messageId: string) => string | null;
  pinMessageAsDecision: (roomId: string, messageId: string) => string | null;
  approveApproval: (approvalId: string) => void;
  requestApprovalChanges: (approvalId: string) => void;
  approveExpense: (expenseId: string) => void;
  rejectExpense: (expenseId: string) => void;
  submitExpense: (data?: Partial<Expense>) => string;
  createTask: (data: Partial<DemoTask>) => string;
  updateTask: (taskId: string, updates: Partial<DemoTask>) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  submitTaskProof: (taskId: string, proofData?: string) => void;
  completeTask: (taskId: string) => void;
  reassignTask: (taskId: string, newOwner: string) => void;
  createProject: (data?: Partial<Project>) => string;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  createTeam: (data?: Partial<Team>) => string;
  inviteMember: (data?: Partial<Invite>) => string;
  updateMember: (memberId: string, updates: Partial<Member>) => void;
  generateReport: (type?: string, tone?: string) => string;
  saveGeneratedReport: (report: GeneratedReport) => void;
  copyReport: (reportId: string) => void;
  saveAiSummary: (key: string, summary: string) => void;
  generateAutopilotPlan: (command: string, actions: AutopilotAction[]) => string;
  approveAutopilotAction: (actionId: string) => void;
  skipAutopilotAction: (actionId: string) => void;
  editAutopilotAction: (actionId: string, updates: Partial<AutopilotAction>) => void;
  runSelectedAutopilotActions: (actionIds: string[]) => void;
  createCall: (data?: Partial<CallRecord>) => string;
  startCall: (callId: string) => void;
  endCall: (callId: string) => void;
  generateCallAgenda: (callId: string) => void;
  createCallFollowUpTasks: (callId: string) => void;
  updateCallNotes: (callId: string, notes: string[]) => void;
  generateCallSummary: (callId: string) => void;
  scheduleMeeting: (data: { title: string; participants: string[]; project: string; agenda?: string; scheduledAt?: string }) => string;
  startMeeting: (meetingId: string) => string | null;
  endMeeting: (meetingId: string) => void;
  saveMeetingNotes: (meetingId: string, notes: string) => void;
  generateMeetingAgenda: (meetingId: string) => void;
  createMeetingFollowUpTasks: (meetingId: string) => void;
  markMeetingNotesComplete: (meetingId: string) => void;
  addDecision: (data?: Partial<Decision>) => string;
  updateDecision: (decisionId: string, updates: Partial<Decision>) => void;
  updateSettings: (updates: Partial<SettingsState>) => void;
  toggleSetting: (key: string) => void;
  setSelectedTheme: (theme: string) => void;
  setSelectedTeamContext: (team: string) => void;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowLabel() {
  return new Date().toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

const themeLabels: Record<string, string> = {
  midnight: "Midnight Pulse",
  graphite: "Graphite",
  aurora: "Aurora",
  light: "Light Executive",
};

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "M";
}

function buildInitialChatRooms(): ChatRoom[] {
  return seedChatRooms.map((room, roomIndex) => {
    const roomMessages = room.id === "website" || roomIndex === 0 ? seedChatMessages : seedChatMessages.slice(0, 1);
    return {
      id: room.id,
      name: room.name,
      description: room.summary,
      linkedProject: room.name.includes("Website") ? "Website Redesign" : room.name.includes("Q3") ? "Q3 Launch Review" : undefined,
      linkedTeam: room.name.includes("Design") ? "Design" : room.name.includes("Engineering") ? "Engineering" : undefined,
      unreadCount: room.unread,
      isRead: room.unread === 0,
      aiSummary: room.id === "website" ? "Design is ready, but mobile screenshots are missing. Engineering is waiting on approval before starting implementation." : room.summary,
      pinnedDecisionIds: [],
      messages: roomMessages.map((message, index) => ({
        id: `${room.id}-message-${index}`,
        roomId: room.id,
        sender: message.author,
        senderInitials: initials(message.author),
        body: message.text,
        createdAt: message.time,
        type: "message",
      })),
    };
  });
}

function buildInitialDirectMessages(): DirectConversation[] {
  const examples: Record<string, string> = {
    maya: "Can you review the Q3 approval queue when you have a second?",
    alex: "I uploaded the final desktop mockups. Mobile screenshots are still missing.",
    jordan: "I have capacity today if Product needs help moving one task.",
    priya: "Finance numbers will be ready after the budget review.",
  };
  return seedMembers.filter((member) => member.id !== "mithilessh").map((member, index) => ({
    id: `dm-${member.id}`,
    memberId: member.id,
    unreadCount: index < 4 ? 1 : 0,
    isRead: index >= 4,
    messages: [{
      id: `dm-${member.id}-seed`, roomId: `dm-${member.id}`, sender: member.name,
      senderInitials: initials(member.name), body: examples[member.id] ?? `${member.name} shared a workspace update.`,
      createdAt: index < 2 ? "9:42 AM" : "Yesterday", type: "message", reactions: {},
    }],
  }));
}

function buildInboxItems(): InboxItem[] {
  return [
    ...seedApprovals.slice(0, 4).map((item) => ({ id: `approval-${item.id}`, linkedId: item.id, type: item.type, title: item.title, priority: item.priority, time: item.time, action: "Review approval", done: false })),
    ...seedBlockers.slice(0, 3).map((item) => ({ id: `blocker-${item.id}`, linkedId: item.id, type: "Blocker", title: item.title, priority: "High", time: item.age, action: item.suggestedNextAction, done: false })),
    ...seedInvites.map((item) => ({ id: `invite-${item.email}`, linkedId: item.email, type: "Pending invites", title: `${item.email} waiting to join ${item.team}`, priority: "Medium", time: "Pending", action: "Resend invite", done: false })),
  ];
}

function buildInitialCalls(): CallRecord[] {
  return [
    {
      id: "call-website-redesign-unblock",
      title: "Website Redesign Unblock",
      participants: ["Alex", "Maya", "Jordan"],
      relatedProject: "Website Redesign",
      relatedTeam: "Design",
      reason: "Design approval is delaying engineering",
      duration: "20 min",
      status: "Suggested",
      agenda: ["Review missing mobile proof", "Confirm approval owner", "Set engineering handoff time"],
      notes: ["Pulse recommends resolving design approval today."],
      decisions: ["Engineering starts after mobile proof is attached."],
      actionItemIds: [],
    },
    {
      id: "call-finance-numbers",
      title: "Finance Numbers Check-in",
      participants: ["Sam", "Priya"],
      relatedProject: "Investor Update Deck",
      relatedTeam: "Finance",
      reason: "Investor Update Deck is blocked by missing finance numbers",
      duration: "15 min",
      status: "Scheduled",
      agenda: ["Confirm revenue numbers", "Confirm burn rate", "Set final deck deadline"],
      notes: ["Finance numbers are the critical dependency."],
      decisions: [],
      actionItemIds: [],
    },
    {
      id: "call-product-support",
      title: "Product Support Huddle",
      participants: ["Maya", "Jordan", "Elena"],
      relatedProject: "Q3 Launch Review",
      relatedTeam: "Product",
      reason: "Product team is near capacity and Engineering can absorb one task",
      duration: "10 min",
      status: "Suggested",
      agenda: ["Identify task to reassign", "Confirm Jordan capacity", "Publish support plan"],
      notes: ["Use this huddle to reduce Maya's workload without slowing launch work."],
      decisions: [],
      actionItemIds: [],
    },
  ];
}

const defaultSettings: SettingsState = {
  theme: "Midnight Pulse",
  density: "Comfortable",
  reduceMotion: false,
  sidebarStyle: "Expanded",
  toggles: {
    "Daily briefing": true,
    "Approval reminders": true,
    "Budget alerts": true,
    "Blocker alerts": true,
    "Weekly reports": true,
    "Team support alerts": true,
    "Ask Pulse enabled": true,
    "Autopilot suggestions enabled": true,
    "Require manager confirmation": true,
    "Include expenses in AI context": true,
    "Include team workload in AI context": true,
    "Include approval queue": true,
    "Save AI activity to audit trail": true,
    "Reduce motion": false,
  },
};

function initialData() {
  return {
    hasHydrated: false,
    enterprise: clone(seedEnterprise),
    teams: clone(seedTeams),
    members: clone(seedMembers),
    teamMembers: clone(seedTeamMembers),
    invites: clone(seedInvites),
    projects: clone(seedProjects),
    tasks: clone(Array.from(seedTasks)),
    approvals: clone(seedApprovals),
    expenses: clone(Array.from(seedExpenses)),
    blockers: clone(seedBlockers),
    inboxItems: buildInboxItems(),
    notifications: clone(seedNotifications),
    chatRooms: buildInitialChatRooms(),
    directMessages: buildInitialDirectMessages(),
    calls: buildInitialCalls(),
    meetings: clone(seedMeetings),
    decisions: clone(seedDecisions),
    playbooks: clone(seedPlaybooks),
    reports: clone(seedReports),
    generatedReports: [],
    activityFeed: clone(seedActivityFeed),
    auditTrail: ["Demo workspace seeded from sample data."],
    settings: clone(defaultSettings),
    generatedAiSummaries: {},
    autopilotPlans: [],
    selectedTheme: "midnight",
    selectedTeamContext: "All teams",
  };
}

export const usePulseStore = create<PulseState>()(
  persist(
    (set, get) => ({
      ...initialData(),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      resetDemoData: () => set({ ...initialData(), hasHydrated: true }),
      markNotificationRead: (notificationId) => set((state) => ({ notifications: state.notifications.map((item) => item.id === notificationId ? { ...item, unread: false } : item) })),
      markAllNotificationsRead: () => set((state) => ({ notifications: state.notifications.map((item) => ({ ...item, unread: false })) })),
      clearNotifications: () => set({ notifications: [] }),
      markInboxDone: (itemId) => set((state) => ({ inboxItems: state.inboxItems.map((item) => item.id === itemId ? { ...item, done: true } : item) })),
      snoozeInboxItem: (itemId) => set((state) => ({ inboxItems: state.inboxItems.map((item) => item.id === itemId ? { ...item, done: true, snoozed: true } : item) })),
      sendChatMessage: (roomId, body) => {
        const clean = body.trim();
        if (!clean) return null;
        const message: ChatMessage = { id: id("message"), roomId, sender: "Mithilessh", senderInitials: "M", body: clean, createdAt: "Now", type: "message" };
        set((state) => ({
          chatRooms: state.chatRooms.map((room) => room.id === roomId ? {
            ...room,
            description: clean,
            aiSummary: room.aiSummary,
            isRead: true,
            unreadCount: 0,
            messages: [...room.messages, message],
          } : room),
          activityFeed: [`Mithilessh sent a message in ${state.chatRooms.find((room) => room.id === roomId)?.name ?? "Work Rooms"}`, ...state.activityFeed],
        }));
        return message;
      },
      sendDirectMessage: (memberId, body) => {
        const clean = body.trim();
        if (!clean) return null;
        const conversationId = `dm-${memberId}`;
        const message: ChatMessage = { id: id("message"), roomId: conversationId, sender: "You", senderInitials: "Y", body: clean, createdAt: "Now", type: "message", reactions: {} };
        set((state) => ({
          directMessages: state.directMessages.map((conversation) => conversation.memberId === memberId ? { ...conversation, isRead: true, unreadCount: 0, messages: [...conversation.messages, message] } : conversation),
          activityFeed: [`Direct message sent to ${state.members.find((member) => member.id === memberId)?.name ?? memberId}`, ...state.activityFeed],
          auditTrail: [`${nowLabel()} · Direct message sent: ${memberId}`, ...state.auditTrail],
        }));
        return message;
      },
      markConversationRead: (conversationId) => set((state) => ({
        directMessages: state.directMessages.map((conversation) => conversation.id === conversationId ? { ...conversation, isRead: true, unreadCount: 0 } : conversation),
        chatRooms: state.chatRooms.map((room) => room.id === conversationId ? { ...room, isRead: true, unreadCount: 0 } : room),
      })),
      addReaction: (conversationId, messageId, reaction) => set((state) => {
        const update = (message: ChatMessage) => message.id === messageId ? { ...message, reactions: { ...(message.reactions ?? {}), [reaction]: Array.from(new Set([...(message.reactions?.[reaction] ?? []), "You"])) } } : message;
        return { chatRooms: state.chatRooms.map((room) => room.id === conversationId ? { ...room, messages: room.messages.map(update) } : room), directMessages: state.directMessages.map((conversation) => conversation.id === conversationId ? { ...conversation, messages: conversation.messages.map(update) } : conversation) };
      }),
      removeReaction: (conversationId, messageId, reaction) => set((state) => {
        const update = (message: ChatMessage) => message.id === messageId ? { ...message, reactions: { ...(message.reactions ?? {}), [reaction]: (message.reactions?.[reaction] ?? []).filter((person) => person !== "You") } } : message;
        return { chatRooms: state.chatRooms.map((room) => room.id === conversationId ? { ...room, messages: room.messages.map(update) } : room), directMessages: state.directMessages.map((conversation) => conversation.id === conversationId ? { ...conversation, messages: conversation.messages.map(update) } : conversation) };
      }),
      pinMessage: (conversationId, messageId, pinned = true) => set((state) => {
        const update = (message: ChatMessage) => message.id === messageId ? { ...message, pinned } : message;
        return { chatRooms: state.chatRooms.map((room) => room.id === conversationId ? { ...room, messages: room.messages.map(update) } : room), directMessages: state.directMessages.map((conversation) => conversation.id === conversationId ? { ...conversation, messages: conversation.messages.map(update) } : conversation) };
      }),
      editMessage: (conversationId, messageId, newBody) => set((state) => {
        const update = (message: ChatMessage) => message.id === messageId ? { ...message, body: newBody.trim() || message.body, edited: true } : message;
        return { chatRooms: state.chatRooms.map((room) => room.id === conversationId ? { ...room, messages: room.messages.map(update) } : room), directMessages: state.directMessages.map((conversation) => conversation.id === conversationId ? { ...conversation, messages: conversation.messages.map(update) } : conversation) };
      }),
      deleteMessage: (conversationId, messageId) => set((state) => ({ chatRooms: state.chatRooms.map((room) => room.id === conversationId ? { ...room, messages: room.messages.filter((message) => message.id !== messageId) } : room), directMessages: state.directMessages.map((conversation) => conversation.id === conversationId ? { ...conversation, messages: conversation.messages.filter((message) => message.id !== messageId) } : conversation) })),
      markRoomRead: (roomId) => set((state) => ({ chatRooms: state.chatRooms.map((room) => room.id === roomId ? { ...room, isRead: true, unreadCount: 0 } : room) })),
      startHuddleFromRoom: (roomId) => {
        const room = get().chatRooms.find((item) => item.id === roomId);
        if (!room) return null;
        const callId = get().createCall({
          title: `${room.name} Huddle`,
          participants: ["Mithilessh", "Maya", "Jordan"],
          relatedProject: room.linkedProject,
          relatedTeam: room.linkedTeam,
          reason: `Started from ${room.name} to resolve current room context.`,
          duration: "15 min",
          status: "In progress",
          startedAt: nowLabel(),
          agenda: ["Review room summary", "Confirm next owner", "Create follow-up tasks"],
          notes: [room.aiSummary ?? room.description],
        });
        return callId;
      },
      summarizeChatRoom: (roomId) => {
        const room = get().chatRooms.find((item) => item.id === roomId);
        const summary = `Summary for ${room?.name ?? "room"}: ${(room?.messages ?? []).slice(-3).map((message) => message.body).join(" ")} Key dependencies remain visible for manager review.`;
        set((state) => ({
          chatRooms: state.chatRooms.map((item) => item.id === roomId ? { ...item, aiSummary: summary } : item),
          generatedAiSummaries: { ...state.generatedAiSummaries, [`chat-${roomId}`]: summary },
          auditTrail: [`${nowLabel()} · Chat room summarized: ${room?.name ?? roomId}`, ...state.auditTrail],
        }));
        return summary;
      },
      convertMessageToTask: (roomId, messageId) => {
        const room = get().chatRooms.find((item) => item.id === roomId);
        const direct = get().directMessages.find((item) => item.id === roomId);
        const message = room?.messages.find((item) => item.id === messageId) ?? direct?.messages.find((item) => item.id === messageId);
        if (!message) return null;
        const taskId = get().createTask({
          title: `Follow up: ${message.body.slice(0, 54)}`,
          project: room?.linkedProject ?? "Q3 Launch Review",
          owner: "Mithilessh",
          priority: "Medium",
          dueDate: "Tomorrow",
          due: "Tomorrow",
          status: "In Progress",
          proofRequired: false,
          proofStatus: "Draft",
          proof: "Draft",
          blocked: false,
          subtasks: ["Confirm owner", "Add context", "Share update"],
          commentsCount: 0,
          comments: 0,
          aiReview: `Created from ${room?.name ?? "a direct message"}.`,
        });
        set((state) => ({
          chatRooms: state.chatRooms.map((item) => item.id === roomId ? { ...item, messages: item.messages.map((chatMessage) => chatMessage.id === messageId ? { ...chatMessage, convertedToTaskId: taskId } : chatMessage) } : item),
          directMessages: state.directMessages.map((item) => item.id === roomId ? { ...item, messages: item.messages.map((chatMessage) => chatMessage.id === messageId ? { ...chatMessage, convertedToTaskId: taskId } : chatMessage) } : item),
        }));
        return taskId;
      },
      pinMessageAsDecision: (roomId, messageId) => {
        const room = get().chatRooms.find((item) => item.id === roomId);
        const direct = get().directMessages.find((item) => item.id === roomId);
        const message = room?.messages.find((item) => item.id === messageId) ?? direct?.messages.find((item) => item.id === messageId);
        if (!message) return null;
        const decisionId = get().addDecision({
          title: message.body,
          summary: `Pinned from ${room?.name ?? "a direct message"}.`,
          owner: message.sender,
          project: room?.linkedProject ?? "Acme Ops",
          team: room?.linkedTeam ?? "Leadership",
          date: "Today",
          impact: "Keeps the room decision visible",
          source: room?.name ?? "Direct Messages",
          status: "Active",
        });
        set((state) => ({
          chatRooms: state.chatRooms.map((item) => item.id === roomId ? {
            ...item,
            pinnedDecisionIds: Array.from(new Set([...item.pinnedDecisionIds, decisionId])),
            messages: item.messages.map((chatMessage) => chatMessage.id === messageId ? { ...chatMessage, pinnedAsDecisionId: decisionId } : chatMessage),
          } : item),
          directMessages: state.directMessages.map((item) => item.id === roomId ? { ...item, messages: item.messages.map((chatMessage) => chatMessage.id === messageId ? { ...chatMessage, pinnedAsDecisionId: decisionId } : chatMessage) } : item),
        }));
        return decisionId;
      },
      approveApproval: (approvalId) => set((state) => ({
        approvals: state.approvals.map((item) => item.id === approvalId ? { ...item, status: "Approved", resolvedAt: nowLabel(), resolvedBy: "Mithilessh", auditTrail: [...item.auditTrail, "Approved"] } : item),
        tasks: state.tasks.map((task) => task.id === state.approvals.find((item) => item.id === approvalId)?.linkedTaskId ? { ...task, proofStatus: "Approved", proof: "Approved" } : task),
        inboxItems: state.inboxItems.map((item) => item.linkedId === approvalId ? { ...item, done: true } : item),
        activityFeed: [`Approval approved: ${state.approvals.find((item) => item.id === approvalId)?.title ?? approvalId}`, ...state.activityFeed],
        auditTrail: [`${nowLabel()} · Approval approved: ${approvalId}`, ...state.auditTrail],
      })),
      requestApprovalChanges: (approvalId) => set((state) => ({
        approvals: state.approvals.map((item) => item.id === approvalId ? { ...item, status: "Changes Requested", resolvedAt: nowLabel(), resolvedBy: "Mithilessh", auditTrail: [...item.auditTrail, "Changes requested"] } : item),
        activityFeed: [`Changes requested: ${state.approvals.find((item) => item.id === approvalId)?.title ?? approvalId}`, ...state.activityFeed],
        auditTrail: [`${nowLabel()} · Changes requested: ${approvalId}`, ...state.auditTrail],
      })),
      approveExpense: (expenseId) => set((state) => ({
        expenses: state.expenses.map((expense) => expense.id === expenseId ? { ...expense, status: "Approved" } : expense),
        activityFeed: [`Expense approved: ${state.expenses.find((expense) => expense.id === expenseId)?.item ?? expenseId}`, ...state.activityFeed],
        auditTrail: [`${nowLabel()} · Expense approved: ${expenseId}`, ...state.auditTrail],
      })),
      rejectExpense: (expenseId) => set((state) => ({
        expenses: state.expenses.map((expense) => expense.id === expenseId ? { ...expense, status: "Rejected" } : expense),
        activityFeed: [`Expense rejected: ${state.expenses.find((expense) => expense.id === expenseId)?.item ?? expenseId}`, ...state.activityFeed],
        auditTrail: [`${nowLabel()} · Expense rejected: ${expenseId}`, ...state.auditTrail],
      })),
      submitExpense: (data = {}) => {
        const expenseId = id("expense");
        const expense: Expense = {
          id: expenseId,
          item: data.item ?? "Workspace expense",
          vendor: data.vendor ?? "New vendor",
          amount: data.amount ?? "$120",
          amountValue: data.amountValue ?? 120,
          category: data.category ?? "Operations",
          owner: data.owner ?? "Mithilessh",
          submittedBy: data.submittedBy ?? "Mithilessh",
          project: data.project ?? "Q3 Launch Review",
          status: data.status ?? "Pending",
          date: "Today",
          receiptStatus: data.receiptStatus ?? "Uploaded",
          aiCategorySuggestion: data.aiCategorySuggestion ?? data.category ?? "Operations",
        };
        set((state) => ({ expenses: [expense, ...state.expenses], activityFeed: [`Expense submitted: ${expense.item}`, ...state.activityFeed], auditTrail: [`${nowLabel()} · Expense submitted: ${expenseId}`, ...state.auditTrail] }));
        return expenseId;
      },
      createTask: (data) => {
        const taskId = data.id ?? id("task");
        const task: DemoTask = {
          id: taskId,
          title: data.title ?? "New workspace task",
          project: data.project ?? "Q3 Launch Review",
          owner: data.owner ?? "Mithilessh",
          priority: data.priority ?? "Medium",
          dueDate: data.dueDate ?? "Tomorrow",
          due: data.due ?? data.dueDate ?? "Tomorrow",
          status: data.status ?? "In Progress",
          proofRequired: data.proofRequired ?? false,
          proofStatus: data.proofStatus ?? "Draft",
          proof: data.proof ?? data.proofStatus ?? "Draft",
          blocked: data.blocked ?? false,
          subtasks: data.subtasks ?? ["Confirm owner", "Attach context", "Share update"],
          commentsCount: data.commentsCount ?? 0,
          comments: data.comments ?? 0,
          aiReview: data.aiReview ?? "Created in Pulse.",
          completedSubtasks: data.completedSubtasks ?? [],
        };
        set((state) => ({ tasks: [task, ...state.tasks], activityFeed: [`Task created: ${task.title}`, ...state.activityFeed], auditTrail: [`${nowLabel()} · Task created: ${taskId}`, ...state.auditTrail] }));
        return taskId;
      },
      updateTask: (taskId, updates) => set((state) => ({ tasks: state.tasks.map((task) => task.id === taskId ? { ...task, ...updates } : task), auditTrail: [`${nowLabel()} · Task updated: ${taskId}`, ...state.auditTrail] })),
      toggleSubtask: (taskId, subtaskId) => set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id !== taskId) return task;
          const completed = task.completedSubtasks ?? [];
          const isComplete = completed.includes(subtaskId);
          return {
            ...task,
            completedSubtasks: isComplete
              ? completed.filter((item) => item !== subtaskId)
              : [...completed, subtaskId],
          };
        }),
        auditTrail: [`${nowLabel()} · Subtask toggled: ${taskId}/${subtaskId}`, ...state.auditTrail],
      })),
      submitTaskProof: (taskId, proofData = "Submitted proof") => set((state) => ({ tasks: state.tasks.map((task) => task.id === taskId ? { ...task, proofStatus: "Submitted", proof: proofData } : task), activityFeed: [`Task proof submitted: ${state.tasks.find((task) => task.id === taskId)?.title ?? taskId}`, ...state.activityFeed] })),
      completeTask: (taskId) => set((state) => ({ tasks: state.tasks.map((task) => task.id === taskId ? { ...task, status: "Completed" } : task), activityFeed: [`Task completed: ${state.tasks.find((task) => task.id === taskId)?.title ?? taskId}`, ...state.activityFeed] })),
      reassignTask: (taskId, newOwner) => set((state) => ({ tasks: state.tasks.map((task) => task.id === taskId ? { ...task, owner: newOwner } : task), auditTrail: [`${nowLabel()} · Task reassigned: ${taskId} to ${newOwner}`, ...state.auditTrail] })),
      createProject: (data = {}) => {
        const projectId = data.id ?? id("project");
        const project: Project = { ...get().projects[0], ...data, id: projectId, name: data.name ?? "New workspace project", progress: data.progress ?? 0, tasksCompleted: data.tasksCompleted ?? 0, completedTasks: data.completedTasks ?? 0, tasks: data.tasks ?? 0, tasksTotal: data.tasksTotal ?? 0, column: data.column ?? "Planning" };
        set((state) => ({ projects: [project, ...state.projects], activityFeed: [`Project created: ${project.name}`, ...state.activityFeed] }));
        return projectId;
      },
      updateProject: (projectId, updates) => set((state) => ({ projects: state.projects.map((project) => project.id === projectId ? { ...project, ...updates } : project) })),
      createTeam: (data = {}) => {
        const teamId = data.id ?? id("team");
        const team = { ...get().teams[0], ...data, id: teamId, name: data.name ?? "New Workspace Team", lead: data.lead ?? "Mithilessh", members: data.members ?? 1, activeProjects: data.activeProjects ?? [], workloadAverage: data.workloadAverage ?? 0, health: data.health ?? "Stable", currentFocus: data.currentFocus ?? "Workspace setup", supportNeeded: data.supportNeeded ?? false };
        set((state) => ({ teams: [team, ...state.teams], activityFeed: [`Team created: ${team.name}`, ...state.activityFeed], auditTrail: [`${nowLabel()} · Team created: ${teamId}`, ...state.auditTrail] }));
        return teamId;
      },
      inviteMember: (data = {}) => {
        const email = data.email ?? `new.member.${Date.now()}@acmeops.com`;
        const invite = { email, team: data.team ?? "Product", role: data.role ?? "Member", status: data.status ?? "Pending" };
        set((state) => ({ invites: [invite, ...state.invites], inboxItems: [{ id: `invite-${email}`, linkedId: email, type: "Pending invites", title: `${email} waiting to join ${invite.team}`, priority: "Medium", time: "Pending", action: "Resend invite", done: false }, ...state.inboxItems], activityFeed: [`Invite sent: ${email}`, ...state.activityFeed] }));
        return email;
      },
      updateMember: (memberId, updates) => set((state) => ({ members: state.members.map((member) => member.id === memberId ? ({ ...member, ...updates } as Member) : member) })),
      generateReport: (type = "Weekly Summary", tone = "Executive") => {
        const reportId = id("report");
        const report: GeneratedReport = {
          id: reportId,
          type,
          tone,
          title: `${type} · ${nowLabel()}`,
          body: "This week, the team completed priority work, moved Q3 Launch forward, and kept budget usage controlled. Website Redesign remains the highest-risk project and needs design approval.",
          createdAt: nowLabel(),
        };
        set((state) => ({ generatedReports: [report, ...state.generatedReports], activityFeed: [`Report generated: ${report.title}`, ...state.activityFeed], auditTrail: [`${nowLabel()} · Report generated: ${reportId}`, ...state.auditTrail] }));
        return reportId;
      },
      saveGeneratedReport: (report) => set((state) => ({ generatedReports: [report, ...state.generatedReports] })),
      copyReport: (reportId) => set((state) => ({ generatedReports: state.generatedReports.map((report) => report.id === reportId ? { ...report, copied: true } : report) })),
      saveAiSummary: (key, summary) => set((state) => ({ generatedAiSummaries: { ...state.generatedAiSummaries, [key]: summary } })),
      generateAutopilotPlan: (command, actions) => {
        const planId = id("autopilot-plan");
        const plan = { id: planId, command, actions, createdAt: nowLabel() };
        set((state) => ({ autopilotPlans: [plan, ...state.autopilotPlans], auditTrail: [`${nowLabel()} · Autopilot plan generated`, ...state.auditTrail] }));
        return planId;
      },
      approveAutopilotAction: (actionId) => get().editAutopilotAction(actionId, { status: "Ready to run" }),
      skipAutopilotAction: (actionId) => get().editAutopilotAction(actionId, { status: "Skipped" }),
      editAutopilotAction: (actionId, updates) => set((state) => ({ autopilotPlans: state.autopilotPlans.map((plan) => ({ ...plan, actions: plan.actions.map((action) => action.id === actionId ? { ...action, ...updates } : action) })) })),
      runSelectedAutopilotActions: (actionIds) => set((state) => ({ autopilotPlans: state.autopilotPlans.map((plan) => ({ ...plan, actions: plan.actions.map((action) => actionIds.includes(action.id) ? { ...action, status: "Completed" } : action) })) })),
      createCall: (data = {}) => {
        const callId = data.id ?? id("call");
        const call: CallRecord = {
          id: callId,
          title: data.title ?? "Workspace Huddle",
          participants: data.participants ?? ["Mithilessh", "Maya"],
          relatedProject: data.relatedProject,
          relatedTeam: data.relatedTeam,
          reason: data.reason ?? "Quick work-tied alignment.",
          duration: data.duration ?? "15 min",
          status: data.status ?? "Suggested",
          agenda: data.agenda ?? ["Review context", "Capture decisions", "Create follow-up actions"],
          notes: data.notes ?? [],
          decisions: data.decisions ?? [],
          actionItemIds: data.actionItemIds ?? [],
          startedAt: data.startedAt,
          endedAt: data.endedAt,
        };
        set((state) => ({ calls: [call, ...state.calls], activityFeed: [`Call created: ${call.title}`, ...state.activityFeed], auditTrail: [`${nowLabel()} · Call created: ${callId}`, ...state.auditTrail] }));
        return callId;
      },
      startCall: (callId) => set((state) => ({ calls: state.calls.map((call) => call.id === callId ? { ...call, status: "In progress", startedAt: call.startedAt ?? nowLabel() } : call), auditTrail: [`${nowLabel()} · Call started: ${callId}`, ...state.auditTrail] })),
      endCall: (callId) => set((state) => ({ calls: state.calls.map((call) => call.id === callId ? { ...call, status: "Completed", endedAt: nowLabel(), notes: call.notes.length ? call.notes : ["Call completed. Notes are ready for review."] } : call), activityFeed: [`Call completed: ${state.calls.find((call) => call.id === callId)?.title ?? callId}`, ...state.activityFeed] })),
      generateCallAgenda: (callId) => set((state) => ({ calls: state.calls.map((call) => call.id === callId ? { ...call, agenda: ["Confirm current blocker", "Assign decision owner", "Create follow-up tasks", "Publish summary"] } : call), auditTrail: [`${nowLabel()} · Call agenda generated: ${callId}`, ...state.auditTrail] })),
      createCallFollowUpTasks: (callId) => {
        const call = get().calls.find((item) => item.id === callId);
        if (!call) return;
        const taskId = get().createTask({ title: `Follow up from ${call.title}`, project: call.relatedProject ?? "Q3 Launch Review", owner: call.participants[0] ?? "Mithilessh", status: "In Progress", priority: "Medium" });
        set((state) => ({ calls: state.calls.map((item) => item.id === callId ? { ...item, actionItemIds: [...item.actionItemIds, taskId] } : item) }));
      },
      updateCallNotes: (callId, notes) => set((state) => ({ calls: state.calls.map((call) => call.id === callId ? { ...call, notes } : call) })),
      sendCallMessage: (callId, body) => {
        const clean = body.trim();
        if (!clean) return;
        const message: ChatMessage = { id: id("call-message"), roomId: callId, sender: "You", senderInitials: "Y", body: clean, createdAt: "Now", reactions: {} };
        set((state) => ({ calls: state.calls.map((call) => call.id === callId ? { ...call, chatMessages: [...(call.chatMessages ?? []), message] } : call) }));
      },
      generateCallSummary: (callId) => set((state) => ({ calls: state.calls.map((call) => call.id === callId ? { ...call, summary: `${call.title}: ${call.notes.join(" ") || call.reason} Owners confirmed next actions and follow-up work.` } : call) })),
      scheduleMeeting: (data) => {
        const meetingId = id("meeting");
        const meeting: Meeting = { id: meetingId, title: data.title, participants: data.participants, project: data.project, duration: "30 min", why: "Scheduled from Pulse communication controls.", agenda: data.agenda ? [data.agenda] : ["Review context", "Confirm decisions", "Assign next actions"], generatedAgenda: data.agenda ? [data.agenda] : undefined, scheduledAt: data.scheduledAt ?? "Next available time", status: "Upcoming", notes: "", decisions: [], followUpTaskIds: [] };
        set((state) => ({ meetings: [meeting, ...state.meetings], activityFeed: [`Meeting scheduled: ${meeting.title}`, ...state.activityFeed], auditTrail: [`${nowLabel()} · Meeting scheduled: ${meetingId}`, ...state.auditTrail] }));
        return meetingId;
      },
      startMeeting: (meetingId) => {
        const meeting = get().meetings.find((item) => item.id === meetingId);
        if (!meeting) return null;
        const callId = meeting.linkedCallId ?? get().createCall({ title: meeting.title, participants: meeting.participants, relatedProject: meeting.project, reason: meeting.why, duration: meeting.duration, status: "In progress", startedAt: nowLabel(), agenda: meeting.generatedAgenda ?? meeting.agenda, notes: meeting.notes ? [meeting.notes] : [] });
        set((state) => ({ meetings: state.meetings.map((item) => item.id === meetingId ? { ...item, status: "In progress", linkedCallId: callId } : item) }));
        return callId;
      },
      endMeeting: (meetingId) => {
        const meeting = get().meetings.find((item) => item.id === meetingId);
        const linkedCall = meeting?.linkedCallId ? get().calls.find((call) => call.id === meeting.linkedCallId) : undefined;
        if (linkedCall && linkedCall.status !== "Completed") get().endCall(linkedCall.id);
        set((state) => ({ meetings: state.meetings.map((item) => item.id === meetingId ? { ...item, status: "Completed", notesComplete: true } : item) }));
      },
      saveMeetingNotes: (meetingId, notes) => set((state) => ({ meetings: state.meetings.map((meeting) => meeting.id === meetingId ? { ...meeting, notes } : meeting) })),
      generateMeetingAgenda: (meetingId) => set((state) => ({ meetings: state.meetings.map((meeting) => meeting.id === meetingId ? { ...meeting, generatedAgenda: [...meeting.agenda, "Confirm owners", "Publish follow-ups"] } : meeting) })),
      createMeetingFollowUpTasks: (meetingId) => {
        const meeting = get().meetings.find((item) => item.id === meetingId);
        if (!meeting) return;
        const taskId = get().createTask({ title: `Follow up from ${meeting.title}`, project: meeting.project, owner: "Mithilessh", status: "In Progress" });
        set((state) => ({ meetings: state.meetings.map((item) => item.id === meetingId ? { ...item, followUpTaskIds: [...(item.followUpTaskIds ?? []), taskId] } : item) }));
      },
      markMeetingNotesComplete: (meetingId) => set((state) => ({ meetings: state.meetings.map((meeting) => meeting.id === meetingId ? { ...meeting, notesComplete: true } : meeting) })),
      addDecision: (data = {}) => {
        const decisionId = data.id ?? id("decision");
        const decision = { ...get().decisions[0], ...data, id: decisionId, title: data.title ?? "New workspace decision", date: data.date ?? "Today" };
        set((state) => ({ decisions: [decision, ...state.decisions], activityFeed: [`Decision added: ${decision.title}`, ...state.activityFeed], auditTrail: [`${nowLabel()} · Decision added: ${decisionId}`, ...state.auditTrail] }));
        return decisionId;
      },
      updateDecision: (decisionId, updates) => set((state) => ({ decisions: state.decisions.map((decision) => decision.id === decisionId ? { ...decision, ...updates } : decision) })),
      updateSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates, toggles: updates.toggles ? { ...state.settings.toggles, ...updates.toggles } : state.settings.toggles } })),
      toggleSetting: (key) => set((state) => ({ settings: { ...state.settings, reduceMotion: key === "Reduce motion" ? !state.settings.reduceMotion : state.settings.reduceMotion, toggles: { ...state.settings.toggles, [key]: !state.settings.toggles[key] } } })),
      setSelectedTheme: (theme) => set((state) => ({ selectedTheme: theme, settings: { ...state.settings, theme: themeLabels[theme] ?? theme } })),
      setSelectedTeamContext: (team) => set({ selectedTeamContext: team }),
    }),
    {
      name: STORAGE_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") throw new Error("Pulse demo store is browser-only.");
        return window.localStorage;
      }),
      partialize: ({ hasHydrated: _hasHydrated, ...state }) => state,
      migrate: (persistedState, version) => {
        if (version !== STORE_VERSION || !persistedState || typeof persistedState !== "object") return initialData();
        return { ...initialData(), ...(persistedState as object) };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          usePulseStore.setState({ ...initialData(), hasHydrated: true });
          return;
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);

export function usePulseHydrated() {
  return usePulseStore((state) => state.hasHydrated);
}
