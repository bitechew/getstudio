# AURA STUDIO Booking Platform

A production-ready Next.js photo studio booking website with authentication, a booking engine, admin dashboard, gallery management, pricing, contact forms, and SEO metadata.

## Features

- Premium responsive UI with dark/light mode
- Online booking with time overlap prevention and operating-hour validation
- Customer auth with NextAuth credentials
- Admin dashboard for bookings, pricing, settings, gallery, and operating hours
- SEO metadata, sitemap, robots, and contact API
- Prisma + PostgreSQL support with fallback JSON storage for local/demo use

## Local Development

1. Install dependencies
   ```bash
   npm install
   ```
2. Copy the environment file
   ```bash
   cp .env.example .env
   ```
3. Start PostgreSQL and set DATABASE_URL in your environment.
4. Generate Prisma client and run migrations
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Seed sample data
   ```bash
   npm run prisma:seed
   ```
6. Launch the app
   ```bash
   npm run dev
   ```

## Production Deployment

### Frontend (Vercel)
- Connect the GitHub repository to Vercel.
- Set environment variables:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `NEXT_PUBLIC_SITE_URL`
- Deploy.

### Backend / Database
- Use Neon, Supabase, or any PostgreSQL provider.
- Run migrations in production:
  ```bash
  npx prisma migrate deploy
  ```

### Docker
```bash
docker compose up --build
```

## Scripts

- `npm run dev` - local development server
- `npm run build` - production build
- `npm run start` - production server
- `npm run lint` - lint checks
