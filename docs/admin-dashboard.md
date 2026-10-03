# Admin Dashboard — Feature Plan

Branch: `feature/admin-dashboard`
Status: **Planning only — no implementation yet**

## Goal

Extend the static portfolio (`https://simonweigold.github.io`) so that Simon can log in
and view a private dashboard that monitors home hardware (CPU, RAM, disk, temps,
uptime, services, etc.).

The portfolio stays the frontend. GitHub Pages can only serve static files, so it
cannot hold secrets, run a backend, or do server-side auth. The API lives elsewhere.

For this phase the backend is **not built** — the frontend is developed against
**dummy/mock data** that matches the agreed API contract so the real backend can be
dropped in later without UI changes.

## Architecture — the "more secure option"

Rather than exposing the home network inbound, a home agent pushes metrics *outbound*
to a hosted backend. Nothing inbound is opened at home.

```
home agent (outbound HTTPS only)
        │  push metrics
        ▼
hosted backend (Supabase / Cloudflare / small VPS)
  - auth layer
  - database
        ▲  authenticated API (HTTPS)
        │
browser  ──────────────►  https://simonweigold.github.io  (static SPA)
```

Consequences that drive the design:

- Frontend (`github.io`) and API (hosted backend) are **cross-site**.
- Therefore strict **CORS** on the backend is mandatory (exact allowlist, never `*`
  with credentials).
- The static bundle is public: **no secrets or API keys ever ship to the browser**.
- Anonymous/push-only ingestion means the home agent needs no inbound ports.

## Authentication strategy

The cross-site boundary makes classic httpOnly session cookies unreliable
(Safari/Firefox block third-party cookies; Chrome is phasing them out). Planned
approach, in order of preference:

1. **Hosted IdP with PKCE** (e.g. Supabase Auth, Clerk, Auth0, or GitHub OAuth).
   Handles login + 2FA and hands the SPA tokens via the standard SPA flow. Cleanest
   and most secure path — recommended.
2. **Bearer/JWT fallback**: short-lived access token + refresh token, access token
   held in memory, sent as `Authorization: Bearer …`. Simpler, but no httpOnly
   protection, so XSS matters — keep tokens short-lived and refresh.

Backend must send an exact-origin CORS allowlist:

```
Access-Control-Allow-Origin: https://simonweigold.github.io
Access-Control-Allow-Credentials: true   # only if cookies are used
```

Plus `OPTIONS` preflight handling for the methods/headers the SPA uses.

## Scope of this branch (frontend)

1. **Routing / entry** — decide how the dashboard is reached (separate route vs. a
   toggled view). Currently `App.tsx` is a single static page; a router may need to
   be introduced.
2. **Auth flow (client-side)** — login entry point, PKCE redirect/callback handling,
   token storage/refresh, logout, and a guard that hides the dashboard from
   unauthenticated users.
3. **API client** — a small typed client that talks to the hosted backend base URL
   (from an env var, since it is public config, not a secret), attaches auth, and
   handles errors/refresh.
4. **Dashboard UI** — first widgets for hardware monitoring (CPU, RAM, disk, temp,
   uptime, running services), matching the existing Bauhaus visual style.
5. **Dummy backend / mock data** — a mock layer (fixture module or MSW/stub
   interceptor) that serves responses matching the API contract so the UI can be
   built and reviewed before the backend exists.
6. **Env/config** — document the frontend env vars (e.g. `VITE_API_BASE_URL`,
   `VITE_AUTH_*`). These are public by nature.

## API contract (draft — to be finalized with backend)

Documented so frontend can mock it. To live in this doc until a real schema exists.

```
GET /api/metrics/latest
  → { ts, cpu: { usage }, memory: { used, total }, disk: [{ mount, used, total }],
      temperature: { cpu, gpu }, uptime, load: [1,5,15] }

GET /api/services
  → [{ name, status, uptime }]

GET /api/metrics/history?range=1h|24h|7d
  → [{ ts, cpu, memory, ... }]
```

Auth: `Authorization: Bearer <access_token>` on all private endpoints.

## Security checklist

- [ ] HTTPS on both sides (GitHub Pages already provides it; backend must too).
- [ ] No secrets/API keys in the static bundle — everything shipped is public.
- [ ] Strict CORS allowlist on the backend; never `*` with credentials.
- [ ] Rate-limit and lock down login; enable 2FA via the IdP.
- [ ] Ingestion is outbound-only; no inbound ports on the home network.
- [ ] Token lifetime short; refresh handled; logout clears state.
- [ ] Recognise GitHub Pages cannot set real HTTP security headers (CSP /
      `X-Frame-Options` limited to what a `<meta>` tag can do).
- [ ] Repo/account security matters: compromise of the GitHub account/repo
      compromises the frontend.

## Non-goals (this branch)

- Building the home agent or the hosted backend.
- Real hardware data or real credentials.
- Any inbound exposure of the home network.

## Open questions

- Which hosted backend / IdP (Supabase vs. Cloudflare vs. VPS; hosted IdP vs. JWT)?
- Separate route (`/admin`) or a modal/view toggled from the portfolio?
- Router library choice, or hand-rolled view switching to stay dependency-light?
- Which metrics matter first for v1 of the dashboard?
