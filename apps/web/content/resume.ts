export type ResumeLink = {
  readonly label: string;
  readonly href: string;
  readonly note?: string;
};

export type ResumeExperience = {
  readonly period: string;
  readonly title: string;
  readonly organization: string;
  readonly summary: string;
  readonly highlights: readonly string[];
};

export type ResumeEducation = {
  readonly period: string;
  readonly institution: string;
  readonly program: string;
  readonly note?: string;
};

export type ResumeSkillGroup = {
  readonly label: string;
  readonly items: readonly string[];
};

export type ResumeData = {
  readonly identity: {
    readonly name: string;
    readonly displayName: string;
    readonly headline: string;
    readonly summary: string;
    readonly location: string | null;
  };
  readonly links: readonly ResumeLink[];
  readonly experience: readonly ResumeExperience[];
  readonly education: readonly ResumeEducation[];
  readonly skills: readonly ResumeSkillGroup[];
  readonly principles: readonly string[];
  readonly lastUpdated: string;
};

/**
 * 公开简历的单一数据入口。
 *
 * 当前只写入可以从仓库本身确认的信息；所在地、雇主与教育经历留空，
 * 避免在初始化阶段制造不真实的个人资料。
 */
export const resume = {
  identity: {
    name: "宋小鹏",
    displayName: "Song Xiaopeng",
    headline: "在产品、设计与工程之间持续实践",
    summary:
      "我把想法整理成清晰的信息结构，再把它实现成克制、可维护的数字产品。这里记录正在形成的方法、文章与作品。",
    location: null,
  },
  links: [
    {
      label: "GitHub",
      href: "https://github.com/songxiaopeng529",
      note: "代码、内容与版本记录",
    },
  ],
  experience: [
    {
      period: "2026 — 现在",
      title: "个人网站与内容系统",
      organization: "独立项目",
      summary:
        "搭建以 GitHub 为内容真源的个人网站，让简历、文章、作品与画板可以在同一套版本工作流中长期维护。",
      highlights: [
        "使用 Next.js、TypeScript、Tailwind CSS 与 MDX 构建静态内容站。",
        "以 Monorepo 组织访客站，并为未来管理端和独立后端保留清晰边界。",
        "把 Markdown 正文与 Excalidraw 源文件共同纳入 Git 审阅和发布流程。",
      ],
    },
  ],
  education: [],
  skills: [
    {
      label: "Web",
      items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    {
      label: "内容",
      items: ["Markdown / MDX", "GitHub", "Excalidraw", "内容建模"],
    },
    {
      label: "方法",
      items: ["信息架构", "响应式设计", "渐进增强", "可访问性"],
    },
  ],
  principles: [
    "先把信息说清楚，再讨论装饰。",
    "默认选择可迁移、可审阅、可长期维护的方案。",
    "让交互服务于理解，而不是抢走内容的注意力。",
  ],
  lastUpdated: "2026-08-04",
} as const satisfies ResumeData;
