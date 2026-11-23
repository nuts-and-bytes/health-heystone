export interface Chapter {
  time: string;
  title: string;
  caseSlug?: string;
  bodyRole?: string;
}

export interface Episode {
  id: string;
  show: string;
  vol: string;
  title: string;
  guest: string;
  host: string;
  url: string;
  audioUrl: string;
  minutes: number;
  pubDate: string;
  hook: string;
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
    url: "https://www.xiaoyuzhoufm.com/episode/6acb13cb195d838e2af00dba",
    audioUrl: "https://media.xyzcdn.net/6693ae814ce7c8de0f47e220/lr5mhJe44lcUHhzVyLy8kHZMpxdz.m4a",
    minutes: 70,
    pubDate: "2026-10-12",
    hook: "「千金难买老来瘦」其实很糟？每天走一万步真的就健康吗？年纪大了走路变慢、容易摔跤，该怎么练？",
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
    url: "https://www.xiaoyuzhoufm.com/episode/6a82cd908156bf3362199e32",
    audioUrl: "https://media.xyzcdn.net/6a6fe5f9d09f30fe00773487/liGfxnUKMog0CKhBWQhP5TWMC0dy.m4a",
    minutes: 58,
    pubDate: "2026-08-17",
    hook: "肌肉不只是审美装饰，更是人体最大的代谢与抗衰器官。协和营养科主任与运动专家从「吃」和「动」双视角讲透怎么存肌肉。",
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
    url: "https://www.xiaoyuzhoufm.com/episode/6a7033c71b5e24969ce80cd7",
    audioUrl: "https://media.xyzcdn.net/6a6fe5f9d09f30fe00773487/ljSZY-G6UJVTozfbIoJVqEuMQMKK.m4a",
    minutes: 51,
    pubDate: "2026-08-03",
    hook: "鸡蛋黄是胆固醇炸弹吗？血管斑块究竟怎么长出来的？家常炒菜为何也会藏着反式脂肪？心内科医生一次讲清血脂化验单。",
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
