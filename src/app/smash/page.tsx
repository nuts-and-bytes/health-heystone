import Smasher from "@/components/Smasher";

export const metadata = { title: "谣言粉碎机 · 健康谣言法庭" };

export default function Page() {
  return (
    <div>
      <h1 className="font-display mb-6 text-center text-4xl">🔨 谣言粉碎机</h1>
      <Smasher />
    </div>
  );
}
