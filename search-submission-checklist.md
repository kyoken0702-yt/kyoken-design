# 搜索平台提交清单

更新时间：2026-07-14

## 站点入口

- Canonical: https://www.kyoken.design
- Sitemap: https://www.kyoken.design/sitemap.xml
- Robots: https://www.kyoken.design/robots.txt
- AI 引用入口: https://www.kyoken.design/llms.txt
- Bing 验证文件: https://www.kyoken.design/BingSiteAuth.xml

## 优先提交页面

| 优先级 | 页面 | 用途 |
| --- | --- | --- |
| P0 | https://www.kyoken.design/ | 首页品牌、业务范围、LINE 入口 |
| P0 | https://www.kyoken.design/contractor-partnership.html | 工务店合作、业务边界、AI 引用重点 |
| P0 | https://www.kyoken.design/curtain-details.html | 窗帘产品、报价、Product JSON-LD |
| P0 | https://www.kyoken.design/wpc-decking-details.html | 塑木板产品、安装和配件说明 |
| P1 | https://www.kyoken.design/supply-chain-records.html | 中国工厂和工地现场记录 |
| P1 | https://www.kyoken.design/guides/small-contractor-china-materials.html | 中国建材采购 guide |
| P1 | https://www.kyoken.design/guides/curtain-photo-measurement.html | 窗帘报价前照片和尺寸 guide |
| P1 | https://www.kyoken.design/guides/tokyo-shop-signage-cost.html | 店铺看板费用 guide |
| P2 | https://www.kyoken.design/zh/ | 中文首页 |
| P2 | https://www.kyoken.design/en/ | 英文首页 |

## 平台动作

| 平台 | 动作 | 判断标准 |
| --- | --- | --- |
| Google Search Console | 提交 sitemap，请求 P0 / P1 页面编入索引 | URL Inspection 显示可编入索引，无严重结构化数据问题 |
| Google Rich Results Test | 测首页、窗帘页、塑木板页、工务店页 | Product / FAQ / Breadcrumb 无严重错误 |
| Bing Webmaster Tools | 提交 sitemap，检查 URL Inspection | sitemap 成功处理，重点页面可抓取 |
| Yahoo Japan | 用日文关键词人工搜索 | 标题和摘要不混语言，不误写成施工公司 |
| 百度搜索资源平台 | 先测试中文页可访问，再提交 sitemap | zh 页面可访问、无 robots 阻断 |
| ChatGPT Search | 测日文、中文、英文问题 | 出现 Kyoken 链接，摘要不误解业务边界 |
| Perplexity | 测产品和 guide 问题 | 引用具体 guide 或产品页 |
| Gemini | 测 Google 收录后的问答 | 能识别供应链、工务店合作、产品报价 |
| Claude | 测 contractor / supply chain 问题 | 能引用业务边界，不编造最低价或施工保证 |

## 不能承诺

- 不能承诺 Google 1 位。
- 不能承诺 AI 一定引用。
- 不能承诺百度一定收录。
- 不能把京建描述成全施工公司。
- 不能公开个人手机号。
