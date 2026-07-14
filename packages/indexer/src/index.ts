/**
 * Real implementation: fetches an anchor's transaction history from
 * Stellar Horizon and its SEP-1 stellar.toml, assembling the inputs
 * @anchor-watch/trust-score needs. Confirmed against live
 * horizon-testnet.stellar.org and testanchor.stellar.org during
 * development (see __tests__/index.test.ts).
 */

import { computeTrustScore, type TrustScoreInputs, type TrustScoreResult } from "@anchor-watch/trust-score";

export interface HorizonTransactionRecord {
  successful: boolean;
  ledger: number;
  id: string;
}

export interface AccountHistory {
  successRate: number;
  transactionCount: number;
}

/**
 * Fetches an account's recent transaction history from Horizon and derives
 * the `successRate`/`transactionCount` Trust Score inputs.
 *
 * An account with no transaction history (or that doesn't exist) returns
 * `{ successRate: 0, transactionCount: 0 }` rather than throwing — a brand
 * new anchor should score as unproven, not error out the pipeline.
 */
export async function fetchAccountHistory(
  horizonUrl: string,
  accountId: string,
  limit = 200,
): Promise<AccountHistory> {
  const res = await fetch(
    `${horizonUrl}/accounts/${encodeURIComponent(accountId)}/transactions?order=desc&limit=${limit}`,
  );

  if (res.status === 404) {
    return { successRate: 0, transactionCount: 0 };
  }
  if (!res.ok) {
    throw new Error(`Horizon request failed: ${res.status} ${res.statusText}`);
  }

  const body = (await res.json()) as { _embedded: { records: HorizonTransactionRecord[] } };
  const records = body._embedded.records;
  const transactionCount = records.length;
  const successCount = records.filter((r) => r.successful).length;
  const successRate = transactionCount === 0 ? 0 : successCount / transactionCount;

  return { successRate, transactionCount };
}

/**
 * Fetches and does a minimal presence check on an anchor's SEP-1
 * stellar.toml. A minimal check, not a full parse — a full SEP-1 parser is
 * a separate, larger piece of work (tracked as its own issue); this
 * confirms the file exists and looks like a real stellar.toml rather than
 * an arbitrary 200 response.
 */
export async function hasStellarTomlMetadata(homeDomain: string): Promise<boolean> {
  try {
    const res = await fetch(`https://${homeDomain}/.well-known/stellar.toml`);
    if (!res.ok) return false;
    const raw = await res.text();
    return /\b(ACCOUNTS|SIGNING_KEY|FEDERATION_SERVER|TRANSFER_SERVER)\s*=/.test(raw);
  } catch {
    return false;
  }
}

export interface AnchorTrustScoreConfig {
  horizonUrl: string;
  accountId: string;
  homeDomain: string;
  hasThirdPartyAttestation?: boolean;
}

/**
 * Assembles real TrustScoreInputs for a given anchor and computes its
 * score. This is the intended integration point between the indexer and
 * `@anchor-watch/trust-score` — the Trust Score API (a separate, not-yet-
 * built piece) will call this on its refresh cadence.
 */
export async function computeAnchorTrustScoreLive(
  config: AnchorTrustScoreConfig,
): Promise<TrustScoreResult> {
  const [history, hasMetadata] = await Promise.all([
    fetchAccountHistory(config.horizonUrl, config.accountId),
    hasStellarTomlMetadata(config.homeDomain),
  ]);

  const inputs: TrustScoreInputs = {
    successRate: history.successRate,
    transactionCount: history.transactionCount,
    hasStellarTomlMetadata: hasMetadata,
    hasThirdPartyAttestation: config.hasThirdPartyAttestation ?? false,
  };

  return computeTrustScore(inputs);
}
