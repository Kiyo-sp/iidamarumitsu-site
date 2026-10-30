// iidamarumitsu.jp 静的サイト。記事は src/content/column/*.md（冒頭の facts はスクリプト生成、本文は AI 原稿を担当者が承認）。
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://iidamarumitsu.jp",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  devToolbar: { enabled: false },
});
