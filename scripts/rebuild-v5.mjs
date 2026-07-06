import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const lineUrl = "https://line.me/R/ti/p/@566wlcvz";

function normalizeMedia(record) {
  const media = [];
  const seen = new Set();
  const addMedia = (value) => {
    if (typeof value !== "string") return;
    const trimmed = value.trim();
    if (!trimmed) return;
    const key = /^(https?:)?\/\//u.test(trimmed) || trimmed.startsWith("data:")
      ? trimmed
      : trimmed.replace(/^\/+/u, "");
    if (seen.has(key)) return;
    seen.add(key);
    media.push(trimmed);
  };

  if (typeof record.media === "string") {
    addMedia(record.media);
  }
  if (Array.isArray(record.media)) {
    record.media.forEach((item) => {
      if (Array.isArray(item)) item.forEach(addMedia);
      if (typeof item === "string") addMedia(item);
      else if (item && typeof item === "object") addMedia(item.file || item.image || item.video);
    });
  }

  return media;
}

function isVideoMedia(value) {
  return /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/iu.test(value || "");
}

function normalizeRecord(record, sourceSlug = "") {
  const zh = record.zh || {};
  const ja = record.ja || {};
  const en = record.en || {};
  const sourceDate = sourceSlug.match(/^\d{4}-\d{2}-\d{2}/u)?.[0] || "";
  const primaryDate = String(record.date || sourceDate || "").replace(/\./g, "-");
  const sortKey = `${primaryDate || "0000-00-00"}-${sourceSlug || record.slug || ""}`;

  return {
    ...record,
    slug: record.slug || sourceSlug || String(record.date || "").replace(/\./g, "-"),
    sortKey,
    media: normalizeMedia(record),
    ja: {
      label: ja.label || "記録準備中",
      title: ja.title || record.title || "サプライチェーン記録準備中",
      summary: ja.summary || "日本語の記録内容を準備中です。",
      details: ja.details || []
    },
    en: {
      label: en.label || "Pending",
      title: en.title || record.title || "Supply-chain record pending",
      summary: en.summary || "English record content is being prepared.",
      details: en.details || []
    },
    zh: {
      label: zh.label || "记录",
      title: zh.title || record.title || "供应链记录",
      summary: zh.summary || "",
      details: zh.details || []
    }
  };
}

function loadSupplyRecords() {
  const folder = path.join(root, "data/supply-chain-records");
  if (fs.existsSync(folder)) {
    const records = fs.readdirSync(folder)
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const recordPath = path.join(folder, file);
        const record = JSON.parse(fs.readFileSync(recordPath, "utf8"));
        return normalizeRecord(record, path.basename(file, ".json"));
      });
    if (records.length) {
      return records.sort((a, b) => String(b.sortKey || b.slug).localeCompare(String(a.sortKey || a.slug)));
    }
  }
  return [];
}

const supplyRecords = loadSupplyRecords();

const recordChannels = [
  {
    id: "advertising",
    category: "factory",
    titles: {
      ja: "広告材料制作工場",
      en: "Advertising Material Production Factory",
      zh: "广告材料制作工厂"
    }
  },
  {
    id: "curtain",
    category: "factory",
    titles: {
      ja: "カーテン加工工場",
      en: "Curtain Production Factory",
      zh: "窗帘加工制作工厂"
    }
  },
  {
    id: "wpc",
    category: "factory",
    titles: {
      ja: "人工木デッキ材工場",
      en: "WPC Decking Material Factory",
      zh: "塑木板材料工厂"
    }
  }
];

const products = [
  ["curtain-details.html", "オーダーカーテン", "Custom Curtains", "定制窗帘", "1.8倍ヒダ、採寸、標準簡易取付まで確認する窓まわり資材。"],
  ["advertising-materials-details.html", "広告材料制作", "Advertising Material Production", "广告材料制作", "切文字、電飾フィルム、塩ビ板サインを図面・寸法・梱包条件ごとにまとめて確認します。"],
  ["enamel-panel.html", "ホーローキッチンパネル", "Enamel Panel", "珐琅磁吸板", "厨房・水回り向けに、板材、梱包、搬入条件を確認するパネル。"],
  ["acoustic-panel-details.html", "フェルト吸音パネル", "Felt Acoustic Panel", "毛毡吸音板", "色、厚み、下地、枚数、現場固定方法を確認する吸音材。"],
  ["wallpaper-details.html", "壁紙・クロス材", "Wallpaper / Wall Covering", "墙纸 / 墙布材料", "柄データ、壁面寸法、ロール梱包、施工側条件を確認する内装壁材。"],
  ["wpc-decking-details.html", "人工木デッキ材", "WPC Decking Board", "人工木地板材料", "屋外搬入、下地、数量、長物梱包を確認するデッキ材。"]
];

const productImages = {
  "curtain-details.html": "media/remote/e2f130af6ea5.png",
  "advertising-materials-details.html": "media/remote/c1f2ceb8eb9d.png",
  "enamel-panel.html": "media/remote/f35f79d49094.png",
  "acoustic-panel-details.html": "media/remote/c3805c6eb4b0.png",
  "wallpaper-details.html": "media/remote/668ef6041d0b.jpg",
  "wpc-decking-details.html": "media/remote/937250ddfe38.png"
};

const productQuoteLabels = {
  ja: {
    "curtain-details.html": "仕様確認後に概算見積",
    "advertising-materials-details.html": "案件ごとにお見積り",
    "enamel-panel.html": "案件ごとにお見積り",
    "acoustic-panel-details.html": "案件ごとにお見積り",
    "wallpaper-details.html": "案件ごとにお見積り",
    "wpc-decking-details.html": "案件ごとにお見積り"
  },
  zh: {
    "curtain-details.html": "规格确认后报价",
    "advertising-materials-details.html": "按案件报价",
    "enamel-panel.html": "按案件报价",
    "acoustic-panel-details.html": "按案件报价",
    "wallpaper-details.html": "按案件报价",
    "wpc-decking-details.html": "按案件报价"
  },
  en: {
    "curtain-details.html": "Quote after spec check",
    "advertising-materials-details.html": "Case-by-case quote",
    "enamel-panel.html": "Case-by-case quote",
    "acoustic-panel-details.html": "Case-by-case quote",
    "wallpaper-details.html": "Case-by-case quote",
    "wpc-decking-details.html": "Case-by-case quote"
  }
};

