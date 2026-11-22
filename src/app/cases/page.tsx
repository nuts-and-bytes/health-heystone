import { Suspense } from "react";
import CaseList from "@/components/CaseList";

export const metadata = { title: "判决书档案室 · 健康谣言法庭" };

export default function Page() {
  return (
    <Suspense>
      <CaseList />
    </Suspense>
  );
}
