#!/usr/bin/env node
/**
 * LP Consistency Check
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LP_DIR = path.join(ROOT, "lp");

function resolvePageDir(name) {
  if (name.includes("/")) return path.join(ROOT, name);
  return path.join(LP_DIR, name);
}

function checkLP(lpName) {
  var warnings = [];
  var errors = [];
  var lpPath = resolvePageDir(lpName);

  if (!fs.existsSync(lpPath) || !fs.statSync(lpPath).isDirectory()) {
    return { errors: [], warnings: [] };
  }

  var metaPath = path.join(lpPath, "meta.json");
  var indexPath = path.join(lpPath, "index.js");

  if (!fs.existsSync(indexPath) || !fs.existsSync(metaPath)) {
    return { errors: errors, warnings: warnings };
  }

  var meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  if (!meta.title) errors.push("  meta.json missing title");
  if (!meta.description) errors.push("  meta.json missing description");

  return { errors: errors, warnings: warnings };
}

function main() {
  var args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: node shared/check-lp.js <lp-name|--all>");
    process.exit(1);
  }

  var targets = [];
  if (args[0] === "--all") {
    var pagesDir = path.join(ROOT, "pages");
    if (fs.existsSync(pagesDir)) {
      fs.readdirSync(pagesDir, { withFileTypes: true }).forEach(function(d) {
        if (d.isDirectory() && d.name !== "dist") {
          targets.push("pages/" + d.name);
        }
      });
    }
  } else {
    targets = args;
  }

  var totalErrors = 0;
  console.log("Checking consistency...\n");

  targets.forEach(function(name) {
    var result = checkLP(name);
    if (result.errors.length === 0) {
      console.log("  \u2713 " + name);
    } else {
      console.log("  \u2717 " + name);
      result.errors.forEach(function(e) { console.log(e); });
      totalErrors += result.errors.length;
    }
  });

  console.log("");
  if (totalErrors > 0) {
    console.log("FAIL: " + totalErrors + " issue(s) found.");
    process.exit(1);
  } else {
    console.log("OK: All checks passed.");
  }
}

main();
