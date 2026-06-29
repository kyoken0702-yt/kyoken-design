import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const lineUrl = "https://line.me/R/ti/p/@566wlcvz";

const products = [
  ["curtain-details.html", "オーダーカーテン", "Custom Curtains", "定制窗帘", "1.8倍ヒダ、採寸、標準簡易取付まで確認する窓まわり資材。"],
  ["acrylic-sign-details.html", "アクリルサイン", "Acrylic Sign", "亚克力标识", "ロゴデータ、厚み、取付方法、現場下地を確認する室内サイン。"],
  ["lightbox-details.html", "バックライトフィルム", "Lightbox Film", "灯箱画片", "デザインデータ、既存ライトボックス寸法、配送梱包を確認する画面資材。"],
  ["pvc-sign-details.html", "PVC看板・プレート", "PVC Sign", "PVC标牌", "案内板、注意表示、駐車場表示など小ロットで動かしやすい板材。"],
  ["enamel-panel.html", "ホーローキッチンパネル", "Enamel Panel", "珐琅磁吸板", "厨房・水回り向けに、板材、梱包、搬入条件を確認するパネル。"],
  ["acoustic-panel-details.html", "吸音フェルトパネル", "Acoustic Panel", "吸音毛毡板", "色、厚み、下地、枚数、現場固定方法を確認する吸音材。"],
  ["wallpaper-details.html", "シームレス壁紙", "Seamless Wallpaper", "无缝墙布", "柄データ、壁面寸法、ロール梱包、施工側条件を確認する内装材。"],
  ["wpc-decking-details.html", "屋外用人工木材", "Outdoor WPC Decking", "户外人工木地板", "屋外搬入、下地、数量、長物梱包を確認するデッキ材。"]
];

const zhProductNotes = {
  "curtain-details.html": "确认 1.8 倍褶皱、上门测量、标准简易安装及窗边条件的窗帘材料。",
  "acrylic-sign-details.html": "确认标志文件、厚度、安装方式和现场基层条件的室内标识。",
  "lightbox-details.html": "确认设计文件、既有灯箱尺寸、包装和配送条件的画面材料。",
  "pvc-sign-details.html": "适用于导视牌、注意提示、停车场标识等小批量板材。",
  "enamel-panel.html": "面向厨房和水回等空间，确认板材、包装和搬入条件的磁吸板材。",
  "acoustic-panel-details.html": "确认颜色、厚度、基层、数量和现场固定方式的吸音材料。",
  "wallpaper-details.html": "确认图案文件、墙面尺寸、卷装包装和施工侧条件的内装材料。",
  "wpc-decking-details.html": "确认户外搬入、基层、数量和长条材料包装条件的人工木地板。"
};

const enProductNotes = {
  "curtain-details.html": "Curtain materials checked by pleat ratio, measurement, simple installation, and window conditions.",
  "acrylic-sign-details.html": "Indoor signage checked by logo data, thickness, fixing method, and site substrate.",
  "lightbox-details.html": "Display film checked by design data, existing lightbox size, packaging, and delivery conditions.",
  "pvc-sign-details.html": "Small-lot panels for guidance signs, caution notices, parking signs, and temporary displays.",
  "enamel-panel.html": "Magnetic enamel panels checked by board specification, packing method, and carrying route.",
  "acoustic-panel-details.html": "Acoustic materials checked by color, thickness, substrate, quantity, and fixing method.",
  "wallpaper-details.html": "Interior wall materials checked by pattern data, wall size, roll packing, and installation conditions.",
  "wpc-decking-details.html": "Outdoor decking checked by carrying route, substrate, quantity, and long-material packaging."
};

