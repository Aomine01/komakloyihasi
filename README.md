# Ko'mak — Yoshlar ta'lim loyihasi

Production-ready website for the Ko'mak initiative — an Uzbek government social project providing interest-free loans for foreign language teaching centers in remote regions.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS with custom Stitch design tokens
- **Database/Auth**: MySQL + Drizzle ORM + NextAuth.js
- **File Storage**: Local disk (`/public/uploads/projects/`)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Drag & Drop**: dnd-kit
- **Icons**: Lucide React

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd komakWebSite
npm install
```

### 2. Configure environment

Copy `.env.local.example` to `.env.local`:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_cpanel_db_username
DB_PASSWORD=your_cpanel_db_password
DB_NAME=your_database_name

NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://yourdomain.uz

ADMIN_EMAIL=admin@yourdomain.uz
ADMIN_PASSWORD_HASH=bcrypt-hash-of-your-password
```

### 3. Database Setup on Ahost

1. Log in to Ahost cPanel
2. Go to MySQL Databases
3. Create a new database (e.g. komak_db)
4. Create a new user (e.g. komak_user) with a strong password
5. Add the user to the database with **ALL PRIVILEGES**
6. Fill in the `DB_*` variables in `.env.local`

### 4. Admin Account Setup (One-time)

Run this in Node.js REPL or a script to generate your password hash:
```javascript
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('your-chosen-password', 10));
```
Copy the output hash into `ADMIN_PASSWORD_HASH` in `.env.local`.

### 5. Run Migrations & Seed Data

```bash
npm run db:push       # pushes schema to MySQL
npm run db:seed       # inserts all seed data + admin user
```

### 6. Generate NextAuth Secret

```bash
openssl rand -base64 32
```
Copy output into `NEXTAUTH_SECRET` in `.env.local`.

### 7. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment (Ahost)

### Build

```bash
npm run build
```

This generates a standalone build in `.next/standalone/`.

### Deploy

1. Upload the `.next/standalone/` directory to Ahost
2. Copy `.next/static/` into `.next/standalone/.next/static/`
3. Copy `public/` into `.next/standalone/public/`
4. Start: `node .next/standalone/server.js`

### ⚠️ CRITICAL: File Uploads

Project photos are stored on disk at `/public/uploads/projects/`. This directory:

- **MUST persist** across deployments
- **MUST NOT** be overwritten during redeploy
- Contains actual uploaded images referenced in the database

When redeploying, always preserve the `/public/uploads/projects/` directory.

## Project Structure

```
app/
  layout.tsx          — Root layout with Google Fonts
  page.tsx            — ISR homepage (revalidate: 3600)
  admin/              — Protected admin panel
    login/            — Supabase email/password auth
    dashboard/        — Summary + recent callbacks
    projects/         — CRUD with local disk photo upload
    faqs/             — Drag-reorder with dnd-kit
    callbacks/        — Status management + CSV export
    stats/            — Inline stat editor
  api/
    callback/         — Public callback form submission
    admin/upload/     — Multipart file upload (formidable)
    admin/delete-photo/ — File deletion from disk
components/
  sections/           — Hero, Stats, HowItWorks, Komakchilar, FAQ, CallbackForm, Footer
  ui/                 — Navbar, ViloyatCard, ProjectCard, ImageUpload
lib/
  supabase.ts         — Browser + server Supabase clients
  types.ts            — TypeScript interfaces
  upload.ts           — Disk write helper
```

## License

© 2025 Ko'mak loyihasi. Yoshlar Fondi tomonidan amalga oshirilmoqda.
