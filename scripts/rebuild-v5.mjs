import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const lineUrl = "https://line.me/R/ti/p/@566wlcvz";
const siteUrl = "https://www.kyoken.design";

const records = readJson("data/records.json")
  .filter((record) => record && ["factory", "site"].includes(record.module))
  .sort((a, b) => String(b.createdAt || b.id).localeCompare(String(a.createdAt || a.id)));

const products = [
  {
    file: "curtain-details.html",
    key: "curtains",
    image: "media/remote/e2f130af6ea5.png",
    names: { ja: "オーダーカーテン", zh: "定制窗帘", en: "Custom Curtains" },
    one: {
      ja: "採寸、標準簡易取付、窓まわり条件を確認して手配するカーテン資材。",
      zh: "确认测量、标准简易安装和窗边条件后安排的窗帘材料。",
      en: "Curtain materials arranged after measurement, simple installation, and window checks."
    },
    quote: { ja: "仕様確認後に概算見積", zh: "规格确认后提供概算报价", en: "Rough quote after specification review" },
    plans: {
      ja: [
        ["腰窓セット", "W 50-140cm / H 50-140cm", "参考 ¥11,800"],
        ["ワイド窓セット", "W 141-200cm / H 141-200cm", "参考 ¥24,800"],
        ["掃き出し窓セット", "W 201-300cm / H 201-260cm", "参考 ¥62,800"]
      ],
      zh: [
        ["腰窗套餐", "宽 50-140cm / 高 50-140cm", "参考 ¥11,800"],
        ["宽窗套餐", "宽 141-200cm / 高 141-200cm", "参考 ¥24,800"],
        ["落地窗套餐", "宽 201-300cm / 高 201-260cm", "参考 ¥62,800"]
      ],
      en: [
        ["Standard window set", "W 50-140cm / H 50-140cm", "Ref. ¥11,800"],
        ["Wide window set", "W 141-200cm / H 141-200cm", "Ref. ¥24,800"],
        ["Full-height window set", "W 201-300cm / H 201-260cm", "Ref. ¥62,800"]
      ]
    },
    priceTable: {
      ja: {
        title: "1.8倍ヒダ 2重セット参考価格（厚地 + レース）",
        head: ["丈 \\ 幅(cm)", "50-140", "141-200", "201-260", "261-300"],
        rows: [
          ["50-140", "¥11,800", "¥15,800", "¥26,800", "¥35,800"],
          ["141-200", "¥16,800", "¥24,800", "¥38,800", "¥52,800"],
          ["201-260", "¥19,800", "¥29,800", "¥46,800", "¥62,800"]
        ],
        note: "税込参考価格。生地、窓数、取付条件、配送先により変動します。カーテンレールは含みません。"
      },
      zh: {
        title: "1.8 倍褶皱双层套餐参考价（厚帘 + 纱帘）",
        head: ["高 \\ 宽(cm)", "50-140", "141-200", "201-260", "261-300"],
        rows: [
          ["50-140", "¥11,800", "¥15,800", "¥26,800", "¥35,800"],
          ["141-200", "¥16,800", "¥24,800", "¥38,800", "¥52,800"],
          ["201-260", "¥19,800", "¥29,800", "¥46,800", "¥62,800"]
        ],
        note: "含税参考价。会随面料、窗数、安装条件、配送地址变化。窗帘杆不包含在套餐价格内。"
      },
      en: {
        title: "1.8x fullness double-layer set reference price (drape + sheer)",
        head: ["H \\ W(cm)", "50-140", "141-200", "201-260", "261-300"],
        rows: [
          ["50-140", "¥11,800", "¥15,800", "¥26,800", "¥35,800"],
          ["141-200", "¥16,800", "¥24,800", "¥38,800", "¥52,800"],
          ["201-260", "¥19,800", "¥29,800", "¥46,800", "¥62,800"]
        ],
        note: "Tax-included reference only. Fabric, window count, installation conditions, and delivery address may change the quote. Curtain rods are not included."
      }
    },
    materialDetails: {
      ja: [["1級遮光", "寝室や西日の強い窓向けに遮光性を確認。"], ["形態安定加工", "熱セットでウェーブを整え、洗濯後の形崩れを抑えます。"], ["採寸基準", "掃き出し窓は床から -1cm、腰窓は窓枠から +15cm を目安に確認。"]],
      zh: [["一级遮光", "适合卧室、西晒强的窗户，按案件确认遮光等级。"], ["形态安定加工", "通过热定型保持褶皱波形，减少洗后变形。"], ["测量基准", "落地窗通常离地 -1cm，腰窗通常在窗框下方 +15cm 左右确认。"]],
      en: [["Blackout option", "Checked for bedrooms and strong afternoon-sun windows."], ["Shape-stabilizing finish", "Heat-set waves help the curtain keep its form after washing."], ["Measurement basis", "Full-height windows usually finish 1cm above floor; standard windows often extend about 15cm below frame."]]
    },
    specs: {
      ja: ["1.8倍ヒダを基本仕様として確認", "生地、遮光、レース有無を案件ごとに確認", "カーテンレールは套餐価格に含みません", "採寸と標準簡易取付は手配可能。複雑施工、高所作業、特殊固定は現場ごとに確認"],
      zh: ["以 1.8 倍褶皱为基本规格", "面料、遮光、纱帘按案件确认", "窗帘套餐价格不包含窗帘杆", "可安排上门测量和标准简易安装；复杂施工、高空作业、特殊固定方式按现场另行确认"],
      en: ["1.8x fullness as the current base specification", "Fabric, blackout level, and lace curtain needs checked case by case", "Curtain rods are not included in package pricing", "Measurement and standard simple installation can be arranged; complex work, high-place work, and special fixing are checked separately"]
    }
  },
  {
    file: "advertising-materials-details.html",
    key: "advertising",
    image: "media/remote/c1f2ceb8eb9d.png",
    names: { ja: "広告材料制作", zh: "广告材料制作", en: "Advertising Material Production" },
    one: {
      ja: "店舗・施設向け広告材料を図面、寸法、設置条件ごとに確認します。",
      zh: "店铺和设施广告材料按图纸、尺寸和现场条件确认后安排制作。",
      en: "Signage materials checked by drawings, dimensions, and site conditions."
    },
    quote: { ja: "案件ごとにお見積り", zh: "按案件报价", en: "Case-by-case quote" },
    specs: {
      ja: ["アクリル切文字、電飾看板用フィルム、塩ビプレートサイン", "AI、PDF、写真などのデータを確認", "サイズ、厚み、素材、色、数量を確認", "梱包と搬入条件を案件ごとに確認"],
      zh: ["亚克力切文字、灯箱电饰膜、PVC 板标牌", "确认 AI、PDF、图片等设计文件", "确认尺寸、厚度、材料、颜色和数量", "按案件确认包装和搬入条件"],
      en: ["Acrylic letters, backlit sign film, and PVC plate signs", "AI, PDF, and image files checked", "Size, thickness, material, color, and quantity confirmed", "Packing and carrying conditions checked case by case"]
    }
  },
  {
    file: "enamel-panel.html",
    key: "enamel",
    image: "media/remote/f35f79d49094.png",
    names: { ja: "ホーローキッチンパネル", zh: "珐琅磁吸板", en: "Enamel Kitchen Panel" },
    one: {
      ja: "厨房・水回り・店舗壁面向けに、板材仕様と搬入条件を確認するパネル。",
      zh: "面向厨房、水回和店铺墙面，确认板材规格和搬入条件的磁吸板材。",
      en: "Panel materials for kitchens, wet areas, and shop walls."
    },
    quote: { ja: "案件ごとにお見積り", zh: "按案件报价", en: "Case-by-case quote" },
    specs: {
      ja: ["サイズ、厚み、枚数を確認", "カット、穴あけ、端部処理の可否を確認", "搬入経路、重量、割れ防止梱包を確認", "水回り条件は案件ごとに確認"],
      zh: ["确认尺寸、厚度、数量", "确认切割、开孔、边部处理可否", "确认搬入路线、重量、防破损包装", "水回条件逐案确认"],
      en: ["Size, thickness, and quantity checked", "Cutting, drilling, and edge processing confirmed", "Carrying route, weight, and anti-breakage packing checked", "Wet-area conditions checked case by case"]
    }
  },
  {
    file: "acoustic-panel-details.html",
    key: "acoustic",
    image: "media/remote/c3805c6eb4b0.png",
    names: { ja: "フェルト吸音パネル", zh: "毛毡吸音板", en: "Felt Acoustic Panel" },
    one: {
      ja: "色、厚み、下地、固定方法を確認する吸音材。",
      zh: "确认颜色、厚度、基层和固定方式的吸音材料。",
      en: "Acoustic panels checked by color, thickness, substrate, and fixing method."
    },
    quote: { ja: "案件ごとにお見積り", zh: "按案件报价", en: "Case-by-case quote" },
    specs: {
      ja: ["色、厚み、密度、枚数を確認", "接着、ピン、ビスなど固定方法を確認", "壁下地、割付、カット条件を確認", "大型枚数の場合は梱包と搬入を個別確認"],
      zh: ["确认颜色、厚度、密度、数量", "确认胶粘、针固定、螺丝固定等方式", "确认墙面基层、排版、切割条件", "大批量时单独确认包装和搬入"],
      en: ["Color, thickness, density, and quantity checked", "Adhesive, pin, screw, or other fixing method confirmed", "Wall substrate, layout, and cutting conditions checked", "Packing and carrying checked separately for large quantities"]
    }
  },
  {
    file: "wallpaper-details.html",
    key: "wallpaper",
    image: "media/remote/668ef6041d0b.jpg",
    names: { ja: "壁紙・壁装材", zh: "墙纸 / 墙布材料", en: "Wallpaper / Wall Covering" },
    one: {
      ja: "柄データ、壁面寸法、ロール梱包、施工側条件を確認する内装壁材。",
      zh: "确认图案文件、墙面尺寸、卷装包装和施工侧条件的墙面内装材料。",
      en: "Wall covering materials checked by artwork, wall size, roll packing, and installation conditions."
    },
    quote: { ja: "案件ごとにお見積り", zh: "按案件报价", en: "Case-by-case quote" },
    specs: {
      ja: ["壁面幅、高さ、枚数を確認", "柄データ、色味、リピートを確認", "防炎仕様が必要な場合は事前確認", "ロール梱包、折れ、汚れ防止を確認"],
      zh: ["确认墙面宽度、高度、数量", "确认图案文件、色味、花距", "需要防炎规格时事前确认", "确认卷装、防折、防污包装"],
      en: ["Wall width, height, and quantity checked", "Pattern data, color, and repeat checked", "Fire-retardant requirements checked in advance", "Roll packing checked to prevent folding and stains"]
    }
  },
  {
    file: "wpc-decking-details.html",
    key: "wpc",
    image: "media/remote/937250ddfe38.png",
    names: { ja: "人工木デッキ材", zh: "人工木地板材料", en: "WPC Decking Board" },
    one: {
      ja: "長物梱包、搬入、下地条件を確認する人工木デッキ材。",
      zh: "确认长条材料包装、搬入和基层条件的人工木地板材料。",
      en: "WPC decking boards checked by long-material packing, carrying route, and substrate conditions."
    },
    quote: { ja: "案件ごとにお見積り", zh: "按案件报价", en: "Case-by-case quote" },
    plans: {
      ja: [["屋外デッキ材", "145 x 21mm / 150 x 23mm", "CSD-145H21 / CSD-150H23"], ["外壁材・フェンス", "180 x 24mm / 153 x 21mm / 90 x 24mm", "CSD-T180H24 / CSD-90H24"], ["施工アクセサリー", "根太 / クリップ / L型エッジ材", "WPC・アルミ・ステンレス部材"]],
      zh: [["户外地板材料", "145 x 21mm / 150 x 23mm", "CSD-145H21 / CSD-150H23"], ["外墙材 / 围栏", "180 x 24mm / 153 x 21mm / 90 x 24mm", "CSD-T180H24 / CSD-90H24"], ["施工配件", "龙骨 / 卡扣 / L 型收边", "WPC、铝合金、不锈钢部材"]],
      en: [["Outdoor decking", "145 x 21mm / 150 x 23mm", "CSD-145H21 / CSD-150H23"], ["Cladding / fence", "180 x 24mm / 153 x 21mm / 90 x 24mm", "CSD-T180H24 / CSD-90H24"], ["Installation accessories", "Joist / clips / L-edge trim", "WPC, aluminum, and stainless parts"]]
    },
    materialDetails: {
      ja: [["WPC複合材", "木粉と樹脂の複合材。屋外使用、腐食、虫害、反りを案件ごとに確認。"], ["表面仕上げ", "3D木目、溝加工、色味、滑りにくさを現場用途に合わせて確認。"], ["施工条件", "下地、排水、日射、長物搬入、重量、固定部材を事前確認。"]],
      zh: [["WPC 复合材料", "木粉与树脂复合材料。按案件确认户外使用、腐蚀、虫害、变形风险。"], ["表面处理", "确认 3D 木纹、沟槽、防滑、色味与使用场景是否匹配。"], ["施工条件", "事前确认基层、排水、日晒、长条搬入、重量和固定部材。"]],
      en: [["WPC composite", "Wood-plastic composite checked for outdoor use, corrosion, insects, and warping risk."], ["Surface finish", "3D wood grain, groove pattern, slip resistance, and color are checked by use case."], ["Site conditions", "Substrate, drainage, sunlight, long-material carrying route, weight, and fixing parts are checked first."]]
    },
    specs: {
      ja: ["面積、長さ、数量、色を確認", "根太、下地、固定部材の条件を確認", "屋外使用、排水、日射条件を確認", "長物梱包、重量、搬入経路を個別確認"],
      zh: ["确认面积、长度、数量、颜色", "确认龙骨、基层、固定部材条件", "确认户外使用、排水、日晒条件", "长条包装、重量、搬入路线单独确认"],
      en: ["Area, length, quantity, and color checked", "Joist, substrate, and fixing parts confirmed", "Outdoor use, drainage, and sunlight conditions checked", "Long-material packing, weight, and carrying route checked separately"]
    }
  }
];

