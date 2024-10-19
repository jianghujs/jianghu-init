const fs = require('fs');
const path = require('path');

// 读取文件的路径
const filePath = path.resolve(__dirname, '../jianghu-init/page-template-json/template/page-log/init.sql');

// 使用 fs.readFileSync 方法读取文件内容
const sqlContent = fs.readFileSync(filePath, 'utf-8');
// 定义正则表达式来匹配INSERT语句
const regex = /INSERT INTO `_resource` \((.*?)\) (?:VALUES \((.*?)\)|SELECT (.*?) FROM DUAL)/g;

const resourceList = [];

let match;
while ((match = regex.exec(sqlContent)) !== null) {
  const columns = match[1].split(',').map(col => col.trim().replace(/`/g, ''));
  
  // 使用新的方法来分割值，考虑到可能存在的嵌套逗号
  const values = splitValues(match[2] || match[3]);

  const resource = {};
  columns.forEach((col, index) => {
    if (index < values.length) {
      if (['actionId', 'resourceType', 'desc'].includes(col)) {
        resource[col] = values[index].replace(/^'|'$/g, '');
      } else if (col === 'resourceData') {
        let jsonString = values[index].replace(/^'|'$/g, '');
        jsonString = jsonString.replace(/\\'/g, "'").replace(/\\"/g, '"');
        try {
          resource[col] = JSON.parse(jsonString);
        } catch (error) {
          console.error(`解析JSON时出错: ${jsonString}`);
          resource[col] = jsonString;  // 如果解析失败，保留原始字符串
        }
      }
    }
  });

  if (Object.keys(resource).length > 0) {
    resourceList.push(resource);
  }
}

console.log(JSON.stringify(resourceList, null, 2));

// 辅助函数：考虑嵌套结构分割值
function splitValues(str) {
  if (typeof str !== 'string') {
    console.error('splitValues 接收到非字符串输入:', str);
    return [];
  }
  const values = [];
  let current = '';
  let depth = 0;
  let inQuote = false;

  for (let char of str) {
    if (char === '{' && !inQuote) depth++;
    if (char === '}' && !inQuote) depth--;
    if (char === "'" && str[str.indexOf(char) - 1] !== '\\') inQuote = !inQuote;

    if (char === ',' && depth === 0 && !inQuote) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current) values.push(current.trim());
  return values;
}
