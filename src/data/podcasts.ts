export interface Chapter {
  time: string;
  title: string;
  caseSlug?: string;
  bodyRole?: string;
}

export interface VisualSummary {
  headline: string;
  stats: { value: string; label: string }[];
  highlights: { tag: string; text: string; time: string }[];
  action: string;
}

export interface Episode {
  id: string;
  show: string;
  vol: string;
  title: string;
  guest: string;
  host: string;
  cover: string;
  url: string;
  audioUrl: string;
  /** 可选视频播客嵌入（B站 BV 号或 YouTube 视频 ID） */
  video?: { platform: "bilibili" | "youtube"; id: string };
  videoSearchUrl?: string;
  minutes: number;
  pubDate: string;
  hook: string;
  visualSummary: VisualSummary;
  sections: { title: string; chapters: Chapter[] }[];
}

export function timeToSec(t: string): number {
  const parts = t.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

export function secToTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(r)}` : `${pad(m)}:${pad(r)}`;
}

export const EPISODES: Episode[] = [
  {
    id: "pineapple-131",
    show: "菠萝健康派",
    vol: "vol.131",
    title: "何继业教授：想要生活有尊严，肌肉从今天开始练！",
    guest: "何继业 · 上海交通大学医学院附属新华医院骨科主任医师",
    host: "李治中（菠萝）· 杜克大学癌症生物学博士",
    cover: "/podcasts/pineapple-131.jpg",
    url: "https://www.xiaoyuzhoufm.com/episode/6acb13cb195d838e2af00dba",
    audioUrl: "https://media.xyzcdn.net/6693ae814ce7c8de0f47e220/lr5mhJe44lcUHhzVyLy8kHZMpxdz.m4a",
    videoSearchUrl: "https://search.bilibili.com/all?keyword=%E8%8F%A0%E8%90%9D%E5%81%A5%E5%BA%B7%E6%B4%BE%20%E4%BD%95%E7%BB%A7%E4%B8%9A",
    minutes: 70,
    pubDate: "2026-10-12",
    hook: "「千金难买老来瘦」其实很糟？每天走一万步真的就健康吗？年纪大了走路变慢、容易摔跤，该怎么练？",
    visualSummary: {
      headline: "人过中年，肌肉才是让你老来有尊严的长期储蓄",
      stats: [
        { value: "2次/周", label: "建议抗阻训练底线" },
        { value: "留1–3下", label: "每组别练到力竭" },
        { value: "尽早下床", label: "术后别盲目久躺" },
      ],
      highlights: [
        { tag: "跑步 vs 撸铁", text: "走路和跑步练心肺，但保住行动能力和防跌倒必须靠力量训练。", time: "05:58" },
        { tag: "术后康复", text: "受伤手术后在医生允许下尽早离床活动，久躺会迅速掉肌肉。", time: "09:36" },
        { tag: "酸痛真相", text: "运动次日酸痛不是乳酸堆积，而是肌纤维微小损伤后的修复。", time: "25:49" },
        { tag: "父母健身", text: "七十多岁和骨质疏松人群在科学指导下练力量，依然有效且安全。", time: "18:59" },
      ],
      action: "从每周两次坐站起立、扶墙俯卧撑或弹力带开始，每组留一点余力。",
    },
    sections: [
      {
        title: "人到中年，肌肉才是长期储蓄",
        chapters: [
          { time: "02:50", title: "为什么人到中老年，就要开始练肌肉？", caseSlug: "steps-vs-muscle", bodyRole: "muscle" },
          { time: "05:58", title: "如果跑步和撸铁只能二选一，我会选……", caseSlug: "running-knees" },
          { time: "07:33", title: "GLP-1 减重，肌肉也不见了" },
          { time: "09:36", title: "受伤、手术以后，最该做的是尽快离开床！", caseSlug: "bed-rest" },
          { time: "18:59", title: "当 70 多岁的爸妈开始健身", caseSlug: "elderly-strength" },
        ],
      },
      {
        title: "怎么练、怎么吃，增肌才不白费",
        chapters: [
          { time: "22:35", title: "一周几练最科学？练到力竭不可取", caseSlug: "train-to-failure" },
          { time: "25:49", title: "肌肉酸痛，不是乳酸堆积那么简单", caseSlug: "lactic-acid" },
          { time: "31:39", title: "增肌该吃多少蛋白质？蛋白粉有没有必要？", caseSlug: "protein-kidney" },
          { time: "36:02", title: "骨质疏松的人，还能做力量训练吗？", caseSlug: "osteoporosis-strength" },
        ],
      },
      {
        title: "受伤别硬扛与现场听友 Q&A",
        chapters: [
          { time: "43:10", title: "健身最容易伤哪里？第一名不是腰和膝盖" },
          { time: "45:26", title: "运动后疼到什么程度，就该去医院？", caseSlug: "ice-or-heat" },
          { time: "52:16", title: "如果只能练一个部位，最推荐的是这里" },
          { time: "53:56", title: "严重扁平足，要穿矫正鞋垫吗？" },
          { time: "59:29", title: "爸妈不爱运动怎么办？" },
          { time: "01:02:56", title: "青少年力量训练会抑制生长发育吗？", caseSlug: "teen-strength-height" },
          { time: "01:05:31", title: "运动前热身和运动后拉伸，该怎么做？", caseSlug: "static-stretch" },
        ],
      },
    ],
  },
  {
    id: "jingjuli-muscle",
    show: "健康静距离",
    vol: "存肌肉专场",
    title: "肌肉竟是抗衰器官？从吃到动教你科学存肌肉！",
    guest: "于康教授（北京协和医院临床营养科主任）· 姚宁（运动专家）",
    host: "李静 · 主持人",
    cover: "/podcasts/jingjuli-muscle.jpg",
    url: "https://www.xiaoyuzhoufm.com/episode/6a82cd908156bf3362199e32",
    audioUrl: "https://media.xyzcdn.net/6a6fe5f9d09f30fe00773487/liGfxnUKMog0CKhBWQhP5TWMC0dy.m4a",
    videoSearchUrl: "https://search.bilibili.com/all?keyword=%E5%81%A5%E5%BA%B7%E9%9D%99%E8%B7%9D%E7%A6%BB%20%E8%82%8C%E8%82%89",
    minutes: 58,
    pubDate: "2026-08-17",
    hook: "肌肉不只是审美装饰，更是人体最大的代谢与抗衰器官。协和营养科主任与运动专家从「吃」和「动」双视角讲透怎么存肌肉。",
    visualSummary: {
      headline: "囤肌肉重于囤黄金：肌肉是人体最大的抗衰代谢器官",
      stats: [
        { value: "35岁", label: "肌肉储蓄黄金峰值" },
        { value: "吃+动", label: "营养与抗阻缺一不可" },
        { value: "碎片练", label: "像吃零食一样动起来" },
      ],
      highlights: [
        { tag: "肌肉新角色", text: "肌肉直接支撑骨骼并参与血糖调控，流失远不只是没力气。", time: "01:35" },
        { tag: "误区提醒", text: "「清淡饮食」不等于只喝粥不吃肉，蛋白质吃不够肌肉留不住。", time: "38:38" },
        { tag: "减肥陷阱", text: "盲目节食和极端减肥法，减掉的往往是宝贵的肌肉而不是纯脂肪。", time: "44:03" },
        { tag: "散步不够", text: "散步和广场舞能练心肺，但要涨肌肉必须加入适度抗阻负荷。", time: "49:25" },
      ],
      action: "三餐每顿保证优质蛋白（蛋、奶、鱼肉豆），零碎时间穿插居家抗阻动作。",
    },
    sections: [
      {
        title: "为什么说肌肉是抗衰护城河",
        chapters: [
          { time: "01:35", title: "肌肉的新角色：从骨质疏松到认知功能下降，流失的代价远超想象", bodyRole: "muscle" },
          { time: "07:35", title: "35 岁肌肉峰值：肌肉银行和骨量银行一样需要提前储蓄", caseSlug: "thin-when-old" },
          { time: "11:15", title: "自测指南：在家如何判断你的肌肉是否「及格」？" },
          { time: "14:12", title: "肌肉与长寿密码：肌肉才是决定寿命和衰老的关键" },
          { time: "17:35", title: "警惕「肌少症」：为什么年轻人实测肌肉力量反而不如父辈？", caseSlug: "steps-vs-muscle" },
        ],
      },
      {
        title: "怎么吃、怎么动，肌肉才不白掉",
        chapters: [
          { time: "22:25", title: "生活化存肌肉：如何抓住肌肉储备的黄金期？" },
          { time: "26:05", title: "运动是一种思维：如何像「吃零食」一样运动？", caseSlug: "30-min-fat-burn" },
          { time: "29:55", title: "为什么天天运动，肌肉不涨反掉？" },
          { time: "33:35", title: "蛋白质怎么吃：一天几个鸡蛋、喝多少奶？于康教授量化建议", caseSlug: "eggs-cholesterol" },
          { time: "38:38", title: "误区警示：「清淡饮食」不等于只喝粥、不吃肉", caseSlug: "protein-kidney" },
          { time: "44:03", title: "减肥陷阱：盲目节食和极端减肥减掉的往往是肌肉", caseSlug: "carbs-fat" },
          { time: "49:25", title: "为什么散步和广场舞练心肺，却练不出肌肉？", caseSlug: "10000-steps" },
          { time: "52:50", title: "运动痛苦的真相：找到不痛苦的运动启动方式" },
        ],
      },
    ],
  },
  {
    id: "jingjuli-lipids",
    show: "健康静距离",
    vol: "血脂与饮食专场",
    title: "反式脂肪酸的危害有多大？关于血脂与饮食的那些问题",
    guest: "李鹤（@鹤立烟雨 · 天津市南开医院心内科主治医师）",
    host: "李静 · 主持人",
    cover: "/podcasts/jingjuli-lipids.jpg",
    url: "https://www.xiaoyuzhoufm.com/episode/6a7033c71b5e24969ce80cd7",
    audioUrl: "https://media.xyzcdn.net/6a6fe5f9d09f30fe00773487/ljSZY-G6UJVTozfbIoJVqEuMQMKK.m4a",
    videoSearchUrl: "https://search.bilibili.com/all?keyword=%E5%81%A5%E5%BA%B7%E9%9D%99%E8%B7%9D%E7%A6%BB%20%E5%8F%8D%E5%BC%8F%E8%84%82%E8%82%AA%E9%85%B8",
    minutes: 51,
    pubDate: "2026-08-03",
    hook: "鸡蛋黄是胆固醇炸弹吗？血管斑块究竟怎么长出来的？家常炒菜为何也会藏着反式脂肪？心内科医生一次讲清血脂化验单。",
    visualSummary: {
      headline: "看懂血脂化验单与反式脂肪，别再冤枉一颗鸡蛋黄",
      stats: [
        { value: "3亿人", label: "我国高血脂人群规模" },
        { value: "重点2项", label: "化验单先盯关键指标" },
        { value: "少反式", label: "警惕高温反复用油" },
      ],
      highlights: [
        { tag: "斑块机制", text: "血管斑块是长期血脂异常与炎症慢慢堆积的，早控血脂最关键。", time: "09:14" },
        { tag: "蛋黄平反", text: "控血脂不等于拒绝吃肉和蛋黄，选对优质蛋白和烹饪方式更重要。", time: "21:05" },
        { tag: "家常隐坑", text: "油温过高、反复煎炸和部分加工零食，容易藏着反式脂肪酸。", time: "27:01" },
        { tag: "更年期护心", text: "女性更年期后激素变化会让心血管风险明显上升，要定期查血脂。", time: "35:10" },
      ],
      action: "下次体检把血脂四项留存对比，家常做菜少冒烟、少买配料表含植脂末的零食。",
    },
    sections: [
      {
        title: "血管斑块与胆固醇真相",
        chapters: [
          { time: "01:58", title: "中国 3 亿人高血脂，我们为何不重视？", bodyRole: "blood-pressure" },
          { time: "05:24", title: "马拉松属于极限运动，不适合所有人", caseSlug: "running-knees" },
          { time: "09:14", title: "「斑块」究竟是怎么长出来的，会不会脱落？", bodyRole: "cholesterol" },
          { time: "17:15", title: "控血脂为什么更要好好吃肉？", caseSlug: "protein-kidney" },
          { time: "21:05", title: "蛋黄到底能不能吃？一天吃几个？", caseSlug: "eggs-cholesterol" },
        ],
      },
      {
        title: "家常菜里的坑与化验单怎么看",
        chapters: [
          { time: "27:01", title: "家常炒菜，怎么成了反式脂肪重灾区？" },
          { time: "35:10", title: "更年期女性，你的心血管风险为何翻倍？" },
          { time: "39:29", title: "拿到血脂化验单，重点看两项数值就够", bodyRole: "cholesterol" },
          { time: "42:35", title: "「AI 问诊」做参考可以，别代替去医院" },
          { time: "49:05", title: "做自己健康的 CEO" },
        ],
      },
    ],
  },
];
