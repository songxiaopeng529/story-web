type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="content-figure">
      {/* MDX figures have author-controlled dimensions and sources. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={alt} loading="lazy" src={src} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
