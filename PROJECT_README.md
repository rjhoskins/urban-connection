# Climate Effectiveness Progress Monitoring Assessment - Codebase Documentation

## Overview

Climate Effectiveness Progress Monitoring Assessment is a SvelteKit-based web application for managing culturally responsive teaching assessments across school districts. It enables administrators to create schools, invite users, and track assessment progress for evaluating teaching effectiveness.

## Routes & Purpose

### Authentication Routes (`(auth)`)

- **`/auth/login`** - User login page
- **`/auth/register`** - User registration from admin invite

### Application Routes (`(app)`)

- **`/`** - Main dashboard (role-based: UC Admin, District Admin, School Admin)
- **`/create-school`** - Create new school and send admin invite
- **`/schools`** - View all schools
- **`/schools/[schoolId]`** - School dashboard with assessment overview
- **`/schools/[schoolId]/results`** - School-wide assessment results
- **`/schools/[schoolId]/invite-coadmin`** - Invite co-admin for school
- **`/districts`** - Manage all districts
- **`/districts/[districtId]`** - District overview
- **`/districts/[districtId]/schools/[schoolId]`** - School details within district
- **`/districts/[districtId]/schools/[schoolId]/results`** - District-level school results
- **`/districts/[districtId]/schools/[schoolId]/member-data`** - Individual member assessments
- **`/districts/[districtId]/schools/[schoolId]/invite-coadmin`** - Invite co-admin (nested)
- **`/results`** - Global assessment results dashboard
- **`/templates`** - Manage HTML email templates
- **`/templates/[templateType]`** - Edit specific email template

### Assessment Routes (`(assessment)`)

- **`/assessment-welcome`** - Assessment entry with demographics form
- **`/urban-connection-project-assessment`** - Main assessment questionnaire
- **`/thank-you`** - Assessment completion thank you page

### API Routes

- **`/api/send-coadmin-invite`** - Send admin invitation emails
- **`/api/create-assessment-invite`** - Generate assessment invite links
- **`/api/stripe/*`** - Stripe payment integration endpoints

### Special Routes

- **`/contact-us`** - Contact page
- **`/sentry-example`** - Error tracking example
- **`/+error.svelte`** - Global error handler

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     SvelteKit Application Layer                 │
│  Routes: Auth, App, Assessment with Layout Hierarchies          │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┬──────────────────┐
        │                         │                  │
┌───────▼──────────┐  ┌──────────▼────────┐  ┌──────▼──────────┐
│  Page Components │  │ Form Components   │  │  UI Components  │
│  (+page.svelte)  │  │  (+server.ts)     │  │  (Shadcn, etc)  │
└────────┬─────────┘  └──────────┬────────┘  └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
        ┌────────────▼──────────┐
        │   State Management    │
        ├──────────────────────┤
        │ • Modal State        │
        │ • Globals State      │
        │ • User Store         │
        └────────────┬─────────┘
                     │
        ┌────────────▼──────────────────────┐
        │   Data Layer (Server)              │
        ├───────────────────────────────────┤
        │ • Drizzle ORM Queries             │
        │ • Server Actions                  │
        │ • Database Schema                 │
        │ • Authentication (Lucia)          │
        └────────────┬──────────────────────┘
                     │
        ┌────────────▼──────────────────────┐
        │   PostgreSQL Database              │
        ├───────────────────────────────────┤
        │ • Users & Roles                   │
        │ • Schools & Districts             │
        │ • Assessments & Responses         │
        │ • Email Templates                 │
        └───────────────────────────────────┘
