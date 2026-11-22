import type { BodyPart } from "./cases";

export interface BodyRole {
  slug: string;
  name: string;
  en: string;
  nickname: string;
  emoji: string;
  part: BodyPart;
  oneLine: string;
  whatItDoes: string[];
  commonMyth: string;
  howToHelp: string;
  scene: string;
  sceneCaption: string;
  relatedCases: string[];
}

export const BODY_ROLES: BodyRole[] = [
  {
    slug: "adrenal",
    name: "肾上腺",
    en: "Adrenal Gland",
    nickname: "身体里的紧急警报员",
    emoji: "🚨",
    part: "spine",
    oneLine: "长在两颗肾脏头顶的小帽子，负责在紧张、危险或运动时分泌肾上腺素和皮质醇。",
    whatItDoes: [
      "遇到突发状况（比如差点被车擦到、上台演讲），它几秒内放出肾上腺素：心跳加快、血糖升高、反应变快，帮你应对危机。",
      "它还管着「皮质醇」——早上帮你清醒起床，但如果你长期熬夜、焦虑、压力爆表，警报一直关不掉，人反而容易失眠、囤肚子、免疫力下降。",
    ],
    commonMyth: "很多人把「肾上腺」和中医说的「肾虚」混为一谈，其实它是专门管激素的内分泌小器官。",
    howToHelp: "规律睡眠 + 适度运动，是帮警报器按时下班最稳的方法。",
    scene: "adrenaline-alarm",
    sceneCaption: "紧急情况拉响警报帮你冲刺；警报按时关掉，身体才能恢复。",
    relatedCases: ["weekend-sleep", "8-hours-sleep", "exercise-offsets-sitting"],
  },
  {
    slug: "cholesterol",
    name: "胆固醇",
    en: "Cholesterol",
    nickname: "被冤枉几十年的建材包工头",
    emoji: "🚛",
    part: "heart",
    oneLine: "全身每个细胞膜、很多激素和维生素 D 都离不开它，根本不是「纯坏蛋」。",
    whatItDoes: [
      "你身体里大约七成以上的胆固醇是肝脏自己造的，从鸡蛋等食物里吃进去的只占小头；吃多了一点，健康肝脏通常会自己少造一点。",
      "真正决定血管堵不堵的是「运输车」：LDL（低密度脂蛋白）负责往外送货，太多容易在血管壁堆成斑块；HDL（高密度脂蛋白）像回收车，把多余的拉回肝脏清理。",
    ],
    commonMyth: "「吃一个蛋黄胆固醇就爆表」是过时说法；更该少吃的是反式脂肪和过多饱和脂肪。",
    howToHelp: "每天一个整蛋大多安全；多吃膳食纤维和规律运动有助于改善血脂结构。",
    scene: "cholesterol-truck",
    sceneCaption: "肝脏自产大部分胆固醇；LDL 送货、橙色 HDL 回收车帮忙清理道路。",
    relatedCases: ["eggs-cholesterol", "red-wine", "carbs-fat"],
  },
  {
    slug: "insulin",
    name: "胰岛素",
    en: "Insulin",
    nickname: "给细胞开门的门禁卡",
    emoji: "🔑",
    part: "stomach",
    oneLine: "由胰腺分泌的激素，负责把血液里的葡萄糖「刷卡送进」肌肉和细胞里当燃料。",
    whatItDoes: [
      "吃完饭血糖升高，胰腺放出胰岛素去敲细胞门，血糖就能平稳降下来。",
      "如果长期暴饮暴食、少动、熬夜，细胞门锁会慢慢「生锈」（胰岛素抵抗），胰腺就得拼命加班；而饭后散步和练肌肉能帮细胞多开几扇门。",
    ],
    commonMyth: "「吃碳水就会害惨胰岛素」太极端——全谷物和适量主食消化平稳，真正让血糖坐过山车的是含糖饮料和精制甜点。",
    howToHelp: "主食粗细搭配、饭后慢走 10 分钟、每周练两次肌肉，都是给胰岛素减负。",
    scene: "insulin-key",
    sceneCaption: "橙色胰岛素门禁卡刷开细胞大门，把血液里的糖顺利送进去供能。",
    relatedCases: ["walk-after-meal", "carbs-fat", "zero-sugar-drinks"],
  },
  {
    slug: "cartilage",
    name: "关节软骨",
    en: "Articular Cartilage",
    nickname: "没有血管的活海绵",
    emoji: "🧽",
    part: "knee",
    oneLine: "包在骨头两端的顺滑缓冲垫，专门负责减震和让关节顺畅转动。",
    whatItDoes: [
      "关节软骨里几乎没有血管，没办法靠血流送营养，只能靠关节活动时「一压一松」，像海绵一样把关节液挤出又吸进去。",
      "所以适度、循序渐进的跑步和走路反而是在滋养软骨；长期久坐不动，软骨得不到挤压交换，也会变薄变脆。",
    ],
    commonMyth: "把膝盖当成「用一次少一次的汽车轮胎」——其实活体组织在合理负荷下会越用越结实。",
    howToHelp: "循序渐进加跑量、练好大腿和臀部肌肉，就是给膝盖最好的护具。",
    scene: "knee-sponge",
    sceneCaption: "每踩一步把旧液体挤出，每抬一步把新鲜关节液吸回软骨里。",
    relatedCases: ["running-knees", "static-stretch", "bed-rest"],
  },
  {
    slug: "muscle",
    name: "骨骼肌",
    en: "Skeletal Muscle",
    nickname: "晚年的隐形养老金",
    emoji: "💪",
    part: "arm",
    oneLine: "不只是好看的线条，它是你爬楼梯、防跌倒的发动机，也是全身最大的血糖仓库。",
    whatItDoes: [
      "肌肉遵循「用进废退」：不练力量、或者生病卧床十天，腿部肌肉就会肉眼可见地缩水。",
      "人过中年肌肉流失加快，肌肉太少（肌少症）会让老年的走路速度变慢、容易摔跤骨折；好消息是，哪怕七八十岁开始练，肌肉依然能长。",
    ],
    commonMyth: "「老来瘦更健康」「每天走路就够了」——走路练心肺，守住肌肉必须靠抗阻/力量训练。",
    howToHelp: "每周至少 2 次力量训练，每组留 1–3 次余力，配合吃够优质蛋白质。",
    scene: "bed-balloon",
    sceneCaption: "长期不动肌肉会像气球漏气一样变瘪，动起来才会重新充实。",
    relatedCases: ["steps-vs-muscle", "elderly-strength", "thin-when-old", "bed-rest", "lactic-acid", "train-to-failure"],
  },
  {
    slug: "melatonin",
    name: "褪黑素与生物钟",
    en: "Melatonin",
    nickname: "大脑里的关灯报时员",
    emoji: "🌙",
    part: "brain",
    oneLine: "天黑后大脑松果体分泌的信号分子，专门通知全身「天黑了，准备睡觉」。",
    whatItDoes: [
      "它不是强效安眠药，而是「报时信号」——帮你对齐昼夜节律（生物钟），尤其适合倒时差。",
      "睡前刷高亮手机屏幕，蓝光会骗过眼睛让大脑以为还是白天，把褪黑素的分泌往后推。",
    ],
    commonMyth: "「平时熬夜靠周末补觉，或者睡不着就猛吃褪黑素」——规律作息和白天晒太阳比吃补剂管用得多。",
    howToHelp: "早上见见自然光，睡前半小时调暗灯光、少看亮屏，尽量固定起床时间。",
    scene: "sleep-bank",
    sceneCaption: "工作日反复透支睡眠，周末怎么补也难把生物钟的欠账填平。",
    relatedCases: ["8-hours-sleep", "weekend-sleep"],
  },
];

export const getBodyRole = (slug: string | null | undefined) => BODY_ROLES.find((r) => r.slug === slug);
