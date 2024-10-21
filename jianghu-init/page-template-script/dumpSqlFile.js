'use strict';
const path = require('path');
const mysqldump = require('mysqldump');
const fs = require('fs');
const configLocal = require('../config/config.local.js');
const config = configLocal({baseDir: path.join(__dirname, '..')});
const client = config.knex.client.connection



const noDataTables = ['_cache', '_record_history', '_user_session'];
// 加一个不导出结构和数据的表名列表
const noSchemaTables = ['_directory_user_session', '_group', '_role', '_user_group_role', '_user_group_role_page', '_view01_user', '_user_group_role_resource', '_view02_user_app'];

async function dumpSingleProject(database, targetDir) {
    try {
        if (!database) {
            console.error('未提供数据库名称');
            return;
        }

        const targetFile = path.join(targetDir, 'sql/1.init.sql');
        await dumpSql({ database, targetFile });
        copyAndCreateSqlFiles(targetDir);
        
        console.log(`成功导出 ${database} 数据库到 ${targetFile}`);
    } catch (error) {
        console.error('导出过程中发生错误:', error);
    }
}

async function dumpSql({ database, targetFile, options = { data: true, schema: true } }) {
    const connection = client;
    connection.database = database;
    const res = await mysqldump({
        connection,
        dump: {
            data: { format: false },
            schema: { table: { dropIfExist: true } },
            trigger: { dropIfExist: true },
        }
    });

    let content = '';
    // if (options.data) {
    //     content += '# EMPTY TABLE\n\n';
    //     for (const tableData of res.tables) {
    //         content += `TRUNCATE TABLE ${tableData.name};\n`;
    //     }
    // }

    for (const tableData of res.tables) {
        if (noSchemaTables.includes(tableData.name)) {
            continue;
        }
        if (options.schema) {
            content += tableData.schema + '\n';
        }

        if (options.data && !noDataTables.includes(tableData.name)) {
            content += (tableData.data || '') + '\n';
        }

        if (options.trigger) {
            content += (tableData.triggers && tableData.triggers.join('\n') || '');
        }

        content += '\n';
    }

    fs.writeFileSync(targetFile, content);
    console.log(`导出${targetFile}结束`);
}

function copyAndCreateSqlFiles(projectPath, subdir = '') {
    fs.copyFileSync(path.join(__dirname, './sql/common-user.sql'), path.join(projectPath, `${subdir}/sql/2.user.sql`));
    const mockSqlPath = path.join(projectPath, `${subdir}/sql/3.mock.sql`);
    if (!fs.existsSync(mockSqlPath)) {
        fs.writeFileSync(mockSqlPath, '');
    }
}

// 主函数
async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error('使用方法: node dumpSqlFile.js <数据库名称> <目标目录>');
        process.exit(1);
    }

    const [database, targetDir] = args;
    await dumpSingleProject(database, targetDir);
}

main();
