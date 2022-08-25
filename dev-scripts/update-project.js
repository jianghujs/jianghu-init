const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fse = require('fs-extra');
const replace = require('replace-in-file');
const path = require('path')
const projectConfig = require('./update-project-config.json')
const { execute } = require('./generate-boilerplate');

const handler = async (config) => {
  const _cleanAndPrepareTmpDir = async (tmpPath, projectName) => {
    try {
      await fse.access(tmpPath, fse.constants.W_OK)
      await fse.remove(path.join(tmpPath, projectName))
    } catch(err) {
      console.error(`access: ${path} error: ${err}`)
      await fse.mkdir(tmpPath, { recursive: true });
    }
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
  const tmpDir = `${__dirname}/.tmp`
  await _cleanAndPrepareTmpDir(tmpDir, config.projectName)

  console.log(`start clone project: ${config.projectName}`)
  // clone the project
  await exec(`cd ${tmpDir} && git clone ${config.repositoryUrl} ${config.projectName}`); 

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

  execute(path.join(tmpDir, config.projectName), config.projectName)

  console.log(`update project: ${config.projectName} done`)
}

const run = async () => {
  if (!projectConfig) {
    console.error(`project config json no content`)
    return;
  }
  if (Array.isArray(projectConfig)) {
    for (const item of projectConfig) {
      await handler(item)
    }
  }
}

run()