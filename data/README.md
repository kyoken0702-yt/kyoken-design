# 京建供应链记录数据

当前后台不再使用 Decap CMS。

后台入口：

- `/admin/`

当前数据规则：

- 每条记录一个 JSON 文件。
- 文件位置：`data/supply-chain-records/`
- 媒体文件位置：`media/records/factory/` 或 `media/records/site/`
- 前台只读取 `media` 数组。
- 不再读取旧字段 `image`、`video`、`images`。

标准记录格式：

```json
{
  "category": "factory",
  "slug": "advertising-material-factory",
  "title": "广告材料制作工厂",
  "date": "2026.07.05",
  "showOnHome": true,
  "media": [
    "/media/records/factory/example.jpg"
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
2. 填写三语大标题。
3. 选择模块：`factory` 或 `site`。
4. 一次选择多张图片或小视频。
5. 后台把媒体提交到 GitHub。
6. 后台创建一条 JSON 记录。
7. Vercel 根据 GitHub 提交自动部署。

视频规则：

- 建议使用小 MP4 / WebM。
- 手机 MOV 先转 MP4。
- 大视频不要直接上传到 GitHub。

前台排序：

- 按记录文件名倒序。
- 新后台生成文件名格式：`YYYY-MM-DD-YYYYMMDDHHMMSS-slug.json`。
