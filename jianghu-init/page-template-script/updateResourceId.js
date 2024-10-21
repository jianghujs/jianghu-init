/**
 * 重新排序_resource的id
 */

const mysql = require('mysql');
const path = require('path');
const readline = require('readline');
const configLocal = require('../config/config.local.js');
const config = configLocal({baseDir: path.join(__dirname, '..')});
const client = config.knex.client.connection

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const connection = mysql.createConnection(client);

// id从几开始
const START_ID = 0;
// 每个pageId之间间隔几个id
const PAGE_ID_GAP = 20;

connection.connect();

rl.question(`
host: ${client.host}, 
port: ${client.port},
user: ${client.user}, 
database: ${client.database}, 
确定要将_resource的id重新排序吗? (yes/no) `, function (answer) {
    if (answer.toLowerCase() !== 'yes') {
        console.log('已取消');
        rl.close();
        return;
    }

    // 仅按pageId排序
    connection.query('SELECT * FROM _resource ORDER BY pageId', async function (error, results, fields) {
        if (error) throw error;

        var currentPageId = null;
        var newId = START_ID;
        // 将更新操作包装成 Promise

        var updatePromises = results.map(result => {
            return new Promise((resolve, reject) => {
                if (result.pageId !== currentPageId) {
                    if (currentPageId != null) {
                        newId += PAGE_ID_GAP;
                    }

                    currentPageId = result.pageId;
                    newId = Math.floor(newId / 10) * 10;
                }

                connection.query('UPDATE _resource SET id = ? WHERE id = ?', [newId, result.id], function (error, results, fields) {
                    if (error) reject(error);
                    console.log('已更新资源id，从 ' + result.id + ' 到 ' + newId);
                    resolve();
                });

                newId++;
            });
        });

        // 等待所有更新操作完成
        await Promise.all(updatePromises);

        connection.end();
        rl.close();
    });
});
