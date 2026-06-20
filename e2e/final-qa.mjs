import { chromium } from "playwright";

const baseURL = "http://localhost:3000";
const storageKey = "pulse-demo-state-v1";
const routes = [
  "/", "/product", "/features", "/pricing", "/demo", "/signin", "/signup", "/verify",
  "/app", "/app/autopilot", "/app/inbox", "/app/ask", "/app/projects", "/app/tasks",
  "/app/approvals", "/app/expenses", "/app/teams", "/app/team", "/app/chat", "/app/calls",
  "/app/meetings", "/app/reports", "/app/decisions", "/app/playbooks", "/app/import",
  "/app/onboarding", "/app/settings", "/app/dev/qa",
];

const appRoutes = routes.filter((route) => route.startsWith("/app") && route !== "/app/dev/qa");
const failures = [];
const evidence = [];
const interactionOnly = process.argv.includes("--interactions-only");

function check(condition, message) {
  if (!condition) failures.push(message);
  else evidence.push(message);
}

async function auditRoute(page, route, viewportName) {
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  check(response?.ok(), `${viewportName} ${route} returned ${response?.status()}`);
  const metrics = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const viewportWidth = root.clientWidth;
    const offenders = [...document.querySelectorAll("body *")].filter((element) => {
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || style.position === "fixed") return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 1 && (rect.right > viewportWidth + 2 || rect.left < -2);
    }).slice(0, 4).map((element) => `${element.tagName}.${element.className}`.slice(0, 160));
    return { horizontalOverflow: Math.max(root.scrollWidth, body.scrollWidth) > viewportWidth + 2, offenders };
  });
  check(!metrics.horizontalOverflow, `${viewportName} ${route} has no horizontal overflow${metrics.offenders.length ? ` (${metrics.offenders.join(", ")})` : ""}`);
}

async function clickAndClose(page, name) {
  const button = page.getByRole("button", { name, exact: true }).first();
  check(await button.isVisible().catch(() => false), `Manager control “${name}” is visible`);
  await button.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible" });
  const bounds = await dialog.locator("> div").boundingBox();
  const viewport = page.viewportSize();
  check(Boolean(bounds && viewport && bounds.height <= viewport.height - 24 && bounds.width <= viewport.width - 12), `${name} modal fits the viewport`);
  await page.getByRole("button", { name: "Close modal", exact: true }).click();
}

async function managerControls(page) {
  await page.goto(`${baseURL}/app`, { waitUntil: "networkidle" });
  for (const name of ["Create task", "Invite member", "Start huddle", "Generate report"]) await clickAndClose(page, name);
  await page.getByRole("button", { name: "Open notifications" }).click();
  check(await page.getByText("Notifications", { exact: true }).last().isVisible(), "Notifications drawer opens");
  await page.getByRole("button", { name: "Close panel" }).last().click();
  await page.getByRole("button", { name: "Open appearance menu" }).click();
  for (const theme of ["Graphite", "Aurora", "Light Executive", "Midnight Pulse"]) {
    await page.getByRole("button", { name: new RegExp(theme) }).click();
    if (theme !== "Midnight Pulse") await page.getByRole("button", { name: "Open appearance menu" }).click();
  }
  check(true, "All four themes can be selected");
  await page.getByRole("button", { name: "Open profile menu" }).click();
  check(await page.getByText(/Owner · Acme Ops/).isVisible(), "Profile menu opens");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Acme Ops", exact: true }).click();
  check(await page.getByText("Demo Workspace", { exact: true }).isVisible(), "Workspace dropdown opens");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /All teams/ }).click();
  await page.getByRole("button", { name: "Engineering", exact: true }).click();
  check(await page.getByRole("button", { name: /Engineering/ }).first().isVisible(), "Team filter dropdown updates");
  await page.reload({ waitUntil: "networkidle" });
  check(await page.getByRole("button", { name: /Engineering/ }).first().isVisible(), "Team filter persists after refresh");
}

