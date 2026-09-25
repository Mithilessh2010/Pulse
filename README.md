# Pulse

Pulse is a team operations workspace for the messy part between planning and shipping: projects, approvals, workload, expenses, decisions, updates, and the follow-ups that usually get split across different tools.

The product is built around a simple question: **what needs attention next?** The command center gives teams a focused operating view, while deeper screens keep the context needed to act on projects, tasks, approvals, spend, reports, and team capacity.

> **Want to review it quickly?** Open `/demo`. Pulse creates a temporary sample-data session, so reviewers can explore the app without creating an account.

## What is in the product

- **Command center** — due work, approvals, blockers, spend, project status, capacity, and a compact Ask Pulse entry point.
- **Projects and tasks** — owners, progress, proof, subtasks, blockers, priorities, and delivery pacing.
- **Approvals** — proof review, attachments, written change feedback, decision state, and audit history.
- **People and teams** — capacity, availability, support signals, team ownership, and workload context.
- **Expenses and budgets** — submissions, approval states, project-linked spend, and budget tracking.
- **Reports and updates** — leadership summaries, exports, recurring updates, meetings, calls, and decisions.
- **Ask Pulse** — workspace-aware answers with a local fallback when an external model provider is not configured.
- **Responsive shell** — sticky desktop navigation, a compact mobile header, and bottom navigation for the most-used mobile routes.

## Recent product pass

The September 2026 pass focused on clarity instead of adding more surface area:

- Reworked the visual system from blue/purple glow-heavy styling to **graphite, moss, and warm gold**.
- Flattened cards and removed decorative UI that competed with the actual work.
- Simplified the command center around a project table, a small attention queue, and concise workspace metrics.
- Removed the redundant project timeline view.
- Added required written feedback to **Request Changes** in approvals and persist it in the review history.
- Made `/demo` open the real app with temporary sample data and no signup wall.
- Added a mobile bottom navigation and fixed the desktop sidebar so it stays in place while content scrolls.
- Added `/devlog` to explain product decisions and `/security` to document implemented security controls.
- Added optional OpenID Connect SSO for Business deployments.
- Clarified annual pricing with the per-month equivalent **and** the total amount billed per year.

## Run locally

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

At minimum, set `JWT_SECRET` to a long random value. Add `MONGODB_URI` to enable real account creation and email/password sign-in. Email delivery is optional in development; when no email provider is configured, verification codes are printed in the server console.

### Demo mode

The public demo uses the same `/app` experience with a temporary signed demo session and sample data. It does not require MongoDB.

```env
ENABLE_DEMO_LOGIN=true
```

Set it to `false` to disable the demo-session endpoint.

## Security and SSO

Password accounts use bcrypt hashing, verified email, and signed HTTP-only session cookies with SameSite protection. Production cookies are marked Secure. Pulse also keeps workspace review/audit history for actions such as approval decisions and change requests.

Optional company SSO uses OpenID Connect authorization code flow with PKCE, state and nonce validation, and signed ID-token verification through the provider's JWKS.

```env
NEXT_PUBLIC_SSO_ENABLED=true
SSO_ISSUER_URL=https://identity.example.com
SSO_CLIENT_ID=pulse
SSO_CLIENT_SECRET=replace-me
SSO_REDIRECT_URI=
SSO_AUTO_PROVISION=true
```

`SSO_REDIRECT_URI` defaults to `<site-origin>/api/auth/sso/callback`. Set `SSO_AUTO_PROVISION=false` when SSO users must already exist in the users collection.

See `/security` for the user-facing security overview. It intentionally documents implemented controls without claiming certifications that have not been completed.

## Project structure

```text
app/                 Next.js routes and API handlers
components/          Public site, auth, and product UI
components/app-shell App workspace shell and screens
lib/                 Auth, database, mock data, email, and OIDC helpers
stores/              Persisted Zustand workspace state
public/              Static assets
```

## Build notes

AI tools were used during early prototyping. The current interface was then reworked against reviewer feedback with an emphasis on hierarchy, responsive behavior, restrained visual styling, and removing generated-looking filler. The public `/devlog` records the latest product decisions in a format that is easier to review than a giant changelog.

## License

All rights reserved. See [LICENSE](LICENSE) for details.

No one is allowed to copy, redistribute, host, resell, or claim this work as their own without written permission from the copyright holder.
