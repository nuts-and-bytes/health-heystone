# 懂点健康 · health.heystone.site

把生活里最常见的健康谣言、身体原理和长篇健康播客，做成**先站队再看证据**的交互式科普网站。

## 核心功能

| 路径 | 内容 |
| --- | --- |
| `/` | 首页大厅：选身份（上班族 / 在校生 / 中老年人 / 健身人群）、每日一案、主题入口、播客推荐 |
| `/court` | 谣言法庭：5 张卡一轮，拖动或按钮作答，翻牌看判决与来源 |
| `/body` | 身体百科：12 块真实医学解剖肌群图谱 + 12 位身体角色 + 橙线小人动画原理演示 |
| `/cases`、`/cases/[slug]` | 判决书档案室：40 篇已核验健康谣言深度解析、证据等级与权威来源 |
| `/guide` | 看懂证据：三步读懂健康研究证据等级 |
| `/podcasts` | 播客精读工作台：仿 SubCast 可拖拽全高三栏、简体逐字稿同步滚动、3:4「一图读懂」PNG 导出、整期逐字稿流式 AI 导读与多轮问答、跨页悬浮播放 |
| `/smash` | 谣言粉碎机：基于站内 40 份判决书核查任意健康说法 |

## 本地运行

```bash
npm install
cp .env.example .env.local   # 填入 OPENAI_API_KEY 开启流式 AI 导读与问答
npm run dev
```

## 部署到 Vercel 并绑定自定义域名（`health.heystone.site`）

1. 在 Vercel 导入本 GitHub 仓库（框架自动识别为 Next.js）。
2. 在 **Settings → Environment Variables** 填入：
   - `OPENAI_API_KEY`（你的 OpenAI API Key）
   - `OPENAI_MODEL`（默认 `gpt-4o-mini`）
3. 在 **Settings → Domains** 添加 `health.heystone.site`，按 Vercel 提示在域名 DNS 添加 `CNAME` 记录指向 `cname.vercel-dns.com` 即可自动签发 HTTPS 证书上线。
