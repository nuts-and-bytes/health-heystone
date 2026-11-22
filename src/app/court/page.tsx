import CourtSession from "@/components/CourtSession";

export const metadata = { title: "开庭审案 · 健康谣言法庭" };

export default function Page() {
  return (
    <div className="pt-2">
      <CourtSession count={5} mode="court" />
    </div>
  );
}
