# Initial architecture

## Product boundary

The first audience is an opt-in community from one consenting educational institution. The first use case is finding peers and mentors by skills, role, industry, location, graduation year, and explicitly provided availability.

## Application shape

Layer will use a modular monolith. Next.js will serve the interface and protected route handlers. Domain services will keep profile, search, moderation, and audit behavior separate without introducing microservices prematurely.

The AI provider has one responsibility: convert natural-language text into a validated search object. It cannot access the database, generate SQL, select permissions, or invent profile matches.

Search execution will apply visibility and authorization first, then deterministic PostgreSQL filters and transparent ranking. Missing optional data is neutral.

## Data source policy

The MVP will support user-submitted profiles and clearly labeled demo records. Authorized institutional imports may be added only when the institution documents its permission, permitted fields, retention period, and contact for corrections.

LinkedIn is not a default source. The product will not scrape it, automate logins, bypass access controls, or copy search results.

## UX direction

The interface is search-first, calm, and professional: light surfaces, deep green structure, restrained orange emphasis, strong typography, visible focus states, keyboard support, and minimal motion. Search is a staged interaction: query, review filters, confirm, results.

## Initial success criteria

- A member can understand the product within one landing-page visit.
- A member can search in natural language and edit the interpreted filters.
- A profile owner controls visibility and can delete their record.
- Every result has a source and freshness state.
- Hidden, deleted, or unauthorized records never appear in results.
- Demo content is never confused with real directory data.
