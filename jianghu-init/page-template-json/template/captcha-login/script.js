const fs = require('fs');
const path = require('path');

// 运行这个脚本更改 config.default.js 文件

const configPath = './config/config.default.js';
if (fs.existsSync(configPath)) {
    let configContent = fs.readFileSync(configPath, 'utf-8');

    // Check if jianghuConfig exists
    if (configContent.includes('jianghuConfig')) {
        // Check if enableLoginCaptcha already exists
        if (configContent.includes('enableLoginCaptcha')) {
            // Replace existing enableLoginCaptcha value
            configContent = configContent.replace(
                /enableLoginCaptcha:\s*(true|false)/,
                'enableLoginCaptcha: true'
            );
        } else {
            // Add enableLoginCaptcha to jianghuConfig
            configContent = configContent.replace(
                /jianghuConfig:\s*{/,
                'jianghuConfig: {\n    enableLoginCaptcha: true,'
            );
        }
    } else {
        // Add jianghuConfig with enableLoginCaptcha
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