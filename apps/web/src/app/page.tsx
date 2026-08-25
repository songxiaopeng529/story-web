import LiquidGlassCluster from "@/components/home/liquid-glass-cluster";
import { absoluteUrl } from "@/config/site";
import { resume } from "@content/resume";

export default function Home() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: resume.identity.name,
    alternateName: resume.identity.displayName,
    description: resume.identity.summary,
    url: absoluteUrl(),
    sameAs: resume.links.map((link) => link.href),
    knowsAbout: resume.skills.flatMap((group) => group.items),
  };

  return (
    <main className="landing-page" data-page="home" id="main-content">
      <section aria-labelledby="landing-title" className="landing-stage">
        <div aria-hidden="true" className="landing-stage__glass">
          <LiquidGlassCluster
            backdrop={{
              type: "Text",
              text: "SONG\nXIAOPENG",
              font: {
                fontFamily: "Arial Black, Arial, Helvetica, sans-serif",
                fontSize: 168,
                fontWeight: 800,
                lineHeight: 0.8,
                letterSpacing: "-0.085em",
              },
              textColor: "#f5f5f3",
            }}
            background="#050505"
            depth={42}
            direction="Clockwise"
            glass={{ chromatic: 78, frost: 18, tint: "#ffffff" }}
            shape="Torus"
            size={72}
            speed={15}
          />
        </div>
        <h1 className="sr-only" id="landing-title">
          {resume.identity.displayName} 的个人空间
        </h1>
      </section>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        type="application/ld+json"
      />
    </main>
  );
}
