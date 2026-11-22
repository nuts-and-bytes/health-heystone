import CourtSession from "@/components/CourtSession";

export const metadata = { title: "段位测验 · 健康谣言法庭" };

export default function Page() {
  return (
    <div className="pt-2">
      <h1 className="font-display mb-4 text-center text-3xl">🏆 10 题测出你的健康常识段位</h1>
      <CourtSession count={10} mode="quiz" />
    </div>
  );
}
