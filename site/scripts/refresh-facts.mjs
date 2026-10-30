// 新しい売上明細を npm run facts で取り込んだあとに、全記事の実績（facts）を最新の集計に置き換える。
//   npm run refresh-facts
// 本文は変えない。実績が変わった記事は updatedAt を今日にする。
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { COLUMN_DIR, listMarkdown, readFrontmatter, loadFacts, factsKey, fail } from "./lib.mjs";

const facts = loadFacts();
if (!facts) fail("data/private/parts_facts.json がありません。先に npm run facts -- <売上明細.xls> を実行してください。");
const today = new Date().toISOString().slice(0, 10);
let changed = 0;
for (const file of listMarkdown(COLUMN_DIR)) {
  const { data, body } = readFrontmatter(file);
  if (!data.facts) continue;
  const latest = facts[factsKey(data.facts)];
  if (!latest) {
    console.warn(`! ${path.basename(file)}: 最新の集計にこの組合せがありません（出荷 3 件未満になった可能性）。そのままにします。`);
    continue;
  }
  if (JSON.stringify(latest) === JSON.stringify(data.facts)) continue;
  data.facts = latest;
  if (data.status === "approved") data.updatedAt = today;
  fs.writeFileSync(file, `---\n${YAML.stringify(data, { lineWidth: 0 })}---\n${body}`);
  console.log(`更新: ${path.basename(file)}`);
  changed += 1;
}
console.log(`${changed} 本の実績を更新しました。`);
