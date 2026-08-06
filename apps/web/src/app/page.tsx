import { resume, type ResumeEducation } from "@content/resume";

import { ArticleList } from "@/components/content/article-list";
import { WorkList } from "@/components/content/work-list";
import { IntroOverlay } from "@/components/layout/intro-overlay";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getFeaturedArticles, getFeaturedWorks } from "@/lib/content";

export default function Home() {
  const featuredArticles = getFeaturedArticles();
  const featuredWorks = getFeaturedWorks();
  const education: readonly ResumeEducation[] = resume.education;
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
      <IntroOverlay name={resume.identity.displayName.toUpperCase()} />

      <section aria-labelledby="home-title" className="home-hero">
        <Container className="home-hero__inner">
          <div className="home-hero__meta">
            <p className="meta-label">个人档案 / 2026</p>
            <p className="meta-label">GITHUB / CONTENT SOURCE</p>
          </div>
          <div className="home-hero__grid">
            <div>
              <h1 id="home-title">{resume.identity.name}</h1>
              <p className="home-hero__english">
                {resume.identity.displayName}
              </p>
            </div>
            <div className="home-hero__intro">
              <p className="meta-label">{resume.identity.headline}</p>
              <p>{resume.identity.summary}</p>
            </div>
          </div>
          <div className="home-hero__foot">
            <span>向下阅读 ↓</span>
            <span>简历 · 文章 · 作品</span>
          </div>
        </Container>
      </section>

      <section aria-labelledby="profile-heading" className="home-section">
        <Container>
          <SectionHeading index="01" label="PROFILE" title="关于" />
          <div className="profile-grid">
            <p className="profile-grid__lead" id="profile-heading">
              先把复杂问题说清楚，再把它做成容易使用、方便维护的产品。
            </p>
            <div className="profile-grid__details">
              <p className="meta-label">WORKING PRINCIPLES / 工作方式</p>
              <ol className="principle-list">
                {resume.principles.map((principle, index) => (
                  <li key={principle}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {principle}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="experience-heading" className="home-section">
        <Container>
          <SectionHeading index="02" label="EXPERIENCE" title="经历" />
          <div className="experience-list" id="experience-heading">
            {resume.experience.map((experience) => (
              <article
                className="experience-row"
                key={`${experience.period}-${experience.title}`}
              >
                <p className="meta-label">{experience.period}</p>
                <div>
                  <p className="experience-row__organization">
                    {experience.organization}
                  </p>
                  <h3>{experience.title}</h3>
                </div>
                <div>
                  <p>{experience.summary}</p>
                  <ul>
                    {experience.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="works-heading" className="home-section">
        <Container>
          <SectionHeading
            action={<TextLink href="/works">全部作品</TextLink>}
            index="03"
            label="SELECTED WORKS"
            title="精选作品"
          />
          <div id="works-heading">
            <WorkList compact works={featuredWorks} />
          </div>
        </Container>
      </section>

      <section aria-labelledby="writing-heading" className="home-section">
        <Container>
          <SectionHeading
            action={<TextLink href="/articles">全部文章</TextLink>}
            index="04"
            label="LATEST WRITING"
            title="最近文章"
          />
          <div id="writing-heading">
            <ArticleList articles={featuredArticles} compact />
          </div>
        </Container>
      </section>

      <section aria-labelledby="skills-heading" className="home-section">
        <Container>
          <SectionHeading
            index="05"
            label={education.length ? "SKILLS / EDUCATION" : "SKILLS"}
            title={education.length ? "能力与教育" : "能力"}
          />
          <div
            className={`skills-grid${education.length ? "" : " skills-grid--single"}`}
            id="skills-heading"
          >
            <div className="skills-list">
              {resume.skills.map((group) => (
                <div key={group.label}>
                  <p className="meta-label">{group.label}</p>
                  <p>{group.items.join(" · ")}</p>
                </div>
              ))}
            </div>
            {education.length ? (
              <div className="education-block">
                <p className="meta-label">EDUCATION</p>
                {education.map((entry) => (
                  <div key={`${entry.period}-${entry.institution}`}>
                    <p>{entry.institution}</p>
                    <p>{entry.program}</p>
                    <span>{entry.period}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section aria-labelledby="contact-heading" className="contact-band">
        <Container>
          <p className="meta-label">06 / CONTACT</p>
          <h2 id="contact-heading">有项目、想法，或只是想聊聊？</h2>
          <p>
            目前公开的联系入口在
            GitHub。你也可以从这个仓库看到网站接下来如何生长。
          </p>
          <TextLink external href={siteConfig.github}>
            在 GitHub 找到我
          </TextLink>
        </Container>
      </section>

      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        type="application/ld+json"
      />
    </main>
  );
}
