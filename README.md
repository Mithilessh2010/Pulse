# Pulse

Pulse is an AI team operating system built for the messy middle of work: updates, tasks, approvals, expenses, team activity, meetings, calls, and the little follow-ups that usually get lost between tools.

The idea is simple: instead of making a team jump between ten dashboards, Pulse gives them one command center where they can see what needs attention, ask for help, approve work, and turn scattered context into action.

## Screenshots

### Home

![Pulse home screen](_deliverables/home-desktop.png)

### Command Center

![Pulse command center](_deliverables/app-desktop.png)

### Mobile App

![Pulse mobile app](_deliverables/app-mobile-refined.png)

### Import Flow

![Pulse import flow](_deliverables/import-desktop-refined.png)

### Onboarding

![Pulse onboarding](_deliverables/onboarding-desktop.png)

## What It Does

Pulse is designed around the kinds of things a real team checks every day:

- A command center for approvals, blockers, tasks, updates, and team status
- Inbox-style triage for important items that need action
- Task and proof workflows for tracking finished work
- Expense submissions, approvals, exports, and summaries
- AI assistant screens for asking Pulse questions about team activity
- Reports and generated updates for sharing progress
- Meeting, call, chat, team, playbook, and import views
- A polished responsive UI for desktop and mobile

This is still an early product build, but the core app experience is already there.

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Zustand
- MongoDB auth utilities
- Vercel deployment

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open the local URL that Next prints in the terminal, usually:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

## Temp Test Login

For local testing, the sign-in page includes a temp test login button. It creates a local development session so the app can be tested without going through the full auth flow every time.

The temp login is disabled in production by default. To intentionally allow it in a production-like environment, set:

```bash
ENABLE_TEMP_LOGIN=true
```

Do not enable that on a real public production deployment.

## Project Notes

This repo is private product work, not an open-source starter. The UI, product direction, code, screenshots, and assets are part of Pulse.

## License

All rights reserved. See [LICENSE](LICENSE) for details.

No one is allowed to copy, redistribute, host, resell, or claim this work as their own without written permission from the copyright holder.
