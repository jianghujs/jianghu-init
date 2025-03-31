#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * 检查VSCode是否已安装
 */
function checkVSCodeInstalled() {
  return new Promise((resolve) => {
    const command = os.platform() === 'win32' ? 'where code' : 'which code';
    exec(command, (error) => {
      resolve(!error);
    });
  });
}

/**
 * 检查扩展是否已安装
 */
function checkExtensionInstalled() {
  return new Promise((resolve) => {
    exec('code --list-extensions', (error, stdout) => {
      if (error) {
        resolve(false);
        return;
      }
      resolve(stdout.includes('jianghujs.jianghu-init-vscode'));
    });
  });
}

/**
 * 安装VSCode扩展
 */
async function installExtension() {
  console.log('正在检查VSCode是否已安装...');
  const isVSCodeInstalled = await checkVSCodeInstalled();
  
  if (!isVSCodeInstalled) {
    console.log('未检测到VSCode，请先安装VSCode后再安装扩展。');
    return;
  }

  console.log('正在检查扩展是否已安装...');
  const isExtensionInstalled = await checkExtensionInstalled();
  
  if (isExtensionInstalled) {
    console.log('检测到扩展已安装，正在卸载旧版本...');
    exec('code --uninstall-extension jianghujs.jianghu-init-vscode', (error) => {
      if (error) {
        console.error('卸载旧版本失败:', error);
        return;
      }
      console.log('旧版本卸载成功。');
    });
  }
  
  console.log('正在构建VSCode扩展...');
  
  // 构建扩展
  exec('npm run compile', { cwd: __dirname }, (error) => {
    if (error) {
      console.error('构建VSCode扩展失败:', error);
      return;
    }
    
    console.log('正在打包VSCode扩展...');
    
    // 确保prebuilt目录存在
    const prebuiltDir = path.join(__dirname, 'prebuilt');
    if (!fs.existsSync(prebuiltDir)) {
      fs.mkdirSync(prebuiltDir);
    }
    
    // 打包扩展到prebuilt目录
    exec('npx vsce package -o prebuilt/jianghu-init-vscode-0.0.1.vsix', { cwd: __dirname }, (error) => {
      if (error) {
        console.error('打包VSCode扩展失败:', error);
        return;
      }
      
      const vsixFile = path.join(prebuiltDir, 'jianghu-init-vscode-0.0.1.vsix');
      
      if (!fs.existsSync(vsixFile)) {
        console.error('未找到生成的.vsix文件');
        return;
      }
      
      console.log(`正在安装VSCode扩展: ${vsixFile}...`);
      
      // 安装扩展
      exec(`code --install-extension ${vsixFile}`, (error) => {
        if (error) {
          console.error('安装VSCode扩展失败:', error);
          return;
        }
        
        console.log('江湖初始化助手VSCode扩展安装成功！');
        console.log('请重启VSCode以激活扩展。');
      });
    });
  });
}

// 执行安装
installExtension(); 