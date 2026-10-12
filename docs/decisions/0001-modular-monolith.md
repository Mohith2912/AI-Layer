# Decision 0001: Use a modular monolith

Status: accepted for the MVP.

Layer will begin as one Next.js application with domain modules for authentication, profiles, search, and moderation. This keeps deployment and debugging approachable while preserving boundaries that can be extracted later if real scale requires it.

Microservices are deferred because they would add operational complexity before the product has validated its data sources, search behavior, or usage patterns.
