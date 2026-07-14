# Architecture

## Overview

```
   Stellar Horizon/RPC (real network, read-only)
                │
                ▼
   ┌─────────────────────┐
   │  packages/indexer      │  design skeleton — fetches tx history + SEP-1 metadata
   └───────────┬───────────┘
               ▼
   ┌─────────────────────┐
   │ @anchor-watch/        │  IMPLEMENTED + TESTED (10 passing tests)
   │ trust-score            │  pure, documented scoring function
   └───────────┬───────────┘
               ▼
   ┌─────────────────────┐
   │  packages/widget        │  IMPLEMENTED + TESTED (6 passing tests)
   │  Web Component + React  │  accessible, framework-agnostic
   └─────────────────────┘

   ┌─────────────────────┐
   │ packages/reconciliation │  design skeleton — separate concern from trust-score
   └─────────────────────┘  webhook-based on/off-chain payment matching
```

## What's real vs. designed

Given no contracts to deploy for this project, verification looked
different from the other two repos in this application: every claim below
was actually run, not just reviewed by eye.

- **`@anchor-watch/trust-score`** — fully implemented, 10 unit tests, all
  passing (`npx vitest run packages/trust-score`). Pure function, matches
  `docs/METHODOLOGY.md` exactly.
- **`packages/widget`** — fully implemented (Web Component +
  `attributeChangedCallback` re-rendering + React wrapper), 6 unit tests,
  all passing, using jsdom. Typechecks clean.
- **`e2e/smoke_test_horizon.sh`** — genuinely run against live
  `horizon-testnet.stellar.org` during scaffolding; confirmed the response
  shape the indexer will need to parse.
- **`packages/indexer`**, **`packages/reconciliation`** — design-only, see
  each package's README for the specific open questions before
  implementation.

## Why trust-score is its own package, separate from the widget

Both the widget (for inline display) and a future server-side Trust Score
API consume the same scoring function — keeping it in a dependency-free
package means neither has to duplicate or diverge on the actual
methodology. The widget depends on it; the reverse is never true.
