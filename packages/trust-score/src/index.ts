/**
 * Trust Score — implements docs/METHODOLOGY.md exactly. If you change the
 * formula here, update that document in the same PR; they must never drift
 * apart, since the entire point of this project is that the score is
 * reproducible from published inputs, not a black box.
 */

const MATURE_TRANSACTION_COUNT = 100;
const RELIABILITY_WEIGHT = 60;
const METADATA_WEIGHT = 15;
const ATTESTATION_WEIGHT = 25;

export interface TrustScoreInputs {
  /** Fraction of observed on-chain SEP-31 transactions that succeeded, 0.0-1.0. */
  successRate: number;
  /** Total observed on-chain SEP-31 transaction count. */
  transactionCount: number;
  /** Whether a SEP-1 stellar.toml was present and parseable. */
  hasStellarTomlMetadata: boolean;
  /** Whether a published third-party attestation exists (e.g. Anchor Transparency Node). */
  hasThirdPartyAttestation: boolean;
}

export interface TrustScoreResult {
  score: number; // 0-100, rounded
  breakdown: {
    reliabilityPoints: number;
    metadataPoints: number;
    attestationPoints: number;
    maturity: number; // 0.0-1.0, the dampening factor applied to reliability
  };
}

function validate(inputs: TrustScoreInputs): void {
  if (inputs.successRate < 0 || inputs.successRate > 1) {
    throw new RangeError(`successRate must be within [0, 1], got ${inputs.successRate}`);
  }
  if (inputs.transactionCount < 0) {
    throw new RangeError(`transactionCount must be >= 0, got ${inputs.transactionCount}`);
  }
}

/**
 * Computes the Trust Score per docs/METHODOLOGY.md's published formula.
 * Pure function: same inputs always produce the same output, by design —
 * that's what makes the score auditable rather than a black box.
 */
export function computeTrustScore(inputs: TrustScoreInputs): TrustScoreResult {
  validate(inputs);

  const maturity =
    inputs.transactionCount <= 0
      ? 0
      : Math.min(
          1,
          Math.log10(inputs.transactionCount + 1) / Math.log10(MATURE_TRANSACTION_COUNT + 1),
        );

  const reliabilityPoints = inputs.successRate * maturity * RELIABILITY_WEIGHT;
  const metadataPoints = inputs.hasStellarTomlMetadata ? METADATA_WEIGHT : 0;
  const attestationPoints = inputs.hasThirdPartyAttestation ? ATTESTATION_WEIGHT : 0;

  const score = Math.round(reliabilityPoints + metadataPoints + attestationPoints);

  return {
    score,
    breakdown: {
      reliabilityPoints,
      metadataPoints,
      attestationPoints,
      maturity,
    },
  };
}
