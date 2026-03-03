# Appointly Made by wolfz80

A production-ready SaaS appointment management system built with Next.js 14, Supabase, and Tailwind CSS.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Deployment**: Vercel
- **Auth**: Supabase Auth with JWT + Row Level Security

---

## ER Diagram

```
┌─────────────────────────────┐         ┌──────────────────────────────────────┐
│          auth.users          │         │            public.users              │
│─────────────────────────────│         │──────────────────────────────────────│
│ id           UUID  (PK)     │────────>│ id           UUID  (PK, FK)          │
│ email        TEXT           │         │ email        TEXT  (UNIQUE, NOT NULL) │
│ ...          (Supabase)     │         │ full_name    TEXT                     │
└─────────────────────────────┘         │ role         TEXT  (admin|staff|      │
                                        │                     client)           │
                                        │ created_at   TIMESTAMPTZ             │
                                        └──────────────────┬───────────────────┘
                                                           │
                                          ┌────────────────┘
                                          │ client_id (FK)
                                          │ staff_id  (FK)
                                          ▼
                              ┌─────────────────────────────────────────┐
                              │            public.appointments           │
                              │─────────────────────────────────────────│
                              │ id           UUID  (PK)                 │
                              │ client_id    UUID  (FK → users.id)      │
                              │ staff_id     UUID  (FK → users.id)      │
                              │ title        TEXT  (NOT NULL)           │
                              │ description  TEXT                       │
                              │ start_time   TIMESTAMPTZ               │
                              │ end_time     TIMESTAMPTZ               │
                              │ status       TEXT  (pending|confirmed|  │
                              │                     cancelled)         │
                              │ created_at   TIMESTAMPTZ               │
                              └─────────────────────────────────────────┘
```

**Relationships:**
- `users.id` → `appointments.client_id` (one-to-many: client books many appointments)
- `users.id` → `appointments.staff_id` (one-to-many: staff handles many appointments)
- Cascade deletes: removing a user removes all their appointments

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── appointments/
│   │   │   ├── route.ts          # GET all, POST create
│   │   │   └── [id]/route.ts     # GET, PATCH, DELETE by ID
│   │   ├── users/
│   │   │   ├── route.ts          # GET all (admin)
│   │   │   └── [id]/route.ts     # PATCH role, DELETE
│   │   └── analytics/
│   │       └── route.ts          # GET analytics (admin)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx            # Shared dashboard layout
│   │   ├── admin/
│   │   │   ├── page.tsx          # Admin overview
│   │   │   ├── users/page.tsx    # User management
│   │   │   ├── appointments/page.tsx
│   │   │   └── analytics/page.tsx
│   │   ├── staff/
│   │   │   ├── page.tsx
│   │   │   └── appointments/page.tsx
│   │   └── client/
│   │       ├── page.tsx
│   │       ├── appointments/page.tsx
│   │       └── book/page.tsx
│   ├── error.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Reusable primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── stats-card.tsx
│   │   └── spinner.tsx
│   ├── layout/                   # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── dashboard-layout.tsx
│   ├── forms/
│   │   └── book-appointment-form.tsx
│   └── dashboard/
│       └── appointment-card.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   └── server.ts             # Server + admin clients
│   ├── validations.ts            # Zod schemas
│   └── utils.ts                  # Shared utilities
├── services/                     # Data access layer
│   ├── appointments.ts
│   └── users.ts
├── types/
│   └── index.ts
└── middleware.ts                  # Auth + role-based routing
```

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/your-org/appointly.git
cd appointly
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Set up the database

Run `supabase/schema.sql` in your Supabase SQL Editor. This creates:
- `users` table with RLS policies
- `appointments` table with RLS policies
- Auto-profile creation trigger on signup

### 4. Create demo accounts

Create these users via Supabase Auth dashboard or the signup page:

| Role   | Email                   | Password     |
|--------|-------------------------|--------------|
| Admin  | admin@appointly.dev     | Admin1234!   |
| Staff  | staff@appointly.dev     | Staff1234!   |
| Client | client@appointly.dev    | Client1234!  |

Then set roles in SQL:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'admin@appointly.dev';
UPDATE public.users SET role = 'staff' WHERE email = 'staff@appointly.dev';
```

### 5. Run locally

```bash
npm run dev
```

---

## API Reference

### Appointments

| Method | Endpoint                  | Auth     | Description                        |
|--------|---------------------------|----------|------------------------------------|
| GET    | `/api/appointments`       | Required | Get appointments (role-filtered)   |
| POST   | `/api/appointments`       | Client   | Create a new appointment           |
| GET    | `/api/appointments/:id`   | Required | Get appointment by ID              |
| PATCH  | `/api/appointments/:id`   | Required | Update appointment (role-gated)    |
| DELETE | `/api/appointments/:id`   | Admin/Client | Delete appointment            |

### Users

| Method | Endpoint          | Auth  | Description          |
|--------|-------------------|-------|----------------------|
| GET    | `/api/users`      | Admin | Get all users        |
| PATCH  | `/api/users/:id`  | Admin | Update user role     |
| DELETE | `/api/users/:id`  | Admin | Delete user          |

### Analytics

| Method | Endpoint          | Auth  | Description          |
|--------|-------------------|-------|----------------------|
| GET    | `/api/analytics`  | Admin | Get system analytics |

---

## Security

- **Middleware**: Every request checks auth + role before serving routes
- **Row Level Security**: PostgreSQL-enforced access control — no data leaks even via direct DB access
- **Service Role**: Used only for admin operations (user deletion) — never exposed to client
- **Zod validation**: All inputs validated server-side before DB writes
- **HTTP status codes**: 401 Unauthorized, 403 Forbidden, 422 Unprocessable, 404 Not Found

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy — zero config required with Next.js

---

Made by wolfz80
