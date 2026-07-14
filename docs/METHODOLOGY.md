# Trust Score Methodology v0.1

**Status: draft, implemented.** This document and
`packages/trust-score/src/index.ts` must never drift apart — if you change
one, change the other in the same PR.

## Principle

The score must be **fully reproducible from published inputs** — no hidden
signals, no manual anchor-by-anchor adjustment. Anyone should be able to
recompute an anchor's score from the same public data and get the same
number. This is the whole point: it replaces an opaque "trust us" directory
with an auditable calculation.

## Inputs

| Input | Source | Range |
|---|---|---|
| `successRate` | Observed on-chain SEP-31 transaction outcomes | 0.0–1.0 |
| `transactionCount` | Observed on-chain SEP-31 transaction count | 0+ |
| `hasStellarTomlMetadata` | SEP-1 `stellar.toml` present and parseable | boolean |
| `hasThirdPartyAttestation` | A published attestation exists (e.g. the SCF-funded Anchor Transparency Node) | boolean |

## Formula

```
maturity = min(1, log10(transactionCount + 1) / log10(MATURE_TRANSACTION_COUNT + 1))
reliability_points = successRate * maturity * 60
metadata_points     = hasStellarTomlMetadata ? 15 : 0
attestation_points  = hasThirdPartyAttestation ? 25 : 0

score = round(reliability_points + metadata_points + attestation_points)
```

Where `MATURE_TRANSACTION_COUNT = 100` (a below-100-transaction anchor is
"immature" and gets a proportionally dampened reliability score even at
100% success — this exists specifically so a brand-new anchor with 2 lucky
successful transactions can't outscore an anchor with 500 transactions and a
98% success rate).

Maximum score: 100 (60 + 15 + 25). Minimum: 0.

## Why these specific weights

- **Reliability (60%)** is the largest share because it's the only input
  directly measuring whether an anchor actually does what it says — the
  other two are proxies for trustworthiness, not direct evidence of it.
- **Third-party attestation (25%)** outweighs bare metadata presence (15%)
  because an attestation is independently verifiable; a `stellar.toml` file
  is self-asserted by the anchor itself.
- The maturity dampener exists because a raw `successRate` with a small
  sample size is not a meaningful reliability signal — see the formula
  comment above.

## Open questions (Months 1–2 deliverable — resolve before implementation drifts further)

- Should a stale `stellar.toml` (unreachable for N days) revert
  `hasStellarTomlMetadata` to `false`? Currently not modeled.
- Should failed-then-retried-successfully transactions count differently
  than a clean first-attempt success? Currently they don't — a success is a
  success.
- Community-reported issues (see `README.md`'s "community reporting layer"
  roadmap item) are not yet part of this formula at all — how they'd feed
  in without becoming gameable is an open design problem for Months 9–10.

## Changing the weights

Any change to the constants above (`60`, `15`, `25`, `MATURE_TRANSACTION_COUNT`)
is a scoring-methodology change per `CONTRIBUTING.md` — open a discussion
issue first, don't just adjust a number in a refactor PR.