const langConfig = {
  ja: {
    dir: "",
    htmlLang: "ja",
    title: "京建サプライ｜中国工場 × 日本現場 × 工務店のサプライチェーンパートナー",
    description: "京建サプライは、中国工場と日本現場をつなぎ、工務店・内装会社・設計会社のために材料調達、包装、物流、現場確認を支えるサプライチェーンパートナーです。",
    logo: "京建サプライ",
    nav: ["今日のサプライチェーン", "中国工場", "現場記録", "工務店連携", "製品分類"],
    heroTitle: "二十年、サプライチェーンだけを積み上げてきました。",
    heroSub: ["中国工場", "↓", "日本現場", "↓", "長期連携"],
    heroBody: "京建サプライは施工会社ではありません。中国側の製作、包装、物流、日本到着後の現場確認をつなぎ、工務店・内装会社の背後で材料供給の確実性を積み上げます。",
    primary: "今日のサプライチェーンを見る",
    secondary: "現場記録を見る",
    todayTitle: "今日のサプライチェーン",
    todayLead: "毎日増えていく実記録。写真、寸法、包装、到着、確認。派手な広告ではなく、材料が現場へ届くまでの事実を残します。",
    factoryTitle: "中国工場",
    factoryLead: "工場、職人、機械、梱包、倉庫。京建が見るのは価格だけではありません。安定して作れるか、梱包できるか、日本の現場に届く形にできるかを確認します。",
    siteTitle: "現場記録",
    siteLead: "施工実績ではなく、材料が現場に着くまでの記録です。寸法確認、材料到着、破損確認、取付前確認、引き渡し。施工は工務店様が主役です。",
    timelineTitle: "サプライチェーン時間軸",
    timelineSteps: ["注文設計確認", "工場確認", "サンプル / 仕様確認", "梱包", "国際物流", "日本国内配送", "現場引き渡し"],
    partnerTitle: "工務店連携",
    partnerLead: "京建は現場を奪いません。材料、調達、輸送、到着確認を支え、施工・顧客対応・取付費用は工務店様側で決めていただきます。",
    productsTitle: "製品分類",
    contactTitle: "図面・写真・寸法を送ってください",
    contactLead: "材料、包装、輸送、現場到着までの不確実性を一つずつ確認します。",
    line: "LINEでサプライチェーン相談",
    contractorUrl: "contractor-partnership.html",
    estimateUrl: "estimate.html",
    homeUrl: "index.html",
    productPrefix: ""
  },
  en: {
    dir: "en",
    htmlLang: "en",
    title: "Kyoken Supply | China Factory × Japan Site × Contractor Supply Chain Partner",
    description: "Kyoken Supply supports contractors and interior companies by connecting Chinese factories with Japanese job sites through procurement, packaging, logistics, and site confirmation.",
    logo: "Kyoken Supply",
    nav: ["Today", "China Factory", "Site Records", "Partners", "Products"],
    heroTitle: "Twenty years, focused on supply chain certainty.",
    heroSub: ["China Factory", "↓", "Japan Site", "↓", "Long-term Partnership"],
    heroBody: "Kyoken Supply is not a contractor competing for your site. We support material sourcing, production coordination, export packaging, logistics, and arrival confirmation so contractors can focus on their own clients and installation work.",
    primary: "View Today's Supply Chain",
    secondary: "View Site Records",
    todayTitle: "Today's Supply Chain",
    todayLead: "A growing record of real work: photos, dimensions, packaging, shipment, arrival, and confirmation. Less advertising, more evidence.",
    factoryTitle: "China Factory",
    factoryLead: "Factories, skilled workers, machines, packing lines, warehouses. We look beyond price and check whether materials can be made, packed, shipped, and received reliably.",
    siteTitle: "Site Records",
    siteLead: "Not construction cases. These are records of materials landing at Japanese sites: measurements, delivery, damage check, pre-installation confirmation, and handover.",
    timelineTitle: "Supply Chain Timeline",
    timelineSteps: ["Order design confirmation", "Factory confirmation", "Sample / specification", "Packing", "International logistics", "Japan delivery", "Site handover"],
    partnerTitle: "Contractor Partnership",
    partnerLead: "Kyoken does not take your construction clients. We support procurement, transportation, delivery, and confirmation; contractors remain responsible for installation, site work, pricing, and customer relationships.",
    productsTitle: "Product Categories",
    contactTitle: "Send drawings, photos, dimensions",
    contactLead: "We help reduce uncertainty around materials, packaging, delivery, and site coordination one item at a time.",
    line: "Consult via LINE",
    contractorUrl: "contractor-partnership.html",
    estimateUrl: "../estimate.html",
    homeUrl: "index.html",
    productPrefix: ""
  },
  zh: {
    dir: "zh",
    htmlLang: "zh-Hans",
    title: "京建供应链｜中国工厂 × 日本现场 × 工务店供应链合作伙伴",
    description: "京建供应链连接中国工厂和日本现场，为工务店、内装公司、设计公司提供材料采购、包装、物流、现场确认等供应链支持。",
    logo: "京建供应链",
    nav: ["今日供应链", "中国工厂", "现场记录", "工务店合作", "产品分类"],
    heroTitle: "二十年，只做好供应链这一件事。",
    heroSub: ["中国工厂", "↓", "日本现场", "↓", "长期合作"],
    heroBody: "京建不是施工竞争者。我们做的是中国侧生产、包装、物流、日本到场确认，把材料可交付、可安装、可沟通这件事做稳定。",
    primary: "查看今天供应链",
    secondary: "查看现场记录",
    todayTitle: "今日供应链",
    todayLead: "每天增加真实记录：照片、尺寸、包装、运输、到场、确认。不是广告堆砌，而是把材料抵达日本现场的过程长期沉淀下来。",
    factoryTitle: "中国工厂",
    factoryLead: "工厂、老师傅、机器、包装线、仓库。京建看的不是最低价，而是能不能稳定生产、稳定包装、稳定交付到日本现场。",
    siteTitle: "现场记录",
    siteLead: "不是施工案例，而是材料落地记录。尺寸确认、材料到场、破损确认、安装前确认、交付确认。施工主角仍然是工务店。",
    timelineTitle: "供应链时间轴",
    timelineSteps: ["订单设计确认", "工厂确认", "样品 / 规格确认", "包装", "国际物流", "日本国内配送", "现场交付"],
    partnerTitle: "工务店合作",
    partnerLead: "京建负责材料、采购、运输、交付确认；现场施工、安装报价、终端客户维护由工务店主导。",
    productsTitle: "产品分类",
    contactTitle: "发送图纸、现场照片、尺寸",
    contactLead: "我们帮助确认材料、包装、运输、到场和现场配合，把不确定性一项一项降下来。",
    line: "LINE 供应链咨询",
    contractorUrl: "contractor-partnership.html",
    estimateUrl: "../estimate.html",
    homeUrl: "index.html",
    productPrefix: ""
  }
};

