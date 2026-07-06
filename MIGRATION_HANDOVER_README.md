# 账户搬迁交接清单 (Migration Handover Guide)
**项目：京建サプライ (Kyoken Supply)**
**日期：2026年5月31日**

此文档旨在帮助 6 月 1 日新账号中的 Agent 快速接手该项目。

---

## 1. 项目概况
*   **业务模式**：中国至日本的 B2B 建筑内装资材供应链。配送方法、进口费用和日本国内配送按案件确认。
*   **核心产品**：窗帘、亚克力字、灯箱片、PVC牌、壁纸、珐琅板、吸音板。
*   **当前重点**：6月1日正式发布，启动日本市场拓客。

## 2. 核心文件说明 (Workspace Files)
*   `index.html`: 主落地页，集成 7 款产品。
*   `INTERNAL_OPERATIONS_GUIDE.md`: 内部底价、厂家链接及报价逻辑（**关键**）。
*   `QUOTATION_TEMPLATE_JA.md`: 给客户的正式报价单模版。
*   `CONSTRUCTION_GUIDE_JA.md`: 给日本工头的施工指南。
*   `COLD_EMAIL_TEMPLATE_JA.md`: 用于联系日本内装公司的开发信。
*   `LINE_AUTO_REPLY_GUIDE.md`: LINE 官方账号自动回复设置指南。
*   `AUTO_OUTREACH_PLAN.md`: 自动化获客及群发邮件方案（**核心自动化**）。
*   `DYNAMIC_PRICING_TOOL.md`: 动态调价与利润核算计算器（**新**）。
*   `pricing-system/kyoken-pricing-system-v0.1.md`: 当前报价体系，Alibaba.com 为出口报价主参考，1688 仅作中国内销底价辅助。
*   `SAMPLE_ACQUISITION_STRATEGY.md`: 样品获取计划，优先确认可出口供应商；1688 仅用于内销样品或材质参考。

## 3. 已完成的关键配置
*   **LINE ID**: `@566wlcvz` (已集成至所有网页和文档)。
*   **定价原则**: 不再使用“1688 + 固定系数”作为主报价。按 Alibaba.com 出口供应商报价、包装、国际运输、日本税费、日本国内配送、测量/安装和京建服务费综合核算。

## 4. 建议新 Agent 的第一步工作
1.  **验证链接**：检查 `index.html` 中的 LINE 链接是否在新环境下依然有效。
2.  **启动样品订单**：优先联系 Alibaba.com 或已确认可出口工厂获取样品；如使用 1688，仅作为内销样品/材质参考，不作为日本客户报价依据。
3.  **开始扫街**：通过 Google Maps 搜索日本各地的内装设计公司，发送 `COLD_EMAIL_TEMPLATE_JA.md`。
4.  **广告投放咨询**：如果用户预算允许，起草 Google Ads 投放计划。

---
**致接手的 Agent：请详细阅读 `INTERNAL_OPERATIONS_GUIDE.md`。这个项目目前资产完整度很高，接下来的核心目标是【获取第一笔订单】。加油！**
