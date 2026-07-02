# Survesy — Frontend (Survey SaaS Platform)

A modern survey platform frontend built with React 19, TypeScript, TanStack Router/Start, TanStack Query, shadcn/ui (Radix), Tailwind CSS, and Recharts.

Admins build multi-section surveys with a visual rule engine, publish them with one click, and share them by public link or email invitation. Respondents answer through a public page — no account required. The backend for this project lives in the companion repo: `backend-saas-platform`.

> **100% free platform** — every feature is included, with no subscription, billing, or payment module.

---

## Features

### Landing Page

Premium marketing page (`/`) with an animated rule-engine demo in the hero, honest product-fact stats, capability marquee, bento feature grid, accordion FAQ, and light/dark theme toggle. All copy reflects features that actually ship.

### Survey Builder (4-step wizard)

* **Information** — title, description, category
* **Build** — sections, questions (10 types: text, number, email, phone, dropdown, radio, checkbox, date, file, rating), and the visual rules editor
* **Preview** — live preview with full rule evaluation as you answer
* **Publish** — save as draft or publish (client-side pre-publish validation)

### Rule Engine (Conditional Logic)

The client-side engine in `src/lib/rule-engine.ts` mirrors the backend exactly, so preview, public survey, and server validation always agree.

* 8 operators: equals, does not equal, greater than, less than, contains, does not contain, is empty, is not empty
* 6 actions: show, hide, require, make optional, enable, disable
* SHOW-targeted questions are hidden by default until their rule matches
* Rules apply in order; later rules win on conflict

### Survey Management

* Survey list with search + status filter (Draft / Published / Closed)
* One-click **Publish**, **Close**, and **Reopen** from the row menu
* Edit dialog (title, description)
* **Share dialog**: copy the public link or send email invitations (up to 20 recipients, optional personal message — delivered in the background)
* Delete with cascade confirmation

### Public Survey Taking — `/survey/:id`

* Works without login — fetches the public endpoint, so anyone with the link can respond
* Full rule evaluation while answering (visibility, required, enabled states)
* All 10 question types rendered
* Client-side required-answer validation before submit (server re-validates)
* Clear unavailable states (unpublished, closed, or expired surveys)

### Auth Flow

* Login / Register with email verification
* **Forgot password** → branded reset email → **`/reset-password`** page (token validation, password confirmation, minimum length)
* JWT storage with automatic Authorization header + 401 redirect handling

### Dashboard & Analytics

Total surveys/responses/users, published vs. draft counts, response statistics, most popular survey, recent activity, per-survey analytics, and response browsing with answer details.

### Admin

User management, roles & permissions (RBAC-gated UI), audit log viewer, notifications, profile & settings.

---

## Tech Stack

React 19 · TypeScript · TanStack Router (file-based routing) · TanStack Query v5 · shadcn/ui + Radix · Tailwind CSS · React Hook Form + Zod · Axios · Recharts · Vite · sonner (toasts)

---

## Project Structure

```
src/
├── routes/                      # File-based routes
│   ├── index.tsx                # Landing page
│   ├── login.tsx / register.tsx
│   ├── forgot-password.tsx      # Sends real reset email
│   ├── reset-password.tsx       # Token-based password reset
│   ├── verify-email.tsx
│   ├── survey.$id.tsx           # PUBLIC survey-taking page (no auth)
│   └── _app.*.tsx               # Authenticated app (dashboard, surveys,
│                                #   responses, analytics, users, roles…)
├── features/
│   ├── auth/                    # API, hooks, types, pages
│   └── surveys/                 # API, hooks (publish/close/share/public…), services
├── lib/
│   ├── rule-engine.ts           # Shared rule engine (mirrors backend)
│   ├── types.ts                 # Domain types (Rule, Question, Section…)
│   └── theme.ts                 # Light/dark theme
├── components/ui/               # shadcn/ui components
└── shared/api/axios.ts          # Axios instance + auth interceptors
```

---

## Getting Started

### Prerequisites

Node.js 18+ and the backend running (see `backend-saas-platform`).

### Setup

```bash
npm install
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
npm run dev        # http://localhost:3000
```

### Environment Variables

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development-mode build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

---

## Key Flows

**Create → Publish → Share → Analyze**

1. `Surveys → Create Survey` — walk the 4-step wizard; add rules like *IF "Team size" is greater than 50 THEN require "Department"*.
2. Publish from step 4, or later via the row menu on the survey list.
3. Row menu → **Share** — copy the public link or send email invitations.
4. Respondents open `/survey/:id` and answer without signing in; rules run live.
5. Watch results under **Responses** and **Analytics**.

**Password reset**

`/forgot-password` → email with reset link (sent in background) → `/reset-password?token=…` → new password → confirmation email → sign in.

## Notes

* Emails (verification, reset, invitations) are sent by the backend in the background — the UI never blocks on delivery.
* `src/routeTree.gen.ts` is generated by the TanStack Router Vite plugin; it refreshes automatically on `npm run dev`.
