# Decision 0002: Start with deterministic search

Status: accepted for the MVP.

The first search implementation will use PostgreSQL filters and text search. The AI interprets the query but does not invent matches. Semantic or vector search will be considered only after representative searches show a measurable recall problem that deterministic fields cannot address.
