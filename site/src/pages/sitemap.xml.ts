import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

// 承認済みの記事だけを載せる（下書きプレビュー時も載せない）
export const GET: APIRoute = async ({ site }) => {
  const entries = await getCollection("column", (e) => e.data.status === "approved");
  const news = await getCollection("news", (e) => e.data.status === "approved");
  const urls = [
    { loc: "/", lastmod: undefined },
    { loc: "/column/", lastmod: undefined },
    { loc: "/business/", lastmod: undefined },
    { loc: "/news/", lastmod: undefined },
    ...entries.map((e) => ({ loc: `/column/${e.id}/`, lastmod: (e.data.updatedAt ?? e.data.publishedAt).toISOString().slice(0, 10) })),
    ...news.map((e) => ({ loc: `/news/${e.id}/`, lastmod: e.data.date.toISOString().slice(0, 10) })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${new URL(u.loc, site).href}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`)
    .join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
