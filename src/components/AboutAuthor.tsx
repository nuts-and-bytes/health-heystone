"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "./Icons";

const CHEER_KEY = "health-heystone-cheers-v1";

const WHITELIST = [
  { org: "ISSN", name: "国际运动营养学会", scope: "蛋白质时机、补剂证据、咖啡因、减脂增肌立场声明" },
  { org: "ACSM", name: "美国运动医学会", scope: "抗阻训练、有氧处方、睡眠恢复、体成分与生病复训" },
  { org: "WHO", name: "世界卫生组织", scope: "身体活动指南、添加糖与 2023 非糖甜味剂指南" },
  { org: "ACOG", name: "美国妇产科医师学会", scope: "经期运动、痛经、经前综合征与产后恢复共识" },
  { org: "IOC", name: "国际奥委会医学委员会", scope: "运动相对能量不足（RED-S）与女性闭经/骨量共识" },
  { org: "AAD", name: "美国皮肤病学会", scope: "高 GI 饮食、乳制品与痤疮相关循证综述" },
  { org: "PubMed / Cochrane", name: "系统综述与荟萃分析", scope: "同行评审随机对照试验与高质量 Meta 分析" },
  { org: "中国营养学会", name: "《中国居民膳食指南》", scope: "符合中国饮食习惯的能量、蛋白质、钠与铁参考" },
];

