# Reconciliation

**Status: design skeleton, not yet implemented** (Months 6–8 milestone).

A self-hostable service anchors run to automatically match on-chain SEP-31
payments against their own off-chain settlement records — addressing the
gap where the SEP-31 spec makes the receiving anchor solely responsible for
this matching, with no shared tooling.

## Intended flow

1. Watch the anchor's Stellar account for incoming SEP-31 payments (via
   Horizon streaming or polling).
2. For each payment, call a configurable webhook (the anchor's own
   settlement/accounting system) to check whether a matching off-chain
   payout has been recorded.
3. Flag mismatches (on-chain payment with no matching off-chain record
   after a configurable grace period, or vice versa) on a dashboard —
   surfaced, never silently dropped, per `CONTRIBUTING.md`'s core guarantee.

## Open design questions

- Matching key: transaction memo, a separate reference number, or amount +
  timestamp fuzzy matching? Needs input from a real anchor's settlement
  system shape (Months 9–10 pilot).
- Whether this should be push (webhook to anchor) or pull (anchor's system
  polls this service) — push is simpler here but assumes the anchor's
  system can receive webhooks reliably.
