import CourtSession from "@/components/CourtSession";

export const metadata = { title: "开庭审案 · 懂点健康" };

export default function Page() {
  return (
    <div className="pt-2">
      <CourtSession count={5} mode="court" />
    </div>
  );
}
