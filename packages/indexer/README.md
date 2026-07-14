# Indexer

**Status: design skeleton, not yet implemented** (Months 3–5 milestone).

Feeds the `@anchor-watch/trust-score` package's inputs by:

1. Polling Stellar Horizon (or RPC) for each tracked anchor's SEP-31
   transaction history — confirmed reachable and shaped as expected via
   `e2e/smoke_test_horizon.sh`.
2. Computing `successRate` and `transactionCount` per anchor from that
   history.
3. Fetching and parsing each anchor's SEP-1 `stellar.toml` for
   `hasStellarTomlMetadata`.
4. Where published, ingesting third-party attestations (e.g. the SCF-funded
   Anchor Transparency Node) for `hasThirdPartyAttestation`.
5. Feeding the assembled `TrustScoreInputs` into `computeTrustScore` and
   persisting the result behind the Trust Score API.

## Why this isn't built yet

The scoring function and its inputs (`@anchor-watch/trust-score`) needed to
be nailed down and tested first — building the data-fetching layer against
an unstable target would mean rework. See the repo-level roadmap.

## Open design questions

- Polling cadence and how far back to backfill on first run for a newly
  tracked anchor.
- Whether to cache raw Horizon responses or only the derived score inputs.
