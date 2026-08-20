import { resume } from "@content/resume";

import { HeroScene } from "@/components/hero/hero-scene";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { absoluteUrl } from "@/config/site";

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
    <main data-page="home" id="main-content">
      <section aria-label="窗边的少年与猫" className="home-hero">
        <HeroScene />
      </section>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("story-hero-seen")==="1"){var el=document.getElementById("hero-scene");if(el)el.dataset.seen="1";}}catch(e){}`,
        }}
      />

      <section aria-label="简介" className="home-note">
        <Container>
          <h1 className="home-note__greeting">
            你好，我是{resume.identity.name}。
          </h1>
          <p className="home-note__line">
            这里放我做过的东西，和一些正在想的。画得慢，但一直在画。
          </p>
          <nav aria-label="快捷入口" className="home-note__links">
            <TextLink href="/articles">读点文章</TextLink>
            <TextLink href="/works">看看作品</TextLink>
          </nav>
        </Container>
      </section>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        type="application/ld+json"
      />
    </main>
  );
}
