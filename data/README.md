# 京建供应链记录数据

当前后台为项目内自定义后台，只服务供应链实景记录上传。

后台入口：

- `/admin/`

当前数据规则：

- 前台只读取一套索引：`data/records.json`。
- 不再使用 `data/supply-chain-records/` 逐条 JSON。
- 不再使用旧 `channel`、旧 today 记录、旧 fallback 数据。
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
