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
- 中文要点
- 图片或视频

可选：

- 日文
- 英文

如果日文或英文暂时不填，生成脚本会临时使用中文内容兜底。第二阶段再接自动翻译，让你只填中文也能生成日文和英文。

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
