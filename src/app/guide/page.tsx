import Link from "next/link";
import { GLOSSARY } from "@/data/glossary";
import StickScene from "@/components/StickScene";

export const metadata = {
  title: "怎么看证据与专业词 · 健康谣言法庭",
  description: "用大白话和小人动画讲清楚 WHO、荟萃分析、随机对照试验、观察研究是什么意思。",
};

const LEVELS = [
  {
    rank: "第 4 级 · 最稳",
    title: "荟萃分析 / 权威指南",
    summary: "把几十项研究合在一起重新算，或者由世界卫生组织（WHO）、国家营养学会汇总几十年研究写出的官方建议。",
    why: "单篇研究容易跑偏，合在一起算才看得出大趋势。我们站里的大多数判决优先找这一级。",
  },
  {
    rank: "第 3 级 · 较稳",
    title: "随机对照试验（RCT）",
    summary: "用抽签把人公平分成「做」和「不做」两组，过几个月或几年再比结果。",
    why: "因为分组是随机的，最能说明「是不是这个做法本身起了作用」。",
  },
  {
    rank: "第 2 级 · 看趋势",
    title: "观察研究",
    summary: "不干预大家怎么活，只记录大家的习惯和后来发生的事（比如追踪几万人 10 年）。",
    why: "适合看长期习惯，但只能说「两件事常一起出现」，不能直接断定谁导致谁。",
  },
  {
    rank: "第 1 级 · 起点",
    title: "专家意见 / 立场声明",
    summary: "资深医生或专业学会结合现有知识和临床经验给出的判断。",
    why: "在还没法做大规模人体试验时很有参考价值，但后面如果有了更硬的数据，结论可能会更新。",
  },
];

export default function GuidePage() {
  return (
    <article className="mx-auto max-w-2xl space-y-12">
      <header className="space-y-3">
        <p className="text-xs font-bold text-accent-dark">新手必看 · 2 分钟读懂</p>
        <h1 className="font-display text-4xl text-ink sm:text-5xl">WHO、荟萃分析……这些词到底什么意思？</h1>
        <p className="text-[16px] leading-relaxed text-ink-soft">
          平时看健康科普，最烦的就是甩一堆看不懂的英文缩写和论文名词。这一页用大白话和小人动画，把本站用来判案的「证据尺子」讲明白。
        </p>
      </header>

      {/* 1. 证据四级 */}
      <section className="space-y-5 border-t border-line pt-8">
        <h2 className="font-display text-2xl text-ink">一、为什么有的证据更靠谱？</h2>
        <p className="text-[15.5px] text-ink-soft">
          「我二舅抽烟活到 90 岁」和「追踪 10 万人 20 年的结果」，份量完全不一样。医学界把证据从强到弱排了个序：
        </p>

        <ol className="space-y-4">
          {LEVELS.map((lv, i) => (
            <li key={lv.title} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-accent-dark">
                <span>{lv.rank}</span>
                <span className="h-1 w-1 rounded-full bg-accent" />
                <span>{4 - i} 格绿条</span>
              </div>
              <h3 className="font-display mt-1 text-2xl text-ink">{lv.title}</h3>
              <p className="mt-2 text-[15px] text-ink">{lv.summary}</p>
              <p className="mt-1.5 text-sm text-ink-soft">{lv.why}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 2. 两个动画演示最难懂的词 */}
      <section className="space-y-6 border-t border-line pt-8">
        <h2 className="font-display text-2xl text-ink">二、看两段小人动画，秒懂核心词</h2>

        <div>
          <h3 className="font-bold text-ink">什么是「荟萃分析」？</h3>
          <p className="mt-1 text-sm text-ink-soft">把许多独立小研究的数据收拢叠在一起重新算，得出更稳的大结论。</p>
          <StickScene
            scene="meta-stack"
            caption="小人把 5 份散落的小研究合在一起，升起一份更稳的综合结论。"
            play="view"
            height={230}
          />
        </div>

        <div>
          <h3 className="font-bold text-ink">什么是「随机对照试验」？</h3>
          <p className="mt-1 text-sm text-ink-soft">先用抽签公平分组，一组做、一组不做，再比结果——排除「本来就更健康」的干扰。</p>
          <StickScene
            scene="rct-lottery"
            caption="摇动橙色抽签盒随机分成两组，对比「做」和「不做」的差别。"
            play="view"
            height={230}
          />
        </div>
      </section>

      {/* 3. 大白话词典 */}
      <section className="space-y-4 border-t border-line pt-8">
        <h2 className="font-display text-2xl text-ink">三、站里常见词大白话速查</h2>
        <p className="text-sm text-ink-soft">在案件正文里，看到带橙色虚线的词直接点一下也会弹出这里的解释。</p>
        <dl className="divide-y divide-line">
          {GLOSSARY.map((item) => (
            <div key={item.key} className="py-4">
              <dt className="font-bold text-ink">{item.title}</dt>
              <dd className="mt-1 text-[15px] text-ink-soft">{item.short}</dd>
              <dd className="mt-1 text-sm text-ink-soft/90">{item.detail}</dd>
              <dd className="mt-2 text-sm text-accent-dark">打个比方：{item.analogy}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        <Link href="/court" className="btn">
          ⚖️ 懂了，去法庭审案
        </Link>
        <Link href="/cases" className="btn btn-white">
          📚 翻翻全部 25 案
        </Link>
      </div>
    </article>
  );
}