const recordChannels = [
  {
    id: "advertising",
    title: { ja: "広告材料制作工場", zh: "广告材料制作工厂", en: "Advertising Material Production Factory" }
  },
  {
    id: "curtain",
    title: { ja: "カーテン加工工場", zh: "窗帘加工制作工厂", en: "Curtain Production Factory" }
  },
  {
    id: "wpc",
    title: { ja: "人工木デッキ材工場", zh: "塑木板材料工厂", en: "WPC Decking Material Factory" }
  }
];

const lang = {
  ja: {
    dir: "",
    html: "ja",
    label: "日本語",
    logo: "京建サプライ",
    title: "京建サプライ | 中国工場 × 日本現場 × 工務店のサプライチェーンパートナー",
    desc: "中国工場と日本現場をつなぐ、工務店・内装会社・設計会社のための材料調達、包装、物流、現場確認のサプライチェーンパートナー。",
    nav: ["供給実景", "現場記録", "製品と見積", "工務店連携", "会社情報"],
    heroTitle: "二十年、サプライチェーンだけを積み上げてきました。",
    route: ["中国工場", "↓", "日本現場", "↓", "長期連携"],
    heroBody: "京建は中国側の製作、包装、国際物流、日本到着後の現場確認を支えます。工務店・内装会社は現場施工、取付費用、顧客対応を自社の領域として守れます。",
    primary: "供給実景を見る",
    secondary: "製品と見積を見る",
    line: "LINEで相談",
    quoteLine: "見積相談",
    factoryTitle: "中国工場・供給実景",
    factoryLead: "工場、材料、包装、倉庫、出荷、積み込み、物流前の状態を写真で残します。京建が売るのは最低価格ではなく、安定して作り、梱包し、日本の現場に届く確実性です。",
    siteTitle: "日本現場記録",
    siteLead: "材料到着、寸法確認、取付前確認、引き渡し状態を残します。施工実績ではなく、材料が日本の現場へ届いた事実の記録です。",
    productsTitle: "製品と見積",
    productsLead: "価格はサイズ、数量、仕様、配送先で変動します。図面、写真、寸法をLINEで送ってください。",
    partnerTitle: "工務店連携",
    partnerLead: "京建は施工顧客を取りません。材料調達、包装、輸送、到着確認を支え、現場施工・見積・顧客維持は工務店様側の仕事です。",
    contactTitle: "LINEで写真と寸法を送る",
    contactLead: "製品名、現場写真、寸法、数量、納品先を送ってください。仕様確認後に概算見積をご案内します。",
    noRecords: "写真 / 動画を追加予定",
    detail: "詳しく見る",
    allRecords: "すべての記録を見る",
    recordsPage: "供給実景・現場記録",
    supply: "供給体制",
    notes: "注意事項"
  },
  zh: {
    dir: "zh",
    html: "zh-Hans",
    label: "中文",
    logo: "京建供应链",
    title: "京建供应链 | 中国工厂 × 日本现场 × 工务店供应链合作伙伴",
    desc: "京建供应链连接中国工厂和日本现场，为工务店、内装公司、设计公司提供材料采购、包装、物流、现场确认支持。",
    nav: ["供应链实景", "现场记录", "产品与报价", "工务店合作", "公司信息"],
    heroTitle: "二十年，只做好供应链这一件事。",
    route: ["中国工厂", "↓", "日本现场", "↓", "长期合作"],
    heroBody: "京建负责中国侧生产、包装、运输、日本到场确认。工务店负责现场施工、安装报价、终端客户维护。我们把材料从中国工厂稳定交付到日本现场。",
    primary: "查看供应链实景",
    secondary: "查看产品与报价",
    line: "LINE 咨询",
    quoteLine: "发送照片和尺寸",
    factoryTitle: "中国工厂・供应链实景",
    factoryLead: "展示工厂、材料、包装、仓库、发货、装车、物流前状态。京建卖的不是最低价，而是供应链确定性。",
    siteTitle: "日本现场记录",
    siteLead: "展示材料到场、尺寸确认、安装前确认、交付状态。这里不是施工案例，而是材料真正落到日本现场的记录。",
    productsTitle: "产品与报价",
    productsLead: "产品与报价放在供应链记录后面。价格按尺寸、数量、规格、配送地址变化，规格确认后给出概算。",
    partnerTitle: "工务店合作",
    partnerLead: "京建不是来抢施工客户。京建是工务店、内装会社、设计公司、店铺公司的供应链伙伴。",
    contactTitle: "通过 LINE 发送照片和尺寸",
    contactLead: "发送产品名、照片、尺寸、数量、配送地址。规格确认后给出概算报价。",
    noRecords: "照片 / 视频待补充",
    detail: "查看详情",
    allRecords: "查看全部记录",
    recordsPage: "供应链实景与现场记录",
    supply: "供应链说明",
    notes: "注意事项"
  },
  en: {
    dir: "en",
    html: "en",
    label: "English",
    logo: "Kyoken Supply",
    title: "Kyoken Supply | China Factory × Japan Site × Contractor Supply Chain Partner",
    desc: "Kyoken Supply connects Chinese factories with Japanese job sites for contractors, interior companies, and design offices through sourcing, packing, logistics, and site confirmation.",
    nav: ["Supply Records", "Site Records", "Products & Quotes", "Partners", "Company"],
    heroTitle: "Twenty years, focused on supply chain certainty.",
    route: ["China Factory", "↓", "Japan Site", "↓", "Long-term Partnership"],
    heroBody: "Kyoken supports production coordination, packaging, international logistics, and arrival confirmation in Japan. Contractors keep control of installation, pricing, and end-customer relationships.",
    primary: "View supply records",
    secondary: "View products & quotes",
    line: "Consult on LINE",
    quoteLine: "Send photos and sizes",
    factoryTitle: "China Factory & Supply Records",
    factoryLead: "Factory, materials, packing, warehouse, shipment, loading, and pre-logistics conditions. Kyoken is not selling the lowest price; we are reducing supply-chain uncertainty.",
    siteTitle: "Japan Site Records",
    siteLead: "Material arrival, dimension checks, pre-installation confirmation, and handover status. These are not construction case studies; they are records of materials landing at Japanese sites.",
    productsTitle: "Products & Quotes",
    productsLead: "Products come after the supply records. Pricing changes by size, quantity, specification, and delivery address.",
    partnerTitle: "Contractor Partnership",
    partnerLead: "Kyoken does not take construction clients. We are a supply-chain partner for contractors, interior companies, designers, and shop companies.",
    contactTitle: "Send photos and sizes on LINE",
    contactLead: "Send product name, photos, dimensions, quantity, and delivery area. A rough quote is provided after specification review.",
    noRecords: "Photos / videos to be added",
    detail: "View details",
    allRecords: "View all records",
    recordsPage: "Supply and Site Records",
    supply: "Supply Chain Notes",
    notes: "Notes"
  }
};

