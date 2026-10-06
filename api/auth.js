import crypto from "node:crypto";
import { adminOrigin } from "../lib/admin-session.js";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).send("Method not allowed.");
  if (req.headers.host !== new URL(adminOrigin).host) return res.redirect(`${adminOrigin}/api/auth`);
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId || !process.env.GITHUB_CLIENT_SECRET) return res.status(503).send("Admin authentication is not configured.");
  const state = crypto.randomBytes(24).toString("hex");
  res.setHeader("Set-Cookie", `__Host-kyoken_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${adminOrigin}/api/callback`);
  url.searchParams.set("scope", "read:user");
  url.searchParams.set("state", state);
  res.redirect(url.toString());
}