export default function AboutAuthor() {
  const [cheers, setCheers] = useState(0);
  const [cheered, setCheered] = useState(false);
  const [copied, setCopied] = useState<"" | "email" | "wechat">("");

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(CHEER_KEY) || "0");
      if (saved > 0) setCheers(saved);
    } catch {}
  }, []);

  const handleCheer = () => {
    const next = cheers + 1;
    setCheers(next);
    setCheered(true);
    try {
      localStorage.setItem(CHEER_KEY, String(next));
    } catch {}
    setTimeout(() => setCheered(false), 1800);
  };

  const copyText = async (val: string, kind: "email" | "wechat") => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(kind);
      setTimeout(() => setCopied(""), 2000);
    } catch {}
  };

  return (
    <div className="space-y-10">
      {/* ① 关于我 & 为什么叫「懂点健康」 */}
      <section className="panel bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <BrandMark width={40} height={40} />
          <div>
            <p className="text-xs font-bold text-accent-dark">About · 关于「懂点健康」</p>
            <h1 className="font-display text-3xl text-ink sm:text-4xl">先懂一点靠谱的，心里就有数了</h1>
          </div>
        </div>

        <div className="mt-5 max-w-2xl space-y-3.5 text-[15px] leading-relaxed text-ink/90">
          <p>
            Hi，我是<strong>石头（朱鑫垚）</strong>。平时爱看书、听播客、去健身房，也喜欢遇到生活里的小麻烦时，拉着 AI 敲敲打打做成顺手的小工具。
          </p>
          <p>
            起名<strong>「懂点健康」</strong>，是因为我发现大多数人并不需要变成医学博士——我们常常只是卡在特别具体的生活瞬间：练完腿朋友喊去吃肯德基，吃了今天会不会白练？熬夜到两点，明早还该不该举铁？经期到底能不能练臀腿？
          </p>
          <p>
            去网上搜一圈，一边有人吓唬你「代谢毁了」，一边顺手甩过来一瓶补剂链接。干脆自己搭了这个小站：把平时听到的好播客、翻过的一线医学指南整理成大白话，留在这张敞着门的书桌上。不卖课、不带货，希望你每次拿不准的时候，来这儿翻两眼，就能少一点没必要的内耗。
          </p>
        </div>
      </section>

      {/* ② 这个站守死的三条红线（保留原则，但更轻巧好读） */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">这个小站守死的三条规矩</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="font-mono text-xs font-bold text-accent-dark">01 · 零商业带货</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              不推任何品牌、蛋白粉/补剂商品、减肥代餐或医美项目，全站无广告与返佣。只讲营养素和机制，不替任何商家说话。
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="font-mono text-xs font-bold text-red-700">02 · 零医疗诊断</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              不开药方、不给用药剂量、不替代医生面诊。遇到闭经、剧痛、胸闷晕厥或发热等信号，系统会自动提醒线下就医与参考科室。
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="font-mono text-xs font-bold text-emerald-800">03 · 敢说暂无定论</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              每条结论都标明证据等级和原始出处；学界目前还在争论的事，就老老实实写「暂无定论」，不装什么都懂。
            </p>
          </div>
        </div>
      </section>

      {/* ③ 唯一信源白名单 */}
      <section className="space-y-3 border-t border-line pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl text-ink">只认这些一线权威信源</h2>
          <Link href="/guide" className="text-xs font-bold text-accent-dark hover:underline">
            三步看懂医学研究证据 →
          </Link>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {WHITELIST.map((w) => (
            <div key={w.org} className="flex items-baseline gap-2.5 rounded-xl bg-white px-4 py-3 text-xs">
              <span className="shrink-0 font-mono font-extrabold text-accent-dark">{w.org}</span>
              <span className="text-ink-soft">
                <strong className="text-ink">{w.name}</strong> · {w.scope}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ④ 底部：鼓励作者 & 找到我（GitHub / 公众号 / 小红书 / 个人站 / 邮箱） */}
      <section className="panel space-y-6 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold text-accent-dark">鼓励一下作者</p>
            <h2 className="font-display mt-1 text-2xl text-ink">如果这里刚好帮你松了一口气</h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              这个小站完全免费、没有广告。点个小鼓励、去 GitHub 顺手点颗 Star，或者把定心丸图转给正在焦虑的朋友，就是对我最大的支持。
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCheer}
              className="btn !py-2.5 text-xs"
            >
              {cheered ? "收到你的鼓励啦 ✓" : `给石头点个鼓励${cheers > 0 ? ` (${cheers})` : ""}`}
            </button>
            <a
              href="https://github.com/nuts-and-bytes/health-heystone"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border-2 border-ink bg-white px-4 py-2.5 text-xs font-bold text-ink transition hover:bg-cream"
            >
              GitHub 点个 Star ↗
            </a>
          </div>
        </div>

        <div className="border-t border-line pt-5">
          <p className="text-xs font-bold text-ink-soft">在这些地方找到石头 · 随时来聊聊</p>
          <div className="mt-3 flex flex-wrap gap-2.5 text-xs font-bold">
            <a
              href="https://github.com/nuts-and-bytes"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-cream/50 px-3.5 py-2 text-ink transition hover:border-ink hover:bg-white"
            >
              GitHub · nuts-and-bytes ↗
            </a>

            <button
              type="button"
              onClick={() => copyText("AI 与一只松鼠", "wechat")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-accent/40 bg-accent-soft/60 px-3.5 py-2 text-accent-dark transition hover:border-ink"
              title="点击复制公众号名称，去微信搜索关注"
            >
              {copied === "wechat" ? "已复制公众号名 ✓ 去微信搜一搜" : "微信公众号 · AI 与一只松鼠（点此复制）"}
            </button>

            <a
              href="https://www.xiaohongshu.com/user/profile/zhuxinyao99"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-cream/50 px-3.5 py-2 text-ink transition hover:border-ink hover:bg-white"
            >
              小红书 · AI 与一只松鼠 ↗
            </a>

            <a
              href="https://heystone.site"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-cream/50 px-3.5 py-2 text-ink transition hover:border-ink hover:bg-white"
            >
              个人主页 · heystone.site ↗
            </a>

            <a
              href="https://blog.heystone.site"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-cream/50 px-3.5 py-2 text-ink transition hover:border-ink hover:bg-white"
            >
              独立博客 · stone ↗
            </a>

            <button
              type="button"
              onClick={() => copyText("zhuxinyao99@gmail.com", "email")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-line bg-cream/50 px-3.5 py-2 text-ink transition hover:border-ink hover:bg-white"
            >
              {copied === "email" ? "已复制邮箱 ✓" : "邮箱 · zhuxinyao99@gmail.com"}
            </button>

            <a
              href="https://t.me/ericlibro"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-cream/50 px-3.5 py-2 text-ink transition hover:border-ink hover:bg-white"
            >
              Telegram ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
