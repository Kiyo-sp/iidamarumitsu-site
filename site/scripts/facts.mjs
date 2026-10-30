// Da-win の売上明細（得意先電子元帳 .xls）から、車種(型式)×品目ごとの公開してよい出荷実績を集計する。
//   npm run facts -- "C:\Users\...\得意先電子元帳.xls"
// 公開してよいのは件数・年式・品番・部品メーカー・同時に出荷された部品名だけ。
// 売値・仕入値・車台番号は出力しない（車台番号は「同じ日に一緒に出た部品」の判定にだけ使う）。
// 出力: data/private/parts_facts.json（Git には入れない）
import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";
import { FACTS_FILE, norm, fail } from "./lib.mjs";

const SOURCE_LABEL = "飯田丸光部品の販売実績";
const MIN_SHIPMENTS = 3;

const file = process.argv[2];
if (!file || !fs.existsSync(file)) fail("Da-win から出力した売上明細（.xls）のパスを指定してください。例: npm run facts -- \"C:\\Users\\you\\Downloads\\得意先電子元帳.xls\"");

const wb = XLSX.read(fs.readFileSync(file));
const raw = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "", raw: false });
const rows = raw.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [norm(k), norm(v)])));
for (const col of ["売上日", "車種名", "型式", "年式", "車台番号", "品番", "品目", "商品名", "部品メーカー名"]) {
  if (!(col in (rows[0] ?? {}))) fail(`売上明細に「${col}」の列がありません。Da-win の「得意先電子元帳」を出力してください。`);
}

const yearOf = (r) => (/^\d{4}/.test(r["年式"]) ? Number(r["年式"].slice(0, 4)) : null);
const monthOf = (d) => d.slice(0, 7).replace("/", "-");
// 件数が同じなら名前順（実行ごとに結果が変わらないように）
const top = (counter) => [...counter.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), "ja"));
const bump = (map, key, n = 1) => map.set(key, (map.get(key) ?? 0) + n);

// 品目コード → いちばん多い商品名
const namesByCode = new Map();
for (const r of rows) {
  if (!namesByCode.has(r["品目"])) namesByCode.set(r["品目"], new Map());
  bump(namesByCode.get(r["品目"]), r["商品名"]);
}
const codeName = new Map([...namesByCode].map(([code, names]) => [code, top(names)[0][0]]));

// 同じ車両（型式+車台番号）に同じ日に出た品目
const visits = new Map();
for (const r of rows) {
  if (!r["車台番号"] || r["品目"] === "0") continue;
  const key = `${r["型式"]}|${r["車台番号"]}|${r["売上日"]}`;
  if (!visits.has(key)) visits.set(key, new Set());
  visits.get(key).add(r["品目"]);
}

// 品目 0 は Da-win で品目未設定の雑多な行なので、組合せの単位にしない
const groups = new Map();
for (const r of rows) {
  if (!r["型式"] || !r["品目"] || r["品目"] === "0") continue;
  const key = `${r["型式"]}:${r["品目"]}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(r);
}

const out = {};
for (const [key, sel] of groups) {
  if (sel.length < MIN_SHIPMENTS) continue;
  const [model, code] = key.split(":");
  const pns = new Map();
  for (const r of sel) {
    const k = `${r["品番"]}|${r["部品メーカー名"]}`;
    if (!pns.has(k)) pns.set(k, { number: r["品番"], maker: r["部品メーカー名"], count: 0, years: new Set() });
    const pn = pns.get(k);
    pn.count += 1;
    if (yearOf(r) !== null) pn.years.add(yearOf(r));
  }
  const co = new Map();
  for (const r of sel) {
    if (!r["車台番号"]) continue;
    for (const other of visits.get(`${model}|${r["車台番号"]}|${r["売上日"]}`) ?? []) {
      if (other !== code) bump(co, codeName.get(other));
    }
  }
  const years = new Map();
  for (const r of sel) if (yearOf(r) !== null) bump(years, yearOf(r));
  const vehicleNames = new Map();
  for (const r of sel) bump(vehicleNames, r["車種名"]);
  const dates = sel.map((r) => r["売上日"]).sort();
  out[key] = {
    vehicleName: top(vehicleNames)[0][0],
    model,
    itemCode: code,
    partName: codeName.get(code),
    shipments: sel.length,
    period: [monthOf(dates[0]), monthOf(dates.at(-1))],
    years: [...years].sort((a, b) => a[0] - b[0]).map(([year, count]) => ({ year, count })),
    partNumbers: [...pns.values()]
      .sort((a, b) => b.count - a.count)
      .map((p) => ({ ...p, years: [...p.years].sort((a, b) => a - b) })),
    coParts: top(co).filter(([, c]) => c >= 2).slice(0, 8).map(([name, count]) => ({ name, count })),
    source: SOURCE_LABEL,
  };
}

fs.mkdirSync(path.dirname(FACTS_FILE), { recursive: true });
fs.writeFileSync(FACTS_FILE, JSON.stringify(out, null, 1));
console.log(`${rows.length} 行を読み、${Object.keys(out).length} 組（出荷 ${MIN_SHIPMENTS} 件以上）を data/private/parts_facts.json に出力しました。`);
