'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { buildPage } = require('./v7');
const { collectSemanticActions } = require('./v7/actionIntent');
const { resolveV7BuildTargets } = require('./mixin/handle_json_config_v7');
const { dedupeDiagnostics, formatMigrationWarnings } = require('./v7/migration/diagnostics');

const TYPE_CONFIG = {
  page: {
    dir: 'page',
    pageType: 'jh-page',
  },
  component: {
    dir: 'component',
    pageType: 'jh-component',
  },
};

const LEGACY_DATA_SOURCE_KEYS = [
  'resource',
  'actions',
  'listActionId',
  'createActionId',
  'updateActionId',
  'deleteActionId',
];

const STANDARD_UI_ACTIONS = new Set([
  'create',
  'update',
  'delete',
  'cancel',
  'save',
  'batchDelete',
  'getTableData',
  'startCreateItem',
  'createItem',
  'startUpdateItem',
  'updateItem',
  'deleteItem',
]);

const issue = (code, message, configPath) => ({
  code,
  message,
  ...(configPath ? { path: configPath } : {}),
});

const normalizePageType = pageType => {
  if (!pageType) return null;
  if (pageType === 'page' || pageType === 'jh-page') return 'page';
  if (pageType === 'component' || pageType === 'jh-component') return 'component';
  throw new Error(`--pageType 仅支持 page 或 component，当前为 ${pageType}`);
};

const normalizeFileInput = file => {
  const value = String(file || '').trim().replace(/\\/g, '/').replace(/\.js$/, '');
  if (!value) throw new Error('验证必须指定 --file=<pageId|componentPath>');
  if (path.isAbsolute(value)) throw new Error('--file 必须是 init-json 根目录内的相对路径');
  return value;
};

const resolveRequestedType = (file, pageType) => {
  const explicitType = normalizePageType(pageType);
  if (file.startsWith('page/')) {
    if (explicitType && explicitType !== 'page') {
      throw new Error('--file=page/... 与 --pageType=component 冲突');
    }
    return { type: 'page', file: file.slice('page/'.length) };
  }
  if (file.startsWith('component/')) {
    if (explicitType && explicitType !== 'component') {
      throw new Error('--file=component/... 与 --pageType=page 冲突');
    }
    return { type: 'component', file: file.slice('component/'.length) };
  }
  return { type: explicitType, file };
};

const resolveCandidate = ({ cwd, type, file }) => {
  const root = path.resolve(cwd, 'app/view/init-json', TYPE_CONFIG[type].dir);
  const candidate = path.resolve(root, `${file}.js`);
  if (!candidate.startsWith(`${root}${path.sep}`)) {
    throw new Error(`非法 init-json 路径: ${file}`);
  }
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) return null;

  const realRoot = fs.realpathSync(root);
  const realCandidate = fs.realpathSync(candidate);
  if (!realCandidate.startsWith(`${realRoot}${path.sep}`)) {
    throw new Error(`init-json 文件不能通过符号链接指向目录外: ${file}`);
  }
  return {
    type,
    path: realCandidate,
    relativePath: path.relative(path.resolve(cwd), candidate).replace(/\\/g, '/'),
  };
};

const resolveConfigFile = ({ cwd, file, pageType }) => {
  const normalizedFile = normalizeFileInput(file);
  const requested = resolveRequestedType(normalizedFile, pageType);
  const types = requested.type ? [requested.type] : ['page', 'component'];
  const candidates = types
    .map(type => resolveCandidate({ cwd, type, file: requested.file }))
    .filter(Boolean);

  if (!candidates.length) {
    throw new Error(`未找到 init-json 文件: ${normalizedFile}.js`);
  }
  if (candidates.length > 1) {
    throw new Error(`page 与 component 下都存在 ${requested.file}.js，请显式指定 --pageType`);
  }
  return candidates[0];
};

const loadConfig = filePath => {
  const modulePath = require.resolve(filePath);
  delete require.cache[modulePath];
  const config = require(modulePath);
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new Error('init-json 必须通过 module.exports 导出对象');
  }
  return config;
};

