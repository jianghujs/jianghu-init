const fs = require('fs');
const path = require('path');

// 检查 @jianghujs/jianghu 版本号
const packagePath = './package.json';
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  const jianghuVersion = packageJson.dependencies?.['@jianghujs/jianghu'] || packageJson.devDependencies?.['@jianghujs/jianghu'];
  
  if (jianghuVersion) {
    // 移除版本号前的 ^ 或 ~
    const version = jianghuVersion.replace(/[\^~]/, '');
    const versionParts = version.split('.').map(Number);
    
    // 检查版本是否小于 5.1.13
    if (versionParts[0] < 5 || 
       (versionParts[0] === 5 && versionParts[1] < 1) ||
       (versionParts[0] === 5 && versionParts[1] === 1 && versionParts[2] < 13)) {
      this.error('微信登录模板需要 @jianghujs/jianghu 版本 >= 5.1.13，请先升级框架版本');
      process.exit(1);
    }
  } else {
    this.error('未找到 @jianghujs/jianghu 依赖，请确保项目正确安装了框架');
    process.exit(1);
  }
} else {
  this.error('未找到 package.json 文件，请确保在正确的项目目录下执行命令');
  process.exit(1);
}


// 提示config 配置结构
this.warning('config 配置结构如下：');
this.warning('jianghuConfig: {');
this.warning('  enableLoginCaptcha: true, // 启用登录验证码');
this.warning('}');

const configPath = './config/config.default.js';
if (fs.existsSync(configPath)) {
    let configContent = fs.readFileSync(configPath, 'utf-8');

    // 检查是否存在 jianghuConfig 配置
    if (configContent.includes('jianghuConfig')) {
        // 检查是否已存在 enableLoginCaptcha 配置项
        if (configContent.includes('enableLoginCaptcha')) {
            // 替换已存在的 enableLoginCaptcha 值为 true
            configContent = configContent.replace(
                /enableLoginCaptcha:\s*(true|false)/,
                'enableLoginCaptcha: true'
            );
        } else {
            // 在 jianghuConfig 中添加 enableLoginCaptcha 配置
            configContent = configContent.replace(
                /jianghuConfig:\s*{/,
                'jianghuConfig: {\n    enableLoginCaptcha: true,'
            );
        }
    } else {
        // 添加 jianghuConfig 和 enableLoginCaptcha 配置
        configContent = configContent.replace(
            'return {',
            `return {
  jianghuConfig: {
    enableLoginCaptcha: true,
  },`
        );
    }

    fs.writeFileSync(configPath, configContent);
    this.success('✅ 已启用登录验证码配置');
} else {
    this.warning('未找到 config.default.js 文件，请手动配置 enableLoginCaptcha');
}