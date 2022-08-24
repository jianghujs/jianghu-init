const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fse = require('fs-extra');
const replace = require('replace-in-file');
// const projectConfig = require('./update-project-config.json')
const config = {
  projectName: 'xiaochengxu-1table-crud',
  replaceList: [
    {
      from: 'jianghujs-xiaochengxu-1table-crud',
      to: '__name__'
    },
    {
      from: 'jianghujs_xiaochengxu_1table_crud',
      to: '__name__'
    },
  ],
  repositoryUrl: 'git@gitea.openjianghu.org:jianghujs/jianghujs-xiaochengxu-1table-crud.git'
}

const handler = async (config) => {
  const _cleanAndPrepareTmpDir = async () => {
    await fse.remove(`.tmp`)
    await fse.mkdir(`.tmp`, { recursive: true });
  }
  /**
   * 
   * @param {String|Array} files files or file 
   * eg: path/to/files/*.html, ['path/to/file', 'path/to/other/file', 'path/to/files/*.html']
   * @param {String|Array} from 'demo_project_name' | ['from_str_1', 'from_str_2']
   * @param {String|Array} to  __name__ | ['to_str_1', 'to_str_2']
   */
  const _replaceFolderFilesString = async (files, from, to) => {
    const options = {
      files: files,
      from: Array.isArray(from) ? from.map(item=>new RegExp(item, 'g')) : new RegExp(from, 'g'),
      to: to,
    };

    try {
      const results = await replace(options)
      console.log(`From ${JSON.stringify(from)} to ${JSON.stringify(to)} replacement results:`, results.filter(item=>item.hasChanged).map(item=>item.file))
    }
    catch (error) {
      console.error(`From ${JSON.stringify(from)} to ${JSON.stringify(to)} replace Error occurred:`, error);
    }
  }
  const _replaceFileStrWithReplaceList = async (files, replaceList) => {
    if (!replaceList || !replaceList.length) {
      return;
    }
    const from_arr = []
    const to_arr = []
    replaceList.forEach(item => {
      from_arr.push(item.from)
      to_arr.push(item.to)
    })
    await _replaceFolderFilesString(files, from_arr, to_arr)
  }

  console.log('prepare the tmp dir...')
  await _cleanAndPrepareTmpDir()

  console.log(`start clone project: ${config.projectName}`)
  console.log(`cd .tmp && git clone ${config.repositoryUrl} ${config.projectName}`)
  // clone the project
  await exec(`cd .tmp && git clone ${config.repositoryUrl} ${config.projectName}`); 

  console.log(`start replace project name`)
  // replace project name variable
  await _replaceFileStrWithReplaceList([
    `.tmp/${config.projectName}/**/*.js`,
    `.tmp/${config.projectName}/**/*.json`,
    `.tmp/${config.projectName}/**/*.md`,
  ], config.replaceList)
  console.log('start replace database name')
  // replace database name
  await _replaceFolderFilesString(
    [
      `.tmp/${config.projectName}/**/config.*.example.js`,
      `.tmp/${config.projectName}/**/config.*.example.js`,
    ],
  `database: '__name__'`,
  `database: '__database__'`
  )
}

handler(config)


// const execute = async () => {
//   if (!projectConfig) {
//     console.error(`project config json no content`)
//     return;
//   }
//   if (Array.isArray(projectConfig)) {
//     for (const item of projectConfig) {
//       await handler(item)
//     }
//   }
// }