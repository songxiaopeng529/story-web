import { Container } from "@/components/ui/container";

type ContentPageHeaderProps = {
  count: number;
  description: string;
  eyebrow: string;
  title: string;
};

export function ContentPageHeader({
  count,
  description,
  eyebrow,
  title,
}: ContentPageHeaderProps) {
  return (
    <header className="page-hero">
      <Container>
        <div className="page-hero__meta">
          <p className="meta-label">{eyebrow}</p>
          <p className="meta-label">{String(count).padStart(2, "0")} ENTRIES</p>
        </div>
        <h1>{title}</h1>
        <p className="page-hero__description">{description}</p>
      </Container>
    </header>
  );
}
