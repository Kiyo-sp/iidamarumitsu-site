// 車種×部品の記事の下書きファイルを作る。実績（facts）は集計データから自動で入れ、本文の見出しだけ用意する。
//   npm run new-article -- LA600S:5427 --slug daihatsu-tanto-la600s-front-brake-pad --maker ダイハツ --vehicle タント --part フロントブレーキパッド
// 本文は AI が書き、担当者が確認してから status を approved にする。
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import YAML from "yaml";
import { COLUMN_DIR, SAFETY_CODES, loadFacts, fail } from "./lib.mjs";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { slug: { type: "string" }, maker: { type: "string" }, vehicle: { type: "string" }, part: { type: "string" }, audience: { type: "string", default: "both" } },
});
const key = positionals[0];
const facts = loadFacts();
if (!facts) fail("data/private/parts_facts.json がありません。先に npm run facts -- <売上明細.xls> を実行してください。");
if (!key || !facts[key]) fail(`キー「${key ?? ""}」が集計データにありません。npm run topics で確認してください。`);
for (const name of ["slug", "maker", "vehicle", "part"]) if (!values[name]) fail(`--${name} を指定してください。`);
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(values.slug)) fail("--slug は英小文字・数字・ハイフンだけにしてください（例: suzuki-every-da64v-front-brake-pad）。");

const file = path.join(COLUMN_DIR, `${values.slug}.md`);
if (fs.existsSync(file)) fail(`${path.basename(file)} は既にあります。`);

const f = facts[key];
const today = new Date().toISOString().slice(0, 10);
const data = {
  title: `${values.vehicle} ${f.model} の${values.part}｜出荷実績のある品番と交換のサイン`,
  description: `${values.maker} ${values.vehicle} ${f.model} の${values.part}について、飯田丸光部品が実際に出荷した品番と年式、交換のサイン、注文時に伝えてほしいことをまとめました。`,
  kind: "vehicle-part",
  audience: values.audience,
  status: "draft",
  publishedAt: today,
  vehicle: { maker: values.maker, name: values.vehicle, model: f.model },
  part: { name: values.part, safety: SAFETY_CODES.has(f.itemCode) },
  facts: f,
};
const body = `
## （品番が分かれる理由／まとまっている理由）

## 交換を考えたいサイン

## 一緒に交換されることが多い部品

## ご注文のときに伝えてほしいこと
`;
fs.mkdirSync(COLUMN_DIR, { recursive: true });
fs.writeFileSync(file, `---\n${YAML.stringify(data, { lineWidth: 0 })}---\n${body}`);
console.log(`下書きを作りました: site/src/content/column/${values.slug}.md\n本文の見出しの下を書いてから npm run check で確認してください。`);
