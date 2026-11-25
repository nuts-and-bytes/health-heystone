import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DILEMMAS, DILEMMA_VERDICT_META, TRACK_META, getDilemma } from "@/data/dilemmas";
import DilemmaShareCard from "@/components/DilemmaShareCard";

export function generateStaticParams() {
  return DILEMMAS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDilemma(slug);
  if (!d) return { title: "未找到该纠结 · 懂点健康" };
  return {
    title: `${d.shortTag} · 懂点健康`,
    description: `${d.verdictLabel}：${d.reassurance}`,
    openGraph: {
      title: `${d.question} — 懂点健康`,
      description: `${d.verdictLabel}：${d.reassurance}`,
      type: "article",
    },
  };
}

export default async function DilemmaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDilemma(slug);
  if (!d) notFound();

  const meta = DILEMMA_VERDICT_META[d.verdict];
  const related = DILEMMAS.filter((x) => x.track === d.track && x.slug !== d.slug).slice(0, 4);
  const issueUrl = `https://github.com/nuts-and-bytes/health-heystone/issues/new?title=${encodeURIComponent(
    `[纠错/补充] ${d.shortTag}`
  )}&body=${encodeURIComponent(`页面：https://health.heystone.site/d/${d.slug}\n\n想补充的权威论文或纠错说明：\n`)}`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <Link href="/" className="font-bold text-ink-soft hover:text-ink">
          ← 返回「此刻你在纠结什么？」
        </Link>
        <Link href="/about" className="font-bold text-accent-dark hover:underline">
          零带货 · 零诊疗 · 关于我们与红线 →
        </Link>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* 左栏：完整循证拆解 */}
        <article className="panel space-y-5 bg-white p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-bold text-ink-soft">
              {TRACK_META[d.track].label}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${meta.tone}`}>
              {meta.badge}
            </span>
            <span className="rounded-full border border-line bg-white px-2.5 py-0.5 font-mono text-[11px] font-bold text-ink-soft">
              {d.evidenceLevel}
            </span>
          </div>

          <h1 className="font-display text-2xl leading-snug text-ink sm:text-3xl">{d.question}</h1>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-cream/45 p-3.5">
              <p className="text-[11px] font-bold text-ink-soft">评论区常见焦虑说法</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">「{d.debate.sideA}」</p>
            </div>
            <div className="rounded-2xl border border-line bg-cream/45 p-3.5">
              <p className="text-[11px] font-bold text-ink-soft">评论区另一派体感</p>
              <p className="mt-1 text-sm leading-relaxed text-ink">「{d.debate.sideB}」</p>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-ink bg-accent-soft/45 p-4">
            <p className="text-xs font-bold text-accent-dark">① 一句话定心丸 · {d.verdictLabel}</p>
            <p className="mt-1 text-base font-bold leading-relaxed text-ink">{d.reassurance}</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="text-xs font-bold text-ink-soft">② 身体到底发生了什么</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/90">{d.science}</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="text-xs font-bold text-accent-dark">③ 此刻最省心的做法（零商业带货）</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/90">{d.actionNow}</p>
            </div>
          </div>

          {d.redLine && (
            <div className="rounded-2xl border border-red-200 bg-red-50/85 px-4 py-3 text-xs leading-relaxed text-red-900">
              <span className="font-bold">安全与就医红线：</span>
              {d.redLine}
            </div>
          )}

          <div className="space-y-2 border-t border-line pt-4">
            <p className="text-xs font-bold text-ink-soft">权威信源（白名单）</p>
            <ul className="space-y-1.5 text-xs text-ink">
              {d.sources.map((s, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-1.5">
                  <span className="font-mono font-extrabold text-accent-dark">{s.org} ({s.year})</span>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-line hover:decoration-ink">
                      {s.title} ↗
                    </a>
                  ) : (
                    <span className="text-ink-soft">{s.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-cream/60 px-4 py-3 text-xs text-ink-soft">
            <span>发现表述有误或有更新的系统综述？欢迎帮我们把关：</span>
            <a href={issueUrl} target="_blank" rel="noreferrer" className="font-bold text-accent-dark hover:underline">
              提交纠错 / 补充论文 ↗
            </a>
          </div>
        </article>

        {/* 右栏：3:4 定心丸分享卡一键保存 */}
        <aside className="panel bg-white p-5">
          <p className="mb-3 text-xs font-bold text-ink-soft">发给健身搭子、闺蜜群或配图发小红书</p>
          <DilemmaShareCard dilemma={d} />
        </aside>
      </div>

      {/* 同专题更多纠结 */}
      <section className="space-y-3 border-t border-line pt-6">
        <h2 className="font-display text-2xl text-ink">同类高频纠结</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/d/${item.slug}`}
              className="rounded-2xl border border-line bg-white p-4 transition hover:border-ink"
            >
              <p className="text-xs font-bold text-accent-dark">{item.verdictLabel}</p>
              <p className="mt-1 text-sm font-bold text-ink">{item.question}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
