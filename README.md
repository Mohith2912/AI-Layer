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

Search and profile state still includes browser-held demo data so the prototype remains browsable without credentials. The production integration layer is now included: Auth.js with LinkedIn OpenID Connect, Prisma/PostgreSQL models, protected profile/search/report APIs, and server-side OpenAI Structured Outputs parsing. See `docs/production-setup.md` for required credentials and migration steps.

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

## Production integration notes

- Authentication and PostgreSQL routes are protected server-side.
- AI parsing is separated from database querying and uses a strict schema.
- LinkedIn is an identity connection, not an arbitrary people-search source.
- Actual credentials and a production migration must be supplied before live data is enabled.

See `docs/architecture.md` for the initial design decisions.
