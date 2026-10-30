---
name: write-column
description: 部品コラム（車種×部品の記事）を作る。「〇〇の記事を作って」「次の記事を書いて」「おすすめの記事を出して」と頼まれたときに使う。
---

# 部品コラムを作る

1. `cd site` してから `npm run topics -- 10`（車種の指定があれば `npm run topics -- 10 <車種名>`）で候補を出し、担当者に選んでもらう。指定がはっきりしていれば候補の中から該当するキーを選ぶ。
   - `data/private/parts_facts.json` がないと言われたら、update-sales-data の手順で売上明細を取り込む。
2. 下書きを作る:
   `npm run new-article -- <キー> --slug <メーカー-車種-型式-部品 を英小文字とハイフンで> --maker <車のメーカー> --vehicle <一般的な車種名> --part <わかりやすい部品名>`
   - 例: `npm run new-article -- DA64V:5427 --slug suzuki-every-da64v-front-brake-pad --maker スズキ --vehicle エブリイ --part フロントブレーキパッド`
   - 車種名は Da-win の表記（ｴﾌﾞﾘｨ など）ではなく一般的な表記にする。
3. 作られた .md の `facts` を読み、AGENTS.md の「記事の書き方」に沿って本文を書く。見本は `src/content/column/daihatsu-tanto-la600s-front-brake-pad.md`。
   - `facts` には触らない。本文の品番は `facts.partNumbers` にあるものだけ。
4. 担当者に「現場で気づいていること（よくある相談・注意点）があれば一言ください」と聞き、もらえたら本文に入れる。
5. `npm run check` を通す。✖ が出たら本文を直す。
6. `npm run preview-drafts` で http://localhost:4321/column/<URL名>/ を担当者に見てもらう。
7. 担当者の OK が出たら `status: approved` にして、publish-site の手順で公開する。
