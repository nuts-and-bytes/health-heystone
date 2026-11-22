# 健康谣言法庭 · health.heystone.site

先站队，再看证据。把生活里常见的健康谣言送上「法庭」，每条判决都附权威来源。玩法参考多邻国：滑卡答题、经验值、连续天数、红心、吉祥物反应。

## 本地运行

```bash
npm install
cp .env.example .env.local   # 可选：填 GEMINI_API_KEY 或 OPENAI_API_KEY 打开 AI 回答
npm run dev
```

## 页面

| 路径 | 内容 |
| --- | --- |
| `/` | 大厅：选身份（上班族 / 在校生 / 中老年人 / 健身人群）、专属卷宗、每日一案漫画、主题入口、播客推荐 |
| `/court` | 谣言法庭：5 张卡一轮，拖动或按钮作答，翻牌看判决 |
| `/quiz` | 段位测验：10 题，结果给出常识段位 |
| `/cases`、`/cases/[slug]` | 判决书档案室，可按主题和人群筛选；详情页三格漫画 + 证据等级 + 来源 |
| `/body` | 身体地图，点部位看相关谣言 |
| `/advice` | 「最低有效剂量」翻面卡，按人群分组 |
| `/podcasts` | 播客推荐（菠萝健康派 vol.131 时间轴 + 相关案件） |
| `/smash` | 谣言粉碎机：只依据站内判决书回答；没匹配的说法记入 `data/pending.jsonl` |

## 内容在哪改

- 谣言案件：`src/data/cases.ts`（判决、要点、证据等级、来源、核验状态、关键词）
- 人群与建议卡：`src/data/audiences.ts`
- 播客：`src/data/podcasts.ts`

`verified: false` 的案件会在详情页显示「来源复核中」，上线前需逐条核对原文。

## 技术栈记录

| 项 | 选择 | 说明 |
| --- | --- | --- |
| 框架 | Next.js 16（App Router） | |
| 样式 | Tailwind v4 + `globals.css` 设计变量 | `.panel` 漫画格、`.btn` 多邻国厚按钮、`.stamp` 判决印章、`.bubble` 对话框 |
| 动画 | Motion | 拖拽卡片、翻牌、印章、数字跳动 |
| 庆祝 | canvas-confetti | 答对撒彩纸，尊重 `prefers-reduced-motion` |
| 音效 | Web Audio 合成 | 顶栏可静音 |
| UI 组件底座 | 暂未引入 | 目前没有弹层 / 下拉 / 选择器类需求；需要时按 ui-component-stack 引入 Coss UI（Base UI），不要手写这类控件 |
| 字体 | 标题得意黑（OFL，中文网字计划切片 CDN）+ 正文 Noto Sans SC（`next/font/google`） | 上线前把得意黑改为自托管切片 |
| 插画 | AI 生成：肌肉法官吉祥物 4 种表情 + 4 张主题图 | `public/illustrations/` |
| 状态 | localStorage（`src/lib/game.ts`） | 经验值、连续天数、红心、已答案件、身份 |

## 上线前待办

- [ ] 复核 `verified: false` 的 3 条来源（女生练力量、味精、力竭训练）
- [ ] 得意黑改为自托管
- [ ] 粉碎机待审卷宗改为写数据库（Serverless 环境无法写文件）
- [ ] 播客文字稿 → AI 精华卡片（人工审核后上线）
- [ ] 绑定 `health.heystone.site` 域名
