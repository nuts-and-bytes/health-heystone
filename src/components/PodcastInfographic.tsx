"use client";

import { useRef, useState } from "react";
import type { Episode } from "@/data/podcasts";
import { timeToSec } from "@/data/podcasts";

const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

async function exportSvgToPng(svgEl: SVGSVGElement, filename: string) {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", "1080");
  clone.setAttribute("height", "1440");
  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, 1080, 1440);
    const png = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = png;
    a.download = filename;
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** 每期专属的高记忆点 3:4 视觉信息图（不是卡片列表，是真正一图胜千言的图解） */
function EpisodeVisualSvg({ ep, svgRef }: { ep: Episode; svgRef: React.RefObject<SVGSVGElement | null> }) {
  const vs = ep.visualSummary;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 800"
      className="w-full rounded-2xl border-[1.5px] border-ink bg-[#FAF8F4] shadow-sm"
      role="img"
      aria-label={`一图读懂：${ep.title}`}
    >
      {/* 纸白底 + 顶部橙色标尺 */}
      <rect width="600" height="800" fill="#FAF8F4" />
      <rect width="600" height="10" fill="#F97316" />

      {/* 顶部栏 */}
      <text x="36" y="48" fill="#C2410C" fontSize="14" fontWeight="800" fontFamily={FONT}>
        一图读懂 · {ep.show}
      </text>
      <text x="564" y="48" textAnchor="end" fill="#635B52" fontSize="13" fontWeight="600" fontFamily={FONT}>
        {ep.minutes} 分钟精华
      </text>
      <line x1="36" y1="62" x2="564" y2="62" stroke="#E4DDD3" strokeWidth="1.5" />

      {/* ─────── 单集 1：菠萝健康派 vol.131（肌肉存折曲线图解） ─────── */}
      {ep.id === "pineapple-131" && (
        <g fontFamily={FONT}>
          {/* 颠覆式主标题 */}
          <text x="36" y="112" fill="#1C1917" fontSize="32" fontWeight="900">
            千金难买老来
          </text>
          <text x="234" y="112" fill="#9A9085" fontSize="32" fontWeight="900">
            瘦
          </text>
          <line x1="228" y1="100" x2="270" y2="100" stroke="#E5484D" strokeWidth="4.5" strokeLinecap="round" />
          <text x="278" y="112" fill="#1C1917" fontSize="32" fontWeight="900">
            ？错，是老来
          </text>
          <circle cx="496" cy="100" r="24" fill="#FFEDD5" stroke="#F97316" strokeWidth="3" />
          <text x="496" y="111" textAnchor="middle" fill="#C2410C" fontSize="30" fontWeight="900">
            壮
          </text>
          <text x="36" y="146" fill="#635B52" fontSize="14" fontWeight="500">
            何继业教授（骨科主任医师）：肌肉决定老了能不能有尊严地生活
          </text>

          {/* 主视觉：肌肉存折命运曲线 */}
          <rect x="36" y="168" width="528" height="270" rx="18" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
          <text x="56" y="198" fill="#1C1917" fontSize="15" fontWeight="800">
            人一生的「肌肉存折」走势
          </text>
          {/* 虚线参考 */}
          <line x1="64" y1="395" x2="536" y2="395" stroke="#E4DDD3" strokeWidth="1.5" />
          <line x1="64" y1="260" x2="536" y2="260" stroke="#E4DDD3" strokeWidth="1" strokeDasharray="5 5" />

          {/* 灰色自然下滑线（不练力量） */}
          <path d="M 76 250 Q 220 265 340 330 T 520 382" fill="none" stroke="#B8AFA4" strokeWidth="3" strokeDasharray="6 6" />
          <text x="546" y="384" textAnchor="end" fill="#9A9085" fontSize="11.5" fontWeight="700">
            只散步 / 久躺 → 加速流失
          </text>

          {/* 卧床 10 天急跌标注 */}
          <path d="M 218 272 L 248 332" stroke="#E5484D" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="248" cy="332" r="6" fill="#E5484D" />
          <rect x="176" y="344" width="144" height="36" rx="8" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.2" />
          <text x="248" y="360" textAnchor="middle" fill="#B91C1C" fontSize="12" fontWeight="800">
            卧床10天肌肉急跌
          </text>
          <text x="248" y="374" textAnchor="middle" fill="#B91C1C" fontSize="10">
            术后允许就尽早下床
          </text>

          {/* 橙色力量训练反弹曲线 */}
          <path d="M 76 250 Q 170 245 218 272 Q 320 248 415 224 T 522 214" fill="none" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
          <circle cx="76" cy="250" r="6" fill="#1C1917" />
          <text x="76" y="236" textAnchor="middle" fill="#1C1917" fontSize="11" fontWeight="700">
            30岁峰值
          </text>
          <circle cx="370" cy="236" r="7" fill="#F97316" stroke="#1C1917" strokeWidth="2" />
          <text x="370" y="218" textAnchor="middle" fill="#C2410C" fontSize="12" fontWeight="800">
            每周2次力量（留1-3下余力）
          </text>
          <circle cx="522" cy="214" r="8" fill="#F97316" stroke="#1C1917" strokeWidth="2" />
          <text x="502" y="246" textAnchor="middle" fill="#1C1917" fontSize="12" fontWeight="800">
            70岁依然能长！
          </text>

          {/* 底部双轨对照：散步 vs 撸铁 */}
          <rect x="36" y="458" width="252" height="148" rx="16" fill="#FFFFFF" stroke="#E4DDD3" strokeWidth="1.8" />
          <text x="56" y="488" fill="#635B52" fontSize="13" fontWeight="800">
            只靠每天一万步
          </text>
          <text x="56" y="520" fill="#1C1917" fontSize="22" fontWeight="900">
            练心肺，不涨肌
          </text>
          <text x="56" y="550" fill="#635B52" fontSize="13">
            • 步数到 6000–8000 收益趋平
          </text>
          <text x="56" y="574" fill="#635B52" fontSize="13">
            • 防不住中老年肌肉流失与跌倒
          </text>

          <rect x="312" y="458" width="252" height="148" rx="16" fill="#FFF7ED" stroke="#F97316" strokeWidth="2.2" />
          <text x="332" y="488" fill="#C2410C" fontSize="13" fontWeight="800">
            加入抗阻 / 力量训练
          </text>
          <text x="332" y="520" fill="#1C1917" fontSize="22" fontWeight="900">
            保骨头 + 护关节
          </text>
          <text x="332" y="550" fill="#1C1917" fontSize="13">
            • 次日酸痛是微损伤修复，非乳酸
          </text>
          <text x="332" y="574" fill="#1C1917" fontSize="13">
            • 骨质疏松与青少年指导练都安全
          </text>
        </g>
      )}

      {/* ─────── 单集 2：健康静距离 · 存肌肉（吃动双引擎汇流图） ─────── */}
      {ep.id === "jingjuli-muscle" && (
        <g fontFamily={FONT}>
          <text x="36" y="112" fill="#1C1917" fontSize="34" fontWeight="900">
            囤肌肉，重于囤黄金
          </text>
          <text x="36" y="144" fill="#635B52" fontSize="14" fontWeight="500">
            于康教授（协和临床营养）× 姚宁：肌肉是人体最大的抗衰与代谢器官
          </text>

          {/* 左右双引擎 */}
          <rect x="36" y="172" width="248" height="220" rx="18" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
          <rect x="52" y="188" width="94" height="26" rx="8" fill="#FFEDD5" />
          <text x="99" y="206" textAnchor="middle" fill="#C2410C" fontSize="13" fontWeight="800">
            引擎 1 · 怎么吃
          </text>
          <text x="52" y="246" fill="#1C1917" fontSize="20" fontWeight="900">
            优质蛋白要吃够
          </text>
          <text x="52" y="276" fill="#15803D" fontSize="13" fontWeight="700">
            ✓ 每天整蛋 + 奶 + 鱼肉豆
          </text>
          <text x="52" y="304" fill="#B91C1C" fontSize="13" fontWeight="700">
            ✕ 「清淡」≠ 只喝粥不吃肉
          </text>
          <text x="52" y="332" fill="#B91C1C" fontSize="13" fontWeight="700">
            ✕ 盲目节食先掉宝贵肌肉
          </text>
          <text x="52" y="370" fill="#635B52" fontSize="12">
            没原料，再怎么练也长不出肌
          </text>

          <rect x="316" y="172" width="248" height="220" rx="18" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
          <rect x="332" y="188" width="94" height="26" rx="8" fill="#FFEDD5" />
          <text x="379" y="206" textAnchor="middle" fill="#C2410C" fontSize="13" fontWeight="800">
            引擎 2 · 怎么动
          </text>
          <text x="332" y="246" fill="#1C1917" fontSize="20" fontWeight="900">
            像吃零食一样抗阻
          </text>
          <text x="332" y="276" fill="#15803D" fontSize="13" fontWeight="700">
            ✓ 坐站起立 / 弹力带 / 推墙
          </text>
          <text x="332" y="304" fill="#B91C1C" fontSize="13" fontWeight="700">
            ✕ 只靠散步广场舞练不出肌
          </text>
          <text x="332" y="332" fill="#1C1917" fontSize="13" fontWeight="700">
            ★ 35岁前存峰值，中年保底盘
          </text>
          <text x="332" y="370" fill="#635B52" fontSize="12">
            给肌肉一点阻力信号才肯生长
          </text>

          {/* 向下汇流箭头 */}
          <path d="M 160 396 L 160 426 L 285 452" fill="none" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 440 396 L 440 426 L 315 452" fill="none" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" />
          <polygon points="300,464 290,448 310,448" fill="#F97316" />

          {/* 中央汇流结果：肌肉抗衰护城河 */}
          <rect x="36" y="472" width="528" height="134" rx="18" fill="#FFF7ED" stroke="#F97316" strokeWidth="2.4" />
          <text x="300" y="506" textAnchor="middle" fill="#C2410C" fontSize="14" fontWeight="800">
            双引擎汇流 → 守住三大健康护城河
          </text>
          <g textAnchor="middle">
            <text x="128" y="548" fill="#1C1917" fontSize="22" fontWeight="900">
              护骨头
            </text>
            <text x="128" y="576" fill="#635B52" fontSize="12">
              减缓骨质疏松与跌倒
            </text>
            <line x1="216" y1="526" x2="216" y2="582" stroke="#FED7AA" strokeWidth="2" />
            <text x="300" y="548" fill="#1C1917" fontSize="22" fontWeight="900">
              稳血糖
            </text>
            <text x="300" y="576" fill="#635B52" fontSize="12">
              全身最大的吃糖仓库
            </text>
            <line x1="384" y1="526" x2="384" y2="582" stroke="#FED7AA" strokeWidth="2" />
            <text x="472" y="548" fill="#1C1917" fontSize="22" fontWeight="900">
              抗衰老
            </text>
            <text x="472" y="576" fill="#635B52" fontSize="12">
              自理能力与长寿底气
            </text>
          </g>
        </g>
      )}

      {/* ─────── 单集 3：健康静距离 · 血脂与反式脂肪（血管截面+红黑榜） ─────── */}
      {ep.id === "jingjuli-lipids" && (
        <g fontFamily={FONT}>
          <text x="36" y="110" fill="#1C1917" fontSize="32" fontWeight="900">
            别冤枉鸡蛋黄，真坑在油烟里
          </text>
          <text x="36" y="144" fill="#635B52" fontSize="14" fontWeight="500">
            李鹤医生（心内科）：全国约 3 亿人高血脂，先看懂血管与化验单
          </text>

          {/* 主视觉：横贯血管截面示意图 */}
          <rect x="36" y="168" width="528" height="196" rx="18" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
          <text x="56" y="198" fill="#1C1917" fontSize="15" fontWeight="800">
            血管里的斑块是怎么慢慢长出来的？
          </text>
          {/* 血管上下壁 */}
          <line x1="60" y1="226" x2="540" y2="226" stroke="#1C1917" strokeWidth="4" />
          <line x1="60" y1="316" x2="540" y2="316" stroke="#1C1917" strokeWidth="4" />
          {/* 左侧通畅血流 */}
          <path d="M 80 270 L 210 270" stroke="#16A34A" strokeWidth="3" strokeDasharray="8 6" />
          <polygon points="222,270 208,263 208,277" fill="#16A34A" />
          <text x="148" y="255" textAnchor="middle" fill="#15803D" fontSize="13" fontWeight="800">
            健康血管 · 血流顺畅
          </text>
          {/* 右侧黄色胆固醇斑块凸起 */}
          <path d="M 320 314 Q 420 250 520 314 Z" fill="#FDBA74" stroke="#F97316" strokeWidth="2.5" />
          <text x="420" y="302" textAnchor="middle" fill="#9A3412" fontSize="12" fontWeight="800">
            多余 LDL 沉积斑块
          </text>
          <text x="420" y="248" textAnchor="middle" fill="#B91C1C" fontSize="12" fontWeight="800">
            管腔变窄 · 破裂易堵
          </text>
          <text x="56" y="346" fill="#635B52" fontSize="12">
            拿到血脂化验单：重点先盯「低密度脂蛋白 LDL-C」与「甘油三酯」
          </text>

          {/* 红黑榜对照 */}
          <rect x="36" y="384" width="252" height="222" rx="16" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2" />
          <text x="56" y="416" fill="#15803D" fontSize="15" fontWeight="900">
            ✓ 给它们平反
          </text>
          <text x="56" y="454" fill="#1C1917" fontSize="17" fontWeight="800">
            1. 每天一个整鸡蛋
          </text>
          <text x="56" y="478" fill="#635B52" fontSize="12.5">
            肝脏自产约七成胆固醇，蛋黄别乱扔
          </text>
          <text x="56" y="518" fill="#1C1917" fontSize="17" fontWeight="800">
            2. 控血脂也要好好吃肉
          </text>
          <text x="56" y="542" fill="#635B52" fontSize="12.5">
            选鱼禽瘦肉，不吃肉反而缺蛋白
          </text>
          <text x="56" y="582" fill="#15803D" fontSize="12" fontWeight="700">
            更年期女性记得定期复查血脂
          </text>

          <rect x="312" y="384" width="252" height="222" rx="16" fill="#FEF2F2" stroke="#E5484D" strokeWidth="2" />
          <text x="332" y="416" fill="#B91C1C" fontSize="15" fontWeight="900">
            ✕ 真正要躲的坑
          </text>
          <text x="332" y="454" fill="#1C1917" fontSize="17" fontWeight="800">
            1. 冒大烟的高温炒菜
          </text>
          <text x="332" y="478" fill="#635B52" fontSize="12.5">
            高温反复煎炸容易产生反式脂肪
          </text>
          <text x="332" y="518" fill="#1C1917" fontSize="17" fontWeight="800">
            2. 含植脂末加工零食
          </text>
          <text x="332" y="542" fill="#635B52" fontSize="12.5">
            起酥糕点、部分奶茶植脂末要少碰
          </text>
          <text x="332" y="582" fill="#B91C1C" fontSize="12" fontWeight="700">
            AI 问诊只作参考，异常及时去医院
          </text>
        </g>
      )}

      {/* ─────── 单集 4：六层楼痛经女性专场（轻重分级 + 误区拆解图解） ─────── */}
      {ep.id === "pineapple-141" && (
        <g fontFamily={FONT}>
          <text x="36" y="108" fill="#1C1917" fontSize="30" fontWeight="900">
            痛经不用慌，但也绝别硬扛
          </text>
          <text x="36" y="140" fill="#635B52" fontSize="14" fontWeight="500">
            六层楼（原三甲妇产科医生）：疼痛值得被认真对待
          </text>

          {/* 3 阶痛经分级标尺 */}
          <rect x="36" y="164" width="528" height="196" rx="18" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
          <text x="56" y="194" fill="#1C1917" fontSize="15" fontWeight="800">
            先对照：你的痛经在哪一档？
          </text>

          <rect x="56" y="212" width="154" height="128" rx="12" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
          <text x="133" y="238" textAnchor="middle" fill="#065F46" fontSize="15" fontWeight="900">轻度</text>
          <text x="133" y="266" textAnchor="middle" fill="#1C1917" fontSize="12.5" fontWeight="700">轻微坠胀</text>
          <text x="133" y="288" textAnchor="middle" fill="#635B52" fontSize="11.5">不影响正常上班</text>
          <text x="133" y="316" textAnchor="middle" fill="#047857" fontSize="11.5" fontWeight="700">热敷 + 温和走路</text>

          <rect x="223" y="212" width="154" height="128" rx="12" fill="#FFF7ED" stroke="#F97316" strokeWidth="1.8" />
          <text x="300" y="238" textAnchor="middle" fill="#C2410C" fontSize="15" fontWeight="900">中度</text>
          <text x="300" y="266" textAnchor="middle" fill="#1C1917" fontSize="12.5" fontWeight="700">明显影响专注</text>
          <text x="300" y="288" textAnchor="middle" fill="#635B52" fontSize="11.5">需暂停剧烈运动</text>
          <text x="300" y="316" textAnchor="middle" fill="#C2410C" fontSize="11.5" fontWeight="700">科学评估勿硬忍</text>

          <rect x="390" y="212" width="154" height="128" rx="12" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.8" />
          <text x="467" y="238" textAnchor="middle" fill="#B91C1C" fontSize="15" fontWeight="900">重度警报</text>
          <text x="467" y="266" textAnchor="middle" fill="#1C1917" fontSize="12.5" fontWeight="700">冷汗/呕吐/卧床</text>
          <text x="467" y="288" textAnchor="middle" fill="#635B52" fontSize="11.5">警惕内异症等</text>
          <text x="467" y="316" textAnchor="middle" fill="#B91C1C" fontSize="11.5" fontWeight="800">直接挂妇科面诊</text>

          {/* 下方 2x2 误区拆解 */}
          <rect x="36" y="380" width="254" height="106" rx="14" fill="#FFFFFF" stroke="#E4DDD3" strokeWidth="1.5" />
          <text x="54" y="408" fill="#C2410C" fontSize="13.5" fontWeight="800">05:59 · 温和活动有助缓解</text>
          <text x="54" y="434" fill="#1C1917" fontSize="13.5" fontWeight="600">规律走路改善盆腔血流，</text>
          <text x="54" y="456" fill="#635B52" fontSize="12.5">体感允许就不必绝对卧床。</text>

          <rect x="310" y="380" width="254" height="106" rx="14" fill="#FFFFFF" stroke="#E4DDD3" strokeWidth="1.5" />
          <text x="328" y="408" fill="#C2410C" fontSize="13.5" fontWeight="800">30:06 · 红糖姜茶真相</text>
          <text x="328" y="434" fill="#1C1917" fontSize="13.5" fontWeight="600">舒服主要靠「热」和暖敷，</text>
          <text x="328" y="456" fill="#635B52" fontSize="12.5">红糖本身没有神奇止痛成分。</text>

          <rect x="36" y="500" width="254" height="106" rx="14" fill="#FFFFFF" stroke="#E4DDD3" strokeWidth="1.5" />
          <text x="54" y="528" fill="#C2410C" fontSize="13.5" fontWeight="800">48:42 · 豆制品与牛奶</text>
          <text x="54" y="554" fill="#1C1917" fontSize="13.5" fontWeight="600">日常正常吃豆腐喝牛奶，</text>
          <text x="54" y="576" fill="#635B52" fontSize="12.5">不会把雌激素吃紊乱。</text>

          <rect x="310" y="500" width="254" height="106" rx="14" fill="#FFFFFF" stroke="#E4DDD3" strokeWidth="1.5" />
          <text x="328" y="528" fill="#C2410C" fontSize="13.5" fontWeight="800">32:35 · 看诊前记 3 件事</text>
          <text x="328" y="554" fill="#1C1917" fontSize="13.5" fontWeight="600">周期天数、疼痛起止时间、</text>
          <text x="328" y="576" fill="#635B52" fontSize="12.5">经量变化，沟通效率翻倍。</text>
        </g>
      )}

      {/* ─────── 单集 5：孙凌霞营养师减脂饮食专场（三餐金字塔 + 避坑对照） ─────── */}
      {ep.id === "pineapple-94" && (
        <g fontFamily={FONT}>
          <text x="36" y="108" fill="#1C1917" fontSize="29" fontWeight="900">
            减肥掉发没劲？先把饭吃对
          </text>
          <text x="36" y="140" fill="#635B52" fontSize="14" fontWeight="500">
            孙凌霞（美国注册营养师）：别把三餐的坑丢给网红补剂
          </text>

          {/* 3 大核心数字卡片 */}
          <rect x="36" y="164" width="166" height="108" rx="16" fill="#FFF7ED" stroke="#F97316" strokeWidth="2" />
          <text x="119" y="208" textAnchor="middle" fill="#C2410C" fontSize="24" fontWeight="900">保蛋白</text>
          <text x="119" y="236" textAnchor="middle" fill="#1C1917" fontSize="12.5" fontWeight="700">减脂防掉发与掉肌</text>
          <text x="119" y="256" textAnchor="middle" fill="#635B52" fontSize="11">三餐均匀吃优质蛋白</text>

          <rect x="217" y="164" width="166" height="108" rx="16" fill="#FFFFFF" stroke="#1C1917" strokeWidth="1.8" />
          <text x="300" y="208" textAnchor="middle" fill="#1C1917" fontSize="24" fontWeight="900">80%人缺</text>
          <text x="300" y="236" textAnchor="middle" fill="#1C1917" fontSize="12.5" fontWeight="700">维生素 D 普遍不足</text>
          <text x="300" y="256" textAnchor="middle" fill="#635B52" fontSize="11">体检可查 25(OH)D</text>

          <rect x="398" y="164" width="166" height="108" rx="16" fill="#FFFFFF" stroke="#1C1917" strokeWidth="1.8" />
          <text x="481" y="208" textAnchor="middle" fill="#1C1917" fontSize="24" fontWeight="900">不盲买</text>
          <text x="481" y="236" textAnchor="middle" fill="#1C1917" fontSize="12.5" fontWeight="700">抗衰补剂非捷径</text>
          <text x="481" y="256" textAnchor="middle" fill="#635B52" fontSize="11">零带货 · 先打牢三餐</text>

          {/* 4 条高频避坑对照 */}
          <rect x="36" y="294" width="528" height="312" rx="18" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2" />
          <text x="58" y="326" fill="#1C1917" fontSize="15.5" fontWeight="900">
            这 4 个日常养生/减脂坑，最容易踩
          </text>

          <text x="58" y="366" fill="#C2410C" fontSize="14" fontWeight="800">01 · 明明吃不少还累、掉发（04:41）</text>
          <text x="58" y="390" fill="#44403C" fontSize="13">主食多但肉蛋奶豆太少，蛋白质与铁长期不够，头发最先受影响。</text>
          <line x1="58" y1="408" x2="542" y2="408" stroke="#E4DDD3" strokeWidth="1" />

          <text x="58" y="438" fill="#C2410C" fontSize="14" fontWeight="800">02 · 乳糖不耐只能彻底戒奶？（21:38）</text>
          <text x="58" y="462" fill="#44403C" fontSize="13">可以换无糖酸奶、舒化奶或少量随餐喝，不必白白丢掉钙和优质蛋白。</text>
          <line x1="58" y1="480" x2="542" y2="480" stroke="#E4DDD3" strokeWidth="1" />

          <text x="58" y="510" fill="#C2410C" fontSize="14" fontWeight="800">03 · 吃芹菜就能补够膳食纤维？（49:00）</text>
          <text x="58" y="534" fill="#44403C" fontSize="13">芹菜纤维并不算顶尖，全谷杂豆、菌菇、魔芋和深色蔬菜更高效。</text>
          <line x1="58" y1="552" x2="542" y2="552" stroke="#E4DDD3" strokeWidth="1" />

          <text x="58" y="582" fill="#C2410C" fontSize="14" fontWeight="800">04 · 网红抗衰三件套值得买吗？（55:49）</text>
          <text x="58" y="598" fill="#44403C" fontSize="12.5">没有补剂能替你补觉和吃菜，先吃够三餐再谈查指标按需补充。</text>
        </g>
      )}

      {/* 底部统一行动条 + 懂点健康水印 */}
      <rect x="36" y="632" width="528" height="92" rx="16" fill="#1C1917" />
      <text x="58" y="662" fill="#F97316" fontSize="13" fontWeight="800" fontFamily={FONT}>
        明天就能照着做
      </text>
      <text x="58" y="694" fill="#FAF8F4" fontSize="16" fontWeight="700" fontFamily={FONT}>
        {vs.action.slice(0, 32)}
      </text>
      {vs.action.length > 32 && (
        <text x="58" y="714" fill="#FAF8F4" fontSize="14" fontWeight="600" fontFamily={FONT}>
          {vs.action.slice(32)}
        </text>
      )}

      <text x="36" y="766" fill="#635B52" fontSize="13" fontWeight="700" fontFamily={FONT}>
        懂点健康 · health.heystone.site
      </text>
      <text x="564" y="766" textAnchor="end" fill="#9A9085" fontSize="12" fontFamily={FONT}>
        科普参考 · 不替代医生诊断
      </text>
    </svg>
  );
}

