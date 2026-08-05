"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页", index: "01" },
  { href: "/articles", label: "文章", index: "02" },
  { href: "/works", label: "作品", index: "03" },
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="主导航" className="site-nav">
      {navItems.map((item) => {
        const current = isCurrent(pathname, item.href);
        return (
          <Link
            aria-current={current ? "page" : undefined}
            className="site-nav__link"
            href={item.href}
            key={item.href}
          >
            <span className="site-nav__index">{item.index}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
