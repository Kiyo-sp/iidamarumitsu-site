// 下書きも含めてビルドし、手元のブラウザで確認する（http://localhost:4321/）。終わったら Ctrl+C。
//   npm run preview-drafts
// 下書きのページには「下書き（未承認）のプレビューです」と表示される。公開はされない。
import path from "node:path";
import { spawnSync } from "node:child_process";
import { SITE } from "./lib.mjs";

const astro = path.join(SITE, "node_modules/astro/bin/astro.mjs");
const env = { ...process.env, PREVIEW_DRAFTS: "1" };
const build = spawnSync(process.execPath, [astro, "build"], { cwd: SITE, stdio: "inherit", env });
if (build.status !== 0) process.exit(build.status ?? 1);
spawnSync(process.execPath, [astro, "preview", "--port", "4321"], { cwd: SITE, stdio: "inherit", env });
