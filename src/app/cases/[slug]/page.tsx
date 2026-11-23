import { notFound } from "next/navigation";
import { CASES, getCase } from "@/data/cases";
import CaseDetail from "@/components/CaseDetail";

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/cases/[slug]">) {
  const { slug } = await props.params;
  const c = getCase(slug);
  return { title: c ? `「${c.claim}」· 懂点健康` : "懂点健康" };
}

export default async function Page(props: PageProps<"/cases/[slug]">) {
  const { slug } = await props.params;
  const c = getCase(slug);
  if (!c) notFound();
  return <CaseDetail c={c} />;
}
