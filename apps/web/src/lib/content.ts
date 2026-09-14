import content from '../../.generated/content.json';
export type Bilingual = { en: string; zh: string };
export type Project = { slug: string; title: string; published?: boolean; repository: string; tags: string[]; description: Bilingual; cover: { theme: string; kicker: Bilingual; headline: Bilingual; caption: Bilingual; mark: string }; features: Bilingual[] };
export type Entry = { slug: string; kind: string; title: string; description: string; date: string; tags: string[]; repository: string; body: string; project?: Project };
export type EntrySummary = Omit<Entry, 'body'>;
export const articles: Entry[] = content.articles;
export const works: Entry[] = content.works;
export function summarize(entries: Entry[]): EntrySummary[] {
  return entries.map(({ body, ...entry }) => { void body; return entry; });
}
