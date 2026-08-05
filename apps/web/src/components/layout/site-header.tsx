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
          {siteConfig.name}
        </Link>
        <SiteNav />
      </Container>
    </header>
  );
}
