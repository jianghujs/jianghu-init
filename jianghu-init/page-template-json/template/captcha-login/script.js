const fs = require('fs');
const path = require('path');

// 修改 config.default.js 文件,添加验证码配置
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
    this.success('✅ 已启用登录验证码配置，如有问题则升级 @jianghujs/jianghu 到最新版本');
} else {
    this.warning('未找到 config.default.js 文件，请手动配置 enableLoginCaptcha');
}