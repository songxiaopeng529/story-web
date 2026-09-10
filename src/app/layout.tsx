import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "宋小鹏 · 带着好奇，去做一点有趣的事。",
  description: "一个爱写代码、喜欢折腾的创造者。记录沿途的思考，认真打磨 Story Forge，做一些有用、有趣的小东西。",
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
