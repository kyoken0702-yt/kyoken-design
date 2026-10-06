import assert from "node:assert/strict";
import crypto from "node:crypto";
import { authenticated, sessionCookie } from "../lib/admin-session.js";
import records from "../api/admin-records.js";
import auth from "../api/auth.js";
import callback from "../api/callback.js";

process.env.GITHUB_CLIENT_SECRET = "local-test-secret-not-a-credential";
process.env.GITHUB_CLIENT_ID = "test-client";
process.env.GITHUB_ADMIN_TOKEN = "test-server-token";
const session = sessionCookie("kyoken0702-yt").split(";")[0];
const headers = { cookie: session, origin: "https://www.kyoken.design", "content-type": "application/json" };
function response() {
  return { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(n) { this.code = n; return this; }, send(v) { this.body = v; return this; }, end() {}, redirect(v) { this.code = 302; this.location = v; } };
}
let calls = 0;
globalThis.fetch = async () => { calls++; throw new Error("Unexpected external request"); };
assert.ok(authenticated({ headers }));
assert.ok(!authenticated({ headers: { cookie: session + "x" } }));
assert.throws(() => sessionCookie("other-user"));
for (const data of [{ login: "kyoken0702-yt", exp: 1 }, { login: "other-user", exp: Date.now() / 1000 + 1000 }]) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const sig = crypto.createHmac("sha256", process.env.GITHUB_CLIENT_SECRET).update(payload).digest("base64url");
  assert.ok(!authenticated({ headers: { cookie: `__Host-kyoken_admin=${payload}.${sig}` } }));
}
for (const action of ["blob", "publish", "remove", "update-media"]) {
  const res = response();
  await records({ method: "POST", headers: {}, body: { action } }, res);
  assert.equal(res.code, 401);
}
for (const method of ["GET", "HEAD"]) {
  const res = response();
  await records({ method, headers: {} }, res);
  assert.equal(res.code, 401);
}
for (const origin of [undefined, "https://evil.example", "https://other.vercel.app"]) {
  const res = response();
  await records({ method: "POST", headers: { ...headers, origin }, body: { action: "remove", id: "anything" } }, res);
  assert.equal(res.code, 403);
}
for (const filePath of ["api/auth.js", "media/records/site/x.html", "media/records/site/../x.jpg", "media/records/site/%2e%2e/x.jpg"]) {
  const res = response();
  await records({ method: "POST", headers, body: { action: "blob", file: { path: filePath, content: "YQ==" } } }, res);
  assert.equal(res.code, 500);
}
assert.equal(calls, 0);
const login = response();
auth({ method: "GET", headers: { host: "www.kyoken.design" }, query: { scope: "repo", return_origin: "https://evil.example" } }, login);
assert.equal(new URL(login.location).searchParams.get("scope"), "read:user");
assert.equal(new URL(login.location).searchParams.get("redirect_uri"), "https://www.kyoken.design/api/callback");
const invalid = response();
await callback({ method: "GET", headers: {}, query: { state: "bad", code: "test" } }, invalid);
assert.equal(invalid.code, 400);
assert.equal(calls, 0);
for (const user of ["other-user", "kyoken0702-yt"]) {
  globalThis.fetch = async url => ({ ok: true, json: async () => url.includes("access_token") ? { access_token: "never-expose-this" } : { login: user } });
  const res = response();
  await callback({ method: "GET", headers: { cookie: "__Host-kyoken_oauth_state=test-state" }, query: { state: "test-state", code: "test" } }, res);
  assert.equal(res.code, user === "other-user" ? 403 : 302);
  assert.ok(!JSON.stringify(res).includes("never-expose-this"));
  if (user === "kyoken0702-yt") assert.match(res.headers["Set-Cookie"][1], /HttpOnly; Secure; SameSite=Lax/);
}
globalThis.fetch = async () => ({ ok: true, text: async () => JSON.stringify({ content: Buffer.from("[]").toString("base64") }) });
const allowed = response();
await records({ method: "GET", headers }, allowed);
assert.equal(allowed.code, 200);
assert.equal(JSON.parse(allowed.body).ok, true);
console.log("Admin security check passed: anonymous writes, forged/expired sessions, CSRF, paths, OAuth state, account restriction, and authorized reads.");
