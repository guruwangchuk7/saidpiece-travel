# Saidpiece Travel

Technical documentation for the Saidpiece Travel web application.

## Overview

Saidpiece Travel is a Next.js 16 App Router application for marketing Bhutan travel experiences and guiding users through a lightweight booking and payment confirmation flow.

The current codebase includes:

- A public marketing site with static content pages
- A protected confirmation and payment page backed by Supabase authentication
- Crypto payment intent creation and onchain ERC-20 transfer verification
- Binance Pay hosted checkout order creation
- A staff login and enquiry dashboard prototype
- A Supabase PostgreSQL schema draft in `database.sql`

## Tech Stack

- Framework: Next.js 16.1.6
- UI: React 19.2.3
- Language: TypeScript
- Styling: Tailwind CSS 4 plus custom global CSS and inline `styled-jsx`
- Auth and database: Supabase
- Wallet integration: Wagmi, RainbowKit, WalletConnect, Viem
- Payment integrations: Stripe redirect link, Binance Pay API, ERC-20 wallet transfer flow
- Linting: ESLint 9

## Runtime Requirements

- Node.js 20+ recommended
- npm
- A Supabase project for auth and database-backed flows
- A WalletConnect project ID for wallet connection UX
- Optional Binance Pay merchant credentials for hosted checkout

## Local Development

Install dependencies:

```bash
npm install
```

Create environment variables:

```bash
cp .env.example .env
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Production commands:

```bash
npm run build
npm run start
npm run lint
```

## Environment Variables

### Required for Supabase auth

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required by the client and by server-side auth validation.
- `SUPABASE_SERVICE_ROLE_KEY` is required for server-side admin actions such as profile upserts and payment-intent writes.

### Required for wallet and crypto checkout

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_CRYPTO_RECIPIENT_ADDRESS=
NEXT_PUBLIC_CRYPTO_TOKEN_ADDRESS=
NEXT_PUBLIC_CRYPTO_TOKEN_SYMBOL=USDC
NEXT_PUBLIC_CRYPTO_TOKEN_DECIMALS=6
NEXT_PUBLIC_CRYPTO_PAYMENT_CHAIN_ID=8453
CRYPTO_PAYMENT_QUOTE_LIFETIME_MINUTES=30
```

Notes:

- Supported chains in code are Ethereum mainnet (`1`) and Base (`8453`).
- Stablecoin auto-quoting only works when the booking currency is `USD` and the token symbol is `USDC` or `USDT`.
- For non-USD or non-stablecoin flows, the client must provide `cryptoAmount` in the URL query or API payload.

### Required for Binance Pay

```env
BINANCE_PAY_API_KEY=
BINANCE_PAY_SECRET_KEY=
BINANCE_PAY_WEBHOOK_URL=
BINANCE_PAY_RETURN_URL=
BINANCE_PAY_CANCEL_URL=
BINANCE_PAY_SUPPORTED_PAY_CURRENCIES=USDT,USDC,BNB
BINANCE_PAY_ORDER_EXPIRE_MINUTES=30
BINANCE_PAY_SUB_MERCHANT_ID=
APP_BASE_URL=
```

Notes:

- `APP_BASE_URL` is used to derive fallback Binance return and cancel URLs.
- The code also checks `NEXT_PUBLIC_APP_URL` as an alternative base URL source.

### Optional staff/admin configuration

```env
NEXT_PUBLIC_STAFF_EMAILS=
STAFF_EMAILS=
```

Notes:

- `NEXT_PUBLIC_STAFF_EMAILS` is exposed to the client and used by `useAuth()` for front-end staff gating.
- `STAFF_EMAILS` is used by `/api/staff`.
- If neither is set, the client falls back to two hardcoded Gmail addresses in `src/hooks/useAuth.ts`.

## Project Structure

```text
src/
  app/
    api/                         API routes
    about/                       Static informational pages
    admin/                       Staff login and enquiry dashboard prototype
    browse/                      Trip browsing page
    confirm-pay/                 Protected payment confirmation page
    contact/                     Contact page
    trips/                       Individual trip landing pages
    wizard/                      Booking/trip wizard page
    globals.css                  Global styles
    layout.tsx                   Root layout and fonts
    page.tsx                     Homepage
    robots.ts                    Robots rules
  components/                    Marketing and shared UI components
  hooks/
    useAuth.ts                   Supabase auth state and Google login
  lib/
    apiSecurity.ts               JSON no-store helpers and in-memory rate limiting
    binancePay.ts                Binance Pay signing and order creation
    cryptoPayments.ts            Chain config and ERC-20 verification logic
    supabaseAdmin.ts             Server-side auth and admin client helpers
    supabaseClient.ts            Browser Supabase client
    wallet.tsx                   Wagmi/RainbowKit provider
database.sql                     Suggested PostgreSQL schema and RLS setup
public/                          Static assets and brand imagery
```

