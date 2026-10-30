// 記事まわりの道具（facts / topics / new-article / check / publish）で共通に使うもの。
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

export const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const REPO = path.resolve(SITE, "..");
export const COLUMN_DIR = path.join(SITE, "src/content/column");
export const NEWS_DIR = path.join(SITE, "src/content/news");
export const PHOTO_DIR = path.join(SITE, "src/assets/photos");
export const FACTS_FILE = path.join(REPO, "data/private/parts_facts.json");
export const DOCS_DIR = path.join(REPO, "docs");

// 安全に関わる品目（ブレーキ・足回り・操舵）。記事の part.safety は必ず true にする
export const SAFETY_CODES = new Map([
  ["5427", "ブレーキパッド"], ["5421", "ブレーキシュー"], ["5430", "ディスクローター"],
  ["5388", "スタビライザーリンク"], ["5493", "アッパーマウント"], ["5306", "ハブロックナット"],
]);

// Da-win の半角カナ・長音ハイフンを読みやすい形に揃える（ﾘﾌﾞｴ-ｽ → リブエース）
export function norm(value) {
  return String(value ?? "").normalize("NFKC").trim().replace(/(?<=[ァ-ヶ])-/g, "ー");
}

export function readFrontmatter(file) {
  const text = fs.readFileSync(file, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`${path.basename(file)}: 先頭の --- で囲まれた設定がありません`);
  return { data: YAML.parse(m[1]) ?? {}, body: m[2] };
}

export function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => path.join(dir, f));
}

export function loadFacts() {
  if (!fs.existsSync(FACTS_FILE)) return null;
  return JSON.parse(fs.readFileSync(FACTS_FILE, "utf8"));
}

export function factsKey(facts) {
  return `${facts.model}:${facts.itemCode}`;
}

export function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}
