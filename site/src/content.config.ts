/*
 * 部品コラム。frontmatter の facts は scripts/build_parts_facts.py の出力をそのまま貼る（手で書き換えない）。
 * 本文は AI 原稿を担当者が確認したもの。status: approved だけを公開ビルドに含める。
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const partNumber = z.object({
  number: z.string(), maker: z.string(), count: z.number(), years: z.array(z.number()),
});

const column = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/column" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    kind: z.enum(["vehicle-part", "part-guide", "business"]),
    audience: z.enum(["individual", "business", "both"]),
    status: z.enum(["draft", "approved"]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    vehicle: z.object({ maker: z.string(), name: z.string(), model: z.string() }).optional(),
    part: z.object({ name: z.string(), safety: z.boolean() }).optional(),
    photos: z.array(z.object({ src: image(), alt: z.string() })).optional(),
    // facts は販売データの原集計を保つ。適合確認できない品番の掲載除外は別欄で記録する。
    excludedPartNumbers: z.array(z.object({ number: z.string(), reason: z.string() })).optional(),
    facts: z.object({
      vehicleName: z.string(), model: z.string(), itemCode: z.string(), partName: z.string(),
      shipments: z.number(), period: z.tuple([z.string(), z.string()]),
      years: z.array(z.object({ year: z.number(), count: z.number() })),
      partNumbers: z.array(partNumber),
      coParts: z.array(z.object({ name: z.string(), count: z.number() })),
      source: z.string(),
    }).optional(),
  }).superRefine((data, ctx) => {
    const excluded = data.excludedPartNumbers ?? [];
    const numbers = new Set<string>();
    const partNumbers = data.facts?.partNumbers ?? [];
    const visibleText = [
      data.title, data.description, data.part?.name,
      data.vehicle?.maker, data.vehicle?.name, data.vehicle?.model,
      ...(data.photos ?? []).map((photo) => photo.alt),
    ].filter(Boolean).join(" ");
    for (const [index, item] of excluded.entries()) {
      if (numbers.has(item.number)) {
        ctx.addIssue({ code: "custom", path: ["excludedPartNumbers", index, "number"], message: "同じ品番を重複して除外できません。" });
      }
      numbers.add(item.number);
      if (!partNumbers.some((part) => part.number === item.number)) {
        ctx.addIssue({ code: "custom", path: ["excludedPartNumbers", index, "number"], message: "除外品番は facts に含まれている必要があります。" });
      }
      if (!item.reason.trim()) {
        ctx.addIssue({ code: "custom", path: ["excludedPartNumbers", index, "reason"], message: "掲載から除外する理由を記録してください。" });
      }
      if (visibleText.includes(item.number)) {
        ctx.addIssue({ code: "custom", path: ["excludedPartNumbers", index, "number"], message: "掲載除外した品番がタイトル、説明、写真説明などの表示箇所に残っています。" });
      }
    }
    if (partNumbers.length && numbers.size >= partNumbers.length) {
      ctx.addIssue({ code: "custom", path: ["excludedPartNumbers"], message: "すべての品番が掲載除外されています。" });
    }
  }),
});

// お知らせ（休業日・新しい取扱いなど）。担当者が自由に書く
const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    status: z.enum(["draft", "approved"]),
  }),
});

export const collections = { column, news };
