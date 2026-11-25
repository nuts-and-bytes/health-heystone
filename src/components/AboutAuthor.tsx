"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "./Icons";
import StickScene from "./StickScene";

const CHEER_KEY = "health-heystone-cheers-v2";

const TREAT_REPLIES = [
  "咔嚓一口小橘子，精力回满，继续帮你翻论文！",
  "咕嘟咕嘟喝完虚拟冰美式——这杯算零卡，放心！",
  "收到投喂！小橙举着哑铃向你比了个心。",
  "谢谢鼓励，今晚一定早睡，不熬夜写代码。",
];

const WHITELIST = [
  "ISSN 国际运动营养学会",
  "ACSM 美国运动医学会",
  "WHO 世界卫生组织",
  "ACOG 美国妇产科医师学会",
  "IOC 国际奥委会（RED-S）",
  "AAD 美国皮肤病学会",
  "PubMed / Cochrane",
  "《中国居民膳食指南》",
];

export default function AboutAuthor() {
  const [oranges, setOranges] = useState(0);
  const [coffees, setCoffees] = useState(0);
  const [triggerKey, setTriggerKey] = useState(0);
  const [bubble, setBubble] = useState("点下面投喂，或者直接戳画布里的小人互动 →");
  const [copied, setCopied] = useState<"" | "email" | "wechat">("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CHEER_KEY) || "{}");
      if (saved.oranges) setOranges(saved.oranges);
      if (saved.coffees) setCoffees(saved.coffees);
    } catch {}
  }, []);

  const feed = (kind: "orange" | "coffee") => {
    const nextO = kind === "orange" ? oranges + 1 : oranges;
    const nextC = kind === "coffee" ? coffees + 1 : coffees;
    setOranges(nextO);
    setCoffees(nextC);
    setTriggerKey((k) => k + 1);
    setBubble(TREAT_REPLIES[(nextO + nextC - 1) % TREAT_REPLIES.length]);
    try {
      localStorage.setItem(CHEER_KEY, JSON.stringify({ oranges: nextO, coffees: nextC }));
    } catch {}
  };

  const copyText = async (val: string, kind: "email" | "wechat") => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(kind);
      setTimeout(() => setCopied(""), 2000);
    } catch {}
  };

  return (
    <div className="mx-auto max-w-2xl space-y-11 py-2">
      {/* ① 极简自我介绍（无大卡片，像书扉页的作者小传） */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <BrandMark width={38} height={38} />
          <div>
            <p className="text-xs font-bold text-accent-dark">About · 懂点健康</p>
            <h1 className="font-display text-3xl text-ink sm:text-4xl">先懂一点靠谱的，心里就有数了</h1>
          </div>
        </div>

        <div className="space-y-2.5 text-[15px] leading-relaxed text-ink/90">
          <p>
            我是<strong>石头（Xinyao）</strong>，平时健身、看书、听播客，也喜欢把生活里的小麻烦做成顺手的小工具。
          </p>
          <p>
            普通人不用变成医学博士——只要在「练完吃不吃」「经期能不能练」这些瞬间，手里有一点靠谱的依据，少一点没必要的内耗，就是我做「懂点健康」的全部初衷。
          </p>
        </div>
      </section>

      {/* ② 三条小站规矩：纯文字排版 + 细横线（零卡片） */}
      <section className="space-y-4 border-t border-line pt-7">
        <h2 className="font-display text-2xl text-ink">小站死守的三条规矩</h2>
        <ol className="divide-y divide-line text-sm">
          <li className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="w-28 shrink-0 font-mono text-xs font-extrabold text-accent-dark">01 · 零商业带货</span>
            <p className="text-ink-soft">不推任何品牌、蛋白粉/补剂商品、代餐或医美项目，全站无广告与返佣，只讲营养素与机制。</p>
          </li>
          <li className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="w-28 shrink-0 font-mono text-xs font-extrabold text-red-700">02 · 零医疗诊断</span>
            <p className="text-ink-soft">不开药、不给用药剂量、不替代医生。涉及闭经、剧痛、胸闷晕厥或发热，系统强制提示线下就医。</p>
          </li>
          <li className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="w-28 shrink-0 font-mono text-xs font-extrabold text-emerald-800">03 · 敢说暂无定论</span>
            <p className="text-ink-soft">每条结论只引一线权威信源；学界还在争论的问题就坦诚写「暂无定论」，不装全知。</p>
          </li>
        </ol>

        <div className="pt-1 text-xs leading-relaxed text-ink-soft">
          <span className="font-bold text-ink">唯一信源白名单：</span>
          {WHITELIST.join(" · ")}
          {" · "}
          <Link href="/guide" className="font-bold text-accent-dark hover:underline">
            如何看懂证据 →
          </Link>
        </div>
      </section>

      {/* ③ 趣味互动：统一手绘橙线 <stick-scene> 书桌投喂互动 */}
      <section className="space-y-5 border-t border-line pt-7">
        <div className="grid items-center gap-5 sm:grid-cols-[0.95fr_1.05fr]">
          <StickScene
            scene="about-desk-stone"
            caption="戳小人或点右侧按钮投喂一颗小橘子"
            play="click"
            height={186}
            compact
            triggerKey={triggerKey}
          />

          <div className="space-y-3">
            <p className="inline-block rounded-2xl bg-accent-soft/75 px-3 py-1.5 text-xs font-bold text-accent-dark">
              「{bubble}」
            </p>
            <p className="text-xs leading-relaxed text-ink-soft">
              小站完全免费、没有广告。觉得有用就顺手投喂一下，或者去 GitHub 点颗 Star，就是给石头最大的续命咖啡。
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => feed("orange")}
                className="btn !py-2 text-xs"
              >
                投喂小橘子{oranges > 0 ? ` ×${oranges}` : ""}
              </button>
              <button
                type="button"
                onClick={() => feed("coffee")}
                className="cursor-pointer rounded-xl border-2 border-ink bg-white px-3.5 py-2 text-xs font-bold text-ink transition hover:bg-cream"
              >
                请杯虚拟冰美式{coffees > 0 ? ` ×${coffees}` : ""}
              </button>
              <a
                href="https://github.com/nuts-and-bytes/health-heystone"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-line bg-cream px-3.5 py-2 text-xs font-bold text-ink-soft transition hover:border-ink hover:text-ink"
              >
                GitHub Star ↗
              </a>
            </div>
          </div>
        </div>

        {/* 极简一行文字联系方式（无卡片） */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs font-bold text-ink-soft">
          <a href="https://github.com/nuts-and-bytes" target="_blank" rel="noreferrer" className="hover:text-ink">
            GitHub ↗
          </a>
          <button
            type="button"
            onClick={() => copyText("AI 与一只松鼠", "wechat")}
            className="cursor-pointer text-accent-dark hover:underline"
          >
            {copied === "wechat" ? "已复制公众号：AI 与一只松鼠 ✓" : "公众号：AI 与一只松鼠（点此复制）"}
          </button>
          <a href="https://www.xiaohongshu.com/user/profile/zhuxinyao99" target="_blank" rel="noreferrer" className="hover:text-ink">
            小红书 ↗
          </a>
          <a href="https://heystone.site" target="_blank" rel="noreferrer" className="hover:text-ink">
            heystone.site ↗
          </a>
          <a href="https://blog.heystone.site" target="_blank" rel="noreferrer" className="hover:text-ink">
            独立博客 ↗
          </a>
          <button
            type="button"
            onClick={() => copyText("zhuxinyao99@gmail.com", "email")}
            className="cursor-pointer hover:text-ink"
          >
            {copied === "email" ? "已复制邮箱 ✓" : "zhuxinyao99@gmail.com"}
          </button>
        </div>
      </section>
    </div>
  );
}
