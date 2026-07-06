import crypto from "node:crypto";

const requiredScope = "repo";

function getBaseUrl(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send("Missing GITHUB_CLIENT_ID.");
    return;
  }

  const state = crypto.randomBytes(24).toString("hex");
  const baseUrl = getBaseUrl(req);
  const callbackUrl = `${baseUrl}/api/callback`;
  const scope = String(req.query.scope || requiredScope);
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", callbackUrl);
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", state);

  res.setHeader("Set-Cookie", [
    `kyoken_supply_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  ]);
  res.redirect(authUrl.toString());
}
