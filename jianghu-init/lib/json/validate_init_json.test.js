'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const InitByJson = require('../init_by_json');
const {
  inspectChangedInitJsonFiles,
  inspectInitJsonFile,
  resolveConfigFile,
  validateInitJsonFile,
} = require('./validate_init_json');

const writeModule = (filePath, config) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `module.exports = ${JSON.stringify(config, null, 2)};\n`, 'utf8');
};

const listFiles = root => {
  const result = [];
  const visit = current => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else result.push(path.relative(root, fullPath).replace(/\\/g, '/'));
    }
  };
  visit(root);
  return result.sort();
};

const runGit = (cwd, args) => {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.strictEqual(result.status, 0, result.stderr || result.stdout);
};

const validPage = {
  version: 'v7',
  mode: 'crud',
  pageType: 'jh-page',
  page: {
    id: 'taskManagement',
    name: '任务管理',
    targets: 'both',
  },
  resourceList: [
    {
      actionId: 'selectTaskList',
      resourceType: 'sql',
      resourceData: { table: 'task', operation: 'select' },
    },
  ],
  dataSource: {
    table: 'task',
    primaryKey: 'taskId',
    listResource: 'selectTaskList',
    createResource: 'insertTask',
    updateResource: 'updateTask',
    deleteResource: 'deleteTask',
  },
  fields: {
    taskId: { label: '任务ID', type: 'text' },
    taskName: { label: '任务名称', type: 'text' },
  },
  views: {
    list: {
      columnList: ['taskId', 'taskName'],
      headActionList: [{ label: '新增', uiAction: 'create' }],
      rowActionList: [{ label: '编辑', uiAction: 'update' }],
    },
  },
};

