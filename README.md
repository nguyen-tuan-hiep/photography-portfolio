# Hiep Photography Portfolio

A deploy-ready photography portfolio built with Next.js App Router, TypeScript, Tailwind CSS, Supabase, and Cloudinary.

## Features

- Editorial public portfolio with public and direct-link unlisted albums
- Responsive gallery and keyboard-accessible lightbox
- Inquiry form stored in Supabase
- Supabase email/password admin authentication
- Album CRUD, visibility controls, share links, multi-image uploads, cover selection, and deletion
- Server-only Cloudinary credentials and uploads
- Demo content fallback when environment variables are not configured

## Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values.
3. Start the app: `npm run dev`
4. Open `http://localhost:3000`.

Without environment variables the public pages use bundled demo data. Admin mutations require Supabase.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`.
   If upgrading an existing installation, also run `supabase/migrations/002_site_settings.sql` to enable homepage editing.
   Run `supabase/migrations/003_inquiry_whatsapp.sql` to replace the inquiry Instagram field with WhatsApp.
3. Optionally run `supabase/seed.sql` for preview content. The seed uses remote Unsplash images and fake public IDs; deleting seeded images from the admin may return a harmless Cloudinary “not found” result.
4. Copy the project URL and anon key from **Project Settings → API**.
5. Copy the service-role key into `SUPABASE_SERVICE_ROLE_KEY`. This variable must only exist server-side.

### Create the first admin

In Supabase, open **Authentication → Users → Add user**, create an email/password user, and mark the email confirmed. Every authenticated account is treated as an admin, so disable public signups in **Authentication → Providers → Email** and only create trusted users from the dashboard.

## Cloudinary setup

1. Create a Cloudinary account and open the API Keys page.
2. Add the cloud name, API key, and API secret to `.env.local`.
3. Uploaded files are stored under `portfolio/<album-id>`.

Uploads pass through `app/api/cloudinary/upload/route.ts`. The route verifies the Supabase session before using server-side Cloudinary credentials. Files are limited to images, 15 MB each, and 30 per request.

## Unlisted album security

RLS only grants anonymous database reads for public albums. The exact `/albums/[slug]` server route uses the service role to resolve public or unlisted albums. Unlisted records never appear in album listings. Draft records are rejected by the route. An unlisted URL is a bearer link, not password protection.

## Deploy to Vercel

1. Push the project to a Git repository and import it in Vercel.
2. Add every variable from `.env.example` in **Project Settings → Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
3. Deploy. The standard build command is `npm run build`.
4. Add the Vercel production URL to Supabase **Authentication → URL Configuration → Site URL**.

## Commands

- `npx prettier . --write` — format code
- `npm run dev` — local development
- `npm run build` — production build
- `npm run typecheck` — TypeScript validation
