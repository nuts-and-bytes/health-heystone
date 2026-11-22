/* eslint-disable @next/next/no-img-element */
export type MascotMood = "hero" | "happy" | "shocked" | "thinking";

const SRC: Record<MascotMood, string> = {
  hero: "/illustrations/hero.jpg",
  happy: "/illustrations/mascot-happy.jpg",
  shocked: "/illustrations/mascot-shocked.jpg",
  thinking: "/illustrations/mascot-thinking.jpg",
};

const ALT: Record<MascotMood, string> = {
  hero: "肌肉法官举着法槌",
  happy: "肌肉法官开心欢呼",
  shocked: "肌肉法官吓得假发飞起",
  thinking: "肌肉法官拿着放大镜思考",
};

export default function Mascot({ mood, className = "" }: { mood: MascotMood; className?: string }) {
  return <img src={SRC[mood]} alt={ALT[mood]} className={`select-none ${className}`} draggable={false} />;
}
