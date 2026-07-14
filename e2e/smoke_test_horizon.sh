#!/usr/bin/env bash
# e2e/smoke_test_horizon.sh
#
# This project has no contracts to deploy — the "e2e" here is a read-only
# integration check against the real Stellar network, confirming the data
# shapes packages/indexer will actually need to parse are what we expect.
# Safe to re-run any time (purely read-only, no state mutation).

set -euo pipefail
require_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "required command not found: $1" >&2; exit 1; }; }
require_cmd curl
require_cmd jq

HORIZON="${HORIZON_URL:-https://horizon-testnet.stellar.org}"

log()  { printf '\033[0;34m[e2e]\033[0m %s\n' "$*"; }
ok()   { printf '\033[0;32m[ ok]\033[0m %s\n' "$*"; }
die()  { printf '\033[0;31m[fail]\033[0m %s\n' "$*" >&2; exit 1; }

log "fetching recent transactions from ${HORIZON}"
RESPONSE="$(curl -sf --max-time 15 "${HORIZON}/transactions?order=desc&limit=5")"

COUNT="$(echo "${RESPONSE}" | jq '._embedded.records | length')"
[ "${COUNT}" -gt 0 ] || die "expected at least one transaction record, got ${COUNT}"
ok "received ${COUNT} recent transaction records"

FIRST_HAS_SUCCESSFUL_FIELD="$(echo "${RESPONSE}" | jq '._embedded.records[0] | has("successful")')"
[ "${FIRST_HAS_SUCCESSFUL_FIELD}" = "true" ] || \
  die "expected transaction records to have a 'successful' field — Horizon response shape may have changed"
ok "transaction records have the 'successful' field the Trust Score reliability input needs"

FIRST_HAS_LEDGER_FIELD="$(echo "${RESPONSE}" | jq '._embedded.records[0] | has("ledger")')"
[ "${FIRST_HAS_LEDGER_FIELD}" = "true" ] || die "expected a 'ledger' field on transaction records"
ok "transaction records have the 'ledger' field the indexer needs for resumable sync"

ok "Horizon smoke test complete — response shape matches what packages/indexer expects to parse"
