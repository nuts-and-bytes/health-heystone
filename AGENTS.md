<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 懂点健康 · 内容与动画铁律

1. **每道决策题必须定制专属 `<stick-scene>` 互动动画**
   - 凡新增进入 `src/data/dilemmas.ts` 的决策题，必须对应一套专属的手绘橙线可交互场景（`public/scenes/*.js`），并在 `src/components/DilemmaVisual.tsx` 的 `SCENE_MAP` 中完成绑定。
   - 动画必须遵循本站 `window.STICK` / `window.RIG` 视觉规范（黑色手绘细线 `#1c1917` + 点阵白纸底 + 胸口唯一橙点 `#F97316` + 静止轻呼吸、点击触发完整场景交互），禁止使用通用静态卡通图或一套动画敷衍多类不相关场景。
   - 3:4「定心丸分享卡」同步展示并导出该题专属手绘小人场景。
2. **三色状态点语义统一**
   - 绿点（`ok`）：放心 · 别焦虑
   - 琥珀/黄点（`adjust`）：看情况 · 换个做法
   - 红点（`stop`）：别硬扛 · 注意红线
3. **双红线与信源白名单**
   - 严守「零商业带货」（不推品牌、补剂、医美、课程）与「零医疗诊断及用药建议」；
   - 结论仅采信白名单一线信源（ISSN / ACSM / WHO / ACOG / IOC / AAD / PubMed-Cochrane /《中国居民膳食指南》）。