function readJson(relativePath) {
  const target = path.join(root, relativePath);
  if (!fs.existsSync(target)) throw new Error(`${relativePath} is required.`);
  return JSON.parse(fs.readFileSync(target, "utf8"));
}

function write(relativePath, content) {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function prefix(code) {
  return code === "ja" ? "" : "../";
}

function pagePath(code, file) {
  return code === "ja" ? file : `${lang[code].dir}/${file}`;
}

function href(code, file) {
  return code === "ja" ? file : file;
}

function switcher(code, file = "index.html") {
  const jp = file === "index.html" ? "../index.html" : `../${file}`;
  const en = code === "ja" ? `en/${file}` : code === "zh" ? `../en/${file}` : file;
  const zh = code === "ja" ? `zh/${file}` : code === "en" ? `../zh/${file}` : file;
  if (code === "ja") return `<span>JP</span><a href="${en}">EN</a><a href="${zh}">中文</a>`;
  if (code === "en") return `<a href="${jp}">JP</a><span>EN</span><a href="${zh}">中文</a>`;
  return `<a href="${jp}">JP</a><a href="${en}">EN</a><span>中文</span>`;
}

function mediaSrc(code, value) {
  if (/^(https?:)?\/\//u.test(value)) return value;
  return `${prefix(code)}${String(value).replace(/^\/+/u, "")}`;
}

function isVideo(value) {
  return /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/iu.test(value || "");
}

function recordTitle(record, code) {
  if (record.i18n?.[code]?.title) return record.i18n[code].title;
  if (code === "zh" && record.title) return record.title;
  return record.module === "site" ? lang[code].siteTitle : lang[code].factoryTitle;
}

function recordSummary(record, code) {
  if (record.i18n?.[code]?.summary) return record.i18n[code].summary;
  return code === "zh" ? (record.summary || "") : "";
}

function ui(code, key) {
  const labels = {
    ja: {
      heroKicker: "中国工場 × 日本現場",
      factoryKicker: "工場 / 梱包 / 出荷",
      siteKicker: "日本現場",
      productsKicker: "製品 / 見積",
      partnerKicker: "工務店連携",
      recordsKicker: "記録",
      materialKicker: "資材供給",
      quoteKicker: "見積",
      supplyKicker: "サプライチェーン",
      kyokenRole: "京建サプライ",
      contractorRole: "工務店・施工会社",
      kyokenRoleText: "工場確認 / 材料調達 / 包装確認 / 国際物流 / 日本到着確認 / 供給記録",
      contractorRoleText: "現場採寸 / 顧客対応 / 取付施工 / 施工見積 / 顧客関係の維持",
      process: [
        ["工場", "材料と生産可否を確認。"],
        ["包装", "箱、角保護、ラベル、パレット、ロール梱包を確認。"],
        ["物流", "国際輸送と日本側配送条件を確認。"],
        ["現場", "到着、寸法、破損確認、引き渡しを記録。"]
      ],
      company: "会社情報"
    },
    zh: {
      heroKicker: "中国工厂 × 日本现场",
      factoryKicker: "工厂 / 包装 / 发货",
      siteKicker: "日本现场",
      productsKicker: "产品 / 报价",
      partnerKicker: "工务店合作",
      recordsKicker: "记录",
      materialKicker: "材料供应",
      quoteKicker: "报价",
      supplyKicker: "供应链",
      kyokenRole: "京建供应链",
      contractorRole: "工务店 / 施工方",
      kyokenRoleText: "工厂对接 / 材料采购 / 包装确认 / 国际物流 / 日本到场确认 / 供应链记录",
      contractorRoleText: "现场测量 / 客户沟通 / 安装施工 / 施工报价 / 终端客户维护",
      process: [
        ["工厂", "确认材料和生产可行性。"],
        ["包装", "确认纸箱、护角、标签、托盘或卷装。"],
        ["物流", "确认国际运输和日本侧配送条件。"],
        ["现场", "记录到场、尺寸、破损检查和交付。"]
      ],
      company: "公司信息"
    },
    en: {
      heroKicker: "China Factory × Japan Site",
      factoryKicker: "Factory / Packing / Shipment",
      siteKicker: "Japan Site",
      productsKicker: "Products / Quotes",
      partnerKicker: "Partnership",
      recordsKicker: "Records",
      materialKicker: "Material Supply",
      quoteKicker: "Quote",
      supplyKicker: "Supply Chain",
      kyokenRole: "Kyoken Supply",
      contractorRole: "Contractor",
      kyokenRoleText: "Factory coordination / sourcing / packing / international logistics / arrival confirmation / supply records",
      contractorRoleText: "Site measurement / customer communication / installation / construction quote / end-customer relationship",
      process: [
        ["Factory", "Material and production feasibility confirmation."],
        ["Packing", "Carton, edge protection, labels, pallet or roll packing."],
        ["Logistics", "International route and Japan-side delivery conditions."],
        ["Site", "Arrival, dimensions, damage check, and handover."]
      ],
      company: "Company"
    }
  };
  return labels[code][key];
}

function mediaGrid(record, code, compact = false) {
  const media = Array.isArray(record.media) ? record.media.filter(Boolean) : [];
  if (!media.length) {
    return `<div class="record-placeholder"><span>${lang[code].noRecords}</span></div>`;
  }
  const selected = compact ? media.slice(0, 6) : media;
  return `<div class="record-media-grid">${selected.map((item) => {
    const src = mediaSrc(code, item);
    if (isVideo(item)) return `<video controls playsinline preload="metadata" src="${src}"></video>`;
    return `<img src="${src}" alt="${escapeHtml(recordTitle(record, code))}" loading="lazy">`;
  }).join("")}</div>`;
}

function recordCard(record, code, compact = true) {
  return `<article class="record-card">
    <div class="record-card-head">
      <span>${record.module === "site" ? lang[code].siteTitle : lang[code].factoryTitle}</span>
      <strong>${escapeHtml(recordTitle(record, code))}</strong>
    </div>
    ${mediaGrid(record, code, compact)}
    ${recordSummary(record, code) ? `<p>${escapeHtml(recordSummary(record, code))}</p>` : ""}
  </article>`;
}

function recordSection(code, module, limit = 4) {
  const list = records.filter((record) => record.module === module).slice(0, limit);
  if (!list.length) return `<div class="record-card empty">${mediaGrid({ media: [] }, code)}</div>`;
  return list.map((record) => recordCard(record, code, true)).join("");
}

function factoryChannelSections(code, compact = true) {
  return recordChannels.map((channel) => {
    const list = records
      .filter((record) => record.module === "factory")
      .filter((record) => (record.channel || inferChannel(record)) === channel.id);
    const body = list.length
      ? list.map((record) => recordCard(record, code, compact)).join("")
      : `<div class="record-card empty">${mediaGrid({ media: [] }, code)}</div>`;
    return `<section class="channel-section">
      <h3>${channel.title[code]}</h3>
      <div class="record-grid${compact ? "" : " wide"}">${body}</div>
    </section>`;
  }).join("");
}

function inferChannel(record) {
  const value = `${record.channel || ""} ${record.id || ""} ${record.title || ""}`.toLowerCase();
  if (value.includes("wpc") || value.includes("塑木") || value.includes("人工木")) return "wpc";
  if (value.includes("curtain") || value.includes("窗帘") || value.includes("カーテン")) return "curtain";
  return "advertising";
}

function productCards(code) {
  return products.map((product) => `<article class="product-card">
    <img src="${prefix(code)}${product.image}" alt="${escapeHtml(product.names[code])}" loading="lazy">
    <div>
      <h3>${product.names[code]}</h3>
      <strong>${product.quote[code]}</strong>
      <p>${product.one[code]}</p>
      <div class="inline-actions">
        <a href="${href(code, product.file)}">${lang[code].detail}</a>
      </div>
    </div>
  </article>`).join("");
}

function shell(code, title, description, file, body) {
  const c = lang[code];
  const p = prefix(code);
  return `<!doctype html>
<html lang="${c.html}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${code === "en" ? "China factory, Japan site, supply chain, contractors, interior companies, material sourcing, Tokyo delivery, construction materials" : code === "zh" ? "中国工厂,日本现场,供应链,工务店,内装会社,材料采购,东京交付,建材供应" : "中国工場,日本現場,サプライチェーン,工務店,内装会社,材料調達,東京交付,建材供給"}">
  <link rel="icon" type="image/png" href="${p}media/remote/6e64da3a8e48.png">
  <link rel="stylesheet" href="${p}styles.css?v=20260706-rebuild">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${file === "index.html" ? "index.html" : "index.html"}">${c.logo}</a>
    <nav>
      <a href="index.html#factory">${c.nav[0]}</a>
      <a href="index.html#site">${c.nav[1]}</a>
      <a href="index.html#products">${c.nav[2]}</a>
      <a href="contractor-partnership.html">${c.nav[3]}</a>
    </nav>
    <div class="language">${switcher(code, file)}</div>
  </header>
  ${body}
  <a class="sticky-line" href="${lineUrl}">${c.line}</a>
</body>
</html>
`;
}

function home(code) {
  const c = lang[code];
  const heroRecord = records.find((record) => record.media?.length) || null;
  const heroMedia = heroRecord ? mediaGrid({ ...heroRecord, media: heroRecord.media.slice(0, 1) }, code, true) : `<div class="record-placeholder"><span>${c.noRecords}</span></div>`;
  return shell(code, c.title, c.desc, "index.html", `<main>
    <section class="hero">
      <div class="hero-media">${heroMedia}</div>
      <div class="hero-copy">
        <p class="kicker">${ui(code, "heroKicker")}</p>
        <h1>${c.heroTitle}</h1>
        <div class="route">${c.route.map((item) => `<span>${item}</span>`).join("")}</div>
        <p>${c.heroBody}</p>
        <div class="actions">
          <a href="#factory">${c.primary}</a>
          <a href="#products">${c.secondary}</a>
          <a href="${lineUrl}">${c.line}</a>
        </div>
      </div>
    </section>

    <section id="factory" class="section">
      <div class="section-head">
        <p class="kicker">${ui(code, "factoryKicker")}</p>
        <h2>${c.factoryTitle}</h2>
        <p>${c.factoryLead}</p>
      </div>
      <div class="channel-stack">${factoryChannelSections(code, true)}</div>
      <a class="section-link" href="supply-chain-records.html">${c.allRecords}</a>
    </section>

    <section id="site" class="section muted">
      <div class="section-head">
        <p class="kicker">${ui(code, "siteKicker")}</p>
        <h2>${c.siteTitle}</h2>
        <p>${c.siteLead}</p>
      </div>
      <div class="record-grid">${recordSection(code, "site", 3)}</div>
    </section>

    <section id="products" class="section">
      <div class="section-head">
        <p class="kicker">${ui(code, "productsKicker")}</p>
        <h2>${c.productsTitle}</h2>
        <p>${c.productsLead}</p>
      </div>
      <div class="product-grid">${productCards(code)}</div>
    </section>

    <section class="section partner">
      <div>
        <p class="kicker">${ui(code, "partnerKicker")}</p>
        <h2>${c.partnerTitle}</h2>
        <p>${c.partnerLead}</p>
      </div>
      <div class="role-grid">
        <div><strong>${ui(code, "kyokenRole")}</strong><span>${ui(code, "kyokenRoleText")}</span></div>
        <div><strong>${ui(code, "contractorRole")}</strong><span>${ui(code, "contractorRoleText")}</span></div>
      </div>
    </section>

    ${companySection(code)}
    ${contactSection(code)}
  </main>`);
}

function recordsPage(code) {
  const c = lang[code];
  return shell(code, `${c.recordsPage} | ${c.logo}`, c.desc, "supply-chain-records.html", `<main>
    <section class="page-hero">
      <p class="kicker">${ui(code, "recordsKicker")}</p>
      <h1>${c.recordsPage}</h1>
      <p>${c.factoryLead}</p>
    </section>
    <section class="section">
      <h2>${c.factoryTitle}</h2>
      <div class="channel-stack">${factoryChannelSections(code, false)}</div>
    </section>
    <section class="section muted">
      <h2>${c.siteTitle}</h2>
      <div class="record-grid wide">${records.filter((record) => record.module === "site").map((record) => recordCard(record, code, false)).join("") || recordSection(code, "site")}</div>
    </section>
    ${contactSection(code)}
  </main>`);
}

function planGrid(code, product) {
  const plans = product.plans?.[code] || [];
  if (!plans.length) return "";
  return `<div class="plan-grid">${plans.map((plan, index) => `<div>
    <span>0${index + 1}</span>
    <strong>${plan[0]}</strong>
    <p>${plan[1]}</p>
    <em>${plan[2]}</em>
  </div>`).join("")}</div>`;
}

function priceTable(code, product) {
  const table = product.priceTable?.[code];
  if (!table) return "";
  return `<div class="price-table-wrap">
    <h3>${table.title}</h3>
    <div class="price-table-scroll">
      <table class="price-table">
        <thead><tr>${table.head.map((item) => `<th>${item}</th>`).join("")}</tr></thead>
        <tbody>${table.rows.map((row) => `<tr>${row.map((item, index) => index === 0 ? `<th>${item}</th>` : `<td>${item}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>
    <p>${table.note}</p>
  </div>`;
}

function materialDetails(code, product) {
  const details = product.materialDetails?.[code] || [];
  if (!details.length) return "";
  return `<section class="section compact">
    <div class="section-head">
      <p class="kicker">${code === "ja" ? "仕様説明" : code === "zh" ? "材料说明" : "Material Notes"}</p>
      <h2>${code === "ja" ? "材料と確認ポイント" : code === "zh" ? "材料和确认重点" : "Material and Checkpoints"}</h2>
    </div>
    <div class="detail-grid">${details.map((item) => `<div><strong>${item[0]}</strong><p>${item[1]}</p></div>`).join("")}</div>
  </section>`;
}

function requestSection(code) {
  const copy = {
    ja: {
      title: "図面・写真・寸法を送る",
      lead: "現時点ではサイト内アップロードや決済フォームは作らず、LINEで資料を受け取ってから仕様確認します。",
      items: ["製品名", "設計図または現場写真", "幅・高さ・数量", "納品先エリア", "希望納期"],
      button: "LINEで資料を送る"
    },
    zh: {
      title: "发送设计图、照片和尺寸",
      lead: "现在先不做复杂上传和支付系统。先用 LINE 收设计图、现场照片、尺寸和数量，确认后再给报价或付款链接。",
      items: ["产品名", "设计图或现场照片", "宽度、高度、数量", "配送区域", "希望交期"],
      button: "用 LINE 发送资料"
    },
    en: {
      title: "Send drawings, photos, and sizes",
      lead: "For now, we keep this lightweight: send documents on LINE, then receive a specification check and quote or payment link.",
      items: ["Product name", "Drawing or site photos", "Width, height, quantity", "Delivery area", "Preferred timing"],
      button: "Send details on LINE"
    }
  }[code];
  return `<section class="section request-section">
    <div>
      <p class="kicker">${code === "ja" ? "資料受付" : code === "zh" ? "需求资料" : "Request Details"}</p>
      <h2>${copy.title}</h2>
      <p>${copy.lead}</p>
    </div>
    <div>
      <ul>${copy.items.map((item) => `<li>${item}</li>`).join("")}</ul>
      <a href="${lineUrl}">${copy.button}</a>
    </div>
  </section>`;
}

function productPage(code, product) {
  const c = lang[code];
  const title = `${product.names[code]} | ${c.logo}`;
  const related = records.filter((record) => record.module === "factory").slice(0, 2);
  return shell(code, title, product.one[code], product.file, `<main>
    <section class="product-hero">
      <div>
        <p class="kicker">${ui(code, "materialKicker")}</p>
        <h1>${product.names[code]}</h1>
        <p>${product.one[code]}</p>
        <div class="actions"><a href="${lineUrl}">${c.quoteLine}</a><a href="index.html#products">${c.productsTitle}</a></div>
      </div>
      <img src="${prefix(code)}${product.image}" alt="${escapeHtml(product.names[code])}">
    </section>
    <section class="section compact">
      <div class="section-head">
        <p class="kicker">${ui(code, "quoteKicker")}</p>
        <h2>${product.quote[code]}</h2>
        <p>${c.productsLead}</p>
      </div>
      ${planGrid(code, product)}
      ${priceTable(code, product)}
      <div class="spec-grid">${product.specs[code].map((item) => `<div>${item}</div>`).join("")}</div>
    </section>
    ${materialDetails(code, product)}
    <section class="section muted">
      <div class="section-head">
        <p class="kicker">${ui(code, "supplyKicker")}</p>
        <h2>${c.supply}</h2>
        <p>${c.partnerLead}</p>
      </div>
      <div class="process-grid">
        ${ui(code, "process").map((item, index) => `<div><span>0${index + 1}</span><strong>${item[0]}</strong><p>${item[1]}</p></div>`).join("")}
      </div>
    </section>
    <section class="section">
      <h2>${c.recordsPage}</h2>
      <div class="record-grid">${related.map((record) => recordCard(record, code, true)).join("") || recordSection(code, "factory", 2)}</div>
    </section>
    <section class="section compact">
      <h2>${c.notes}</h2>
      <p class="notice">${code === "ja" ? "価格はサイズ・数量・配送先により変動します。施工、現場責任、取付費用、エンドユーザー対応は施工会社様側でご確認ください。" : code === "zh" ? "价格会因尺寸、数量、配送地址变化。施工、现场责任、安装费用、终端客户沟通由施工方确认。" : "Pricing varies by dimensions, quantity, and delivery address. Installation, site responsibility, installation pricing, and end-customer communication remain with the contractor."}</p>
    </section>
    ${requestSection(code)}
    ${contactSection(code)}
  </main>`);
}

function contractorPage(code) {
  const c = lang[code];
  return shell(code, `${c.partnerTitle} | ${c.logo}`, c.partnerLead, "contractor-partnership.html", `<main>
    <section class="page-hero">
      <p class="kicker">${ui(code, "partnerKicker")}</p>
      <h1>${c.partnerTitle}</h1>
      <p>${c.partnerLead}</p>
    </section>
    <section class="section">
      <div class="role-grid large">
        <div><strong>${ui(code, "kyokenRole")}</strong><span>${ui(code, "kyokenRoleText")}</span></div>
        <div><strong>${ui(code, "contractorRole")}</strong><span>${ui(code, "contractorRoleText")}</span></div>
      </div>
    </section>
    ${contactSection(code)}
  </main>`);
}

function legalPage(code) {
  const c = lang[code];
  return shell(code, `${c.nav[4]} | ${c.logo}`, c.desc, "legal.html", `<main>
    <section class="page-hero">
      <p class="kicker">${ui(code, "company")}</p>
      <h1>${c.nav[4]}</h1>
      ${companyInfo(code)}
    </section>
  </main>`);
}

function companySection(code) {
  return `<section id="company" class="section company"><h2>${lang[code].nav[4]}</h2>${companyInfo(code)}</section>`;
}

function companyInfo(code) {
  if (code === "en") {
    return `<div class="company-list">
      <p><strong>Kyoken Real Estate Development Co., Ltd.</strong></p>
      <p>Representative Director: Tong Ye</p>
      <p>Mob: 080 2465 5181 / Tel: 03 6555 1306</p>
      <p>Addr: 3-7-7-4F, Nihonbashi, Chuo-ku, Tokyo 103-0027</p>
      <p>Email: kyoken0702@gmail.com / Website: ${siteUrl}</p>
    </div>`;
  }
  if (code === "zh") {
    return `<div class="company-list">
      <p><strong>京建不動産開発株式会社</strong></p>
      <p>代表取締役：葉 彤</p>
      <p>Mob：080 2465 5181 / Tel：03 6555 1306</p>
      <p>Addr：〒103-0027 東京都中央区日本橋3丁目7-7-4F</p>
      <p>Email：kyoken0702@gmail.com / Website：${siteUrl}</p>
    </div>`;
  }
  return `<div class="company-list">
    <p><strong>京建不動産開発株式会社</strong></p>
    <p>代表取締役：葉 彤</p>
    <p>Mob：080 2465 5181 / Tel：03 6555 1306</p>
    <p>Addr：〒103-0027 東京都中央区日本橋3丁目7-7-4F</p>
    <p>Email：kyoken0702@gmail.com / Website：${siteUrl}</p>
  </div>`;
}

function contactSection(code) {
  const c = lang[code];
  return `<section id="contact" class="section contact">
    <h2>${c.contactTitle}</h2>
    <p>${c.contactLead}</p>
    <div class="actions"><a href="${lineUrl}">${c.line}</a><a href="${lineUrl}">${c.quoteLine}</a></div>
  </section>`;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[ch]);
}

for (const code of Object.keys(lang)) {
  write(pagePath(code, "index.html"), home(code));
  write(pagePath(code, "supply-chain-records.html"), recordsPage(code));
  write(pagePath(code, "contractor-partnership.html"), contractorPage(code));
  write(pagePath(code, "legal.html"), legalPage(code));
  for (const product of products) {
    write(pagePath(code, product.file), productPage(code, product));
  }
}

write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${["", "en/", "zh/"].flatMap((dir) => ["index.html", "supply-chain-records.html", "contractor-partnership.html", "legal.html", ...products.map((product) => product.file)].map((file) => `  <url><loc>${siteUrl}/${dir}${file}</loc></url>`)).join("\n")}
</urlset>
`);

console.log(`Rebuilt Kyoken Supply static site from data/records.json (${records.length} records).`);