const validateCanonicalDataSource = config => {
  const dataSource = config && config.dataSource;
  if (!dataSource || typeof dataSource !== 'object' || Array.isArray(dataSource)) return;
  const legacyKeys = LEGACY_DATA_SOURCE_KEYS.filter(key =>
    Object.prototype.hasOwnProperty.call(dataSource, key),
  );
  if (legacyKeys.length) {
    throw new Error(`v7 dataSource 使用旧 key: ${legacyKeys.join(', ')}；请改用扁平 *Resource`);
  }
};

const validateCanonicalActionKeys = config => {
  for (const { action, loc } of collectSemanticActions(config)) {
    const legacyKeys = ['intent', 'id', 'actionId'].filter(key =>
      Object.prototype.hasOwnProperty.call(action, key),
    );
    if (legacyKeys.length) {
      throw new Error(`v7 ${loc}: 禁止 action 旧语义 key ${legacyKeys.join(', ')}；只使用 label + uiAction`);
    }
  }
};

const collectUiActionReferences = config => {
  const result = [];
  const visited = new Set();
  const visit = (value, configPath) => {
    if (typeof value === 'string') {
      const pattern = /doUiAction\(\s*['"]([^'"]+)['"]/g;
      let match;
      while ((match = pattern.exec(value))) {
        result.push({ uiAction: match[1], path: configPath });
      }
      return;
    }
    if (!value || typeof value !== 'object' || visited.has(value)) return;
    visited.add(value);
    if (!Array.isArray(value) && value.uiAction != null && String(value.uiAction).trim()) {
      result.push({ uiAction: String(value.uiAction).trim(), path: `${configPath}.uiAction` });
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${configPath}[${index}]`));
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      visit(child, configPath ? `${configPath}.${key}` : key);
    }
  };
  visit(config, '');
  return result;
};

const isKnownUiAction = (uiAction, customActions, generatedUiActions) => (
  STANDARD_UI_ACTIONS.has(uiAction)
  || customActions.has(uiAction)
  || generatedUiActions.has(uiAction)
);

const extractChainReference = entry => {
  if (typeof entry !== 'string') return null;
  const actionMatch = entry.match(/doUiAction\.([A-Za-z_$][\w$]*)/);
  if (actionMatch) return { type: 'uiAction', name: actionMatch[1] };
  const normalized = entry
    .replace(/^\s*await\s+/, '')
    .replace(/^\s*this\./, '')
    .replace(/\(.*$/, '')
    .trim();
  return normalized ? { type: 'method', name: normalized } : null;
};

const resolveIncludeCandidates = (cwd, include) => {
  const includePath = include && include.path;
  if (!includePath || /^https?:\/\//.test(includePath)) return [];
  const normalized = String(includePath).replace(/\\/g, '/');
  if (normalized.startsWith('/')) {
    return [path.resolve(cwd, 'app/public', normalized.slice(1))];
  }
  if (include.type === 'js' || include.type === 'css') {
    return [path.resolve(cwd, 'app/public', normalized)];
  }
  if (include.type === 'vueComponent') {
    const suffix = path.extname(normalized) ? normalized : `${normalized}.html`;
    return [path.resolve(cwd, 'app/view/component', suffix)];
  }
  return [path.resolve(cwd, 'app/view', normalized)];
};

const hasLocalServiceFunction = (serviceFile, serviceFunction) => {
  if (!serviceFunction) return false;
  const source = fs.readFileSync(serviceFile, 'utf8');
  const escaped = String(serviceFunction).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:async\\s+)?${escaped}\\s*\\(`).test(source)
    || new RegExp(`${escaped}\\s*=\\s*(?:async\\s*)?\\(`).test(source);
};

const analyzeStaticContracts = ({ cwd, config, generatedUiActions = new Set() }) => {
  const errors = [];
  const warnings = [];
  const unknowns = [];
  const customActionConfig = config.common && config.common.doUiAction;
  const hasInvalidCustomActionConfig = customActionConfig != null
    && (typeof customActionConfig !== 'object' || Array.isArray(customActionConfig));
  if (hasInvalidCustomActionConfig) {
    errors.push(issue(
      'UI_ACTION_CONFIG_INVALID',
      'common.doUiAction 必须是以 uiAction 为 key 的对象',
      'common.doUiAction',
    ));
  }
  const customActions = new Set(
    !hasInvalidCustomActionConfig && customActionConfig
      ? Object.keys(customActionConfig)
      : [],
  );
  const methods = config.common && config.common.methods && typeof config.common.methods === 'object'
    ? config.common.methods
    : {};

  for (const ref of collectUiActionReferences(config)) {
    if (!isKnownUiAction(ref.uiAction, customActions, generatedUiActions)) {
      errors.push(issue(
        'UI_ACTION_UNRESOLVED',
        `uiAction ${ref.uiAction} 既不是标准 action，也未在 common.doUiAction 中声明`,
        ref.path,
      ));
    }
  }

  for (const [uiAction, chain] of Object.entries(hasInvalidCustomActionConfig ? {} : (customActionConfig || {}))) {
    if (!Array.isArray(chain)) {
      errors.push(issue(
        'UI_ACTION_CHAIN_INVALID',
        `common.doUiAction.${uiAction} 必须是数组`,
        `common.doUiAction.${uiAction}`,
      ));
      continue;
    }
    chain.forEach((entry, index) => {
      const ref = extractChainReference(entry);
      const entryPath = `common.doUiAction.${uiAction}[${index}]`;
      if (!ref) {
        errors.push(issue('UI_ACTION_CHAIN_ITEM_INVALID', 'doUiAction 链条项必须是方法字符串', entryPath));
      } else if (
        ref.type === 'uiAction'
        && !isKnownUiAction(ref.name, customActions, generatedUiActions)
      ) {
        errors.push(issue(
          'UI_ACTION_CHAIN_UNRESOLVED',
          `链条引用的 uiAction ${ref.name} 不存在`,
          entryPath,
        ));
      } else if (ref.type === 'method' && typeof methods[ref.name] !== 'function') {
        unknowns.push(issue(
          'METHOD_NOT_PROVEN',
          `方法 ${ref.name} 未在 common.methods 中找到；可能由生成模板或 include 提供`,
          entryPath,
        ));
      }
    });
  }

  const resourceList = Array.isArray(config.resourceList) ? config.resourceList : [];
  const resourceByActionId = new Map();
  resourceList.forEach((resource, index) => {
    if (!resource || !resource.actionId) return;
    const actionId = String(resource.actionId);
    if (resourceByActionId.has(actionId)) {
      errors.push(issue(
        'RESOURCE_ACTION_DUPLICATE',
        `resourceList 中 actionId ${actionId} 重复`,
        `resourceList[${index}].actionId`,
      ));
    } else {
      resourceByActionId.set(actionId, resource);
    }
  });

  if (config.mode === 'crud' && config.pageType === 'jh-page') {
    const dataSource = config.dataSource || {};
    const requiredResources = [
      ['listResource', config.views && config.views.list],
      ['createResource', config.views && config.views.create],
      ['updateResource', config.views && config.views.update],
      ['deleteResource', collectUiActionReferences(config).some(ref => ref.uiAction === 'delete')],
    ];
    for (const [key, required] of requiredResources) {
      const actionId = dataSource[key];
      if (required && actionId && !resourceByActionId.has(String(actionId))) {
        unknowns.push(issue(
          'RESOURCE_NOT_DECLARED',
          `${key}=${actionId} 未在当前 resourceList 中声明；需确认是否由已有数据库资源提供`,
          `dataSource.${key}`,
        ));
      }
    }
  }

  resourceList.forEach((resource, index) => {
    if (!resource || resource.resourceType !== 'service') return;
    const resourceData = resource.resourceData || {};
    const service = resourceData.service;
    const serviceFunction = resourceData.serviceFunction;
    if (!service || !serviceFunction) {
      errors.push(issue(
        'SERVICE_RESOURCE_INVALID',
        'service resource 必须声明 resourceData.service + serviceFunction',
        `resourceList[${index}].resourceData`,
      ));
      return;
    }
    const serviceRoot = path.resolve(cwd, 'app/service');
    const serviceFile = path.resolve(serviceRoot, `${service}.js`);
    if (!serviceFile.startsWith(`${serviceRoot}${path.sep}`)) {
      errors.push(issue(
        'SERVICE_PATH_INVALID',
        `service 路径不能超出 app/service: ${service}`,
        `resourceList[${index}].resourceData.service`,
      ));
    } else if (!fs.existsSync(serviceFile)) {
      unknowns.push(issue(
        'SERVICE_NOT_PROVEN',
        `未在 app/service 中找到 ${service}.js；需确认是否由框架或插件提供`,
        `resourceList[${index}].resourceData.service`,
      ));
    } else if (!hasLocalServiceFunction(serviceFile, serviceFunction)) {
      unknowns.push(issue(
        'SERVICE_FUNCTION_NOT_PROVEN',
        `在 ${path.relative(cwd, serviceFile)} 中未静态识别到 ${serviceFunction}()`,
        `resourceList[${index}].resourceData.serviceFunction`,
      ));
    }
  });

  (config.includeList || []).forEach((include, index) => {
    const candidates = resolveIncludeCandidates(cwd, include);
    const allowedRoots = [
      path.resolve(cwd, 'app/view'),
      path.resolve(cwd, 'app/public'),
    ];
    if (candidates.some(candidate => !allowedRoots.some(root =>
      candidate === root || candidate.startsWith(`${root}${path.sep}`),
    ))) {
      errors.push(issue(
        'INCLUDE_PATH_INVALID',
        `include 路径不能超出 app/view 或 app/public: ${include.path}`,
        `includeList[${index}].path`,
      ));
    } else if (candidates.length && !candidates.some(candidate => fs.existsSync(candidate))) {
      unknowns.push(issue(
        'INCLUDE_NOT_PROVEN',
        `未在项目目录中找到 include ${include.path}；需确认框架 view-root 或外部资源`,
        `includeList[${index}].path`,
      ));
    }
  });

  return { errors, warnings, unknowns };
};

const validateLocationContract = (config, resolvedType) => {
  const expectedPageType = TYPE_CONFIG[resolvedType].pageType;
  if (config.pageType !== expectedPageType) {
    throw new Error(
      `${resolvedType} init-json 的 pageType 必须为 ${expectedPageType}，当前为 ${JSON.stringify(config.pageType)}`,
    );
  }
};

const validateV7Config = (config, resolvedType) => {
  if (config.version !== 'v7') {
    throw new Error(`机器校验当前仅支持 version: 'v7'，当前为 ${JSON.stringify(config.version)}`);
  }
  validateLocationContract(config, resolvedType);
  validateCanonicalDataSource(config);
  validateCanonicalActionKeys(config);

  const buildTarget = resolveV7BuildTargets(config);
  const targets = buildTarget === 'both' ? ['pc', 'mobile'] : [buildTarget];
  const diagnostics = [];
  const generatedUiActions = new Set();

  for (const targetPlatform of targets) {
    const result = buildPage(Object.assign({}, config, { targetPlatform }));
    diagnostics.push(...(result.diagnostics || []));
    const viewActionComponents = resolvedType === 'component' || targetPlatform === 'mobile'
      ? new Set(['Drawer', 'FormDrawer', 'FormSheet', 'Sheet'])
      : new Set(['Drawer', 'FormDrawer']);
    for (const actionNode of result.standardConfig.actionContent || []) {
      if (!actionNode || !actionNode.key || !viewActionComponents.has(actionNode.component)) continue;
      const key = String(actionNode.key);
      generatedUiActions.add(`view${key.charAt(0).toUpperCase()}${key.slice(1)}`);
    }
  }

  const dedupedDiagnostics = dedupeDiagnostics(diagnostics);
  if (dedupedDiagnostics.length) {
    throw new Error(formatMigrationWarnings(dedupedDiagnostics));
  }

  return {
    version: config.version,
    pageType: config.pageType,
    targets,
    diagnostics: dedupedDiagnostics,
    generatedUiActions,
  };
};

const inspectInitJsonFile = ({ cwd, file, pageType }) => {
  const report = {
    result: 'failed',
    file: String(file || ''),
    version: null,
    pageType: null,
    targets: [],
    errors: [],
    warnings: [],
    unknowns: [],
  };
  try {
    const resolved = resolveConfigFile({ cwd, file, pageType });
    report.file = resolved.relativePath;
    const config = loadConfig(resolved.path);
    report.version = config.version || null;
    report.pageType = config.pageType || null;
    const structural = validateV7Config(config, resolved.type);
    report.targets = structural.targets;
    const contracts = analyzeStaticContracts({
      cwd,
      config,
      generatedUiActions: structural.generatedUiActions,
    });
    report.errors.push(...contracts.errors);
    report.warnings.push(...contracts.warnings);
    report.unknowns.push(...contracts.unknowns);
    report.result = report.errors.length ? 'failed' : 'passed';
  } catch (error) {
    report.errors.push(issue('VALIDATION_ERROR', error.message));
  }
  return report;
};

const validateInitJsonFile = options => {
  const report = inspectInitJsonFile(options);
  if (report.result !== 'passed') {
    const error = new Error(report.errors.map(item => item.message).join('\n'));
    error.report = report;
    throw error;
  }
  return {
    filePath: path.resolve(options.cwd, report.file),
    relativePath: report.file,
    version: report.version,
    pageType: report.pageType,
    targets: report.targets,
    diagnostics: [],
    warnings: report.warnings,
    unknowns: report.unknowns,
  };
};

const gitLines = ({ cwd, args }) => {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || 'git command failed').trim());
  }
  return String(result.stdout || '').split(/\r?\n/).map(line => line.trim()).filter(Boolean);
};

