---
name: publish-site
description: 変更をホームページに公開する。「公開して」「反映して」と頼まれたときに使う。
---

# 公開する

1. 公開する記事・お知らせが `status: approved` になっているか確認する（担当者が OK したものだけ）。
2. `cd site` → `npm run publish -- "<何を公開したかの一言>"`
   - チェック → ビルド → コミット → 送信 まで自動で行います。✖ が出たら止まるので、直してからやり直す。
3. 数分後に https://iidamarumitsu.jp/ に反映されたことを担当者に伝える。
- `git add -A` や `git push --force` は使わない。git でエラーが出たら、何もせずに内容を担当者に伝える。
