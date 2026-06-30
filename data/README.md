# Supply Chain Records

This folder is the static content source for the home page "今日供应链 / 今日のサプライチェーン / Today's Supply Chain" section.

Edit `supply-chain-records.json` to add or update records.

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
