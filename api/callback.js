import { adminOrigin, adminLogin, cookie, sessionCookie } from "../lib/admin-session.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).send("Method not allowed.");
  const expected = cookie(req, "__Host-kyoken_oauth_state");
  const clearState = "__Host-kyoken_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";
  res.setHeader("Set-Cookie", clearState);
  if (!expected || expected !== req.query.state || typeof req.query.code !== "string") {
    return res.status(400).send("Login expired or invalid. Please return to /admin/ and sign in again.");
  }
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) return res.status(503).send("Admin authentication is not configured.");
  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code: req.query.code, redirect_uri: `${adminOrigin}/api/callback` })
    });
    const token = await response.json();
    if (!response.ok || !token.access_token) return res.status(401).send("GitHub login failed. Please try again.");
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token.access_token}` }
    });
    const user = await userResponse.json();
    if (!userResponse.ok) return res.status(502).send("Unable to verify GitHub identity. Please try again.");
    if (user.login !== adminLogin) return res.status(403).send("This GitHub account is not the website administrator.");
    res.setHeader("Set-Cookie", [clearState, sessionCookie(user.login)]);
    return res.redirect(`${adminOrigin}/admin/`);
  } catch {
    return res.status(502).send("GitHub authentication is temporarily unavailable. Please try again.");
  }
}