## Route Inventory

### Public pages

- `/` home page
- `/browse`
- `/contact`
- `/trip-detail`
- `/wizard`
- `/about/our-story`
- `/about/meet-our-team`
- `/about/local-expertise`
- `/about/responsible-travel`
- `/about/booking-process`
- `/trips/bhutan-discovery`
- `/trips/bhutan-family-adventure`
- `/trips/cultural-immersion`
- `/trips/nature-retreat`

### Protected or semi-protected pages

- `/confirm-pay`
  Requires Supabase login before payment actions.
- `/admin/login`
  Staff sign-in entry page.
- `/admin/enquiries`
  Client-side gated staff dashboard prototype.

### API routes

- `GET /api/health`
  Returns `{ status: "ok", timestamp }`.
- `GET /api/env`
  Reports missing public Supabase env vars and current staff-email config.
- `GET /api/staff`
  Returns configured staff email list.
- `POST /api/crypto-payment-intents`
  Creates or reuses a pending crypto payment intent for the authenticated user.
- `POST /api/crypto-payment-intents/verify`
  Verifies an ERC-20 transfer against a stored intent and marks it paid, failed, expired, or underpaid.
- `POST /api/binance-pay`
  Creates a hosted Binance Pay order for the authenticated user.

## Authentication Model

Authentication is implemented with Supabase and Google OAuth.

Client flow:

- `useAuth()` subscribes to Supabase auth session changes.
- `signInWithGoogle()` computes the redirect URL from `window.location.origin` at runtime.
- Protected pages check `user` and show a login prompt when unauthenticated.

Server flow:

- API routes require `Authorization: Bearer <supabase_access_token>`.
- `getAuthenticatedUser()` validates the bearer token against Supabase.
- `ensureProfile()` upserts the authenticated user into `public.profiles`.

Important implementation detail:

- Staff authorization in the admin UI is currently client-side and email-list based. It is not a hardened server-enforced admin authorization model.

## Payment Flows

### 1. Card payment

Current state:

- The card option on `/confirm-pay` redirects to a hardcoded Stripe payment link.
- No Stripe API route, webhook handling, or database reconciliation exists in the current application code.

### 2. Crypto wallet payment

Flow:

1. User signs in with Google.
2. User opens `/confirm-pay` with trip details in query params.
3. Client requests `POST /api/crypto-payment-intents`.
4. Server validates auth, ensures a profile exists, and stores a pending quote in `crypto_payment_intents`.
5. User connects a wallet via RainbowKit.
6. Client submits an ERC-20 `transfer(recipient, amount)` transaction through Wagmi.
7. After the tx hash is available, the client calls `POST /api/crypto-payment-intents/verify`.
8. Server fetches the onchain transaction and receipt, decodes `Transfer` logs, validates recipient/token/sender/amount, and updates the payment intent status.

Verification rules in code:

- Reject duplicate transaction hashes
- Reject expired quotes
- Reject wrong chain configuration
- Reject failed receipts
- Reject transactions sent to the wrong token contract
- Reject transfers that do not include the expected business recipient
- Mark underpaid transfers separately
- Mark successful transfers as `paid`

Supported statuses in schema:

- `pending`
- `paid`
- `failed`
- `expired`
- `underpaid`

### 3. Binance Pay

Flow:

1. User signs in with Google.
2. Client posts booking data to `POST /api/binance-pay`.
3. Server validates auth and rate limits the request.
4. `createBinancePayOrder()` signs the Binance request using HMAC SHA-512.
5. Server returns the hosted `checkoutUrl`.
6. Client redirects the browser to Binance Pay.

Current limitations:

- No webhook consumer exists in the repo, even though `BINANCE_PAY_WEBHOOK_URL` is documented in `.env.example`.
- No database persistence exists for Binance orders in the current schema or route implementation.

### 4. Wire transfer

Current state:

- The wire transfer option is informational only.
- Banking details are hardcoded in `src/app/confirm-pay/page.tsx`.
- No submission or reconciliation flow exists.

## Crypto Configuration Details

The crypto payment system is configured through `src/lib/cryptoPayments.ts`.

Behavior:

- Validates recipient and token addresses with Viem
- Restricts chains to Base and Ethereum mainnet
- Converts decimal amounts into token base units with `parseUnits`
- Verifies payments by decoding ERC-20 `Transfer` events from the transaction receipt
- Generates explorer links for Base and Ethereum mainnet

