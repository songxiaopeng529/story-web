import { resume } from "@content/resume";

const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: resume.identity.name,
  displayName: resume.identity.displayName,
  title: `${resume.identity.name} · 个人网站`,
  description: resume.identity.summary,
  url: configuredUrl.replace(/\/$/, ""),
  locale: "zh_CN",
  language: "zh-CN",
  github: "https://github.com/songxiaopeng529",
  repository: "https://github.com/songxiaopeng529/story-web",
} as const;

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, `${siteConfig.url}/`).toString();
}
