# 多平台搜索优化 v1 提交清单与追踪表

更新时间：2026-07-17

## 已完成的站内准备

| 项目 | 状态 | 文件 / 页面 |
| --- | --- | --- |
| Sitemap | 已生成 | https://www.kyoken.design/sitemap.xml |
| Robots | 已允许 Google / Bing / Yahoo / Baidu / Apple / AI crawler | https://www.kyoken.design/robots.txt |
| Open Graph | 已补强 title / description / image / locale | 全站生成页 |
| Twitter Card | 已补强 summary_large_image | 全站生成页 |
| 多语种 hreflang | 已补强 JA / ZH / EN / x-default | 非 guide 页面 |
| AI 可引用入口 | 已补强 llms.txt，含三语 Direct Answer Summary / 引用边界 / 核心页面 | https://www.kyoken.design/llms.txt |
| AI crawler 放行 | 已补 OAI-SearchBot / ChatGPT-User / Perplexity-User / Claude-SearchBot / Claude-User | https://www.kyoken.design/robots.txt |
| WebPage JSON-LD | 已补每页主题、语种、canonical、audience、abstract、primaryImageOfPage | 全站生成页 |
| ItemList JSON-LD | 已补首页产品目录和 guide 目录 | 三语首页 |
| 手机号公开风险 | 已加测试禁止公开 | scripts/seo-check.mjs |

## 平台提交清单

| 平台 | 目标 | 当前状态 | 下一步 | 记录日期 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Google Search Console | sitemap / 重点页面索引 / 富媒体结果 | sitemap、Product offers、FAQ、Breadcrumb、ItemList 已准备 | 重新提交 sitemap 后，对首页、产品页、guide 页请求编入索引 | 2026-07-17 | 重点看产品摘要、FAQ、Breadcrumb 是否稳定 |
| Bing Webmaster Tools | sitemap 提交 / URL Inspection | Bing 验证文件已存在，robots 已允许 bingbot | 重新提交 sitemap 并检查 Processing 结果 | 2026-07-17 | 会影响 Bing、Microsoft Copilot、部分 Yahoo/Bing 数据源 |
| Yahoo Japan | 日文页面兼容 | 日文 canonical、OG、FAQ、guide 已准备 | 用日文关键词检查 Yahoo Japan 结果 | 2026-07-17 | Yahoo Japan 多依赖外部搜索索引，重点维护日文标题和摘要 |
| 百度搜索资源平台 | 中文页收录准备 | robots / 中文页 / sitemap 已准备 | 检查百度是否可访问 https://www.kyoken.design/zh/，可访问后提交 sitemap | 2026-07-17 | 中国大陆访问速度和收录不保证，需要后续实测 |
| ChatGPT Search | AI 搜索引用 | llms.txt 三语摘要、OAI-SearchBot、ChatGPT-User 已准备 | 用监测表查询，记录是否引用 Kyoken 链接 | 2026-07-17 | OpenAI 搜索抓取和用户请求抓取分开处理 |
| Perplexity | AI 搜索引用 | PerplexityBot、Perplexity-User、guide 摘要已准备 | 用监测表查询，记录答案和引用页 | 2026-07-17 | 重点看 guide 页是否被引用 |
| Gemini | AI 搜索引用 | Googlebot / Google-Extended / sitemap / WebPage abstract 已准备 | 用日文、中文、英文关键词测试 Gemini 引用 | 2026-07-17 | Gemini 主要依赖 Google 生态收录和页面质量 |
| Claude | AI 搜索引用 | ClaudeBot / Claude-SearchBot / Claude-User / 三语引用边界已准备 | 用 Claude 搜索或联网问答测试引用 | 2026-07-17 | 已设置 Crawl-delay，减少抓取压力 |

## AI 搜索引用专项监测表

| 日期 | 平台 | 查询语句 | 期望引用页面 | 是否出现 Kyoken | 是否给出链接 | 摘要是否准确 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | ChatGPT Search | 東京 店舗看板 交換 費用 現場写真 見積 | /guides/tokyo-shop-signage-cost.html |  |  |  | 若未出现，补“東京 店舗看板 交換 費用”二级 guide |
|  | ChatGPT Search | 小規模工務店 中国建材 仕入れ 工事現場 | /guides/small-contractor-china-materials.html |  |  |  | 若未出现，补工务店向长文 guide |
|  | Perplexity | 東京でカーテン見積前に送る写真と寸法 | /guides/curtain-photo-measurement.html |  |  |  | 若未出现，补窗帘 FAQ 和图片说明 |
|  | Perplexity | China factory materials Japan contractor supply chain | /en/contractor-partnership.html |  |  |  | 若未出现，补英文 contractor guide |
|  | Gemini | 中国工厂 工地现场 建材供应链 工务店 | /zh/contractor-partnership.html |  |  |  | 若未出现，补中文工务店合作 guide |
|  | Gemini | 店铺广告材料 中国工厂 日本配送 | /zh/advertising-materials-details.html |  |  |  | 若未出现，补中文广告材料 guide |
|  | Claude | What does Kyoken Supply support for contractors? | /en/contractor-partnership.html |  |  |  | 若未出现，强化英文 Direct Answer 和 FAQ |
|  | Claude | 京建サプライ 中国建材 工務店 何をしてくれる | /contractor-partnership.html |  |  |  | 若未出现，补日文问答型 guide |

## 手动提交顺序

1. Google Search Console：提交 https://www.kyoken.design/sitemap.xml，并请求首页、/contractor-partnership.html、/curtain-details.html、/wpc-decking-details.html、5 个 guide 编入索引。
2. Rich Results Test：检查首页、窗帘页、塑木板页、工务店合作页，确认 Product / FAQ / Breadcrumb 没有严重问题。
3. Bing Webmaster Tools：重新提交 sitemap，检查 URL Inspection。
4. Yahoo Japan：用日文关键词搜索，不单独承诺后台提交，以 Google/Bing 收录为主。
5. 百度搜索资源平台：先测 https://www.kyoken.design/zh/ 是否能稳定访问，再提交 sitemap。
6. AI 搜索：ChatGPT、Perplexity、Gemini、Claude 每周用上表问题监测一次。

## 每周检查方法

1. 每个平台固定用上表查询语句测试一次。
2. 记录是否出现 Kyoken、是否出现可点击链接、AI 摘要是否误解服务范围。
3. 若连续两周不出现，补一个更具体的二级 guide。
4. 若出现但摘要错误，修改对应页面的 H1、FAQ、support/boundary 区块。
5. 若出现但没有链接，补更清晰的 canonical、FAQ 和 llms.txt 摘要。
