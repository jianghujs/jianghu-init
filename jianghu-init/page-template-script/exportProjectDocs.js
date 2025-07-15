const fs = require('fs');
const path = require('path');
const dirTree = require("directory-tree");

// ---------------------改这里---------------------
const projectPath = path.resolve(__dirname, '../');
const projectName = projectPath.split('/').pop();
const configLocal = require('../config/config.local.js');
const exportPath = path.resolve(__dirname, '../docs');
fs.mkdirSync(exportPath, { recursive: true });
// 定义项目异常的文件路径，支持多个
const errorFilePath = [
    path.resolve(projectPath, `app/constant/error.js`)
];
// ---------------------改这里---------------------

// 读取配置文件
const config = configLocal({baseDir: path.join(__dirname, '..')});

// 获取数据库连接信息
const connection = config.knex.client.connection;

const knex = require('knex')({
    client: 'mysql',
    connection
});
const database = connection.database;

async function exportTree() {
  const outputFile = path.resolve(exportPath, `${projectName}-tree.md`);
  // 生成树状结构
  const tree = dirTree(projectPath);

  const ignoredFolders = ['run', 'typings', 'logs', '.git', 'node_modules']; // 要忽略的文件夹列表
  
  // 将目录树转换为命令行树形结构
  function treeToMarkdown(tree, indent = '', isLast = true) {
    let markdown = '';
    if (ignoredFolders.includes(tree.name)) {
      return '';
    }
    const childrenIndent = indent + (isLast ? '  ' : '│  ');
    const line = `${indent}${isLast ? '└─ ' : '├─ '}${tree.name}\n`;
    markdown += line;

    if (tree.children) {
      tree.children.forEach((child, index) => {
        const isLastChild = index === tree.children.length - 1;
        markdown += treeToMarkdown(child, childrenIndent, isLastChild);
      });
    }

    return markdown;
  }

  // 将目录树输出为 Markdown 文件
  const markdown = treeToMarkdown(tree);
  fs.writeFileSync(outputFile, markdown);
}

async function exportTables() {
    const outputFile = path.resolve(exportPath, `${projectName}-tables.md`);

    // 导出 table view 的ddl结构
    const tables = await knex.raw('show tables');
    let mdContent = "";
    for (const table of tables[0]) {
        const tableName = table[`Tables_in_${database}`];
        const tableDesc = await knex.raw(`SHOW CREATE TABLE ${tableName}`);
        let ddlStr = ''
        if (tableDesc[0][0]['Create View']) {
          ddlStr = tableDesc[0][0]['Create View'];
        } else if (tableDesc[0][0]['Create Table']) {
          ddlStr = tableDesc[0][0]['Create Table'];
        } else {
          ddlStr = '';
        }
        // 匹配 ddlStr de  COMMENT='{资产负债表}'
        const tableComment = ddlStr.match(/COMMENT='(.+?)'/);
        mdContent += `## ${tableName}\n\n${tableComment && tableComment[1] ? '- ' + tableComment[1] + '\n\n': ''}`;
        mdContent += "```sql\n";

        mdContent += ddlStr.replace(/COLLATE \w+/gi, '');
        mdContent += "\n```\n\n";
    }
    fs.writeFileSync(outputFile, mdContent);
}
async function exportPageData() {
    const outputFile = path.resolve(exportPath, `${projectName}-page.md`);
    // 查询_page表的所有数据
    const data = await knex('_page').select('*');

    // 如果数据为空，则不生成文件
    if (data.length === 0) {
        console.log('表 _page 中没有数据。');
        return;
    }

    // 构建Markdown内容
    let mdContent = '';

    for (const row of data) {
        // 使用pageName作为二级标题
        mdContent += `\n## ${row.pageName}\n\n`;

        // 构建表头
        let columns = Object.keys(row).filter(key => key !== 'pageHook');
        if (row.pageHook) {
            try {
                const pageHookObject = JSON.parse(row.pageHook);
                columns = columns.concat(Object.keys(pageHookObject));
            } catch (e) {
                console.error('无法解析pageHook为JSON:', e);
            }
        }
        mdContent += `| ${columns.join(' | ')} |\n`;
        mdContent += `| ${columns.map(() => '---').join(' | ')} |\n`;

        // 添加数据行
        const rowValues = columns.map(column => {
            if (column === 'pageHook') {
                // 尝试格式化pageHook的JSON内容
                try {
                    const pageHookObject = JSON.parse(row[column]);
                    return JSON.stringify(pageHookObject, null, 2); // 缩进为2个空格
                } catch (e) {
                    return row[column]; // 如果解析失败，则直接返回原始内容
                }
            } else {
                return row[column];
            }
        });
        mdContent += `| ${rowValues.join(' | ')} |\n`;

        mdContent += '\n'; // 每个pageName之间空一行，以便阅读
    }

    // 将Markdown内容写入文件
    fs.writeFileSync(outputFile, mdContent);
    console.log(`已成功导出表 _page 到文件：${outputFile}`);
}