function rel(dir, file) {
  return dir ? `${dir}/${file}` : file;
}

function productHref(lang, file) {
  if (lang === "ja") return file;
  return file;
}

function photoSlot(label, note = "SUPPLY RECORD") {
  return `<div class="v5-photo-slot">
    <span>${note}</span>
    <strong>${label}</strong>
  </div>`;
}

function productCards(lang) {
  return products.map(([file, ja, en, zh, note]) => {
    const name = lang === "en" ? en : lang === "zh" ? zh : ja;
    const href = productHref(lang, file);
    const sub = lang === "en" ? "Factory source / packaging / delivery / site confirmation" : lang === "zh" ? "工厂来源 / 包装 / 运输 / 日本现场确认" : "工場確認 / 包装 / 物流 / 現場確認";
    const productNote = lang === "en" ? enProductNotes[file] : lang === "zh" ? zhProductNotes[file] : note;
    return `<a href="${href}" class="v5-product-card">
      ${photoSlot(name, lang === "en" ? "PRODUCT RECORD" : lang === "zh" ? "产品记录" : "製品記録")}
      <div>
        <h3>${name}</h3>
        <p>${sub}</p>
        <small>${productNote}</small>
      </div>
    </a>`;
  }).join("\n");
}

function homePage(lang) {
  const c = langConfig[lang];
  const prefix = lang === "ja" ? "" : "../";
  const languageSwitch = lang === "ja"
    ? `<span>JP</span><a href="en/index.html">EN</a><a href="zh/index.html">CN</a>`
    : lang === "en"
      ? `<a href="../index.html">JP</a><span>EN</span><a href="../zh/index.html">CN</a>`
      : `<a href="../index.html">JP</a><a href="../en/index.html">EN</a><span>中文</span>`;
  return `<!DOCTYPE html>
<html lang="${c.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${c.title}</title>
  <meta name="description" content="${c.description}">
  <meta name="keywords" content="${lang === "en" ? "China factory, Japan site, supply chain, contractors, interior companies, material sourcing, Tokyo delivery, construction materials" : lang === "zh" ? "中国工厂,日本现场,供应链,工务店,内装公司,材料采购,东京交付,建材供应" : "中国工場,日本現場,サプライチェーン,工務店,内装会社,材料調達,東京交付,建材供給"}">
  <meta property="og:title" content="${c.title}">
  <meta property="og:description" content="${c.description}">
  <meta property="og:image" content="${prefix}assets/real-site/og-supply-chain.jpg">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="${prefix}styles.css">
</head>
<body class="v5-body">
  <header class="v5-header">
    <a href="${c.homeUrl}" class="v5-logo">${c.logo}</a>
    <nav class="v5-nav">
      <a href="#today">${c.nav[0]}</a>
      <a href="#factory">${c.nav[1]}</a>
      <a href="#site">${c.nav[2]}</a>
      <a href="${c.contractorUrl}">${c.nav[3]}</a>
      <a href="#products">${c.nav[4]}</a>
    </nav>
    <div class="v5-lang">${languageSwitch}</div>
  </header>

  <main>
    <section class="v5-hero">
      <div class="v5-hero-photo">
        ${photoSlot(lang === "en" ? "Factory / packing / site records" : lang === "zh" ? "工厂 / 包装 / 现场记录" : "工場・梱包・現場の記録", lang === "en" ? "SUPPLY RECORD" : lang === "zh" ? "供应链记录" : "写真記録")}
      </div>
      <div class="v5-hero-copy">
        <p class="v5-kicker">CHINA FACTORY × JAPAN SITE</p>
        <h1>${c.heroTitle}</h1>
        <div class="v5-route">${c.heroSub.map((item) => `<span>${item}</span>`).join("")}</div>
        <p>${c.heroBody}</p>
        <div class="v5-actions">
          <a href="#today">${c.primary}</a>
          <a href="#site">${c.secondary}</a>
        </div>
      </div>
    </section>

    <section id="today" class="v5-section">
      <p class="v5-kicker">TODAY</p>
      <h2>${c.todayTitle}</h2>
      <p class="v5-lead">${c.todayLead}</p>
      <div class="v5-record-grid">
        ${["2026.06.29", "2026.06.28", "2026.06.27"].map((date, index) => `<article class="v5-record">
          ${photoSlot(lang === "en" ? "Factory packing / material arrival" : lang === "zh" ? "工厂包装 / 材料到场" : "工場包装 / 材料到着", date)}
          <h3>${date}</h3>
          <p>${lang === "en" ? "A daily supply-chain note is added here: what was checked, what arrived, and what uncertainty was reduced." : lang === "zh" ? "这里持续增加当天供应链记录：确认了什么、到了什么、降低了哪一项不确定性。" : "その日のサプライチェーン記録を追加します。何を確認し、何が届き、どの不確実性を下げたかを残します。"}</p>
        </article>`).join("\n")}
      </div>
    </section>

    <section id="factory" class="v5-section v5-split">
      <div>
        <p class="v5-kicker">FACTORY</p>
        <h2>${c.factoryTitle}</h2>
        <p class="v5-lead">${c.factoryLead}</p>
      </div>
      <div class="v5-record-grid two">
        ${photoSlot(lang === "en" ? "Machine / worker / warehouse" : lang === "zh" ? "机器 / 师傅 / 仓库" : "機械 / 職人 / 倉庫", lang === "en" ? "FACTORY RECORD" : lang === "zh" ? "工厂记录" : "工場記録")}
        ${photoSlot(lang === "en" ? "Packing / label / pallet" : lang === "zh" ? "包装 / 标签 / 托盘" : "梱包 / ラベル / パレット", lang === "en" ? "PACKING RECORD" : lang === "zh" ? "包装记录" : "梱包記録")}
      </div>
    </section>

    <section id="site" class="v5-section v5-split reverse">
      <div>
        <p class="v5-kicker">SITE RECORDS</p>
        <h2>${c.siteTitle}</h2>
        <p class="v5-lead">${c.siteLead}</p>
      </div>
      <div class="v5-record-grid two">
        ${photoSlot(lang === "en" ? "Tape measure / drawing / arrival check" : lang === "zh" ? "卷尺 / 图纸 / 到场确认" : "巻尺 / 図面 / 到着確認", lang === "en" ? "SITE RECORD" : lang === "zh" ? "现场记录" : "現場記録")}
        ${photoSlot(lang === "en" ? "Material before installation" : lang === "zh" ? "安装前材料确认" : "取付前の材料確認", lang === "en" ? "SITE RECORD" : lang === "zh" ? "现场记录" : "現場記録")}
      </div>
    </section>

    <section class="v5-section">
      <p class="v5-kicker">TIMELINE</p>
      <h2>${c.timelineTitle}</h2>
      <div class="v5-timeline">
        ${c.timelineSteps.map((step, i) => `<div><span>0${i + 1}</span><strong>${step}</strong></div>`).join("")}
      </div>
    </section>

    <section class="v5-section v5-partner">
      <p class="v5-kicker">PARTNERSHIP</p>
      <h2>${c.partnerTitle}</h2>
      <p class="v5-lead">${c.partnerLead}</p>
      <a href="${c.contractorUrl}">${c.partnerTitle}</a>
    </section>

    <section id="products" class="v5-section">
      <p class="v5-kicker">PRODUCTS</p>
      <h2>${c.productsTitle}</h2>
      <div class="v5-product-grid">${productCards(lang)}</div>
    </section>

    <section class="v5-section v5-contact">
      <h2>${c.contactTitle}</h2>
      <p>${c.contactLead}</p>
      <a href="${lineUrl}">${c.line}</a>
    </section>
  </main>

  <footer class="v5-footer">
    <strong>${lang === "en" ? "Kyoken Real Estate Development Co., Ltd." : lang === "zh" ? "京建不动产开发株式会社" : "京建不動産開発株式会社"}</strong>
    <p>${lang === "en" ? "3-7-7-4F Nihonbashi, Chuo-ku, Tokyo 103-0027" : lang === "zh" ? "〒103-0027 东京都中央区日本桥3丁目7-7-4F" : "〒103-0027 東京都中央区日本橋3丁目7-7-4F"} / Tel: 03-6555-1306 / Email: kyoken0702@gmail.com</p>
    <p>© 2026 Kyoken Real Estate Development Co., Ltd.</p>
  </footer>
</body>
</html>
`;
}

