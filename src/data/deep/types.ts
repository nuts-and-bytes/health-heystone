/**
 * 「深挖一层」内容：给想知道原理和来龙去脉的读者。
 * 每段 1–3 句，口语化中文，第一次出现的术语要顺手用大白话解释。
 * 不得编造研究、数字或引语；不确定的地方宁可写得笼统，并把 confident 设为 false。
 */
export interface DeepDive {
  slug: string;
  /** 这个说法从哪来、为什么流传这么广 */
  origin: string[];
  /** 身体里到底发生了什么（机制 / 原理） */
  mechanism: string[];
  /** 证据是怎么得来的：研究找了谁、怎么比、发现了什么（用大白话） */
  study: string[];
  /** 哪些人情况不一样，什么时候要听医生的 */
  exceptions: string[];
  /** 配套讲解动画（stick-scene 的 scene id），可选 */
  scene?: string;
  /** 动画下方一句话说明 */
  sceneCaption?: string;
  /** 内容作者对事实准确性的把握；false 表示上线前要人工复核 */
  confident: boolean;
}
