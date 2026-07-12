import fs from "node:fs/promises";
import path from "node:path";

const owner = process.env.GITHUB_OWNER || "kyoken0702-yt";
const repo = process.env.GITHUB_REPO || "kyoken-design";
const branch = process.env.GITHUB_BRANCH || "master";
const recordsPath = "data/records.json";

function githubToken() {
  return process.env.GITHUB_ADMIN_TOKEN || process.env.KYOKEN_GITHUB_TOKEN || process.env.GITHUB_TOKEN || "";
}

function deployHookUrl() {
  return process.env.VERCEL_DEPLOY_HOOK_URL || process.env.KYOKEN_DEPLOY_HOOK_URL || "";
}

function cleanGitPath(value) {
  const path = String(value || "").replace(/^\/+/, "");
  if (!path || path.includes("..") || path.startsWith(".git/")) throw new Error(`Invalid path: ${value}`);
  return path;
}

async function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  return req.body;
}

async function gh(path, options = {}) {
  const token = githubToken();
  if (!token) throw new Error("服务端缺少 GITHUB_ADMIN_TOKEN 或 KYOKEN_GITHUB_TOKEN。");
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error((data && data.message) || `GitHub API error: ${response.status}`);
  return data;
}

async function createBlob(content, encoding) {
  const blob = await gh("/git/blobs", {
    method: "POST",
    body: JSON.stringify({ content, encoding })
  });
  return blob.sha;
}

async function readRecords() {
  if (!githubToken()) {
    const localPath = path.join(process.cwd(), recordsPath);
    return JSON.parse(await fs.readFile(localPath, "utf8"));
  }
  const file = await gh(`/contents/${encodeURIComponent(recordsPath).replace(/%2F/g, "/")}?ref=${encodeURIComponent(branch)}`);
  return JSON.parse(Buffer.from(String(file.content || "").replace(/\s/g, ""), "base64").toString("utf8"));
}

async function commitBundle(uploadFiles, nextRecords, message) {
  const ref = await gh(`/git/ref/heads/${branch}`);
  const baseCommitSha = ref.object.sha;
  const baseCommit = await gh(`/git/commits/${baseCommitSha}`);
  const tree = [];

  for (const file of uploadFiles || []) {
    tree.push({
      path: cleanGitPath(file.path),
      mode: "100644",
      type: "blob",
      sha: file.sha || await createBlob(file.content, "base64")
    });
  }

  tree.push({
    path: recordsPath,
    mode: "100644",
    type: "blob",
    sha: await createBlob(`${JSON.stringify(nextRecords, null, 2)}\n`, "utf-8")
  });

  const newTree = await gh("/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree })
  });
  const newCommit = await gh("/git/commits", {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [baseCommitSha] })
  });
  await gh(`/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha, force: false })
  });
  return newCommit;
}

async function triggerDeployHook() {
  const hook = deployHookUrl();
  if (!hook) {
    return {
      ok: false,
      configured: false,
      message: "未配置 VERCEL_DEPLOY_HOOK_URL，前台需要等待 Vercel 自动部署或手动上线。"
    };
  }

  const response = await fetch(hook, { method: "POST" });
  const text = await response.text();
  if (!response.ok) {
    return {
      ok: false,
      configured: true,
      message: text || `Vercel Deploy Hook error: ${response.status}`
    };
  }
  return {
    ok: true,
    configured: true,
    message: "已触发 Vercel 生产部署。"
  };
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  try {
    if (req.method === "HEAD") {
      res.status(200).end();
      return;
    }

    if (req.method === "GET") {
      const records = await readRecords();
      res.status(200).send(JSON.stringify({
        ok: true,
        records,
        writable: Boolean(githubToken()),
        deployHookConfigured: Boolean(deployHookUrl())
      }));
      return;
    }

    if (!githubToken()) {
      res.status(503).send(JSON.stringify({
        ok: false,
        message: "服务端缺少 GITHUB_ADMIN_TOKEN 或 KYOKEN_GITHUB_TOKEN。请在 Vercel 环境变量配置 GitHub repo 写入 token 后再发布。"
      }));
      return;
    }

    if (req.method !== "POST") {
      res.status(405).send(JSON.stringify({ ok: false, message: "Method not allowed." }));
      return;
    }

    const body = await parseBody(req);

    if (body.action === "blob") {
      const file = body.file;
      if (!file || !file.path || !file.content) throw new Error("缺少上传文件。");
      const sha = await createBlob(file.content, "base64");
      res.status(200).send(JSON.stringify({ ok: true, file: { path: cleanGitPath(file.path), sha } }));
      return;
    }

    const records = await readRecords();

    if (body.action === "publish") {
      const record = body.record;
      if (!record || !record.id || !Array.isArray(record.media)) throw new Error("缺少发布记录。");
      const existing = records.filter((item) => item && item.id !== record.id);
      const nextRecords = [record].concat(existing);
      const commit = await commitBundle(body.uploadFiles || [], nextRecords, "publish kyoken supply record");
      const deploy = await triggerDeployHook();
      res.status(200).send(JSON.stringify({ ok: true, records: nextRecords, commit: commit.sha, deploy }));
      return;
    }

    if (body.action === "remove") {
      const id = String(body.id || "");
      if (!id) throw new Error("缺少要删除的记录 ID。");
      const nextRecords = records.filter((item) => item && item.id !== id);
      const commit = await commitBundle([], nextRecords, "remove kyoken supply record");
      const deploy = await triggerDeployHook();
      res.status(200).send(JSON.stringify({ ok: true, records: nextRecords, commit: commit.sha, deploy }));
      return;
    }

    if (body.action === "update-media") {
      const id = String(body.id || "");
      const media = Array.isArray(body.media) ? body.media.filter(Boolean).map(String) : null;
      if (!id || !media) throw new Error("缺少要更新的记录 ID 或媒体列表。");
      const nextRecords = records.map((item) => item && item.id === id ? { ...item, media } : item);
      if (!nextRecords.some((item) => item && item.id === id)) throw new Error("找不到要更新的记录。");
      const commit = await commitBundle(body.uploadFiles || [], nextRecords, "update kyoken supply record media");
      const deploy = await triggerDeployHook();
      res.status(200).send(JSON.stringify({ ok: true, records: nextRecords, commit: commit.sha, deploy }));
      return;
    }

    res.status(400).send(JSON.stringify({ ok: false, message: "Unknown action." }));
  } catch (error) {
    res.status(500).send(JSON.stringify({ ok: false, message: error.message || "Admin API error." }));
  }
}
