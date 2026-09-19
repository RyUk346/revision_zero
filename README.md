# Revision Zero — Steel Detailing Website + Admin CMS

A full-stack clone of a steel-detailing company website, rebuilt with **Next.js (App Router)**, **Tailwind CSS**, **Prisma + SQLite** and **NextAuth**. Every public page is driven by a database, and a complete **admin panel** lets you manage all content.

> All copy and imagery in this project is original placeholder content. Images are generated as CSS gradients/blueprint patterns, so there are no external image dependencies or copyrighted assets.

---

## ✨ Features

### Public site
- **Home** — hero, about, sector cards, services, featured projects, partner/software strip, CTA
- **Who We Are** — team members with bios, roles and social links
- **Projects** — overview of every sector, plus a page per category (Animation, Mining & Resources, Bridges, Commercial & Light Industrial, Health & Education)
- **Services** — full service list with icons
- **News** — article listing + individual article pages
- **Careers** — job listings + individual job pages with an **application form**
- **Contact** — contact form (saved to the database)
- **Schedule a Call** — call-request form (saved to the database)
- **Terms of Use**, **Privacy Policy**, **Sitemap**
- Custom **404** page, fully responsive, mobile nav

### Admin panel (`/admin`)
Protected by NextAuth (credentials). Manage everything:
- **Dashboard** — content counts + recent messages/calls
- **Projects** & **Categories** — full CRUD
- **Services** — full CRUD (with icon picker)
- **News** — full CRUD (draft/publish, dates)
- **Team** — full CRUD
- **Careers** — full CRUD (+ application counts)
- **Partners** — software partners & accreditations
- **Messages** — read/unread, delete (from the contact form)
- **Call Requests** — status workflow, delete
- **Applications** — status workflow, delete
- **Settings** — brand, homepage copy, contact details, social links, footer

Editing content in the admin instantly revalidates the public site.

---

## 🧰 Tech stack

| Concern        | Choice                          |
|----------------|---------------------------------|
| Framework      | Next.js 14 (App Router, RSC)    |
| Styling        | Tailwind CSS                    |
| Database       | SQLite via Prisma ORM           |
| Auth           | NextAuth (Credentials + JWT)    |
| Passwords      | bcryptjs                        |
| Icons          | lucide-react                    |
| Language       | TypeScript                      |

Mutations use **Server Actions**; admin routes are guarded by **middleware** *and* a server-side session check.

---

## 🚀 Getting started

### 1. Install dependencies
```bash
npm install
```
> `postinstall` automatically runs `prisma generate`.

### 2. Environment variables
A ready-to-use `.env` is included for local development. (`.env.example` documents every variable.) For production, set a strong `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Create the database & seed demo content
```bash
npm run setup
```
This runs `prisma db push` (creates the SQLite tables) **and** seeds projects, services, team, news, careers, partners and an admin user.

> Already created the DB from an earlier version? Just run `npm run setup` again — `prisma db push` adds the new image/video columns and the seed refreshes the demo content. (Or `npm run db:reset` for a clean slate.)

### 4. Run the dev server
```bash
npm run dev
```
Open **http://localhost:3000** for the site and **http://localhost:3000/admin** for the CMS.

---

## 🔑 Admin login (seeded)

| Email                        | Password   |
|------------------------------|------------|
| `admin@revisionzero.local`   | `admin123` |

Change these via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` before seeding, or update the user later in Prisma Studio.

---

## 📜 Scripts

| Script              | What it does                                          |
|---------------------|------------------------------------------------------|
| `npm run dev`       | Start the dev server                                 |
| `npm run build`     | `prisma generate` + production build                  |
| `npm run start`     | Start the production server                           |
| `npm run setup`     | Create tables **and** seed demo data                 |
| `npm run db:push`   | Create/update tables from the schema                 |
| `npm run db:seed`   | Seed demo data                                        |
| `npm run db:studio` | Open Prisma Studio (visual DB browser)               |
| `npm run db:reset`  | Wipe + recreate + reseed the database                |

> **Before `npm run build`**, make sure the database exists (`npm run db:push`). The build pre-renders pages and reads from the DB.

---

## 🗂️ Project structure

```
.
├── prisma/
│   ├── schema.prisma        # Data models
│   └── seed.ts              # Demo content + admin user
├── src/
│   ├── actions/             # Server actions (CRUD + form handlers)
│   ├── app/
│   │   ├── (site)/          # Public pages (shared header/footer layout)
│   │   ├── admin/
│   │   │   ├── login/       # Login page (public)
│   │   │   └── (panel)/     # Protected admin screens (sidebar layout)
│   │   ├── api/auth/        # NextAuth route handler
│   │   ├── globals.css
│   │   ├── layout.tsx       # Root layout (fonts + SessionProvider)
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── admin/           # Sidebar, tables, form helpers, buttons
│   │   ├── forms/           # Public forms (contact, call, application)
│   │   ├── providers/       # SessionProvider wrapper
│   │   ├── site/            # Header, Footer, PageHeader
│   │   └── ui/              # Placeholder, Icon
│   ├── lib/                 # prisma client, auth, settings, utils, session
│   ├── types/               # NextAuth type augmentation
│   └── middleware.ts        # Protects /admin
└── ...config files
```

---

## 🧱 Data model overview

`User`, `ProjectCategory`, `Project`, `Service`, `NewsPost`, `TeamMember`, `JobPosting`, `JobApplication`, `ContactSubmission`, `CallRequest`, `Partner`, `SiteSetting`.

Deleting a category cascades to its projects. Site-wide content (company name, hero, contact details, social links) lives in the `SiteSetting` singleton, editable from **Admin → Settings**.

---

## 🖼️ About the imagery

Projects, news, team, categories, partners and the hero/logos use **real image and video URLs** (referenced from the source site's CDN) stored on each record. The `RemoteImage` component renders the image when a URL is set and falls back to a deterministic gradient (with an `imageColor` seed) when it isn't — so the site still looks complete if an image is ever missing. Animation projects store an `videoUrl` (MP4) that plays inline on the category page. Every image/video/logo URL is editable in the admin (per record, and in **Settings** for the logos and hero).

---

## Deployment notes

- SQLite is great for local/demo use. For production (e.g. Vercel), switch the Prisma datasource to Postgres/MySQL and update `DATABASE_URL`.
- Always set a strong `NEXTAUTH_SECRET` and the correct `NEXTAUTH_URL` in production.

---

Built as a demonstration project. Replace the placeholder legal text and contact details before any real-world use.
