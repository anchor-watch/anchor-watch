import { describe, expect, it } from "vitest";
import { computeAnchorTrustScoreLive, fetchAccountHistory, hasStellarTomlMetadata } from "../src/index.js";

const HORIZON = "https://horizon-testnet.stellar.org";

// A real account from this account's own Held in Trust testnet deployment —
// as of this test's authoring it has 13 real transactions, all successful.
// If this account accumulates more real activity later the >= assertions
// below still hold; they don't assume an exact frozen count.
const KNOWN_ACTIVE_ACCOUNT = "GBNLWXU6V53DYDZRPBOKYADWEZP2NA6WEYHXTDMNNWV3ZX7UJ6S7ZGJZ";

describe("fetchAccountHistory (live horizon-testnet.stellar.org)", () => {
  it("returns real transaction history for a known active account", async () => {
    const history = await fetchAccountHistory(HORIZON, KNOWN_ACTIVE_ACCOUNT);
    expect(history.transactionCount).toBeGreaterThanOrEqual(13);
    expect(history.successRate).toBe(1); // every transaction on this account has succeeded so far
  }, 15_000);

  it("returns zero history for an account that doesn't exist, rather than throwing", async () => {
    // A freshly generated, never-funded keypair — confirmed via a direct
    // Horizon lookup (404) to genuinely not exist on testnet before writing
    // this test. Do not reuse the well-known Stellar "zero address"
    // (…AAAWHF) here: it turns out to be a real, active account with
    // dozens of real transactions from other testers, not an empty one.
    const neverUsed = "GC6L5AYC7YU73QZAEHO4V55II57KCX5KAQB7AJW672SCHWUO2W4NGYGA";
    const history = await fetchAccountHistory(HORIZON, neverUsed);
    expect(history).toEqual({ successRate: 0, transactionCount: 0 });
  }, 15_000);
});

describe("hasStellarTomlMetadata (live testanchor.stellar.org)", () => {
  it("returns true for a real, known Stellar test anchor's stellar.toml", async () => {
    const result = await hasStellarTomlMetadata("testanchor.stellar.org");
    expect(result).toBe(true);
  }, 15_000);

  it("returns false for a domain with no stellar.toml", async () => {
    const result = await hasStellarTomlMetadata("example.com");
    expect(result).toBe(false);
  }, 15_000);
});

describe("computeAnchorTrustScoreLive (end-to-end against live network)", () => {
  it("computes a real, non-trivial score for a known active account + real anchor domain", async () => {
    const result = await computeAnchorTrustScoreLive({
      horizonUrl: HORIZON,
      accountId: KNOWN_ACTIVE_ACCOUNT,
      homeDomain: "testanchor.stellar.org", // account itself isn't this anchor; just proving the metadata half of the pipeline against a real domain
      hasThirdPartyAttestation: false,
    });

    expect(result.breakdown.metadataPoints).toBe(15); // real stellar.toml found
    expect(result.breakdown.reliabilityPoints).toBeGreaterThan(0); // real successful history found
    expect(result.score).toBeGreaterThan(15);
  }, 20_000);
});
