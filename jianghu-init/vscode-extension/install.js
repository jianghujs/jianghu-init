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
 * 安装VSCode扩展
 */
async function installExtension() {
  console.log('正在检查VSCode是否已安装...');
  const isVSCodeInstalled = await checkVSCodeInstalled();
  
  if (!isVSCodeInstalled) {
    console.log('未检测到VSCode，请先安装VSCode后再安装扩展。');
    return;
  }
  
  console.log('正在构建VSCode扩展...');
  
  // 构建扩展
  exec('npm run vscode:build', { cwd: path.join(__dirname, '..') }, (error) => {
    if (error) {
      console.error('构建VSCode扩展失败:', error);
      return;
    }
    
    console.log('正在打包VSCode扩展...');
    
    // 打包扩展
    exec('npm run vscode:package', { cwd: path.join(__dirname, '..') }, (error) => {
      if (error) {
        console.error('打包VSCode扩展失败:', error);
        return;
      }
      
      // 查找生成的.vsix文件
      fs.readdir(__dirname, (err, files) => {
        if (err) {
          console.error('读取目录失败:', err);
          return;
        }
        
        const vsixFile = files.find(file => file.endsWith('.vsix'));
        
        if (!vsixFile) {
          console.error('未找到生成的.vsix文件');
          return;
        }
        
        console.log(`正在安装VSCode扩展: ${vsixFile}...`);
        
        // 安装扩展
        exec(`code --install-extension ${path.join(__dirname, vsixFile)}`, (error) => {
          if (error) {
            console.error('安装VSCode扩展失败:', error);
            return;
          }
          
          console.log('江湖初始化助手VSCode扩展安装成功！');
          console.log('请重启VSCode以激活扩展。');
        });
      });
    });
  });
}

// 执行安装
installExtension(); 