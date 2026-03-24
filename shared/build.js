#!/usr/bin/env node
/**
 * Build Script - Iida Marumitsu Buhin
 * Usage:
 *   node shared/build.js pages/home     -> Build single page
 *   node shared/build.js --all          -> Build all pages
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SHARED = path.resolve(__dirname);
const CHECK_LP = path.join(SHARED, "check-lp.js");

function read(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyDirSync(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function runConsistencyCheck(target) {
  const result = spawnSync(process.execPath, [CHECK_LP, target], { stdio: "inherit" });
  return result.status === 0;
}

function buildMetaTags(meta) {
  const lines = [];
  lines.push('<meta charset="UTF-8">');
  lines.push('<meta name="viewport" content="width=device-width,initial-scale=1.0">');
  lines.push(`<title>${meta.title}</title>`);
  lines.push(`<meta name="description" content="${meta.description}">`);

  if (meta.og) {
    const og = meta.og;
    if (og.title) lines.push(`<meta property="og:title" content="${og.title}">`);
    if (og.description) lines.push(`<meta property="og:description" content="${og.description}">`);
    if (og.type) lines.push(`<meta property="og:type" content="${og.type}">`);
    if (og.url) lines.push(`<meta property="og:url" content="${og.url}">`);
    if (og.image) lines.push(`<meta property="og:image" content="${og.image}">`);
    if (og.siteName) lines.push(`<meta property="og:site_name" content="${og.siteName}">`);
    if (og.locale) lines.push(`<meta property="og:locale" content="${og.locale}">`);
  }

  if (meta.twitter) {
    const tw = meta.twitter;
    if (tw.card) lines.push(`<meta name="twitter:card" content="${tw.card}">`);
    if (tw.title) lines.push(`<meta name="twitter:title" content="${tw.title}">`);
    if (tw.description) lines.push(`<meta name="twitter:description" content="${tw.description}">`);
  }

  if (meta.canonical) {
    lines.push(`<link rel="canonical" href="${meta.canonical}">`);
    lines.push('<meta name="robots" content="index, follow">');
  }

  return lines.join("\n");
}

function buildStructuredData(meta) {
  if (!meta.structuredData) return "";
  return '<script type="application/ld+json">\n' + JSON.stringify(meta.structuredData, null, 2) + "\n</script>";
}

function resolvePageDir(name) {
  if (name.includes("/")) return path.join(ROOT, name);
  return path.join(ROOT, "lp", name);
}

function buildLP(lpName) {
  const lpDir = resolvePageDir(lpName);
  const distDir = path.join(lpDir, "dist");
  const metaPath = path.join(lpDir, "meta.json");
  const indexPath = path.join(lpDir, "index.js");

  if (!fs.existsSync(metaPath)) {
    console.error(`  \u2717 ${lpName}: meta.json not found`);
    return false;
  }
  if (!fs.existsSync(indexPath)) {
    console.error(`  \u2717 ${lpName}: index.js not found`);
    return false;
  }

  const meta = JSON.parse(read(metaPath));
  const baseCSS = read(path.join(SHARED, "base.css"));
  const tokensJS = read(path.join(SHARED, "tokens.js"));
  const hooksJS = read(path.join(SHARED, "hooks.js"));
  const primitivesJS = read(path.join(SHARED, "primitives.js"));
  const navJS = read(path.join(SHARED, "nav.js"));
  const footerJS = read(path.join(SHARED, "footer.js"));
  const lpJS = read(indexPath);

  const cdnScripts = [
    "https://unpkg.com/react@18/umd/react.production.min.js",
    "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"
  ].map(function(src) {
    return `<script crossorigin src="${src}"></script>`;
  }).join("\n");

  const structuredData = buildStructuredData(meta);
  const fontLinks = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;900&display=swap">`;
  const styleBlock = `<style>\n${baseCSS}\n</style>`;
  const siteBase = meta.siteBase || "/";

  const sharedScriptTag = `<script src="${siteBase}shared.js"></script>`;
  const mainScript = `<script>
var { useState, useEffect, useRef, useCallback } = React;
var SITE_BASE = "${siteBase}";
</script>
${sharedScriptTag}
<script>
${lpJS}
</script>`;

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
${buildMetaTags(meta)}
${structuredData}
${fontLinks}
${styleBlock}
</head>
<body>
<div id="root"></div>
${cdnScripts}
${mainScript}
</body>
</html>`;

  ensureDir(distDir);
  const htmlPath = path.join(distDir, "index.html");
  fs.writeFileSync(htmlPath, html, "utf-8");

  const imagesDir = path.join(lpDir, "images");
  if (fs.existsSync(imagesDir)) {
    copyDirSync(imagesDir, path.join(distDir, "images"));
  }

  const htmlKB = Math.round(fs.statSync(htmlPath).size / 1024);
  console.log(`  \u2713 ${lpName} -> html(${htmlKB}KB)`);
  return true;
}

function buildSharedJS() {
  const tokensJS = read(path.join(SHARED, "tokens.js"));
  const hooksJS = read(path.join(SHARED, "hooks.js"));
  const primitivesJS = read(path.join(SHARED, "primitives.js"));
  const navJS = read(path.join(SHARED, "nav.js"));
  const footerJS = read(path.join(SHARED, "footer.js"));

  const content = `/* shared.js -- auto-generated */
${tokensJS}

${hooksJS}

${primitivesJS}

${navJS}

${footerJS}
`;
  const outPath = path.join(ROOT, "shared.js");
  fs.writeFileSync(outPath, content, "utf-8");
  const kb = Math.round(fs.statSync(outPath).size / 1024);
  console.log(`  \u2713 shared.js -> ${kb}KB`);
  return true;
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: node shared/build.js <page-name> | --all");
  process.exit(1);
}

console.log("Building pages...\n");

if (args[0] === "--all") {
  if (!runConsistencyCheck("--all")) {
    console.error("\nConsistency check failed.");
    process.exit(1);
  }
  buildSharedJS();
  let targets = [];
  const pagesDir = path.join(ROOT, "pages");
  if (fs.existsSync(pagesDir)) {
    fs.readdirSync(pagesDir).filter(function(d) {
      return fs.existsSync(path.join(pagesDir, d, "meta.json"));
    }).forEach(function(d) { targets.push("pages/" + d); });
  }
  let ok = 0, fail = 0;
  targets.forEach(function(d) {
    if (buildLP(d)) ok++; else fail++;
  });
  console.log(`\nDone: ${ok} built, ${fail} failed.`);
} else {
  const lpName = args[0];
  if (!runConsistencyCheck(lpName)) {
    console.error("\nConsistency check failed.");
    process.exit(1);
  }
  buildSharedJS();
  if (buildLP(lpName)) {
    console.log("\nDone.");
  } else {
    process.exit(1);
  }
}
