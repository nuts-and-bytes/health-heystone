import type { Source } from "./cases";

export type AudienceId = "office" | "student" | "elder" | "fitness";

export interface Advice {
  emoji: string;
  title: string;
  dose: string;
  why: string;
  source: Source;
}

export interface Audience {
  id: AudienceId;
  label: string;
  emoji: string;
  tagline: string;
  color: string;
  dark: string;
  cases: string[];
  advice: Advice[];
}

const WHO_PA = { label: "WHO 身体活动和久坐行为指南（2020）", url: "https://www.who.int/publications/i/item/9789240015128" };
const CN_DIET = { label: "中国居民膳食指南（2022）", url: "http://dg.cnsoc.org/" };
const pubmed = (q: string) => `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(q)}`;

export const AUDIENCES: Audience[] = [
  {
    id: "office",
    label: "上班族",
    emoji: "💼",
    tagline: "久坐、外卖、熬夜三件套",
    color: "var(--blue)",
    dark: "var(--blue-dark)",
    cases: ["exercise-offsets-sitting", "10000-steps", "walk-after-meal", "weekend-sleep", "spot-reduction", "zero-sugar-drinks", "30-min-fat-burn", "8-glasses", "coffee-calcium", "coffee-heart", "skip-breakfast-fat", "late-night-meal", "tea-after-meal"],
    advice: [
      { emoji: "🪑", title: "别一坐一整天", dose: "少坐多动，坐久了起来走几分钟", why: "久坐时间越长风险越高，用任何强度的活动替代久坐都有好处。", source: WHO_PA },
      { emoji: "🚶", title: "饭后走一走", dose: "饭后慢走 10–15 分钟", why: "轻度步行能明显降低餐后血糖。", source: { label: "Buffey 等，Sports Medicine 2022", url: pubmed("Buffey acute effects interrupting prolonged sitting standing light-intensity walking 2022") } },
      { emoji: "🧩", title: "碎片时间也算数", dose: "每周累计 150–300 分钟中等强度", why: "爬楼梯、快走通勤都算，不必一次练够 30 分钟。", source: WHO_PA },
      { emoji: "😴", title: "觉别攒到周末", dose: "每晚至少 7 小时，作息尽量固定", why: "周末补觉挡不住工作日熬夜对代谢的影响。", source: { label: "Watson 等，Sleep 2015", url: pubmed("Watson recommended amount of sleep for a healthy adult consensus 2015") } },
    ],
  },
  {
    id: "student",
    label: "在校生",
    emoji: "🎒",
    tagline: "长身体、赶作业、奶茶续命",
    color: "var(--yellow)",
    dark: "var(--yellow-dark)",
    cases: ["teen-strength-height", "8-hours-sleep", "weekend-sleep", "carbs-fat", "zero-sugar-drinks", "running-knees", "30-min-fat-burn", "msg", "sugar-hyperactive", "vitamin-c-cold", "juice-detox", "sunscreen-vitamin-d"],
    advice: [
      { emoji: "⚽", title: "每天动一小时", dose: "5–17 岁：平均每天 60 分钟中高强度活动", why: "每周还应有 3 天高强度活动和强健肌肉骨骼的运动。大学生按成人标准。", source: WHO_PA },
      { emoji: "🛏️", title: "青少年要睡更多", dose: "13–18 岁：每晚 8–10 小时", why: "比成年人多。熬夜刷题的效率，往往不如睡够觉。", source: { label: "Paruthi 等，美国睡眠医学会儿童睡眠共识 2016", url: pubmed("Paruthi recommended amount of sleep for pediatric populations consensus 2016") } },
      { emoji: "🏋️", title: "力量训练不怕长不高", dose: "在指导下练，动作规范", why: "有合理指导的青少年力量训练是安全的。", source: { label: "Faigenbaum 等，NSCA 立场声明 2009", url: pubmed("Faigenbaum youth resistance training updated position statement 2009") } },
      { emoji: "🧋", title: "奶茶少点糖", dose: "添加糖每天最好不超过 25 g", why: "一杯全糖奶茶就可能超标。", source: CN_DIET },
    ],
  },
  {
    id: "elder",
    label: "中老年人",
    emoji: "🧓",
    tagline: "肌肉是晚年的养老金",
    color: "var(--green)",
    dark: "var(--green-dark)",
    cases: ["thin-when-old", "elderly-strength", "osteoporosis-strength", "bed-rest", "steps-vs-muscle", "10000-steps", "eggs-cholesterol", "red-wine", "bone-broth-calcium", "overnight-water", "coffee-heart", "sunscreen-vitamin-d"],
    advice: [
      { emoji: "💪", title: "每周练两次肌肉", dose: "每周至少 2 天力量训练", why: "从弹力带、坐站起立开始，肌肉是走路、上楼、提东西的底气。", source: WHO_PA },
      { emoji: "🦩", title: "练平衡防跌倒", dose: "65 岁以上：每周 3 天以上平衡 + 力量的综合训练", why: "跌倒是老年人受伤的重要原因，平衡训练能降低风险。", source: WHO_PA },
      { emoji: "⚖️", title: "老了别追求瘦", dose: "关注握力、走路速度，体重别掉太快", why: "65 岁以上人群，偏瘦的死亡风险反而上升。", source: { label: "Winter 等，Am J Clin Nutr 2014", url: pubmed("Winter BMI and all-cause mortality in older adults meta-analysis 2014") } },
      { emoji: "🥚", title: "蛋白质要吃够", dose: "每天一个鸡蛋，奶 300–500 g，鱼禽肉蛋适量", why: "吃够优质蛋白，配合运动才能留住肌肉。", source: CN_DIET },
    ],
  },
  {
    id: "fitness",
    label: "健身人群",
    emoji: "🏋️",
    tagline: "练得多，也要练得对",
    color: "var(--red)",
    dark: "var(--red-dark)",
    cases: ["train-to-failure", "protein-kidney", "lactic-acid", "static-stretch", "women-bulky", "spot-reduction", "carbs-fat", "running-knees", "sweat-fat-burn", "fasted-cardio", "sit-ups-back", "ice-or-heat"],
    advice: [
      { emoji: "🥩", title: "蛋白质吃够就好", dose: "每天每公斤体重 1.4–2.0 g", why: "这个范围对健康人安全有效，再多收益有限。", source: { label: "国际运动营养学会立场声明 2017", url: pubmed("International Society of Sports Nutrition position stand protein and exercise 2017") } },
      { emoji: "🔋", title: "别每组都力竭", dose: "每组结束时还能再做 1–3 下", why: "增肌效果差不多，恢复更快、受伤更少。", source: { label: "Grgic 等，J Sport Health Sci 2022", url: pubmed("Grgic resistance training performed to repetition failure or non-failure meta-analysis 2022") } },
      { emoji: "🔥", title: "热身用动态", dose: "运动前 5–10 分钟动态热身", why: "静态拉伸防伤效果不明显，力量训练本身才是防伤利器。", source: { label: "Lauersen 等，BJSM 2014", url: pubmed("Lauersen effectiveness exercise interventions prevent sports injuries 2014") } },
      { emoji: "📅", title: "每个部位一周练两次", dose: "同一肌群每周至少练 2 次", why: "比一周只练一次增肌效果更好。", source: { label: "Schoenfeld 等，Sports Medicine 2016，训练频率荟萃分析", url: pubmed("Schoenfeld effects of resistance training frequency on muscle hypertrophy meta-analysis 2016") } },
    ],
  },
];

