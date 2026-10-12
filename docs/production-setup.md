# Production setup

This repository contains the production integration points, but external credentials must be supplied by the project owner. Never commit any of these values.

## Required services

1. A managed PostgreSQL database, such as Neon or Prisma Postgres.
2. An Auth.js `AUTH_SECRET`.
3. A LinkedIn application with the approved OpenID Connect product enabled.
4. An OpenAI API key for server-side search parsing.

## Local setup

```bash
copy .env.example .env.local
npm install
npm run db:generate
npm run db:migrate -- --name initial
npm run db:seed
npm run dev
```

Set the values in `.env.local` before running migration or seed commands. The app does not print secret values.

## LinkedIn callback

Configure the LinkedIn application callback URL as:

```text
http://localhost:3000/api/auth/callback/linkedin
```

For production, use:

```text
https://YOUR_DOMAIN/api/auth/callback/linkedin
```

The configured scope is `openid profile email`. This authenticates the member and supports the member&apos;s own identity. It does not provide arbitrary LinkedIn people search or permission to scrape profiles.

## Vercel environment variables

Add these variables to the Vercel project for Preview and Production environments:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_LINKEDIN_ID`
- `AUTH_LINKEDIN_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `NEXT_PUBLIC_APP_URL`

Then run the migration against the production database through a controlled release process. Do not run destructive schema commands against production.

## Current limitation

The UI still includes demo-mode data so the prototype remains browsable without credentials. Once authentication and database variables are present, the API routes provide the persistent production path. The frontend should be switched from demo state to API-backed state as the next release step.