const zhProductNotes = {
  "curtain-details.html": "确认 1.8 倍褶皱、上门测量、标准简易安装及窗边条件的窗帘材料。",
  "advertising-materials-details.html": "统一确认标志文件、灯箱画面、PVC板标牌的尺寸、材料、加工、包装和交付条件。",
  "enamel-panel.html": "面向厨房和水回等空间，确认板材、包装和搬入条件的磁吸板材。",
  "acoustic-panel-details.html": "确认颜色、厚度、基层、数量和现场固定方式的毛毡吸音板。",
  "wallpaper-details.html": "确认图案文件、墙面尺寸、卷装包装和施工侧条件的墙面内装材料。",
  "wpc-decking-details.html": "确认户外搬入、基层、数量和长条材料包装条件的人工木地板材料。"
};

const enProductNotes = {
  "curtain-details.html": "Curtain materials checked by pleat ratio, measurement, simple installation, and window conditions.",
  "advertising-materials-details.html": "Signage files, lightbox film, and PVC plates checked together by size, material, processing, packing, and delivery conditions.",
  "enamel-panel.html": "Magnetic enamel panels checked by board specification, packing method, and carrying route.",
  "acoustic-panel-details.html": "Felt acoustic panels checked by color, thickness, substrate, quantity, and fixing method.",
  "wallpaper-details.html": "Wallpaper and wall covering materials checked by pattern data, wall size, roll packing, and installation conditions.",
  "wpc-decking-details.html": "WPC decking boards checked by carrying route, substrate, quantity, and long-material packaging."
};

