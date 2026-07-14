# Anchor Watch

A trust-score aggregator, embeddable widget, and reconciliation toolkit for
Stellar anchors — turning fragmented anchor directories into one queryable,
auditable signal, and giving anchors shared tooling for a real operational
pain point instead of each building it from scratch.

> **Status: pre-alpha, actively being designed.** See [Roadmap](#roadmap) and
> the seeded issues for what's actually built versus planned.

## The problem

Stellar's anchor ecosystem is split across an official directory that
[explicitly states it is not comprehensive](https://anchors.stellar.org/)
(the network is permissionless by design) and a separate, informal
community-tagged list on Stellar Expert — with no unified reputation signal
between them. Separately, anchors carry the SEP-31 reconciliation burden
alone: the spec makes the receiving anchor solely responsible for matching
an on-chain payment to its off-chain payout and manually updating status —
no shared tooling exists for this.

## The approach

1. **Trust Score** — a pure, openly published scoring function (see
   [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md)) combining observed on-chain
   transaction history, SEP-1 metadata, and (where published) third-party
   attestations like the SCF-funded Anchor Transparency Node, into one
   auditable score. Complementary to, not competing with, proof-generation
   projects like the Transparency Node — this is the aggregation/consumption
   layer.
2. **Embeddable widget** — an accessible, framework-agnostic Web Component
   (+ React wrapper) wallets drop in to show a Trust Score inline.
3. **Reconciliation toolkit** — a self-hostable service anchors run to
   automatically match on-chain SEP-31 payments against off-chain settlement
   records.

## Repository layout

```
packages/
  trust-score/      Pure, tested scoring logic — the openly published methodology, implemented
  widget/           Accessible Web Component + React wrapper consuming trust-score
  indexer/          Ledger indexer feeding trust-score inputs
  reconciliation/   Webhook-based on/off-chain payment matching engine
docs/               Methodology spec and architecture notes
e2e/                Integration checks against real Stellar Horizon (read-only, no deployment needed)
```

See [`ARCHITECTURE.md`](ARCHITECTURE.md) and
[`docs/METHODOLOGY.md`](docs/METHODOLOGY.md).

## Roadmap

| Phase | Focus |
|---|---|
| Months 1–2 | Publish the Trust Score methodology as an open RFC; assess integration with existing directories |
| Months 3–5 | Ledger indexer, SEP-1 ingestion, Trust Score API v1 |
| Months 6–8 | Embeddable widget, reconciliation engine + dashboard v1 |
| Months 9–10 | Pilot with a real anchor and wallet, community reporting layer |
| Months 11–12 | Public launch, documentation, SCF Build Award application |

Every item is tracked as a GitHub issue under the matching milestone — see
[Issues](../../issues) and [Milestones](../../milestones).

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Issues labeled `good first issue`
are scoped for a first contribution; every issue uses the "Wave task"
template with explicit acceptance criteria and difficulty rating.

## License

[MIT](LICENSE)
