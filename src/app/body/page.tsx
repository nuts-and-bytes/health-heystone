import { Suspense } from "react";
import BodyMap from "@/components/BodyMap";

export const metadata = { title: "身体地图与身体百科 · 健康谣言法庭" };

export default function Page() {
  return (
    <div>
      <h1 className="font-display text-4xl text-ink">🫀 认识你的身体</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">既能点身体部位查相关谣言，也能看肾上腺、胆固醇、胰岛素这些角色的小人动画科普。</p>
      <Suspense>
        <BodyMap />
      </Suspense>
    </div>
  );
}
