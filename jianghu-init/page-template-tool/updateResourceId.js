/**
 * 重新排序_resource的id
 */

const mysql = require('mysql');
const path = require('path');
const readline = require('readline');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const connection = mysql.createConnection({
    host: process.env.DB_HOST,     // 你的数据库地址
    port: process.env.DB_PORT,
    user: process.env.DB_USER,      // 数据库用户名
    password: process.env.DB_PASSWORD,  // 数据库密码
    database: 'baofeng_v3',   // 数据库名
});

// id从几开始
const START_ID = 0;
// 每个pageId之间间隔几个id
const PAGE_ID_GAP = 20;

connection.connect();

rl.question(`
host: ${process.env.DB_HOST}, 
port: ${process.env.DB_PORT},
user: ${process.env.DB_USER}, 
database: ${process.env.DB_DATABASE}, 
确定要将_resource的id重新排序吗? (yes/no) `, function (answer) {
    if (answer.toLowerCase() !== 'yes') {
        console.log('Cancelled');
        rl.close();
        return;
    }

    // 按pageId和jhId排序
    connection.query('SELECT * FROM _resource ORDER BY jhId, pageId', async function (error, results, fields) {
        if (error) throw error;

        var currentPageId = null;
        var currentJhId = null;
        var newId = START_ID;
        // 将更新操作包装成 Promise

        var updatePromises = results.map(result => {
            return new Promise((resolve, reject) => {
                if (result.jhId && (result.jhId !== currentJhId)) {
                    currentJhId = result.jhId
                    newId += 500
                }
                if (result.pageId !== currentPageId) {
                    if (currentPageId != null) {
                        newId += PAGE_ID_GAP;
                    }

                    currentPageId = result.pageId;
                    newId = Math.floor(newId / 10) * 10;

                }

                connection.query('UPDATE _resource SET id = ? WHERE id = ?', [newId, result.id], function (error, results, fields) {
                    if (error) reject(error);
                    console.log('Updated resource id from ' + result.id + ' to ' + newId);
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
