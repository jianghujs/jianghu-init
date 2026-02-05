'use strict';

const CommandBase = require('./command_base');
const path = require('path');
const fs = require('fs');

/**
 * 初始化 Lint 配置
 */
module.exports = class InitLintCommand extends CommandBase {

  async run(cwd, args) {
    const packageJsonPath = path.join(cwd, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
      this.error('Error: package.json not found in current directory.');
      process.exit(1);
    }

    this.notice('Initializing jianghu-lint...');

    // Resource directory
    const lintResourceDir = path.join(__dirname, 'lint');

    // 1. Generate local eslint plugin
    const pluginDir = path.join(cwd, 'eslint-plugin-jianghu');
    const rulesDir = path.join(pluginDir, 'lib', 'rules');
    
    // Create directories
    if (!fs.existsSync(rulesDir)) {
      fs.mkdirSync(rulesDir, { recursive: true });
    }

    // eslint-plugin-jianghu/package.json
    fs.copyFileSync(
      path.join(lintResourceDir, 'plugin_package.json'),
      path.join(pluginDir, 'package.json')
    );

    // eslint-plugin-jianghu/index.js
    fs.copyFileSync(
      path.join(lintResourceDir, 'plugin_index.js'),
      path.join(pluginDir, 'index.js')
    );

    // Rules: Copy all files from lib/lint/rules to plugin rules dir
    const rulesSrcDir = path.join(lintResourceDir, 'rules');
    if (fs.existsSync(rulesSrcDir)) {
      const ruleFiles = fs.readdirSync(rulesSrcDir);
      for (const file of ruleFiles) {
        fs.copyFileSync(
          path.join(rulesSrcDir, file),
          path.join(rulesDir, file)
        );
      }
    }
    this.success('Created local eslint plugin at ./eslint-plugin-jianghu');


    // 2. Create .eslintrc.js
    fs.copyFileSync(
      path.join(lintResourceDir, 'eslintrc.js'),
      path.join(cwd, '.eslintrc.js')
    );
    this.success('Created .eslintrc.js');

    // 3. Create .prettierrc.js
    fs.copyFileSync(
      path.join(lintResourceDir, 'prettierrc.js'),
      path.join(cwd, '.prettierrc.js')
    );
    this.success('Created .prettierrc.js');

    // 3.1 Create .eslintignore and .prettierignore
    fs.copyFileSync(
      path.join(lintResourceDir, 'eslintignore'),
      path.join(cwd, '.eslintignore')
    );
    this.success('Created .eslintignore');

    fs.copyFileSync(
      path.join(lintResourceDir, 'prettierignore'),
      path.join(cwd, '.prettierignore')
    );
    this.success('Created .prettierignore');

    // 4. Update package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.lint = 'eslint . --quiet';
    packageJson.scripts.fix = 'eslint . --fix';
    packageJson.scripts.prepare = 'husky install';
    
    packageJson['lint-staged'] = {
      '**/*.{js,jsx,ts,tsx}': [
        'eslint --fix',
        'prettier --write'
      ],
      '**/*.{json,css,md,html}': [
        'prettier --write'
      ]
    };

    // Add devDependencies
    const devDeps = {
      "eslint": "^8.0.0",
      "prettier": "^2.8.0",
      "husky": "^8.0.0",
      "lint-staged": "^13.0.0",
      "eslint-config-egg": "^12.0.0",
      "eslint-config-prettier": "^8.0.0",
      "eslint-plugin-prettier": "^4.0.0",
      "eslint-plugin-html": "^7.1.0",
      "eslint-plugin-jianghu": "file:./eslint-plugin-jianghu"
    };
    
    packageJson.devDependencies = packageJson.devDependencies || {};
    // Only add if not present
    for (const [dep, version] of Object.entries(devDeps)) {
        if (!packageJson.devDependencies[dep]) {
            packageJson.devDependencies[dep] = version;
        }
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    this.success('Updated package.json');

    // 5. Setup Husky
    const huskyDir = path.join(cwd, '.husky');
    if (!fs.existsSync(huskyDir)) {
      fs.mkdirSync(huskyDir, { recursive: true });
    }
    const preCommitPath = path.join(huskyDir, 'pre-commit');
    const preCommitContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
`;
    fs.writeFileSync(preCommitPath, preCommitContent);
    try {
      fs.chmodSync(preCommitPath, '755');
    } catch (e) {
      // ignore chmod error on windows or other systems
    }
    this.success('Created .husky/pre-commit hook');

    this.notice('\nConfiguration files created.');
    this.warning('Please run "npm install" to install dependencies.');
    this.warning('Husky hooks will be installed automatically via "prepare" script.');
  }

};
