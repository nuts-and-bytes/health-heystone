export type DilemmaTrack = "fitness" | "women" | "daily";
export type DilemmaVerdict = "ok" | "adjust" | "stop";
export type EvidenceLevel = "强证据" | "中等证据" | "有限证据";

export interface AuthoritySource {
  org: string;
  title: string;
  year: number;
  url?: string;
}

export interface Dilemma {
  slug: string;
  track: DilemmaTrack;
  shortTag: string;
  question: string;
  verdict: DilemmaVerdict;
  verdictLabel: string;
  reassurance: string;
  debate: {
    sideA: string;
    sideB: string;
  };
  science: string;
  actionNow: string;
  evidenceLevel: EvidenceLevel;
  sources: AuthoritySource[];
  redLine?: string;
  keywords: string[];
}

export const TRACK_META: Record<DilemmaTrack, { label: string; sub: string }> = {
  fitness: { label: "健身", sub: "吃喝 · 训练 · 恢复与体感" },
  women: { label: "女性", sub: "经期 · 体态 · 皮肤与能量红线" },
  daily: { label: "日常普适", sub: "跑步 · 步数 · 睡眠与饮食经典" },
};

export const DILEMMA_VERDICT_META: Record<
  DilemmaVerdict,
  { badge: string; tone: string; dot: string }
> = {
  ok: {
    badge: "别慌 · 放心",
    tone: "border-emerald-700/25 bg-emerald-50 text-emerald-800",
    dot: "#15803d",
  },
  adjust: {
    badge: "看情况 · 换个做法",
    tone: "border-amber-700/25 bg-amber-50 text-amber-800",
    dot: "#b45309",
  },
  stop: {
    badge: "别硬扛 · 注意红线",
    tone: "border-red-700/25 bg-red-50 text-red-800",
    dot: "#b91c1c",
  },
};

