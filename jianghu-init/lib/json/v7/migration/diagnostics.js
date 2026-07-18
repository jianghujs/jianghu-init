'use strict';

const recordDeprecatedKey = (diagnostics, { path, replacement }) => {
  if (!Array.isArray(diagnostics)) return;
  diagnostics.push({
    level: 'warning',
    code: 'V7_DEPRECATED_KEY',
    path,
    replacement,
  });
};

const diagnosticIdentity = item => [
  item && item.code,
  item && item.path,
  item && item.replacement,
].join('|');

const dedupeDiagnostics = diagnostics => {
  const result = [];
  const seen = new Set();
  for (const item of diagnostics || []) {
    if (!item || !item.code || !item.path) continue;
    const identity = diagnosticIdentity(item);
    if (seen.has(identity)) continue;
    seen.add(identity);
    result.push(item);
  }
  return result;
};

const compactPath = path => String(path || '')
  .replace(/\.tabList\[\d+\]/g, '.tabList[]');

const formatMigrationWarnings = diagnostics => {
  const deduped = dedupeDiagnostics(diagnostics);
  if (!deduped.length) return null;

  const grouped = new Map();
  for (const item of deduped) {
    const from = compactPath(item.path);
    const replacement = compactPath(item.replacement);
    const key = `${from}|${replacement}`;
    const current = grouped.get(key) || { from, replacement, count: 0 };
    current.count += 1;
    grouped.set(key, current);
  }

  const entries = Array.from(grouped.values()).map(item => {
    const suffix = item.count > 1 ? ` ×${item.count}` : '';
    return `${item.from} → ${item.replacement}${suffix}`;
  });
  return `语法已过期，请按照最新规范调整(${deduped.length}): \n ${entries.join('\n')}`;
};

module.exports = {
  recordDeprecatedKey,
  dedupeDiagnostics,
  formatMigrationWarnings,
};
