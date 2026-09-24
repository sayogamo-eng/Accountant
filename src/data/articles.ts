import { getCollection } from 'astro:content';

export async function getArticles() {
  const all = await getCollection('articles', ({ data }) => !data.draft);
  return all.sort((a, b) => (b.data.updatedDate ?? b.data.pubDate).getTime() - (a.data.updatedDate ?? a.data.pubDate).getTime());
}
