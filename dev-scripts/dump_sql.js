// dump sql to project/sql/init.sql
'use strict';

const mysqldump = require('mysqldump')
const Knex = require('knex')
const fs = require("fs");

const connection = {
    host: '8.210.35.150',
    port: 3306,
    user: 'root',
    password: '57a68e5e0b5d21a0',
};

/**
 * 导出 sql
 * @param database 数据库
 * @param noDataTables 不导出数据的表，如 log 相关表
 * @param clearFields 导出前清除的表的字段
 * @param targetFile 导出文件
 * @param replace 关键字替换
 * @returns {Promise<void>}
 */
 async function dumpSql(database, noDataTables, clearFields, targetFile, replace) {
    connection.database = database;
    const knex = Knex({
        client: 'mysql',
        connection,
    });

    // clear fields
    clearFields.map(async tableField => {
        await knex(tableField.table).update(tableField.field, '');
    })

    const res = await mysqldump({
        connection,
        dump: {
            data: {
                format: false
            },
            schema: {
                table: {
                    dropIfExist: true,
                },
            },
            trigger: {
                dropIfExist: true,
            },
        }
    });

    let content = '';
    res.tables.forEach(tableData => {
        if (noDataTables.includes(tableData.name)) {
            content += tableData.schema + '\n' + (tableData.triggers && tableData.triggers.join('\n') || '') + '\n\n\n'
        } else {
            content += tableData.schema + '\n' + (tableData.data || '')  + '\n' + (tableData.triggers && tableData.triggers.join('\n') || '') + '\n\n\n'
        }
    })

    replace.forEach((item) => {
        content = content.replace(new RegExp(/DROP TRIGGER IF EXISTS (\w*);/, 'g'), 'DROP TRIGGER IF EXISTS `$1`;')
        content = content.replace(new RegExp(item.key, 'g'), item.value)
    })

    fs.writeFileSync(targetFile, content);
    console.log(`导出${database}结束`)
    await knex.destroy();
}

// 不导出数据部分的表
let noDataTables = [ '_cache', '_resource_request_log', '_user_session'];
// 导出前清理表中的无用字段
let clearFields = [
    { table: '_resource', field: 'requestDemo' },
    { table: '_resource', field: 'responseDemo' }
];
let replace = [
    // 前缀处理成模板
    { key: 'jianghujs_demo_enterprise_', value: '{{dbPrefix}}'},
    // 抹掉 utf8 相关配置
    { key: ' COLLATE utf8mb4_bin', value: ''},
    { key: ' COLLATE utf8', value: ''},
    { key: ' COLLATE = utf8mb4_bin', value: ''},
    { key: ' COLLATE = utf8', value: ''},
    { key: ' DEFAULT CHARSET = utf8mb4_bin', value: ''},
    { key: ' DEFAULT CHARSET = utf8mb4', value: ''},
    { key: ' DEFAULT CHARSET = utf8', value: ''},
    { key: ' CHARACTER SET utf8mb4_bin', value: ''},
    { key: ' CHARACTER SET utf8mb4', value: ''},
    { key: ' CHARACTER SET utf8', value: ''},
];

(async () => {
    // multi
    await dumpSql('jianghujs_demo_enterprise_data_repository', noDataTables, clearFields, '../demo/demo_multi/data_repository/sql/init.sql', replace)
    await dumpSql('jianghujs_demo_enterprise_user_app_management', noDataTables, clearFields, '../demo/demo_multi/user_app_management/sql/init.sql', replace)
    await dumpSql('jianghujs_demo_enterprise_directory', noDataTables, clearFields, '../demo/demo_multi/directory/sql/init.sql', replace)
    await dumpSql('jianghujs_demo_enterprise_demo_xiaoapp', noDataTables, clearFields, '../demo/demo_xiaoapp-in-multi/sql/init.sql', replace)
    // xiaoapp
    await dumpSql('jianghujs_demo_basic', noDataTables, clearFields, '../demo/demo_xiaoapp/sql/init.sql', replace)
})()
