import { createServer, type Server } from "node:http";
import { handleGetTrustScore } from "./index.js";

export interface ServerConfig {
  horizonUrl?: string;
}

const DEFAULT_HORIZON_URL = "https://horizon-testnet.stellar.org";

/**
 * Creates (but does not start) the Trust Score API HTTP server.
 *
 * Routes:
 *   GET /trust-score?accountId=...&homeDomain=... -> Trust Score result
 */
export function createApiServer(config: ServerConfig = {}): Server {
  const horizonUrl = config.horizonUrl ?? DEFAULT_HORIZON_URL;

  return createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && url.pathname === "/trust-score") {
      handleGetTrustScore({ horizonUrl }, url.searchParams).then(({ status, body }) => {
        res.writeHead(status, { "content-type": "application/json" });
        res.end(JSON.stringify(body));
      });
      return;
    }

    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "not found" }));
  });
}

const isMain = process.argv[1] && import.meta.url === new URL(process.argv[1], "file://").href;
if (isMain) {
  const port = Number(process.env.PORT ?? 8787);
  createApiServer({ horizonUrl: process.env.HORIZON_URL }).listen(port, () => {
    console.log(`Trust Score API listening on :${port}`);
  });
}