```

### Database Schema (`src/lib/server/db/schema/`)

**Core Tables:**

- `users` - User accounts with roles (school_admin, district_admin, uc_admin)
- `admin_user_invites` - Invitation tokens for admin registration
- `districts` - District entities
- `schools` - School entities with district references
- `district_admins` - District admin assignments
- `school_admins` - School admin assignments

**Assessment Tables:**

- `assessments` - Assessment instances per school
- `assessment_invites` - Public links for assessment participation
- `assessment_demographics_responses` - Participant demographics data
- `assessment_domains` - Main assessment categories (4 domains)
- `assessment_sub_domains` - Sub-categories within domains
- `assessment_questions` - Individual assessment descriptors
- `assessment_questions_responses` - User responses to questions

**Email Templates:**

- `html_email_templates` - Customizable email templates for invitations

### Key Components

```
src/lib/components/
├── Forms/
│   ├── login-form.svelte
│   ├── register-form.svelte
│   ├── create-school-form.svelte
│   ├── demographics-form.svelte
│   ├── assessment-questions-form.svelte
│   ├── invite-co-admin-form.svelte
│   └── generic-invite-form.svelte (email templates)
│
├── Modals/
│   ├── resume-assessment-modal.svelte
│   └── youtube-vids-modal.svelte
│
├── Dashboard/
│   ├── uc-admin-panel.svelte (UC Admin menu)
│   ├── district-admin-panel.svelte
│   ├── schooladmin-admin-panel.svelte
│   ├── school-grid-card.svelte
│   ├── school-list-table.svelte
│   └── assessment-domain-progress-card.svelte
│
└── UI/
    ├── card/ → Shadcn card component
    ├── button/ → Shadcn button component
    ├── form/ → Form binding components
    ├── dialog/ → Modal dialogs
    └── ...other Shadcn components
```

### State Management

**Modal State** (`src/lib/modal-state.svelte.ts`)

- Manages assessment navigation state
- Tracks current domain/subdomain position
- Controls modal visibility (resume assessment, video tutorials)

**Globals State** (`src/lib/store/globals-state.svelte`)

- Page title management
- Global configuration

**User Store** (`src/lib/store/users.svelte.ts`)

- User role management

### Assessment Flow

```
Assessment User Journey:
┌──────────────┐
│  Assessment  │
│    Invite    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Assessment Welcome   │
│  + Demographics Form │
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────────────┐
│ Main Assessment Form             │
│ • 4 Domains                      │
│ • Multiple Subdomains each       │
│ • Video tutorials per subdomain  │
│ • 50+ descriptors total          │
└──────┬──────────────────────────┘
       │
       ▼
