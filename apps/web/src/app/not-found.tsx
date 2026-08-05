import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";

export default function NotFound() {
  return (
    <main className="not-found" id="main-content">
      <Container>
        <p className="meta-label">404 / NOT FOUND</p>
        <h1>这里没有这一页。</h1>
        <p>它可能被移动、尚未发布，或者只是一个写错的地址。</p>
        <TextLink href="/">返回首页</TextLink>
      </Container>
    </main>
  );
}
