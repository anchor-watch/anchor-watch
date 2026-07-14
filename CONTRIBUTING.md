# Contributing

Contributions should preserve the core guarantees of this repository:

- the Trust Score methodology must stay **openly published and auditable** —
  no scoring logic that isn't documented in `docs/METHODOLOGY.md`
- the widget must stay accessible (keyboard operable, screen-reader
  labeled) and framework-agnostic at its core
- the reconciliation toolkit must never silently drop a mismatch — an
  unmatched payment is surfaced, not hidden

## Development expectations

Before submitting changes:

1. Run tests: `npm test` (workspace-wide) or per-package.
2. Run lint + typecheck: `npm run lint && npm run typecheck`.
3. If you change the scoring methodology (`packages/trust-score`), update
   `docs/METHODOLOGY.md` in the same PR — the spec and the implementation
   must never drift apart.
4. If you change the widget's markup or ARIA attributes, verify with a
   screen reader or at minimum the automated a11y checks in
   `packages/widget/__tests__`.

## Scope notes

- This is pre-alpha. The scoring methodology is a first draft — expect it to
  change as pilot anchors and wallets give feedback.
- `packages/indexer` and `packages/reconciliation` are design skeletons as of
  this scaffold, not full implementations — see their READMEs.

## Pull request guidance

Good changes: scoring-methodology refinements (with the doc updated in the
same PR), widget accessibility improvements, indexer/reconciliation
correctness fixes, test coverage, documentation fixes tied to actual
behavior.

Changes that need extra care and should start as a discussion issue first:
changing the scoring formula's weights, changing what data sources feed the
score, or anything that changes the reconciliation engine's matching logic.

## Picking up an issue

Every open task uses the "Wave task" issue template with explicit acceptance
criteria and a difficulty rating (`easy` / `medium` / `hard`). Issues labeled
`good first issue` are scoped to be self-contained — comment on the issue
before starting so work doesn't collide.
