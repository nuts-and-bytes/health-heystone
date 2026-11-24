import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "内容准则与红线 · 懂点健康",
  description: "懂点健康的唯一信源白名单、证据分级体系，以及零商业带货、零医疗诊断两条不可违背的红线。",
};

const WHITELIST = [
  { org: "ISSN", name: "国际运动营养学会", scope: "蛋白质时机、补剂证据、咖啡因、减脂增肌营养立场声明" },
  { org: "ACSM", name: "美国运动医学会", scope: "抗阻训练、有氧处方、睡眠恢复、体成分与生病复训指南" },
  { org: "WHO", name: "世界卫生组织", scope: "全球身体活动指南、添加糖与 2023 非糖甜味剂指南、女性贫血数据" },
  { org: "ACOG", name: "美国妇产科医师学会", scope: "经期运动、痛经、经前综合征（PMS）与产后恢复临床建议" },
  { org: "IOC", name: "国际奥委会医学委员会", scope: "运动相对能量不足（RED-S）与女性运动闭经/骨量共识" },
  { org: "AAD", name: "美国皮肤病学会", scope: "高 GI 饮食、乳制品与痤疮相关的循证综述" },
  { org: "Cochrane / PubMed", name: "系统综述与荟萃分析", scope: "经同行评审的随机对照试验（RCT）与高质量 Meta 分析" },
  { org: "中国营养学会", name: "《中国居民膳食指南》", scope: "符合中国日常饮食习惯的能量、蛋白质、钠与铁摄入参考" },
];

const EVIDENCE_TIERS = [
  {
    level: "强证据",
    tone: "border-emerald-700/25 bg-emerald-50 text-emerald-800",
    desc: "有多项高质量随机对照试验（RCT）、系统综述或权威学会立场声明一致支持，结论高度稳固。",
  },
  {
    level: "中等证据",
    tone: "border-amber-700/25 bg-amber-50 text-amber-800",
    desc: "方向明确，但受个体差异或长期队列局限影响，实操时需结合个人体感灵活调整。",
  },
  {
    level: "有限证据",
    tone: "border-stone-400/50 bg-stone-100 text-stone-700",
    desc: "临床研究样本量有限或个体反应差异极大，我们只做客观呈现，绝不替你下死命令。",
  },
  {
    level: "学界尚无定论",
    tone: "border-ink/25 bg-white text-ink",
    desc: "目前科学界本身仍在争论。我们认为敢诚实说「暂无定论」，比装作什么都懂更值得信任。",
  },
];

export default function PrinciplesPage() {
  return (
    <div className="space-y-8">
      <section className="panel bg-white p-6 sm:p-8">
        <p className="text-xs font-bold tracking-wider text-accent-dark">懂点健康 · 编辑宪章</p>
        <h1 className="font-display mt-2 text-3xl text-ink sm:text-4xl">凭什么相信我们？先把红线亮在桌面上</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
          互联网上 90% 的健康流量靠制造焦虑来卖课、卖补剂或引流医美。「懂点健康」聚焦<strong>健身练吃</strong>与<strong>女性日常状态</strong>，只做一件事：在你纠结的那一刻，用一线权威证据帮你松一口气，并且守死下面三条底线。
        </p>
      </section>

      {/* 三条绝不妥协的红线 */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel bg-white p-5">
          <span className="inline-block rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-xs font-bold text-accent-dark">
            红线 01
          </span>
          <h2 className="font-display mt-2.5 text-2xl text-ink">零商业带货</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            不推荐任何具体品牌、蛋白粉/补剂商品、减肥代餐、医美项目或课程，全站无广告与返佣链接。只讲营养素与身体机制，告诉你「需不需要、怎么看配料表」。
          </p>
        </div>

        <div className="panel bg-white p-5">
          <span className="inline-block rounded-full bg-red-50 px-2.5 py-0.5 font-mono text-xs font-bold text-red-700">
            红线 02
          </span>
          <h2 className="font-display mt-2.5 text-2xl text-ink">零医疗与用药建议</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            不做疾病诊断，不推荐任何处方药、非处方药或保健品剂量，绝不替代线下医生。一旦涉及闭经、剧痛、胸闷晕厥、发热或皮肤/内分泌疾病，强制提示线下就医与参考科室。
          </p>
        </div>

        <div className="panel bg-white p-5">
          <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-800">
            红线 03
          </span>
          <h2 className="font-display mt-2.5 text-2xl text-ink">反焦虑、不装全知</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            不把偶尔一顿快餐、一次熬夜或生理期水肿渲染成「毁掉身材」。每条结论标明证据等级与原始出处；学界尚未定论的事，就坦诚写「目前尚无定论」。
          </p>
        </div>
      </section>

      {/* 唯一信源白名单 */}
      <section className="panel bg-white p-6 sm:p-7">
        <h2 className="font-display text-2xl text-ink">唯一信源白名单</h2>
        <p className="mt-1.5 text-sm text-ink-soft">
          本站所有高频纠结解答与谣言判决，只采信以下 8 类国际/国家一线权威医学与运动营养信源，不采信自媒体二手转述与商业软文：
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {WHITELIST.map((item) => (
            <div key={item.org} className="rounded-2xl border border-line bg-cream/40 p-3.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-sm font-extrabold text-accent-dark">{item.org}</span>
                <span className="text-xs font-bold text-ink">{item.name}</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{item.scope}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 证据分级 + AI 护栏 */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="panel bg-white p-6">
          <h2 className="font-display text-2xl text-ink">证据分级怎么看</h2>
          <div className="mt-4 space-y-3">
            {EVIDENCE_TIERS.map((t) => (
              <div key={t.level} className="flex items-start gap-3">
                <span className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold ${t.tone}`}>
                  {t.level}
                </span>
                <p className="text-xs leading-relaxed text-ink-soft">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel bg-white p-6">
          <h2 className="font-display text-2xl text-ink">AI 决策器的系统硬护栏</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            红线不只写在文案里，而是直接写进了我们 AI 问答接口的底层拦截与系统提示词：
          </p>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>问「买哪款蛋白粉/补剂/医美」→ 自动触发零带货提示，只拆解原理与配料表怎么看。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>问「闭经/胸闷/发烧/吃什么药」→ 自动弹出醒目就医红线与建议挂号科室，拒绝越界开方。</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>优先匹配站内已人工核验的 28 条高频纠结与 40 份判决书，严禁编造论文与数据。</span>
            </li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/" className="btn text-xs">
              回到「此刻纠结啥」→
            </Link>
            <Link
              href="/guide"
              className="rounded-xl border-2 border-line bg-cream px-3.5 py-2 text-xs font-bold text-ink transition hover:border-ink"
            >
              三步看懂医学研究证据 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
