export interface GlossaryTerm {
  key: string;
  aliases?: string[];
  title: string;
  short: string;
  detail: string;
  analogy: string;
  scene?: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    key: "WHO",
    aliases: ["世界卫生组织"],
    title: "WHO（世界卫生组织）",
    short: "联合国管全球健康的权威机构。",
    detail: "它会召集全世界各领域专家，把过去几十年最扎实的研究汇总起来，每隔几年发布一份通用健康指南（比如运动量、饮酒、代糖）。",
    analogy: "相当于全球健康界的「国家队教材」，不靠单篇论文下结论，只认反复验证过的共识。",
  },
  {
    key: "荟萃分析",
    title: "荟萃分析（Meta-analysis）",
    short: "把几十项独立研究的数据合在一起重新算一遍。",
    detail: "单篇研究样本小、容易偶然跑偏。荟萃分析会按严格标准筛选出多篇高质量研究，把几万甚至几十万人的数据合并统计，看大趋势到底稳不稳。",
    analogy: "就像挑餐厅：只看 1 条好评容易踩雷，把 100 条真实评价合在一起算综合分，靠谱得多。",
    scene: "meta-stack",
  },
  {
    key: "随机对照试验",
    aliases: ["对照试验"],
    title: "随机对照试验（RCT）",
    short: "用抽签把人分成「做」和「不做」两组，再比结果。",
    detail: "因为是随机分组，两组人的年龄、体质、生活习惯大致均衡。如果一段时间后两组结果差得很明显，就能比较有把握地说明是这个做法本身起了作用。",
    analogy: "就像公平比试：先抽签分两队，一队按新方法练，一队照旧，最后看谁进步大。",
    scene: "rct-lottery",
  },
  {
    key: "观察研究",
    title: "观察研究",
    short: "不干预大家的生活，只记录大家的习惯和后来发生的事。",
    detail: "比如追踪几万人 10 年，看爱喝咖啡的人是不是更长寿。它很适合看长期趋势，但只能说明「两件事常一起出现」，不一定谁导致谁。",
    analogy: "就像发现「带伞的人多了，天就下雨」，两件事相关，但不是带伞引起下雨。",
  },
  {
    key: "专家意见",
    aliases: ["立场声明"],
    title: "专家意见 / 立场声明",
    short: "专业学会或资深专家结合现有知识和临床经验给出的判断。",
    detail: "在证据金字塔里，它比大规模汇总数据低一级，但在缺少直接人体试验、或需要结合临床操作落地时，依然很有参考价值。",
    analogy: "就像老司机的经验总结：很有用，但有实测数据支持时会更稳。",
  },
  {
    key: "膳食指南",
    aliases: ["中国居民膳食指南", "中国膳食指南", "美国膳食指南"],
    title: "居民膳食指南",
    short: "各国营养学会面向普通人写的「怎么吃」官方说明书。",
    detail: "由营养学和医学专家团队定期修订，综合本国饮食习惯与最新营养研究，给出每天蔬菜、蛋白、盐、油、喝水等实用参考量。",
    analogy: "相当于国家替你把几千篇营养论文翻译成了「每天吃多少」。",
  },
  {
    key: "BMI",
    title: "BMI（身体质量指数）",
    short: "用体重（公斤）除以身高（米）的平方，粗略看胖瘦。",
    detail: "它计算简单，常用于大样本统计；但分不清重量是脂肪还是肌肉，所以健身人群或老人不能只看这一个数。",
    analogy: "就像只看行李箱总重量，不知道里面装的是棉花还是哑铃。",
  },
  {
    key: "DOMS",
    aliases: ["延迟性肌肉酸痛"],
    title: "DOMS（延迟性肌肉酸痛）",
    short: "练完当天没事、隔一两天才开始酸的那种疼。",
    detail: "它不是乳酸堆积（乳酸一小时左右就清走了），而是不习惯的动作造成肌纤维微小损伤后，身体启动修复和轻微炎症带来的酸胀感。",
    analogy: "就像房子翻新时敲敲打打的动静，修好后墙反而更结实。",
  },
  {
    key: "FDA",
    title: "FDA（美国食品药品监督管理局）",
    short: "美国负责审查食品、药品安全性的官方监管机构。",
    detail: "它会对食品添加剂、药物进行毒理和人体安全评估，比如把正常用量的味精列为「一般认为安全（GRAS）」。",
    analogy: "相当于美国的「食药安检总署」。",
  },
  {
    key: "肌少症",
    title: "肌少症",
    short: "年纪大了之后，肌肉量和力气一起明显往下掉的状态。",
    detail: "人从 30 多岁起如果不练力量，肌肉会逐年缓慢流失；到老年如果掉得太多，会导致走路变慢、拎不动东西、更容易跌倒骨折。",
    analogy: "就像身体里的「力量存款」被慢慢花光，所以及早存肌肉很重要。",
  },
  {
    key: "热量缺口",
    title: "热量缺口",
    short: "一天消耗的热量，比吃进去的热量多出来的那一部分。",
    detail: "无论用哪种饮食法，身体真正动用储存脂肪的前提，都是长期维持温和的热量缺口。",
    analogy: "就像存钱罐：花得比存得多，余额才会慢慢往下降。",
  },
  {
    key: "一类致癌物",
    title: "一类致癌物",
    short: "有充分人类证据表明「确实会增加致癌风险」的物质。",
    detail: "注意：分类说的是「证据有多确凿」，不是「吃一口就一定会得癌」。但酒精、烟草这类一类致癌物，越少接触越安全。",
    analogy: "「一类」说的是「铁证如山」，不是「毒性最强」。",
  },
];

export const GLOSSARY_MAP = new Map<string, GlossaryTerm>();
for (const item of GLOSSARY) {
  GLOSSARY_MAP.set(item.key, item);
  for (const a of item.aliases ?? []) GLOSSARY_MAP.set(a, item);
}

// Match longest terms first so "中国居民膳食指南" matches before "膳食指南"
export const GLOSSARY_KEYS = Array.from(GLOSSARY_MAP.keys()).sort((a, b) => b.length - a.length);
