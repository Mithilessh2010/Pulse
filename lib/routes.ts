export type ObjectLinkType =
  | "project"
  | "task"
  | "approval"
  | "expense"
  | "team"
  | "member"
  | "meeting"
  | "call"
  | "decision"
  | "chatRoom"
  | "report"
  | "playbook";

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function query(path: string, params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export function projectHref(projectId: string, focus?: string) {
  return query("/app/projects", { project: projectId, focus });
}

export function taskHref(taskId: string) {
  return query("/app/tasks", { task: taskId });
}

export function tasksForProjectHref(projectId: string) {
  return query("/app/tasks", { project: projectId });
}

export function approvalHref(approvalId: string) {
  return query("/app/approvals", { approval: approvalId });
}

export function approvalsForProjectHref(projectId: string) {
  return query("/app/approvals", { project: projectId });
}

export function memberHref(memberId: string) {
  return query("/app/team", { member: memberId });
}

export function teamHref(teamId: string) {
  return query("/app/teams", { team: teamId });
}

export function expenseHref(expenseId: string) {
  return query("/app/expenses", { expense: expenseId });
}

export function expensesHref(params: { status?: string; project?: string } = {}) {
  return query("/app/expenses", params);
}

export function meetingHref(meetingId: string) {
  return query("/app/meetings", { meeting: meetingId });
}

export function callHref(callId: string) {
  return query("/app/calls", { call: callId });
}

export function decisionHref(decisionId: string) {
  return query("/app/decisions", { decision: decisionId });
}

export function chatRoomHref(roomId: string) {
  return query("/app/chat", { room: roomId });
}

export function reportHref(reportId: string) {
  return query("/app/reports", { report: reportId });
}

export function playbookHref(playbookId: string) {
  return query("/app/playbooks", { playbook: playbookId });
}

export function hrefForObject(type: ObjectLinkType, id: string) {
  switch (type) {
    case "project":
      return projectHref(id);
    case "task":
      return taskHref(id);
    case "approval":
      return approvalHref(id);
    case "expense":
      return expenseHref(id);
    case "team":
      return teamHref(id);
    case "member":
      return memberHref(id);
    case "meeting":
      return meetingHref(id);
    case "call":
      return callHref(id);
    case "decision":
      return decisionHref(id);
    case "chatRoom":
      return chatRoomHref(id);
    case "report":
      return reportHref(id);
    case "playbook":
      return playbookHref(id);
  }
}
