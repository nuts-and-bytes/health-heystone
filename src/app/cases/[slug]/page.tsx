import { notFound } from "next/navigation";
import { CASES, getCase } from "@/data/cases";
import CaseDetail from "@/components/CaseDetail";

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/cases/[slug]">) {
  const { slug } = await props.params;
  const c = getCase(slug);
  return { title: c ? `「${c.claim}」· 健康谣言法庭` : "健康谣言法庭" };
}

export default async function Page(props: PageProps<"/cases/[slug]">) {
  const { slug } = await props.params;
  const c = getCase(slug);
  if (!c) notFound();
  return <CaseDetail c={c} />;
}