function contractorPage(lang) {
  const c = langConfig[lang];
  const prefix = lang === "ja" ? "" : "../";
  const title = lang === "en" ? "Contractor Partnership" : lang === "zh" ? "工务店合作" : "工務店連携";
  const body = lang === "en"
    ? ["Kyoken is not your construction competitor.", "We support the supply chain: factory coordination, material confirmation, packaging, logistics, and delivery confirmation.", "Contractors remain responsible for measurement decisions, installation, site safety, installation pricing, and end-customer relationships."]
    : lang === "zh"
      ? ["京建不是施工竞争者。", "我们负责供应链：工厂对接、材料确认、包装、物流、到场确认。", "工务店负责现场测量判断、安装施工、现场安全、安装报价和终端客户维护。"]
      : ["京建は施工競争者ではありません。", "当方はサプライチェーンを支えます。工場調整、材料確認、梱包、物流、到着確認。", "採寸判断、取付施工、現場安全、施工費用、エンドユーザー対応は工務店様の領域です。"];
  const kyokenItems = lang === "ja"
    ? ["工場・仕入先の確認", "仕様・数量の整理", "梱包・物流調整", "到着・引き渡し確認"]
    : lang === "zh"
      ? ["工厂与供应商确认", "规格与数量整理", "包装与物流协调", "到场与交付确认"]
      : ["Factory sourcing", "Specification confirmation", "Packaging and logistics", "Delivery confirmation"];
  const contractorItems = lang === "ja"
    ? ["現場での採寸判断", "取付施工と現場安全", "施工費用の見積", "エンドユーザー対応"]
    : lang === "zh"
      ? ["现场测量判断", "安装施工与现场安全", "安装费用报价", "终端客户维护"]
      : ["Site measurement judgment", "Installation and site safety", "Installation fee quotation", "End-customer relationship"];
  return `<!DOCTYPE html>
<html lang="${c.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ${c.logo}</title>
  <meta name="description" content="${c.partnerLead}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="${prefix}styles.css">
</head>
<body class="v5-body">
  <header class="v5-header">
    <a href="${c.homeUrl}" class="v5-logo">${c.logo}</a>
    <nav class="v5-nav"><a href="${c.homeUrl}#today">${c.nav[0]}</a><a href="${c.homeUrl}#products">${c.nav[4]}</a></nav>
  </header>
  <main>
    <section class="v5-section v5-partner-page">
      <p class="v5-kicker">CONTRACTOR PARTNERSHIP</p>
      <h1>${title}</h1>
      ${body.map((line) => `<p>${line}</p>`).join("\n")}
      <div class="v5-role-grid">
        <div><h2>${lang === "en" ? "Kyoken" : lang === "zh" ? "京建负责" : "京建が担当"}</h2><ul>${kyokenItems.map((item) => `<li>${item}</li>`).join("")}</ul></div>
        <div><h2>${lang === "en" ? "Contractor" : lang === "zh" ? "工务店负责" : "工務店様が担当"}</h2><ul>${contractorItems.map((item) => `<li>${item}</li>`).join("")}</ul></div>
      </div>
      <a class="v5-line-link" href="${lineUrl}">${c.line}</a>
    </section>
  </main>
  <footer class="v5-footer"><strong>Kyoken Real Estate Development Co., Ltd.</strong><p>© 2026 Kyoken Real Estate Development Co., Ltd.</p></footer>
</body>
</html>
`;
}