Assumptions:

- The wallet sends a direct ERC-20 token transfer
- The quoted token and recipient are fixed by server configuration
- The sender address passed back by the client matches the actual transfer sender

## Data Model

`database.sql` defines a proposed Supabase/PostgreSQL schema.

Main tables:

- `profiles`
- `trips`
- `trip_departures`
- `enquiries`
- `crypto_payment_intents`

Enums:

- `user_role`
- `enquiry_status`
- `payment_status`
- `departure_status`
- `crypto_payment_status`

Database behaviors included:

- `updated_at` triggers
- RLS enablement on all major tables
- Example policies for self-service access
- Trigger-based profile creation on `auth.users` insert

Important note:

- The SQL file is a design baseline, not proof that the live Supabase project already matches this schema exactly.

## Security

### Response headers

`next.config.ts` applies security headers globally:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`
- `Origin-Agent-Cluster`

Additional cache controls:

- `/admin/:path*` is served with `Cache-Control: no-store`
- `/confirm-pay` is served with `Cache-Control: no-store`

### API protections

`src/lib/apiSecurity.ts` provides:

- A `jsonNoStore()` helper for non-cacheable JSON responses
- IP extraction via `x-forwarded-for` or `x-real-ip`
- In-memory rate limiting

Current rate limits:

- Crypto intent creation: 10 requests per minute per IP
- Crypto verification: 20 requests per minute per IP
- Binance Pay order creation: 10 requests per minute per IP

Limitations:

- Rate limiting is in-process memory only
- It is not distributed and will reset on restart or scale-out

## Frontend Architecture

The app uses a mix of patterns:

- Static marketing components for the homepage
- Static route pages for informational content and individual trips
- Client-heavy payment and admin pages
- Global CSS with substantial inline `styled-jsx` blocks on larger pages

Fonts:

- `Playfair Display`
- `Lato`

Wallet integration:

- `WalletProvider` wraps Wagmi, React Query, and RainbowKit
- Supported wallet chains: Ethereum mainnet and Base

## SEO and Crawling

`src/app/robots.ts` currently:

- Allows `/`
- Disallows `/admin/`
- Declares sitemap URL `https://saidpiece-travel.vercel.app/sitemap.xml`

Important note:

- No `sitemap.ts` file exists in the repository at this time, so the declared sitemap URL is not generated by this codebase.

## Operational Notes

### Required URL parameters for `/confirm-pay`

The page reads booking details from query parameters:

- `trip`
- `amount`
- `currency`
- optional `cryptoAmount`

Fallback values are used when parameters are missing, so the page can still render locally.

### Health checks

