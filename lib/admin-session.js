import crypto from "node:crypto";

export const adminOrigin = "https://www.kyoken.design";
export const adminLogin = "kyoken0702-yt";
const cookieName = "__Host-kyoken_admin";
const lifetime = 8 * 60 * 60;

export function cookie(req, name) {
  const item = String(req.headers.cookie || "").split(";").map(s => s.trim()).find(s => s.startsWith(`${name}=`));
  return item ? item.slice(name.length + 1) : "";
}

function signature(payload) {
  const secret = process.env.GITHUB_CLIENT_SECRET;
  if (!secret) throw new Error("Admin authentication is not configured.");
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function sessionCookie(login) {
  if (login !== adminLogin) throw new Error("Administrator access required.");
  const payload = Buffer.from(JSON.stringify({ login, exp: Math.floor(Date.now() / 1000) + lifetime })).toString("base64url");
  return `${cookieName}=${payload}.${signature(payload)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${lifetime}`;
}

export function authenticated(req) {
  try {
    const parts = cookie(req, cookieName).split(".");
    if (parts.length !== 2) return false;
    const [payload, provided] = parts;
    const expected = signature(payload);
    if (provided.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.login === adminLogin && Number.isFinite(data.exp) && data.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function protectAdmin(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!authenticated(req)) {
    res.status(401).send(JSON.stringify({ ok: false, message: "请先使用管理员 GitHub 账号登录。" }));
    return false;
  }
  if (req.method !== "GET" && req.method !== "HEAD" &&
      (req.headers.origin !== adminOrigin || !/^application\/json(?:;|$)/i.test(req.headers["content-type"] || ""))) {
    res.status(403).send(JSON.stringify({ ok: false, message: "请求来源不合法，请从本站后台重试。" }));
    return false;
  }
  return true;
}