const productDetails = {
  "curtain-details.html": {
    ja: {
      name: "オーダーカーテン",
      lead: "1.8倍ヒダを基本に、採寸、標準簡易取付、窓まわり条件を確認して手配するカーテン資材です。",
      plans: ["腰窓セット", "ワイド窓セット", "掃き出し窓セット"],
      specs: ["1.8倍ヒダを基本仕様として確認", "生地、遮光、レース有無を案件ごとに確認", "窓数、幅、高さ、取付方法を確認", "採寸・標準簡易取付は手配可能。複雑施工、高所作業、特殊固定は別途確認"],
      quote: "価格は窓数、サイズ、生地、取付条件、配送先により変動します。仕様確認後に概算見積をご案内します。"
    },
    zh: {
      name: "定制窗帘",
      lead: "以 1.8 倍褶皱为基本规格，确认测量、标准简易安装和窗边条件后安排的窗帘材料。",
      plans: ["腰窗套餐", "宽窗套餐", "落地窗套餐"],
      specs: ["目前以 1.8 倍褶皱为基本规格", "面料、遮光、纱帘需求按案件确认", "确认窗数、宽高、安装方式", "窗帘套餐可安排上门测量和标准简易安装；复杂施工、高空作业、特殊固定方式按现场另行确认"],
      quote: "价格会随窗数、尺寸、面料、安装条件和配送地址变化。规格确认后提供概算报价。"
    },
    en: {
      name: "Custom Curtains",
      lead: "Curtain materials arranged around 1.8x fullness, measurement, standard simple installation, and window conditions.",
      plans: ["Standard window set", "Wide window set", "Full-height window set"],
      specs: ["1.8x fullness as the current base specification", "Fabric, blackout level, and lace curtain needs checked case by case", "Window count, width, height, and fixing method confirmed before quote", "Measurement and standard simple installation can be arranged; complex work, high-place work, and special fixing are checked separately"],
      quote: "Pricing depends on window count, dimensions, fabric, installation conditions, and delivery address. A rough quote is provided after specification review."
    }
  },
  "advertising-materials-details.html": {
    ja: {
      name: "広告材料制作",
      lead: "アクリル切文字、電飾看板用フィルム、塩ビプレートサインなど、店舗・施設向け広告材料を図面、寸法、設置条件ごとに確認して手配します。",
      plans: ["アクリル切文字", "電飾看板用フィルム", "塩ビプレートサイン"],
      specs: ["AI、PDF、画像などのデザインデータを確認", "サイズ、厚み、素材、色、数量を確認", "既存看板や設置場所の写真、下地、固定方法を確認", "傷、折れ、割れを避ける梱包方法を案件ごとに確認"],
      quote: "材料種類、サイズ、加工方法、数量、梱包条件、配送先により案件ごとにお見積りします。電気部材や屋外条件が関係する場合は個別確認となります。"
    },
    zh: {
      name: "广告材料制作",
      lead: "把亚克力切文字、灯箱电饰膜、PVC板标牌等店铺和设施广告材料统一按图纸、尺寸和现场条件确认后安排制作。",
      plans: ["亚克力切文字", "灯箱电饰膜", "PVC板标牌"],
      specs: ["确认 AI、PDF、图片等设计文件", "确认尺寸、厚度、材料、颜色和数量", "确认既有招牌、安装位置照片、基层和固定方式", "按案件确认防刮、防折、防裂包装方式"],
      quote: "根据材料种类、尺寸、加工方式、数量、包装条件和配送地址逐案报价。涉及电气部材或户外条件时单独确认。"
    },
    en: {
      name: "Advertising Material Production",
      lead: "Acrylic letters, backlit sign film, and PVC plate signage are arranged after checking drawings, dimensions, and site conditions for shops and facilities.",
      plans: ["Acrylic letters", "Backlit sign film", "PVC plate signs"],
      specs: ["Design data such as AI, PDF, or image files checked", "Size, thickness, material, color, and quantity confirmed", "Existing signage, site photos, substrate, and fixing method checked", "Packing checked case by case to prevent scratches, folding, and breakage"],
      quote: "Quoted case by case according to material type, size, processing method, quantity, packing conditions, and delivery address. Electrical parts or outdoor conditions are checked separately when involved."
    }
  },
  "enamel-panel.html": {
    ja: {
      name: "ホーローキッチンパネル",
      lead: "厨房、水回り、店舗壁面向けに、板材仕様、搬入条件、梱包を確認して手配するパネル資材です。",
      plans: ["標準キッチンセット", "L型カウンターセット", "店舗大面積セット"],
      specs: ["サイズ、厚み、枚数を確認", "カット、穴あけ、端部処理の可否を確認", "搬入経路、重量、割れ防止梱包を確認", "磁石使用や水回り条件は案件ごとに確認"],
      quote: "板材仕様、加工、数量、搬入条件、配送先により案件ごとにお見積りします。"
    },
    zh: {
      name: "珐琅磁吸板",
      lead: "面向厨房、水回、店铺墙面，确认板材规格、搬入条件和包装后安排的板材。",
      plans: ["标准厨房套餐", "L 型台面套餐", "店铺大面积墙面套餐"],
      specs: ["确认尺寸、厚度、数量", "确认切割、开孔、边部处理可否", "确认搬入路线、重量、防破损包装", "磁吸使用和水回条件逐案确认"],
      quote: "根据板材规格、加工、数量、搬入条件和配送地址逐案报价。"
    },
    en: {
      name: "Enamel Panel",
      lead: "Panel materials for kitchens, wet areas, and shop walls arranged after checking board specifications, carrying route, and packing.",
      plans: ["Standard kitchen set", "L-shaped counter set", "Large shop wall set"],
      specs: ["Size, thickness, and quantity checked", "Cutting, drilling, and edge processing feasibility confirmed", "Carrying route, weight, and anti-breakage packing checked", "Magnet use and wet-area conditions checked case by case"],
      quote: "Quoted case by case according to board specification, processing, quantity, carrying conditions, and delivery address."
    }
  },
  "acoustic-panel-details.html": {
    ja: {
      name: "フェルト吸音パネル",
      lead: "オフィス、会議室、スタジオ向けに、色、厚み、下地、固定方法を確認する吸音材です。",
      plans: ["デスク周りセット", "会議室壁面セット", "スタジオ吸音セット"],
      specs: ["色、厚み、密度、枚数を確認", "接着、ピン、ビスなど固定方法を確認", "壁下地、割付、カット条件を確認", "大型枚数の場合は梱包と搬入を個別確認"],
      quote: "色、厚み、枚数、加工、固定方法、配送先により案件ごとにお見積りします。"
    },
    zh: {
      name: "毛毡吸音板",
      lead: "面向办公室、会议室、录音空间，确认颜色、厚度、基层和固定方式的吸音材料。",
      plans: ["桌面周边套餐", "会议室墙面套餐", "录音空间吸音套餐"],
      specs: ["确认颜色、厚度、密度、数量", "确认胶粘、针固定、螺丝固定等方式", "确认墙面基层、排版、切割条件", "大批量时单独确认包装和搬入"],
      quote: "根据颜色、厚度、数量、加工、固定方式和配送地址逐案报价。"
    },
    en: {
      name: "Felt Acoustic Panel",
      lead: "Felt acoustic panels for offices, meeting rooms, and studios checked by color, thickness, substrate, and fixing method.",
      plans: ["Desk area set", "Meeting room wall set", "Studio acoustic set"],
      specs: ["Color, thickness, density, and quantity checked", "Adhesive, pin, screw, or other fixing method confirmed", "Wall substrate, layout, and cutting conditions checked", "Packing and carrying checked separately for large quantities"],
      quote: "Quoted case by case according to color, thickness, quantity, processing, fixing method, and delivery address."
    }
  },
  "wallpaper-details.html": {
    ja: {
      name: "壁紙・クロス材",
      lead: "柄データ、壁面寸法、ロール梱包、施工側条件を確認して手配する内装壁材です。",
      plans: ["住宅向けクロス", "店舗アクセント壁", "ホテル・民泊壁面"],
      specs: ["壁面幅、高さ、枚数を確認", "柄データ、色味、リピートを確認", "防炎仕様が必要な場合は対応可否を事前確認", "ロール梱包、折れ、汚れ防止を確認"],
      quote: "壁面サイズ、素材、柄データ、数量、配送先により案件ごとに確認します。"
    },
    zh: {
      name: "墙纸 / 墙布材料",
      lead: "确认图案文件、墙面尺寸、卷装包装和施工侧条件后安排的墙面内装材料。",
      plans: ["住宅墙面材料", "店铺重点墙", "酒店/民泊墙面"],
      specs: ["确认墙面宽度、高度、数量", "确认图案文件、色味、花距", "需要防炎规格时，事前确认对应可否", "确认卷装、防折、防污包装"],
      quote: "根据墙面尺寸、材料、图案文件、数量和配送地址逐案确认。"
    },
    en: {
      name: "Wallpaper / Wall Covering",
      lead: "Wallpaper and wall covering materials arranged after checking artwork, wall dimensions, roll packing, and installation-side conditions.",
      plans: ["Residential wall covering", "Shop accent wall", "Hotel / minpaku wall"],
      specs: ["Wall width, height, and quantity checked", "Pattern data, color, and repeat checked", "Fire-retardant requirements checked in advance when needed", "Roll packing checked to prevent folding and stains"],
      quote: "Checked case by case according to wall size, material, artwork, quantity, and delivery address."
    }
  },
  "wpc-decking-details.html": {
    ja: {
      name: "人工木デッキ材",
      lead: "バルコニー、テラス、店舗外部向けに、長物梱包、搬入、下地条件を確認する人工木デッキ材です。",
      plans: ["バルコニーセット", "住宅テラスセット", "店舗外部大面積セット"],
      specs: ["面積、長さ、数量、色を確認", "根太、下地、固定部材の条件を確認", "屋外使用、排水、日射条件を確認", "長物梱包、重量、搬入経路を個別確認"],
      quote: "面積、仕様、数量、部材、配送先、搬入条件により案件ごとにお見積りします。"
    },
    zh: {
      name: "人工木地板材料",
      lead: "面向阳台、露台、店铺外部，确认长条材料包装、搬入和基层条件的人工木地板材料。",
      plans: ["阳台套餐", "住宅露台套餐", "店铺外部大面积套餐"],
      specs: ["确认面积、长度、数量、颜色", "确认龙骨、基层、固定部材条件", "确认户外使用、排水、日晒条件", "长条包装、重量、搬入路线单独确认"],
      quote: "根据面积、规格、数量、部材、配送地址和搬入条件逐案报价。"
    },
    en: {
      name: "WPC Decking Board",
      lead: "WPC decking boards for balconies, terraces, and shop exteriors checked by long-material packing, carrying route, and substrate conditions.",
      plans: ["Balcony set", "Residential terrace set", "Large shop exterior set"],
      specs: ["Area, length, quantity, and color checked", "Joist, substrate, and fixing parts confirmed", "Outdoor use, drainage, and sunlight conditions checked", "Long-material packing, weight, and carrying route checked separately"],
      quote: "Quoted case by case according to area, specification, quantity, parts, delivery address, and carrying conditions."
    }
  }
};

