// まだ記事になっていない「車種(型式)×部品」を、出荷実績の多い順に出す。
//   npm run topics            … 上位 20 件
//   npm run topics -- 50      … 上位 50 件
//   npm run topics -- 20 タント … 車種名・型式・部品名に「タント」を含むものだけ
import { COLUMN_DIR, SAFETY_CODES, listMarkdown, readFrontmatter, loadFacts, factsKey, fail } from "./lib.mjs";

const limit = Number(process.argv[2] ?? 20);
const filter = process.argv[3] ?? "";
const facts = loadFacts();
if (!facts) fail("data/private/parts_facts.json がありません。先に npm run facts -- <売上明細.xls> を実行してください。");

const written = new Set();
for (const file of listMarkdown(COLUMN_DIR)) {
  const { data } = readFrontmatter(file);
  if (data.facts) written.add(factsKey(data.facts));
}

const rows = Object.entries(facts)
  .filter(([key]) => !written.has(key))
  .filter(([, f]) => !filter || `${f.vehicleName} ${f.model} ${f.partName}`.includes(filter))
  .sort((a, b) => b[1].shipments - a[1].shipments)
  .slice(0, limit);

console.log(`記事になっていない組合せ（全 ${Object.keys(facts).length - written.size} 件中 上位 ${rows.length} 件）\n`);
console.log("キー\t車種\t型式\t部品（Da-win の品名）\t出荷件数\t品番の数\t安全部品");
for (const [key, f] of rows) {
  console.log([key, f.vehicleName, f.model, f.partName, f.shipments, f.partNumbers.length, SAFETY_CODES.has(f.itemCode) ? "安全部品" : ""].join("\t"));
}
console.log("\n記事を作るときは: npm run new-article -- <キー> --slug <英小文字のURL名> --maker <車のメーカー> --vehicle <車種名> --part <部品名>");
