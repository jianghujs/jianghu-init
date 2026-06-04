'use strict';

const fs = require('fs');
const path = require('path');

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

const parseFrontmatter = raw => {
  const text = String(raw || '');
  const match = text.match(FRONTMATTER_RE);
  if (!match) {
    return { meta: {}, body: text.trim() };
  }
  const meta = {};
  for (const line of match[1].split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf(':');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (val === 'true') meta[key] = true;
    else if (val === 'false') meta[key] = false;
    else meta[key] = val;
  }
  return { meta, body: match[2].trim() };
};

const ensureDir = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const copyFileIfNeeded = (src, dest, force) => {
  if (force || !fs.existsSync(dest)) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
};

const copyDirContents = (srcDir, destDir, force) => {
  ensureDir(destDir);
  const copied = [];
  for (const name of fs.readdirSync(srcDir)) {
    const src = path.join(srcDir, name);
    if (!fs.statSync(src).isFile()) continue;
    const dest = path.join(destDir, name);
    if (copyFileIfNeeded(src, dest, force)) {
      copied.push(name);
    }
  }
  return copied;
};

const readJson = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const writeJson = (filePath, data) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

module.exports = {
  parseFrontmatter,
  ensureDir,
  copyFileIfNeeded,
  copyDirContents,
  readJson,
  writeJson,
};
