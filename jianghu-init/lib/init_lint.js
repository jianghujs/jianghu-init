'use strict';

const CommandBase = require('./command_base');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

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

    // 1. Generate local eslint plugin
    const pluginDir = path.join(cwd, 'eslint-plugin-jianghu');
    const rulesDir = path.join(pluginDir, 'lib', 'rules');
    
    // Create directories
    if (!fs.existsSync(rulesDir)) {
      fs.mkdirSync(rulesDir, { recursive: true });
    }

    // eslint-plugin-jianghu/package.json
    const pluginPackageJson = {
      "name": "eslint-plugin-jianghu",
      "version": "1.0.0",
      "main": "index.js",
      "dependencies": {
        "requireindex": "~1.2.0"
      },
      "engines": {
        "node": ">=12.0.0"
      }
    };
    fs.writeFileSync(path.join(pluginDir, 'package.json'), JSON.stringify(pluginPackageJson, null, 2));

    // eslint-plugin-jianghu/index.js
    const pluginIndexJs = `
/**
 * @fileoverview JianghuJS lint rules
 */
'use strict';

const requireIndex = require('requireindex');

module.exports = {
  rules: requireIndex(__dirname + '/lib/rules'),
};
`;
    fs.writeFileSync(path.join(pluginDir, 'index.js'), pluginIndexJs);

    // Rule 1: check-vue-methods-douiaction.js
    const ruleVueMethodsDoUiAction = `
/**
 * @fileoverview Ensure doUiAction exists in Vue methods with correct signature
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'ensure doUiAction in Vue methods',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingDoUiAction: 'Vue methods must contain "doUiAction" method.',
      invalidDoUiAction: '"doUiAction" must be a function with signature (uiActionId, uiActionData).',
    },
    schema: [],
  },

  create(context) {
    return {
      NewExpression(node) {
        if (node.callee.name === 'Vue' && node.arguments.length > 0) {
          const config = node.arguments[0];
          if (config.type === 'ObjectExpression') {
            const methodsProp = config.properties.find(p => p.key.name === 'methods');
            if (methodsProp && methodsProp.value.type === 'ObjectExpression') {
              const doUiAction = methodsProp.value.properties.find(p => p.key.name === 'doUiAction');
              
              if (!doUiAction) {
                context.report({
                  node: methodsProp,
                  messageId: 'missingDoUiAction',
                });
              } else {
                // Check if it is a function and has arguments
                if (
                  (doUiAction.value.type === 'FunctionExpression' || doUiAction.value.type === 'ArrowFunctionExpression')
                ) {
                   // Check arguments count (optional, but requested "default format and args")
                   // Usually: async doUiAction(uiActionId, uiActionData)
                   // We just warn if params length is not 2, or names don't match loosely? 
                   // Let's be strict on params length >= 2 or names.
                   // Actually, let's just check it is a function for now to avoid false positives on loose usage, 
                   // but user said "must have default format and args".
                   // Let's require at least 2 args.
                   if (doUiAction.value.params.length < 2) {
                     context.report({
                       node: doUiAction,
                       messageId: 'invalidDoUiAction',
                     });
                   }
                } else {
                   context.report({
                     node: doUiAction,
                     messageId: 'invalidDoUiAction',
                   });
                }
              }
            }
          }
        }
      },
    };
  },
};
`;
    fs.writeFileSync(path.join(rulesDir, 'check-vue-methods-douiaction.js'), ruleVueMethodsDoUiAction);

    // Rule 2: check-service-action-data-scheme.js
    const ruleServiceActionDataScheme = `
/**
 * @fileoverview Ensure actionDataScheme constant definition in service files
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'ensure actionDataScheme constant in service',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingActionDataScheme: 'Service file must define "const actionDataScheme = Object.freeze({...})".',
    },
    schema: [],
  },

  create(context) {
    let hasActionDataScheme = false;

    return {
      VariableDeclarator(node) {
        if (node.id.name === 'actionDataScheme') {
          hasActionDataScheme = true;
        }
      },
      'Program:exit'(node) {
        if (!hasActionDataScheme) {
          context.report({
            node,
            messageId: 'missingActionDataScheme',
          });
        }
      },
    };
  },
};
`;
    fs.writeFileSync(path.join(rulesDir, 'check-service-action-data-scheme.js'), ruleServiceActionDataScheme);
    this.success('Created local eslint plugin at ./eslint-plugin-jianghu');


    // 2. Create .eslintrc.js
    const eslintConfig = `module.exports = {
  extends: [
    'eslint-config-egg',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'html',
    'jianghu'
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'prettier/prettier': 'warn'
  },
  overrides: [
    {
      files: ['app/view/page/*.html'],
      rules: {
        'jianghu/check-vue-methods-douiaction': 'error',
      },
    },
    {
      files: ['app/service/*.js'],
      rules: {
        'jianghu/check-service-action-data-scheme': 'error',
      },
    },
  ],
};
`;
    fs.writeFileSync(path.join(cwd, '.eslintrc.js'), eslintConfig);
    this.success('Created .eslintrc.js');

    // 3. Create .prettierrc.js
    const prettierConfig = `module.exports = {
  singleQuote: true,
  semi: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'all',
  endOfLine: 'lf',
  arrowParens: 'avoid',
};
`;
    fs.writeFileSync(path.join(cwd, '.prettierrc.js'), prettierConfig);
    this.success('Created .prettierrc.js');

    // 4. Update package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.lint = 'eslint .';
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

    this.notice('\nConfiguration files created.');
    this.warning('Please run "npm install" to install dependencies.');
    this.warning('Then husky will be installed automatically via "prepare" script.');
    this.warning('Finally, you may need to run: npx husky add .husky/pre-commit "npx lint-staged"');
  }

};