Use:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/env
curl http://localhost:3000/api/staff
```

### Images

- Local images are stored under `public/images/bhutan`
- Remote images are only allowed from `images.unsplash.com`

## Known Gaps and Risks

- The admin dashboard uses mock enquiry data and does not read from Supabase.
- Staff authorization is client-side and based on email lists, which is not sufficient for sensitive operations.
- Stripe integration is only a redirect link; no checkout session creation or webhook verification is implemented.
- Binance Pay lacks webhook handling and persistence.
- The payment confirmation page contains hardcoded banking details and payment copy.
- The README environment sample mentions Google OAuth but the exact Supabase provider setup steps are not captured in code.
- `README.md` previously had character encoding corruption; keep future edits in UTF-8.
- There are links on the payment page to `/terms` and `/cancellation`, but those routes are not present in the current route inventory.
- `src/app/confirm-pay/page.tsx` is a very large client component and mixes UI, auth, payment orchestration, and inline styling.

## Suggested Deployment Checklist

1. Configure all required env vars in the deployment platform.
2. Apply the Supabase schema and verify tables, policies, and triggers.
3. Enable Google OAuth in Supabase and set redirect URLs for local and production domains.
4. Configure WalletConnect project settings for the deployed domain.
5. Verify CSP `connect-src` entries if RPC providers or domains change.
6. Replace hardcoded Stripe links and wire details with environment-backed configuration.
7. Add webhook handling for Binance Pay and any future card processor integration.
8. Move admin authorization to server-enforced role checks.
9. Add automated tests for payment routes and auth-sensitive flows.

## Testing Status

There are currently no automated test files in the repository, and this project does not define a test script in `package.json`.

Minimum recommended coverage:

- Supabase auth guard behavior
- Crypto payment intent creation
- Crypto verification edge cases
- Binance Pay request signing and error handling
- Admin route authorization

## Convert to Blockchain-Based Architecture

This project already supports wallet-based crypto transfer verification. To convert it into a blockchain-first booking platform, migrate in phases.

### Phase 1: Define onchain scope

Keep onchain:

- Booking escrow or deposit records
- Payment status and settlement state
- Refund approval events

Keep offchain:

- Personal traveler data (PII)
- Trip content, images, CMS data
- Internal operations and support notes

### Phase 2: Add smart contracts

Create contracts:

- `BookingManager`: creates booking IDs, stores booking state, links payer wallet
- `EscrowVault`: receives stablecoin payments and controls release/refund rules
- `RefundManager` (optional): role-gated refund approvals and execution

Recommended standards:

- ERC-20 for settlement token (USDC/USDT)
- OpenZeppelin `AccessControl` for role management
- UUPS or Transparent Proxy if upgradeability is required

### Phase 3: Introduce contract event indexing

Add an indexer to consume contract events:

- Option A: The Graph subgraph
- Option B: Custom worker using Viem + RPC + PostgreSQL

Index at minimum:

- `BookingCreated`
- `PaymentDeposited`
- `BookingConfirmed`
- `RefundIssued`

### Phase 4: Refactor backend APIs

Update Next.js API routes:

- Replace payment-intent status as source of truth with contract state
- Keep Supabase for auth/profile and offchain operational data
- Add signature-based wallet ownership checks for sensitive actions

### Phase 5: Hardening and operations

- Add multi-sig ownership for admin roles and treasury controls
- Add pause/emergency withdrawal pattern
- Add webhook + event replay reconciliation jobs
- Add monitoring for RPC failures, chain reorg handling, and delayed finality

### Minimal migration checklist

1. Deploy testnet contracts.
2. Wire `src/lib/cryptoPayments.ts` to call contracts instead of transfer-only verification.
3. Add event indexer and mirrored booking state tables.
4. Update `/confirm-pay` flow to create onchain booking escrow.
5. Roll out mainnet only after testnet reconciliation and audit.

## System Design (Blockchain Version)

### High-level components

- Next.js frontend: trip browsing, booking creation, wallet signing, payment UX
- Next.js API layer: auth, booking orchestration, server-side validation
- Smart contracts: booking lifecycle and fund custody
- Indexer service: onchain event ingestion to query-friendly DB
- Supabase/Postgres: users, trip catalog, analytics, indexed booking read model
- Admin dashboard: staff tools for confirmation, refunds, and exception handling

### Request and settlement flow

1. User signs in (Supabase) and connects wallet.
2. User creates booking request through API.
3. API creates offchain booking draft and prepares contract call params.
4. User submits onchain transaction to `BookingManager`/`EscrowVault`.
5. Indexer captures event and updates booking read model.
6. UI polls/subscribes to indexed state and shows confirmed payment.
7. Ops/admin can trigger release or refund per contract rules.

### Suggested data ownership

- Onchain: immutable booking payment events, settlement status, refund state
- Offchain DB: customer profile, itinerary metadata, CRM fields, derived reporting

### Text architecture diagram

```text
[Web App (Next.js)] --wallet tx--> [BookingManager + EscrowVault]
        |                                  |
        | REST/Auth                         | Events
        v                                  v
[Next.js API + Supabase Auth]        [Indexer Worker/Subgraph]
        |                                  |
        | writes                            | writes
        v                                  v
           [Postgres Read Model (Supabase)]
                         |
                         v
                 [Admin/Operations UI]
```

## File References

- [package.json](D:\My Files\Projects\saidpiece-travel\package.json)
- [next.config.ts](D:\My Files\Projects\saidpiece-travel\next.config.ts)
- [database.sql](D:\My Files\Projects\saidpiece-travel\database.sql)
- [src/hooks/useAuth.ts](D:\My Files\Projects\saidpiece-travel\src\hooks\useAuth.ts)
- [src/lib/cryptoPayments.ts](D:\My Files\Projects\saidpiece-travel\src\lib\cryptoPayments.ts)
- [src/lib/binancePay.ts](D:\My Files\Projects\saidpiece-travel\src\lib\binancePay.ts)
- [src/app/confirm-pay/page.tsx](D:\My Files\Projects\saidpiece-travel\src\app\confirm-pay\page.tsx)
- [src/app/api/crypto-payment-intents/route.ts](D:\My Files\Projects\saidpiece-travel\src\app\api\crypto-payment-intents\route.ts)
- [src/app/api/crypto-payment-intents/verify/route.ts](D:\My Files\Projects\saidpiece-travel\src\app\api\crypto-payment-intents\verify\route.ts)
- [src/app/api/binance-pay/route.ts](D:\My Files\Projects\saidpiece-travel\src\app\api\binance-pay\route.ts)
