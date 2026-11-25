import type { Metadata } from "next";
import AboutAuthor from "@/components/AboutAuthor";

export const metadata: Metadata = {
  title: "关于我与内容红线 · 懂点健康",
  description: "石头（Xinyao）做「懂点健康」的初衷、零带货零诊疗的内容红线，以及联系方式。",
};

export default function AboutPage() {
  return <AboutAuthor />;
}