┌──────────────┐
│  Thank You   │
└──────────────┘
```

### Assessment Content Structure

**4 Main Domains:**

1. **Cultural Awareness** (24 points)

   - Cultural Awareness subdomain
   - Mentorship subdomain
   - Representation subdomain
   - Community Involvement subdomain

2. **Relationships** (30 points)

   - Peaceful Resolution
   - Positive Reinforcements
   - Student Concern Process
   - Knowledge of Students
   - Endearment

3. **Systems** (26 points)

   - Systemic Expectations
   - Behavior Interventions
   - Restorative Practices

4. **Rigorous & Accessible Content** (21 points)
   - Lesson Planning
   - Real-Time Assessments
   - Assessments

Each subdomain contains 3-7 descriptors (yes/no questions)

### Utilities & Helpers

**`src/lib/utils.ts`**

- `cn()` - Class name merging (clsx + tailwind-merge)
- `slugify()` - URL-safe slug generation
- `transformAssessmentData()` - Assessment response transformation
- `getScoreBackgroundColor()` - Score visualization colors
- `handleLogFlashReturnFormError()` - Error handling with flash messages

**`src/lib/constants.ts`**

- `RUBRIC_DATA` - Complete assessment structure (domains/subdomains/descriptors)
- `demographicsQuestionsData` - Demographic form field definitions
- `videoIdMap` - YouTube video ID mappings for tutorials
- `INITIAL_HTML_DATA` - Default email template content

**`src/lib/server/queries.ts`**

- Database query functions using Drizzle ORM
- Complex joins for assessment data aggregation
- User authorization checks by role

---

## Technology Stack

**Frontend:**

- SvelteKit (full-stack framework)
- Svelte 5 (reactive components)
- TailwindCSS (styling)
- Shadcn-Svelte (component library)
- Sveltekit-Superforms (form handling)
- Zod (validation)

**Backend:**

- SvelteKit server routes
- Lucia (authentication)
- Drizzle ORM (database)
- Node.js/Argon2 (password hashing)

**Database:**

- PostgreSQL (production)
- Docker Compose (local development)

**Email:**

- Nodemailer (SMTP)
- Mailtrap (development)

**Payments:**

- Stripe (subscription management)

**Monitoring:**

- Sentry (error tracking)

**Development:**

- Vite (build tool)
- Playwright (e2e testing)
- ESLint (linting)
- Prettier (formatting)
- PNPM (package manager)

---

## Key Features

### Role-Based Access Control

- **UC Admin** - Manage all districts and schools
- **District Admin** - Manage schools within district
- **School Admin** - Manage school staff and view assessments
- **Teachers** - Take assessments

### Assessment Management

- Create reusable assessment invitations
- Share assessment links via email
- Resume in-progress assessments
- Track completion status (sent, started, completed)
- View detailed results by domain/subdomain
- Compare school and district performance

### Email Templates

- Customizable HTML email templates
- Template preview system
- WYSIWYG editing for admin invites
- Separate templates for different user types

### Data Visualization

- Donut charts for assessment completion
- Progress bars for score visualization
- Color-coded performance (green >80%, yellow 50-80%, red <50%)
- Grid and list view options
- Member assessment tracking tables

---

## Development Setup

**Prerequisites:**

```bash
- Node.js 18+
- PNPM
- PostgreSQL (via Docker)
- Stripe account (optional for payments)
```

**Installation:**

```bash
pnpm install
cp .env.example .env
pnpm run db:start          # Start PostgreSQL container
pnpm run db:push           # Apply schema migrations
pnpm run db:seed           # Seed initial data
pnpm run dev               # Start dev server
```

**Key Scripts:**

- `pnpm run dev` - Start development server
- `pnpm run build` - Production build
- `pnpm run db:push` - Apply Drizzle migrations
- `pnpm run db:seed` - Seed database
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format with Prettier

---

## File Organization

```
src/
├── routes/                    # SvelteKit pages and layouts
│   ├── (auth)/               # Authentication routes
│   ├── (app)/                # Admin dashboard routes
│   ├── (assessment)/         # Assessment routes
│   └── api/                  # API endpoints
├── lib/
│   ├── components/           # Reusable Svelte components
│   ├── server/               # Server-only code
│   │   ├── db/              # Database & schema
│   │   ├── auth.ts          # Authentication logic
│   │   └── queries.ts       # Database queries
│   ├── store/               # Svelte stores (state)
│   ├── schema.ts            # Zod validation schemas
│   ├── constants.ts         # App constants & rubric data
│   ├── utils.ts             # Utility functions
│   └── types/               # TypeScript type definitions
├── app.html                 # Root HTML template
└── app.css                  # Global styles
```

---

## Database Relationships

```
users (1) ──┬──> (M) admin_user_invites
            ├──> (M) district_admins
            └──> (M) school_admins

districts (1) ──┬──> (M) schools
                └──> (M) district_admins

schools (1) ──┬──> (M) school_admins
              ├──> (M) assessments
              └──> (M) assessment_demographics_responses

assessments (1) ──┬──> (M) assessment_questions_responses
                  └──> (1) assessment_demographics_responses

assessment_domains (1) ──> (M) assessment_sub_domains
assessment_sub_domains (1) ──> (M) assessment_questions
assessment_questions (1) ──> (M) assessment_questions_responses
```

---

## Common Development Tasks

### Adding a New Page

1. Create route in `src/routes/(app)/my-page/+page.svelte`
2. Add `+page.server.ts` for data loading
3. Add form validation schema to `src/lib/schema.ts`
4. Use SvelteKit's `load` function for data fetching

### Creating a Database Query

1. Define in `src/lib/server/queries.ts`
2. Use Drizzle ORM functions (select, where, and, etc.)
3. Export the async function
4. Import in `+page.server.ts` load/action

### Styling Components

- Use TailwindCSS classes directly in components
- Keep custom styles in `src/app.css` for global styles
- Use `cn()` utility for conditional class merging

### Form Handling

- Use Sveltekit-Superforms for form state
- Create Zod schema in `src/lib/schema.ts`
- Use `superForm()` in component for reactive binding
- Validate on server with `superValidate()`

---

## Notes for Contributors

- Assessment content (descriptors) stored in `src/lib/constants.ts`
- Email template HTML edited via UI and stored in database
- Assessment progress tracked by: sent → started → completed
- User roles: school_admin, district_admin, uc_admin
- All timestamps use UTC timezone with `withTimezone: true`
- ULID used for all primary keys (sortable, distributed-friendly)
