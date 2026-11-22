import { Suspense } from "react";
import AdviceBoard from "@/components/AdviceBoard";

export const metadata = { title: "最低有效剂量 · 健康谣言法庭" };

export default function Page() {
  return (
    <Suspense>
      <AdviceBoard />
    </Suspense>
  );
}
