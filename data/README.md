# 京建供应链记录数据

当前后台为项目内自定义后台，只服务供应链实景记录上传。

后台入口：

- `/admin/`

当前数据规则：

- 前台只读取一套索引：`data/records.json`。
- 不再使用 `data/supply-chain-records/` 逐条 JSON。
- 不再使用旧 today 记录、旧 fallback 数据；`channel` 表示 factory 下的材料品类，不是工厂身份。
- 媒体文件保存在 `media/records/<module>/<record-id>/`。
- 一次发布必须同时提交媒体文件和 `data/records.json`。
- 前台只有两个记录模块：`factory` 与 `site`。

标准记录格式：

```json
{
  "id": "advertising-factory-20260705",
  "module": "factory",
  "title": "广告材料制作工厂",
  "summary": "广告材料制作、出货前确认、包装状态记录。",
  "createdAt": "2026-07-05T00:00:00+09:00",
  "media": [
    "/media/records/factory/advertising/example.jpg"
  ],
  "i18n": {
    "ja": {
      "title": "広告材料制作工場",
      "summary": "広告材料制作、出荷前確認、包装状態の記録。"
    },
    "zh": {
      "title": "广告材料制作工厂",
      "summary": "广告材料制作、出货前确认、包装状态记录。"
    },
    "en": {
      "title": "Advertising Material Production Factory",
      "summary": "Advertising material production, pre-shipment check, and packing status record."
    }
  }
}
```

后台发布逻辑：

1. 登录 GitHub。
2. 选择前台模块。
3. 填写标题和可选说明。
4. 一次选择多张图片或小视频。
5. 图片在浏览器本地压缩。
6. 后台创建一个 Git commit，同时包含媒体文件和 `data/records.json`。
7. Vercel 根据 GitHub 提交自动部署。

视频规则：

- 建议使用小 MP4 / WebM。
- 手机 MOV 先转 MP4。
- 大视频不要直接上传到 GitHub。

## 记录展示与新建规则 v1.0（2026-10-09）

- 同品类可保留多条独立记录，不因标题相同自动合并。
- 首页及实景页的工厂记录使用同一生成函数，日/中/英均显示 `createdAt` 对应的日本时间日期；同日多条用记录序号区分。
- “记录日期”不代表拍摄、生产或完工日期。历史日期保留原值；新建日期由服务端生成。
- 给已有记录追加照片：选择该记录的“编辑图片”，使用已有追加媒体流程。
- 新建同品类独立记录：后台先提示确认，服务端也要求 `confirmSeparateRecord: true`。取消不会上传照片；旧客户端未确认会收到 409。
- 已存在的 ID 不能用 publish 覆盖；追加仍使用 update-media。原有登录、CSRF、媒体路径和非强制 Git 更新保护保留。
- 来源核查及本次保留决定见 `record-review-v1.0.md`。
