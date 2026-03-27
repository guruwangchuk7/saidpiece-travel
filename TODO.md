# TODO

## Contracts and Deployment
- [ ] Implement and deploy `BookingManager` contract with `payBooking(bytes32 bookingId, address token, uint256 amount)`.
- [ ] Ensure `PaymentDeposited(bytes32 bookingId, address payer, address token, uint256 amount)` event signature matches app expectations.
- [ ] Add/verify admin roles, pause logic, and emergency withdrawal in contracts.
- [ ] Deploy on testnet first, then run a reconciliation test pass.

## Environment and Config
- [ ] Set `NEXT_PUBLIC_BOOKING_MANAGER_ADDRESS` in `.env`.
- [ ] Verify token and chain env vars (`NEXT_PUBLIC_CRYPTO_TOKEN_ADDRESS`, `NEXT_PUBLIC_CRYPTO_PAYMENT_CHAIN_ID`, etc.).
- [ ] Set indexer env vars (`BLOCKCHAIN_INDEXER_BLOCK_RANGE`, `BLOCKCHAIN_INDEXER_CONFIRMATION_DEPTH`, `BLOCKCHAIN_INDEXER_POLL_INTERVAL_MS`).

## Database
- [x] Apply updated `database.sql` migration in Supabase/Postgres (Added Staff/Admin RLS).
- [ ] Confirm new tables exist: `blockchain_bookings`, `blockchain_indexer_checkpoints`.
- [x] Confirm RLS policies for `blockchain_bookings` are active.

## Backend and Indexer
- [ ] Run the indexer worker `src/indexer/onchainBookingIndexer.ts` in your process manager.
- [ ] Confirm `crypto-payment-intents` route returns `contractCall` data.
- [ ] Confirm verify route marks intents as `paid` from `PaymentDeposited` event.
- [ ] Add replay job for missed blocks and monitoring for RPC errors/reorgs.

## Frontend Flow
- [ ] Test `/confirm-pay` on testnet with a real wallet.
- [ ] Confirm wallet switches to configured chain before transaction.
- [ ] Confirm successful tx shows confirmation and persists intent status.
- [ ] Confirm failure paths (wrong token, underpayment, expired quote) show correct messages.

## Security and Operations
- [x] Implement server-side Middleware for /admin route protection.
- [x] Integrate Zod schemas for server-side API input validation.
- [x] Add block confirmation depth checks (2+ blocks) for payment verification.
- [x] Migrate staff authorization to database roles (removing client-side lists).
- [x] Implement Redis-based rate limiting for serverless production (Upstash).
- [ ] Add wallet-signature ownership checks for sensitive API actions.
- [ ] Move privileged contract ownership to multisig.
- [ ] Add audit logging for admin refund/settlement actions.
- [ ] Prepare incident runbook for pause/unpause and recovery.

## QA and Launch
- [ ] Add automated tests for intent creation/verification APIs.
- [ ] Add integration test for full booking escrow flow.
- [ ] Perform testnet reconciliation and manual verification against chain explorer.
- [ ] Complete external smart contract audit before mainnet rollout.
