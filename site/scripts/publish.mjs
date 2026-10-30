// チェック → ビルド → docs/ に反映 → コミット → GitHub に送る（数分で iidamarumitsu.jp に出る）。
//   npm run publish -- "タント LA600S のブレーキパッドの記事を公開"
// 承認済み（status: approved）の記事だけが公開される。下書きは出ない。
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { SITE, REPO, DOCS_DIR, fail } from "./lib.mjs";

const message = process.argv[2];
if (!message) fail('何を公開するのか、ひとことを付けてください。例: npm run publish -- "タントのブレーキパッドの記事を公開"');

const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { cwd: REPO, stdio: "inherit", ...opts });
  if (r.status !== 0) fail(`${cmd} ${args.join(" ")} が失敗しました。上のメッセージを確認してください。`);
};
const node = (script, args = []) => run(process.execPath, [script, ...args], { cwd: SITE });

// ほかの人（または別の PC）の変更を先に取り込む
run("git", ["pull", "--rebase", "--autostash"]);

node(path.join(SITE, "scripts/check.mjs"));
node(path.join(SITE, "node_modules/astro/bin/astro.mjs"), ["build"]);

fs.rmSync(DOCS_DIR, { recursive: true, force: true });
fs.cpSync(path.join(SITE, "dist"), DOCS_DIR, { recursive: true });

// 意図したフォルダだけをコミットする（販売データなどを巻き込まない）
run("git", ["add", "--", "site/src", "site/public", "site/package.json", "site/package-lock.json", "docs"]);
const staged = spawnSync("git", ["diff", "--cached", "--quiet"], { cwd: REPO });
if (staged.status === 0) {
  console.log("変更がないので、公開する内容はありません。");
  process.exit(0);
}
run("git", ["commit", "-m", message]);
run("git", ["push"]);
console.log("\n✓ 公開しました。数分後に https://iidamarumitsu.jp/ に反映されます。");
