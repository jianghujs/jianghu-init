'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const glob = require("glob");
const isTextOrBinary = require('istextorbinary');
const compressing = require('compressing');
const fse = require('fs-extra');

/**
 * demo 中的占位符转到 egg-init 能识别的占位符
 */
const locals = [
  'database', 'name', 'description', 'author', 'keys', 'dbPrefix'
];

/**
 * 不打包的文件夹
 */
const ignoreFolders = [
  'node_modules', '/out/', '/run/', 'dist', 'typings', '.idea',
  'logs/', 'coverage/', '.nyc_output/', '.github',
  'config/config.local.js',
  'config/config.prod.js',
  'config/config.unittest.js',
  'test/app/controller/json/resourceMap.json',
  'yarn.lock', 'package-lock.json'
]

const fileMapping = {
  '.gitignore': '_.gitignore',
  'package.json': '_package.json',
};

/**
 * 关键字替换、文件过滤
 * @param content
 * @param scope
 * @returns {string}
 */
function replaceTemplate(content, scope) {
  return content.toString().replace(/__(\w+)__/g, (match, capture) => {
    if (capture && scope.includes(capture)) {
      return `{{${capture}}}`;
    }
    return match;
  });
}

/**
 * 复制、处理文件夹
 */
function processFiles(targetDir, sourceDir) {
  if (!fs.existsSync(targetDir.substring(0, targetDir.lastIndexOf('/')))) {
    fs.mkdirSync(targetDir.substring(0, targetDir.lastIndexOf('/')));
  }
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  const src = path.join(sourceDir);
  const files = glob.sync('**/*', {
    cwd: sourceDir,
    dot: true,
    onlyFiles: false,
    followSymlinkedDirectories: false,
  });
  files.forEach(file => {
    const {dir: dirname, base: basename} = path.parse(file);
    // 过滤文件夹
    if (ignoreFolders.find(folder => file.includes(folder))) {
      return;
    }
    const from = path.join(src, file);
    const name = path.join(dirname, fileMapping[basename] || basename);
    const to = path.join(targetDir, replaceTemplate(name, locals));

    const stats = fs.lstatSync(from);
    if (stats.isSymbolicLink()) {
      const target = fs.readlinkSync(from);
      fs.symlinkSync(target, to);
      console.log(`${to} link to ${target}`);
    } else if (stats.isDirectory()) {
      mkdirp.sync(to);
    } else if (stats.isFile()) {
      const content = fs.readFileSync(from);
      console.log(`write to ${to}`);

      // check if content is a text file
      const result = isTextOrBinary.isTextSync(from, content)
        ? replaceTemplate(content.toString('utf8'), locals)
        : content;
      fs.writeFileSync(to, result);
    } else {
      console.log(`ignore ${file} only support file, dir, symlink`);
    }
  });
  return files;
}

function moveBoilerplateAndPackToTgz(compressFolder, distFolder, fileName) {
  // 将 boilerplate 移动到 package/boilerplate/*
  const tmpPath = `/tmp/${fileName}/package`;
  if (fs.existsSync(tmpPath)) {
    fs.rmSync(tmpPath, {recursive: true, force: true});
  }
  fs.mkdirSync(tmpPath, { recursive: true });
  fse.copySync(compressFolder, tmpPath);

  if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder);
  }

  // 压缩文件
  compressing.tgz.compressDir(tmpPath, `${distFolder}/${fileName}.tgz`)
    .then(() => {
      console.log(`压缩文件成功, fileName: ${distFolder}/${fileName}.tgz`)
    })
    .catch(err => {
      console.error(`压缩文件失败, fileName: ${distFolder}/${fileName}.tgz`)
      console.log(err);
    });
}

/**
 * 处理不同类型的 boilerplate
 */
function process(type) {
  const targetDir = `../project-dist/jianghu-boilerplate-${type}/boilerplate`;
  const sourceDir = `../project-src/demo_${type}`;

  // 删除 boilerplate
  console.log(`开始删除旧模板，type=${type}`);
  fs.rmSync(targetDir, {recursive: true, force: true});

  // 复制 demo 至模板
  console.log(`开始复制新模板，type=${type}`);
  processFiles(targetDir, sourceDir);

  // 打包，包中结构为 package/boilerplate/*
  moveBoilerplateAndPackToTgz(`../project-dist/jianghu-boilerplate-${type}`, './dist', `jianghu-boilerplate-${type}`);
}

// process('1table-crud');
// process('1table-crud-file');
process('1table-crud-enterprise');
// process('2table-crud');
// process('3table-crud');
process('enterprise');
// process('workflow');
// process('json-editor');
// process('xiaochengxu-markdown-editor');
// process('xiaochengxu-1table-crud');
// process('xiaochengxu-1table-crud-file');