async function exportTableData(tableName, outputFile) {
    // 查询表的所有数据
    const data = await knex(tableName).select('*');

    // 如果数据为空，则不生成表格
    if (data.length === 0) {
        console.log(`表 ${tableName} 中没有数据。`);
        return;
    }

    // 构建Markdown表格
    let mdContent = `## ${tableName} 结构\n\n`;
    // 添加 tableName 表结构sql
    const tableDesc = await knex.raw(`SHOW CREATE TABLE ${tableName}`);
    mdContent += "```sql\n";
    mdContent += tableDesc[0][0]['Create Table'].replace(/COLLATE \w+/gi, '');
    mdContent += "\n```\n\n";

    mdContent += `## ${tableName} 数据\n\n`;

    // 构建表头
    const columns = Object.keys(data[0]).map(key => key.replace(/_/g, '\\_')).filter(e => !['operation', 'operationAt', 'operationByUser', 'operationByUserId'].includes(e)); // 转义Markdown中的下划线
    mdContent += `| ${columns.join(' | ')} |\n`;
    mdContent += `| ${columns.map(() => '---').join(' | ')} |\n`;

    // 添加数据行
    for (const row of data) {
        const rowValues = columns.map(column => {
            const value = row[column];
            let stringValue;
            if (value === null) {
                stringValue = 'NULL';
            } else if (typeof value === 'string') {
                if (['pageHook', 'resourceHook'].includes(column) && value) {
                  const lineList = JSON.stringify(JSON.parse(value), null, 2).split('\n');
                  stringValue = lineList.map(e => e.replace(/\s/g, '&nbsp;')).join('<br>');
                } else if (column == 'pageIcon' && value) {
                  stringValue = value;
                } else {
                  stringValue = JSON.stringify(value).replace(/\s/g, '').slice(1, -1); // 转义Markdown中的下划线
                }
            } else {
                stringValue = value.toString();
            }
            return stringValue;
        });
        mdContent += `| ${rowValues.join(' | ')} |\n`;
    }

    // 将Markdown内容写入文件
    fs.writeFileSync(outputFile, mdContent);
    console.log(`已成功导出表 ${tableName} 到文件：${outputFile}`);
}

async function exportConstant(tableName, outputFile) {

  const tableDesc = await knex.raw(`SHOW CREATE TABLE ${tableName}`);
  const data = await knex(tableName).select('*');
  let mdContent = `## ${tableName} 常量表结构\n\n`;
  mdContent += "```sql\n";
  mdContent += tableDesc[0][0]['Create Table'].replace(/COLLATE \w+/gi, '');
  mdContent += "\n```\n\n";
  mdContent += `## 常量\n`;

  for (const row of data) {
    mdContent += `\n### ${row.constantKey} - ${row.desc} {${row.constantType}}\n\n`;
    const constantValue = ['array', 'object'].includes(row.constantType) ? JSON.stringify(JSON.parse(row.constantValue), null, 2) : row.constantValue;
    mdContent += "```js\n";
    mdContent += `${constantValue}\n`;
    mdContent += "```\n\n";
  }
  fs.writeFileSync(outputFile, mdContent);
  console.log(`已成功导出表 ${tableName} 到文件：${outputFile}`);
}

// 导出异常
async function exportError() {
    const outputFile = path.resolve(exportPath, `${projectName}-error.md`);
    let mdContent = `## 用法规范
\`\`\`
-- service 内引入
const { BizError, errorInfoEnum } = require('../constant/error');

-- 使用
throw new BizError(errorInfoEnum.disable_edit_appaId)

\`\`\`

## 异常览

`;
    for (const filePath of errorFilePath) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        let errorInfoEnum = {};
        // fileContent的格式是const errorInfoEnum = Object.freeze({
        //   data_exception: {
        //     errorCode: "data_expection",
        //     errorReason: "数据异常",
        //   },})
        //     主要是取出errorInfoEnum对象
        const errorInfoEnumMatch = fileContent.match(/const errorInfoEnum = Object.freeze\(([\s\S]+?)\);/);
        if (errorInfoEnumMatch) {
            const errorInfoEnumStr = errorInfoEnumMatch[
                1
                ].replace(/(\w+):/g, '"$1":');
            eval(`errorInfoEnum = ${errorInfoEnumStr}`);

        }

        // mdContent += `## ${path.basename(filePath)}\n\n`;
        mdContent += "| 错误码 | 错误原因 |\n";
        mdContent += "| --- | --- |\n";
        for (const key in errorInfoEnum) {
            const error = errorInfoEnum[key];
            mdContent += `| ${error.errorCode} | ${error.errorReason} |\n`;
        }
    }
    fs.writeFileSync(outputFile, mdContent);
    console.log(`已成功导出异常到文件：${outputFile}`);
}

async function main() {
    await exportTree();
    await exportTables()
    await exportTableData('_page', path.resolve(exportPath, `${projectName}-page.md`) )
    await exportTableData('_resource', path.resolve(exportPath, `${projectName}-resource.md`) )
    await exportConstant('_constant', path.resolve(exportPath, `${projectName}-constant.md`) )
    await exportError()
    await exportPageData()
    knex.destroy();
}

main();
