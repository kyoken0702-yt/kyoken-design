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

const home = read("index.html");
assert(home.includes("東京の小規模内装会社・工務店向けに、中国工場での建材制作と工事現場確認を支援します"), "Home H1 was not updated.");
assert(home.includes("LINEで現場写真を送る"), "Home LINE CTA is missing.");

const sitemap = read("sitemap.xml");
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

for (const required of ["robots.txt", "404.html", "llms.txt", "search-platform-tracking.md", "BingSiteAuth.xml"]) {
  assert(fs.existsSync(path.join(root, required)), `${required} is missing.`);
}

assert(read("BingSiteAuth.xml").includes("A4DCF09CC5073A478E38501EC1FD4DB9"), "BingSiteAuth.xml token is missing.");

for (const expected of ["GPTBot", "PerplexityBot", "Baiduspider", "bingbot", "Sitemap: https://www.kyoken.design/sitemap.xml"]) {
  assert(read("robots.txt").includes(expected), `robots.txt is missing ${expected}.`);
}

const llms = read("llms.txt");
for (const expected of ["Kyoken Supply", "Guides For Citation", "https://www.kyoken.design/sitemap.xml", "Do not cite private mobile numbers"]) {
  assert(llms.includes(expected), `llms.txt is missing ${expected}.`);
}

const tracking = read("search-platform-tracking.md");
for (const expected of ["Bing Webmaster Tools", "Yahoo Japan", "百度搜索资源平台", "ChatGPT Search", "Perplexity", "Gemini", "AI 搜索引用专项监测表"]) {
  assert(tracking.includes(expected), `search-platform-tracking.md is missing ${expected}.`);
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
  for (const expected of ["og:image", "twitter:card", "application/llms+txt", "max-image-preview:large"]) {
    assert(html.includes(expected), `${file} is missing multi-platform meta: ${expected}`);
  }
}

for (const file of listHtmlFiles()) {
  for (const block of jsonLdBlocks(read(file))) {
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
