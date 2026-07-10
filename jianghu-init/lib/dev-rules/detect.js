'use strict';

const fs = require('fs');
const path = require('path');

const isJianghuInitTool = cwd => fs.existsSync(path.join(cwd, 'lib', 'json', 'v7', 'index.js'));

const isJianghuApp = cwd =>
  fs.existsSync(path.join(cwd, 'app')) &&
  fs.existsSync(path.join(cwd, 'config')) &&
  fs.existsSync(path.join(cwd, 'app.js'));

const detectProfile = cwd => {
  if (isJianghuApp(cwd) && !isJianghuInitTool(cwd)) return 'app';
  if (isJianghuInitTool(cwd)) return 'init-json';
  return 'app';
};

const walkJsFiles = (dir, out, depth = 0) => {
  if (!fs.existsSync(dir) || depth > 6) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkJsFiles(full, out, depth + 1);
      continue;
    }
    if (name.endsWith('.js')) out.push(full);
  }
};

const detectProjectHints = cwd => {
  const hints = { hasV7: false, hasV6: false, hasComponent: false };
  const scanRoots = [
    path.join(cwd, 'app', 'view'),
    path.join(cwd, 'lib', 'json', 'v7', 'pages', 'examples'),
  ].filter(fs.existsSync);

  for (const root of scanRoots) {
    const files = [];
    walkJsFiles(root, files);
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8');
      if (/version\s*:\s*['"]v7['"]/.test(text)) hints.hasV7 = true;
      if (/version\s*:\s*['"]v6['"]/.test(text)) hints.hasV6 = true;
      if (/pageType\s*:\s*['"]jh-component['"]/.test(text)) hints.hasComponent = true;
    }
  }
  return hints;
};

module.exports = {
  detectProfile,
  detectProjectHints,
  isJianghuApp,
  isJianghuInitTool,
};