export default function PodcastInfographic({
  ep,
  onSeek,
}: {
  ep: Episode;
  onSeek: (sec: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const vs = ep.visualSummary;

  const copySummary = async () => {
    const text = [
      `【一图读懂】${ep.show}：${ep.title}`,
      `核心结论：${vs.headline}`,
      "",
      ...vs.highlights.map((h, i) => `${i + 1}. [${h.time}] ${h.tag}：${h.text}`),
      "",
      `明天就能做：${vs.action}`,
      `来源：懂点健康 health.heystone.site`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleExport = async () => {
    if (!svgRef.current) return;
    setExporting(true);
    try {
      await exportSvgToPng(svgRef.current, `懂点健康-一图读懂-${ep.id}.png`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-ink-soft">3:4 视觉图解海报（所见即所得导出）</span>
        <div className="flex gap-2">
          <button
            onClick={copySummary}
            className="cursor-pointer rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-bold text-ink hover:border-ink"
          >
            {copied ? "已复制 ✓" : "复制文字"}
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="cursor-pointer rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white hover:brightness-105 disabled:opacity-50"
          >
            {exporting ? "导出中…" : "导出高清 PNG"}
          </button>
        </div>
      </div>

      {/* 真正的视觉图解海报 */}
      <EpisodeVisualSvg ep={ep} svgRef={svgRef} />

      {/* 图下附 4 个极简时间码直达胶囊 */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {vs.highlights.map((hl) => (
          <button
            key={hl.time}
            onClick={() => onSeek(timeToSec(hl.time))}
            className="cursor-pointer rounded-full border border-line bg-cream px-2.5 py-1 text-[11px] font-bold text-ink transition hover:border-accent hover:text-accent-dark"
          >
            ▶ {hl.time} {hl.tag}
          </button>
        ))}
      </div>
    </div>
  );
}
