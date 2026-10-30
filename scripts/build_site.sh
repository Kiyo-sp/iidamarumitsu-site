#!/usr/bin/env bash
# Astro サイトをビルドして docs/（GitHub Pages の配信元）に反映する。下書き（status: draft）は含まれない。
set -euo pipefail
cd "$(dirname "$0")/.."
(cd site && npm ci --silent && npx astro build)
rsync -a --delete site/dist/ docs/
echo "docs/ を更新しました。git diff --stat docs/ で確認してからコミットしてください。"
