# AI FrontDesk

Never miss a call. Never miss a booking.

A multi-tenant AI voice receptionist SaaS. Businesses sign up, set their availability, and get a live AI phone agent that answers calls, checks real availability, and books appointments automatically, with instant email notifications and a full Stripe billing flow.

Live demo: https://ai-frontdesk-byali.vercel.app

## Why this project

My other AI projects each prove one thing well: a working voice agent, a lead automation pipeline, an agentic RAG system. This one proves something different: that I can build and ship an actual multi-tenant product, not just a script or a single-user demo. Auth, data isolation, billing, and a real deployed URL someone can sign up to and use right now.

## What it does

1. A business signs up and completes onboarding, picking their working days and hours through a structured availability picker
2. They click "Connect Now" and the app programmatically creates a dedicated Retell AI voice agent for their business, wired with two tools: check_availability and book_appointment
3. The AI receptionist answers real phone calls, collects the caller's name, date, time, and phone number, checks real-time availability against that business's own schedule, and books the appointment
4. Every booking is saved instantly and shown on the business owner's dashboard, grouped by day, alongside a recent activity feed
5. The business owner gets an instant email notification the moment a booking happens
6. A built-in Test Call widget lets anyone try the AI receptionist directly from the dashboard, right in the browser, no phone number needed

## Architecture

```
Business Owner
      |
      v
Signup + Onboarding (structured availability picker)
      |
      v
Supabase (Auth + Postgres, Row Level Security per business)
      |
      v
"Connect Now" --> Retell AI API --> dedicated voice agent created per business
      |
      v
Caller dials in / uses the Test Call widget
      |
      v
Retell Agent
      |
      |-- check_availability --> internal availability_slots table (per business, per day)
      |
      |-- book_appointment --> appointments table + activity_log + Gmail SMTP notification
      |
      v
Dashboard shows the booking in real time
```

## Why Python is not used here, and why that is intentional

My other two n8n-based projects (an AI voice agent and an AI lead qualification agent) and my RAG project show two different ends of the stack: pure no-code automation, and custom Python AI engineering. This project sits in a third place on purpose: a real full-stack product. Next.js and TypeScript are the right tool here because the core problem is not automation logic or algorithms, it is auth, multi-tenant data isolation, a billing flow, and a deployed product with a UI, all things a modern web framework is built for.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Auth + Database | Supabase (Postgres, Row Level Security) |
| Voice AI | Retell AI |
| Billing | Stripe (test mode) |
| Email | Gmail SMTP via Nodemailer |
| Hosting | Vercel |
| Notifications | sonner (toasts) |

## Features

- Multi-tenant architecture with real Row Level Security, every business only ever sees its own data
- Structured, per-day availability picker at onboarding and in settings
- Programmatic voice agent creation per business, no manual dashboard configuration
- Real-time availability checking and conflict-safe booking, backed by an internal Postgres schedule, not a third-party calendar dependency
- In-dashboard Test Call widget with a public-demo time limit and an upsell prompt when it ends
- Instant email notifications on signup and on every booking, both with direct contact CTAs
- Grouped appointment list, weekly availability strip, and a recent activity feed on the dashboard
- Full Stripe subscription checkout flow in test mode, clearly labeled as a demo
- A landing page with Open Graph previews, a How It Works section, and an FAQ

## Setup

### Prerequisites

- Node.js
- A free Supabase project
- A Retell AI account
- A Gmail account with an App Password
- A Stripe account (test mode)

### 1. Clone and install

```bash
git clone https://github.com/alibhatti59/ai-receptionist-saas.git
cd ai-receptionist-saas
npm install
```

### 2. Configure environment

Copy .env.example to .env.local and fill in your own values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RETELL_API_KEY=
GMAIL_USER=
GMAIL_APP_PASSWORD=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_GROWTH=
NEXT_PUBLIC_APP_URL=
```

### 3. Set up the database

Run the SQL in supabase/schema.sql (businesses, appointments, availability_slots, activity_log tables, all with Row Level Security policies) in your Supabase project's SQL editor.

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy

Push to GitHub, import the repo in Vercel, add the same environment variables there, and deploy. Update NEXT_PUBLIC_APP_URL to your production URL afterward and re-create any existing agents so their tool URLs point to production.

## Note on billing

Stripe is running in test mode. No real payments are processed. The pricing page clearly states this and provides the standard test card (4242 4242 4242 4242) so anyone can try the full checkout flow themselves.

## Known limitations

- The internal availability system uses a simple 30-minute slot model rather than syncing with an external calendar. This was a deliberate choice to avoid Google's OAuth verification process and its 100-user testing cap, which would block real self-serve signups.
- The Test Call widget's demo time limit is enforced client-side with a server-side maximum as a backstop, not a hard platform-level limit.
- Multi-tenant billing is not yet linked back to a subscription tier on the business record, Stripe checkout demonstrates the flow but does not yet gate features by plan.

## Roadmap

- Link Stripe subscriptions to actual plan limits per business
- SMS notifications alongside email
- A calendar sync option as an add-on, gated behind manual approval given Google's verification requirements
- Multi-location support for businesses with more than one branch

## About

Built by Ali Hassnain Bhatti, AI Automation Engineer specializing in voice agents, AI agents, and full-stack product development.

LinkedIn: https://www.linkedin.com/in/ali-hassnain-bhatti-1a0506312/
Email: <a href="mailto:thealibhatti.dev@gmail.com">thealibhatti.dev@gmail.com</a>
