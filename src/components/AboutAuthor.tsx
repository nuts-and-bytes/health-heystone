"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "./Icons";

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
  const [bubble, setBubble] = useState("逛累了坐会儿？投喂一颗小橘子试试 →");
  const [bounce, setBounce] = useState(false);
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
    setBounce(true);
    setBubble(TREAT_REPLIES[(nextO + nextC - 1) % TREAT_REPLIES.length]);
    try {
      localStorage.setItem(CHEER_KEY, JSON.stringify({ oranges: nextO, coffees: nextC }));
    } catch {}
    setTimeout(() => setBounce(false), 450);
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
            我是<strong>石头（朱鑫垚）</strong>，平时健身、看书、听播客，也喜欢把生活里的小麻烦做成顺手的小工具。
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

      {/* ③ 趣味互动：书桌前的「投喂小橙」鼓励区 */}
      <section className="space-y-5 border-t border-line pt-7">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-white px-5 py-6 sm:flex-row sm:items-center sm:px-7">
          {/* 互动小橙 SVG */}
          <div className={`shrink-0 transition-transform duration-300 ${bounce ? "-translate-y-2 scale-105" : ""}`}>
            <svg viewBox="0 0 150 120" className="h-28 w-36" fill="none" aria-hidden="true">
              <ellipse cx="75" cy="102" rx="54" ry="9" fill="#FED7AA" opacity="0.6" />
              {/* 小书桌 */}
              <line x1="22" y1="98" x2="128" y2="98" stroke="#1C1917" strokeWidth="2.2" strokeLinecap="round" />
              {/* 小笔记本电脑 */}
              <path d="M84 98 L94 74 L120 74 L112 98 Z" fill="#FAF8F4" stroke="#1C1917" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="105" cy="86" r="2.2" fill="#F97316" />
              {/* 桌上的小橘子 */}
              <circle cx="42" cy="90" r="8" fill="#F97316" stroke="#1C1917" strokeWidth="1.8" />
              <path d="M42 82 C43 78, 47 77, 48 79" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
              {/* 小橙戴耳机 */}
              <g>
                <animateTransform attributeName="transform" type="translate" values="0 0; 0 -2; 0 0" dur="2.2s" repeatCount="indefinite" />
                <path d="M52 44 C52 30, 80 30, 80 44" stroke="#1C1917" strokeWidth="2.8" strokeLinecap="round" />
                <rect x="48" y="40" width="5.5" height="10" rx="2.75" fill="#FED7AA" stroke="#1C1917" strokeWidth="1.6" />
                <rect x="78.5" y="40" width="5.5" height="10" rx="2.75" fill="#FED7AA" stroke="#1C1917" strokeWidth="1.6" />
                <circle cx="66" cy="46" r="12" fill="#F97316" />
                <path d="M61 45 Q63 42.5 65 45 M67 45 Q69 42.5 71 45" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M62 50 Q66 53.5 70 50" stroke="#1C1917" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M66 58 L66 84 M66 68 L84 82" stroke="#1C1917" strokeWidth="2.4" strokeLinecap="round" />
              </g>
            </svg>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="inline-block rounded-2xl bg-accent-soft/75 px-3 py-1.5 text-xs font-bold text-accent-dark">
              「{bubble}」
            </p>
            <p className="mt-2.5 text-xs leading-relaxed text-ink-soft">
              小站完全免费、没有广告。觉得有用就顺手投喂一下，或者去 GitHub 点颗 Star，就是给石头最大的续命咖啡。
            </p>
            <div className="mt-3.5 flex flex-wrap justify-center gap-2 sm:justify-start">
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
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-bold text-ink-soft">
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
