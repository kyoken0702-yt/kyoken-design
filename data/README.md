# 京建供应链记录数据

当前后台为项目内自定义后台，只服务供应链实景记录上传。

后台入口：

- `/admin/`

当前数据规则：

- 每条记录一个 JSON 文件。
- 文件位置：`data/supply-chain-records/`
- 工厂侧媒体文件位置：`media/records/factory/advertising/`、`media/records/factory/curtain/`、`media/records/factory/wpc/`
- 日本现场媒体文件位置：`media/records/site/`
- 前台只读取 `media` 数组。
- 不再读取旧字段 `image`、`video`、`images`。
- 工厂侧必须写 `channel`，只允许 `advertising`、`curtain`、`wpc`。
- 前台工厂侧显示顺序固定为：广告材料制作工厂 → 窗帘加工制作工厂 → 塑木板材料工厂。
- 每个通道内部按记录时间倒序显示。

标准记录格式：

```json
{
  "category": "factory",
  "channel": "advertising",
  "slug": "advertising-material-factory",
  "title": "广告材料制作工厂",
  "date": "2026.07.05",
  "createdAt": "2026-07-05T00:00:00+09:00",
  "showOnHome": true,
  "media": [
    "/media/records/factory/advertising/example.jpg"
  ],
  "zh": {
    "title": "广告材料制作工厂"
  },
  "ja": {
    "title": "広告材料制作工場"
  },
  "en": {
    "title": "Advertising Material Production Factory"
  }
}
```

后台发布逻辑：

1. 登录 GitHub。
2. 选择前台模块。
3. 工厂侧选择材料上传通道：广告材料制作工厂、窗帘加工制作工厂、塑木板材料工厂。
4. 后台自动填写三语大标题，也可以手动修改。
5. 一次选择多张图片或小视频。
6. 后台把媒体提交到 GitHub。
7. 后台创建一条 JSON 记录。
8. Vercel 根据 GitHub 提交自动部署。

视频规则：

- 建议使用小 MP4 / WebM。
- 手机 MOV 先转 MP4。
- 大视频不要直接上传到 GitHub。

前台排序：

- 工厂侧先按固定材料通道排序。
- 同一材料通道内部按记录文件名倒序。
- 日本现场记录按记录文件名倒序。
- 新后台生成文件名格式：`YYYY-MM-DD-YYYYMMDDHHMMSS-slug.json`。
