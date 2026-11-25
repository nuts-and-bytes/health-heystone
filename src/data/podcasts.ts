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
  {
    id: "pineapple-141",
    show: "菠萝健康派",
    vol: "vol.141 · 女性专场",
    title: "六层楼：慌啥子嘛？痛经不用慌，但也别硬扛",
    guest: "六层楼（原北京三甲医院妇产科医生）· 陈雪",
    host: "李治中（菠萝）· 杜克大学癌症生物学博士",
    cover: "/podcasts/pineapple-131.jpg",
    url: "https://www.xiaoyuzhoufm.com/episode/6b029ee86f7bbb70cd591f45",
    audioUrl: "https://media.xyzcdn.net/6693ae814ce7c8de0f47e220/lpxV3m8UinQthNje5-SrTP0PZ2ZY.m4a",
    videoSearchUrl: "https://search.bilibili.com/all?keyword=%E8%8F%A0%E8%90%9D%E5%81%A5%E5%BA%B7%E6%B4%BE%20%E5%85%AD%E5%B1%82%E6%A5%BC%20%E7%97%9B%E7%BB%8F",
    minutes: 60,
    pubDate: "2026-11-22",
    hook: "为什么有人痛经疼得死去活来，有人却几乎没感觉？热水袋、红糖姜茶、规律走路到底哪些管用？疼痛值得被认真对待，别再默默硬扛。",
    visualSummary: {
      headline: "痛经不是「忍忍就过去」，分清轻重、科学缓解、必要时尽早就医",
      stats: [
        { value: "轻/中/重", label: "先评估痛经分级" },
        { value: "规律活动", label: "温和运动有助缓解" },
        { value: "记录症状", label: "看诊前提前记 3 件事" },
      ],
      highlights: [
        { tag: "走路缓解", text: "规律温和活动有助改善盆腔血流，经期不必绝对卧床。", time: "05:59" },
        { tag: "痛经分级", text: "痛经分轻、中、重度，严重影响生活需排查子宫内膜异位症。", time: "13:30" },
        { tag: "红糖姜茶", text: "热饮和暖宝宝主要靠热敷舒缓，红糖本身没有神奇止痛成分。", time: "30:06" },
        { tag: "豆奶谣言", text: "日常正常吃豆制品和喝牛奶，不会把雌激素吃紊乱。", time: "48:42" },
      ],
      action: "下个周期记下痛经天数、疼痛程度与经量变化；若严重影响生活，直接挂妇科规范评估。",
    },
    sections: [
      {
        title: "为什么会痛经 & 怎么评估轻重",
        chapters: [
          { time: "05:59", title: "走路就可能缓解痛经？" },
          { time: "09:07", title: "为什么每个人痛经感受不一样？暖宝宝能缓解吗？" },
          { time: "13:30", title: "痛经也分轻、中、重，什么时候绝不能硬扛？" },
          { time: "16:18", title: "为什么痛经这么难根治？生完孩子会好吗？" },
        ],
      },
      {
        title: "常见缓解办法拆解 & 看诊准备",
        chapters: [
          { time: "21:00", title: "为什么很多人宁愿硬扛也不愿规范处理？" },
          { time: "30:06", title: "红糖水、姜茶到底有没有用？" },
          { time: "32:35", title: "看医生前，应该提前记录哪些信息？" },
          { time: "39:50", title: "子宫内膜异位症、巧克力囊肿到底是啥？" },
        ],
      },
      {
        title: "女性高频 Q&A",
        chapters: [
          { time: "46:57", title: "月经推迟、提前几天，算不算月经不调？" },
          { time: "48:42", title: "豆制品、牛奶、精油会影响雌激素吗？" },
          { time: "52:17", title: "有健康困扰，问 AI 的正确方式" },
          { time: "56:50", title: "别再硬扛了！给正在痛经的女生一些建议" },
        ],
      },
    ],
  },
  {
    id: "pineapple-94",
    show: "菠萝健康派",
    vol: "vol.94 · 减脂饮食专场",
    title: "孙凌霞营养师：减肥为何掉头发？不能天天喝奶？营养避坑指南",
    guest: "孙凌霞 · 美国注册营养师",
    host: "李治中（菠萝）· 杜克大学癌症生物学博士",
    cover: "/podcasts/pineapple-131.jpg",
    url: "https://www.xiaoyuzhoufm.com/episode/69d4fa0bb977fb2c4752e1e7",
    audioUrl: "https://media.xyzcdn.net/6693ae814ce7c8de0f47e220/ln5YHjPnY9bhZTF-FHLjLxdbSD1S.m4a",
    videoSearchUrl: "https://search.bilibili.com/all?keyword=%E8%8F%A0%E8%90%9D%E5%81%A5%E5%BA%B7%E6%B4%BE%20%E5%AD%99%E5%87%8C%E9%9C%9E",
    minutes: 68,
    pubDate: "2026-04-07",
    hook: "明明吃得不少，为什么还是没力气、容易累、甚至掉头发？减肥期怎么补蛋白质？乳糖不耐怎么喝奶？补剂到底该不该买？",
    visualSummary: {
      headline: "减肥掉发、总累没劲，往往不是缺昂贵补剂，而是三餐蛋白质和基础营养没吃够",
      stats: [
        { value: "先吃够", label: "蛋白质是防掉发底线" },
        { value: "80%人缺", label: "成年人常见维生素D不足" },
        { value: "好好吃饭", label: "补剂无法替代三餐" },
      ],
      highlights: [
        { tag: "缺蛋白信号", text: "乏力、掉发、恢复慢，很多时候是日常优质蛋白质长期吃太少。", time: "04:41" },
        { tag: "减脂掉发", text: "极端节食会同时带走肌肉和头发，减脂期更要优先保住蛋白。", time: "12:42" },
        { tag: "乳糖不耐", text: "喝纯奶胀气可换酸奶、舒化奶或少量分次喝，不必一刀切戒奶。", time: "21:38" },
        { tag: "抗衰补剂", text: "网红抗衰三件套远不如先把三餐、膳食纤维和睡眠打牢。", time: "55:49" },
      ],
      action: "先核对今天三餐有没有巴掌大优质蛋白+一捧深色蔬菜，别急着为焦虑买单。",
    },
    sections: [
      {
        title: "蛋白质不够与减肥掉发真相",
        chapters: [
          { time: "04:41", title: "这些身体信号，其实是缺蛋白质！" },
          { time: "08:14", title: "植物蛋白 vs 动物蛋白，选哪个？" },
          { time: "12:42", title: "减肥，为什么让人掉头发、掉肌肉？" },
          { time: "14:21", title: "减肥期间，怎么把蛋白质吃够？" },
        ],
      },
      {
        title: "乳制品、膳食纤维与补剂避坑",
        chapters: [
          { time: "19:32", title: "作为优质蛋白，乳制品该怎么吃？" },
          { time: "21:38", title: "乳糖不耐怎么办？" },
          { time: "28:18", title: "维生素 D，80% 的成年人都缺！" },
          { time: "49:00", title: "膳食纤维王者，竟然是它们" },
          { time: "53:56", title: "好好吃饭，本身就很有用" },
          { time: "55:49", title: "传说中的抗衰三件套，值得买吗？" },
        ],
      },
    ],
  },
  {
    id: "pineapple-107",
    show: "菠萝健康派",
    vol: "vol.107 · 运动与膝盖",
    title: "何继业教授：很多人的膝盖，不是跑坏的，是养废的",
    guest: "何继业 · 上海交通大学医学院附属新华医院骨科主任医师",
    host: "李治中（菠萝）· 杜克大学癌症生物学博士",
    cover: "/podcasts/pineapple-131.jpg",
    url: "https://www.xiaoyuzhoufm.com/episode/6a1bf4ef7460cabdeb58a9b0",
    audioUrl: "https://media.xyzcdn.net/6693ae814ce7c8de0f47e220/lrj5pHtD_X7v_Z5zyInrd_QojGnN.m4a",
    minutes: 65,
    pubDate: "2026-06-01",
    hook: "跑步、深蹲和爬楼梯对膝盖有什么不同的影响？骨科医生何继业从几种常见运动聊起。可按章节收听。",
    visualSummary: {
      headline: "从跑步到下山，听何继业聊膝盖怎样承受运动负荷",
      stats: [
        { value: "65 分钟", label: "节目时长" },
        { value: "3 组", label: "章节主题" },
      ],
      highlights: [
        { tag: "跑步", text: "从跑步聊起，拆解运动与膝关节负荷的关系。", time: "15:56" },
        { tag: "运动后酸痛", text: "区分运动时的疲劳和过一段时间才出现的酸痛。", time: "26:55" },
        { tag: "深蹲与楼梯", text: "把深蹲、靠墙蹲和爬楼放在一起比较。", time: "32:36" },
        { tag: "上下坡", text: "从上下坡的区别理解膝盖与肌肉在运动中的分工。", time: "38:10" },
      ],
      action: "想先弄清跑步和膝盖的关系，可以从 15:56 听起。",
    },
    sections: [
      {
        title: "有氧、力量与跑步",
        chapters: [
          { time: "11:13", title: "有氧运动和力量训练怎样搭配？", bodyRole: "muscle" },
          { time: "15:56", title: "跑步与膝关节负荷", caseSlug: "running-knees", bodyRole: "cartilage" },
          { time: "21:03", title: "空腹跑步与减脂" },
        ],
      },
      {
        title: "酸痛、关节响与不同动作",
        chapters: [
          { time: "26:55", title: "运动后酸痛和乳酸有什么关系？", caseSlug: "lactic-acid" },
          { time: "30:14", title: "节目怎样讨论膝关节响声？" },
          { time: "32:36", title: "深蹲、靠墙蹲与爬楼的动作比较" },
          { time: "38:10", title: "上坡和下坡时，膝盖的负荷有何不同？" },
        ],
      },
      {
        title: "运动防护",
        chapters: [
          { time: "48:21", title: "常见的运动损伤与预防话题" },
        ],
      },
    ],
  },
  {
    id: "duoyizhong-sleep-04",
    show: "多一种生活",
    vol: "EP4 · 睡眠",
    title: "睡眠科医生教你睡觉，但睡不着你也别太着急",
    guest: "范滕滕 · 北京大学第六医院睡眠医学中心医生",
    host: "王卉、五月 · 三联中读",
    cover: "https://image.xyzcdn.net/FjB4jy61L3Xu7KKXcPI5RDWT2C-W.jpg@small",
    url: "https://www.xiaoyuzhoufm.com/episode/65f97003676495707943ac10",
    audioUrl: "https://media.xyzcdn.net/logx0sULJ_-XPJZIg_29yVRGDkTt.m4a",
    minutes: 66,
    pubDate: "2024-03-19",
    hook: "手环给出的睡眠分数怎么看？补觉和睡不着时的焦虑怎么理解？范滕滕医生聊日常睡眠里的常见疑问。可按章节收听。",
    visualSummary: {
      headline: "从睡眠分数、周末补觉到睡不着时的焦虑",
      stats: [
        { value: "66 分钟", label: "节目时长" },
        { value: "2 组", label: "章节主题" },
      ],
      highlights: [
        { tag: "手环", text: "聊睡眠手环测到的信息，以及它有哪些局限。", time: "07:14" },
        { tag: "补觉", text: "从生活中的作息差异聊起，看看节目怎样讨论补觉。", time: "16:23" },
        { tag: "焦虑", text: "聚焦对睡不着的担心怎样影响人入睡时的感受。", time: "22:57" },
        { tag: "酒精", text: "围绕睡前饮酒，区分入睡体验和整晚的睡眠。", time: "32:02" },
      ],
      action: "想先听睡眠手环这段，可以从 07:14 开始。",
    },
    sections: [
      {
        title: "怎样理解自己的睡眠",
        chapters: [
          { time: "01:04", title: "短睡眠的说法与个人睡眠差异", caseSlug: "8-hours-sleep" },
          { time: "07:14", title: "睡眠手环能告诉我们什么？" },
          { time: "16:23", title: "周末补觉与日常作息", caseSlug: "weekend-sleep" },
        ],
      },
      {
        title: "睡不着时的焦虑与日常习惯",
        chapters: [
          { time: "22:57", title: "睡不着和担心睡不着怎样相互影响？" },
          { time: "32:02", title: "睡前饮酒与睡眠体验" },
          { time: "45:40", title: "年纪大了，睡眠会有哪些变化？" },
        ],
      },
    ],
  },
  {
    id: "wanwu-gut-95",
    show: "万物生长FM",
    vol: "E.95 · 肠道微生物",
    title: "肠道微生物：大脑才是“第二大脑”",
    guest: "李辉 · 成都医学院副教授、生物学博士",
    host: "张红亮（玉米）· 万物生长FM",
    cover: "https://image.xyzcdn.net/FnM3QfDIDJG9n9HybyDxDtFO_O9S.jpg@small",
    url: "https://www.xiaoyuzhoufm.com/episode/674dd8f10ed328720a0a2b0e",
    audioUrl: "https://media.xyzcdn.net/ll9W3eUNn6HXbOSGVS1nBZYjzZlg.m4a",
    minutes: 60,
    pubDate: "2024-12-03",
    hook: "「脑肠轴」这个说法从哪来？研究者怎么区分相关性和因果？从微生物组研究者的视角看懂这类新闻。可按章节收听。",
    visualSummary: {
      headline: "脑肠轴是什么，肠道微生物研究又能说明什么？",
      stats: [
        { value: "60 分钟", label: "节目时长" },
        { value: "2 组", label: "章节主题" },
      ],
      highlights: [
        { tag: "脑肠轴", text: "从研究的起点认识脑肠轴这个概念。", time: "18:13" },
        { tag: "研究方向", text: "了解研究者如何观察肠道微生物与大脑的联系。", time: "21:55" },
        { tag: "验证方法", text: "听研究者讨论如何检验菌群与健康变化的关系。", time: "40:08" },
        { tag: "个体差异", text: "看看节目怎样讨论不同人的菌群组成。", time: "48:33" },
      ],
      action: "第一次听到脑肠轴，可以从 18:13 听起。",
    },
    sections: [
      {
        title: "从日常观察到脑肠轴",
        chapters: [
          { time: "06:04", title: "饮食偏好与肠道菌群的假说" },
          { time: "18:13", title: "脑肠轴概念的来历", bodyRole: "gut-microbiome" },
          { time: "21:55", title: "菌群与大脑之间有哪些研究方向？" },
        ],
      },
      {
        title: "怎样解读研究和市场宣传",
        chapters: [
          { time: "38:42", title: "把菌群研究用于临床时有哪些难点？" },
          { time: "40:08", title: "怎样验证调节菌群产生的作用？" },
          { time: "42:50", title: "菌群相关产品宣传为什么容易引发争议？" },
          { time: "48:33", title: "不同人的菌群组成有哪些差别？", bodyRole: "gut-microbiome" },
        ],
      },
    ],
  },
];
