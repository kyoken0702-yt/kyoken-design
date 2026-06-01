# 京建自动增长引擎执行方案 (Kyoken Growth Automation Plan)
**目标：实现“搜索 -> 提取 -> 触达 -> 管理”的半自动化闭环**

---

## 阶段 1：主动获客自动化 (Outbound Automation)
利用脚本代替人工搜索。

### 1.1 客户搜索与提取 (Searching & Scraping)
*   **工具**：Accio `browser` 代理 或 Google Maps API。
*   **逻辑**：
    1.  搜索关键词：`「内装工事 东京」`, `「店舗設計 大阪」`, `「リフォーム 会社」`。
    2.  提取字段：公司名、官网 URL、Email、电话。
*   **操作建议**：让 Accio Sub-agent 每周运行一次此任务，并将结果更新至 `LEAD_MANAGEMENT.md`。

### 1.2 自动开发信投递 (Email Outreach)
*   **工具**：Accio `bash` + `accio-mcp-cli toolkit gmail`。
*   **逻辑**：
    1.  读取 `LEAD_MANAGEMENT.md` 中“未联系”的名单。
    2.  调用 `COLD_EMAIL_TEMPLATE_JA.md` 模板。
    3.  通过您的 Gmail 自动发送，并标注状态为“已联系”。

---

## 阶段 2：被动获客自动化 (Inbound Automation)
将网站变为自动采集器。

### 2.1 线索捕获表单 (Lead Capture Form)
*   **实施**：在 `index.html` 底部增加一个表单。
*   **后端连接**：使用免费的 `Formspree` 或 `Google Forms` 接收数据。
*   **自动回复**：设置表单提交后的自动感谢邮件，附件直接带上 `BUSINESS_PROPOSAL_JA.md`。

---

## 阶段 3：运营管理自动化 (CRM & Follow-up)
*   **定时检查**：使用 `cron` 工具。
    *   `0 9 * * 1-5`: 每个工作日早上 9 点提醒检查前一天的邮件回复。
*   **自动分类**：如果邮件中包含“見積”或“サンプル”，自动在管理表中将其标记为“高意向”。

---
**接手的 Agent 请注意：优先协助用户调通 Gmail API 权限，以实现第一批 50 封开发信的自动投递。**