const listChangedInitJsonFiles = cwd => {
  let tracked;
  try {
    tracked = gitLines({
      cwd,
      args: ['diff', '--name-only', '--diff-filter=ACMRD', 'HEAD', '--', 'app/view/init-json'],
    });
  } catch (error) {
    tracked = gitLines({
      cwd,
      args: ['ls-files', '--', 'app/view/init-json'],
    });
  }
  const untracked = gitLines({
    cwd,
    args: ['ls-files', '--others', '--exclude-standard', '--', 'app/view/init-json'],
  });
  return Array.from(new Set([...tracked, ...untracked]))
    .filter(file => file.endsWith('.js'))
    .sort();
};

const inspectChangedInitJsonFiles = cwd => {
  const files = listChangedInitJsonFiles(cwd);
  const reports = files.map(file => inspectInitJsonFile({
    cwd,
    file: file.replace(/^app\/view\/init-json\//, '').replace(/\.js$/, ''),
  }));
  return {
    result: reports.every(report => report.result === 'passed') ? 'passed' : 'failed',
    files: reports,
    summary: {
      total: reports.length,
      passed: reports.filter(report => report.result === 'passed').length,
      failed: reports.filter(report => report.result === 'failed').length,
      unknowns: reports.reduce((count, report) => count + report.unknowns.length, 0),
    },
  };
};

module.exports = {
  LEGACY_DATA_SOURCE_KEYS,
  STANDARD_UI_ACTIONS,
  analyzeStaticContracts,
  inspectChangedInitJsonFiles,
  inspectInitJsonFile,
  listChangedInitJsonFiles,
  resolveConfigFile,
  validateCanonicalActionKeys,
  validateCanonicalDataSource,
  validateInitJsonFile,
  validateV7Config,
};
