import { describe, expect, it } from "vitest";
import { computeTrustScore } from "../src/index.js";

describe("computeTrustScore", () => {
  it("gives a brand-new anchor with zero transactions a zero reliability contribution", () => {
    const result = computeTrustScore({
      successRate: 1,
      transactionCount: 0,
      hasStellarTomlMetadata: false,
      hasThirdPartyAttestation: false,
    });
    expect(result.breakdown.maturity).toBe(0);
    expect(result.breakdown.reliabilityPoints).toBe(0);
    expect(result.score).toBe(0);
  });

  it("dampens a small sample size even at 100% success (the maturity check)", () => {
    const twoTransactions = computeTrustScore({
      successRate: 1,
      transactionCount: 2,
      hasStellarTomlMetadata: false,
      hasThirdPartyAttestation: false,
    });
    const matureAnchor = computeTrustScore({
      successRate: 1,
      transactionCount: 100,
      hasStellarTomlMetadata: false,
      hasThirdPartyAttestation: false,
    });
    expect(twoTransactions.score).toBeLessThan(matureAnchor.score);
  });

  it("caps maturity at 1 once past the maturity threshold (more transactions than 100 doesn't keep boosting it)", () => {
    const atThreshold = computeTrustScore({
      successRate: 1,
      transactionCount: 100,
      hasStellarTomlMetadata: false,
      hasThirdPartyAttestation: false,
    });
    const wayPastThreshold = computeTrustScore({
      successRate: 1,
      transactionCount: 100_000,
      hasStellarTomlMetadata: false,
      hasThirdPartyAttestation: false,
    });
    expect(atThreshold.breakdown.maturity).toBe(1);
    expect(wayPastThreshold.breakdown.maturity).toBe(1);
    expect(atThreshold.score).toBe(wayPastThreshold.score);
  });

  it("awards exactly 15 points for metadata presence, independent of reliability", () => {
    const withMetadata = computeTrustScore({
      successRate: 0,
      transactionCount: 0,
      hasStellarTomlMetadata: true,
      hasThirdPartyAttestation: false,
    });
    expect(withMetadata.breakdown.metadataPoints).toBe(15);
    expect(withMetadata.score).toBe(15);
  });

  it("awards exactly 25 points for a third-party attestation, independent of reliability", () => {
    const withAttestation = computeTrustScore({
      successRate: 0,
      transactionCount: 0,
      hasStellarTomlMetadata: false,
      hasThirdPartyAttestation: true,
    });
    expect(withAttestation.breakdown.attestationPoints).toBe(25);
    expect(withAttestation.score).toBe(25);
  });

  it("reaches the maximum score of 100 for a mature, perfectly reliable, fully attested anchor", () => {
    const best = computeTrustScore({
      successRate: 1,
      transactionCount: 100,
      hasStellarTomlMetadata: true,
      hasThirdPartyAttestation: true,
    });
    expect(best.score).toBe(100);
  });

  it("reaches zero only for a maximally untrustworthy anchor", () => {
    const worst = computeTrustScore({
      successRate: 0,
      transactionCount: 0,
      hasStellarTomlMetadata: false,
      hasThirdPartyAttestation: false,
    });
    expect(worst.score).toBe(0);
  });

  it("rejects an out-of-range successRate rather than silently clamping it", () => {
    expect(() =>
      computeTrustScore({
        successRate: 1.5,
        transactionCount: 10,
        hasStellarTomlMetadata: false,
        hasThirdPartyAttestation: false,
      }),
    ).toThrow(RangeError);
  });

  it("rejects a negative transactionCount", () => {
    expect(() =>
      computeTrustScore({
        successRate: 1,
        transactionCount: -1,
        hasStellarTomlMetadata: false,
        hasThirdPartyAttestation: false,
      }),
    ).toThrow(RangeError);
  });

  it("is a pure function: identical inputs always produce identical output", () => {
    const inputs = {
      successRate: 0.87,
      transactionCount: 340,
      hasStellarTomlMetadata: true,
      hasThirdPartyAttestation: false,
    };
    const a = computeTrustScore(inputs);
    const b = computeTrustScore(inputs);
    expect(a).toEqual(b);
  });
});