function productStory(lang, title) {
  const c = langConfig[lang];
  if (lang === "en") {
    return `<section class="v5-product-story">
      <p class="v5-kicker">SUPPLY CHAIN STORY</p>
      <h2>Life of one product: ${title}</h2>
      <p>Each product page is no longer only specifications and price. It records where the material comes from, how it is packed, how it moves to Japan, and what must be checked before installation.</p>
      <div class="v5-story-grid"><div><span>01</span><h3>Factory Source</h3><p>Confirm material, process, production stability, and supplier communication.</p></div><div><span>02</span><h3>Packaging</h3><p>Check carton, edge protection, labels, pallet or roll packing according to product risk.</p></div><div><span>03</span><h3>Transport</h3><p>Confirm route, size, quantity, import-related costs, and local delivery conditions case by case.</p></div><div><span>04</span><h3>Japan Site</h3><p>Record arrival, damage check, measurement confirmation, and handover to the contractor.</p></div></div>
      <div class="v5-contractor-note"><strong>Role boundary:</strong> Kyoken supports supply chain certainty. Contractors handle installation, site responsibility, installation pricing, and end-customer communication.</div>
    </section>`;
  }
  if (lang === "zh") {
    return `<section class="v5-product-story">
      <p class="v5-kicker">SUPPLY CHAIN STORY</p>
      <h2>一件产品的一生：${title}</h2>
      <p>产品页不再只是规格和价格。它要持续记录材料来自哪里、怎样包装、怎样到日本、安装前需要确认什么。</p>
      <div class="v5-story-grid"><div><span>01</span><h3>工厂来源</h3><p>确认材料、工艺、生产稳定性和供应商沟通能力。</p></div><div><span>02</span><h3>包装方式</h3><p>根据产品风险确认纸箱、护角、标签、托盘、卷装或木架。</p></div><div><span>03</span><h3>运输确认</h3><p>按尺寸、数量、重量、进口费用和日本配送地址逐案确认。</p></div><div><span>04</span><h3>日本现场</h3><p>记录到场、破损检查、尺寸确认、安装前交接。</p></div></div>
      <div class="v5-contractor-note"><strong>分工边界：</strong>京建负责降低供应链不确定性；工务店负责安装施工、现场责任、安装报价和终端客户沟通。</div>
    </section>`;
  }
  return `<section class="v5-product-story">
    <p class="v5-kicker">SUPPLY CHAIN STORY</p>
    <h2>一つの製品の一生：${title}</h2>
    <p>製品ページは、仕様と価格だけでは終わりません。材料がどこで作られ、どう梱包され、どう日本へ届き、現場で何を確認するかを残していきます。</p>
    <div class="v5-story-grid"><div><span>01</span><h3>工場確認</h3><p>素材、加工方法、製作安定性、サプライヤーとの連絡精度を確認します。</p></div><div><span>02</span><h3>包装方式</h3><p>破損リスクに合わせ、箱、角保護、ラベル、パレット、ロール梱包を確認します。</p></div><div><span>03</span><h3>輸送確認</h3><p>サイズ、数量、重量、輸入諸費用、日本国内配送を案件ごとに確認します。</p></div><div><span>04</span><h3>日本現場</h3><p>到着、破損確認、寸法確認、取付前の引き渡しを記録します。</p></div></div>
    <div class="v5-contractor-note"><strong>分担：</strong>京建はサプライチェーンの不確実性を下げます。施工、現場責任、取付費用、エンドユーザー対応は工務店様の領域です。</div>
  </section>`;
}

