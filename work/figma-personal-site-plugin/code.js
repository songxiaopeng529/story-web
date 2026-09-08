async function main() {
  const page = figma.currentPage;
  page.name = "Personal Website UI";

  const GENERATED_NAMES = [
    "Desktop / Home — Quiet Precision",
    "Mobile / Hero — Quiet Precision",
    "Design Notes / Quiet Precision"
  ];
  for (const child of [...page.children]) {
    if (GENERATED_NAMES.includes(child.name)) child.remove();
  }

  const allFonts = await figma.listAvailableFontsAsync();
  const available = allFonts.map((f) => f.fontName);
  const pickFont = (families, styles) => {
    for (const family of families) {
      for (const style of styles) {
        const exact = available.find(
          (f) => f.family.toLowerCase() === family.toLowerCase() && f.style.toLowerCase() === style.toLowerCase()
        );
        if (exact) return exact;
      }
    }
    for (const family of families) {
      const byFamily = available.find((f) => f.family.toLowerCase() === family.toLowerCase());
      if (byFamily) return byFamily;
    }
    return { family: "Inter", style: "Regular" };
  };

  const sans = pickFont(
    ["PingFang SC", "Noto Sans CJK SC", "Source Han Sans CN", "SF Pro", "Inter"],
    ["Regular", "Normal"]
  );
  const sansMedium = pickFont(
    ["PingFang SC", "Noto Sans CJK SC", "Source Han Sans CN", "SF Pro", "Inter"],
    ["Semibold", "Semi Bold", "Medium", "Regular"]
  );
  const display = pickFont(["SF Pro Display", "SF Pro", "Inter"], ["Regular", "Light"]);
  const displayMedium = pickFont(
    ["SF Pro Display", "SF Pro", "Inter"],
    ["Semibold", "Semi Bold", "Medium"]
  );
  const serif = pickFont(["Instrument Serif", "Times New Roman", "Georgia"], ["Regular"]);
  const serifItalic = pickFont(
    ["Instrument Serif", "Times New Roman", "Georgia"],
    ["Italic", "Regular"]
  );
  const mono = pickFont(["SF Mono", "Roboto Mono", "IBM Plex Mono", "Inter"], ["Regular"]);
  const monoMedium = pickFont(
    ["SF Mono", "Roboto Mono", "IBM Plex Mono", "Inter"],
    ["Medium", "Regular"]
  );

  const uniqueFonts = [];
  for (const f of [sans, sansMedium, display, displayMedium, serif, serifItalic, mono, monoMedium]) {
    const key = `${f.family}::${f.style}`;
    if (!uniqueFonts.some((u) => `${u.family}::${u.style}` === key)) uniqueFonts.push(f);
  }
  await Promise.all(uniqueFonts.map((font) => figma.loadFontAsync(font)));

  const HEX = {
    paper: "#F4F4F0",
    paperAlt: "#ECECE7",
    ink: "#0A0A0A",
    muted: "#6F6F69",
    line: "#D8D8D2",
    lineStrong: "#A3A39C",
    inverse: "#FAFAF7"
  };

  const hexToRgb = (hex) => {
    const raw = hex.replace("#", "");
    return {
      r: parseInt(raw.slice(0, 2), 16) / 255,
      g: parseInt(raw.slice(2, 4), 16) / 255,
      b: parseInt(raw.slice(4, 6), 16) / 255
    };
  };
  const solid = (hex, opacity = 1) => ({
    type: "SOLID",
    color: hexToRgb(hex),
    ...(opacity < 1 ? { opacity } : {})
  });

  let colorVars = {};
  try {
    let collection = (await figma.variables.getLocalVariableCollectionsAsync()).find(
      (c) => c.name === "Portfolio / Color"
    );
    if (!collection) collection = figma.variables.createVariableCollection("Portfolio / Color");
    collection.renameMode(collection.modes[0].modeId, "Default");
    const modeId = collection.modes[0].modeId;
    const existingVars = await figma.variables.getLocalVariablesAsync("COLOR");
    const specs = [
      ["color/bg/paper", HEX.paper, ["FRAME_FILL", "SHAPE_FILL"]],
      ["color/bg/alternate", HEX.paperAlt, ["FRAME_FILL", "SHAPE_FILL"]],
      ["color/bg/inverse", HEX.ink, ["FRAME_FILL", "SHAPE_FILL"]],
      ["color/text/primary", HEX.ink, ["TEXT_FILL"]],
      ["color/text/secondary", HEX.muted, ["TEXT_FILL"]],
      ["color/text/inverse", HEX.inverse, ["TEXT_FILL"]],
      ["color/border/default", HEX.line, ["STROKE_COLOR"]],
      ["color/border/strong", HEX.lineStrong, ["STROKE_COLOR"]]
    ];
    for (const [name, value, scopes] of specs) {
      let variable = existingVars.find(
        (v) => v.name === name && v.variableCollectionId === collection.id
      );
      if (!variable) variable = figma.variables.createVariable(name, collection, "COLOR");
      variable.scopes = scopes;
      variable.setValueForMode(modeId, { ...hexToRgb(value), a: 1 });
      try {
        variable.setVariableCodeSyntax("WEB", `var(--${name.replace(/[\s/]+/g, "-")})`);
      } catch (_) {}
      colorVars[name] = variable;
    }
  } catch (_) {
    colorVars = {};
  }

  const tokenPaint = (name, fallback, opacity = 1) => {
    const base = solid(fallback, opacity);
    const variable = colorVars[name];
    if (!variable || opacity < 1) return base;
    try {
      return figma.variables.setBoundVariableForPaint(base, "color", variable);
    } catch (_) {
      return base;
    }
  };

  const textStyle = async (name, fontName, size, lineHeight, letterSpacing = 0) => {
    let style = (await figma.getLocalTextStylesAsync()).find((s) => s.name === name);
    if (!style) style = figma.createTextStyle();
    style.name = name;
    style.fontName = fontName;
    style.fontSize = size;
    style.lineHeight = { unit: "PIXELS", value: lineHeight };
    style.letterSpacing = { unit: "PERCENT", value: letterSpacing };
    return style;
  };

  const styles = {
    section: await textStyle("Portfolio / Heading / 56", display, 56, 60, -2),
    body: await textStyle("Portfolio / Body / 18", sans, 18, 29, 0),
    meta: await textStyle("Portfolio / Meta / 12", monoMedium, 12, 16, 8)
  };

  const append = (parent, node, x, y) => {
    parent.appendChild(node);
    node.x = x;
    node.y = y;
    return node;
  };
  const frame = (parent, name, x, y, width, height, fillHex = null, clip = true) => {
    const node = figma.createFrame();
    node.name = name;
    node.resize(width, height);
    node.clipsContent = clip;
    node.fills = fillHex ? [solid(fillHex)] : [];
    if (parent) append(parent, node, x, y);
    return node;
  };
  const rect = (parent, name, x, y, width, height, fillHex, radius = 0, opacity = 1) => {
    const node = figma.createRectangle();
    node.name = name;
    node.resize(width, height);
    node.fills = [solid(fillHex, opacity)];
    if (radius) node.cornerRadius = radius;
    append(parent, node, x, y);
    return node;
  };
  const strokedRect = (parent, name, x, y, width, height, fillHex, strokeHex, radius = 0) => {
    const node = rect(parent, name, x, y, width, height, fillHex, radius);
    node.strokes = [solid(strokeHex)];
    node.strokeWeight = 1;
    node.strokeAlign = "INSIDE";
    return node;
  };
  const divider = (parent, x, y, width, color = HEX.line, height = 1) =>
    rect(parent, "Divider", x, y, width, height, color);
  const text = (parent, options) => {
    const node = figma.createText();
    node.name = options.name || options.value.slice(0, 32);
    node.fontName = options.font || sans;
    node.fontSize = options.size || 18;
    node.lineHeight = { unit: "PIXELS", value: options.lineHeight || Math.round((options.size || 18) * 1.5) };
    node.letterSpacing = { unit: options.trackingUnit || "PERCENT", value: options.tracking || 0 };
    node.textAlignHorizontal = options.align || "LEFT";
    node.textAutoResize = "HEIGHT";
    node.resize(options.width, 12);
    node.characters = options.value;
    node.fills = [tokenPaint(options.colorToken || "color/text/primary", options.color || HEX.ink, options.opacity || 1)];
    append(parent, node, options.x, options.y);
    return node;
  };
  const styledText = (parent, options) => {
    const node = figma.createText();
    node.name = options.name || options.value.slice(0, 32);
    node.textStyleId = options.style.id;
    node.textAutoResize = "HEIGHT";
    node.resize(options.width, 12);
    node.characters = options.value;
    node.textAlignHorizontal = options.align || "LEFT";
    node.fills = [tokenPaint(options.colorToken || "color/text/primary", options.color || HEX.ink)];
    append(parent, node, options.x, options.y);
    return node;
  };
  const meta = (parent, value, x, y, width, color = HEX.muted, align = "LEFT") =>
    text(parent, {
      name: `Meta / ${value}`,
      value,
      x,
      y,
      width,
      font: monoMedium,
      size: 12,
      lineHeight: 16,
      tracking: 8,
      color,
      colorToken: color === HEX.inverse ? "color/text/inverse" : "color/text/secondary",
      align
    });
  const sectionLabel = (parent, index, label, y, inverse = false) => {
    const color = inverse ? HEX.inverse : HEX.ink;
    meta(parent, index, 120, y, 80, color);
    meta(parent, label, 240, y, 300, color);
    divider(parent, 540, y + 7, 780, inverse ? "#3B3B3B" : HEX.line);
  };

  const root = frame(null, "Desktop / Home — Quiet Precision", 0, 0, 1440, 6640, HEX.paper, true);
  page.appendChild(root);
  root.x = 0;
  root.y = 0;
  root.fills = [tokenPaint("color/bg/paper", HEX.paper)];
  root.layoutGrids = [
    {
      pattern: "COLUMNS",
      alignment: "STRETCH",
      gutterSize: 24,
      count: 12,
      offset: 120,
      visible: false,
      color: { ...hexToRgb("#6F6F69"), a: 0.08 }
    }
  ];

  const header = frame(root, "01 / Header", 0, 0, 1440, 96, HEX.paper, false);
  header.fills = [tokenPaint("color/bg/paper", HEX.paper)];
  divider(header, 120, 95, 1200);
  text(header, { name: "Wordmark", value: "宋小鹏  SONG XIAOPENG", x: 120, y: 34, width: 340, font: sansMedium, size: 15, lineHeight: 20, tracking: 2, color: HEX.ink });
  ["作品", "文章", "关于", "联系"].forEach((item, i) =>
    text(header, { name: `Nav / ${item}`, value: item, x: 778 + i * 92, y: 36, width: 68, font: sans, size: 14, lineHeight: 20, color: i === 0 ? HEX.ink : HEX.muted })
  );
  meta(header, "OPEN FOR IDEAS · 2026", 1140, 38, 180, HEX.ink, "RIGHT");

  const hero = frame(root, "02 / Hero", 0, 96, 1440, 970, HEX.paper, false);
  hero.fills = [tokenPaint("color/bg/paper", HEX.paper)];
  meta(hero, "PERSONAL PROFILE / 2026", 120, 78, 280);
  meta(hero, "PRODUCT · DESIGN · ENGINEERING", 900, 78, 420, HEX.muted, "RIGHT");
  text(hero, { name: "Hero / Chinese statement", value: "把复杂说清楚，\n再把它做得简单。", x: 112, y: 172, width: 1216, font: sans, size: 108, lineHeight: 118, tracking: -5, color: HEX.ink });
  text(hero, { name: "Hero / Editorial line", value: "Clarity, before decoration.", x: 442, y: 438, width: 880, font: serifItalic, size: 92, lineHeight: 96, tracking: -2, color: HEX.ink, align: "RIGHT" });
  divider(hero, 120, 608, 1200, HEX.line);
  meta(hero, "SONG XIAOPENG / 宋小鹏", 120, 652, 320, HEX.ink);
  text(hero, { name: "Hero / Summary", value: "在产品、设计与工程之间持续实践。\n我把想法整理成清晰的信息结构，再把它实现成克制、可维护的数字产品。", x: 746, y: 642, width: 574, font: sans, size: 20, lineHeight: 34, color: HEX.ink });
  meta(hero, "SCROLL TO EXPLORE  ↓", 120, 868, 260);
  meta(hero, "GITHUB AS CONTENT SOURCE", 1010, 868, 310, HEX.muted, "RIGHT");

  const works = frame(root, "03 / Selected Work", 0, 1066, 1440, 2100, HEX.paper, false);
  works.fills = [tokenPaint("color/bg/paper", HEX.paper)];
  sectionLabel(works, "01", "SELECTED WORK / 精选作品", 150);
  styledText(works, { name: "Section title / Work", value: "把方法做成可以\n长期生长的产品。", x: 120, y: 220, width: 940, style: styles.section });

  const projectOne = frame(works, "Project / story-web / Cover", 120, 435, 1200, 560, HEX.ink, true);
  projectOne.fills = [tokenPaint("color/bg/inverse", HEX.ink)];
  for (let i = 1; i < 12; i++) rect(projectOne, "Grid / Column", i * 100, 0, 1, 560, "#2A2A2A");
  for (let i = 1; i < 7; i++) rect(projectOne, "Grid / Row", 0, i * 80, 1200, 1, "#2A2A2A");
  meta(projectOne, "STORY—WEB / 001", 40, 34, 260, HEX.inverse);
  meta(projectOne, "GITHUB → MARKDOWN → NEXT.JS", 790, 34, 370, "#A6A6A0", "RIGHT");
  text(projectOne, { name: "Cover / Content as source", value: "CONTENT\nAS SOURCE", x: 40, y: 118, width: 610, font: serif, size: 104, lineHeight: 94, tracking: -3, color: HEX.inverse, colorToken: "color/text/inverse" });
  const contentPanel = frame(projectOne, "Cover / Content panel", 780, 126, 340, 350, HEX.inverse, false);
  meta(contentPanel, "CONTENT INDEX", 28, 28, 200, HEX.muted);
  divider(contentPanel, 28, 62, 284, HEX.lineStrong);
  [
    ["01", "RESUME", "LIVE"],
    ["02", "WRITING", "MDX"],
    ["03", "WORKS", "CASE"],
    ["04", "BOARDS", "DRAW"]
  ].forEach((row, i) => {
    const y = 86 + i * 58;
    meta(contentPanel, row[0], 28, y, 36, HEX.muted);
    text(contentPanel, { value: row[1], x: 76, y: y - 1, width: 130, font: sansMedium, size: 14, lineHeight: 18, color: HEX.ink });
    meta(contentPanel, row[2], 244, y, 68, HEX.muted, "RIGHT");
    divider(contentPanel, 28, y + 34, 284, HEX.line);
  });
  meta(contentPanel, "OWN YOUR CONTENT", 28, 318, 284, HEX.ink);
  text(works, { name: "Project title / story-web", value: "story-web", x: 120, y: 1032, width: 560, font: display, size: 48, lineHeight: 52, tracking: -2, color: HEX.ink });
  meta(works, "PRODUCT DESIGN / IA / FRONTEND", 120, 1102, 420);
  text(works, { name: "Project summary / story-web", value: "一个以 GitHub 为内容真源，同时承载简历、文章、作品与画板的个人网站。", x: 746, y: 1036, width: 470, font: sans, size: 18, lineHeight: 30, color: HEX.ink });
  meta(works, "2026  ↗", 1240, 1040, 80, HEX.ink, "RIGHT");

  meta(works, "PROJECT / 002", 120, 1310, 220, HEX.muted);
  text(works, { name: "Project title / content workflow", value: "GitHub 内容工作流", x: 120, y: 1360, width: 360, font: sansMedium, size: 38, lineHeight: 48, tracking: -2, color: HEX.ink });
  text(works, { name: "Project summary / content workflow", value: "用尽量少的状态，把“写完一份 Markdown”连接到“得到一个可审阅的网页”。", x: 120, y: 1488, width: 300, font: sans, size: 17, lineHeight: 29, color: HEX.muted, colorToken: "color/text/secondary" });
  meta(works, "PROCESS DESIGN / CONTENT MODEL", 120, 1652, 330);
  meta(works, "2026  ↗", 120, 1766, 120, HEX.ink);

  const projectTwo = frame(works, "Project / GitHub content workflow / Cover", 486, 1260, 834, 620, HEX.paperAlt, true);
  projectTwo.fills = [tokenPaint("color/bg/alternate", HEX.paperAlt)];
  meta(projectTwo, "WRITE / REVIEW / PUBLISH", 40, 36, 310, HEX.ink);
  meta(projectTwo, "LIGHTWEIGHT CONTENT SYSTEM", 510, 36, 284, HEX.muted, "RIGHT");
  divider(projectTwo, 40, 72, 754, HEX.lineStrong);
  const stages = [
    { n: "01", title: "WRITE", sub: "MARKDOWN", x: 40 },
    { n: "02", title: "REVIEW", sub: "PULL REQUEST", x: 304 },
    { n: "03", title: "PUBLISH", sub: "STATIC PAGE", x: 568 }
  ];
  stages.forEach((stage, i) => {
    const box = strokedRect(projectTwo, `Stage / ${stage.title}`, stage.x, 152, 226, 298, HEX.paper, HEX.ink, 0);
    meta(box, stage.n, 20, 20, 50, HEX.muted);
    text(box, { value: stage.title, x: 20, y: 98, width: 186, font: displayMedium, size: 26, lineHeight: 32, tracking: -1, color: HEX.ink });
    meta(box, stage.sub, 20, 238, 186, HEX.ink);
    if (i < 2) text(projectTwo, { value: "→", x: stage.x + 229, y: 278, width: 32, font: serif, size: 28, lineHeight: 32, color: HEX.ink, align: "CENTER" });
  });
  meta(projectTwo, "GITHUB / FRONTMATTER / ZOD / VERCEL PREVIEW", 40, 536, 754, HEX.ink);

  const writing = frame(root, "04 / Writing", 0, 3166, 1440, 820, HEX.paper, false);
  writing.fills = [tokenPaint("color/bg/paper", HEX.paper)];
  sectionLabel(writing, "02", "LATEST WRITING / 最近文章", 136);
  styledText(writing, { name: "Section title / Writing", value: "关于内容、设计与实现。", x: 120, y: 206, width: 780, style: styles.section });
  [
    { index: "01", title: "让 GitHub 成为个人网站的内容真源", summary: "把 Markdown、作品资料与画板放进同一个仓库，用熟悉的 Git 工作流完成写作、审阅和发布。", y: 356 },
    { index: "02", title: "设计一个安静但不沉闷的个人网站", summary: "黑白极简不是删掉所有东西，而是用层级、节奏与克制的动效，让内容成为页面最清楚的声音。", y: 558 }
  ].forEach((article) => {
    divider(writing, 120, article.y, 1200, HEX.lineStrong);
    meta(writing, article.index, 120, article.y + 36, 80, HEX.muted);
    text(writing, { name: `Article / ${article.index}`, value: article.title, x: 240, y: article.y + 26, width: 520, font: sansMedium, size: 28, lineHeight: 38, tracking: -1, color: HEX.ink });
    text(writing, { value: article.summary, x: 806, y: article.y + 28, width: 394, font: sans, size: 15, lineHeight: 25, color: HEX.muted, colorToken: "color/text/secondary" });
    meta(writing, "2026  ↗", 1230, article.y + 36, 90, HEX.ink, "RIGHT");
  });

  const about = frame(root, "05 / About", 0, 3986, 1440, 890, HEX.paper, false);
  about.fills = [tokenPaint("color/bg/paper", HEX.paper)];
  sectionLabel(about, "03", "PROFILE / 关于", 140);
  text(about, { name: "About / Lead", value: "先把信息说清楚，\n再讨论装饰。", x: 120, y: 238, width: 690, font: sans, size: 58, lineHeight: 72, tracking: -3, color: HEX.ink });
  text(about, { name: "About / Editorial accent", value: "Content before container.", x: 120, y: 430, width: 650, font: serifItalic, size: 58, lineHeight: 64, tracking: -2, color: HEX.ink });
  text(about, { name: "About / Body", value: "我把想法整理成清晰的信息结构，再把它实现成克制、可维护的数字产品。这里记录正在形成的方法、文章与作品。", x: 120, y: 568, width: 610, font: sans, size: 18, lineHeight: 31, color: HEX.muted, colorToken: "color/text/secondary" });
  divider(about, 840, 234, 1, HEX.ink, 520);
  meta(about, "WORKING PRINCIPLES / 工作方式", 900, 238, 420, HEX.ink);
  [
    "先把信息说清楚，再讨论装饰。",
    "默认选择可迁移、可审阅、可长期维护的方案。",
    "让交互服务于理解，而不是抢走内容的注意力。"
  ].forEach((principle, i) => {
    const y = 330 + i * 142;
    meta(about, String(i + 1).padStart(2, "0"), 900, y + 6, 48, HEX.muted);
    text(about, { value: principle, x: 978, y, width: 342, font: sans, size: 18, lineHeight: 30, color: HEX.ink });
    divider(about, 900, y + 96, 420, HEX.line);
  });
  meta(about, "FOCUS", 900, 742, 80, HEX.muted);
  text(about, { value: "信息架构 · 响应式设计 · 渐进增强 · 可访问性", x: 978, y: 738, width: 342, font: sans, size: 14, lineHeight: 22, color: HEX.ink });

  const services = frame(root, "06 / Capabilities", 0, 4876, 1440, 850, HEX.paperAlt, false);
  services.fills = [tokenPaint("color/bg/alternate", HEX.paperAlt)];
  sectionLabel(services, "04", "CAPABILITIES / 能力", 116);
  styledText(services, { name: "Section title / Capabilities", value: "从结构到界面，再到可维护的实现。", x: 120, y: 188, width: 990, style: styles.section });
  [
    ["01", "产品与信息结构", "把复杂主题整理成清楚的层级、路径与内容模型。", "IA / CONTENT MODEL"],
    ["02", "界面与设计系统", "用网格、排版与克制的交互建立一致、安静的体验。", "UI / RESPONSIVE"],
    ["03", "前端与内容工作流", "将设计实现为可访问、可审阅、可长期维护的产品。", "NEXT.JS / TYPESCRIPT"]
  ].forEach((row, i) => {
    const y = 346 + i * 150;
    divider(services, 120, y, 1200, HEX.lineStrong);
    meta(services, row[0], 120, y + 46, 70, HEX.muted);
    text(services, { value: row[1], x: 240, y: y + 34, width: 320, font: sansMedium, size: 25, lineHeight: 36, tracking: -1, color: HEX.ink });
    text(services, { value: row[2], x: 610, y: y + 38, width: 430, font: sans, size: 16, lineHeight: 26, color: HEX.muted, colorToken: "color/text/secondary" });
    meta(services, row[3], 1080, y + 46, 240, HEX.ink, "RIGHT");
  });

  const contact = frame(root, "07 / Contact", 0, 5726, 1440, 720, HEX.ink, false);
  contact.fills = [tokenPaint("color/bg/inverse", HEX.ink)];
  sectionLabel(contact, "05", "CONTACT / 联系", 116, true);
  text(contact, { name: "Contact / Heading", value: "有项目、想法，\n或只是想聊聊？", x: 120, y: 224, width: 880, font: sans, size: 72, lineHeight: 84, tracking: -4, color: HEX.inverse, colorToken: "color/text/inverse" });
  text(contact, { name: "Contact / Body", value: "目前公开的联系入口在 GitHub。\n你也可以从这个仓库看到网站接下来如何生长。", x: 896, y: 250, width: 424, font: sans, size: 17, lineHeight: 29, color: "#B8B8B2", colorToken: "color/text/inverse" });
  divider(contact, 896, 442, 424, "#3B3B3B");
  text(contact, { name: "Contact / GitHub CTA", value: "github.com/songxiaopeng529  ↗", x: 896, y: 462, width: 424, font: display, size: 23, lineHeight: 30, tracking: -1, color: HEX.inverse, colorToken: "color/text/inverse" });
  meta(contact, "AVAILABLE FOR THOUGHTFUL COLLABORATION", 120, 624, 430, "#B8B8B2");
  meta(contact, "SHANGHAI / CST", 1110, 624, 210, HEX.inverse, "RIGHT");

  const footer = frame(root, "08 / Footer", 0, 6446, 1440, 194, HEX.paper, false);
  footer.fills = [tokenPaint("color/bg/paper", HEX.paper)];
  divider(footer, 120, 1, 1200, HEX.lineStrong);
  text(footer, { name: "Footer / Monogram", value: "SX.", x: 120, y: 58, width: 160, font: serifItalic, size: 52, lineHeight: 56, tracking: -2, color: HEX.ink });
  meta(footer, "© 2026 SONG XIAOPENG", 520, 78, 260, HEX.muted);
  meta(footer, "CONTENT & CODE MANAGED BY GITHUB", 760, 78, 330, HEX.muted);
  meta(footer, "BACK TO TOP  ↑", 1150, 78, 170, HEX.ink, "RIGHT");

  const mobile = frame(null, "Mobile / Hero — Quiet Precision", 0, 0, 390, 844, HEX.paper, true);
  page.appendChild(mobile);
  mobile.x = 1640;
  mobile.y = 1580;
  mobile.fills = [tokenPaint("color/bg/paper", HEX.paper)];
  text(mobile, { value: "宋小鹏", x: 24, y: 26, width: 120, font: sansMedium, size: 15, lineHeight: 20, color: HEX.ink });
  meta(mobile, "MENU", 304, 30, 62, HEX.ink, "RIGHT");
  divider(mobile, 24, 72, 342, HEX.lineStrong);
  meta(mobile, "PERSONAL PROFILE / 2026", 24, 114, 260);
  text(mobile, { value: "把复杂\n说清楚，\n再做简单。", x: 20, y: 176, width: 350, font: sans, size: 54, lineHeight: 63, tracking: -4, color: HEX.ink });
  text(mobile, { value: "Clarity, first.", x: 24, y: 404, width: 342, font: serifItalic, size: 48, lineHeight: 52, tracking: -2, color: HEX.ink, align: "RIGHT" });
  divider(mobile, 24, 496, 342, HEX.line);
  text(mobile, { value: "在产品、设计与工程之间持续实践。把想法整理成清晰的信息结构，再实现成克制、可维护的数字产品。", x: 24, y: 536, width: 342, font: sans, size: 17, lineHeight: 28, color: HEX.ink });
  meta(mobile, "SCROLL  ↓", 24, 770, 120, HEX.ink);
  meta(mobile, "SONG XIAOPENG", 226, 770, 140, HEX.muted, "RIGHT");

  const notes = frame(null, "Design Notes / Quiet Precision", 0, 0, 520, 1360, "#FFFFFF", true);
  page.appendChild(notes);
  notes.x = 1640;
  notes.y = 0;
  text(notes, { value: "Quiet Precision", x: 40, y: 42, width: 440, font: displayMedium, size: 34, lineHeight: 40, tracking: -2, color: HEX.ink });
  meta(notes, "PERSONAL WEBSITE / DESIGN NOTES", 40, 94, 400, HEX.muted);
  divider(notes, 40, 132, 440, HEX.lineStrong);
  meta(notes, "01 / COLOR", 40, 174, 200, HEX.ink);
  [
    ["PAPER", HEX.paper],
    ["INK", HEX.ink],
    ["MUTED", HEX.muted],
    ["LINE", HEX.line],
    ["INVERSE", HEX.inverse]
  ].forEach((swatch, i) => {
    const x = 40 + i * 88;
    strokedRect(notes, `Swatch / ${swatch[0]}`, x, 216, 72, 72, swatch[1], HEX.line);
    meta(notes, swatch[0], x, 300, 72, HEX.muted);
  });
  meta(notes, "02 / TYPOGRAPHY", 40, 362, 240, HEX.ink);
  text(notes, { value: "Aa", x: 40, y: 404, width: 140, font: serifItalic, size: 76, lineHeight: 78, tracking: -2, color: HEX.ink });
  text(notes, { value: "宋小鹏", x: 194, y: 420, width: 250, font: sans, size: 42, lineHeight: 50, tracking: -2, color: HEX.ink });
  meta(notes, `SANS / ${sans.family.toUpperCase()}`, 40, 506, 220, HEX.muted);
  meta(notes, `SERIF / ${serif.family.toUpperCase()}`, 260, 506, 220, HEX.muted, "RIGHT");
  divider(notes, 40, 554, 440, HEX.line);
  meta(notes, "03 / GRID & SPACING", 40, 590, 260, HEX.ink);
  [
    ["CANVAS", "1440 PX"],
    ["MARGIN", "120 PX"],
    ["COLUMNS", "12"],
    ["GUTTER", "24 PX"],
    ["BASELINE", "8 PX"]
  ].forEach((row, i) => {
    const y = 636 + i * 42;
    meta(notes, row[0], 40, y, 180, HEX.muted);
    meta(notes, row[1], 300, y, 180, HEX.ink, "RIGHT");
  });
  divider(notes, 40, 860, 440, HEX.line);
  meta(notes, "04 / MOTION", 40, 896, 200, HEX.ink);
  [
    "ENTRY  /  480MS · Y 16 → 0",
    "HOVER  /  IMAGE SCALE 1 → 1.015",
    "LINK   /  UNDERLINE 180MS",
    "EASING /  CUBIC-BEZIER(.22,1,.36,1)",
    "A11Y   /  REDUCED MOTION: NO OFFSET"
  ].forEach((line, i) => meta(notes, line, 40, 944 + i * 40, 440, i === 4 ? HEX.ink : HEX.muted));
  divider(notes, 40, 1164, 440, HEX.line);
  meta(notes, "05 / PRINCIPLE", 40, 1200, 200, HEX.ink);
  text(notes, { value: "用真实内容、定制断行与严谨网格建立个性，而不是添加更多视觉元素。", x: 40, y: 1240, width: 420, font: sans, size: 16, lineHeight: 27, color: HEX.ink });

  root.setPluginData("designDirection", "Editorial Minimalism / Quiet Precision");
  root.setPluginData("contentSource", "story-web repository / 2026");
  root.setPluginData("motion", "480ms cubic-bezier(.22,1,.36,1); reduced-motion removes offsets");

  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.closePlugin("Quiet personal website UI created");
}

main().catch((error) => {
  figma.closePlugin(`Failed: ${error instanceof Error ? error.message : String(error)}`);
});
