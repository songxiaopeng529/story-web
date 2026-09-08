import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import type { ContentEntry } from "@/lib/content";

// Branches express growth; only labeled project links represent actual works.
const branches = Array.from({ length: 15 }, (_, index) => {
  const angle = index * Math.PI * 2 / 15 - 0.3;
  const length = 0.72 + (index % 4) * 0.075;
  const x = 420 + Math.cos(angle) * 230 * length;
  const y = 278 + Math.sin(angle) * 155 * length;
  return { x, y, tips: Array.from({ length: 4 }, (_, tip) => {
    const spread = angle + (tip - 1.5) * 0.4;
    return { x: x + Math.cos(spread) * (36 + tip * 8), y: y + Math.sin(spread) * (25 + tip * 5) };
  }) };
});
export function GardenGraph({ works }: { works: ContentEntry[] }) {
  return (
    <div className="garden-figure">
      <h2 id="works-title" className="section-title garden-title">正在生长的作品</h2>
      <div className="garden-network">
        <Image src={assetPath("/images/natural-wash.webp")} alt="" fill sizes="(max-width: 700px) 100vw, 65vw" className="garden-wash" />
        <svg className="garden-lines" viewBox="0 0 840 560" fill="none" aria-hidden="true">
          {branches.map((branch, index) => <g key={index}>
            <path d={`M420 278Q${(420 + branch.x) / 2 + 12} ${(278 + branch.y) / 2 - 10} ${branch.x} ${branch.y}`} stroke="#d3dfaa" strokeOpacity=".5" strokeWidth=".85" />
            <circle cx={branch.x} cy={branch.y} r="3.5" fill="#e0eab0" />
            <circle cx={branch.x} cy={branch.y} r="8" stroke="#c9d993" strokeOpacity=".3" />
            {branch.tips.map((tip, i) => <g key={i}><path d={`M${branch.x} ${branch.y}L${tip.x} ${tip.y}`} stroke="#d3dfaa" strokeOpacity=".45" strokeWidth=".65" /><circle cx={tip.x} cy={tip.y} r={i % 2 ? 2 : 3} fill="#d5e1a6" opacity={0.6 + i * .1} /><circle cx={tip.x} cy={tip.y} r="5.5" stroke="#d5e1a6" strokeOpacity=".25" /></g>)}
          </g>)}
          <circle cx="420" cy="278" r="19" fill="#e6edb4" fillOpacity=".14" /><circle cx="420" cy="278" r="11" fill="#ecf1c5" /><circle cx="420" cy="278" r="5" fill="white" />
        </svg>
        {works.map((work, index) => <Link className={`garden-project garden-project-${index % 2}`} key={work.slug} href={`/works/${work.slug}/`}><span className="project-seed" aria-hidden="true" /><span className="project-name">{work.title}</span></Link>)}
      </div>
    </div>
  );
}
