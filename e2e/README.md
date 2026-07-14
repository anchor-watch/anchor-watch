# End-to-end / integration checks

Unlike the other Stellar projects in this grant application, Anchor Watch
has no contracts to deploy — it's a read-only consumer of the public Stellar
network (transaction history, SEP-1 metadata). So "e2e" here means a
smoke test against the **real, live** network, not a testnet deployment
flow.

## Usage

```bash
./e2e/smoke_test_horizon.sh
```

Requires `curl` and `jq`. Genuinely run against `horizon-testnet.stellar.org`
during scaffolding — confirmed the response shape (`successful`, `ledger`
fields on transaction records) matches what `packages/indexer` will need to
parse.

## Not yet covered

- SEP-1 `stellar.toml` fetch-and-parse smoke test (tracked as an issue).
- An actual per-anchor transaction-history query (the smoke test above
  checks the general `/transactions` feed shape, not yet the
  account-scoped query the real indexer will use).
