"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModernConfigText = exports.isV7ConfigDocument = exports.isV6ConfigDocument = exports.isJsConfigDocument = exports.detectConfigVersion = void 0;
/**
 * 从完整文件文本解析 version: 'v6' | 'v7'（v7 优先）。
 * 已持有全文时直接正则查找，不做行数截断。
 */
function detectConfigVersion(text) {
    if (/version\s*:\s*['"]v7['"]/.test(text))
        return 'v7';
    if (/version\s*:\s*['"]v6['"]/.test(text))
        return 'v6';
    return null;
}
exports.detectConfigVersion = detectConfigVersion;
function isJsConfigDocument(document) {
    return document.fileName.endsWith('.js');
}
exports.isJsConfigDocument = isJsConfigDocument;
function isV6ConfigDocument(document) {
    if (!isJsConfigDocument(document))
        return false;
    return detectConfigVersion(document.getText()) === 'v6';
}
exports.isV6ConfigDocument = isV6ConfigDocument;
function isV7ConfigDocument(document) {
    if (!isJsConfigDocument(document))
        return false;
    return detectConfigVersion(document.getText()) === 'v7';
}
exports.isV7ConfigDocument = isV7ConfigDocument;
/** v6 / v7 语义或 pageContent 配置：不走 v4 md-doc / json 模板 hover */
function isModernConfigText(text) {
    return detectConfigVersion(text) !== null;
}
exports.isModernConfigText = isModernConfigText;
//# sourceMappingURL=configVersionDetect.js.map