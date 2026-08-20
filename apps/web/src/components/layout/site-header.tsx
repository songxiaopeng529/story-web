import Link from "next/link";

import { siteConfig } from "@/config/site";

import { SiteNav } from "./site-nav";
import { Container } from "../ui/container";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link
          aria-label={`${siteConfig.name}首页`}
          className="site-wordmark"
          href="/"
        >
          <span aria-hidden="true">SXP.</span>
          <span className="sr-only">{siteConfig.name}</span>
        </Link>
        <SiteNav />
      </Container>
    </header>
  );
}
