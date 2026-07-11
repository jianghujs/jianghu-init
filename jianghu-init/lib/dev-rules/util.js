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

const writeJson = (filePath, data) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
};

const createSyncResult = () => ({ desired: [], written: [], unchanged: [], skipped: [], removed: [] });

const mergeSyncResult = (target, source) => {
  for (const key of [ 'desired', 'written', 'unchanged', 'skipped', 'removed' ]) {
    target[key].push(...(source[key] || []));
  }
  return target;
};

const syncTextFile = ({ cwd, filePath, content, force, result }) => {
  const relativePath = path.relative(cwd, filePath);
  result.desired.push(relativePath);
  if (!force && fs.existsSync(filePath)) {
    if (fs.readFileSync(filePath, 'utf8') === content) {
      result.unchanged.push(relativePath);
      return true;
    }
    result.skipped.push(relativePath);
    return false;
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  result.written.push(relativePath);
  return true;
};

module.exports = {
  parseFrontmatter,
  ensureDir,
  writeJson,
  createSyncResult,
  mergeSyncResult,
  syncTextFile,
};
