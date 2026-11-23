import PodcastStudio from "@/components/PodcastStudio";

export const metadata = { title: "播客精读工作台 · health.heystone.site" };

export default function Page() {
  return (
    /* 桌面端突破父级 max-w-4xl，完整呈现 SubCast 左/中/右三栏工作台；手机端全宽自适应 */
    <div className="lg:relative lg:left-1/2 lg:w-[min(1320px,calc(100vw-3rem))] lg:-translate-x-1/2">
      <PodcastStudio />
    </div>
  );
}
