import BodyMap from "@/components/BodyMap";

export const metadata = { title: "身体地图 · 健康谣言法庭" };

export default function Page() {
  return (
    <div>
      <h1 className="font-display text-4xl">🫀 身体地图</h1>
      <p className="mb-6 mt-1 text-ink-soft">哪儿不放心点哪儿，看看关于它的谣言有几条。</p>
      <BodyMap />
    </div>
  );
}
