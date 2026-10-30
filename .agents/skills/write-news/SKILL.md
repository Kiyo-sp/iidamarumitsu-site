---
name: write-news
description: お知らせ（休業日・営業時間の変更・新しい取扱いなど）を書く。「お知らせを出して」と頼まれたときに使う。
---

# お知らせを書く

1. 何を知らせるか、日付・期間・時間などの事実を担当者に確認する。推測で日付を書かない。
2. `site/src/content/news/<英小文字のURL名>.md` を作る（例: `year-end-holidays-2026.md`）。書式は AGENTS.md の「お知らせの書き方」。
3. `npm run check` → `npm run preview-drafts` で確認してもらう。
4. OK なら `status: approved` にして publish-site で公開する。トップページにも新しい順に 3 件出ます。
- 古いお知らせを消したいときは、ファイルを消すか `status: draft` に戻してから公開する。