export const DILEMMAS: Dilemma[] = [
  // ==================== 一、健身人群 · 吃喝与放纵餐纠结（10 题） ====================
  {
    slug: "post-workout-kfc-cola",
    track: "fitness",
    shortTag: "练完吃 KFC 会白练吗",
    question: "今天健身了，去吃 KFC / 麦当劳喝可乐，会白练吗？",
    verdict: "ok",
    verdictLabel: "偶尔一顿不会白练",
    reassurance: "不会白练！决定体脂和肌肉的是长期总热量与总蛋白，不是这一顿快餐。",
    debate: {
      sideA: "高油高盐高糖，吃一顿今天在健身房流的汗全白费了。",
      sideB: "我减脂期每周吃两次双吉或原味鸡，算好总热量照样掉秤。",
    },
    science:
      "力量或耐力训练后肌糖原下降，适量碳水反而有助糖原回补；快餐真正的问题在于炸物的高饱和脂肪、高热量与高钠（钠会让你第二天短暂水肿 1–2 斤，不是立刻长了纯脂肪）。",
    actionNow:
      "优先选烤制类肉品或去皮原味鸡，薯条换玉米/生菜或少吃，含糖可乐换无糖版或气泡水；吃完不用次日绝食，回归正常三餐即可。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ISSN", title: "International Society of Sports Nutrition Position Stand: Nutrient Timing", year: 2017, url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0189-4" },
      { org: "ACSM", title: "Nutrition and Athletic Performance Joint Position Statement", year: 2016 },
    ],
    keywords: ["kfc", "肯德基", "麦当劳", "汉堡", "炸鸡", "可乐", "快餐", "白练", "放纵餐"],
  },
  {
    slug: "zero-cola-fat-loss",
    track: "fitness",
    shortTag: "喝无糖可乐会胖吗",
    question: "减脂期喝无糖可乐 / 零度可乐，到底会不会长胖？",
    verdict: "adjust",
    verdictLabel: "短期控卡友好，别当水喝",
    reassurance: "代糖本身几乎零热量，不会凭空让你长脂肪；解馋适量喝完全没问题，但别完全替代白开水。",
    debate: {
      sideA: "0 糖 0 卡随便喝，减脂期续命神器。",
      sideB: "代糖刺激胰岛素还伤肠道，喝无糖可乐反而更胖。",
    },
    science:
      "短期随机对照试验显示，用无糖饮料替代含糖饮料能减少总热量摄入；但 WHO 2023 年非糖甜味剂指南基于长期观察性队列给出「有条件建议」：不建议把代糖当成长期减重工具，整体逐步降低嗜甜度更稳妥。",
    actionNow:
      "想喝含糖可乐时用无糖版解馋是务实选择（每天 1 罐以内较稳妥）；日常补水仍以白水、茶、无糖气泡水为主。",
    evidenceLevel: "中等证据",
    sources: [
      { org: "WHO", title: "Use of Non-Sugar Sweeteners: WHO Guideline", year: 2023, url: "https://www.who.int/publications/i/item/9789240073616" },
    ],
    keywords: ["无糖可乐", "零度可乐", "代糖", "阿斯巴甜", "赤藓糖醇", "减脂", "长胖"],
  },
  {
    slug: "hotpot-gain-2jin",
    track: "fitness",
    shortTag: "大餐后重 2 斤怎么办",
    question: "昨晚吃了一顿火锅/烧烤，今早重了 2 斤，是长胖了吗？要断食补救吗？",
    verdict: "ok",
    verdictLabel: "绝大多数是水分，千万别极端断食",
    reassurance: "别慌！一顿饭几乎不可能长出 2 斤纯脂肪，秤上多出来的主要是盐锁住的水和食物残渣。",
    debate: {
      sideA: "一夜暴涨 2 斤崩溃了，今天必须液断一天拉回来！",
      sideB: "高盐高碳水锁水而已，清淡吃两天体重自己就掉回去了。",
    },
    science:
      "1 公斤纯脂肪约对应 7,700 大卡额外热量盈余，一顿火锅远达不到这个量级。但高钠会引发水钠潴留，且每储存 1 克肌糖原会同时绑定约 3–4 克水分，叠加消化道内食物重量，次日秤上波动 1–3 斤极其正常。",
    actionNow:
      "绝对不要催吐或极端绝食（极易诱发下一轮报复性暴食）。接下来 2–3 天正常吃清淡高钾蔬果、多喝水、照常活动，体重会自然回落。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "Appropriate Physical Activity Intervention Strategies for Weight Loss", year: 2009 },
      { org: "PubMed", title: "Glycogen storage and water binding physiology", year: 2015 },
    ],
    redLine: "若经常出现「暴食后强烈自责并采取催吐/极端断食」循环，建议寻求专业心理或营养科支持。",
    keywords: ["火锅", "烧烤", "大餐", "重了两斤", "重了2斤", "暴涨", "断食", "液断", "水肿"],
  },
  {
    slug: "anabolic-window-30min",
    track: "fitness",
    shortTag: "练完半小时必须喝蛋白粉吗",
    question: "练完半小时内不喝蛋白粉或不吃饭，肌肉就会掉吗？",
    verdict: "ok",
    verdictLabel: "不用卡死 30 分钟",
    reassurance: "全天吃够总蛋白质远比「练完 30 分钟内喝完」重要，安心洗完澡回家吃正餐就行。",
    debate: {
      sideA: "错过 30 分钟合成窗口期，今天铁白举了！",
      sideB: "那是早年补剂商炒出来的概念，只要全天蛋白够量就没事。",
    },
    science:
      "ISSN 营养时机立场声明指出，抗阻训练后肌肉对蛋白质的敏感期可持续数小时甚至 24 小时。如果你练前 3–4 小时吃过含蛋白质的正餐，血液里本就有充足氨基酸，根本不需要在更衣室争分夺秒。",
    actionNow:
      "把注意力放在全天总蛋白（规律训练者一般约 1.4–2.0 g/kg 体重/天），均匀分到 3–4 顿正餐里；仅在长时间空腹训练后才需要尽快进食。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ISSN", title: "Position Stand: Nutrient Timing", year: 2017, url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0189-4" },
      { org: "PubMed", title: "Schoenfeld et al., The effect of protein timing on muscle strength and hypertrophy", year: 2013 },
    ],
    keywords: ["窗口期", "半小时", "蛋白粉", "练完吃饭", "掉肌肉", "蛋白质"],
  },
  {
    slug: "alcohol-after-workout",
    track: "fitness",
    shortTag: "健身期聚餐喝酒影响多大",
    question: "健身期聚餐喝了酒（啤酒/微醺小酒），对增肌减脂影响多大？",
    verdict: "adjust",
    verdictLabel: "过量伤恢复，偶尔小酌别焦虑",
    reassurance: "偶尔小喝一两杯不会毁掉你的身材，但大量醉酒确实会拖慢肌肉合成并拉垮睡眠。",
    debate: {
      sideA: "喝一口酒就分解肌肉，健身人必须滴酒不沾。",
      sideB: "社交偶尔喝点微醺而已，没必要活得像苦行僧。",
    },
    science:
      "研究（Parr et al., PLOS ONE）显示，训练后大量摄入酒精会短暂抑制约 24%–37% 的肌肉蛋白合成信号，同时酒精本身含热量（7 kcal/g）且破坏深睡眠。但这是针对大剂量饮酒，偶尔少量社交饮酒对长期体成分影响有限。",
    actionNow:
      "如果避不开聚餐：尽量控制饮酒量、边喝边配大量白水和蛋白质菜品、避免空腹狂饮，也别指望次日宿醉硬扛大重量训练。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Parr et al., Alcohol Ingestion Impairs Maximal Post-Exercise Rates of Myofibrillar Protein Synthesis", year: 2014 },
      { org: "WHO", title: "Alcohol and Health Fact Sheet", year: 2024 },
    ],
    keywords: ["喝酒", "啤酒", "微醺", "酒精", "聚餐", "掉肌", "增肌"],
  },
  {
    slug: "milk-tea-fat-loss",
    track: "fitness",
    shortTag: "减脂期能喝奶茶吗",
    question: "减脂期能喝奶茶吗？点三分糖 / 不加小料行不行？",
    verdict: "adjust",
    verdictLabel: "选鲜奶+真茶+不另加糖就行",
    reassurance: "让你胖的不是「茶+奶」，而是植脂末、厚奶盖、全糖和满满小料。",
    debate: {
      sideA: "一杯奶茶等于两碗米饭，减脂期绝对碰不得。",
      sideB: "鲜奶茶不另加糖去小料，本质就是一杯牛奶泡茶，才 100 多大卡。",
    },
    science:
      "一杯全糖植脂末+芝士奶盖+珍珠的奶茶热量常高达 500–700 kcal；但换成纯鲜奶/轻乳 + 原叶茶底 + 不另加糖且不加小料，中杯热量通常仅 100–160 kcal，还带一点乳蛋白与钙。",
    actionNow:
      "点单三步：选「真茶+鲜奶」基底 → 甜度选「不另加糖」或最低糖 → 去掉奶盖、珍珠、芋泥、脆波波。偶尔解馋完全不必有负罪感。",
    evidenceLevel: "强证据",
    sources: [
      { org: "中国营养学会", title: "《中国居民膳食指南（2022）》添加糖控制建议", year: 2022 },
      { org: "WHO", title: "Guideline: Sugars intake for adults and children", year: 2015 },
    ],
    keywords: ["奶茶", "三分糖", "轻乳茶", "小料", "奶盖", "减脂"],
  },
  {
    slug: "iced-americano-preworkout",
    track: "fitness",
    shortTag: "练前喝冰美式心慌怎么办",
    question: "练前喝冰美式真的能多燃脂吗？喝完心慌还能练吗？",
    verdict: "adjust",
    verdictLabel: "能提神微促代谢，但心慌立刻别硬练",
    reassurance: "黑咖啡确实能让你更有劲、轻微提高脂肪氧化，但它不是燃脂神药，不耐受完全不用强喝。",
    debate: {
      sideA: "练前必灌一大杯冰美式，出汗多掉秤快一倍。",
      sideB: "我喝完心跳飙到 130 手抖反胃，差点在跑步机晕过去。",
    },
    science:
      "ISSN 咖啡因立场声明指出，适量咖啡因（约 3–6 mg/kg 体重，对多数人仅相当于 1–2 杯美式）能提升耐力与力量表现、轻微增加运动中脂肪供能比例。但个体代谢差异极大，敏感者或空腹饮用极易引发心悸、胃部不适与晚间失眠。",
    actionNow:
      "日常不喝咖啡的人别为了「燃脂」硬灌；下午 3 点后尽量少喝以免毁睡眠；若喝完明显心慌手抖，多喝水坐下休息，降低今日强度或改日再练。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ISSN", title: "International Society of Sports Nutrition Position Stand: Caffeine and Exercise Performance", year: 2021, url: "https://jissn.biomedcentral.com/articles/10.1186/s12970-020-00383-4" },
    ],
    redLine: "若出现明显心悸、胸闷、眼前发黑或胸痛，应立即停止运动；反复发作请及时前往心内科检查。",
    keywords: ["冰美式", "黑咖啡", "咖啡因", "心慌", "手抖", "燃脂", "练前"],
  },
  {
    slug: "fasted-cardio",
    track: "fitness",
    shortTag: "空腹有氧更掉脂吗",
    question: "空腹有氧（早起不吃饭去跑步/爬坡）真的比吃饱了更掉脂肪吗？",
    verdict: "ok",
    verdictLabel: "长期减脂效果几乎一样，按体感选",
    reassurance: "不用逼自己饿着肚子早起爬坡！吃点东西再去练，长期掉的脂肪和空腹几乎没有差别。",
    debate: {
      sideA: "空腹血糖低直接烧脂肪，早起空腹爬坡效率翻倍。",
      sideB: "热量缺口一样，空腹练没力气反而掉肌肉还容易低血糖。",
    },
    science:
      "Schoenfeld 等系统综述与随机对照试验表明，在总热量和蛋白质摄入相同的前提下，空腹有氧与进食后有氧在数周后的体脂下降幅度没有显著差异——运动中多烧的那一点脂肪，会被当天其余时间身体的能量调节平衡掉。",
    actionNow:
      "如果你早起空腹慢走/低强度爬坡觉得很舒服，可以继续；如果容易头晕、没劲或准备做高强度间歇/大重量，练前 30–60 分钟吃半根香蕉或一片全麦面包表现更好。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Schoenfeld et al., Body composition changes associated with fasted versus non-fasted aerobic exercise", year: 2014 },
      { org: "PubMed", title: "Hackett & Hagstrom, Effect of Overnight Fasted Exercise on Weight Loss and Body Composition: Systematic Review", year: 2017 },
    ],
    redLine: "有低血糖史、贫血或糖尿病用药人群切勿盲目空腹运动，具体运动饮食方案请遵医嘱。",
    keywords: ["空腹有氧", "空腹爬坡", "早起跑步", "低血糖", "燃脂"],
  },
  {
    slug: "eat-after-9pm-workout",
    track: "fitness",
    shortTag: "晚上 9 点练完能吃饭吗",
    question: "晚上 9 点以后练完，还能不能吃晚饭？吃了会胖吗？",
    verdict: "ok",
    verdictLabel: "能吃，不会因为「晚」就额外变胖",
    reassurance: "放心吃！脂肪不会看手表决定几点长出来，练完饿着睡觉反而睡不好、恢复差。",
    debate: {
      sideA: "晚上 8 点后吃碳水，代谢慢了全变成肚子上的肥肉。",
      sideB: "练完不补蛋白和碳水，半夜饿醒还掉肌肉。",
    },
    science:
      "在全天总热量不超标的前提下，晚间训练后进食并不会额外增加体脂。相反，训练后补充适量易消化蛋白质与温和碳水，有助于修复肌纤维、平复皮质醇并改善入睡质量。",
    actionNow:
      "选好消化、少油辣的组合（如温热牛奶/无糖酸奶 + 鸡蛋/鸡胸/豆腐 + 少量主食），距离躺平睡觉留出约 1 小时以上避免反酸即可。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ISSN", title: "Position Stand: Diets and Body Composition", year: 2017 },
      { org: "PubMed", title: "Kinsey & Ormsbee, The Health Impact of Nighttime Eating", year: 2015 },
    ],
    keywords: ["晚上9点", "晚上吃晚饭", "宵夜", "练完饿", "晚上吃碳水"],
  },
  {
    slug: "are-supplements-necessary",
    track: "fitness",
    shortTag: "蛋白粉和肌酸必须吃吗",
    question: "普通人健身，蛋白粉、肌酸、氮泵这些补剂是必须吃的吗？",
    verdict: "ok",
    verdictLabel: "都不是必须品，先吃好三餐",
    reassurance: "一个都不必须！普通人好好吃够三餐蛋白质、规律训练、睡好觉，就已经拿到了 90% 以上的效果。",
    debate: {
      sideA: "不吃蛋白粉和肌酸根本长不了肌肉，铁白举了。",
      sideB: "补剂都是智商税，正常吃饭就够了。",
    },
    science:
      "ISSN 共识明确指出：蛋白粉本质只是「方便的乳清/植物蛋白食物」，饭里吃够了就完全不需要；一水肌酸是运动科学中证据最充分的增力补剂之一，但也属于「锦上添花」而非必需品；任何补剂都无法替代训练和睡眠。",
    actionNow:
      "先算一下自己平时肉蛋奶豆吃够了没有；如果确实没时间做饭再考虑把蛋白粉当便捷食物补充。本站严守零带货原则，不推荐任何具体品牌。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ISSN", title: "Position Stand: Protein and Exercise", year: 2017 },
      { org: "ISSN", title: "Position Stand: Safety and Efficacy of Creatine Supplementation", year: 2017 },
    ],
    redLine: "有肾脏基础疾病、痛风或正在服药者，在考虑任何高蛋白饮食或运动补剂前请务必咨询医生。",
    keywords: ["蛋白粉", "肌酸", "氮泵", "补剂", "必须吃", "推荐"],
  },

  // ==================== 二、健身人群 · 训练体感与恢复纠结（8 题） ====================
  {
    slug: "stay-up-late-workout",
    track: "fitness",
    shortTag: "熬夜到 2 点明天还练吗",
    question: "昨晚熬夜到 2 点，今天早起还该不该去健身？",
    verdict: "stop",
    verdictLabel: "别上大重量，优先补觉",
    reassurance: "今天不练不是偷懒！熬夜后硬扛高强度反而伤心脏、易拉伤，把觉补回来明天练得更香。",
    debate: {
      sideA: "自律的人风雨无阻，困了喝杯黑咖啡照样冲深蹲。",
      sideB: "熬夜后强行健身风险极高，肌肉也不长还容易出意外。",
    },
    science:
      "睡眠剥夺会显著升高交感神经张力与皮质醇，降低反应速度、平衡感与肌肉蛋白合成效率。在疲劳状态下做大重量或高强度间歇，动作变形拉伤和心血管负荷风险都会上升。",
    actionNow:
      "睡少于 5–6 小时时，把大重量/高强度训练顺延一天；实在想动只做 15–20 分钟散步或温和拉伸，今晚早点睡。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Knowles et al., Inadequate sleep and muscle strength: Implications for resistance training", year: 2018 },
      { org: "ACSM", title: "Sleep and Athletic Performance Resources", year: 2020 },
    ],
    redLine: "通宵或严重缺觉后若伴随胸闷、心慌、头晕，严禁进行任何剧烈运动。",
    keywords: ["熬夜", "2点", "没睡好", "睡眠不足", "猝死", "补觉", "第二天健身"],
  },
  {
    slug: "no-soreness-wasted",
    track: "fitness",
    shortTag: "练完不酸是白练吗",
    question: "练完第二天肌肉完全不酸，是不是白练了？",
    verdict: "ok",
    verdictLabel: "绝对不是白练",
    reassurance: "酸痛只是身体遇到新刺激时的副产品，不是增肌或减脂的合格证！",
    debate: {
      sideA: "练完不酸说明没刺激到位，必须加到第二天爬不起床。",
      sideB: "老手练完大多只微酸甚至不酸，看重量和次数有没有进步才靠谱。",
    },
    science:
      "延迟性肌肉酸痛（DOMS）主要来自不熟悉的动作或较强的离心收缩，身体适应几次后酸痛感会自然减弱（重复 bout 效应）。Schoenfeld 等研究明确指出，DOMS 程度与长期肌肉增长并不成正比。",
    actionNow:
      "判断有没有练到位，看 3 个指标：动作是否标准、目标肌群训练中是否有泵感/力竭感、几周下来重量或次数是否稳步提升。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Schoenfeld & Contreras, Is Postexercise Muscle Soreness a Valid Indicator of Muscular Adaptations?", year: 2013 },
    ],
    keywords: ["不酸", "酸痛", "白练", "DOMS", "乳酸", "没感觉"],
  },
  {
    slug: "dizzy-after-leg-day",
    track: "fitness",
    shortTag: "练腿头晕恶心正常吗",
    question: "练完腿 / 硬拉觉得头晕、恶心、眼前发黑，正常吗？",
    verdict: "stop",
    verdictLabel: "这不是练到位，立刻坐下休息",
    reassurance: "练腿头晕很常见，但绝不是「高手练吐的勋章」，通常是血压波动、屏气过久或血糖水分不够。",
    debate: {
      sideA: "练腿不练到想吐说明强度不够！",
      sideB: "这是体位性低血压或低血糖信号，硬扛可能直接晕倒。",
    },
    science:
      "下肢大肌群需血量巨大，加上大重量深蹲/硬拉时长时间屏气（瓦氏动作）后突然起身，容易造成短暂脑供血不足；若同时空腹或饮水不足，就会出现头晕、冷汗、恶心。",
    actionNow:
      "立刻停止动作坐下或平躺、抬高双腿、小口喝温水或补一点碳水；下次练腿前 1–2 小时吃够碳水、组间充分呼吸休息、别猛然起身。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "ACSM's Guidelines for Exercise Testing and Prescription", year: 2021 },
    ],
    redLine: "如果反复出现运动中晕厥、眼前发黑、胸痛或休息后仍不缓解，必须停练并前往医院心内科/全科排查贫血、心律或血压问题。",
    keywords: ["练腿", "头晕", "恶心", "发黑", "想吐", "硬拉", "深蹲", "低血糖"],
  },
  {
    slug: "twice-a-week-enough",
    track: "fitness",
    shortTag: "一周只练 2 次有用吗",
    question: "上班/上学太忙，一周只能练 2 次，或每次只练 25 分钟，还有用吗？",
    verdict: "ok",
    verdictLabel: "非常有用，远超「白练」",
    reassurance: "完全够用！每周 2 次全身力量训练已经能拿到健康与力量收益的大头。",
    debate: {
      sideA: "一周低于 4 练纯属自我安慰，不如不去。",
      sideB: "我一周两练坚持半年，体态和精力明显比以前强太多。",
    },
    science:
      "WHO 身体活动指南与多项抗阻训练「最低有效剂量」研究表明，每周 2 次覆盖主要肌群的力量训练，就能显著提升肌力、骨密度与代谢健康，并大幅降低全因死亡风险。",
    actionNow:
      "时间紧就选「全身复合动作」（深蹲/箭步蹲、推举/俯卧撑、划船/下拉、臀桥），每次 25–35 分钟认真练 2 次，比定一个坚持不了的 6 练计划强十倍。",
    evidenceLevel: "强证据",
    sources: [
      { org: "WHO", title: "WHO Guidelines on Physical Activity and Sedentary Behaviour", year: 2020, url: "https://www.who.int/publications/i/item/9789240015128" },
      { org: "PubMed", title: "Iversen et al., No Time to Lift? Designing Time-Efficient Training Programs", year: 2021 },
    ],
    keywords: ["一周两次", "一周2次", "25分钟", "没时间", "频率", "有用吗"],
  },
  {
    slug: "beginner-weight-gain",
    track: "fitness",
    shortTag: "新手健身重了 2 斤",
    question: "刚开始健身满一个月，怎么体重反而重了 1–2 斤？",
    verdict: "ok",
    verdictLabel: "新手期常见「假性增重」",
    reassurance: "别被体重秤吓退！刚运动时肌肉储水和糖原增加会让体重短期微涨，往往是身体在变好的信号。",
    debate: {
      sideA: "越练越重，肯定是运动后胃口变大吃胖了。",
      sideB: "新手前几周肌肉充水储糖原，体重涨了腰围却变细了。",
    },
    science:
      "开始规律抗阻训练的头 2–6 周，肌纤维微损伤修复会伴随短暂水分储留，同时肌肉为了适应训练会储存更多肌糖原（每克糖原带 3–4 克水），容易让秤上多出 1–3 斤。",
    actionNow:
      "别只盯体重秤！每周固定时间量一次腰围/臀围、穿同一条牛仔裤感受松紧，同时简单核对下自己运动后有没有无意识多吃高热量零食。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "Body Composition and Exercise Adaptation Overview", year: 2021 },
    ],
    keywords: ["重了", "越练越重", "新手", "体重上涨", "一个月", "没掉秤"],
  },
  {
    slug: "workout-with-cold",
    track: "fitness",
    shortTag: "感冒发烧能出汗排毒吗",
    question: "感冒、嗓子疼或有点低烧，还能去健身「出出汗排毒」吗？",
    verdict: "stop",
    verdictLabel: "发烧/全身痛绝对别练，休息最快好",
    reassurance: "出汗不能「排病毒」！发烧或胸闷时硬练不仅好得更慢，还有诱发心肌炎的风险。",
    debate: {
      sideA: "去跑 5 公里捂一身汗，第二天感冒就好了。",
      sideB: "发烧硬去健身房，真有人跑出病毒性心肌炎进医院。",
    },
    science:
      "运动医学常用的「颈部法则（Neck Check）」：如果症状仅在颈部以上（轻微流涕、打喷嚏、无发热），可做极低强度散步；一旦出现发热、肌肉酸痛、剧烈咳嗽、胸闷或肠胃不适，免疫系统正全力作战，剧烈运动会抑制免疫并增加心肌受累风险。",
    actionNow:
      "发烧、咽痛明显或浑身乏力时果断停练休息、多喝水；退烧且症状完全消失后再从平时 50%–60% 强度循序恢复。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "Return to Exercise After Illness / Neck Check Clinical Consensus", year: 2020 },
    ],
    redLine: "感冒或病毒感染后若出现胸闷、气短、心慌、莫名极度乏力，请立即停止一切运动并尽快就医排查心肌炎。",
    keywords: ["感冒", "发烧", "嗓子疼", "出汗排毒", "心肌炎", "生病健身"],
  },
  {
    slug: "cardio-only-no-weights",
    track: "fitness",
    shortTag: "只做有氧不撸铁行吗",
    question: "只做有氧（跑步 / 帕梅拉 / 跳操）不撸铁，能瘦出好看线条吗？",
    verdict: "adjust",
    verdictLabel: "能掉秤，但加一点力量线条更稳",
    reassurance: "只做有氧当然能瘦，但如果不想瘦完松垮、怕反弹，每周顺手加 2 次基础力量会事半功倍。",
    debate: {
      sideA: "跑步跳操掉秤最快，撸铁太累还会变壮。",
      sideB: "只做有氧配节食，瘦下来成了松垮泡芙人，一吃就反弹。",
    },
    science:
      "有氧擅长消耗热量和提升心肺，但在热量缺口下，单纯节食+大量有氧更容易伴随一定比例的肌肉流失。加入抗阻训练能保住瘦体重、稳住基础代谢并让体态更挺拔紧致。",
    actionNow:
      "不必一开始就泡在力量区：保留你喜欢的有氧，每周抽出 2 次、每次 20 分钟做深蹲、俯卧撑/推举、划船、臀桥即可。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "Resistance Training for Weight Loss and Body Composition", year: 2019 },
      { org: "WHO", title: "Guidelines on Physical Activity and Sedentary Behaviour", year: 2020 },
    ],
    keywords: ["有氧", "跑步", "帕梅拉", "跳操", "撸铁", "线条", "泡芙人"],
  },
  {
    slug: "train-sore-muscle-next-day",
    track: "fitness",
    shortTag: "酸痛没好能接着练吗",
    question: "同一个部位酸痛还没完全好，隔天能接着练吗？",
    verdict: "adjust",
    verdictLabel: "微酸可轻动，明显酸痛换部位或歇一天",
    reassurance: "肌肉是在休息时修复长大的！明显酸痛时换个部位练或散步拉伸，比硬怼更涨进步。",
    debate: {
      sideA: "以痛攻痛，第二天接着练排酸更快。",
      sideB: "肌纤维还没修好就接着撕，越练越累还容易拉伤。",
    },
    science:
      "高强度抗阻训练后，同一肌群通常需要约 48 小时完成主要修复与蛋白合成。轻微酸胀时做低强度活动（如散步、动态拉伸）有助于局部血流恢复，但立刻再上大重量会降低动作质量并拉长疲劳。",
    actionNow:
      "昨天练腿今天酸，今天就改练上肢或核心，或者做 20 分钟轻松散步。特别注意区分「肌肉酸胀」和「关节刺痛」。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "Progression Models in Resistance Training for Healthy Adults", year: 2009 },
    ],
    redLine: "如果出现的是关节尖锐刺痛、局部肿胀淤青或单侧放射性疼痛，绝非正常酸痛，请立刻停练并就医评估。",
    keywords: ["酸痛", "隔天", "接着练", "以痛攻痛", "排酸", "恢复"],
  },
  {
    slug: "electrolyte-water-needed",
    track: "fitness",
    shortTag: "健身一定要喝电解质水吗",
    question: "健身出汗一定要喝电解质水吗？还是智商税？",
    verdict: "adjust",
    verdictLabel: "常规 1 小时内喝白水就够，暴汗长训再补",
    reassurance: "在空调房练 40 分钟普通力量或慢跑，喝白开水完全够用，没必要跟风每顿都买含糖电解质饮料！",
    debate: {
      sideA: "出汗会流失钠钾，健身不喝电解质水容易抽筋脱水。",
      sideB: "普通人练一小时根本流不了多少电解质，三餐里的盐早就够补了。",
    },
    science:
      "ACSM 运动补液立场声明指出：在 60 分钟以内的中低强度训练中，白开水配合正常三餐即可满足水分与电解质需求；只有持续超过 60–90 分钟的高强度训练、高温高湿户外暴汗或明显出现抽筋乏力时，补充含钠/钾的电解质水才真正有必要。",
    actionNow:
      "常规健身带一瓶白开水小口常饮；高温暴汗长跑时可选低糖/无糖电解质饮或淡盐水+香蕉。留意配料表，别把高糖运动饮料当水喝。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "Exercise and Fluid Replacement Position Stand", year: 2007 },
      { org: "ISSN", title: "Sports Nutrition Review & Hydration Recommendations", year: 2018 },
    ],
    keywords: ["电解质水", "运动饮料", "补液", "出汗", "抽筋", "智商税"],
  },
  {
    slug: "no-stretch-bulky-muscle",
    track: "fitness",
    shortTag: "练完不拉伸肌肉会变死疙瘩吗",
    question: "练完太累直接躺了，不拉伸肌肉真的会变硬、变粗成「死疙瘩」吗？",
    verdict: "ok",
    verdictLabel: "不会变死疙瘩，但练后温和拉伸很舒服",
    reassurance: "放心！肌肉形状主要由基因和肌腱附着点决定，不会因为今天忘了拉伸就突然长成一坨硬疙瘩。",
    debate: {
      sideA: "跑完步不拉伸小腿，一周直接变肌肉萝卜腿！",
      sideB: "拉伸只能改善柔韧度和放松紧绷感，根本改变不了肌肉长相。",
    },
    science:
      "运动生理学研究表明，练后觉得小腿或手臂「变硬变鼓」只是短期肌肉充血泵感，几小时后会自然消退；静态拉伸无法改变肌纤维附着形态，但能温和改善关节活动度、缓解局部紧张。注意练前宜做动态热身，而非长时间静态拉伸。",
    actionNow:
      "练前花 5 分钟做动态热身（高抬腿、徒手深蹲、绕肩）；练后如果时间允许，给今天练过的肌群各做 15–30 秒温和静态拉伸，没空跳过也不用焦虑。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "Quantity and Quality of Exercise: Flexibility & Stretching Guidance", year: 2011 },
      { org: "PubMed", title: "Behm et al., Acute effects of muscle stretching on physical performance and range of motion", year: 2016 },
    ],
    keywords: ["拉伸", "不拉伸", "死疙瘩", "萝卜腿", "变硬", "静态拉伸", "热身"],
  },
  {
    slug: "massage-gun-neck-danger",
    track: "fitness",
    shortTag: "筋膜枪能打脖子吗",
    question: "筋膜枪哪里都能打吗？脖子酸拿筋膜枪打行不行？",
    verdict: "stop",
    verdictLabel: "严禁打颈部与骨突，只能轻扫大块肌肉",
    reassurance: "脖子酸千万别拿筋膜枪狂怼！颈部血管和神经极其表浅，确实有打脖子引发头晕甚至血管夹层的急诊病例。",
    debate: {
      sideA: "加班脖子僵得要命，拿筋膜枪开最大档打两分钟超爽。",
      sideB: "康复科反复警告：颈前、颈侧、脊柱骨头和关节绝对不能打！",
    },
    science:
      "筋膜枪通过高频机械叩击短暂放松软组织、降低主观酸痛感，仅适用于大腿、臀部、小腿肚、背阔肌等肌肉丰厚处。颈部两侧有颈动脉窦与椎动脉，高频强力冲击存在诱发血压骤降、晕厥或动脉内膜损伤的风险。",
    actionNow:
      "只在肌肉厚实的部位顺着肌纤维缓慢移动（同一部位不超过 1–2 分钟），避开颈部、脊椎正中、锁骨、膝盖骨、腋窝与腹股沟；脖子酸改用热敷和温和颈部伸展。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Percussion massage therapy safety & carotid/vertebral artery dissection case reports", year: 2022 },
      { org: "ACSM", title: "Safe Self-Myofascial Release Practices", year: 2020 },
    ],
    redLine: "高危安全红线：严禁击打颈部与骨突。若使用筋膜枪后出现突然头晕、视物模糊、剧烈头痛或肢体麻木，请立即停止并前往急诊/神经内科。",
    keywords: ["筋膜枪", "脖子酸", "颈椎", "打脖子", "放松", "头晕"],
  },
  {
    slug: "smartwatch-calories-eat-back",
    track: "fitness",
    shortTag: "手表消耗的卡路里能吃回来吗",
    question: "运动手表显示的运动消耗准吗？减脂期能不能把多烧的卡路里「吃回来」？",
    verdict: "adjust",
    verdictLabel: "手表热量误差大，减脂期别按 100% 吃回来",
    reassurance: "手表测心率和步数挺靠谱，但估算「烧了多少大卡」普遍偏高！减脂期别照着表上的数字把饭全加回来。",
    debate: {
      sideA: "今天手表显示多烧了 500 大卡，晚上照着吃回来才不会饿垮。",
      sideB: "穿戴设备热量误差动辄 30%，照表吃回来减脂全白费。",
    },
    science:
      "斯坦福大学验证研究（Shcherbina 等）与 PubMed 系统综述（Fuller 等）均指出：商用智能手表在心率与步数监测上表现较好，但估算能量消耗（大卡）的误差普遍偏大（平均绝对百分比误差常达 27%–30% 以上），在力量训练和复合动作中更容易高估。",
    actionNow:
      "把手表消耗当成「活动量趋势参考」，减脂期不必照表 100% 吃回来；如遇超长距离跑或高强度训练确实极度饥饿，最多保守补回估测值的一半以内，并以连续 2–4 周的真实体重与腰围趋势为准。本站零带货，不推荐任何手表或记录 App 品牌。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Shcherbina et al., Accuracy in Wrist-Worn, Sensor-Based Measurements of Heart Rate and Energy Expenditure (J Pers Med)", year: 2017, url: "https://pubmed.ncbi.nlm.nih.gov/28538738/" },
      { org: "PubMed", title: "Fuller et al., Reliability and Validity of Commercially Available Wearable Devices for Measuring Steps, Energy Expenditure, and Heart Rate: Systematic Review (JMIR mHealth uHealth)", year: 2020, url: "https://pubmed.ncbi.nlm.nih.gov/32897239/" },
      { org: "ACSM", title: "Appropriate Physical Activity Intervention Strategies for Weight Loss and Prevention of Weight Regain", year: 2009 },
    ],
    redLine: "若因每天紧盯热量数字产生强烈进食愧疚、反复算卡焦虑或暴食循环，建议暂时关闭热量显示并寻求专业营养或心理支持。",
    keywords: ["运动手表", "手表", "卡路里", "热量消耗", "吃回来", "误差", "Apple Watch", "佳明", "手环", "减脂"],
  },
  {
    slug: "intermittent-fasting-16-8-gallstones",
    track: "fitness",
    shortTag: "16+8 轻断食更快瘦吗",
    question: "「16+8 轻断食 / 不吃早饭」减脂真比正常吃三餐更快吗？会不会得胆结石？",
    verdict: "adjust",
    verdictLabel: "本质还是控总热量，别硬饿、警惕胆汁淤积",
    reassurance: "16+8 没有「饿满 16 小时自动狂烧脂」的魔法！它管用只是因为少吃了一顿，吃够三餐制造同样热量缺口，瘦得一样快。",
    debate: {
      sideA: "16+8 不用算热量掉秤飞快，省一顿早饭超方便！",
      sideB: "我长期跳过早饭跟风轻断食，晚上报复性暴食，体检还查出胆结石。",
    },
    science:
      "《新英格兰医学杂志》（NEJM, Liu 等 2022）随机对照试验显示，在总热量摄入相同的前提下，16+8 限时进食与常规全天限能量饮食在 12 个月后的减重与体脂下降幅度没有显著差异。同时，消化病学研究表明，长期超长空腹叠加过快减重会减少胆囊收缩排空，促使胆汁浓缩淤积，升高胆固醇结石风险。",
    actionNow:
      "吃规律三餐更舒服就完全不必硬做 16+8；若想尝试限时进食，尽量把进食窗口放在白天（如早 8 点到晚 6 点）而非长期跳过早餐，且窗口期保证优质蛋白与适量健康脂肪以促进胆囊正常排空。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Liu et al., Calorie Restriction with or without Time-Restricted Eating in Weight Loss (NEJM)", year: 2022 },
      { org: "中国营养学会", title: "《中国居民膳食指南（2022）》规律进餐与合理吃早餐建议", year: 2022 },
      { org: "PubMed", title: "Prolonged fasting, rapid weight loss and gallstone disease risk: Clinical review", year: 2021 },
    ],
    redLine: "已有胆结石/胆囊炎病史、低血糖、胃溃疡、孕期哺乳期、未成年人及进食障碍史者切勿盲目轻断食；若出现右上腹隐痛、绞痛或进食油腻后恶心，请及时挂消化科/普外科就医。",
    keywords: ["16+8", "轻断食", "间歇性断食", "不吃早饭", "胆结石", "胆囊", "暴食", "减脂"],
  },
  {
    slug: "train-to-failure-rir",
    track: "fitness",
    shortTag: "每组必须练到力竭吗",
    question: "练力量每组都必须练到「力竭（做不动为止）」才长肌肉吗？留 1–3 次余力是不是在摸鱼？",
    verdict: "ok",
    verdictLabel: "不必组组力竭，留 1–3 次余力效果几乎一样",
    reassurance: "留 1–3 次余力（RIR 1–3）绝不是摸鱼！研究反复证实，只要动作到位、总训练量够，不必把每一组都拼到脸憋红、动作变形才长肌肉。",
    debate: {
      sideA: "每组不练到彻底做不动就是划水，肌肉根本收不到刺激！",
      sideB: "组组力竭疲劳感炸裂还伤关节，留 1–3 次余力反而总容量更高、恢复更快。",
    },
    science:
      "PubMed 多项抗阻训练荟萃分析与剂量反应回归（Schoenfeld、Vieira、Robinson 等）表明，当总训练容量相当时，练到绝对力竭与距力竭保留 1–3 次余力（RIR）在肌肥大和最大力量增长上几乎没有显著差异；ACSM 抗阻处方共识也指出，长期组组力竭会大幅抬高中枢疲劳与关节负荷，反而不利动作稳定与持续进步。",
    actionNow:
      "多数正式组控制在「还能勉强再标准做 1–3 次」的强度（RIR 1–3）；想冲极限只放在相对安全的固定器械或孤立动作的最后一组，深蹲硬拉等自由重量更优先保动作标准。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Vieira et al., Effects of Resistance Training Performed to Failure or Not to Failure on Muscle Strength, Hypertrophy, and Power Output: Systematic Review & Meta-Analysis", year: 2021 },
      { org: "PubMed", title: "Robinson et al., Exploring the Dose-Response Relationship Between Estimated Resistance Training Proximity to Failure, Strength Gain, and Muscle Hypertrophy (Sports Medicine)", year: 2024 },
      { org: "ACSM", title: "Progression Models in Resistance Training for Healthy Adults", year: 2009 },
    ],
    redLine: "盲目每组硬冲力竭易导致借力代偿与急性拉伤；若训练中出现关节尖锐刺痛、弹响伴无力或腰背放射痛，应立即停止动作并在必要时挂运动医学科/骨科评估。",
    keywords: ["力竭", "练到力竭", "RIR", "保留次数", "余力", "增肌", "力量训练", "摸鱼"],
  },
  {
    slug: "sauna-suit-sweat-fat-loss",
    track: "fitness",
    shortTag: "穿暴汗服出汗多更燃脂吗",
    question: "穿暴汗服运动或蒸桑拿「出汗越多」，真的减脂更快、还能排毒吗？",
    verdict: "stop",
    verdictLabel: "出汗不等于燃脂，警惕脱水与热射病",
    reassurance: "秤上少的那一两斤全是水和盐，喝两杯水就会回来！脂肪不是靠「出汗流出去」的，强行捂汗不仅不加速减脂，还真有中暑风险。",
    debate: {
      sideA: "穿暴汗服跑半小时狂流汗、秤上立刻轻 2 斤，燃脂排毒效果翻倍！",
      sideB: "汗里 99% 是水分和电解质，暴汗服把热锁死，练到头晕差点热射病进医院。",
    },
    science:
      "ACSM 运动补液与热损伤预防立场声明明确指出，出汗只是人体蒸发散热的体温调节机制，汗液成分 99% 以上是水与电解质；不透气暴汗服阻碍汗液蒸发散热，会急剧升高核心体温、脱水、电解质紊乱与劳力性热射病风险。PubMed 代谢研究也证实，脂肪氧化后的产物约 84% 是以二氧化碳形式经呼吸排出，而非靠汗液「排毒或流油」。",
    actionNow:
      "果断收起暴汗服，换回透气速干的普通运动服，在通风环境下规律完成有氧和力量训练并小口补水；真正掉脂肪靠的是可持续的热量缺口与规律运动，不是比谁出汗多。本站零带货，不推任何运动服饰或排汗产品。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "Exercise and Fluid Replacement & Exertional Heat Illness Position Stands", year: 2021 },
      { org: "PubMed", title: "Meerman & Brown, When somebody loses weight, where does the fat go? (BMJ)", year: 2014 },
      { org: "PubMed", title: "Physiological strain and energy expenditure responses to exercising in a sauna suit", year: 2018 },
      { org: "WHO", title: "Heatwaves: How to stay cool（热射病急救）", year: 2024, url: "https://www.who.int/news-room/questions-and-answers/item/heatwaves-how-to-stay-cool" },
    ],
    redLine: "运动或桑拿期间或之后，若出现意识模糊、抽搐或昏迷，立即拨打 120。等待救援时，将人移至阴凉通风处，脱去多余衣物，用凉水打湿皮肤并扇风，尽快降温。不要喂水或喂药。",
    keywords: ["暴汗服", "出汗", "出汗多", "燃脂", "排毒", "桑拿", "汗蒸", "热射病", "脱水"],
  },
  {
    slug: "weights-before-cardio",
    track: "fitness",
    shortTag: "先撸铁还是先有氧",
    question: "先撸铁（力量训练）还是先有氧（跑步/椭圆机）？顺序做反了是不是白练？",
    verdict: "adjust",
    verdictLabel: "都不会白练，增肌保肌优先「先力量、后有氧」",
    reassurance: "顺序做反不会「白练」！但如果你以增肌、塑形或减脂期保住肌肉为主，把力量训练放在有氧前面，动作更稳、精力更足、受伤风险更低。",
    debate: {
      sideA: "必须先在跑步机跑 40 分钟热身再举铁，不然直接举铁会长壮。",
      sideB: "先跑完有氧糖原和精力全耗光了，举铁重量掉一截还容易动作变形拉伤。",
    },
    science:
      "PubMed 同期训练（Concurrent Training）顺序系统综述与荟萃分析指出，先做长时间耐力有氧会提前消耗肌糖原并诱发中枢神经疲劳，略微削弱随后的最大力量与爆发力表现；ACSM 综合体能处方建议按核心目标排序——以增肌、力量或减脂保肌为主时「先力量、后有氧」，以备战长跑/提升耐力成绩为主时则「先有氧、后力量」，若精力充足也可将两者错开 3–6 小时或分天进行。",
    actionNow:
      "日常减脂塑形推荐顺序：5 分钟轻度动态热身 → 力量训练（精力最满时保动作标准）→ 20–30 分钟中低强度有氧（如慢跑、快走爬坡或骑行）。想专注冲刺长跑配速的日子再把有氧放前面。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Eddens et al., The Role of Intra-Session Exercise Sequence in the Interference Effect: A Systematic Review with Meta-Analysis (Sports Medicine)", year: 2018 },
      { org: "PubMed", title: "Schumann et al., Compatibility of Concurrent Aerobic and Strength Training for Skeletal Muscle Size and Function: An Updated Systematic Review and Meta-Analysis (Sports Medicine)", year: 2022 },
      { org: "ACSM", title: "Quantity and Quality of Exercise for Developing and Maintaining Cardiorespiratory, Musculoskeletal, and Neuromotor Fitness", year: 2011 },
    ],
    redLine: "在有氧极度疲惫状态下硬上大重量深蹲、硬拉容易出现腰膝代偿拉伤；训练中若出现关节尖锐刺痛或头晕眼前发黑，应立即停止动作并休息，必要时挂运动医学科/骨科评估。",
    keywords: ["先力量还是先有氧", "先撸铁还是先跑步", "先无氧还是先有氧", "训练顺序", "同期训练", "白练", "有氧", "力量"],
  },
  {
    slug: "cold-plunge-after-lifting",
    track: "fitness",
    shortTag: "练完泡冰浴会白练吗",
    question: "练完洗冷水澡 / 泡冰水浴（Cold Plunge）能更快消炎恢复吗？还是反而让肌肉白练了？",
    verdict: "adjust",
    verdictLabel: "增肌期别在力量后立刻冰浴，错开 4–6 小时更稳",
    reassurance: "并不是「一碰凉水肌肉就没了」，但力量训练后立刻跳进冰水桶浸泡，确实会压低肌肉修复生长的信号——普通人增肌期洗个舒服的温水澡就够了！",
    debate: {
      sideA: "欧美运动员练完都在泡冰桶，消炎抗酸痛、多巴胺拉满恢复超快！",
      sideB: "研究早就证实力量后立刻泡冰水会抑制增肌信号，把今天举的铁打折扣了。",
    },
    science:
      "Roberts 等（*The Journal of Physiology*, 2015）12 周随机对照试验与 Piñero 等（*European Journal of Sport Science*, 2024）贝叶斯荟萃分析表明，抗阻训练后常规进行冰水浸泡（CWI）会通过剧烈血管收缩、下调 mTOR 蛋白合成通路与抑制卫星细胞增殖，显著削弱长期肌肥大与力量增长。它更适合职业运动员在背靠背密集比赛期换取短期酸痛缓解。",
    actionNow:
      "以增肌和力量增长为目标时，避开在撸铁后立刻泡冰浴或长时间极冷水冲淋；如果纯粹喜欢冷水浴提神，建议安排在力量训练前、训练结束 4–6 小时后，或单独放在休息日。本站零带货，不推任何冰浴桶或制冷设备。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Roberts et al., Post-exercise cold water immersion attenuates acute anabolic signalling and long-term adaptations in muscle to strength training (J Physiol)", year: 2015 },
      { org: "PubMed", title: "Piñero et al., Throwing cold water on muscle growth: A systematic review with meta-analysis of the effects of postexercise cold water immersion on resistance training-induced hypertrophy (Eur J Sport Sci)", year: 2024 },
      { org: "ACSM", title: "Recovery Strategies and Thermal Modalities in Resistance Training", year: 2021 },
    ],
    redLine: "高危安全红线：有心血管基础疾病、未控制高血压、心律失常或雷诺现象人群切勿盲目尝试骤冷冰浴；若冷水刺激后出现胸闷、心悸、呼吸困难或头晕，须立即离开冷环境保暖并就医。",
    keywords: ["冷水澡", "冰浴", "冰水浴", "Cold Plunge", "消炎", "恢复", "增肌", "mTOR", "白练"],
  },

  // ==================== 三、女性健康 · 经期、体态与饮食焦虑（10 题） ====================
  {
    slug: "period-workout-glutes-core",
    track: "women",
    shortTag: "经期能练臀腿核心吗",
    question: "生理期能不能健身？能不能练臀腿和核心？",
    verdict: "ok",
    verdictLabel: "可以练，按自己当天体感调强度",
    reassurance: "没有「经期绝对不能练」的医学禁令！体感舒服照常练完全安全，温和运动甚至能缓解痛经。",
    debate: {
      sideA: "经期必须躺平静养，练臀腿和卷腹会子宫下垂/内异症！",
      sideB: "我经期第二天照常练力量，出点汗小腹反而没那么坠了。",
    },
    science:
      "PubMed 多项系统综述与 ACOG 临床共识表明，经期（卵泡早期）女性的基础肌力并未出现必然断崖，正常抗阻与有氧训练不会造成生殖器官损伤；相反，规律的中低强度运动能促进内啡肽分泌与盆腔血流，有助减轻原发性痛经。",
    actionNow:
      "以体感为准：精力不错就正常练（可略降大重量与腹压极高的憋气动作）；如果前两天经量大、腰酸腹痛明显，放心降级为散步、拉伸或直接休息。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "McNulty et al., The Effects of Menstrual Cycle Phase on Exercise Performance in Eumenorrheic Women: Systematic Review & Meta-Analysis", year: 2020 },
      { org: "PubMed", title: "Armour et al., Exercise for Dysmenorrhoea (Cochrane Systematic Review)", year: 2019 },
      { org: "ACOG", title: "Physical Activity and Exercise Guidelines", year: 2020 },
    ],
    redLine: "若出现严重影响生活的剧烈痛经、经量异常过多（如 1–2 小时浸透卫生巾）或明显头晕乏力，应暂停训练并挂妇科排查原因。",
    keywords: ["经期", "生理期", "大姨妈", "练臀腿", "核心", "卷腹", "痛经", "能练吗"],
  },
  {
    slug: "period-iced-americano",
    track: "women",
    shortTag: "经期能喝冰美式吗",
    question: "生理期喝冰美式 / 吃冰的，真的会伤子宫或加重痛经吗？",
    verdict: "adjust",
    verdictLabel: "不会「冻伤子宫」，看个人肠胃耐受",
    reassurance: "不存在冰水直接流进子宫把子宫冻坏的事！喝了没事就别焦虑，喝了肚子不舒服就换热的。",
    debate: {
      sideA: "经期喝一口冰美式就宫寒、血块变多、痛经加重！",
      sideB: "好多女生经期照常喝冰美式吃冰淇淋，一点事也没有。",
    },
    science:
      "冰饮进入食道和胃后很快被体温中和，不会直接降低子宫温度。但部分女性经期前列腺素水平升高，胃肠道更敏感，低温或大量咖啡因可能诱发肠痉挛、心悸或加重主观腹痛感——这属于个体敏感差异，而非普遍损伤。",
    actionNow:
      "以你自己的真实体感做决定：以前喝冰的容易肚子绞痛就换成温热美式/温水；如果平时喝了完全舒服，适量喝无需被「宫寒」吓到。",
    evidenceLevel: "有限证据",
    sources: [
      { org: "ACOG", title: "Dysmenorrhea: Painful Periods FAQ", year: 2022 },
    ],
    keywords: ["经期", "冰美式", "喝冰的", "宫寒", "痛经", "咖啡", "生理期"],
  },
  {
    slug: "pms-cravings-bloating",
    track: "women",
    shortTag: "经期前暴食水肿正常吗",
    question: "生理期前一周疯狂想吃甜食、水肿重了 3 斤，是我意志力太差吗？",
    verdict: "ok",
    verdictLabel: "100% 正常生理波动，不是你自律差",
    reassurance: "千万别骂自己管不住嘴！这是黄体期激素波动带来的正常信号，经期结束后水肿多会自然退掉。",
    debate: {
      sideA: "一到姨妈前就破功暴食，秤上多 3 斤，彻底摆烂了。",
      sideB: "黄体期激素本来就会让人馋碳水+锁水，别在这几天上秤自找焦虑。",
    },
    science:
      "黄体晚期雌激素与孕激素下降，会影响大脑血清素活性与肾素-血管紧张素水钠调节，导致对甜食/碳水渴望上升、基础代谢轻微波动及 1–3 斤水分潴留，这在育龄女性中非常普遍。",
    actionNow:
      "经前一周干脆把体重秤收起来；提前准备一点黑巧、水果、温热酸奶或复合碳水顺应食欲，减少重盐外卖，温柔度过这几天。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACOG", title: "Premenstrual Syndrome (PMS) Clinical Guidance", year: 2023 },
      { org: "PubMed", title: "Fluid retention and appetite fluctuations across the menstrual cycle", year: 2016 },
    ],
    redLine: "如果经前情绪崩溃、抑郁、失眠或失控暴食严重影响正常生活（疑似经前烦躁障碍 PMDD），建议前往妇科或心理科评估。",
    keywords: ["经期前", "黄体期", "暴食", "想吃甜食", "水肿", "重了3斤", "PMS"],
  },
  {
    slug: "women-lifting-bulky-legs",
    track: "women",
    shortTag: "女生练力量会腿粗吗",
    question: "女生练力量（深蹲 / 臀桥）会不会越练腿越粗、变成「金刚芭比」？",
    verdict: "ok",
    verdictLabel: "极难变大块头，初期「变粗」多是暂时的",
    reassurance: "女生睾酮水平只有男生的约 1/10–1/20，普通力量训练几乎不可能把你练成健美大块头。",
    debate: {
      sideA: "才练两周深蹲，大腿前侧明显变粗，赶紧停了！",
      sideB: "那是刚练完充血+体脂还没降，坚持下去线条紧致又显瘦。",
    },
    science:
      "视觉上「越练越粗」通常有三个原因：1）练后数小时的肌肉充血肿胀；2）体脂尚未明显下降时，脂肪下面多了一点紧实肌肉；3）深蹲/臀桥时臀部没充分启动，大腿前侧（股四头肌）过度代偿。",
    actionNow:
      "放心继续力量训练；如果觉得大腿前侧太酸而臀部没感觉，练前加 2 组臀桥/蚌式激活、适当放慢下放速度，并配合整体饮食控脂，围度会越来越紧致。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "Resistance Training for Women: Physiology & Myths", year: 2019 },
      { org: "PubMed", title: "Roberts et al., Sex Differences in Resistance Training Adaptations", year: 2020 },
    ],
    keywords: ["女生", "腿粗", "金刚芭比", "深蹲", "股四头肌", "代偿", "力量训练"],
  },
  {
    slug: "thick-traps-posture",
    track: "women",
    shortTag: "斜方肌厚是练背练的吗",
    question: "女生斜方肌显得很厚、脖子显短，是练背练出来的吗？",
    verdict: "ok",
    verdictLabel: "多半是圆肩驼背+耸肩紧张，不是肌肉太大",
    reassurance: "普通练背很难把上斜方肌练大！你看到的「厚」，大多数是长期低头含胸把它拉紧顶起来了。",
    debate: {
      sideA: "千万别练背练肩，斜方肌越练越大只能去打瘦肩针！",
      sideB: "我改掉耸肩、练强中下背把肩膀拉回去后，脖子反而变长了。",
    },
    science:
      "长期伏案低头看手机会导致头前引、圆肩和上斜方肌持续紧张痉挛，在锁骨上方隆起显厚；练划船或侧平举时不自觉「耸肩」也会让上斜方肌代偿紧绷。",
    actionNow:
      "训练时用轻重量练习「沉肩下压」（想象把肩膀放进裤兜），多练面拉、划船和 Y 字伸展强化中下斜方肌与菱形肌；日常把电脑屏幕垫高。本站绝不推荐任何医美注射项目。",
    evidenceLevel: "中等证据",
    sources: [
      { org: "PubMed", title: "Upper trapezius overactivity and scapular dyskinesis in neck/shoulder posture", year: 2018 },
    ],
    redLine: "若伴随持续颈肩麻木、放射性手臂疼痛，请前往康复科或骨科面诊，切勿盲目跟风医美注射。",
    keywords: ["斜方肌", "脖子短", "练背", "圆肩", "驼背", "耸肩", "瘦肩针"],
  },
  {
    slug: "quit-sugar-dairy-acne",
    track: "women",
    shortTag: "戒糖戒奶真的防长痘吗",
    question: "为了抗痘，「戒糖、戒奶」真的管用吗？连米饭都要戒吗？",
    verdict: "adjust",
    verdictLabel: "少吃高糖和部分脱脂奶有依据，但绝别戒主食",
    reassurance: "要控的是奶茶甜品这类「高 GI 精制糖」，不是让你把米饭全戒了——乱戒主食反而容易掉发乱姨妈！",
    debate: {
      sideA: "戒糖戒奶一个月皮肤直接换头，碳水全是毒药！",
      sideB: "我跟着戒主食戒到脱发闭经，痘痘照样长。",
    },
    science:
      "美国皮肤病学会（AAD）综述指出，高升糖指数（高 GI）饮食和部分人群摄入脱脂/低脂牛奶与痤疮加重存在中等相关性（可能通过胰岛素与 IGF-1 通路刺激皮脂分泌）；但长痘同时受遗传、激素、作息与毛囊角化影响，并非人人戒奶都有效。",
    actionNow:
      "先试着把含糖饮料、蛋糕零食减掉，主食换成杂粮饭/燕麦/薯类而不是断碳；如果怀疑牛奶致痘，可尝试停喝牛奶 3–4 周观察（酸奶通常影响更小），观察自身皮肤反馈。",
    evidenceLevel: "中等证据",
    sources: [
      { org: "AAD", title: "American Academy of Dermatology: Can the right diet get rid of acne?", year: 2023, url: "https://www.aad.org/public/diseases/acne/causes/diet" },
      { org: "PubMed", title: "Juhl et al., Dairy Intake and Acne Vulgaris: A Systematic Review and Meta-Analysis", year: 2018 },
    ],
    redLine: "反复中重度痤疮、囊肿痘或伴随月经紊乱/多毛，请直接挂皮肤科（必要时查内分泌/妇科），本站不推荐护肤品与处方药。",
    keywords: ["戒糖", "戒奶", "抗痘", "长痘", "痤疮", "牛奶", "米饭", "主食"],
  },
  {
    slug: "dieting-hair-loss-amenorrhea",
    track: "women",
    shortTag: "减脂掉发/姨妈推迟警报",
    question: "女生减脂期「掉头发、大姨妈推迟或不来了」，是因为练太狠还是吃太少？",
    verdict: "stop",
    verdictLabel: "身体在拉高危警报，立刻停止极端节食",
    reassurance: "这不是「掉秤的必经过程」，而是身体能量和营养严重不够，被迫先关掉生殖和头发这类「非保命功能」。",
    debate: {
      sideA: "减肥都会掉点头发、推迟几天，瘦下来就好了。",
      sideB: "这是相对能量不足（RED-S）！拖成闭经骨密度都会掉，必须立刻恢复饮食看医生！",
    },
    science:
      "国际奥委会（IOC）运动相对能量不足（RED-S）共识明确指出：长期热量缺口过大、碳水/脂肪或铁蛋白摄入不足，会抑制下丘脑-垂体-卵巢轴导致功能性下丘脑闭经，同时诱发休止期脱发、畏寒与骨量流失。",
    actionNow:
      "立刻停止极端节食和过量有氧，恢复正常三餐（确保足够主食、优质脂肪与含铁红肉/蛋白），降低训练量，并优先去医院做基础检查。",
    evidenceLevel: "强证据",
    sources: [
      { org: "IOC", title: "2023 International Olympic Committee Consensus Statement on Relative Energy Deficiency in Sport (REDs)", year: 2023, url: "https://bjsm.bmj.com/content/57/17/1073" },
    ],
    redLine: "高危就医红线：连续闭经（或推迟超过 2–3 个月）、明显成把掉发，请务必尽快前往妇科与内分泌科检查性激素、甲功与铁蛋白，切勿自行吃网红补剂拖延。",
    keywords: ["掉发", "脱发", "闭经", "大姨妈不来", "推迟", "节食", "RED-S", "减脂"],
  },
  {
    slug: "female-body-fat-lower-better",
    track: "women",
    shortTag: "女生体脂越低越好吗",
    question: "女生体脂率越低越好吗？清晰马甲线是不是人人都能长期保持？",
    verdict: "stop",
    verdictLabel: "绝非越低越好，健康比极致低体脂更重要",
    reassurance: "女性生理上天生需要更高的必需脂肪来维持激素和骨骼健康，不必拿职业健美备赛期的体脂来焦虑自己。",
    debate: {
      sideA: "体脂刷到 16% 才高级，有马甲线才算自律。",
      sideB: "女生体脂长期压太低会怕冷、失眠、姨妈出走，根本没法长期扛。",
    },
    science:
      "ACSM 体成分标准指出，女性必需脂肪约 10%–13%，一般健康且精力充沛的体脂范围约为 20%–30%。且腹部脂肪分布与马甲线清晰度高度受基因影响，很多人健康体脂下本来就不容易常年显露刀刻腹肌。",
    actionNow:
      "把目标从「把体脂刷到某个极端数字」换成「精力充沛、月经规律、力量在涨、体态舒展」；能维持好状态的体脂才是你的最佳体脂。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACSM", title: "ACSM's Health-Related Physical Fitness Assessment Manual", year: 2021 },
    ],
    keywords: ["体脂率", "体脂", "马甲线", "越低越好", "女性体脂", "16%"],
  },
  {
    slug: "crunches-lower-belly-postpartum",
    track: "women",
    shortTag: "狂做卷腹能减肚子吗",
    question: "久坐办公或生完娃觉得小腹突出，狂做卷腹能减掉小肚子吗？",
    verdict: "adjust",
    verdictLabel: "不存在局部减脂，产后盲目卷腹反而有风险",
    reassurance: "每天 200 个卷腹不会把小肚子「烧」没，而且小腹鼓鼓的未必全是脂肪！",
    debate: {
      sideA: "跟着 7 天瘦肚子卷腹打卡，腰围立减 5 厘米！",
      sideB: "脂肪是全身一起掉的，产后有腹直肌分离还卷腹会越卷越鼓。",
    },
    science:
      "随机对照试验反复证实「不存在局部减脂」——卷腹练的是腹直肌耐力，不能定向消耗腹部皮下脂肪。此外，骨盆前倾、胀气便秘以及产后腹直肌分离都会让小腹在视觉上明显突出。",
    actionNow:
      "减肚子靠全身热量管理+全身复合力量训练+改善久坐骨盆前倾；产后女性在恢复卷腹前，先确认是否存在腹直肌分离与盆底肌薄弱。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Vispute et al., The effect of abdominal exercise on abdominal fat", year: 2011 },
      { org: "ACOG", title: "Exercise After Pregnancy", year: 2022 },
    ],
    redLine: "产后出现明显腹部中线膨出、漏尿或腰背持续疼痛，建议先挂产后康复科或妇产科评估，勿盲目跟练高腹压动作。",
    keywords: ["卷腹", "小肚子", "局部减脂", "产后", "腹直肌分离", "骨盆前倾"],
  },
  {
    slug: "tired-anti-inflammatory-supplements",
    track: "women",
    shortTag: "总累喝气血茶/抗炎补剂有用吗",
    question: "熬夜压力大之后脸黄、怎么睡都累，喝「气血茶 / 抗炎补剂」有用吗？",
    verdict: "adjust",
    verdictLabel: "没有补剂能抵消缺觉，先查睡眠与基础营养",
    reassurance: "别急着交几百块的网红补剂智商税！持续疲惫最常见的原因其实是缺觉、缺铁或蛋白吃太少。",
    debate: {
      sideA: "小红书爆火的 XX 抗炎粉/气血饮，喝完感觉气色变好了。",
      sideB: "喝了一堆瓶瓶罐罐还是累，去医院一查其实是缺铁性贫血。",
    },
    science:
      "高质量睡眠与均衡饮食（足够蛋白质、铁、维生素 D、蔬果多酚）才是抗炎和恢复精力的核心地基。市面上很多「抗炎/气血」复合粉剂缺乏高质量临床对照证据，且无法抵消长期熬夜带来的皮质醇与代谢紊乱。",
    actionNow:
      "先连续 2 周保证 7–8 小时睡眠、每天吃够肉蛋奶豆和深色蔬菜；如果睡够了依然每天极度疲惫、心慌头晕，花几十块钱去医院查个体检比买几百块补剂靠谱得多。",
    evidenceLevel: "强证据",
    sources: [
      { org: "WHO", title: "Anaemia in Women and Children Global Health Observatory", year: 2023 },
      { org: "中国营养学会", title: "《中国居民膳食指南（2022）》育龄女性铁与营养建议", year: 2022 },
    ],
    redLine: "若长期极度乏力、面色苍白、畏寒或莫名水肿，建议挂全科/内分泌科查血常规、铁蛋白、维生素 D 与甲状腺功能；本站不推荐任何补剂或茶饮品牌。",
    keywords: ["气血茶", "抗炎", "补剂", "怎么睡都累", "脸黄", "熬夜", "疲惫", "缺铁"],
  },
  {
    slug: "pelvic-fluid-cervical-ectopy",
    track: "women",
    shortTag: "体检写盆腔积液/宫颈异位严重吗",
    question: "体检 B 超写「盆腔积液」或「宫颈柱状上皮异位（旧称宫颈糜烂）」，严重吗？",
    verdict: "ok",
    verdictLabel: "多数是正常生理现象，别被吓人的旧名词吓坏",
    reassurance: "少量盆腔积液（尤其排卵期或经期前后）和单纯的宫颈柱状上皮异位，绝大多数都不是大病，更不需要盲目花钱做过度治疗。",
    debate: {
      sideA: "看到「糜烂」「积液」吓得睡不着，私立诊所说要立刻做理疗手术！",
      sideB: "三甲妇科医生看了一眼直接让我回家，说正常人排卵后本来就有一点积液。",
    },
    science:
      "「宫颈糜烂」早在第 7 版妇产科教材就已取消，规范名称叫「宫颈柱状上皮异位」，多是育龄女性雌激素充足时的正常外观；而 1–2 cm 以内的少量盆腔积液也常是排卵滤泡液或腹膜润滑液，无腹痛发热通常无需处理。",
    actionNow:
      "先看自己有没有下腹痛、异常出血、发烧或异味分泌物；无症状只需按年龄定期做正规宫颈癌筛查（TCT/HPV），切勿轻信夸大恐吓。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACOG", title: "Cervical Cancer Screening & Benign Cervical Findings", year: 2021 },
      { org: "WHO", title: "Guideline for Screening and Treatment of Cervical Pre-cancer Lesions", year: 2021 },
    ],
    redLine: "若盆腔积液量较大，或伴随下腹坠痛、发烧、同房后出血、异常分泌物，以及乳腺结节提示 BI-RADS 4 类及以上，务必前往正规医院妇科或乳腺外科面诊。",
    keywords: ["盆腔积液", "宫颈糜烂", "柱状上皮异位", "体检", "B超", "乳腺结节", "妇科体检"],
  },
  {
    slug: "vaginal-douching-wash",
    track: "women",
    shortTag: "私处需要每天用洗液冲洗吗",
    question: "女生私处需要每天用专门的洗液冲洗吗？这样是不是更干净？",
    verdict: "stop",
    verdictLabel: "不要冲洗阴道内部，温清水外洗就够了",
    reassurance: "阴道本身有以乳酸杆菌为主的「自净微生态」，天天用洗液冲反而会把好细菌一起冲掉，更容易发炎！",
    debate: {
      sideA: "每天用抑菌洗液冲洗才干净卫生、没异味。",
      sideB: "越洗越痒越反复，妇科医生让我停掉所有洗液只用清水，反而好了。",
    },
    science:
      "ACOG 临床指南明确反对常规阴道冲洗（Douching）：正常阴道呈弱酸性（pH 3.8–4.5），洗液、香皂或灌洗会破坏酸碱平衡与乳酸杆菌保护盾，反而显著升高细菌性阴道病、念珠菌感染与盆腔炎风险。",
    actionNow:
      "日常洗澡用流动温清水清洗外阴褶皱处即可，保持透气棉质内裤干燥；绝不要自行往阴道内部灌洗或塞非医嘱产品。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACOG", title: "Vaginitis & Vulvovaginal Care FAQ (Advising Against Douching)", year: 2022, url: "https://www.acog.org/womens-health/faqs/vaginitis" },
    ],
    redLine: "如果出现明显瘙痒、豆腐渣样/灰白色鱼腥味白带或排尿灼痛，请直接挂妇科做白带常规对症处理，勿自行买洗液掩盖症状。",
    keywords: ["洗液", "私处护理", "冲洗", "白带", "异味", "瘙痒", "微生态"],
  },
  {
    slug: "hpv-vaccine-over-26",
    track: "women",
    shortTag: "超过 26 岁还有必要打 HPV 疫苗吗",
    question: "超过 26 岁，或者已经有过性生活了，还有必要打 HPV 疫苗吗？",
    verdict: "ok",
    verdictLabel: "依然有保护价值，但不能替代定期筛查",
    reassurance: "当然有意义！一个人同时感染疫苗覆盖的所有高危型别的概率极低，接种依然能帮你挡住还没遇到过的型别。",
    debate: {
      sideA: "超过 26 岁或有过性生活打了就白花钱，没效果了。",
      sideB: "只要没把所有型别都感染一遍，打疫苗照样能防剩下的高危型。",
    },
    science:
      "WHO 与 ACOG 指南指出，虽然在首次性生活前接种保护效力最高，但 26–45 岁女性接种仍对未感染过的疫苗型别具有良好免疫保护。不过任何价数的疫苗都不能覆盖 100% 致癌型别，定期宫颈筛查（TCT/HPV）始终是核心防线。",
    actionNow:
      "结合自身年龄和预算评估即可，不必为了等某一种高价苗无限期空等；无论打没打疫苗，有性生活的适龄女性都要按规范定期做宫颈筛查。",
    evidenceLevel: "强证据",
    sources: [
      { org: "WHO", title: "Human Papillomavirus Vaccines: WHO Position Paper", year: 2022 },
      { org: "ACOG", title: "Human Papillomavirus Vaccination Practice Advisory", year: 2020 },
    ],
    redLine: "具体接种禁忌、孕期/哺乳期安排及异常筛查结果解读，请咨询正规接种门诊或妇科医生。",
    keywords: ["HPV", "HPV疫苗", "九价", "26岁", "性生活", "宫颈癌", "筛查"],
  },
  {
    slug: "period-delayed-one-week",
    track: "women",
    shortTag: "姨妈推迟一周要吃药催经吗",
    question: "熬夜或压力大导致大姨妈推迟了一周，要不要买点药催经？",
    verdict: "adjust",
    verdictLabel: "先排除早孕，7 天内偶尔波动别乱吃药",
    reassurance: "正常的月经周期本来就会受熬夜、出差、考试压力影响而波动 ±7 天，偶尔推迟几天先别慌，更不要自己乱买激素药催经。",
    debate: {
      sideA: "推迟 5 天急死了，上网买点黄体酮或益母草赶紧催下来。",
      sideB: "医生说有性生活先测早孕，没怀孕的话偶尔晚一周很常见，先调作息观察。",
    },
    science:
      "正常育龄女性月经周期在 21–35 天内、每次波动在 7 天以内均属常见生理范围。下丘脑对压力、睡眠剥夺与快速减重极其敏感，可能导致排卵推迟从而让经期顺延。自行服用激素类药物会打乱内分泌节律，且漏诊早孕存在风险。",
    actionNow:
      "第一步：只要近期有性生活，先用正规早孕试纸排查怀孕；第二步：排除怀孕后，若只是偶尔推迟 1 周内且无不适，调整睡眠饮食观察几天即可。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACOG", title: "Abnormal Uterine Bleeding & Menstrual Cycle Regularity", year: 2022 },
    ],
    redLine: "严禁自行网购处方药催经。若排除早孕后推迟超过 2 周以上、连续 2–3 个周期紊乱或伴随剧烈腹痛/异常出血，请直接挂妇科查 B 超与激素。",
    keywords: ["推迟", "大姨妈推迟", "催经", "黄体酮", "月经不调", "早孕"],
  },
  {
    slug: "soy-milk-breast-nodules",
    track: "women",
    shortTag: "喝豆浆会长乳腺结节吗",
    question: "女生天天喝豆浆、吃豆腐，会雌激素过高、长乳腺结节吗？",
    verdict: "ok",
    verdictLabel: "完全不会，日常吃豆制品反而友好",
    reassurance: "放心喝！豆浆里的「植物雌激素（大豆异黄酮）」和人体雌激素完全不是一回事，正常喝豆浆吃豆腐不会把乳腺结节吃出来。",
    debate: {
      sideA: "体检有乳腺结节，医生/网上说绝对不能喝豆浆吃豆腐，含雌激素！",
      sideB: "多项大型研究都给豆制品平反了，亚洲女性常吃豆制品乳腺癌风险反而更低。",
    },
    science:
      "大豆异黄酮属于植物雌激素，活性仅为人体内源雌激素的千分之一左右，且具有「双向调节」特点（体内雌激素高时反而能温和竞争受体起到缓冲作用）。美国癌症协会（ACS）与多项 PubMed 荟萃分析均证实，日常适量摄入天然豆制品对乳腺健康安全甚至有益。",
    actionNow:
      "每天喝一杯纯豆浆或吃一拳豆腐/豆干非常健康（优质植物蛋白+钙）；唯一要避开的是高浓缩「大豆异黄酮保健胶囊」，吃天然食物就行。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Soy food intake and breast cancer survival/risk: Systematic Review & Meta-analysis", year: 2019 },
      { org: "中国营养学会", title: "《中国居民膳食指南（2022）》大豆及坚果类摄入建议", year: 2022 },
    ],
    redLine: "乳腺结节具体分级（BI-RADS）复查频率请遵乳腺外科医嘱；不建议自行服用高剂量雌激素或异黄酮浓缩补剂。",
    keywords: ["豆浆", "豆腐", "豆制品", "乳腺结节", "雌激素", "大豆异黄酮"],
  },
  {
    slug: "cold-hands-dizzy-iron",
    track: "women",
    shortTag: "手脚冰凉蹲起发黑是贫血吗",
    question: "女生经常手脚冰凉、蹲下猛站起来眼前发黑，是贫血还是低血压？",
    verdict: "adjust",
    verdictLabel: "多见于体位性低血压或缺铁，花几十块查血常规最准",
    reassurance: "别盲目买一堆红糖、阿胶或网红补血饮！蹲起发黑常是体位性低血压，而育龄女性也确实高发缺铁，做个基础抽血就能一眼分清。",
    debate: {
      sideA: "这是气血虚，买点红糖膏/阿胶/补血口服液天天喝。",
      sideB: "我查了血常规和铁蛋白才发现是严重缺铁，喝一年红糖水毛用没有。",
    },
    science:
      "WHO 数据显示，全球约 30% 育龄女性存在贫血，其中缺铁性贫血占比最高（常因经血流失+红肉摄入不足）；而蹲久骤起瞬间眼前发黑，多因重力使血液短暂滞留双腿引起的「体位性低血压」。红糖含铁极低且吸收率差，根本无法补铁。",
    actionNow:
      "平时蹲起动作放慢、每天喝够水、规律吃适量瘦牛肉/猪肝/鸭血等血红素铁来源并搭配维 C 蔬果；长期头晕乏力直接去医院查「血常规 + 血清铁蛋白」。",
    evidenceLevel: "强证据",
    sources: [
      { org: "WHO", title: "Global Anaemia Estimates in Women of Reproductive Age", year: 2023 },
      { org: "中国营养学会", title: "《中国居民膳食指南（2022）》育龄女性铁摄入参考", year: 2022 },
    ],
    redLine: "若频繁眼前发黑、晕厥、爬两层楼就心慌气短或经量过大，请尽快挂全科/血液科/妇科查血常规、铁蛋白与甲功，缺铁需遵医嘱规范补铁。",
    keywords: ["手脚冰凉", "眼前发黑", "蹲起", "贫血", "低血压", "铁蛋白", "补血", "气血"],
  },
  {
    slug: "collagen-peptide-drinks",
    track: "women",
    shortTag: "25 岁后喝胶原蛋白肽有用吗",
    question: "25 岁以后喝胶原蛋白肽、抗糖饮，真的能让皮肤变紧致不长皱纹吗？",
    verdict: "adjust",
    verdictLabel: "证据有限且性价比低，防晒+睡眠+三餐蛋白强十倍",
    reassurance: "别被「25 岁胶原断崖」的焦虑话术收割！目前小样本研究虽见轻微保湿改善，但远不如做好防晒、睡够觉、三餐吃够蛋白质管用。",
    debate: {
      sideA: "25 岁不喝胶原蛋白肽和抗糖饮，30 岁脸直接垮掉！",
      sideB: "吃进肚子全消化成氨基酸了，不如省下几百块买防晒帽和鸡蛋牛肉。",
    },
    science:
      "口服胶原蛋白水解肽进入消化道后会被拆解为氨基酸和少量短肽，并不存在「喝哪补哪、直接贴回脸上」。部分由厂商资助的短周期 RCT 提示对皮肤水分/弹性有轻微统计差异，但独立高质量长期证据仍有限；而紫外线光老化才是皮肤松弛长皱纹的头号元凶（约占外源老化 80%）。",
    actionNow:
      "把钱和精力花在证据最硬的三件事上：全年物理/防晒霜防晒 + 每天吃够优质蛋白和蔬果 + 少熬夜少吃高糖零食。本站零带货，不推荐任何口服美容品牌。",
    evidenceLevel: "有限证据",
    sources: [
      { org: "AAD", title: "American Academy of Dermatology: Sun Protection & Skin Aging Evidence", year: 2023 },
      { org: "PubMed", title: "Pu et al., Effects of Oral Collagen for Skin Anti-Aging: Systematic Review and Meta-Analysis (Nutrients)", year: 2023 },
    ],
    keywords: ["胶原蛋白", "胶原蛋白肽", "抗糖饮", "25岁", "抗老", "口服美容", "智商税"],
  },
  {
    slug: "running-leak-pelvic-floor",
    track: "women",
    shortTag: "跑步跳绳时有点漏尿正常吗",
    question: "跑步、跳绳或大笑打喷嚏时有点漏尿，正常吗？没生过娃也会有吗？",
    verdict: "adjust",
    verdictLabel: "很常见但「不是只能忍」，练对盆底肌大多可明显改善",
    reassurance: "千万别觉得丢人不好意思说！不仅是产后妈妈，很多没生过娃的健身女生也会遇到「压力性尿失禁」，而且通过科学盆底训练大多能显著好转。",
    debate: {
      sideA: "生完娃/年纪大了漏点尿很正常，垫个护垫忍忍就行。",
      sideB: "我没生过娃跳绳也漏，去康复科学会正确呼吸和凯格尔训练两个月就改善了。",
    },
    science:
      "跑跳、咳嗽或大重量憋气时腹压骤增，如果底部像「弹性吊床」一样的盆底肌力量薄弱或过度紧张失衡，就可能出现少量漏尿（压力性尿失禁）。Cochrane 系统综述证实，规范的盆底肌训练（PFMT）是一线首选的非手术改善方案。",
    actionNow:
      "先暂停诱发漏尿的高冲击跳绳，训练时避免死命憋气向下压腹压；学习在呼气时轻柔向上提拉的规范盆底肌训练（而非盲目夹腿或排尿中断练习）。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Dumoulin et al., Pelvic floor muscle training versus no treatment for urinary incontinence in women (Cochrane Review)", year: 2018 },
      { org: "ACOG", title: "Urinary Incontinence in Women Practice Bulletin", year: 2022 },
    ],
    redLine: "若漏尿频率较高、伴随盆腔下坠感、排尿疼痛或产后长期未恢复，建议挂妇科泌尿门诊或盆底康复科做专业肌力评估，切勿网购来路不明的家用仪器。",
    keywords: ["漏尿", "跳绳漏尿", "跑步漏尿", "盆底肌", "凯格尔", "压力性尿失禁", "产后"],
  },
  {
    slug: "breast-hyperplasia-cancer",
    track: "women",
    shortTag: "体检查出乳腺增生严重吗",
    question: "体检超声查出「乳腺增生」，是不是离乳腺癌不远了？",
    verdict: "ok",
    verdictLabel: "绝大多数是良性生理变化，不是癌前病变",
    reassurance: "别被「增生」两个字吓哭！育龄女性里乳腺增生极其普遍，绝大多数与经前激素波动有关，并不会直接变成乳腺癌。",
    debate: {
      sideA: "体检单写着乳腺增生，搜完网上吓得一夜没睡，赶紧买疏通按摩套餐！",
      sideB: "乳腺科医生说 BI-RADS 1–2 类就是正常良性，规律作息按年复查就行。",
    },
    science:
      "医学上单纯性乳腺增生多属雌孕激素周期波动引起的良性结构变化，常表现为经前乳房胀痛、经后缓解。判断风险的核心看超声报告里的 BI-RADS 分级：1–2 类为良性，3 类绝大多数仍为良性（按医嘱短期随访即可），切勿轻信美容院「精油开背/拨筋通乳」反而可能揉伤腺体。",
    actionNow:
      "翻开报告单先看 BI-RADS 级别：1–2 类放下心来、每年常规体检复查即可，平时少熬夜少生闷气、选不勒胸的内衣；不要花冤枉钱做暴力胸部按摩。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACOG", title: "Benign Breast Conditions & Breast Imaging Reporting (BI-RADS)", year: 2021 },
      { org: "WHO", title: "Breast Cancer Early Detection & Benign Conditions Overview", year: 2023 },
    ],
    redLine: "若报告提示 BI-RADS 4 类及以上，或摸到质地硬、边界不清、无痛性肿块，以及单侧乳头血性溢液、皮肤橘皮样凹陷，请尽快挂正规医院乳腺外科面诊。",
    keywords: ["乳腺增生", "乳腺结节", "BI-RADS", "胸胀", "乳腺癌", "体检"],
  },
  {
    slug: "sports-bra-all-day",
    track: "women",
    shortTag: "运动内衣能穿一整天或睡觉吗",
    question: "运动内衣能穿一整天甚至穿着睡觉吗？运动不穿真的会下垂吗？",
    verdict: "adjust",
    verdictLabel: "运动时必穿稳支撑，练完换宽松、睡觉解开",
    reassurance: "分场景最省心：跑跳健身时一定要穿合适支撑度的运动内衣护住悬韧带，但平时和睡觉别一直穿着高强度压缩款勒自己。",
    debate: {
      sideA: "运动内衣没钢圈好舒服，我直接从早穿到晚甚至穿着睡。",
      sideB: "高强度运动内衣压迫感强，练完出汗不换又闷又勒，容易闷痘胸胀。",
    },
    science:
      "运动生物力学研究表明，跑步和跳跃时乳房上下及左右位移幅度较大，缺乏支撑会反复牵拉库珀悬韧带（Cooper's ligaments）并引发运动期乳房疼痛；但高强度压缩式运动内衣全天穿戴或潮湿久穿，容易造成局部压迫不适与皮肤闷热摩擦。",
    actionNow:
      "按运动冲击度选支撑：瑜伽/普拉提选低强度，力量/快走选中强度，跑步/跳绳选高强度；练完及时洗澡换回干爽宽松的日常内衣，睡觉尽量不穿内衣让胸部放松。",
    evidenceLevel: "中等证据",
    sources: [
      { org: "PubMed", title: "McGhee & Steele, Biomechanics of Breast Support for Active Women (Exercise and Sport Sciences Reviews)", year: 2020 },
    ],
    keywords: ["运动内衣", "下垂", "副乳", "睡觉穿内衣", "悬韧带", "胸胀"],
  },
  {
    slug: "period-checkup-reschedule",
    track: "women",
    shortTag: "经期撞上体检要改期吗",
    question: "体检刚好撞上大姨妈，抽血、B 超、妇科检查还能做吗？必须整套改期吗？",
    verdict: "adjust",
    verdictLabel: "不用整套作废，按项目「先查+后补」最省心",
    reassurance: "不用慌着把整场体检退掉！常规抽血、肝肾功、甲功和腹部/乳腺 B 超大多不受影响，把妇科、尿检和部分肿瘤标志物留到经净后再补就行。",
    debate: {
      sideA: "好不容易请假约上的体检，干脆硬着头皮把所有项目一口气查完！",
      sideB: "妇科和尿检会被经血污染，化验全白做，还可能出假阳性吓自己一跳。",
    },
    science:
      "ACOG 宫颈癌筛查指引指出，中重度经血会遮蔽宫颈细胞样本导致 TCT/HPV 不合格，且经期内诊增加不适与逆行感染风险；临床检验文献也表明，经血污染尿液易造成红细胞、隐血及蛋白假阳性，同时血清 CA-125 在经期常出现生理性升高，易引发虚惊。",
    actionNow:
      "提前告知体检中心正处经期：当天照常做常规生化抽血（血糖/血脂/肝肾功/甲功）、心电图、胸片与腹部/甲状腺 B 超；将妇科内诊、白带、TCT/HPV、尿常规、便常规及 CA-125 延至经期完全干净 3–7 天后再补做。",
    evidenceLevel: "强证据",
    sources: [
      { org: "ACOG", title: "Cervical Cancer Screening Clinical Guidance & Specimen Adequacy", year: 2021 },
      { org: "PubMed", title: "Menstrual cycle fluctuations in serum CA-125 and menstrual blood contamination in urinalysis", year: 2019 },
    ],
    redLine: "具体体检改期与补检规则以体检中心及医生通知为准；若经期伴随异常大量出血、剧烈腹痛或明显头晕，请暂缓空腹抽血体检并优先挂妇科面诊。",
    keywords: ["经期体检", "生理期体检", "大姨妈体检", "抽血", "B超", "尿常规", "妇科检查", "改期", "CA125", "TCT"],
  },
  {
    slug: "false-wide-hips-correction",
    track: "women",
    shortTag: "假胯宽能靠矫正操练没吗",
    question: "女生「假胯宽」靠网红矫正操能练没吗？绑腿带、徒手正骨有用吗？",
    verdict: "adjust",
    verdictLabel: "骨头按不小，练强臀中肌+改步态能改善视觉",
    reassurance: "先放下焦虑！「假胯宽」并不是医学病名，成年骨骼绝不可能被绑带绑小或徒手按进去，但练对臀腿和体态确实能让线条变顺、显腿长。",
    debate: {
      sideA: "每天戴骨盆矫正带+跟着做 10 分钟瘦胯操，一周就能把骨头收回去！",
      sideB: "大腿根外凸的是股骨大转子和脂肪，绑带全是智商税，练臀中肌和减脂才靠谱。",
    },
    science:
      "运动解剖与 PubMed 生物力学研究表明，视觉上大腿根外侧偏宽多由三项叠加：天生的股骨大转子骨性宽度（成年后无法靠外力缩小）、久坐与臀中肌无力引发的股骨内旋，以及大腿外侧皮下脂肪堆积。绑腿带与「徒手缩骨」既不能改变骨骼结构，过度捆绑反而可能影响局部循环。",
    actionNow:
      "省下买矫正带和正骨课的钱！日常减少跷二郎腿和内八字走路，每周 2–3 次强化臀中肌与髋外旋肌群（蚌式开合、侧向螃蟹步、单腿臀桥），配合整体控脂，臀线上移后视觉比例会自然变顺。本站零带货，不推任何塑形器械、正骨课程或医美项目。",
    evidenceLevel: "中等证据",
    sources: [
      { org: "PubMed", title: "Powers CM, The Influence of Abnormal Hip Mechanics on Knee and Lower Extremity Alignment (JOSPT)", year: 2010 },
      { org: "ACSM", title: "Resistance Training & Neuromuscular Control for Lower Extremity Alignment", year: 2020 },
    ],
    redLine: "若伴随髋关节持续弹响疼痛、步态明显跛行或下肢麻木，请前往正规医院骨科或康复医学科评估，切勿接受暴力徒手正骨。",
    keywords: ["假胯宽", "妈妈臀", "股骨大转子", "股骨内旋", "臀中肌", "骨盆矫正带", "绑腿带", "徒手正骨"],
  },
  {
    slug: "daily-panty-liners-underwear",
    track: "women",
    shortTag: "非经期能天天垫护垫吗",
    question: "非经期天天垫护垫防白带弄脏内裤，真的更卫生吗？内裤必须手洗、三个月一换吗？",
    verdict: "adjust",
    verdictLabel: "别天天垫护垫捂着，穿纯棉透气内裤并晒干就好",
    reassurance: "非经期有少量透明或乳白色、无异味的分泌物完全正常，不必为了隔绝它天天贴护垫把私处捂在闷热环境里！",
    debate: {
      sideA: "内裤沾到白带好脏，天天贴护垫才精致卫生，而且内裤绝不能机洗！",
      sideB: "天天垫护垫底部塑料膜不透气，又闷又潮反而反复得霉菌性阴道炎。",
    },
    science:
      "ACOG 外阴阴道护理指引建议日常穿透气纯棉内裤、减少局部潮湿闷热并避免含香精产品。PubMed 临床综述指出，虽然健康人群短期使用透气护垫未必直接致病，但对有复发性外阴阴道假丝酵母菌病（霉菌性阴道炎）倾向或湿热环境下的人群，长期封闭闷热与摩擦会削弱局部皮肤屏障、诱发反复不适。至于内裤清洁，关键在于「单独清洗、充分漂净与彻底干燥（日晒或高温烘干）」，而非纠结必须手洗。",
    actionNow:
      "护垫只留给经期最后两天少量点滴或长途出行应急（并勤换无香透气款）；日常直接穿宽松纯棉内裤，每日换洗（手洗或单独筒高温/除菌机洗均可），通风晒干或烘干，每 3–6 个月或发现变硬发黄变形时更换。本站零带货，不推任何护垫、抑菌洗液或自检贴品牌。",
    evidenceLevel: "中等证据",
    sources: [
      { org: "ACOG", title: "Vaginitis & Vulvovaginal Care Clinical Guidance", year: 2022, url: "https://www.acog.org/womens-health/faqs/vaginitis" },
      { org: "PubMed", title: "Farage et al., Clinical and Microbiological Evaluation of Panty Liners and Vulvovaginal Health", year: 2015 },
    ],
    redLine: "若出现外阴持续瘙痒、灼痛、豆腐渣样或灰白色鱼腥味白带，切勿靠垫护垫掩盖或自行购买洗液/自检贴处理，请直接挂妇科查白带常规对症治疗。",
    keywords: ["护垫", "卫生护垫", "天天用护垫", "白带", "内裤", "内裤机洗", "三个月一换", "阴道炎"],
  },
  {
    slug: "sunscreen-indoors-cloudy",
    track: "women",
    shortTag: "阴天和室内也要涂防晒吗",
    question: "阴天和在办公室坐一天，也要每天涂防晒霜吗？不涂真的会快速光老化长斑吗？",
    verdict: "adjust",
    verdictLabel: "户外阴天与靠窗要防，远离窗户室内别焦虑",
    reassurance: "防晒确实是最硬核的抗老手段，但也不用焦虑到在拉着窗帘的室内定闹钟每 2 小时补涂一次！看紫外线指数和座位是否靠窗就行。",
    debate: {
      sideA: "阴天和办公室只要不拉窗帘都要每 2 小时补涂防晒，不然紫外线直接照老十岁！",
      sideB: "坐工位根本晒不到太阳，天天糊厚防晒再反复卸妆反而闷痘伤皮肤屏障。",
    },
    science:
      "美国皮肤病学会（AAD）指出，导致皮肤光老化与色斑的 UVA 紫外线穿透力很强：阴天云层仍可透过高达约 80% 的紫外线，普通窗玻璃也能透过大部分 UVA。但世界卫生组织（WHO）紫外线指数（UVI）指引同样明确：户外 UVI ≥ 3 时需要严格防晒；若全天身处远离窗户的室内且 UVI 极低，日常并无必要频繁补涂。",
    actionNow:
      "分场景省心做：1）白天要出门（无论晴天阴天，尤其 UVI ≥ 3）或工位紧邻大面无遮挡朝阳窗户 → 出门前涂广谱 SPF 30+ 防晒，或直接用硬防晒（遮阳伞、帽、拉百叶窗）；2）全天待在远离窗户的室内、只早晚天黑通勤 → 无需焦虑硬涂防晒，减少不必要清洁摩擦。本站零带货，不推任何防晒或卸妆品牌。",
    evidenceLevel: "强证据",
    sources: [
      { org: "AAD", title: "American Academy of Dermatology: Sunscreen FAQs & Sun Protection Guidance", year: 2023, url: "https://www.aad.org/media/stats-sunscreen" },
      { org: "WHO", title: "Ultraviolet Radiation & Global Solar UV Index Practical Guide", year: 2022 },
    ],
    redLine: "若皮肤出现短期迅速增大、边缘不规则、颜色不均、破溃或出血的色素痣/皮损，请及时前往正规医院皮肤科面诊排查。",
    keywords: ["防晒", "防晒霜", "阴天防晒", "室内防晒", "光老化", "紫外线", "UVA", "UVI"],
  },
  {
    slug: "period-wash-hair-shower",
    track: "women",
    shortTag: "生理期能洗头洗澡吗",
    question: "生理期能洗头、洗澡吗？洗头真的会「宫寒、头痛、老了落病根」吗？",
    verdict: "ok",
    verdictLabel: "放心洗！温水洗完及时吹干反而更舒服卫生",
    reassurance: "放心洗头、洗温水澡！现代医学没有任何证据表明经期洗头会导致宫寒、闭经或老了落病根，硬忍着不洗反而又油又闷更容易滋生细菌。",
    debate: {
      sideA: "老一辈说经期洗头毛孔张开，湿寒会倒灌进子宫引发痛经、闭经和偏头痛！",
      sideB: "经期本来就爱出油出汗，不洗头捂七天难受死了，温水洗完马上吹干根本没事。",
    },
    science:
      "世界卫生组织（WHO）与美国妇产科医师学会（ACOG）经期卫生管理共识指出，月经是子宫内膜周期性脱落的正常生理过程，外部温水洗头或淋浴不会改变子宫血流或引发「宫寒」。相反，经期保持外阴与全身清洁能有效降低生殖道与泌尿道感染风险，温水淋浴还能帮助放松盆底与腹部肌肉、缓解轻度痛经。所谓「经期洗头落病根」源于过去缺乏热水与吹风机的年代。",
    actionNow:
      "经期照常使用温水洗头与淋浴（避开盆浴/公共泡汤以减少逆行感染机会），洗后第一时间擦干身体、用吹风机把头皮发根彻底吹干、别顶着湿发直吹冷风即可。本站零带货，不推姜汁洗发水或暖宫产品。",
    evidenceLevel: "强证据",
    sources: [
      { org: "WHO", title: "WHO Statement on Menstrual Health and Hygiene", year: 2022 },
      { org: "ACOG", title: "Menstruation in Girls and Adolescents & Menstrual Hygiene Guidance", year: 2021 },
      { org: "PubMed", title: "Menstrual Hygiene Management and Reproductive Tract Infection Prevention: Systematic Review", year: 2019 },
    ],
    redLine: "若经期伴随持续剧烈痛经、经量异常过多（如 1–2 小时浸透卫生巾）、发热寒战或异味分泌物，请及时前往正规医院妇科就诊排查。",
    keywords: ["经期洗头", "生理期洗头", "大姨妈洗头", "经期洗澡", "宫寒", "落病根", "痛经", "吹干"],
  },

  // ==================== 四、日常普适 · 人人都关心的经典纠结（6 题） ====================
  {
    slug: "running-hurts-knees",
    track: "daily",
    shortTag: "跑步真的伤膝盖吗",
    question: "跑步到底伤不伤膝盖？是不是跑多了膝盖就废了？",
    verdict: "ok",
    verdictLabel: "规律慢跑反而护膝，久坐才更伤",
    reassurance: "放心跑！多项大型研究发现，休闲规律跑步人群的膝关节炎发生率，反而比长期久坐不动的人更低。",
    debate: {
      sideA: "楼下大爷说跑多了半月板磨没了，老了走不动路。",
      sideB: "膝盖软骨像海绵，需要适度压缩才能吸水获得营养。",
    },
    science:
      "关节软骨没有直接血管，靠规律负重挤压像海绵一样「压出旧液、吸进滑液营养」。JOSPT 荟萃分析（涵盖 11 万余人）显示，休闲跑者膝/髋关节炎患病率约 3.5%，明显低于久坐人群的 10.2%——真正伤膝盖的是体重过大突然猛加跑量、肌力不足或带伤硬跑。",
    actionNow:
      "从慢跑/快走交替起步，每周跑量增幅不超过 10%，顺手配合每周 2 次臀腿力量训练给膝盖「减震」。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Alentorn-Geli et al., The Association of Recreational and Competitive Running With Hip and Knee Osteoarthritis (JOSPT)", year: 2017 },
      { org: "ACSM", title: "Exercise and Osteoarthritis Clinical Consensus", year: 2020 },
    ],
    redLine: "如果跑步时或跑后出现膝盖持续锐痛、肿胀、卡顿或上下楼明显刺痛，请先停跑并挂运动医学科/骨科评估。",
    keywords: ["跑步", "伤膝盖", "膝盖", "半月板", "关节炎", "慢跑"],
  },
  {
    slug: "ten-thousand-steps",
    track: "daily",
    shortTag: "每天必须走够一万步吗",
    question: "每天必须走够一万步才健康吗？微信步数没破万今天白走了？",
    verdict: "ok",
    verdictLabel: "不用死磕一万步，7,000–8,000 步收益已接近封顶",
    reassurance: "「日行万步」最早只是 1965 年日本计步器的营销口号！每天多走 2,000 步就已经开始显著获益了。",
    debate: {
      sideA: "不到一万步不算有效运动，睡前也要在客厅原地凑满。",
      sideB: "大规模研究显示走到 7,000–8,000 步死亡风险下降就已经非常明显了。",
    },
    science:
      "《柳叶刀·公共卫生》（Lancet Public Health）汇总 15 项队列研究（近 5 万人）指出：60 岁以上人群每天约 6,000–8,000 步、60 岁以下约 8,000–10,000 步时，全因死亡风险下降趋于平台期；从 3,000 步涨到 6,000 步的边际收益最大。",
    actionNow:
      "别被手机步数绑架：比平时每天多走 15–20 分钟（约多 2,000 步）就是实打实的进步，有空再加点力量训练更全能。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Paluch et al., Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts (Lancet Public Health)", year: 2022 },
      { org: "WHO", title: "Guidelines on Physical Activity and Sedentary Behaviour", year: 2020 },
    ],
    keywords: ["一万步", "10000步", "步数", "走路", "微信步数", "散步"],
  },
  {
    slug: "egg-yolk-cholesterol",
    track: "daily",
    shortTag: "一天能吃几个蛋黄",
    question: "每天吃鸡蛋要把蛋黄扔掉吗？吃多了会不会把胆固醇吃高？",
    verdict: "ok",
    verdictLabel: "健康人每天 1–2 个全蛋完全放心",
    reassurance: "别再冤枉蛋黄扔掉了！人体血液里的胆固醇约 70%–80% 是肝脏自己合成的，不是吃个蛋黄直接涨上去的。",
    debate: {
      sideA: "蛋黄胆固醇高，吃超过 1 个就会堵血管。",
      sideB: "我天天吃 2 个水煮蛋，体检血脂照样全绿。",
    },
    science:
      "美国膳食指南与《中国居民膳食指南（2022）》均已取消对健康人群「膳食胆固醇上限 300mg」的死规定。真正推高坏胆固醇（LDL-C）的头号元凶是饱和脂肪和反式脂肪，而不是水煮蛋里的蛋黄（蛋黄还富含卵磷脂、胆碱与维生素 D）。",
    actionNow:
      "健康成年人每天吃 1–2 个全蛋（水煮、蒸蛋、少油煎蛋）非常稳妥；把注意力放在少吃油炸糕点和肥肉上更有用。",
    evidenceLevel: "强证据",
    sources: [
      { org: "中国营养学会", title: "《中国居民膳食指南（2022）》蛋类摄入建议", year: 2022 },
      { org: "PubMed", title: "Drouin-Chartier et al., Egg consumption and risk of cardiovascular disease (BMJ)", year: 2020 },
    ],
    redLine: "已确诊高胆固醇血症、冠心病或糖尿病患者，每日蛋黄及饮食控脂方案请遵心内科/营养科医生建议。",
    keywords: ["蛋黄", "鸡蛋", "胆固醇", "血脂", "水煮蛋"],
  },
  {
    slug: "bed-rest-recovery",
    track: "daily",
    shortTag: "受伤或术后躺着静养最好吗",
    question: "扭伤、腰痛或手术之后，是不是完全卧床静养恢复最快？",
    verdict: "adjust",
    verdictLabel: "急性期短休后，在医生允许下尽早温和活动",
    reassurance: "一直躺着不动反而让肌肉像泄气的气球一样飞速流失！现代康复医学更强调「安全前提下尽早动起来」。",
    debate: {
      sideA: "伤筋动骨一百天，必须天天躺床上一点别动。",
      sideB: "骨科医生现在术后第二天就催着下床康复，躺太久反而血栓又掉肌。",
    },
    science:
      "临床研究显示，健康人完全卧床短短 7–10 天，下肢肌肉量与肌力就会出现明显下滑，同时增加下肢深静脉血栓和关节僵硬风险。除明确需要制动固定的骨折/急性期外，循序渐进的早期康复活动恢复更快。",
    actionNow:
      "遇到扭伤、腰痛或术后恢复，问清医生「什么时候可以开始、哪些动作能做」，在无剧痛范围内尽早恢复日常温和活动。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Kortebein et al., Effect of 10 days of bed rest on skeletal muscle in healthy adults (JAMA)", year: 2007 },
      { org: "ACSM", title: "Early Mobilization and Rehabilitation Principles", year: 2020 },
    ],
    redLine: "骨折、韧带撕裂、术后或急性腰椎间盘突出发作期间，所有康复启动时机必须严格遵照主治骨科/康复科医嘱。",
    keywords: ["静养", "卧床", "术后", "扭伤", "腰痛", "躺着"],
  },
  {
    slug: "weekend-catchup-sleep",
    track: "daily",
    shortTag: "周末补觉能补回熬夜吗",
    question: "工作日天天熬夜，周末狂睡到中午，能把缺的觉补回来吗？",
    verdict: "adjust",
    verdictLabel: "能稍微缓一缓，但补不满长期睡眠债",
    reassurance: "周末适度多睡 1–2 小时确实比硬扛强，但指望靠周末睡懒觉抵消周一到周五的熬夜，代谢和昼夜节律还是会吃亏。",
    debate: {
      sideA: "工作日只睡 5 小时，周六睡 12 小时就扯平了。",
      sideB: "周末越睡越昏沉，周一更起不来，还变胖。",
    },
    science:
      "《当代生物学》（Current Biology）对照实验表明，工作日长期睡眠不足即使周末放开补觉，胰岛素敏感性下降和晚间进食增多的代谢紊乱仍无法完全逆转；且周末起床时间推迟超过 2 小时会导致「社交时差」，打乱下周生物钟。",
    actionNow:
      "周末补觉尽量比平时晚起不超过 1–1.5 小时，下午实在困补个 20 分钟小睡，最治本的还是把工作日入睡时间往前挪 30 分钟。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Depner et al., Ad libitum Weekend Recovery Sleep Fails to Prevent Metabolic Dysregulation (Current Biology)", year: 2019 },
    ],
    keywords: ["补觉", "周末补觉", "熬夜", "睡眠债", "睡懒觉"],
  },
  {
    slug: "eight-cups-water",
    track: "daily",
    shortTag: "每天必须喝够 8 杯水吗",
    question: "每天必须硬灌够 8 杯水才算健康吗？喝不够会伤身体吗？",
    verdict: "ok",
    verdictLabel: "不必死磕 8 杯，看口渴感与淡柠檬尿色",
    reassurance: "别拿着大水壶硬灌自己了！蔬菜、水果、汤粥、牛奶和茶里的水全算在每日水分摄入里。",
    debate: {
      sideA: "每天必须喝满 2000ml 白开水，少一口都算缺水。",
      sideB: "每个人体重、气温、出汗量都不一样，渴了喝就行。",
    },
    science:
      "《科学》（Science）一项涵盖 5,600 余人的同位素示踪研究证实，人体每日需水量因体型、气温、湿度与运动量差异巨大，并无放之四海而皆准的「8 杯」铁律，且日常食物本身就贡献了约 20%–30% 的水分。",
    actionNow:
      "两个最靠谱的自测法：别等极度口渴才喝，日常小口常饮；看小便颜色保持在「清亮到淡柠檬黄」就说明水分刚刚好。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Yamada et al., Variation in human water turnover associated with environmental and lifestyle factors (Science)", year: 2022 },
      { org: "中国营养学会", title: "《中国居民膳食指南（2022）》饮水建议", year: 2022 },
    ],
    keywords: ["8杯水", "八杯水", "喝水", "2000ml", "补水"],
  },
  {
    slug: "fruit-dinner-fatty-liver",
    track: "daily",
    shortTag: "水果当晚饭会吃出脂肪肝吗",
    question: "晚上只吃水果当晚饭「水果代餐」，能瘦更快吗？听说反而掉肌肉还长脂肪肝？",
    verdict: "stop",
    verdictLabel: "别拿水果当正餐，易掉肌肉且过量果糖伤肝",
    reassurance: "水果很健康，但它绝不是合格的晚饭！长期只啃水果代餐，掉的往往是水分和肌肉，高糖水果吃过量还真可能把肝脏累出脂肪。",
    debate: {
      sideA: "水果 0 脂肪又清爽，晚上只吃半个西瓜或一串葡萄，掉秤飞快！",
      sideB: "水果全糖几乎没蛋白，我代餐两个月松垮掉发，体检还查出脂肪肝！",
    },
    science:
      "《中国居民膳食指南（2022）》明确指出，水果缺乏人体必需的蛋白质和必需脂肪酸，不能替代正餐，推荐成人每日鲜果摄入 200–350 克。PubMed 代谢研究也证实，过量游离果糖几乎全部由肝脏代谢，会直接促进肝脏从头脂肪合成（DNL）并升高非酒精性脂肪肝（NAFLD）风险，而长期缺蛋白会加速肌肉流失、拉低基础代谢。",
    actionNow:
      "把水果放回「两餐之间适量吃」的位置（每天 1–2 个拳头大小，优先选浆果、苹果、猕猴桃等完整鲜果，少榨汁）；晚饭踏实吃一拳优质蛋白（鱼/蛋/瘦肉/豆腐）+ 大把蔬菜 + 少量杂粮主食，瘦得更稳还不伤肝。",
    evidenceLevel: "强证据",
    sources: [
      { org: "中国营养学会", title: "《中国居民膳食指南（2022）》蔬菜水果摄入与平衡膳食建议", year: 2022 },
      { org: "PubMed", title: "Jensen et al., Fructose and Sugar: A Major Mediator of Non-Alcoholic Fatty Liver Disease (J Hepatol)", year: 2018 },
      { org: "WHO", title: "Healthy Diet Fact Sheet & Free Sugars Guidance", year: 2020 },
    ],
    redLine: "已确诊糖尿病、脂肪肝、高甘油三酯或痛风人群，每日水果品种与摄入上限请遵内分泌科或临床营养科医嘱；本站不推任何代餐粉或果蔬酵素。",
    keywords: ["水果代餐", "水果当晚饭", "吃水果减肥", "果糖", "脂肪肝", "掉肌肉", "西瓜", "晚饭"],
  },
  {
    slug: "walk-after-meal-gastroptosis",
    track: "daily",
    shortTag: "饭后散步会胃下垂吗",
    question: "吃饱后立刻散步会得「胃下垂」吗？饭后到底该坐着、靠墙站还是直接躺？",
    verdict: "ok",
    verdictLabel: "慢走不会晃出胃下垂，别立刻平躺或剧烈跑跳就行",
    reassurance: "放心走！健康人的胃由韧带和腹壁肌肉稳稳托住，饭后溜达散步绝不会把胃「晃下垂」，反而能帮你稳住餐后血糖。",
    debate: {
      sideA: "吃完饭必须坐半小时一动不动，立刻站起来走会把胃坠成胃下垂！",
      sideB: "饭后坐着不动长小肚子、躺平还反酸烧心，出门慢走 10 分钟最舒服。",
    },
    science:
      "胃下垂的主要成因是体型极度消瘦、腹壁肌群薄弱或韧带松弛，并非普通饭后缓步走所致。相反，PubMed 多项临床研究表明，餐后不久进行 10–30 分钟轻缓步行，肌肉摄取葡萄糖增加，能显著压平餐后血糖峰值并温和促进胃肠蠕动；而最不推荐的是「饭后立刻平躺」，会削弱食管下括约肌抗反流屏障，显著增加烧心反酸风险。",
    actionNow:
      "最舒服的饭后节奏：吃完别立刻平躺睡觉（建议餐后留出 2–3 小时再完全平躺），也别立刻快跑跳绳；先轻松坐着歇 10–20 分钟，再出门慢悠悠散步 10–20 分钟，消食又稳血糖。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Buffey et al., The Acute Effects of Interrupting Prolonged Sitting Time with Standing and Light-Intensity Walking on Postprandial Glucose (Sports Medicine)", year: 2022 },
      { org: "PubMed", title: "Fujiwara et al., Association between dinner-to-bed time and gastro-esophageal reflux disease (Am J Gastroenterol)", year: 2005 },
      { org: "中国营养学会", title: "《中国居民膳食指南（2022）》吃动平衡与食不过饱建议", year: 2022 },
    ],
    redLine: "已确诊胃下垂或极度消瘦人群饭后宜先短休再缓行、避免剧烈弹跳；若长期出现餐后上腹剧痛、反复反酸烧心、恶心呕吐或不明原因消瘦，请挂消化内科面诊排查。",
    keywords: ["饭后散步", "胃下垂", "饭后坐着", "饭后躺着", "反酸", "烧心", "靠墙站", "控血糖"],
  },
  {
    slug: "meal-order-veggies-first",
    track: "daily",
    shortTag: "先吃菜再吃饭能控糖吗",
    question: "饭前「先吃菜、再吃肉、最后吃主食」的吃饭顺序真的能控糖不长胖吗？还是会把胃吃坏？",
    verdict: "adjust",
    verdictLabel: "确能压平餐后血糖峰，但别空腹硬啃生冷菜",
    reassurance: "「菜→肉→饭」确实有扎实临床研究撑腰，能让你饭后更少犯困、血糖更稳；但它不是无视总热量的减肥魔法，肠胃偏弱的人也完全不必空腹硬啃冰凉沙拉。",
    debate: {
      sideA: "按菜→肉→饭的顺序吃，餐后血糖稳如直线、不犯困还能自然瘦下来！",
      sideB: "胃不好的人空腹先吃一大碗生冷蔬菜直接胃胀反酸，减肥最后还不是看总热量。",
    },
    science:
      "Shukla 等（*Diabetes Care*, 2015 及后续 *BMJ Open Diabetes Res Care* 交叉对照试验）证实，在食物内容与总热量完全相同的前提下，先吃富含膳食纤维的非淀粉蔬菜与优质蛋白质、最后吃碳水主食，能延缓胃排空并促进 GLP-1 饱腹激素分泌，显著压低餐后血糖与胰岛素峰值。但减脂仍取决于全天总能量平衡，且慢性胃炎或消化功能较弱者空腹吃大量生冷粗纤维易引起腹胀不适。",
    actionNow:
      "想稳血糖、减少午后饭困：先吃几口温热熟蔬菜和瘦肉/鱼蛋/豆腐，再把米饭面条等主食放在后半程搭配着吃，细嚼慢咽；胃肠敏感者选清炒或焯水熟菜，不必机械教条地空腹狂吃生冷沙拉。本站零带货，不推控糖丸或碳水阻断剂。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Shukla et al., Food Order Has a Significant Impact on Postprandial Glucose and Insulin Levels (Diabetes Care)", year: 2015 },
      { org: "PubMed", title: "Shukla et al., Carbohydrate-last meal pattern lowers postprandial glucose and insulin excursions (BMJ Open Diabetes Res Care)", year: 2017 },
      { org: "中国营养学会", title: "《中国居民膳食指南（2022）》食物多样、合理搭配与细嚼慢咽建议", year: 2022 },
    ],
    redLine: "已确诊糖尿病且正在使用胰岛素或促泌剂降糖药者，调整进餐顺序与碳水时机时需监测血糖以防低血糖，并遵内分泌科医嘱；若长期餐后胃痛、反酸或消瘦，请挂消化内科就诊。",
    keywords: ["先吃菜还是先吃饭", "吃饭顺序", "进食顺序", "菜肉饭", "控糖", "饭困", "餐后血糖", "胃胀"],
  },
  {
    slug: "melatonin-insomnia-dependency",
    track: "daily",
    shortTag: "失眠吃褪黑素会依赖吗",
    question: "失眠熬夜靠吃「褪黑素」助眠靠谱吗？长期吃会不会产生依赖、越吃越睡不着？",
    verdict: "adjust",
    verdictLabel: "它是生物钟校时信号，不是万能安眠药",
    reassurance: "褪黑素一般不会像传统安眠药那样产生药物成瘾，但它只擅长「调时差、校生物钟」，对焦虑压力型慢性失眠往往只是隔靴搔痒，别越吃量越大！",
    debate: {
      sideA: "褪黑素是人体天然激素，安全没副作用，睡不着就天天吃几颗才踏实。",
      sideB: "我吃了一周做噩梦、白天头昏脑涨，压力失眠吃它根本不管用还越吃越焦虑。",
    },
    science:
      "PubMed 多项慢性失眠与昼夜节律系统综述指出，外源性褪黑素本质是给大脑传递「天黑了」的时间信号（Chronobiotic），对倒时差、夜班轮班或睡眠相位后移较有效；但对原发性或压力焦虑驱动的慢性失眠，它仅能轻微缩短入睡时间，长期疗效远不如一线首选的失眠认知行为疗法（CBT-I）。它虽无明显化学成瘾性，但长期盲目大剂量服用可能引发晨起嗜睡、头痛、多梦或干扰自身节律。",
    actionNow:
      "把重心放回证据最硬的睡眠节律修复：固定每天起床时间、早晨醒后尽早接触自然光照 15–30 分钟、下午少碰咖啡因、睡前 1 小时远离强光刷手机。本站零带货、零用药处方，不推荐任何褪黑素软糖/补剂品牌，也不提供自行加减剂量建议。",
    evidenceLevel: "强证据",
    sources: [
      { org: "PubMed", title: "Ferracioli-Oda et al., Meta-Analysis: Melatonin for the Treatment of Primary Sleep Disorders (PLoS ONE)", year: 2013 },
      { org: "PubMed", title: "Trauer et al., Cognitive Behavioral Therapy for Chronic Insomnia: A Systematic Review and Meta-analysis (Ann Intern Med)", year: 2015 },
      { org: "WHO", title: "WHO Mental Health & Non-Pharmacological First-Line Sleep Intervention Guidance", year: 2022 },
    ],
    redLine: "若每周入睡困难或早醒 ≥3 次且持续超过 3 个月，或伴随明显情绪低落、焦虑惊恐、夜间响亮打鼾与呼吸暂停，请直接前往正规医院睡眠医学科/心理科规范诊治，切勿长期自行叠加服用助眠产品。",
    keywords: ["褪黑素", "失眠", "助眠", "依赖", "成瘾", "生物钟", "倒时差", "CBT-I", "熬夜"],
  },
];

export function getDilemma(slug: string): Dilemma | undefined {
  return DILEMMAS.find((d) => d.slug === slug);
}

/** 简单高命中的本地纠结匹配（供首页即时检索与 /api/smash 双库检索） */
export function matchDilemmas(input: string, limit = 4): { d: Dilemma; score: number }[] {
  const q = input.trim().toLowerCase();
  if (!q) return [];
  const scored = DILEMMAS.map((d) => {
    let score = 0;
    const hay = `${d.shortTag} ${d.question} ${d.science} ${d.keywords.join(" ")}`.toLowerCase();
    for (const kw of d.keywords) {
      if (q.includes(kw.toLowerCase())) score += 10;
    }
    if (d.shortTag.toLowerCase().includes(q) || d.question.toLowerCase().includes(q)) {
      score += 14;
    }
    // 2-gram 重叠
    for (let i = 0; i < q.length - 1; i++) {
      const bi = q.slice(i, i + 2);
      if (/^[\u4e00-\u9fa5a-z0-9]{2}$/.test(bi) && hay.includes(bi)) score += 1.5;
    }
    return { d, score };
  })
    .filter((x) => x.score >= 3)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}
