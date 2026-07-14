import { describe, expect, it } from "vitest";
import { handleGetTrustScore } from "../src/index.js";

const HORIZON = "https://horizon-testnet.stellar.org";
const KNOWN_ACTIVE_ACCOUNT = "GBNLWXU6V53DYDZRPBOKYADWEZP2NA6WEYHXTDMNNWV3ZX7UJ6S7ZGJZ";

describe("handleGetTrustScore", () => {
  it("returns 400 when accountId is missing", async () => {
    const params = new URLSearchParams({ homeDomain: "testanchor.stellar.org" });
    const result = await handleGetTrustScore({ horizonUrl: HORIZON }, params);
    expect(result.status).toBe(400);
  });

  it("returns 400 when homeDomain is missing", async () => {
    const params = new URLSearchParams({ accountId: KNOWN_ACTIVE_ACCOUNT });
    const result = await handleGetTrustScore({ horizonUrl: HORIZON }, params);
    expect(result.status).toBe(400);
  });

  it("returns a real computed score for valid params (live network)", async () => {
    const params = new URLSearchParams({
      accountId: KNOWN_ACTIVE_ACCOUNT,
      homeDomain: "testanchor.stellar.org",
    });
    const result = await handleGetTrustScore({ horizonUrl: HORIZON }, params);
    expect(result.status).toBe(200);
    const body = result.body as { score: number };
    expect(body.score).toBeGreaterThan(0);
  }, 20_000);

  it("returns 502 when the Horizon URL itself is unreachable/invalid", async () => {
    const params = new URLSearchParams({
      accountId: KNOWN_ACTIVE_ACCOUNT,
      homeDomain: "testanchor.stellar.org",
    });
    const result = await handleGetTrustScore(
      { horizonUrl: "https://this-horizon-host-does-not-exist.invalid" },
      params,
    );
    expect(result.status).toBe(502);
  }, 20_000);
});
