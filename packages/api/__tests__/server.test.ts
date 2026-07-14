import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AddressInfo } from "node:net";
import { createApiServer } from "../src/server.js";

const KNOWN_ACTIVE_ACCOUNT = "GBNLWXU6V53DYDZRPBOKYADWEZP2NA6WEYHXTDMNNWV3ZX7UJ6S7ZGJZ";

describe("Trust Score API server (real HTTP, real socket)", () => {
  let baseUrl: string;
  const server = createApiServer();

  beforeAll(async () => {
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it("returns 404 for an unknown route", async () => {
    const res = await fetch(`${baseUrl}/does-not-exist`);
    expect(res.status).toBe(404);
  });

  it("serves a real Trust Score over a real HTTP request", async () => {
    const res = await fetch(
      `${baseUrl}/trust-score?accountId=${KNOWN_ACTIVE_ACCOUNT}&homeDomain=testanchor.stellar.org`,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { score: number; breakdown: Record<string, number> };
    expect(body.score).toBeGreaterThan(0);
    expect(body.breakdown.metadataPoints).toBe(15);
  }, 20_000);

  it("returns 400 over real HTTP when required params are missing", async () => {
    const res = await fetch(`${baseUrl}/trust-score`);
    expect(res.status).toBe(400);
  });
});
