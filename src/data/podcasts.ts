export interface Chapter {
  time: string;
  title: string;
  caseSlug?: string;
}

export interface Episode {
  id: string;
  show: string;
  vol: string;
  title: string;
  guest: string;
  host: string;
  url: string;
  minutes: number;
  pubDate: string;
  hook: string;
  sections: { title: string; emoji: string; chapters: Chapter[] }[];
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
    minutes: 70,
    pubDate: "2026-10-12",
    hook: "「千金难买老来瘦」其实很糟？每天走一万步真的就健康吗？年纪大了走路变慢、容易摔跤，该怎么练？",
    sections: [
      {
        title: "人到中年，肌肉才是长期储蓄",
        emoji: "💪",
        chapters: [
          { time: "02:50", title: "为什么人到中老年，就要开始练肌肉？", caseSlug: "steps-vs-muscle" },
          { time: "05:58", title: "如果跑步和撸铁只能二选一，我会选……", caseSlug: "running-knees" },
          { time: "07:33", title: "GLP-1 减重，肌肉也不见了" },
          { time: "09:36", title: "受伤、手术以后，最该做的是尽快离开床！", caseSlug: "bed-rest" },
          { time: "18:59", title: "当 70 多岁的爸妈开始健身", caseSlug: "elderly-strength" },
        ],
      },
      {
        title: "怎么练、怎么吃，增肌才不白费",
        emoji: "🏋️",
        chapters: [
          { time: "22:35", title: "一周几练最科学？练到力竭不可取", caseSlug: "train-to-failure" },
          { time: "25:49", title: "肌肉酸痛，不是乳酸堆积那么简单", caseSlug: "lactic-acid" },
          { time: "31:39", title: "增肌该吃多少蛋白质？蛋白粉有没有必要？", caseSlug: "protein-kidney" },
          { time: "36:02", title: "骨质疏松的人，还能做力量训练吗？", caseSlug: "osteoporosis-strength" },
        ],
      },
      {
        title: "受伤别硬扛，康复也别走弯路",
        emoji: "🩼",
        chapters: [
          { time: "43:10", title: "健身最容易伤哪里？第一名不是腰和膝盖" },
          { time: "45:26", title: "运动后疼到什么程度，就该去医院？" },
          { time: "52:16", title: "如果只能练一个部位，最推荐的是这里" },
        ],
      },
      {
        title: "现场听友 Q&A",
        emoji: "🙋",
        chapters: [
          { time: "53:56", title: "严重扁平足，要穿矫正鞋垫吗？" },
          { time: "59:29", title: "爸妈不爱运动怎么办？" },
          { time: "01:02:56", title: "青少年力量训练会抑制生长发育吗？", caseSlug: "teen-strength-height" },
          { time: "01:05:31", title: "运动前热身和运动后拉伸，该怎么做？", caseSlug: "static-stretch" },
        ],
      },
    ],
  },
];
