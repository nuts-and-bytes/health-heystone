import PodcastStudio from "@/components/PodcastStudio";

export const metadata = { title: "播客精读工作台 · 健康谣言法庭" };

export default function Page() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-4xl text-ink">播客精读工作台</h1>
        <p className="mt-1 text-sm text-ink-soft">
          参考声渡 SubCast 的学习方式：站内直连收听《菠萝健康派》与《健康静距离》，点时间码直接跳播，随时记时间戳笔记，并一键对照本站谣言与身体图解。
        </p>
      </div>
      <PodcastStudio />
    </div>
  );
}
