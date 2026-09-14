import type { Metadata } from "next";
import { articles, works, summarize } from "@/lib/content";
import { Story } from "./scene";

export const metadata: Metadata = {
  title: "Story — Extraordinary by design",
  description: "宋小鹏的个人网站，记录技术思考，分享博客与作品。",
};

export default function StoryPage() {
  return <Story articles={summarize(articles)} projects={summarize(works)} />;
}