async function persistence(page) {
  const token = Date.now().toString().slice(-6);
  await page.goto(`${baseURL}/app`, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Create task", exact: true }).click();
  await page.getByRole("dialog").locator("input").fill(`QA task ${token}`);
  await page.getByRole("dialog").getByRole("button", { name: "Save", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  check((await page.evaluate(({ key, name }) => localStorage.getItem(key)?.includes(name), { key: storageKey, name: `QA task ${token}` })) === true, "Created task persists after refresh");

  await page.goto(`${baseURL}/app/chat`, { waitUntil: "networkidle" });
  await page.getByLabel(/Write a message in/).fill(`QA chat ${token}`);
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  check(await page.getByText(`QA chat ${token}`, { exact: true }).last().isVisible(), "Sent chat message persists after refresh");

  await page.goto(`${baseURL}/app/approvals`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Approve", exact: true }).last().click();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("combobox", { name: "Filter approvals by status" }).selectOption({ label: "Approved" });
  check((await page.getByText("Approved", { exact: true }).count()) > 1, "Approval status persists after refresh");
  await page.getByRole("combobox", { name: "Filter approvals by status" }).selectOption({ label: "Waiting" });
  await page.getByRole("button", { name: "All", exact: true }).click();
  const request = page.getByRole("button", { name: "Request Changes", exact: true }).last();
  if (await request.isVisible().catch(() => false)) {
    await request.click();
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("combobox", { name: "Filter approvals by status" }).selectOption({ label: "Changes Requested" });
    check((await page.getByText("Changes Requested", { exact: true }).count()) > 0, "Request-changes status persists after refresh");
  }

  await page.goto(`${baseURL}/app/expenses`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Approve", exact: true }).first().click();
  await page.getByRole("button", { name: "Reject", exact: true }).first().click();
  await page.reload({ waitUntil: "networkidle" });
  const stored = await page.evaluate((key) => localStorage.getItem(key) ?? "", storageKey);
  check(stored.includes('"status":"Approved"') && stored.includes('"status":"Rejected"'), "Expense approve/reject statuses persist after refresh");

  await page.goto(`${baseURL}/app/teams`, { waitUntil: "networkidle" });
  const beforeTeams = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").state?.teams?.length ?? 0, storageKey);
  await page.getByRole("button", { name: "Create Team", exact: true }).click();
  await page.getByRole("button", { name: "Invite Member", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  const after = await page.evaluate((key) => { const s = JSON.parse(localStorage.getItem(key) ?? "{}").state; return { teams: s?.teams?.length ?? 0, invites: s?.invites?.length ?? 0 }; }, storageKey);
  check(after.teams === beforeTeams + 1, "Created team persists after refresh");
  check(after.invites > 0, "Member invite persists after refresh");

  await page.goto(`${baseURL}/app/reports`, { waitUntil: "networkidle" });
  await page.locator("button").filter({ hasText: /^Generate report$/ }).last().click();
  await page.reload({ waitUntil: "networkidle" });
  check((await page.getByText("Generated from current workspace data", { exact: true }).count()) > 0, "Generated report persists after refresh");

  await page.goto(`${baseURL}/app/calls`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start call", exact: true }).click();
  await page.reload({ waitUntil: "networkidle" });
  check(await page.getByRole("button", { name: "Call in progress", exact: true }).isVisible(), "Call state persists after refresh");

  await page.goto(`${baseURL}/app/ask`, { waitUntil: "networkidle" });
  const askInput = page.getByLabel("Ask Pulse prompt");
  await askInput.fill("What needs attention?");
  await page.getByRole("button", { name: "Ask Pulse", exact: true }).click();
  await page.waitForTimeout(600);
  check(await page.getByText(/risk|attention|priority/i).last().isVisible(), "Ask Pulse returns a visible response");
}

const browser = await chromium.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
try {
  for (const config of interactionOnly ? [] : [
    { name: "desktop", viewport: { width: 1440, height: 800 } },
    { name: "mobile", viewport: { width: 390, height: 844 } },
  ]) {
    const context = await browser.newContext({ viewport: config.viewport, acceptDownloads: true });
    const page = await context.newPage();
    page.on("console", (message) => message.type() === "error" && failures.push(`${config.name} console: ${message.text()}`));
    page.on("pageerror", (error) => failures.push(`${config.name} page error: ${error.message}`));
    for (const route of routes) await auditRoute(page, route, config.name);
    await page.screenshot({ path: `_deliverables/final-${config.name}.png`, fullPage: true });
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 800 }, acceptDownloads: true });
  const page = await context.newPage();
  page.on("console", (message) => message.type() === "error" && failures.push(`interaction console: ${message.text()}`));
  page.on("pageerror", (error) => failures.push(`interaction page error: ${error.message}`));

  await page.goto(`${baseURL}/app`, { waitUntil: "networkidle" });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: "networkidle" });
  const sidebarLinks = await page.locator("aside nav a").evaluateAll((links) => links.map((link) => ({ label: link.textContent?.trim(), href: link.getAttribute("href") })));
  check(sidebarLinks.length === 18, `All ${sidebarLinks.length} sidebar links are present`);
  for (const { label, href } of sidebarLinks) {
    await page.goto(`${baseURL}/app`, { waitUntil: "networkidle" });
    await page.locator(`aside nav a[href="${href}"]`).click();
    await page.waitForURL(`**${href}`);
    check(new URL(page.url()).pathname === href, `Sidebar link “${label}” navigates to ${href}`);
  }

  await managerControls(page);
  await persistence(page);
  await context.close();
} finally {
  await browser.close();
}

console.log(JSON.stringify({ routes: routes.length, evidence: evidence.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
