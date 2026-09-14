import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageDocument } from "@/components/language";

export const metadata: Metadata = {
  title: "Story — Extraordinary by design",
  description: "一个爱写代码、喜欢折腾的创造者。记录沿途的思考，认真打磨 Story Forge，做一些有用、有趣的小东西。",
};

export const viewport: Viewport = { themeColor: "#a63225", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><LanguageDocument />{children}</body></html>;
}
