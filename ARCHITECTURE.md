# Architecture

## Overview

```
   Stellar Horizon (live testnet, read-only) + SEP-1 stellar.toml (live)
                │
                ▼
   ┌─────────────────────┐
   │  packages/indexer      │  IMPLEMENTED + TESTED (5 tests, all live-network)
   │  fetchAccountHistory,  │  no mocks — real Horizon + real testanchor.stellar.org
   │  hasStellarTomlMetadata│
   └───────────┬───────────┘
               ▼
   ┌─────────────────────┐
   │ @anchor-watch/        │  IMPLEMENTED + TESTED (10 passing tests)
   │ trust-score            │  pure, documented scoring function
   └───────────┬───────────┘
               ▼
   ┌─────────────────────┐         ┌─────────────────────┐
   │  packages/api           │────▶│  packages/widget        │
   │  real HTTP server        │     │  IMPLEMENTED + TESTED    │
   │  IMPLEMENTED + TESTED    │     │  (6 tests) — accessible, │
   │  (7 tests incl. a real   │     │  framework-agnostic      │
   │  server on a real socket)│     └─────────────────────┘
   └─────────────────────┘

   ┌─────────────────────┐
   │ packages/reconciliation │  design skeleton — separate concern from trust-score
   └─────────────────────┘  webhook-based on/off-chain payment matching
```

## What's real vs. designed

Given no contracts to deploy for this project, verification looked
different from the other two repos in this application: every claim below
was actually run against the live network, not mocked and not just reviewed
by eye.

- **`packages/indexer`** — `fetchAccountHistory` and `hasStellarTomlMetadata`
  fully implemented, 5 tests, all hitting live `horizon-testnet.stellar.org`
  and the real Stellar test anchor at `testanchor.stellar.org` — including a
  freshly generated, confirmed-nonexistent keypair to test the empty-history
  path (a well-known "zero address" was tried first and turned out to have
  real transaction history from other testers — worth knowing if you reach
  for it as an "empty" test fixture elsewhere).
- **`@anchor-watch/trust-score`** — fully implemented, 10 unit tests, all
  passing. Pure function, matches `docs/METHODOLOGY.md` exactly.
- **`packages/api`** — a real Node HTTP server (`GET /trust-score`), 7 tests
  including one that starts the server on a real socket and hits it with a
  real `fetch` call, computing a genuine live Trust Score end to end.
- **`packages/widget`** — fully implemented (Web Component +
  `attributeChangedCallback` re-rendering + React wrapper), 6 unit tests,
  all passing, using jsdom. Typechecks clean.
- **`e2e/smoke_test_horizon.sh`** — genuinely run against live
  `horizon-testnet.stellar.org`, confirming the response shape the indexer
  parses.
- **`packages/reconciliation`** — design-only, see its README for the open
  questions before implementation.

## Why trust-score is its own package, separate from the widget

Both the widget (for inline display) and a future server-side Trust Score
API consume the same scoring function — keeping it in a dependency-free
package means neither has to duplicate or diverge on the actual
methodology. The widget depends on it; the reverse is never true.
