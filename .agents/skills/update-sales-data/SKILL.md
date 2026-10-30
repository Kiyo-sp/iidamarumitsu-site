---
name: update-sales-data
description: Da-win の売上明細を取り込んで、記事の実績を最新にする。「売上データを更新して」「明細を出したので取り込んで」と頼まれたときに使う。
---

# 売上明細の取り込み

1. 担当者に Da-win の「得意先電子元帳」を .xls で出力してもらい、保存場所（ダウンロードフォルダなど）を聞く。リポジトリの中には置かない。
2. `cd site` → `npm run facts -- "<売上明細.xls のパス>"`
3. `npm run refresh-facts` で既存記事の実績を最新にする。
4. `npm run check` を通し、publish-site で公開する（実績が変わった記事は更新日が今日になる）。
- 取り込んだ集計（`data/private/parts_facts.json`）は Git に入らない設定なので、コミットされません。
