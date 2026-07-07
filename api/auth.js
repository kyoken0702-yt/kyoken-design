import crypto from "node:crypto";

const requiredScope = "repo";
const canonicalSiteUrl = "https://kyoken.design";

function isAllowedReturnOrigin(origin) {
  try {
    const url = new URL(origin);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return false;
    return url.hostname === "kyoken.design" ||
      url.hostname === "www.kyoken.design" ||
      url.hostname.endsWith(".vercel.app") ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1";
  } catch (error) {
    return false;
  }
}

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
  const requestBaseUrl = getBaseUrl(req);
  const isLocalRequest = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestBaseUrl);
  const baseUrl = isLocalRequest ? requestBaseUrl : canonicalSiteUrl;
  const returnOrigin = isAllowedReturnOrigin(req.query.return_origin) ? String(req.query.return_origin) : baseUrl;

  if (!isLocalRequest && requestBaseUrl !== canonicalSiteUrl) {
    const canonicalAuthUrl = new URL("/api/auth", canonicalSiteUrl);
    canonicalAuthUrl.searchParams.set("scope", String(req.query.scope || requiredScope));
    canonicalAuthUrl.searchParams.set("return_origin", returnOrigin);
    res.redirect(canonicalAuthUrl.toString());
    return;
  }

  const callbackUrl = `${baseUrl}/api/callback`;
  const scope = String(req.query.scope || requiredScope);
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", callbackUrl);
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", state);

  res.setHeader("Set-Cookie", [
    `kyoken_supply_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    `kyoken_supply_return_origin=${encodeURIComponent(returnOrigin)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  ]);
  res.redirect(authUrl.toString());
}