function writeFile(relativePath, content) {
  fs.mkdirSync(path.dirname(path.join(root, relativePath)), { recursive: true });
  fs.writeFileSync(path.join(root, relativePath), content);
}

for (const lang of Object.keys(langConfig)) {
  const dir = langConfig[lang].dir;
  writeFile(rel(dir, "index.html"), homePage(lang));
  writeFile(rel(dir, "contractor-partnership.html"), contractorPage(lang));
}

const detailFiles = [
  ...products.map(([file]) => file),
  ...products.map(([file]) => `en/${file}`),
  ...products.map(([file]) => `zh/${file}`)
];

for (const file of detailFiles) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  let html = fs.readFileSync(full, "utf8");
  const lang = file.startsWith("en/") ? "en" : file.startsWith("zh/") ? "zh" : "ja";
  const titleMatch = html.match(/<title>([^|<]+)/u);
  const title = (titleMatch?.[1] || "Product").trim();
  html = html
    .replace(/<section class="v5-product-story">[\s\S]*?<\/section>\s*/u, "")
    .replace(/導入事例・施工実績/gu, "現場記録")
    .replace(/導入事例・施工イメージ/gu, "現場記録")
    .replace(/施工ギャラリー/gu, "現場記録")
    .replace(/施工実績/gu, "現場記録")
    .replace(/Case Grid \(Gallery\)/gu, "Site Records")
    .replace(/Case Grid \(Compact\)/gu, "Site Records")
    .replace(/快速报价/gu, "资料确认后报价");
  const story = productStory(lang, title);
  html = html.replace(/\s*<!-- Footer -->/u, `\n${story}\n\n    <!-- Footer -->`);
  writeFile(file, html);
}

console.log("V5 rebuild complete");
