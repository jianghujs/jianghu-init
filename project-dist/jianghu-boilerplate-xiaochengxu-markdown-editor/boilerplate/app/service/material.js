const Service = require("egg").Service;
const _ = require("lodash");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const fileUtil = require('@jianghujs/jianghu/app/common/fileUtil');
const { BizError, errorInfoEnum } = require("../constant/error");
const fs = require("fs");
const os = require("os"),
    nodePath = require("path"),
    fsPromises = require("fs").promises,
    readdir = fsPromises.readdir,
    stat = fsPromises.stat,
    rename = fsPromises.rename,
    unlink = fsPromises.unlink,
    lstat = fsPromises.lstat,
    util = require("util"),
    rimraf = util.promisify(require("rimraf")),
    exists = util.promisify(fs.exists),
    copyFile = util.promisify(fs.copyFile);

const actionDataScheme = Object.freeze({
    list: {
        type: "object",
        additionalProperties: true,
        required: ["path"],
        properties: {
            path: { anyOf: [{ type: "string" }, { type: "number" }] },
        },
    },
    mkdir: {
        type: "object",
        additionalProperties: true,
        required: ["path"],
        properties: {
            path: { anyOf: [{ type: "string" }, { type: "number" }] },
        },
    },
    moveFile: {
        type: "object",
        additionalProperties: true,
        required: ["fromDir", "toDir", "filename"],
        properties: {
            fromDir: { anyOf: [{ type: "string" }, { type: "number" }] },
            toDir: { anyOf: [{ type: "string" }, { type: "number" }] },
            filename: { anyOf: [{ type: "string" }, { type: "number" }] },
        },
    },
    copyFile: {
        type: "object",
        additionalProperties: true,
        required: ["fromDir", "toDir", "filename"],
        properties: {
            fromDir: { anyOf: [{ type: "string" }, { type: "number" }] },
            toDir: { anyOf: [{ type: "string" }, { type: "number" }] },
            filename: { anyOf: [{ type: "string" }, { type: "number" }] },
        },
    },
    renameFile: {
        type: "object",
        additionalProperties: true,
        required: ["path", "newFilename"],
        properties: {
            path: { anyOf: [{ type: "string" }, { type: "number" }] },
            newFilename: { anyOf: [{ type: "string" }, { type: "number" }] },
        },
    },
    delete: {
        type: "object",
        additionalProperties: true,
        required: ["path"],
        properties: {
            path: { anyOf: [{ type: "string" }, { type: "number" }] },
        },
    },
    useMaterial: {
        type: "object",
        additionalProperties: true,
        required: ["path", "articleId"],
        properties: {
            path: { anyOf: [{ type: "string" }, { type: "number" }] },
            articleId: { anyOf: [{ type: "string" }, { type: "number" }] },
        },
    },
});

function pathCheck (path) {
    if (path.indexOf("../") > -1) {
        throw new BizError(errorInfoEnum.path_invalid);
    }
    if (path.endsWith("..")) {
        throw new BizError(errorInfoEnum.path_invalid);
    }
}

class MaterialService extends Service {

    async list() {
        const actionData = this.ctx.request.body.appData.actionData;
        validateUtil.validate(actionDataScheme.list, actionData);
        const { materialRepoDir } = this.app.config;
        let { path } = actionData;
        pathCheck(path);
        let dirs = [],
            files = [];

        if (path[path.length - 1] !== "/") {
            path += "/";
        }

        const targetPath = nodePath.join(materialRepoDir, path);
        let items = await readdir(targetPath, {
            withFileTypes: true,
        });

        for (let item of items) {
            let isFile = item.isFile(),
            isDir = item.isDirectory();

            if (!isFile && !isDir) {
                continue;
            }

            let result = {
                type: isFile ? "file" : "dir",
                path: path + item.name,
            };

            result.basename = result.name = nodePath.basename(result.path);

            if (isFile) {
                let fileStat = await stat(nodePath.join(materialRepoDir, result.path));
                result.size = fileStat.size;
                result.extension = nodePath.extname(result.path).slice(1);
                result.name = nodePath.basename(
                    result.path,
                    "." + result.extension
                );
                files.push(result);
            } else {
                result.path += "/";
                dirs.push(result);
            }
        }

        const rows = dirs.concat(files);
        return { rows };
    }

    async mkdir() {
        const actionData = this.ctx.request.body.appData.actionData;
        validateUtil.validate(actionDataScheme.mkdir, actionData);
        const { materialRepoDir } = this.app.config;
        const { path } = actionData;
        pathCheck(path);
        const targetPath = nodePath.join(materialRepoDir, path);
        await fsPromises.mkdir(targetPath, { recursive: true });
    }

