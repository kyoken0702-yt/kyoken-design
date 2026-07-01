# Supply Chain Records / 今日供应链记录维护

第一阶段目标：先跑通“你可以自己上传照片、填写记录、保存到网站仓库”。

后台入口：

```text
https://www.kyoken.design/admin/
```

本阶段使用 Decap CMS。后台保存后会在 GitHub 仓库中新增或修改：

```text
data/supply-chain-records/*.json
media/records/*
```

Vercel 构建时会运行：

```bash
node scripts/rebuild-v5.mjs
```

然后自动更新：

```text
index.html
en/index.html
zh/index.html
supply-chain-records.html
en/supply-chain-records.html
zh/supply-chain-records.html
```

## 后台填写规则

必填：

- 日期
- 栏目
- 产品
- 中文标题
- 中文摘要
- 日文标题
- 日文摘要
- 英文标题
- 英文摘要

可选：

- 图片或视频
- 各语种要点

后台不接浏览器翻译插件，三种语言人工填写。这样可以避免日文页混入中文、英文页混入中文的问题。

如果日文或英文漏填，生成脚本只会显示对应语种的“准备中”文案，不会用中文内容兜底。

## 图片和视频

后台上传文件会进入：

```text
media/records/
```

建议文件名：

```text
2026-07-01-curtain-packing.jpg
2026-07-01-factory-video.mp4
```

## 本地手动维护方式

如果不用后台，也可以直接新增一个 JSON 文件：

```text
data/supply-chain-records/2026-07-01-curtain-packing.json
```

示例：

```json
{
  "title": "窗帘面料出货前包装确认",
  "date": "2026.07.01",
  "slug": "2026-07-01-curtain-packing",
  "category": "today",
  "product": "curtain",
  "showOnHome": true,
  "image": "media/records/2026-07-01-curtain-packing.jpg",
  "video": "",
  "zh": {
    "label": "工厂包装",
    "title": "窗帘面料出货前包装确认",
    "summary": "确认卷装、标签、外箱和日本到场检查项目。",
    "details": ["确认外箱状态", "核对数量标签", "整理到场检查点"]
  },
  "ja": {
    "label": "工場梱包",
    "title": "カーテン生地の出荷前梱包確認",
    "summary": "ロール梱包、ラベル、外箱、日本到着後の確認項目を整理しました。",
    "details": ["外箱状態を確認", "数量ラベルを照合", "到着後の確認項目を整理"]
  },
  "en": {
    "label": "Factory Packing",
    "title": "Curtain fabric packing check before shipment",
    "summary": "Roll packing, labels, cartons, and arrival check points were confirmed.",
    "details": ["Checked carton condition", "Matched quantity labels", "Prepared arrival check points"]
  }
}
```

本地生成：

```bash
npm run build
```

注意：后台登录需要 GitHub/Decap CMS 的授权配置可用。代码入口已经准备好；如果线上打开 `/admin/` 后提示认证问题，下一步只处理登录授权，不改网站业务结构。

## 后台登录授权

GitHub OAuth App 需要填写：

```text
Homepage URL:
https://www.kyoken.design

Authorization callback URL:
https://www.kyoken.design/api/callback
```

Vercel 项目环境变量需要填写：

```text
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

不要把 Client Secret 写进代码、文档或聊天记录。只在 Vercel 项目 Environment Variables 页面填写。
