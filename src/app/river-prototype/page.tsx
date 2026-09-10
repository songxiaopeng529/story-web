import type { Metadata } from "next";
import { getEntries } from "@/lib/content";
import { RiverPrototype } from "@/components/home/river-prototype";

export const metadata: Metadata = { title: "河流自适应原型 · 宋小鹏", robots: { index: false, follow: false } };

export default function RiverPrototypePage() {
  const articles = getEntries("articles").map(({ slug, title, description, date }) => ({ slug, title, description, date }));
  return <RiverPrototype articles={articles} />;
}
