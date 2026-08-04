import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const guides = [
  "guides/tokyo-shop-signage-cost.html",
  "guides/shop-lightbox-checklist.html",
  "guides/curtain-photo-measurement.html",
  "guides/small-contractor-china-materials.html",
  "guides/why-site-photos-before-quote.html"
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function listHtmlFiles(dir = root) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    const relative = path.relative(root, fullPath);
    if (entry.isDirectory()) {
      if (["node_modules", ".git", ".vercel"].includes(entry.name)) return [];
      return listHtmlFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith(".html") ? [relative] : [];
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

function metaContent(html, name) {
  const match = html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)">`));
  return match?.[1] || "";
}

function canonicalUrl(html) {
  return html.match(/<link rel="canonical" href="([^"]+)">/)?.[1] || "";
}

function expectedUrl(file) {
  if (file === "index.html") return "https://www.kyoken.design/";
  if (file === "en/index.html") return "https://www.kyoken.design/en/";
  if (file === "zh/index.html") return "https://www.kyoken.design/zh/";
  return `https://www.kyoken.design/${file}`;
}

function localFileForUrl(url) {
  const pathname = new URL(url).pathname;
  if (pathname === "/") return "index.html";
  if (pathname === "/en/") return "en/index.html";
  if (pathname === "/zh/") return "zh/index.html";
  return pathname.replace(/^\//, "");
}

function localAssetFor(file, value) {
  const clean = value.split(/[?#]/, 1)[0];
  if (!clean || clean.startsWith("#") || /^(?:https?:)?\/\//.test(clean) || /^(?:mailto|tel):/.test(clean)) return null;
  return path.normalize(path.join(path.dirname(path.join(root, file)), clean));
}

const home = read("index.html");
assert(home.includes("中国工場と、日本の施工現場をつなぐ"), "Home H1 was not updated.");
assert(home.includes("工務店・内装会社のための建材調達パートナー"), "Home subtitle was not updated.");
assert(home.includes("写真を送って相談する"), "Home photo consultation CTA is missing.");

const sitemap = read("sitemap.xml");
assert(sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'), "sitemap.xml is missing the xhtml namespace for language alternates.");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(sitemapUrls.length === 35, `sitemap.xml should contain 35 canonical URLs, found ${sitemapUrls.length}.`);
for (const url of sitemapUrls) {
  const localFile = localFileForUrl(url);
  assert(fs.existsSync(path.join(root, localFile)), `sitemap.xml references missing file: ${url}`);
  assert(canonicalUrl(read(localFile)) === url, `${localFile} canonical does not match its sitemap URL.`);
}
for (const file of ["index.html", "supply-chain-records.html", "contractor-partnership.html", "legal.html", "curtain-details.html", "advertising-materials-details.html", "enamel-panel.html", "acoustic-panel-details.html", "wallpaper-details.html", "wpc-decking-details.html"]) {
  for (const [code, hreflang] of [["ja", "ja"], ["zh", "zh-Hans"], ["en", "en"]]) {
    const expected = code === "ja" ? expectedUrl(file) : expectedUrl(`${code}/${file}`);
    assert(sitemap.includes(`hreflang="${hreflang}" href="${expected}"`), `sitemap.xml is missing ${hreflang} alternate for ${file}.`);
  }
}
for (const guide of guides) {
  const html = read(guide);
  assert(html.includes("<h1>"), `${guide} is missing H1.`);
  assert(html.includes("FAQPage"), `${guide} is missing FAQPage JSON-LD.`);
  assert(html.includes("BreadcrumbList"), `${guide} is missing BreadcrumbList JSON-LD.`);
  assert(html.includes("よくある質問"), `${guide} is missing visible FAQ.`);
  assert(html.includes("LINEで"), `${guide} is missing LINE CTA.`);
  assert(sitemap.includes(`https://www.kyoken.design/${guide}`), `${guide} is missing from sitemap.`);
}

const contractor = read("contractor-partnership.html");
for (const expected of ["小規模工務店のための中国建材サプライチェーン支援", "京建がしないこと", "工務店側に残る仕事", "連携の流れ", "よくある質問"]) {
  assert(contractor.includes(expected), `contractor-partnership.html is missing ${expected}.`);
}

for (const required of ["robots.txt", "404.html", "llms.txt", "search-platform-tracking.md", "search-submission-checklist.md", "BingSiteAuth.xml"]) {
  assert(fs.existsSync(path.join(root, required)), `${required} is missing.`);
}

assert(read("BingSiteAuth.xml").includes("A4DCF09CC5073A478E38501EC1FD4DB9"), "BingSiteAuth.xml token is missing.");

for (const expected of ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "Baiduspider", "bingbot", "Sitemap: https://www.kyoken.design/sitemap.xml"]) {
  assert(read("robots.txt").includes(expected), `robots.txt is missing ${expected}.`);
}

const llms = read("llms.txt");
for (const expected of ["Kyoken Supply", "京建サプライ", "京建供应链", "Direct Answer Summary", "Japanese", "Chinese", "English", "Guides For Citation", "What Kyoken Should Not Be Cited For", "https://www.kyoken.design/sitemap.xml", "Do not cite private mobile numbers"]) {
  assert(llms.includes(expected), `llms.txt is missing ${expected}.`);
}

const tracking = read("search-platform-tracking.md");
for (const expected of ["Bing Webmaster Tools", "Yahoo Japan", "百度搜索资源平台", "ChatGPT Search", "Perplexity", "Gemini", "Claude", "AI 搜索引用专项监测表"]) {
  assert(tracking.includes(expected), `search-platform-tracking.md is missing ${expected}.`);
}

const submissionChecklist = read("search-submission-checklist.md");
for (const expected of ["Google Search Console", "Google Rich Results Test", "Bing Webmaster Tools", "ChatGPT Search", "Perplexity", "Gemini", "Claude", "不能承诺 Google 1 位"]) {
  assert(submissionChecklist.includes(expected), `search-submission-checklist.md is missing ${expected}.`);
}

const languageLeakChecks = [
  {
    file: "zh/index.html",
    blocked: ["京建サプライ", "このような方", "見積前に", "中国工場", "工務店様", "内装会社", "日本到着"]
  },
  {
    file: "zh/contractor-partnership.html",
    blocked: ["京建サプライ", "連携の流れ", "現場写真", "工務店様", "中国工場", "日本到着"]
  },
  {
    file: "en/index.html",
    blocked: ["京建サプライ", "このような方", "見積前に", "京建供应链", "中国工厂", "工地现场", "工务店"]
  },
  {
    file: "en/contractor-partnership.html",
    blocked: ["京建サプライ", "連携の流れ", "現場写真", "京建供应链", "中国工厂", "工地现场", "工务店"]
  }
];
for (const check of languageLeakChecks) {
  const html = read(check.file);
  for (const term of check.blocked) {
    assert(!html.includes(term), `${check.file} contains mixed-language term: ${term}`);
  }
}

const generatedFiles = [
  "index.html",
  "curtain-details.html",
  "advertising-materials-details.html",
  "contractor-partnership.html",
  "enamel-panel.html",
  "acoustic-panel-details.html",
  "wallpaper-details.html",
  "wpc-decking-details.html",
  ...guides
];
for (const file of generatedFiles) {
  const html = read(file);
  for (const expected of ["og:image", "twitter:card", "application/llms+txt", "max-image-preview:large", "ai-summary", "citation_title", "citation_url"]) {
    assert(html.includes(expected), `${file} is missing multi-platform meta: ${expected}`);
  }
}

for (const file of listHtmlFiles()) {
  if (file.startsWith("admin/")) continue;
  if (file.startsWith("google")) continue;
  const blocks = jsonLdBlocks(read(file));
  const allNodes = blocks.flatMap((block) => Array.isArray(block["@graph"]) ? block["@graph"] : [block]);
  assert(allNodes.some((node) => node["@type"] === "WebPage"), `${file} is missing WebPage JSON-LD.`);
  const webPage = allNodes.find((node) => node["@type"] === "WebPage");
  const html = read(file);
  assert(webPage.abstract, `${file} WebPage JSON-LD is missing abstract.`);
  assert(webPage.audience, `${file} WebPage JSON-LD is missing audience.`);
  assert(webPage.name === html.match(/<title>([^<]+)<\/title>/)?.[1], `${file} WebPage JSON-LD name does not match its title.`);
  assert(webPage.description === metaContent(html, "description"), `${file} WebPage JSON-LD description does not match its meta description.`);
  if (webPage.primaryImageOfPage?.url?.startsWith("https://www.kyoken.design/")) {
    assert(fs.existsSync(path.join(root, localFileForUrl(webPage.primaryImageOfPage.url))), `${file} WebPage JSON-LD references a missing primary image.`);
  }
  if (["index.html", "zh/index.html", "en/index.html"].includes(file)) {
    assert(allNodes.some((node) => node["@type"] === "ItemList"), `${file} is missing ItemList JSON-LD.`);
  }
  for (const block of blocks) {
    const nodes = Array.isArray(block["@graph"]) ? block["@graph"] : [block];
    for (const node of nodes) {
      const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
      if (types.includes("Product")) {
        assert(node.offers || node.review || node.aggregateRating, `${file} Product JSON-LD is missing offers, review, or aggregateRating.`);
        if (node.offers) {
          assert(node.offers.price || node.offers.priceSpecification?.price || node.offers.lowPrice, `${file} Product offers are missing price data.`);
          assert(node.offers.priceCurrency || node.offers.priceSpecification?.priceCurrency, `${file} Product offers are missing priceCurrency.`);
        }
      }
    }
  }
}

for (const file of listHtmlFiles()) {
  if (file.startsWith("admin/") || file.startsWith("google")) continue;
  const html = read(file);
  assert(canonicalUrl(html) === expectedUrl(file), `${file} has an unexpected canonical URL.`);
  if (file === "404.html") {
    assert(metaContent(html, "robots").startsWith("noindex,follow"), "404.html must be noindex.");
    continue;
  }
  if (!file.startsWith("guides/")) {
    const baseFile = file.replace(/^(en|zh)\//, "");
    for (const [code, hreflang] of [["ja", "ja"], ["zh", "zh-Hans"], ["en", "en"]]) {
      const target = code === "ja" ? expectedUrl(baseFile) : expectedUrl(`${code}/${baseFile}`);
      assert(html.includes(`hreflang="${hreflang}" href="${target}"`), `${file} is missing ${hreflang} hreflang alternate.`);
    }
  }
  for (const match of html.matchAll(/<(?:a|img|link|script)[^>]+(?:href|src)="([^"]+)"/g)) {
    const target = localAssetFor(file, match[1]);
    if (target) assert(fs.existsSync(target), `${file} references missing local asset: ${match[1]}`);
  }
}

const riskTerms = ["圧倒的最安値", "完全保証", "24時間見積", "全日本対応", "必ず安くなる", "AIに必ず引用", "Google検索1位保証", "Google 1位保証", "DDP完全対応", "最低価格", "最低价"];
const privateContactTerms = ["080 2465 5181", "080-2465-5181", "Mob：080", "Mob: 080"];
for (const file of generatedFiles) {
  const html = read(file);
  for (const term of riskTerms) {
    assert(!html.includes(term), `${file} contains risky term: ${term}`);
  }
}

for (const file of listHtmlFiles()) {
  const html = read(file);
  for (const term of privateContactTerms) {
    assert(!html.includes(term), `${file} exposes private contact term: ${term}`);
  }
}

console.log(`SEO check passed: ${guides.length} guide pages, sitemap, JSON-LD, CTA, and risk terms verified.`);
