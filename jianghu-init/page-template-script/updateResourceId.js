/**
 * 重新排序 _resource.id
 *
 * 用途：
 * - 让 _resource 按 pageId 分组后更容易排序查看。
 * - login、allPage 如果存在，固定排在最前面；其他 pageId 按名称排序。
 * - 每个 pageId 默认占一个 10 档位：1、10、20、30...
 * - 如果当前 pageId 资源超过当前 10 档，下一个 pageId 自动推进到下一个 10 档。
 *
 * 采用两阶段更新：
 * 1. 先把所有待更新 id 挪到 max(id) 之后的临时区间，避免目标 id 与现有 id 冲突；
 * 2. 再从临时 id 写回按 pageId 分组后的目标 id。
 * 3. 最后重置 _resource.AUTO_INCREMENT，避免后续新增资源 id 被临时高位 id 影响。
 */

const mysql = require('mysql');
const path = require('path');
const readline = require('readline');

let configLocal;
try {
  configLocal = require('../config/config.local.js');
} catch (error) {
  configLocal = require('../config/config.prod.js');
}

const config = configLocal({ baseDir: path.join(__dirname, '..') });
const client = config.knex.client.connection;

const connection = mysql.createConnection(client);

// id 从几开始
const START_ID = 1;
// 每个 pageId 默认占一个 10 档位：1, 10, 20, 30...
const PAGE_ID_STEP = 10;
const PAGE_ID_PRIORITY = ['login', 'allPage'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = message => new Promise(resolve => rl.question(message, resolve));

const query = (sql, params = []) => new Promise((resolve, reject) => {
  connection.query(sql, params, (error, results) => {
    if (error) reject(error);
    else resolve(results);
  });
});

const buildAssignments = rows => {
  const assignments = [];
  let currentPageId = null;
  let currentPageStart = START_ID;
  let nextId = START_ID;

  for (const row of rows) {
    if (row.pageId !== currentPageId) {
      currentPageId = row.pageId;
      nextId = currentPageStart;
    }

    assignments.push({
      oldId: row.id,
      newId: nextId,
      pageId: row.pageId,
      actionId: row.actionId,
    });
    nextId += 1;
    currentPageStart = nextPageStartAfter(nextId - 1);
  }

  return assignments;
};

const nextPageStartAfter = id => {
  if (id < PAGE_ID_STEP) return PAGE_ID_STEP;
  return Math.ceil((id + 1) / PAGE_ID_STEP) * PAGE_ID_STEP;
};

const sortResourceRows = rows => rows.slice().sort((a, b) => {
  const pagePriorityA = PAGE_ID_PRIORITY.indexOf(a.pageId);
  const pagePriorityB = PAGE_ID_PRIORITY.indexOf(b.pageId);
  const rankA = pagePriorityA === -1 ? PAGE_ID_PRIORITY.length : pagePriorityA;
  const rankB = pagePriorityB === -1 ? PAGE_ID_PRIORITY.length : pagePriorityB;

  if (rankA !== rankB) return rankA - rankB;
  if (a.pageId !== b.pageId) return String(a.pageId || '').localeCompare(String(b.pageId || ''));
  return Number(a.id) - Number(b.id);
});

async function main() {
  connection.connect();

  try {
    const answer = await question(`
host: ${client.host},
port: ${client.port},
user: ${client.user},
database: ${client.database},
确定要将 _resource.id 重新排序吗? (yes/no) `);

    if (answer.toLowerCase() !== 'yes') {
      console.log('已取消');
      return;
    }

    const rows = await query('SELECT id, pageId, actionId FROM _resource');
    if (!rows.length) {
      console.log('_resource 无数据，无需更新');
      return;
    }

    const assignments = buildAssignments(sortResourceRows(rows));
    const duplicateNewIds = assignments
      .map(item => item.newId)
      .filter((id, index, list) => list.indexOf(id) !== index);
    if (duplicateNewIds.length) {
      throw new Error(`生成的新 id 存在重复: ${Array.from(new Set(duplicateNewIds)).join(', ')}`);
    }

    const [{ maxId }] = await query('SELECT COALESCE(MAX(id), 0) AS maxId FROM _resource');
    const maxTargetId = Math.max(...assignments.map(item => item.newId));
    const tempStartId = Math.max(Number(maxId), maxTargetId) + assignments.length + PAGE_ID_STEP + 1;
    const plans = assignments.map((item, index) => ({
      ...item,
      tempId: tempStartId + index,
    }));

    console.log(`准备更新 ${plans.length} 条 _resource 记录`);
    console.log(`临时 id 区间: ${plans[0].tempId} ~ ${plans[plans.length - 1].tempId}`);

    await query('START TRANSACTION');
    try {
      for (const item of plans) {
        await query('UPDATE _resource SET id = ? WHERE id = ?', [item.tempId, item.oldId]);
      }
      for (const item of plans) {
        await query('UPDATE _resource SET id = ? WHERE id = ?', [item.newId, item.tempId]);
        console.log(`更新资源id: ${item.oldId} -> ${item.newId} (${item.pageId}/${item.actionId})`);
      }
      await query('COMMIT');
      // 两阶段更新会短暂写入高位临时 id，MySQL 可能因此推进 AUTO_INCREMENT；
      // 重置到最终最大 id + 1，避免后续新增 _resource 跳到临时区间之后。
      await query(`ALTER TABLE _resource AUTO_INCREMENT = ${maxTargetId + 1}`);
      console.log(`已重置 _resource AUTO_INCREMENT = ${maxTargetId + 1}`);
      console.log('更新完成');
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } finally {
    connection.end();
    rl.close();
  }
}

main().catch(error => {
  console.error('更新失败:', error.message);
  process.exitCode = 1;
});
