# Siren Communication — Full-Stack Marketing Agency Website

A full-stack Next.js 16 (App Router) website for **Siren Communication**, a marketing and branding agency. Includes a public-facing frontend, a CMS admin backend, lead management, and blog system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Animations | Framer Motion |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v4 (Credentials provider, JWT) |
| Forms | React Hook Form + Zod |
| Email | Resend (abstracted via `lib/email.ts`) |
| Icons | lucide-react |

---

## Prerequisites

- **Node.js 20+** (Next.js 16 requires `>=20.9.0`)
  - Install via [nvm](https://github.com/nvm/nvm): `nvm install 20 && nvm use 20`
  - Or upgrade via [nodejs.org](https://nodejs.org)
- PostgreSQL (local or managed: Neon, Supabase, etc.)

> If you see `"You are using Node.js 18.x. For Next.js, Node.js version >=20.9.0 is required"`, upgrade Node.js first.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Required
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/siren_bd?schema=public"
NEXTAUTH_SECRET="your-secret-32-chars-minimum"
NEXTAUTH_URL="http://localhost:3000"

# Optional (email notifications)
RESEND_API_KEY="re_your_key"
EMAIL_FROM="Siren Communication <noreply@sirenbd.com>"
ADMIN_EMAIL="siren.infos@gmail.com"
```

Generate a `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Set up PostgreSQL

Create the database (local example):
```bash
createdb siren_bd
# or: psql -c "CREATE DATABASE siren_bd;"
```

Or use a managed service like [Neon](https://neon.tech) (recommended for Vercel deployment) and paste the connection string.

### 4. Run migrations

```bash
npm run db:migrate
```

This applies all pending migrations. On first run, it creates all tables.

### 5. Seed the database

```bash
npm run db:seed
```

This seeds:
- 1 admin user
- 6 services
- 1 stat
- 1 author (Saif)
- 3 categories
- 5 blog posts
- 6 placeholder client logos
- Site settings

**Admin credentials printed to console during seed:**
- Email: `admin@sirenbd.com`
- Password: `SirenAdmin2026!`

### 6. Start development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Key URLs

| Path | Description |
|---|---|
| `/` | Home page |
| `/about-us` | About Us |
| `/services` | Services |
| `/influencer` | Influencer Marketing |
| `/blog` | Siren Buzz blog |
| `/contact` | Contact & Community |
| `/admin` | Admin dashboard (protected) |
| `/admin/login` | Admin login |

---

## Admin Login

After seeding, log in at `/admin/login`:
- **Email:** `admin@sirenbd.com`
- **Password:** `SirenAdmin2026!`

> **Important:** Change the password in production!

### Admin sections:
- **Leads** — View and manage all form submissions, update status (New / Contacted / Closed), filter by source
- **Community** — View community join applications
- **Blog Posts** — Full CRUD for posts, with author and category assignment, publish toggle
- **Authors** — Manage blog authors
- **Categories** — Manage blog categories
- **Services** — Edit service cards (title, description, icon, order)
- **Client Logos** — Manage client logo strips
- **Stats** — Edit animated counter stats

---

## Database Scripts

```bash
npm run db:migrate   # Apply migrations (dev)
npm run db:seed      # Seed initial data
npm run db:studio    # Open Prisma Studio (GUI)
npm run db:push      # Push schema without migration (rapid prototyping)
```

---

## Deployment on Vercel + Neon PostgreSQL

### 1. Create Neon project

1. Go to [neon.tech](https://neon.tech) → create a new project
2. Copy the connection string

### 2. Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repo in the Vercel dashboard.

### 3. Set environment variables in Vercel

```
DATABASE_URL          postgresql://...neon.tech/siren_bd?sslmode=require
NEXTAUTH_SECRET       <run: openssl rand -base64 32>
NEXTAUTH_URL          https://your-domain.vercel.app
RESEND_API_KEY        re_...
EMAIL_FROM            Siren Communication <noreply@sirenbd.com>
ADMIN_EMAIL           siren.infos@gmail.com
```

### 4. Run migrations and seed on production DB

```bash
DATABASE_URL="your-neon-url" npx prisma migrate deploy
DATABASE_URL="your-neon-url" npm run db:seed
```

---

## Forms & Spam Protection

All public forms include:
- **Honeypot field** (`_gotcha`) — hidden field bots fill; submissions rejected
- **Rate limiting** — 3–5 requests per IP per minute (in-memory; swap with Upstash Redis for production)
- **Zod validation** — server-side schema validation
- **Email notifications** — fire-and-forget; never blocks form submission on email failure

### Form sources:
| Form | Source value |
|---|---|
| Home discovery call | `HOME_DISCOVERY` |
| Home callback | `HOME_CALLBACK` |
| Influencer page | `INFLUENCER` |
| Contact page | `CONTACT` |
| Community join | `CommunityApplication` table |

---

## Email

Email is abstracted behind `lib/email.ts`. Uses **Resend** when `RESEND_API_KEY` is set, logs to console otherwise (great for dev).

To swap for **Nodemailer**, update `lib/email.ts`:

```typescript
import nodemailer from "nodemailer";
export async function sendEmail(payload: EmailPayload) {
  const transporter = nodemailer.createTransport({ /* smtp config */ });
  await transporter.sendMail({ from: ..., ...payload });
}
```

---

## TODOs / Production Hardening

- [ ] **Image uploads**: Replace URL fields in admin with Cloudinary/S3 file upload
- [ ] **CAPTCHA**: Add hCaptcha or Cloudflare Turnstile to public forms
- [ ] **Rate limiting**: Replace in-memory limiter with Upstash Redis
- [ ] **Analytics**: Add Vercel Analytics or Plausible
- [ ] **Sitemap**: Add `app/sitemap.ts` and `app/robots.ts`
- [ ] **Markdown**: Add `react-markdown` + `remark-gfm` for blog post body rendering
- [ ] **Google Maps**: Replace map placeholder in contact page with embed
- [ ] **Error tracking**: Add Sentry
- [ ] **OG images**: Dynamic Open Graph images with `@vercel/og`
- [ ] **Admin password change**: Implement settings page for password updates

---

## Project Structure

```
app/
├── (public pages)        Home, About, Services, Blog, Contact, Influencer
├── admin/                Protected admin dashboard
├── api/                  Route handlers (public forms + admin CRUD)
└── layout.tsx            Root layout with providers

components/
├── layout/               Header, Footer
├── home/                 Hero, Services grid, Who We Are, Blog preview, CTA forms
├── shared/               ScrollReveal, AnimatedCounter, FormField, Button, SocialIcons
└── admin/                AdminSidebar, PostForm

lib/
├── auth.ts               NextAuth options (Credentials provider)
├── db.ts                 Prisma client singleton
├── email.ts              Resend abstraction (swap for Nodemailer here)
├── rate-limit.ts         In-memory rate limiter
├── siteConfig.ts         Agency contact info & social links
└── utils.ts              slugify, formatDate, cn, getIp

prisma/
├── schema.prisma         All models with indexes
├── migrations/           SQL migration history
└── seed.ts               Initial data seed
```
