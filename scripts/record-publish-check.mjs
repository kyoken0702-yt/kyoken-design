import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import handler from "../api/admin-records.js";
import { sessionCookie } from "../lib/admin-session.js";

// Exercise the real handler with an authenticated local session and mocked GitHub.
// These tests never write to GitHub or the live site.
process.env.GITHUB_CLIENT_SECRET = "local-test-secret-not-a-credential";
process.env.GITHUB_ADMIN_TOKEN = "test-server-token";
delete process.env.VERCEL_DEPLOY_HOOK_URL;
delete process.env.KYOKEN_DEPLOY_HOOK_URL;
const headers = { cookie: sessionCookie("kyoken0702-yt").split(";")[0], origin: "https://www.kyoken.design", "content-type": "application/json" };
const original = [
  { id: "existing-october", module: "factory", channel: "advertising", title: "广告材料制作工厂", createdAt: "2026-10-06T08:24:05.445Z", media: ["/media/records/factory/advertising/october.jpg"] },
  { id: "existing-july", module: "factory", channel: "advertising", title: "广告材料制作工厂", createdAt: "2026-07-05T00:00:00+09:00", media: ["/media/records/factory/advertising/july.jpg"] }
];
const incoming = { ...original[0], id: "new-independent-record", createdAt: "invalid", media: ["/media/records/factory/advertising/new.jpg"] };
let mutations, written;
globalThis.fetch = async (url, options = {}) => {
  let data;
  if (!options.method) {
    if (url.includes("/contents/")) data = { content: Buffer.from(JSON.stringify(original)).toString("base64") };
    else if (url.includes("/git/ref/")) data = { object: { sha: "base" } };
    else if (url.endsWith("/git/commits/base")) data = { tree: { sha: "base-tree" } };
    else throw new Error(`Unexpected read: ${url}`);
  } else {
    mutations.push({ url, ...options });
    const body = JSON.parse(options.body);
    if (url.endsWith("/git/blobs") && body.encoding === "utf-8") written = JSON.parse(body.content);
    data = { sha: "test-sha" };
  }
  return { ok: true, text: async () => JSON.stringify(data) };
};
async function request(body) {
  mutations = []; written = undefined;
  const res = { code: 200, setHeader() {}, status(code) { this.code = code; return this; }, send(body) { this.body = JSON.parse(body); } };
  await handler({ method: "POST", headers, body }, res);
  return res;
}
for (const confirmation of [undefined, false, "true"]) {
  const res = await request({ action: "publish", record: { ...incoming }, confirmSeparateRecord: confirmation });
  assert.equal(res.code, 409);
  assert.equal(mutations.length, 0);
}
const collision = await request({ action: "publish", record: { ...original[0] }, confirmSeparateRecord: true });
assert.equal(collision.code, 409);
assert.equal(mutations.length, 0);
const invalid = await request({ action: "publish", record: { ...incoming, channel: undefined }, confirmSeparateRecord: true });
assert.equal(invalid.code, 400);
assert.equal(mutations.length, 0);
const separate = await request({ action: "publish", record: { ...incoming }, confirmSeparateRecord: true });
assert.equal(separate.code, 200);
assert.deepEqual(written.slice(1), original);
assert.deepEqual(written[0].media, incoming.media);
assert.ok(Number.isFinite(Date.parse(written[0].createdAt)));
assert.equal(mutations.filter(call => call.url.endsWith("/git/commits")).length, 1);
assert.equal(JSON.parse(mutations.at(-1).body).force, false);
const first = await request({ action: "publish", record: { ...incoming, channel: "enamel" } });
assert.equal(first.code, 200);
assert.deepEqual(written.slice(1), original);
const appendedMedia = original[0].media.concat(incoming.media);
const appended = await request({ action: "update-media", id: original[0].id, media: appendedMedia });
assert.equal(appended.code, 200);
assert.equal(written.length, original.length);
assert.deepEqual(written[0], { ...original[0], media: appendedMedia });
assert.deepEqual(written.slice(1), original.slice(1));

// Cancelling the browser's separate-record confirmation must upload nothing.
const html = fs.readFileSync(new URL("../admin/index.html", import.meta.url), "utf8");
const publish = html.slice(html.indexOf("      async function publishRecord()"), html.indexOf("      async function deleteRecord("));
let confirmations = 0;
const context = vm.createContext({
  canMutate: () => true, moduleInput: { value: "factory" }, channelInput: { value: "advertising" },
  channelLabels: {}, $: () => ({ value: "title" }), filesInput: { files: [{ name: "test.jpg" }] },
  isAllowed: () => true, isVideo: () => false, records: original,
  window: { confirm: () => { confirmations++; return false; } },
  setBusy: () => { throw new Error("Must cancel before upload"); },
  adminApi: () => { throw new Error("Must not upload"); }
});
vm.runInContext(publish, context);
await context.publishRecord();
assert.equal(confirmations, 1);
console.log("Record publish check passed: cancel, server confirmation, ID collision, separate record, creation date, and append without data loss.");
