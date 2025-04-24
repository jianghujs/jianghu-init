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
    let command;
    if (process.platform === 'win32') {
      command = 'where code';
    } else if (process.platform === 'darwin') {
      command = '[ -d "/Applications/Visual Studio Code.app" ] || [ -d "/Applications/Cursor.app" ] || which code';
    } else {
      // Linux 或其他系统
      command = 'which code || which codium';
    }
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
      const installCommand = process.platform === 'darwin' 
        ? `/Applications/Visual\\ Studio\\ Code.app/Contents/Resources/app/bin/code --install-extension ${vsixFile}` 
        : `code --install-extension ${vsixFile}`;
      
      exec(installCommand, (error) => {
        if (error) {
          console.error('安装VSCode扩展失败:', error);
          // 如果是Mac系统，尝试使用Cursor
          if (process.platform === 'darwin') {
            console.log('尝试使用Cursor安装...');
            exec(`/Applications/Cursor.app/Contents/Resources/app/bin/code --install-extension ${vsixFile}`, (cursorError) => {
              if (cursorError) {
                console.error('使用Cursor安装失败:', cursorError);
                console.log('请手动安装扩展包:', vsixFile);
                return;
              }
              console.log('江湖初始化助手VSCode扩展安装成功（Cursor）！');
              console.log('请重启Cursor以激活扩展。');
            });
            return;
          }
          console.log('请手动安装扩展包:', vsixFile);
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