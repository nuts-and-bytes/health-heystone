import Link from "next/link";
import { EPISODES } from "@/data/podcasts";
import { getCase } from "@/data/cases";

export const metadata = { title: "播客推荐 · 健康谣言法庭" };

export default function Page() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">🎧 好播客，听了不白听</h1>
        <p className="mt-1 text-ink-soft">把一集 70 分钟的节目拆成一格格话题，挑你关心的那段去听。</p>
      </div>

      {EPISODES.map((ep) => (
        <section key={ep.id} className="space-y-5">
          <div className="panel grid gap-5 p-6 md:grid-cols-[auto_1fr]" style={{ background: "#efe6ff" }}>
            <div className="flex h-28 w-28 -rotate-3 items-center justify-center rounded-3xl border-[3px] border-ink bg-yellow text-6xl shadow-[5px_5px_0_var(--ink)]">🍍</div>
            <div>
              <p className="text-sm font-bold text-ink-soft">
                {ep.show} · {ep.vol} · {ep.minutes} 分钟
              </p>
              <h2 className="font-display mt-1 text-3xl leading-snug">{ep.title}</h2>
              <p className="mt-2">{ep.hook}</p>
              <p className="mt-3 text-sm text-ink-soft">
                🎙️ {ep.guest}
                <br />
                🎙️ {ep.host}
              </p>
              <a href={ep.url} target="_blank" rel="noreferrer" className="btn btn-purple mt-5">
                ▶ 去小宇宙收听
              </a>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {ep.sections.map((s, si) => (
              <div key={s.title} className="panel p-5" style={{ transform: `rotate(${si % 2 ? 0.6 : -0.6}deg)` }}>
                <h3 className="font-display text-2xl">
                  {s.emoji} {s.title}
                </h3>
                <ol className="mt-3 space-y-2">
                  {s.chapters.map((ch) => {
                    const c = ch.caseSlug ? getCase(ch.caseSlug) : undefined;
                    return (
                      <li key={ch.time} className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 rounded-md border-2 border-ink bg-cream px-1.5 font-mono text-xs font-bold">{ch.time}</span>
                        <span className="flex-1">
                          <span className="font-bold">{ch.title}</span>
                          {c && (
                            <Link href={`/cases/${c.slug}`} className="ml-2 inline-block rounded-full border-2 border-ink bg-yellow px-2 text-xs font-black transition hover:-translate-y-0.5">
                              ⚖️ 相关案件
                            </Link>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>

          <div className="panel-flat border-dashed bg-white/60 p-5 text-sm text-ink-soft">
            ⚖️ <b>AI 精华卡片筹备中：</b>拿到节目文字稿后，会用 AI 把每段提炼成观点卡片，经人工核对后再上线。目前列出的是节目官方的时间轴，「相关案件」是本站对同一话题整理的证据，不代表嘉宾原话。
          </div>
        </section>
      ))}

      <div className="panel p-6 text-center">
        <p className="font-display text-2xl">📮 还有哪档健康播客值得推荐？</p>
        <p className="mt-1 text-ink-soft">更多播客正在收集中。</p>
      </div>
    </div>
  );
}
