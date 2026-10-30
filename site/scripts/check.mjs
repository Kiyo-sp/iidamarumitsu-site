// 公開前の自動チェック。1 つでも ✖ があれば公開しない（npm run publish もここで止まる）。
//   npm run check
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { COLUMN_DIR, NEWS_DIR, REPO, SAFETY_CODES, listMarkdown, readFrontmatter, loadFacts, factsKey } from "./lib.mjs";

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${path.basename(file)}: ${msg}`);

// 品番を「適合確定」と言い切らない（同じ型式でも年式・グレードで変わる）
const FORBIDDEN = ["適合確定", "必ず適合", "確実に適合", "間違いなく適合", "適合を保証", "適合保証"];
// 社内の取引条件・原価を出さない
const INTERNAL_WORDS = ["仕入値", "仕入単価", "原価", "粗利", "売単価", "掛け率", "得意先"];

function commonBodyChecks(file, body) {
  if (body.includes("**")) err(file, "本文に ** （太字）があります。太字は使わないルールです。");
  for (const w of INTERNAL_WORDS) if (body.includes(w)) err(file, `本文に社内の情報（${w}）が含まれています。`);
  // 車台番号（例: LA600S-0123456）を載せない
  const vin = body.match(/\b[A-Z]{1,5}\d{1,3}[A-Z]{0,2}-\d{5,7}\b/);
  if (vin) err(file, `本文に車台番号のような文字列（${vin[0]}）があります。お客様の車台番号は載せません。`);
}

const facts = loadFacts();
if (!facts) warnings.push("data/private/parts_facts.json がないため、実績の数字とデータの照合を省略しました（npm run facts で作れます）。");

const ids = new Set();
for (const file of listMarkdown(COLUMN_DIR)) {
  let data, body;
  try {
    ({ data, body } = readFrontmatter(file));
  } catch (e) {
    err(file, e.message);
    continue;
  }
  const slug = path.basename(file, ".md");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) err(file, "ファイル名（URL）は英小文字・数字・ハイフンだけにしてください。");
  for (const k of ["title", "description", "kind", "audience", "status", "publishedAt"]) if (!data[k]) err(file, `「${k}」がありません。`);
  if (!["draft", "approved"].includes(data.status)) err(file, "status は draft（下書き）か approved（公開）にしてください。");
  if (ids.has(slug)) err(file, "同じ URL の記事が 2 本あります。");
  ids.add(slug);
  commonBodyChecks(file, body);
  for (const w of FORBIDDEN) if (`${data.title}${data.description}${body}`.includes(w)) err(file, `「${w}」とは書けません。品番は年式・グレードで変わるため、照会をお願いする書き方にしてください。`);
  if (/[0-9０-９,，]+\s*円|[¥￥]\s*[0-9]/.test(body)) err(file, "本文に価格があります。車種×部品の記事には価格を載せません。");

  if (data.kind === "vehicle-part") {
    const f = data.facts;
    if (!f) { err(file, "車種×部品の記事に facts（実績）がありません。npm run new-article で作ってください。"); continue; }
    if (data.vehicle?.model !== f.model) err(file, `vehicle.model（${data.vehicle?.model}）と実績の型式（${f.model}）が違います。`);
    if (SAFETY_CODES.has(f.itemCode) && data.part?.safety !== true) err(file, `安全に関わる部品（${SAFETY_CODES.get(f.itemCode)}）なので part.safety を true にしてください。`);
    if (facts) {
      const latest = facts[factsKey(f)];
      if (!latest) err(file, "実績（facts）が集計データにありません。手で書き換えていないか確認してください。");
      else if (JSON.stringify(latest) !== JSON.stringify(f)) err(file, "実績（facts）が集計データと違います。手で書き換えず、npm run refresh-facts で更新してください。");
    }
    // 本文に出てくる品番は、実績にあるものだけ（AI が品番を作らないように）
    const known = new Set(f.partNumbers.map((p) => p.number));
    for (const m of body.matchAll(/\b(?:[A-Z]{1,4}\d{3,5}[A-Z]?|\d[A-Z]{2}\d{3}[A-Z]?)\b/g)) {
      if (m[0] !== f.model && !known.has(m[0])) err(file, `本文の品番らしき「${m[0]}」が実績にありません。実績にない品番は書かないでください。`);
    }
    if (data.status === "approved") {
      if (body.includes("（品番が分かれる理由／まとまっている理由）")) err(file, "見出しのひな形が残っています。");
      const sections = body.split(/^## /m).slice(1);
      if (sections.some((s) => s.split("\n").slice(1).join("").trim().length < 20)) err(file, "中身がほとんどない見出しがあります。");
      if (body.replace(/\s/g, "").length < 600) err(file, "本文が短すぎます（600 文字以上）。");
    }
  }
}

for (const file of listMarkdown(NEWS_DIR)) {
  let data, body;
  try {
    ({ data, body } = readFrontmatter(file));
  } catch (e) {
    err(file, e.message);
    continue;
  }
  for (const k of ["title", "date", "status"]) if (!data[k]) err(file, `「${k}」がありません。`);
  commonBodyChecks(file, body);
}

// 販売明細などのデータファイルを Git に入れない（このリポジトリは公開されている）
const git = spawnSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: REPO, encoding: "utf8" });
for (const f of (git.stdout ?? "").split("\n")) {
  if (/\.(xls|xlsx|csv|tsv)$/i.test(f)) errors.push(`${f}: 販売データらしきファイルが Git の対象になっています。リポジトリの外（ダウンロードフォルダなど）に置いてください。`);
}

for (const w of warnings) console.log(`! ${w}`);
if (errors.length) {
  console.error(`\n✖ ${errors.length} 件の問題があります。直してからもう一度 npm run check を実行してください。\n`);
  for (const e of errors) console.error(`  ✖ ${e}`);
  process.exit(1);
}
console.log("✓ チェックを通過しました。");
