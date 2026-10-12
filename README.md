# Layer

Layer is an opt-in professional people-discovery product. Users describe who they want to find in natural language, review the extracted filters, and search approved profile records with visible provenance and explainable matches.

## Current prototype

The current prototype includes a complete clickable product flow:

- natural-language search with extracted-filter review;
- Easwari Engineering College alumni demo search for 2018–2022;
- visible profile cards and profile detail pages;
- directory browsing and filtering;
- opt-in profile creation with consent controls;
- LinkedIn connection placeholder for the authenticated user only;
- settings, visibility guidance, reporting, and moderation views.

Search and profile state are currently held in the browser for demonstration. The records are clearly labeled as demo or user-submitted preview data. Authentication, PostgreSQL persistence, server-side AI parsing, and approved LinkedIn OAuth are the next production implementation layer.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Product guardrails

- Profiles are opt-in and owner-controlled.
- The product does not scrape LinkedIn or bypass access controls.
- Demo records must never be presented as real people.
- The AI parser will produce validated filters; it will not invent matches or generate database queries.
- Private contact details are not part of the public search experience.

## Planned next slices

1. Verified project setup, health check, and environment validation.
2. Authentication, PostgreSQL, Prisma, consent, and visibility rules.
3. Profile creation, editing, deletion, and reporting.
4. Server-side AI parser with strict schema validation.
5. Deterministic search, ranking, pagination, and moderation.

See `docs/architecture.md` for the initial design decisions.
