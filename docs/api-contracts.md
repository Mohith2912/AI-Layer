# Initial API contracts

The API will be introduced incrementally. All endpoints validate requests on the server, enforce authentication and authorization at the data-access boundary, apply rate limits where relevant, and return safe errors without stack traces or secrets.

## Search

- `POST /api/search/parse`: authenticated; accepts bounded natural-language text; returns a validated editable search object; never executes a database query.
- `POST /api/search/execute`: authenticated; accepts the validated search object plus pagination; applies visibility, authorization, deterministic ranking, and result limits.

## Profiles

- `POST /api/profiles`: authenticated profile owner; creates a consented profile.
- `GET /api/profiles`: authenticated; lists only records the requester may see.
- `GET /api/profiles/:profileId`: authenticated or public according to profile visibility.
- `PATCH /api/profiles/:profileId`: owner or admin; validates and audits changes.
- `DELETE /api/profiles/:profileId`: owner or admin; removes the profile from search immediately.

## Reports

- `POST /api/reports`: authenticated; creates a rate-limited moderation report without exposing reporter details to the profile owner.
