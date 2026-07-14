# Pull Request Checklist

Thank you for contributing! Please review the following checklist to ensure your PR is ready for review.

## Summary
- [ ] Provide a clear and concise description of the changes.
- [ ] Link to any related issues using `Fixes #issue` or `Related to #issue`.

## Testing
- [ ] All new code is covered by unit tests where applicable.
- [ ] Existing tests pass locally (`npm test`).
- [ ] Added tests for edge cases and error conditions.
- [ ] If widget markup/ARIA changed, verified accessibility manually or via the automated checks in `packages/widget/__tests__`.

## Documentation
- [ ] Updated `README.md` / `ARCHITECTURE.md` if changes affect users or the design.
- [ ] Updated `docs/METHODOLOGY.md` in the same PR if this changes the scoring formula, weights, or inputs — it must never drift from the implementation.

## Code Quality
- [ ] Follows the project's coding style and conventions.
- [ ] No commented-out code or debug statements left in the codebase.
- [ ] Variables and functions are named descriptively.
- [ ] Code is properly formatted / linted (`npm run lint`).
- [ ] No new TypeScript errors (`npm run typecheck`).

## Breaking Changes
- [ ] If this PR introduces breaking changes (Trust Score formula, widget attribute names, package public API), describe them and provide migration steps.
- [ ] Updated version in `package.json` if appropriate (following semver).

## Additional Notes
- [ ] Any other relevant information for reviewers.

Please ensure all checkboxes are checked (or explicitly marked N/A with a reason) before requesting a review.
