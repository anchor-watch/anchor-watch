# Changelog

All notable changes to this project are documented here. Format loosely
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Initial repository scaffold: packages/widget, trust-score, indexer,
  reconciliation, e2e directory structure.
- `@anchor-watch/trust-score`: fully implemented and tested (10 passing
  tests) Trust Score methodology, matching `docs/METHODOLOGY.md`.
- `packages/widget`: fully implemented and tested (6 passing tests)
  `<anchor-trust-badge>` Web Component + React wrapper.
- `e2e/smoke_test_horizon.sh`: genuinely run against live Stellar testnet
  Horizon during scaffolding.
- Trust Score methodology draft (`docs/METHODOLOGY.md`).
- CI, issue templates, and contribution guidelines.
