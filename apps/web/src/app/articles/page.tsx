import type { Metadata } from "next";

import { ArticleList } from "@/components/content/article-list";
import { ContentPageHeader } from "@/components/content/content-page-header";
import { Container } from "@/components/ui/container";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "文章",
  description: "关于产品、设计、工程与内容系统的持续记录。",
  alternates: { canonical: "/articles" },
};

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <main data-page="articles" id="main-content">
      <ContentPageHeader
        count={articles.length}
        description="记录产品、设计与工程中的方法、取舍和仍在形成的答案。"
        eyebrow="02 / WRITING"
        title="文章"
      />
      <Container className="page-list-section">
        <ArticleList articles={articles} />
      </Container>
    </main>
  );
}