const run = async () => {
  const appDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-init-json-validate-'));
  const pageDir = path.join(appDir, 'app/view/init-json/page');
  const componentDir = path.join(appDir, 'app/view/init-json/component');
  const validFile = path.join(pageDir, 'taskManagement.js');
  writeModule(validFile, validPage);

  const result = validateInitJsonFile({
    cwd: appDir,
    file: 'taskManagement',
  });
  assert.strictEqual(result.relativePath, 'app/view/init-json/page/taskManagement.js');
  assert.deepStrictEqual(result.targets, ['pc', 'mobile']);
  assert.strictEqual(result.diagnostics.length, 0);
  assert.strictEqual(result.unknowns.length, 0);

  const beforeFiles = listFiles(appDir);
  const previousExitCode = process.exitCode;
  process.exitCode = undefined;
  await new InitByJson().run(appDir, ['--validate', '--file=taskManagement']);
  assert.strictEqual(process.exitCode, undefined);
  assert.deepStrictEqual(listFiles(appDir), beforeFiles);
  assert(!fs.existsSync(path.join(appDir, 'app/view/page/taskManagement.html')));
  process.exitCode = previousExitCode;

  const jsonLogs = [];
  const originalConsoleLog = console.log;
  console.log = value => jsonLogs.push(String(value));
  try {
    await new InitByJson().run(appDir, [
      '--validate',
      '--file=taskManagement',
      '--format=json',
    ]);
  } finally {
    console.log = originalConsoleLog;
  }
  assert.strictEqual(jsonLogs.length, 1);
  const jsonReport = JSON.parse(jsonLogs[0]);
  assert.strictEqual(jsonReport.result, 'passed');
  assert.deepStrictEqual(jsonReport.targets, ['pc', 'mobile']);
  assert.deepStrictEqual(jsonReport.errors, []);

  const loggingPageFile = path.join(pageDir, 'loggingPage.js');
  fs.writeFileSync(
    loggingPageFile,
    `console.log('config noise');\nmodule.exports = ${JSON.stringify(Object.assign({}, validPage, {
      page: { id: 'loggingPage', targets: 'pc' },
    }), null, 2)};\n`,
    'utf8',
  );
  const loggingJsonOutput = [];
  console.log = value => loggingJsonOutput.push(String(value));
  try {
    await new InitByJson().run(appDir, [
      '--validate',
      '--file=loggingPage',
      '--format=json',
    ]);
  } finally {
    console.log = originalConsoleLog;
  }
  assert.strictEqual(loggingJsonOutput.length, 1);
  const loggingReport = JSON.parse(loggingJsonOutput[0]);
  assert(loggingReport.warnings.some(item => item.code === 'VALIDATION_STDIO_CAPTURED'));

  const invalidActionFile = path.join(pageDir, 'invalidAction.js');
  writeModule(invalidActionFile, Object.assign({}, validPage, {
    page: { id: 'invalidAction', targets: 'pc' },
    views: {
      list: {
        columnList: ['taskId'],
        headActionList: [{ label: '新增', intent: 'create' }],
      },
    },
  }));
  assert.throws(
    () => validateInitJsonFile({ cwd: appDir, file: 'invalidAction' }),
    /禁止 action 旧语义 key intent/,
  );

  const duplicateActionKeyFile = path.join(pageDir, 'duplicateActionKey.js');
  writeModule(duplicateActionKeyFile, Object.assign({}, validPage, {
    page: { id: 'duplicateActionKey', targets: 'pc' },
    views: {
      list: {
        columnList: ['taskId'],
        headActionList: [{ label: '新增', uiAction: 'create', actionId: 'insertTask' }],
      },
    },
  }));
  assert.throws(
    () => validateInitJsonFile({ cwd: appDir, file: 'duplicateActionKey' }),
    /禁止 action 旧语义 key actionId/,
  );

  const permissionResource = {
    actionId: 'publishItem',
    resourceType: 'sql',
    resourceData: { table: 'task', operation: 'update' },
  };
  const permissionPage = Object.assign({}, validPage, {
    page: { id: 'permissionPage', targets: 'pc' },
    resourceList: [...validPage.resourceList, permissionResource],
    views: {
      list: {
        columnList: ['taskId'],
        rowActionList: [{ label: '发布', uiAction: 'delete', permission: 'publishItem' }],
      },
    },
  });
  writeModule(path.join(pageDir, 'permissionPage.js'), permissionPage);
  const permissionReport = inspectInitJsonFile({ cwd: appDir, file: 'permissionPage' });
  assert.strictEqual(permissionReport.result, 'passed');
  assert(!permissionReport.errors.some(item => item.code.startsWith('ACTION_PERMISSION')));

  writeModule(path.join(pageDir, 'invalidPermission.js'), Object.assign({}, permissionPage, {
    page: { id: 'invalidPermission', targets: 'pc' },
    views: {
      list: {
        columnList: ['taskId'],
        rowActionList: [{ label: '发布', uiAction: 'delete', permission: [] }],
      },
    },
  }));
  const invalidPermissionReport = inspectInitJsonFile({ cwd: appDir, file: 'invalidPermission' });
  assert(invalidPermissionReport.errors.some(item => item.code === 'ACTION_PERMISSION_INVALID'));

  writeModule(path.join(pageDir, 'missingPermission.js'), Object.assign({}, permissionPage, {
    page: { id: 'missingPermission', targets: 'pc' },
    views: {
      list: {
        columnList: ['taskId'],
        rowActionList: [{ label: '发布', uiAction: 'delete', permission: 'missingItem' }],
      },
    },
  }));
  const missingPermissionReport = inspectInitJsonFile({ cwd: appDir, file: 'missingPermission' });
  assert(missingPermissionReport.errors.some(item => item.code === 'ACTION_PERMISSION_RESOURCE_NOT_FOUND'));

  writeModule(path.join(pageDir, 'fullPermission.js'), Object.assign({}, permissionPage, {
    page: { id: 'fullPermission', targets: 'pc' },
    views: {
      list: {
        columnList: ['taskId'],
        rowActionList: [{ label: '发布', uiAction: 'delete', permission: 'fullPermission.publishItem' }],
      },
    },
  }));
  const fullPermissionReport = inspectInitJsonFile({ cwd: appDir, file: 'fullPermission' });
  assert.strictEqual(fullPermissionReport.result, 'passed');
  assert(!fullPermissionReport.unknowns.some(item => item.code === 'ACTION_PERMISSION_CROSS_PAGE_NOT_PROVEN'));

  writeModule(path.join(pageDir, 'crossPagePermission.js'), Object.assign({}, permissionPage, {
    page: { id: 'crossPagePermission', targets: 'pc' },
    views: {
      list: {
        columnList: ['taskId'],
        rowActionList: [{ label: '发布', uiAction: 'delete', permission: 'otherPage.publishItem' }],
      },
    },
  }));
  const crossPagePermissionReport = inspectInitJsonFile({ cwd: appDir, file: 'crossPagePermission' });
  assert.strictEqual(crossPagePermissionReport.result, 'passed');
  assert(crossPagePermissionReport.unknowns.some(item => item.code === 'ACTION_PERMISSION_CROSS_PAGE_NOT_PROVEN'));

  writeModule(path.join(componentDir, 'permissionComponent.js'), {
    version: 'v7',
    mode: 'crud',
    pageType: 'jh-component',
    component: { path: 'permissionComponent', targets: 'pc' },
    dataSource: { table: 'task', primaryKey: 'taskId', listResource: 'selectTaskList' },
    fields: { taskId: { label: '任务ID', type: 'text' } },
    views: {
      list: {
        columnList: ['taskId'],
        rowActionList: [{ label: '发布', uiAction: 'delete', permission: 'publishItem' }],
      },
    },
  });
  const permissionComponentReport = inspectInitJsonFile({
    cwd: appDir,
    file: 'permissionComponent',
    pageType: 'component',
  });
  assert.strictEqual(permissionComponentReport.result, 'passed');
  assert(permissionComponentReport.unknowns.some(item => item.code === 'ACTION_PERMISSION_HOST_RESOURCE_NOT_PROVEN'));

  const unresolvedActionFile = path.join(pageDir, 'unresolvedAction.js');
  writeModule(unresolvedActionFile, Object.assign({}, validPage, {
    page: { id: 'unresolvedAction', targets: 'pc' },
    views: {
      list: {
        columnList: ['taskId'],
        headActionList: [{ label: '发布', uiAction: 'publish' }],
      },
    },
  }));
  const unresolvedActionReport = inspectInitJsonFile({
    cwd: appDir,
    file: 'unresolvedAction',
  });
  assert.strictEqual(unresolvedActionReport.result, 'failed');
  assert(unresolvedActionReport.errors.some(item => item.code === 'UI_ACTION_UNRESOLVED'));

  const unresolvedGeneratedViewFile = path.join(pageDir, 'unresolvedGeneratedView.js');
  writeModule(unresolvedGeneratedViewFile, Object.assign({}, validPage, {
    page: { id: 'unresolvedGeneratedView', targets: 'pc' },
    common: {
      doUiAction: {
        open: ['doUiAction.viewDetail'],
      },
    },
  }));
  const unresolvedGeneratedViewReport = inspectInitJsonFile({
    cwd: appDir,
    file: 'unresolvedGeneratedView',
  });
  assert.strictEqual(unresolvedGeneratedViewReport.result, 'failed');
  assert(unresolvedGeneratedViewReport.errors.some(item => item.code === 'UI_ACTION_CHAIN_UNRESOLVED'));

  const resolvedGeneratedViewFile = path.join(pageDir, 'resolvedGeneratedView.js');
  writeModule(resolvedGeneratedViewFile, {
    version: 'v7',
    pageType: 'jh-page',
    page: { id: 'resolvedGeneratedView', targets: 'pc' },
    resourceList: [],
    pageContent: {},
    actionContent: [
      {
        component: 'Drawer',
        key: 'detail',
        props: { title: '详情' },
      },
    ],
    common: {
      doUiAction: {
        open: ['doUiAction.viewDetail'],
      },
    },
  });
  const resolvedGeneratedViewReport = inspectInitJsonFile({
    cwd: appDir,
    file: 'resolvedGeneratedView',
  });
  assert.strictEqual(resolvedGeneratedViewReport.result, 'passed');

  const unknownContractFile = path.join(pageDir, 'unknownContract.js');
  writeModule(unknownContractFile, Object.assign({}, validPage, {
    page: { id: 'unknownContract', targets: 'pc' },
    includeList: [{ type: 'html', path: 'component/notLocal.html' }],
    common: {
      doUiAction: {
        publish: ['publishItem'],
      },
      methods: {},
    },
    views: {
      list: {
        columnList: ['taskId'],
        headActionList: [{ label: '发布', uiAction: 'publish' }],
      },
    },
  }));
  const unknownContractReport = inspectInitJsonFile({
    cwd: appDir,
    file: 'unknownContract',
  });
  assert.strictEqual(unknownContractReport.result, 'passed');
  assert(unknownContractReport.unknowns.some(item => item.code === 'METHOD_NOT_PROVEN'));
  assert(unknownContractReport.unknowns.some(item => item.code === 'INCLUDE_NOT_PROVEN'));

  const invalidContractsFile = path.join(pageDir, 'invalidContracts.js');
  writeModule(invalidContractsFile, Object.assign({}, validPage, {
    page: { id: 'invalidContracts', targets: 'pc' },
    includeList: [{ type: 'html', path: '../../outside.html' }],
    resourceList: [
      validPage.resourceList[0],
      validPage.resourceList[0],
    ],
  }));
  const invalidContractsReport = inspectInitJsonFile({
    cwd: appDir,
    file: 'invalidContracts',
  });
  assert.strictEqual(invalidContractsReport.result, 'failed');
  assert(invalidContractsReport.errors.some(item => item.code === 'RESOURCE_ACTION_DUPLICATE'));
  assert(invalidContractsReport.errors.some(item => item.code === 'INCLUDE_PATH_INVALID'));

  const legacyDataSourceFile = path.join(pageDir, 'legacyDataSource.js');
  writeModule(legacyDataSourceFile, Object.assign({}, validPage, {
    page: { id: 'legacyDataSource', targets: 'pc' },
    dataSource: {
      table: 'task',
      primaryKey: 'taskId',
      resource: { list: 'selectTaskList' },
    },
  }));
  assert.throws(
    () => validateInitJsonFile({ cwd: appDir, file: 'legacyDataSource' }),
    /dataSource 使用旧 key: resource/,
  );

  const deprecatedViewKeyFile = path.join(pageDir, 'deprecatedViewKey.js');
  writeModule(deprecatedViewKeyFile, Object.assign({}, validPage, {
    page: { id: 'deprecatedViewKey', targets: 'pc' },
    views: {
      list: {
        columns: ['taskId'],
      },
    },
  }));
  assert.throws(
    () => validateInitJsonFile({ cwd: appDir, file: 'deprecatedViewKey' }),
    /views\.list\.columns.*views\.list\.columnList/,
  );

  const legacyVersionFile = path.join(pageDir, 'legacyVersion.js');
  writeModule(legacyVersionFile, {
    version: 'v6',
    pageType: 'jh-page',
    page: { id: 'legacyVersion' },
  });
  assert.throws(
    () => validateInitJsonFile({ cwd: appDir, file: 'legacyVersion' }),
    /当前仅支持 version: 'v7'/,
  );

  writeModule(path.join(componentDir, 'shared.js'), {
    version: 'v7',
    pageType: 'jh-component',
  });
  writeModule(path.join(pageDir, 'shared.js'), validPage);
  assert.throws(
    () => resolveConfigFile({ cwd: appDir, file: 'shared' }),
    /请显式指定 --pageType/,
  );
  assert.strictEqual(
    resolveConfigFile({ cwd: appDir, file: 'component/shared' }).type,
    'component',
  );
  assert.throws(
    () => resolveConfigFile({ cwd: appDir, file: '../../outside' }),
    /非法 init-json 路径/,
  );
  assert.throws(
    () => resolveConfigFile({ cwd: appDir }),
    /必须指定 --file/,
  );

  const deletedPageFile = path.join(pageDir, 'deletedPage.js');
  writeModule(deletedPageFile, Object.assign({}, validPage, {
    page: { id: 'deletedPage', targets: 'pc' },
  }));
  runGit(appDir, ['init']);
  runGit(appDir, ['config', 'user.email', 'dev-rules@example.test']);
  runGit(appDir, ['config', 'user.name', 'Dev Rules Test']);
  runGit(appDir, ['add', 'app/view/init-json']);
  runGit(appDir, ['commit', '-m', 'baseline']);
  fs.unlinkSync(deletedPageFile);
  const deletedChangedReport = inspectChangedInitJsonFiles(appDir);
  assert.strictEqual(deletedChangedReport.result, 'failed');
  assert.strictEqual(deletedChangedReport.summary.total, 1);
  assert.strictEqual(deletedChangedReport.files[0].file, 'page/deletedPage');
  assert(deletedChangedReport.files[0].errors.some(item =>
    item.code === 'VALIDATION_ERROR' && item.message.includes('未找到 init-json 文件'),
  ));
  runGit(appDir, ['checkout', '--', 'app/view/init-json/page/deletedPage.js']);

  fs.appendFileSync(validFile, '\n', 'utf8');
  const changedReport = inspectChangedInitJsonFiles(appDir);
  assert.strictEqual(changedReport.result, 'passed');
  assert.strictEqual(changedReport.summary.total, 1);
  assert.strictEqual(changedReport.files[0].file, 'app/view/init-json/page/taskManagement.js');

  const changedJsonOutput = [];
  console.log = value => changedJsonOutput.push(String(value));
  process.exitCode = undefined;
  try {
    await new InitByJson().run(appDir, ['--validate-changed', '--format=json']);
  } finally {
    console.log = originalConsoleLog;
  }
  assert.strictEqual(process.exitCode, undefined);
  assert.strictEqual(changedJsonOutput.length, 1);
  assert.strictEqual(JSON.parse(changedJsonOutput[0]).summary.passed, 1);
  process.exitCode = previousExitCode;

  writeModule(path.join(pageDir, 'changedInvalid.js'), {
    version: 'v7',
    pageType: 'jh-page',
    page: { id: 'changedInvalid' },
    fields: {},
  });
  const failedChangedReport = inspectChangedInitJsonFiles(appDir);
  assert.strictEqual(failedChangedReport.result, 'failed');
  assert.strictEqual(failedChangedReport.summary.total, 2);
  assert.strictEqual(failedChangedReport.summary.failed, 1);
};

run()
  .then(() => console.log('init-json validation tests passed'))
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
