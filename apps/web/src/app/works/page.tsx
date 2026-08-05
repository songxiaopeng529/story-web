import type { Metadata } from "next";

import { ContentPageHeader } from "@/components/content/content-page-header";
import { WorkList } from "@/components/content/work-list";
import { Container } from "@/components/ui/container";
import { getWorks } from "@/lib/content";

export const metadata: Metadata = {
  title: "作品",
  description: "已经做过、正在构建，以及值得被完整记录的项目。",
  alternates: { canonical: "/works" },
};

export default function WorksPage() {
  const works = getWorks();

  return (
    <main data-page="works" id="main-content">
      <ContentPageHeader
        count={works.length}
        description="把结果、过程和取舍放在一起，记录项目真正发生过的样子。"
        eyebrow="03 / SELECTED WORKS"
        title="作品"
      />
      <Container className="page-list-section">
        <WorkList works={works} />
      </Container>
    </main>
  );
}
