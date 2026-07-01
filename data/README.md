# Supply Chain Records / 今日供应链记录维护

This folder is the static content source for the home page "今日供应链 / 今日のサプライチェーン / Today's Supply Chain" section.

Edit `supply-chain-records.json` to add or update records.

## How to add photos or videos

1. Put the photo or video file in:

```text
media/remote/
```

Example:

```text
media/remote/2026-07-01-factory-packing.jpg
media/remote/2026-07-01-japan-site.mp4
```

2. Open:

```text
data/supply-chain-records.json
```

3. Add or edit one record.

For a photo:

```json
{
  "date": "2026.07.01",
  "slug": "2026-07-01",
  "image": "media/remote/2026-07-01-factory-packing.jpg",
  "video": "",
  "zh": {
    "label": "工厂包装",
    "title": "窗帘面料出货前包装确认",
    "summary": "确认卷装、标签、外箱和日本到场检查项目。",
    "details": ["确认外箱状态", "核对数量标签", "整理到场检查点"]
  }
}
```

For a video:

```json
{
  "date": "2026.07.01",
  "slug": "2026-07-01-site",
  "image": "media/remote/2026-07-01-japan-site-cover.jpg",
  "video": "media/remote/2026-07-01-japan-site.mp4"
}
```

If both `image` and `video` are empty, the page displays a temporary placeholder.

Fields:

- `date`: Display date, for example `2026.06.29`.
- `slug`: URL anchor, for example `2026-06-29`.
- `image`: Optional image path or URL. Use local paths such as `../media/remote/example.jpg` from language subpages only if you understand relative paths. External HTTPS image URLs are also accepted.
- `video`: Optional video path or URL. If present, the page renders a video player.
- `ja`, `en`, `zh`: Language-specific label, title, summary, and detail bullet points.

After editing:

```bash
node scripts/rebuild-v5.mjs
```

Then check the generated pages:

- `index.html`
- `en/index.html`
- `zh/index.html`
- `supply-chain-records.html`
- `en/supply-chain-records.html`
- `zh/supply-chain-records.html`
