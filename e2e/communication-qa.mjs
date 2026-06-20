import { chromium } from "playwright";
import { MongoClient } from "mongodb";

const baseURL = process.env.QA_BASE_URL ?? "http://localhost:3000";
const email = `pulse.communication.qa.${Date.now()}@example.com`;
const password = "PulseQA!2026";
const failures = [];
const checks = [];
const consoleErrors = [];

function check(value, label) { (value ? checks : failures).push(label); }

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on("console", (message) => message.type() === "error" && consoleErrors.push(message.text()));
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(`${baseURL}/signup`, { waitUntil: "networkidle" });
  await page.getByLabel("Full name").fill("Communication QA");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByLabel("Workspace name").fill("Communication Lab");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/signin?created=1");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/app");

  const token = Date.now().toString().slice(-6);
  await page.goto(`${baseURL}/app/chat?dm=maya`, { waitUntil: "networkidle" });
  await page.getByLabel("Write a message in Maya Chen").fill(`DM persistence ${token}`);
  await page.getByRole("button", { name: "Send", exact: true }).click();
  const ownMessage = page.locator("article").filter({ hasText: `DM persistence ${token}` });
  await ownMessage.getByTitle("React").click();
  await ownMessage.getByTitle("Convert to task").click();
  await ownMessage.getByTitle("Pin as decision").click();
  await page.reload({ waitUntil: "networkidle" });
  check(await page.getByText(`DM persistence ${token}`, { exact: true }).last().isVisible(), "DM persists after refresh");
  check(await page.getByRole("button", { name: /👍 1/ }).isVisible(), "DM reaction persists after refresh");
  const storedAfterDm = await page.evaluate(() => localStorage.getItem("pulse-demo-state-v1") ?? "");
  check(storedAfterDm.includes(`DM persistence ${token}`) && storedAfterDm.includes("convertedToTaskId") && storedAfterDm.includes("pinnedAsDecisionId"), "DM task and decision links persist");

  await page.goto(`${baseURL}/app/chat?room=website`, { waitUntil: "networkidle" });
  await page.getByLabel("Write a message in Website Redesign").fill(`Room persistence ${token}`);
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  check(await page.getByText(`Room persistence ${token}`, { exact: true }).last().isVisible(), "Work room message persists after refresh");
  await page.getByRole("button", { name: "Summarize conversation" }).click();
  check(await page.getByText("Summary refreshed and saved.").isVisible(), "Room summary action works");

  await page.goto(`${baseURL}/app/calls`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start instant huddle" }).click();
  check(await page.getByText("Instant Manager Huddle", { exact: true }).last().isVisible(), "Call room opens");
  await page.getByRole("button", { name: "Enable camera & mic" }).click();
  await page.waitForTimeout(500);
  check(await page.getByText(/connected|denied|unavailable/i).last().isVisible(), "Media permission flow shows connected or fallback state");
  await page.getByRole("button", { name: "Chat", exact: true }).click();
  await page.getByLabel("In-call message", { exact: true }).fill(`Call chat ${token}`);
  await page.getByRole("button", { name: "Send in-call message" }).click();
  await page.getByRole("button", { name: "Notes", exact: true }).click();
  await page.getByLabel("Call notes").fill(`Call notes ${token}`);
  await page.getByRole("button", { name: /Generate call summary/ }).click();
  await page.getByRole("button", { name: /Extract action items/ }).click();
  await page.getByRole("button", { name: "End", exact: true }).click();
  await page.waitForTimeout(300);
  check(await page.getByText("Recent call history").isVisible(), "Ending call returns to call history");
  await page.reload({ waitUntil: "networkidle" });
  check((await page.getByText("Instant Manager Huddle", { exact: true }).count()) > 0, "Completed call persists after refresh");
  const storedAfterCall = await page.evaluate(() => localStorage.getItem("pulse-demo-state-v1") ?? "");
  check(storedAfterCall.includes(`Call chat ${token}`) && storedAfterCall.includes(`Call notes ${token}`), "Call chat and notes persist");

  await page.goto(`${baseURL}/app/meetings`, { waitUntil: "networkidle" });
  await page.getByText("Schedule meeting", { exact: true }).click();
  await page.getByText("Schedule a meeting", { exact: true });
  await page.locator("#schedule-meeting-form").getByText("Title").locator("input").fill(`QA Sync ${token}`);
  await page.locator("#schedule-meeting-form").getByText("Project or team").locator("input").fill("Website Redesign");
  await page.locator("#schedule-meeting-form").getByText("Agenda").locator("textarea").fill("Resolve QA blockers");
  await page.getByRole("button", { name: "Schedule meeting", exact: true }).last().click();
  check(await page.getByText(`QA Sync ${token}`, { exact: true }).first().isVisible(), "Scheduled meeting appears");
  await page.getByLabel("Meeting notes").fill(`Meeting notes ${token}`);
  await page.getByRole("button", { name: "Create follow-up task" }).click();
  await page.getByRole("button", { name: "Join / Start meeting" }).last().click();
  check(await page.getByText(`QA Sync ${token}`, { exact: true }).last().isVisible(), "Meeting opens shared call room");
  await page.getByRole("button", { name: "End", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  check(await page.getByText(`Meeting notes ${token}`, { exact: true }).isVisible().catch(() => false) || (await page.getByLabel("Meeting notes").inputValue()).includes(token), "Meeting notes persist after refresh");

  await page.goto(`${baseURL}/app`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "New message" }).click();
  await page.getByLabel("Message recipient").selectOption("alex");
  await page.getByLabel("Message body").fill(`Manager message ${token}`);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForURL("**/app/chat?dm=alex");
  check(await page.getByText(`Manager message ${token}`, { exact: true }).last().isVisible(), "Manager new-message action sends and opens DM");

  for (const route of ["/app/chat?dm=maya", "/app/calls", "/app/meetings"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), `${route} has no mobile horizontal overflow`);
  }
  check(consoleErrors.length === 0, "Browser console has no errors");
  await context.close();
} finally {
  await browser.close();
  if (process.env.MONGODB_URI) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try { await client.connect(); await client.db().collection("users").deleteOne({ email }); } finally { await client.close(); }
  }
}

console.log(JSON.stringify({ baseURL, checks, failures, consoleErrors }, null, 2));
if (failures.length || consoleErrors.length) process.exitCode = 1;
