#!/usr/bin/env python3
"""Da-win の売上明細（得意先電子元帳 XLS）から、車種(型式)×品目ごとの公開してよい出荷実績を集計する.

公開してよいのは件数・年式・品番・部品メーカー・同時に出荷された部品名だけ。
得意先名・売値・仕入値・車台番号は出力しない（車台番号は同時出荷の判定にだけ使う）。

Usage:
    python3 scripts/build_parts_facts.py <xls> [--min 3] [--out data/private/parts_facts.json]
    python3 scripts/build_parts_facts.py <xls> --emit LA600S:5427   # 記事の frontmatter 用 facts を表示

依存: xlrd（.xls 読み込み）
"""
from __future__ import annotations

import argparse
import collections as C
import json
import pathlib
import re
import sys
import unicodedata as U

import xlrd

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE_LABEL = "飯田丸光部品の販売実績"


def norm(value) -> str:
    s = U.normalize("NFKC", str(value)).strip()
    # Da-win は長音を半角ハイフンで持つ（ﾘﾌﾞｴ-ｽ → リブエ-ス）。カタカナに挟まれたハイフンだけ長音に戻す
    return re.sub(r"(?<=[ァ-ヶ])-", "ー", s)


def load_rows(path: str) -> list[dict]:
    sheet = xlrd.open_workbook(path).sheet_by_index(0)
    header = [norm(c) for c in sheet.row_values(0)]
    return [dict(zip(header, (norm(v) for v in sheet.row_values(r)))) for r in range(1, sheet.nrows)]


def year_of(row: dict) -> int | None:
    y = row["年式"][:4]
    return int(y) if y.isdigit() else None


def month_of(date: str) -> str:
    return date[:7].replace("/", "-")


def build(rows: list[dict], min_shipments: int) -> dict:
    # 同じ車両（型式+車台番号）に同じ日に出た部品を「一緒に交換された部品」とみなす
    visits: dict[tuple, set[str]] = C.defaultdict(set)
    for r in rows:
        if r["車台番号"] and r["品目"] != "0":
            visits[(r["型式"], r["車台番号"], r["売上日"])].add(r["品目"])

    names_by_code: dict[str, C.Counter] = C.defaultdict(C.Counter)
    for r in rows:
        names_by_code[r["品目"]][r["商品名"]] += 1
    code_name = {code: names.most_common(1)[0][0] for code, names in names_by_code.items()}

    groups: dict[tuple, list[dict]] = C.defaultdict(list)
    for r in rows:
        # 品目 0 は Da-win で品目未設定の雑多な行なので、組合せの単位にしない
        if r["型式"] and r["品目"] and r["品目"] != "0":
            groups[(r["型式"], r["品目"])].append(r)

    out = {}
    for (model, code), sel in groups.items():
        if len(sel) < min_shipments:
            continue
        part_numbers: dict[tuple, dict] = {}
        for r in sel:
            key = (r["品番"], r["部品メーカー名"])
            pn = part_numbers.setdefault(key, {"number": r["品番"], "maker": r["部品メーカー名"], "count": 0, "years": set()})
            pn["count"] += 1
            if (y := year_of(r)) is not None:
                pn["years"].add(y)
        co = C.Counter()
        for r in sel:
            if r["車台番号"]:
                for other in visits[(model, r["車台番号"], r["売上日"])] - {code}:
                    co[code_name[other]] += 1
        years = C.Counter(year_of(r) for r in sel if year_of(r) is not None)
        dates = sorted(r["売上日"] for r in sel)
        out[f"{model}:{code}"] = {
            "vehicleName": C.Counter(r["車種名"] for r in sel).most_common(1)[0][0],
            "model": model,
            "itemCode": code,
            "partName": code_name[code],
            "shipments": len(sel),
            "period": [month_of(dates[0]), month_of(dates[-1])],
            "years": [{"year": y, "count": n} for y, n in sorted(years.items())],
            "partNumbers": [
                {**pn, "years": sorted(pn["years"])}
                for pn in sorted(part_numbers.values(), key=lambda p: -p["count"])
            ],
            "coParts": [{"name": n, "count": c} for n, c in co.most_common(8) if c >= 2],
            "source": SOURCE_LABEL,
        }
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("xls")
    ap.add_argument("--min", type=int, default=3, help="出力する組合せの最小出荷件数")
    ap.add_argument("--out", default=str(ROOT / "data/private/parts_facts.json"))
    ap.add_argument("--emit", help="型式:品目コード の facts を JSON で表示（記事 frontmatter 用）")
    args = ap.parse_args()

    facts = build(load_rows(args.xls), args.min)
    if args.emit:
        if args.emit not in facts:
            sys.exit(f"{args.emit} は {args.min} 件未満か存在しません")
        print(json.dumps(facts[args.emit], ensure_ascii=False, indent=2))
        return
    out = pathlib.Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(facts, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(facts)} 組合せ（出荷 {args.min} 件以上）を {out} に出力")


if __name__ == "__main__":
    main()
