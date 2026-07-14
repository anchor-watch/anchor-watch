/**
 * Trust Score API v1 request handling — decoupled from the HTTP server
 * (server.ts) so it's testable without a real listener, though
 * __tests__/server.test.ts also exercises it through a real server on a
 * real socket for genuine end-to-end coverage.
 */

import { computeAnchorTrustScoreLive } from "@anchor-watch/indexer";

export interface TrustScoreApiConfig {
  horizonUrl: string;
}

export interface ApiResponse {
  status: number;
  body: unknown;
}

export async function handleGetTrustScore(
  config: TrustScoreApiConfig,
  searchParams: URLSearchParams,
): Promise<ApiResponse> {
  const accountId = searchParams.get("accountId");
  const homeDomain = searchParams.get("homeDomain");

  if (!accountId || !homeDomain) {
    return {
      status: 400,
      body: { error: "accountId and homeDomain query parameters are both required" },
    };
  }

  try {
    const result = await computeAnchorTrustScoreLive({
      horizonUrl: config.horizonUrl,
      accountId,
      homeDomain,
    });
    return { status: 200, body: result };
  } catch (err) {
    return {
      status: 502,
      body: { error: err instanceof Error ? err.message : "unknown upstream error" },
    };
  }
}