    async copyFile() {
        const actionData = this.ctx.request.body.appData.actionData;
        const { materialRepoDir } = this.app.config;
        validateUtil.validate(actionDataScheme.copyFile, actionData);
        const { fromDir, toDir, filename } = actionData
        pathCheck(fromDir);
        pathCheck(toDir);
        const fromPath = nodePath.join(materialRepoDir, fromDir, filename);
        const toPath = nodePath.join(materialRepoDir, toDir, filename);
        if (!await exists(fromPath)) {
            throw new BizError(errorInfoEnum.target_file_not_exist);
        }
        await copyFile(fromPath, toPath);
    }

    async moveFile() {
        const actionData = this.ctx.request.body.appData.actionData;
        const { materialRepoDir } = this.app.config;
        validateUtil.validate(actionDataScheme.moveFile, actionData);
        const { fromDir, toDir, filename } = actionData;
        pathCheck(fromDir);
        pathCheck(toDir);
        const fromPath = nodePath.join(materialRepoDir, fromDir, filename);
        const toPath = nodePath.join(materialRepoDir, toDir, filename);
        if (!await exists(fromPath)) {
            throw new BizError(errorInfoEnum.target_file_not_exist);
        }
        await rename(fromPath, toPath);
    }

    async renameFile() {
        const actionData = this.ctx.request.body.appData.actionData;
        const { materialRepoDir } = this.app.config;
        validateUtil.validate(actionDataScheme.renameFile, actionData);
        const { path, newFilename } = actionData;
        pathCheck(path);
        const targetPath = nodePath.join(materialRepoDir, path);
        const targetDir = targetPath.substring(0, targetPath.lastIndexOf('/')+1);
        const newFilenamePath = nodePath.join(targetDir, newFilename);

        const isFileExists = await exists(targetPath);
        if (!isFileExists) {
            throw new BizError(errorInfoEnum.target_file_not_exist);
        }
        await rename(targetPath, newFilenamePath);
    }

    async delete() {
        const actionData = this.ctx.request.body.appData.actionData;
        validateUtil.validate(actionDataScheme.delete, actionData);
        const { materialRepoDir } = this.app.config;
        const { path } = actionData;
        pathCheck(path);
        const targetPath = nodePath.join(materialRepoDir, path);

        let stat = await lstat(targetPath),
            isDir = stat.isDirectory(),
            isFile = stat.isFile();
        if (isFile) {
            if (path.startsWith('/_recycle')) {
                await unlink(targetPath);
                return
            }

            const filename = path.substring(path.lastIndexOf('/')+1);
            const recycleFilePath = nodePath.join(materialRepoDir, '_recycle', filename);
            await rename(targetPath, recycleFilePath);
        } else if (isDir) {
            if (path.startsWith('/_recycle')) {
                await rimraf(targetPath);
                return
            }

            let tempPath = path;
            if (tempPath.endsWith("/")) { tempPath = tempPath.substring(0, path.length - 1); }
            const dirname = tempPath.substring(tempPath.lastIndexOf('/')+1);
            const recycleDirPath = nodePath.join(materialRepoDir, '_recycle', dirname);
            await rename(targetPath, recycleDirPath);
        }
    }    

    async clearRecycle() {
        const { materialRepoDir } = this.app.config;
        const targetPath = nodePath.join(materialRepoDir, '_recycle', '/');
        await rimraf(targetPath);
    }  

    async useMaterial() {
        const actionData = this.ctx.request.body.appData.actionData;
        validateUtil.validate(actionDataScheme.useMaterial, actionData);
        const { materialRepoDir, articleMaterialDir } = this.app.config;
        const { path, articleId } = actionData;
        pathCheck(path);
        const targetPath = nodePath.join(materialRepoDir, path);
        const stat = await lstat(targetPath);
        const isFile = stat.isFile();
        if (!isFile) {
            throw new BizError(errorInfoEnum.material_is_not_file);
        }

        const fileId = `${Date.now()}`;
        const filename = path.substring(path.lastIndexOf('/')+1);
        const filenameStorage = `${fileId}_${filename}`;
        const fileStoragePath = nodePath.join(articleMaterialDir, `${articleId}`);
        const isFileStorageExists = await exists(fileStoragePath);
        if (!isFileStorageExists) {
            await fileUtil.checkAndPrepareFilePath(fileStoragePath);
        }

        const articleMaterialPath = nodePath.join(articleMaterialDir, `${articleId}`, filenameStorage);
        await copyFile(targetPath, articleMaterialPath);
        const downloadPath = nodePath.join('/articleMaterial', `${articleId}`, filenameStorage);
        return { filename, downloadPath };
    }
    
}
module.exports = MaterialService;
