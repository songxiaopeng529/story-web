import { resume } from "@content/resume";

import { siteConfig } from "@/config/site";

import { Container } from "../ui/container";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <p>
          © {resume.lastUpdated.slice(0, 4)} {siteConfig.displayName}
        </p>
        <p>内容与代码由 GitHub 管理</p>
        <a href="#top">回到顶部 ↑</a>
      </Container>
    </footer>
  );
}
