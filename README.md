# Layer

Layer is an opt-in professional people-discovery product. Users describe who they want to find in natural language, review the extracted filters, and search approved profile records with visible provenance and explainable matches.

## Current slice

The first implementation slice contains the search-first marketing shell and an interactive product preview. Search results are demo records only and are intentionally labeled as such. No authentication, database, AI provider, or real profile ingestion has been added yet.

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
