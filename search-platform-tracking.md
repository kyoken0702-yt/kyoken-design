# 多平台搜索优化 v1 提交清单与追踪表

更新时间：2026-07-09

## 已完成的站内准备

| 项目 | 状态 | 文件 / 页面 |
| --- | --- | --- |
| Sitemap | 已生成 | https://www.kyoken.design/sitemap.xml |
| Robots | 已允许 Google / Bing / Yahoo / Baidu / Apple / AI crawler | https://www.kyoken.design/robots.txt |
| Open Graph | 已补强 title / description / image / locale | 全站生成页 |
| Twitter Card | 已补强 summary_large_image | 全站生成页 |
| 多语种 hreflang | 已补强 JA / ZH / EN / x-default | 非 guide 页面 |
| AI 可引用入口 | 已新增 llms.txt | https://www.kyoken.design/llms.txt |
| 手机号公开风险 | 已加测试禁止公开 | scripts/seo-check.mjs |

## 平台提交清单

| 平台 | 目标 | 当前状态 | 下一步 | 记录日期 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Google Search Console | sitemap / 重点页面索引 | 已提交过 Google sitemap 和重点页面 | 等待收录与查询词数据 | 2026-07-09 | 后续按真实查询词补 guide |
| Bing Webmaster Tools | sitemap 提交 | 待提交 | 添加站点 https://www.kyoken.design 并提交 https://www.kyoken.design/sitemap.xml |  | Bing 也会影响部分 Microsoft / Copilot 结果 |
| Yahoo Japan | 兼容检查 | 站内兼容已准备 | 以 Google / Bing 收录状态为主做检查 |  | Yahoo Japan 搜索结果通常依赖外部搜索索引，重点是页面兼容和日文查询 |
| 百度搜索资源平台 | 中文页收录准备 | robots / 中文页 / sitemap 已准备 | 检查百度是否可访问 https://www.kyoken.design/zh/ 并提交 sitemap |  | 中国大陆访问速度和收录不保证，需要后续实测 |
| ChatGPT Search | AI 引用监测 | llms.txt 已新增 | 用监测表问题测试是否引用 Kyoken 页面 |  | 记录是否出现品牌、页面、链接 |
| Perplexity | AI 引用监测 | llms.txt 已新增 | 用监测表问题测试是否引用 Kyoken 页面 |  | 重点看是否引用 guide 页 |
| Gemini | AI 引用监测 | llms.txt 已新增 | 用监测表问题测试是否引用 Kyoken 页面 |  | 重点看是否能理解日文/中文服务边界 |

## AI 搜索引用专项监测表

| 日期 | 平台 | 查询语句 | 期望引用页面 | 是否出现 Kyoken | 是否给出链接 | 摘要是否准确 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  | ChatGPT Search | 東京 店舗看板 交換 費用 現場写真 見積 | /guides/tokyo-shop-signage-cost.html |  |  |  | 若未出现，补“東京 店舗看板 交換 費用”二级 guide |
|  | ChatGPT Search | 小規模工務店 中国建材 仕入れ 日本現場 | /guides/small-contractor-china-materials.html |  |  |  | 若未出现，补工务店向长文 guide |
|  | Perplexity | 東京でカーテン見積前に送る写真と寸法 | /guides/curtain-photo-measurement.html |  |  |  | 若未出现，补窗帘 FAQ 和图片说明 |
|  | Perplexity | China factory materials Japan contractor supply chain | /en/contractor-partnership.html |  |  |  | 若未出现，补英文 contractor guide |
|  | Gemini | 中国工厂 日本现场 建材供应链 工务店 | /zh/contractor-partnership.html |  |  |  | 若未出现，补中文工务店合作 guide |
|  | Gemini | 店铺广告材料 中国工厂 日本配送 | /zh/advertising-materials-details.html |  |  |  | 若未出现，补中文广告材料 guide |

## 每周检查方法

1. 每个平台固定用上表查询语句测试一次。
2. 记录是否出现 Kyoken、是否出现可点击链接、AI 摘要是否误解服务范围。
3. 若连续两周不出现，补一个更具体的二级 guide。
4. 若出现但摘要错误，修改对应页面的 H1、FAQ、support/boundary 区块。
5. 若出现但没有链接，补更清晰的 canonical、FAQ 和 llms.txt 摘要。