const langConfig = {
  ja: {
    dir: "",
    htmlLang: "ja",
    title: "京建サプライ｜中国工場 × 日本現場 × 工務店のサプライチェーンパートナー",
    description: "京建サプライは、中国工場と日本現場をつなぎ、工務店・内装会社・設計会社のために材料調達、包装、物流、現場確認を支えるサプライチェーンパートナーです。",
    logo: "京建サプライ",
    nav: ["中国工場・供給実景", "日本現場記録", "製品と見積", "工務店連携"],
    heroTitle: "二十年、サプライチェーンだけを積み上げてきました。",
    heroSub: ["中国工場", "↓", "日本現場", "↓", "長期連携"],
    heroBody: "京建サプライは施工会社ではありません。中国側の製作、包装、物流、日本到着後の現場確認をつなぎ、工務店・内装会社の背後で材料供給の確実性を積み上げます。",
    primary: "工場・供給実景を見る",
    secondary: "製品と見積を見る",
    factoryTitle: "中国工場・供給実景",
    factoryLead: "工場、材料、梱包、倉庫、出荷、積み込み、物流前の状態を写真で残します。京建が見るのは価格だけではなく、安定して作れるか、梱包できるか、日本の現場に届く形にできるかです。",
    siteTitle: "日本現場記録",
    siteLead: "材料到着、寸法確認、破損確認、取付前確認、引き渡し状態を残します。施工実績ではなく、材料が日本の現場へ落ちた事実の記録です。",
    timelineTitle: "サプライチェーン時間軸",
    timelineSteps: ["ご要望・図面確認", "工場確認", "サンプル / 仕様確認", "梱包", "国際物流", "日本国内配送", "現場引き渡し"],
    partnerTitle: "工務店連携",
    partnerLead: "京建は現場を奪いません。材料、調達、輸送、到着確認を支え、施工・顧客対応・取付費用は工務店様側で決めていただきます。",
    productsTitle: "製品と見積",
    productsLead: "写真で供給体制を確認したら、必要な製品を選び、図面・写真・寸法をLINEで送ってください。",
    contactTitle: "LINEで注文・見積相談",
    contactLead: "製品名、写真、寸法、数量、納品先を送ってください。仕様確認後に概算見積をご案内します。",
    line: "LINEで注文・見積相談",
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
    nav: ["China Factory & Supply Records", "Japan Site Records", "Products & Quotes", "Partners"],
    heroTitle: "Twenty years, focused on supply chain certainty.",
    heroSub: ["China Factory", "↓", "Japan Site", "↓", "Long-term Partnership"],
    heroBody: "Kyoken Supply is not a contractor competing for your site. We support material sourcing, production coordination, export packaging, logistics, and arrival confirmation so contractors can focus on their own clients and installation work.",
    primary: "View factory records",
    secondary: "View products & quotes",
    factoryTitle: "China Factory & Supply Records",
    factoryLead: "Factory, materials, packing, warehouse, shipment, loading, and pre-logistics conditions. We show whether materials can be made, packed, shipped, and received reliably.",
    siteTitle: "Japan Site Records",
    siteLead: "Material arrival, dimension checks, damage checks, pre-installation confirmation, and handover status. These are not construction case studies; they are records of materials landing at Japanese sites.",
    timelineTitle: "Supply Chain Timeline",
    timelineSteps: ["Request & Drawing Check", "Factory Confirmation", "Sample / Specification", "Packing", "International Logistics", "Japan Delivery", "Site Handover"],
    partnerTitle: "Contractor Partnership",
    partnerLead: "Kyoken does not take your construction clients. We support procurement, transportation, delivery, and confirmation; contractors remain responsible for installation, site work, pricing, and customer relationships.",
    productsTitle: "Products & Quotes",
    productsLead: "Check the supply-chain photos, choose a product, then send photos, dimensions, quantity, and delivery area via LINE.",
    contactTitle: "Order or quote via LINE",
    contactLead: "Send product name, photos, dimensions, quantity, and delivery area. A rough quote is provided after specification review.",
    line: "Order / quote via LINE",
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
    nav: ["中国工厂・供应链实景", "日本现场记录", "产品与报价", "工务店合作"],
    heroTitle: "二十年，只做好供应链这一件事。",
    heroSub: ["中国工厂", "↓", "日本现场", "↓", "长期合作"],
    heroBody: "京建不是施工竞争者。我们做的是中国侧生产、包装、物流、日本到场确认，把材料可交付、可安装、可沟通这件事做稳定。",
    primary: "看工厂供应链实景",
    secondary: "看产品和报价",
    factoryTitle: "中国工厂・供应链实景",
    factoryLead: "展示工厂、包装、材料、仓库、发货、装车、物流前状态。京建看的不是最低价，而是能不能稳定生产、稳定包装、稳定交付到日本现场。",
    siteTitle: "日本现场记录",
    siteLead: "展示材料到场、尺寸确认、破损确认、安装前确认、交付状态。这里不是施工案例，而是材料真正落到日本现场的记录。",
    timelineTitle: "供应链时间轴",
    timelineSteps: ["需求与图纸确认", "工厂确认", "样品 / 规格确认", "包装", "国际物流", "日本国内配送", "现场交付"],
    partnerTitle: "工务店合作",
    partnerLead: "京建负责材料、采购、运输、交付确认；现场施工、安装报价、终端客户维护由工务店主导。",
    productsTitle: "产品与报价",
    productsLead: "先看供应链、工厂、日本现场照片，再选择产品，最后把照片、尺寸、数量、地址发到 LINE。",
    contactTitle: "LINE 下单或报价咨询",
    contactLead: "发送产品名、照片、尺寸、数量、配送地址。规格确认后给出概算报价。",
    line: "LINE 下单 / 报价咨询",
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

function mediaSlot(record, lang) {
  const mediaLabel = lang === "en" ? "RECORD MEDIA" : lang === "zh" ? "记录影像" : "記録写真";
  const mediaPrefix = lang === "ja" ? "" : "../";
  const resolveMedia = (value) => {
    if (!value) return "";
    if (/^(https?:)?\/\//u.test(value) || value.startsWith("data:")) return value;
    return `${mediaPrefix}${value.replace(/^\/+/u, "")}`;
  };
  const media = (record.media || []).map((item) => ({ raw: item, src: resolveMedia(item) })).filter((item) => item.src);
  if (media.length) {
    const firstImage = media.find((item) => !isVideoMedia(item.raw))?.src || "";
    const mediaHtml = media.map((item) => {
      if (isVideoMedia(item.raw)) {
        return `<video class="v5-record-media" controls playsinline${firstImage ? ` poster="${firstImage}"` : ""}>
          <source src="${item.src}">
        </video>`;
      }
      return `<img class="v5-record-media" src="${item.src}" alt="">`;
    }).join("");
    return `<div class="v5-record-gallery">${mediaHtml}</div>`;
  }
  return photoSlot(lang === "en" ? "Photo / video to be added" : lang === "zh" ? "照片 / 视频待补充" : "写真 / 動画を追加予定", mediaLabel);
}

function recordModuleLabel(category, lang) {
  const labels = {
    factory: { ja: "中国工場・供給実景", en: "China Factory & Supply Records", zh: "中国工厂・供应链实景" },
    site: { ja: "日本現場記録", en: "Japan Site Records", zh: "日本现场记录" }
  };
  return (labels[category] || labels.factory)[lang];
}

function recordCard(record, lang) {
  const title = record[lang]?.title || record.title || recordModuleLabel(record.category || "factory", lang);
  return `<article class="v5-record v5-record-photo-card">
          <h3 class="v5-record-title">${title}</h3>
          ${mediaSlot(record, lang)}
        </article>`;
}

function hasRecordMedia(record) {
  return Boolean(record.media && record.media.length);
}

function homeRecords(lang, category, limit, fallbackHtml) {
  const records = orderedRecordsForCategory(category)
    .filter((record) => record.showOnHome !== false)
    .slice(0, limit);
  if (!records.length) return fallbackHtml;
  return records.map((record) => recordCard(record, lang)).join("\n");
}

function recordsForChannel(category, channel) {
  return supplyRecords
    .filter((record) => record.showOnHome !== false)
    .filter(hasRecordMedia)
    .filter((record) => (record.category || "factory") === category)
    .filter((record) => (record.channel || "") === channel)
    .sort((a, b) => String(b.sortKey || b.slug).localeCompare(String(a.sortKey || a.slug)));
}

function orderedRecordsForCategory(category) {
  if (category === "factory") {
    return recordChannels.flatMap((channel) => recordsForChannel("factory", channel.id));
  }
  return supplyRecords
    .filter((record) => record.showOnHome !== false)
    .filter(hasRecordMedia)
    .filter((record) => (record.category || "factory") === category)
    .sort((a, b) => String(b.sortKey || b.slug).localeCompare(String(a.sortKey || a.slug)));
}

function channelRecordSection(channel, lang) {
  const records = recordsForChannel(channel.category, channel.id);
  const content = records.length
    ? records.map((record) => recordCard(record, lang)).join("\n")
    : photoSlot(lang === "en" ? "Photos to be added" : lang === "zh" ? "照片待补充" : "写真を追加予定", channel.titles[lang]);
  return `<section class="v5-channel-block">
        <h3>${channel.titles[lang]}</h3>
        <div class="v5-record-grid">${content}</div>
      </section>`;
}

function productCards(lang) {
  const prefix = lang === "ja" ? "" : "../";
  return products.map(([file, ja, en, zh, note]) => {
    const name = lang === "en" ? en : lang === "zh" ? zh : ja;
    const href = productHref(lang, file);
    const sub = lang === "en" ? "Factory source / packaging / delivery / site confirmation" : lang === "zh" ? "工厂来源 / 包装 / 运输 / 日本现场确认" : "工場確認 / 包装 / 物流 / 現場確認";
    const productNote = lang === "en" ? enProductNotes[file] : lang === "zh" ? zhProductNotes[file] : note;
    const image = `${prefix}${productImages[file]}`;
    const quote = productQuoteLabels[lang][file];
    const detailText = lang === "en" ? "View quote" : lang === "zh" ? "查看报价" : "見積を見る";
    const lineText = lang === "en" ? "Order / consult" : lang === "zh" ? "下单 / 咨询" : "注文 / 相談";
    return `<article class="v5-product-card">
      <img class="v5-product-image" src="${image}" alt="${name}">
      <div>
        <h3>${name}</h3>
        <strong class="v5-product-price">${quote}</strong>
        <p>${sub}</p>
        <small>${productNote}</small>
        <div class="v5-product-actions">
          <a href="${href}">${detailText}</a>
          <a href="${lineUrl}">${lineText}</a>
        </div>
      </div>
    </article>`;
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
  <link rel="icon" type="image/png" href="${prefix}media/remote/6e64da3a8e48.png">
  <meta property="og:title" content="${c.title}">
  <meta property="og:description" content="${c.description}">
  <meta property="og:image" content="${prefix}media/remote/6e64da3a8e48.png">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="${prefix}styles.css?v=20260701-audit6">
</head>
<body class="v5-body">
  <header class="v5-header">
    <a href="${c.homeUrl}" class="v5-logo">${c.logo}</a>
    <nav class="v5-nav">
      <a href="#factory">${c.nav[0]}</a>
      <a href="#site">${c.nav[1]}</a>
      <a href="#products">${c.nav[2]}</a>
      <a href="${c.contractorUrl}">${c.nav[3]}</a>
    </nav>
    <div class="v5-lang">${languageSwitch}</div>
  </header>

  <main>
    <section class="v5-hero">
      <div class="v5-hero-photo">
        ${photoSlot(lang === "en" ? "Factory / packing / site records" : lang === "zh" ? "工厂 / 包装 / 现场记录" : "工場・梱包・現場の記録", lang === "en" ? "SUPPLY RECORD" : lang === "zh" ? "供应链记录" : "写真記録")}
      </div>
      <div class="v5-hero-copy">
        <p class="v5-kicker">${lang === "en" ? "CHINA FACTORY × JAPAN SITE" : lang === "zh" ? "中国工厂 × 日本现场" : "中国工場 × 日本現場"}</p>
        <h1>${c.heroTitle}</h1>
        <div class="v5-route">${c.heroSub.map((item) => `<span>${item}</span>`).join("")}</div>
        <p>${c.heroBody}</p>
        <div class="v5-actions">
          <a href="#factory">${c.primary}</a>
          <a href="#products">${c.secondary}</a>
        </div>
      </div>
    </section>

    <section id="factory" class="v5-section">
      <div>
        <p class="v5-kicker">${lang === "en" ? "FACTORY / PACKING / SHIPMENT" : lang === "zh" ? "工厂 / 包装 / 发货" : "工場 / 梱包 / 出荷"}</p>
        <h2>${c.factoryTitle}</h2>
        <p class="v5-lead">${c.factoryLead}</p>
      </div>
      <div class="v5-channel-stack">
        ${recordChannels.map((channel) => channelRecordSection(channel, lang)).join("\n")}
      </div>
      <a class="v5-section-link" href="supply-chain-records.html">${lang === "en" ? "View all records" : lang === "zh" ? "查看全部实景记录" : "すべての記録を見る"}</a>
    </section>

    <section id="site" class="v5-section v5-split reverse">
      <div>
        <p class="v5-kicker">${lang === "en" ? "JAPAN SITE" : lang === "zh" ? "日本现场" : "日本現場"}</p>
        <h2>${c.siteTitle}</h2>
        <p class="v5-lead">${c.siteLead}</p>
      </div>
      <div class="v5-record-grid two">
        ${homeRecords(lang, "site", 2, photoSlot(lang === "en" ? "Site photos / videos to be added" : lang === "zh" ? "现场照片 / 视频待补充" : "現場写真 / 動画を追加予定", recordModuleLabel("site", lang)))}
      </div>
    </section>

    <section class="v5-section">
      <p class="v5-kicker">${lang === "en" ? "PROCESS" : lang === "zh" ? "流程顺序" : "流れ"}</p>
      <h2>${c.timelineTitle}</h2>
      <div class="v5-timeline">
        ${c.timelineSteps.map((step, i) => `<div><span>0${i + 1}</span><strong>${step}</strong></div>`).join("")}
      </div>
    </section>

    <section class="v5-section v5-partner">
      <p class="v5-kicker">${lang === "en" ? "ROLE BOUNDARY" : lang === "zh" ? "分工边界" : "分担範囲"}</p>
      <h2>${c.partnerTitle}</h2>
      <p class="v5-lead">${c.partnerLead}</p>
      <a href="${c.contractorUrl}">${c.partnerTitle}</a>
    </section>

    <section id="products" class="v5-section">
      <p class="v5-kicker">${lang === "en" ? "PRODUCTS / QUOTES" : lang === "zh" ? "产品 / 报价" : "製品 / 見積"}</p>
      <h2>${c.productsTitle}</h2>
      <p class="v5-lead">${c.productsLead}</p>
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
    <p>© 2026 ${lang === "en" ? "Kyoken Real Estate Development Co., Ltd." : lang === "zh" ? "京建不动产开发株式会社" : "京建不動産開発株式会社"}</p>
  </footer>
</body>
</html>
`;
}

function recordsPage(lang) {
  const c = langConfig[lang];
  const prefix = lang === "ja" ? "" : "../";
  const backText = lang === "en" ? "Back to home" : lang === "zh" ? "返回首页" : "トップへ戻る";
  const title = lang === "en" ? "Factory & Site Records" : lang === "zh" ? "工厂与现场实景记录" : "工場・現場記録";
  const lead = lang === "en"
    ? "Raw photos and videos from China factory supply-chain scenes and Japan site handover. Photos speak first."
    : lang === "zh"
      ? "这里集中展示中国工厂供应链实景和日本现场记录。照片先说话。"
      : "中国工場の供給実景と日本現場記録の写真・動画を集約します。まず写真で確認できる状態にします。";
  return `<!DOCTYPE html>
<html lang="${c.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="${prefix}media/remote/6e64da3a8e48.png">
  <title>${title} | ${c.logo}</title>
  <meta name="description" content="${lead}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="${prefix}styles.css?v=20260701-audit6">
</head>
<body class="v5-body">
  <header class="v5-header">
    <a href="${c.homeUrl}" class="v5-logo">${c.logo}</a>
    <nav class="v5-nav"><a href="${c.homeUrl}#factory">${c.nav[0]}</a><a href="${c.homeUrl}#products">${c.nav[2]}</a></nav>
    <a class="v5-back-link" href="${c.homeUrl}">${backText}</a>
  </header>
  <main>
    <section class="v5-section v5-records-page">
      <p class="v5-kicker">${lang === "en" ? "PHOTO RECORDS" : lang === "zh" ? "实景记录" : "写真記録"}</p>
      <h1>${title}</h1>
      <p class="v5-lead">${lead}</p>
      <div class="v5-record-detail-list">
        ${[...orderedRecordsForCategory("factory"), ...orderedRecordsForCategory("site")].map((record) => `<article id="record-${record.slug}" class="v5-record-detail v5-record-photo-card">
          <h2 class="v5-record-title">${record[lang]?.title || record.title || recordModuleLabel(record.category || "factory", lang)}</h2>
          ${mediaSlot(record, lang)}
        </article>`).join("\n")}
      </div>
    </section>
  </main>
  <footer class="v5-footer"><strong>${lang === "en" ? "Kyoken Real Estate Development Co., Ltd." : lang === "zh" ? "京建不动产开发株式会社" : "京建不動産開発株式会社"}</strong><p>© 2026 ${lang === "en" ? "Kyoken Real Estate Development Co., Ltd." : lang === "zh" ? "京建不动产开发株式会社" : "京建不動産開発株式会社"}</p></footer>
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
  <link rel="icon" type="image/png" href="${prefix}media/remote/6e64da3a8e48.png">
  <title>${title} | ${c.logo}</title>
  <meta name="description" content="${c.partnerLead}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="${prefix}styles.css?v=20260701-audit6">
</head>
<body class="v5-body">
  <header class="v5-header">
    <a href="${c.homeUrl}" class="v5-logo">${c.logo}</a>
    <nav class="v5-nav"><a href="${c.homeUrl}#factory">${c.nav[0]}</a><a href="${c.homeUrl}#products">${c.nav[2]}</a></nav>
  </header>
  <main>
    <section class="v5-section v5-partner-page">
      <p class="v5-kicker">${lang === "en" ? "ROLE BOUNDARY" : lang === "zh" ? "分工边界" : "分担範囲"}</p>
      <h1>${title}</h1>
      ${body.map((line) => `<p>${line}</p>`).join("\n")}
      <div class="v5-role-grid">
        <div><h2>${lang === "en" ? "Kyoken" : lang === "zh" ? "京建负责" : "京建が担当"}</h2><ul>${kyokenItems.map((item) => `<li>${item}</li>`).join("")}</ul></div>
        <div><h2>${lang === "en" ? "Contractor" : lang === "zh" ? "工务店负责" : "工務店様が担当"}</h2><ul>${contractorItems.map((item) => `<li>${item}</li>`).join("")}</ul></div>
      </div>
      <a class="v5-line-link" href="${lineUrl}">${c.line}</a>
    </section>
  </main>
  <footer class="v5-footer"><strong>${lang === "en" ? "Kyoken Real Estate Development Co., Ltd." : lang === "zh" ? "京建不动产开发株式会社" : "京建不動産開発株式会社"}</strong><p>© 2026 ${lang === "en" ? "Kyoken Real Estate Development Co., Ltd." : lang === "zh" ? "京建不动产开发株式会社" : "京建不動産開発株式会社"}</p></footer>
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
      <p class="v5-kicker">供应链记录</p>
      <h2>材料交付记录：${title}</h2>
      <p>这里记录工厂确认、包装方式、运输路径和日本现场交接，不只是参数和价格。</p>
      <div class="v5-story-grid"><div><span>01</span><h3>工厂来源</h3><p>确认材料、工艺、生产稳定性和供应商沟通能力。</p></div><div><span>02</span><h3>包装方式</h3><p>根据产品风险确认纸箱、护角、标签、托盘、卷装或木架。</p></div><div><span>03</span><h3>运输确认</h3><p>按尺寸、数量、重量、进口费用和日本配送地址逐案确认。</p></div><div><span>04</span><h3>日本现场</h3><p>记录到场、破损检查、尺寸确认、安装前交接。</p></div></div>
      <div class="v5-contractor-note"><strong>分工边界：</strong>京建负责降低供应链不确定性；工务店负责安装施工、现场责任、安装报价和终端客户沟通。</div>
    </section>`;
  }
  return `<section class="v5-product-story">
    <p class="v5-kicker">サプライチェーン記録</p>
    <h2>工場から現場まで：${title}</h2>
    <p>仕様と価格だけでなく、製作確認、梱包、輸送、日本到着後の引き渡しまでを記録します。</p>
    <div class="v5-story-grid"><div><span>01</span><h3>工場確認</h3><p>素材、加工方法、製作安定性、サプライヤーとの連絡精度を確認します。</p></div><div><span>02</span><h3>包装方式</h3><p>破損リスクに合わせ、箱、角保護、ラベル、パレット、ロール梱包を確認します。</p></div><div><span>03</span><h3>輸送確認</h3><p>サイズ、数量、重量、輸入諸費用、日本国内配送を案件ごとに確認します。</p></div><div><span>04</span><h3>日本現場</h3><p>到着、破損確認、寸法確認、取付前の引き渡しを記録します。</p></div></div>
    <div class="v5-contractor-note"><strong>分担：</strong>京建はサプライチェーンの不確実性を下げます。施工、現場責任、取付費用、エンドユーザー対応は工務店様の領域です。</div>
  </section>`;
}

function productDetailPage(lang, file) {
  const c = langConfig[lang];
  const detail = productDetails[file]?.[lang];
  if (!detail) throw new Error(`Missing product detail for ${lang}/${file}`);
  const prefix = lang === "ja" ? "" : "../";
  const image = `${prefix}${productImages[file]}`;
  const quoteLabel = lang === "en" ? "Case-by-case quote" : lang === "zh" ? "案件逐项确认报价" : "案件ごとにお見積り";
  const packageTitle = lang === "en" ? "Plan / Specification" : lang === "zh" ? "套餐 / 规格" : "プラン / 仕様";
  const quoteTitle = lang === "en" ? "Quote Conditions" : lang === "zh" ? "报价说明" : "見積条件";
  const siteTitle = lang === "en" ? "Related Records" : lang === "zh" ? "相关记录" : "関連記録";
  const backText = lang === "en" ? "Back to home" : lang === "zh" ? "返回首页" : "トップへ戻る";
  const recordNote = lang === "en"
    ? "Photos and videos are managed under China Factory & Supply Records and Japan Site Records."
    : lang === "zh"
      ? "照片和视频统一归档到「中国工厂・供应链实景」和「日本现场记录」。"
      : "写真と動画は「中国工場・供給実景」と「日本現場記録」に集約します。";
  const lineNote = lang === "en"
    ? "Send drawings, site photos, dimensions, quantity, and delivery area."
    : lang === "zh"
      ? "发送图纸、现场照片、尺寸、数量和配送区域。"
      : "図面、現場写真、寸法、数量、配送先エリアをお送りください。";
  const languageSwitch = lang === "ja"
    ? `<span>JP</span><a href="en/${file}">EN</a><a href="zh/${file}">CN</a>`
    : lang === "en"
      ? `<a href="../${file}">JP</a><span>EN</span><a href="../zh/${file}">CN</a>`
      : `<a href="../${file}">JP</a><a href="../en/${file}">EN</a><span>中文</span>`;

  return `<!DOCTYPE html>
<html lang="${c.htmlLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${detail.name} | ${c.logo}</title>
  <meta name="description" content="${detail.lead}">
  <link rel="icon" type="image/png" href="${prefix}media/remote/6e64da3a8e48.png">
  <meta property="og:title" content="${detail.name} | ${c.logo}">
  <meta property="og:description" content="${detail.lead}">
  <meta property="og:image" content="${image}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="${prefix}styles.css?v=20260701-occam1">
</head>
<body class="v5-body">
  <header class="v5-header">
    <a href="${c.homeUrl}" class="v5-logo">${c.logo}</a>
    <nav class="v5-nav"><a href="${c.homeUrl}#factory">${c.nav[0]}</a><a href="${c.homeUrl}#products">${c.nav[2]}</a></nav>
    <div class="v5-lang">${languageSwitch}</div>
  </header>

  <main>
    <section class="v5-product-hero">
      <div>
        <p class="v5-kicker">${lang === "en" ? "MATERIAL SUPPLY" : lang === "zh" ? "材料供应" : "資材供給"}</p>
        <h1>${detail.name}</h1>
        <p>${detail.lead}</p>
        <div class="v5-product-cta-row">
          <span>${quoteLabel}</span>
          <a href="${lineUrl}">${c.line}</a>
        </div>
      </div>
      <img src="${image}" alt="${detail.name}">
    </section>

    <section class="v5-section v5-product-module">
      <p class="v5-kicker">${lang === "en" ? "SCOPE" : lang === "zh" ? "范围" : "範囲"}</p>
      <h2>${packageTitle}</h2>
      <div class="v5-product-plan-grid">
        ${detail.plans.map((plan, index) => `<div><span>0${index + 1}</span><strong>${plan}</strong></div>`).join("")}
      </div>
      <div class="v5-spec-grid">
        ${detail.specs.map((item) => `<div>${item}</div>`).join("")}
      </div>
    </section>

    <section class="v5-section v5-product-module">
      <p class="v5-kicker">${lang === "en" ? "QUOTE" : lang === "zh" ? "报价" : "見積"}</p>
      <h2>${quoteTitle}</h2>
      <p class="v5-lead">${detail.quote}</p>
      <div class="v5-quote-band">
        <strong>${quoteLabel}</strong>
        <span>${lineNote}</span>
      </div>
    </section>

    <section class="v5-section v5-product-module">
      <p class="v5-kicker">${lang === "en" ? "RECORDS" : lang === "zh" ? "记录" : "記録"}</p>
      <h2>${siteTitle}</h2>
      <p class="v5-lead">${recordNote}</p>
      <a class="v5-section-link" href="${c.homeUrl}#factory">${lang === "en" ? "Open factory and site records" : lang === "zh" ? "查看工厂和现场记录" : "工場・現場記録を見る"}</a>
    </section>

    ${productStory(lang, detail.name)}

    <section class="v5-section v5-contact">
      <h2>${c.contactTitle}</h2>
      <p>${c.contactLead}</p>
      <a href="${lineUrl}">${c.line}</a>
    </section>
  </main>

  <footer class="v5-footer">
    <a class="v5-back-link" href="${c.homeUrl}">${backText}</a>
    <strong>${lang === "en" ? "Kyoken Real Estate Development Co., Ltd." : lang === "zh" ? "京建不动产开发株式会社" : "京建不動産開発株式会社"}</strong>
    <p>© 2026 ${lang === "en" ? "Kyoken Real Estate Development Co., Ltd." : lang === "zh" ? "京建不动产开发株式会社" : "京建不動産開発株式会社"}</p>
  </footer>
</body>
</html>
`;
}

function writeFile(relativePath, content) {
  fs.mkdirSync(path.dirname(path.join(root, relativePath)), { recursive: true });
  fs.writeFileSync(path.join(root, relativePath), content);
}

for (const lang of Object.keys(langConfig)) {
  const dir = langConfig[lang].dir;
  writeFile(rel(dir, "index.html"), homePage(lang));
  writeFile(rel(dir, "contractor-partnership.html"), contractorPage(lang));
  writeFile(rel(dir, "supply-chain-records.html"), recordsPage(lang));
}

for (const [file] of products) {
  writeFile(file, productDetailPage("ja", file));
  writeFile(`en/${file}`, productDetailPage("en", file));
  writeFile(`zh/${file}`, productDetailPage("zh", file));
}

console.log("V5 rebuild complete");
