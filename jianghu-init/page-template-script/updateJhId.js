/**
 * 重新排序_resource的id
 */

const Knex = require('knex')
const path = require('path');
const readline = require('readline');
let eggConfigInfo;
try {
    eggConfigInfo = require('../config/config.local.js');
} catch (error) {
    eggConfigInfo = require('../config/config.prod.js');
}
const config = eggConfigInfo({baseDir: path.join(__dirname, '..')});
const knexConnection = config.knex.client.connection


async function main() { 
    const knex = Knex({ client: 'mysql', connection: knexConnection });
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const databaseName = knexConnection.database;
    let tables = await knex(`information_schema.tables`).where({ TABLE_SCHEMA: databaseName }).select();
    tables = tables
        .filter(table => table.TABLE_NAME.startsWith('_') && table.TABLE_TYPE ==='BASE TABLE')
        .filter(table => !table.TABLE_NAME.includes('_copy'))
        .filter(table => !table.TABLE_NAME.includes('bak'))
        .filter(table => !table.TABLE_NAME.startsWith('__'))
        .filter(table => table.TABLE_NAME == '_resource')
        ;

    console.group("数据库信息");
    console.log(`host: ${knexConnection.host}`);
    console.log(`port: ${knexConnection.port}`);
    console.log(`user: ${knexConnection.user}`);
    console.log(`database: ${knexConnection.database}`);
    console.groupEnd();

    const fillJhIdDataStatic = async (tables, consoleTitle) => {
        console.group(consoleTitle);
        for (const table of tables) {
            const { TABLE_NAME } = table;
            try {
                const jhIdDataStatic = await knex(TABLE_NAME).distinct('jhId').groupBy('jhId').select('jhId', knex.raw('count(*) as count'));
                table.jhIdDataStatic = jhIdDataStatic;
            } catch (error) {
                table.jhIdDataStatic = [];
            }
        }
        console.table(tables.map(table => ({ TABLE_NAME: table.TABLE_NAME, jhIdDataStatic: table.jhIdDataStatic.map(item => `${item.jhId}: ${item.count}`).join('; ') })));
        console.groupEnd();
    };

    await fillJhIdDataStatic(tables, 'jhId更新前');

    const jhIdOld = await new Promise(resolve => rl.question('请输入旧的 jhIdOld: ', resolve));
    const jhIdNew = await new Promise(resolve => rl.question('请输入新的 jhIdNew: ', resolve));
    if (!jhIdOld || !jhIdNew) { 
        console.log('Error: jhIdOld 或 jhIdNew 不能为空'); 
        await knex.destroy();
        rl.close();
        return;
    };
    for (const table of tables) {
        const { TABLE_NAME, jhIdDataStatic } = table;
        if (!jhIdDataStatic || jhIdDataStatic.length == 0) { continue; };
        if (!jhIdOld || !jhIdNew) { continue; };
        await knex(TABLE_NAME).where({ jhId: jhIdOld }).update({ jhId: jhIdNew });
    }
    await fillJhIdDataStatic(tables, 'jhId更新后');
    await knex.destroy();
    rl.close();
}


main();