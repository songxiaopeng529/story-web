"use client";

import { useState } from "react";

const parts = [
  { title: "Agent Runtime", note: "自研原生运行时", detail: "以原生 Agent Runtime 为核心，连接模型、工具与工作空间。", nodes: ["Model Gateway", "Agent Core", "Tools"] },
  { title: "工作空间", note: "工具与边界", detail: "工具注册与工作空间沙箱，为编程任务提供清晰的执行边界。", nodes: ["Workspace", "Tool Registry", "Sandbox"] },
  { title: "扩展能力", note: "让能力继续生长", detail: "通过独立的 Memory、Skills 与 MCP 包组织可扩展能力。", nodes: ["Memory", "Skills", "MCP"] },
];
export function ForgePreview() {
  const [selected, setSelected] = useState(0);
  const part = parts[selected];
  return <div className="forge-preview">
    <div className="preview-bar"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><span>Story Forge</span><span className="preview-caption">项目结构示意</span></div>
    <div className="preview-interior"><div className="preview-choices" aria-label="探索项目结构">{parts.map((item, index) => <button key={item.title} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>{item.title}</span><small>{item.note}</small></button>)}</div>
      <div className="runtime-diagram" aria-live="polite"><div className="runtime-title">{part.title}</div><div className="runtime-nodes">{part.nodes.map((node, index) => <span key={node}><i aria-hidden="true">{["◇", "✳", "⌘"][index]}</i>{node}</span>)}</div><p>{part.detail}</p></div>
    </div>
    <div className="preview-bottom"><span className="status-dot" />Desktop-first coding agent platform</div>
  </div>;
}
