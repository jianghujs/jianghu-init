'use strict';
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mysqldump = require('mysqldump');
const fs = require('fs');

const connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const noDataTables = ['_cache', '_record_history', '_user_session'];
// 加一个不导出结构和数据的表名列表
const noSchemaTables = ['_directory_user_session', '_group', '_role', '_user_group_role', '_user_group_role_page', '_view01_user', '_user_group_role_resource', '_view02_user_app'];

async function npmInstall() {
    try {
        const projectList = require('./project-list.js');

        for (const project of projectList) {
            const { name, url, subProjectList } = project;
            const projectPath = path.join(__dirname, `../${name}`);

            if (!fs.existsSync(projectPath)) {
                console.error(`${name} 未拉取，请执行项目拉取命令或手动执行`);
                continue;
            }

            if (subProjectList) {
                console.log(`${name} 为多应用项目，在子应用目录下执行 dump 1.init.sql`);
                for (const subProject of subProjectList) {
                    const { subdir, database } = subProject;
                    if (!subProject.database) { continue;}
                    await dumpSql({ database, targetFile: path.join(projectPath, `${subdir}/sql/1.init.sql`) });
                    copyAndCreateSqlFiles(projectPath, subdir);
                }
            } else {
                if (!project.database) { continue;}
                await dumpSql({ database: project.database, targetFile: path.join(projectPath, 'sql/1.init.sql') });
                copyAndCreateSqlFiles(projectPath);
            }
        }
    } catch (error) {
        console.error('发生错误:', error);
    }
}

async function dumpSql({ database, targetFile, options = { data: true, schema: true } }) {
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

npmInstall();
