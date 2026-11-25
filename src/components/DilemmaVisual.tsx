"use client";

import type { Dilemma } from "@/data/dilemmas";
import StickScene from "./StickScene";

/** 为每道高频纠结匹配专属手绘橙线 <stick-scene> 互动场景（写入 AGENTS.md 铁律） */
export const SCENE_MAP: Record<string, { scene: string; caption: string }> = {
  // 健身
  "post-workout-kfc-cola": { scene: "dilemma-kfc-balance", caption: "点击看：一顿快餐 vs 一周总账天平" },
  "zero-cola-fat-loss": { scene: "dilemma-zero-cola", caption: "点击看：0卡血糖线与白开水对比" },
  "hotpot-gain-2jin": { scene: "dilemma-water-scale", caption: "点击看：水分排出后秤针自然回落" },
  "anabolic-window-30min": { scene: "dilemma-protein-window", caption: "点击看：划掉30分钟焦虑，三餐填满蛋白" },
  "alcohol-after-workout": { scene: "dopamine-lever", caption: "点击看：酒精与恢复的拉锯反应" },
  "milk-tea-fat-loss": { scene: "insulin-key", caption: "点击看：含糖奶盖 vs 纯鲜奶的血糖差别" },
  "iced-americano-preworkout": { scene: "adrenaline-alarm", caption: "点击看：咖啡因拉响交感警报的机制" },
  "fasted-cardio": { scene: "fat-tank", caption: "点击看：空腹与进食的全天总脂肪账本" },
  "eat-after-9pm-workout": { scene: "dilemma-protein-window", caption: "点击看：晚练后补足全天蛋白不额外长胖" },
  "are-supplements-necessary": { scene: "dilemma-protein-window", caption: "点击看：三餐蛋白才是 90% 地基" },
  "stay-up-late-workout": { scene: "sleep-bank", caption: "点击看：睡眠罐透支时硬练反而掉恢复" },
  "no-soreness-wasted": { scene: "lactate-doms", caption: "点击看：乳酸1小时排空，不酸照样在修复" },
  "dizzy-after-leg-day": { scene: "dilemma-red-flag", caption: "点击看：练腿发黑立刻拉下暂停键" },
  "twice-a-week-enough": { scene: "step-stairs", caption: "点击看：每周2次复合动作稳步爬坡" },
  "beginner-weight-gain": { scene: "dilemma-water-scale", caption: "点击看：新手期肌肉储水带来的假性增重" },
  "workout-with-cold": { scene: "dilemma-red-flag", caption: "点击看：发热期停练保护心肌能量条" },
  "cardio-only-no-weights": { scene: "move-push", caption: "点击看：加上基础力量稳住代谢与线条" },
  "train-sore-muscle-next-day": { scene: "bed-balloon", caption: "点击看：张弛有度，给肌纤维留出修复期" },

  // 女性
  "period-workout-glutes-core": { scene: "dilemma-period-pace", caption: "点击看：按当天体感把强度旋钮调到舒适档" },
  "period-iced-americano": { scene: "dilemma-period-pace", caption: "点击看：敏感就换温热，体感舒服别焦虑" },
  "pms-cravings-bloating": { scene: "dilemma-water-scale", caption: "点击看：黄体期锁水波动，经后自然回落" },
  "women-lifting-bulky-legs": { scene: "move-squat", caption: "点击看：标准深蹲激活臀腿，告别前侧代偿" },
  "thick-traps-posture": { scene: "dilemma-traps-posture", caption: "点击看：沉肩拉直脊柱，斜方肌立刻松下来" },
  "quit-sugar-dairy-acne": { scene: "insulin-key", caption: "点击看：高GI精制糖如何触发胰岛素通路" },
  "dieting-hair-loss-amenorrhea": { scene: "dilemma-red-flag", caption: "点击看：相对能量不足红灯，立刻恢复饮食" },
  "female-body-fat-lower-better": { scene: "dilemma-red-flag", caption: "点击看：过度压低体脂会触发能量警报" },
  "crunches-lower-belly-postpartum": { scene: "move-plank", caption: "点击看：核心稳定比盲目卷腹更护腰腹" },
  "tired-anti-inflammatory-supplements": { scene: "sleep-bank", caption: "点击看：先补满睡眠罐，比网红补剂管用十倍" },
  "pelvic-fluid-cervical-ectopy": { scene: "women-checkup-report", caption: "点击看：放大镜分清生理术语与异常复查项" },
  "vaginal-douching-wash": { scene: "women-flora-shield", caption: "点击看：拦住强力洗液，守住有益菌群保护盾" },
  "hpv-vaccine-over-26": { scene: "women-hpv-umbrella", caption: "点击看：撑开保护伞挡住未感染型别 + 定期筛查" },
  "period-delayed-one-week": { scene: "women-cycle-calendar", caption: "点击看：日历±7天正常波动窗与就医红线" },
  "soy-milk-breast-nodules": { scene: "women-soy-balance", caption: "点击看：大豆异黄酮温和双向调节，稳在安全区" },
  "cold-hands-dizzy-iron": { scene: "women-iron-battery", caption: "点击看：放慢起身 + 血常规与铁蛋白排查" },
  "collagen-peptide-drinks": { scene: "women-collagen-brick", caption: "点击看：胶原拆成普通氨基酸，防晒睡眠是真地基" },
  "running-leak-pelvic-floor": { scene: "women-pelvic-hammock", caption: "点击看：练紧盆底肌吊床，稳稳托住跑跳压力" },

  // 日常普适
  "running-hurts-knees": { scene: "knee-sponge", caption: "点击看：膝盖软骨像海绵，规律慢跑反而促营养" },
  "ten-thousand-steps": { scene: "step-stairs", caption: "点击看：步数收益阶梯，7000–8000步已很强" },
  "egg-yolk-cholesterol": { scene: "cholesterol-truck", caption: "点击看：血液胆固醇大多由肝脏自产，别冤枉蛋黄" },
  "bed-rest-recovery": { scene: "bed-balloon", caption: "点击看：长期躺床肌肉会像气球一样泄气" },
  "weekend-catchup-sleep": { scene: "sleep-bank", caption: "点击看：工作日透支睡眠，周末罐口有裂缝补不满" },
  "eight-cups-water": { scene: "dilemma-eight-cups", caption: "点击看：划掉死磕8杯水，看淡柠檬色标准" },
};

export function getDilemmaScene(slug: string) {
  return (
    SCENE_MAP[slug] ?? {
      scene: "dilemma-kfc-balance",
      caption: "点一下小人互动演示",
    }
  );
}

export default function DilemmaVisual({
  dilemma,
  height = 196,
}: {
  dilemma: Dilemma;
  height?: number;
}) {
  const cfg = getDilemmaScene(dilemma.slug);

  return (
    <StickScene
      key={dilemma.slug}
      scene={cfg.scene}
      caption={cfg.caption}
      play="click"
      height={height}
      compact
    />
  );
}
