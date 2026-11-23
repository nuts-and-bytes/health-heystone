import { Suspense } from "react";
import BodyMap from "@/components/BodyMap";

export const metadata = { title: "身体地图与身体百科 · 懂点健康" };

export default function Page() {
  return (
    <div>
      <h1 className="font-display text-4xl text-ink">认识你的身体</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">用真实解剖图认清每块肌肉和器官长在哪，用小人动画看懂它们怎么干活。</p>
      <Suspense>
        <BodyMap />
      </Suspense>
    </div>
  );
}
