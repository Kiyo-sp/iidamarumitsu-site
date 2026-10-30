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
  schema: z.object({
    title: z.string(),
    description: z.string(),
    kind: z.enum(["vehicle-part", "part-guide", "business"]),
    audience: z.enum(["individual", "business", "both"]),
    status: z.enum(["draft", "approved"]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    vehicle: z.object({ maker: z.string(), name: z.string(), model: z.string() }).optional(),
    part: z.object({ name: z.string(), safety: z.boolean() }).optional(),
    facts: z.object({
      vehicleName: z.string(), model: z.string(), itemCode: z.string(), partName: z.string(),
      shipments: z.number(), period: z.tuple([z.string(), z.string()]),
      years: z.array(z.object({ year: z.number(), count: z.number() })),
      partNumbers: z.array(partNumber),
      coParts: z.array(z.object({ name: z.string(), count: z.number() })),
      source: z.string(),
    }).optional(),
  }),
});

export const collections = { column };