export const getAudience = (id: string | null | undefined) => AUDIENCES.find((a) => a.id === id);

export const GENERAL_ADVICE: Advice[] = [
  { emoji: "🏃", title: "成年人的运动底线", dose: "每周 150–300 分钟中等强度 + 2 天力量训练", why: "动一点比不动好，动得越多获益越多。", source: WHO_PA },
  { emoji: "🥗", title: "每天的盘子", dose: "蔬菜不少于 300 g，水果 200–350 g", why: "深色蔬菜最好占一半。", source: CN_DIET },
  { emoji: "🧂", title: "盐和油", dose: "盐每天少于 5 g，油 25–30 g", why: "大多数人都吃超了，外卖和加工食品是大头。", source: CN_DIET },
  { emoji: "💧", title: "喝水", dose: "男性约 1700 ml，女性约 1500 ml", why: "热天和运动时多喝，看尿色调整。", source: CN_DIET },
  { emoji: "🌙", title: "睡觉", dose: "成年人每晚至少 7 小时", why: "白天不犯困，比凑够 8 小时更重要。", source: { label: "Watson 等，Sleep 2015", url: pubmed("Watson recommended amount of sleep for a healthy adult consensus 2015") } },
  { emoji: "🚭", title: "酒和烟", dose: "不吸烟，不喝酒最好", why: "WHO：不存在对健康安全的饮酒量。", source: { label: "WHO 欧洲区声明（2023）", url: "https://www.who.int/europe/news/item/04-01-2023-no-level-of-alcohol-consumption-is-safe-for-our-health" } },
];
