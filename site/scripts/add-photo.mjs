// 写真を記事に追加する。向きを直し、長辺 1600px に縮め、位置情報などの撮影データを消してから保存する。
//   npm run add-photo -- <写真ファイル> <記事のURL名> "写真の説明"
//   例: npm run add-photo -- "C:\Users\you\Pictures\IMG_0123.jpg" daihatsu-tanto-la600s-front-brake-pad "トキコ TN792M の実物"
// 記事ではなく部品の種類の共通写真にしたいときも、まず 1 本の記事に入れてから同じ src を他の記事にも書けばよい。
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import YAML from "yaml";
import { COLUMN_DIR, PHOTO_DIR, readFrontmatter, fail } from "./lib.mjs";

const [src, slug, alt] = process.argv.slice(2);
if (!src || !fs.existsSync(src)) fail("写真ファイルのパスを指定してください。");
const article = path.join(COLUMN_DIR, `${slug ?? ""}.md`);
if (!slug || !fs.existsSync(article)) fail(`記事「${slug ?? ""}」がありません。site/src/content/column/ のファイル名（.md を除く）を指定してください。`);
if (!alt) fail("写真の説明（何が写っているか）を指定してください。");

const { data, body } = readFrontmatter(article);
const photos = data.photos ?? [];
const name = `${slug}-${photos.length + 1}.jpg`;
fs.mkdirSync(PHOTO_DIR, { recursive: true });
// sharp は metadata を付けない限り EXIF（位置情報など）を書き出さない
await sharp(src).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82 }).toFile(path.join(PHOTO_DIR, name));

data.photos = [...photos, { src: `../../assets/photos/${name}`, alt }];
fs.writeFileSync(article, `---\n${YAML.stringify(data, { lineWidth: 0 })}---\n${body}`);
console.log(`写真を追加しました: site/src/assets/photos/${name}`);
