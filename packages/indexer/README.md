# Indexer

**Status: core fetch logic implemented and tested against live testnet.**
Not yet a running/scheduled service — see "What's not built yet" below.

Feeds the `@anchor-watch/trust-score` package's inputs:

1. `fetchAccountHistory` — polls Stellar Horizon for an account's
   transaction history and derives `successRate`/`transactionCount`.
   Verified against a real account from this project's own testnet
   activity (13+ real transactions) and a genuinely never-used, freshly
   generated keypair (confirmed 404 on Horizon before writing the test).
2. `hasStellarTomlMetadata` — fetches and does a minimal presence check on
   an anchor's SEP-1 `stellar.toml`. Verified against the real, official
   Stellar test anchor at `testanchor.stellar.org`.
3. `computeAnchorTrustScoreLive` — assembles both into `TrustScoreInputs`
   and calls `computeTrustScore`. All 5 tests in `__tests__/index.test.ts`
   hit the live network for real, not mocks.

## What's not built yet

- Ingesting third-party attestations (e.g. the SCF-funded Anchor
  Transparency Node) for `hasThirdPartyAttestation` — tracked as its own
  issue.
- A scheduled/running service (this is currently a library of functions,
  not a long-running poller) — see the repo roadmap for the Trust Score API
  milestone that will call these on a cadence.
- Resumable/incremental sync (currently refetches the last N transactions
  each call rather than tracking a cursor) — fine for on-demand scoring, not
  yet suitable for continuous indexing at scale.
- A full SEP-1 parser (`hasStellarTomlMetadata` does a presence check, not a
  structured parse of all fields).

## Open design questions

- Polling cadence and how far back to backfill on first run for a newly
  tracked anchor.
- Whether to cache raw Horizon responses or only the derived score inputs.
