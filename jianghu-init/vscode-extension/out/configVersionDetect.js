"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isModernConfigText = exports.isV7ConfigDocument = exports.isV6ConfigDocument = exports.isJsConfigDocument = exports.detectConfigVersion = void 0;
/** 从文件头部解析 version: 'v6' | 'v7'（v7 优先检测，避免混写时误判） */
function detectConfigVersion(text, maxLines = 60) {
    const head = text.split('\n').slice(0, maxLines).join('\n');
    if (/version\s*:\s*['"]v7['"]/.test(head))
        return 'v7';
    if (/version\s*:\s*['"]v6['"]/.test(head))
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
    return detectConfigVersion(document.getText(), 40) === 'v6';
}
exports.isV6ConfigDocument = isV6ConfigDocument;
function isV7ConfigDocument(document) {
    if (!isJsConfigDocument(document))
        return false;
    return detectConfigVersion(document.getText(), 40) === 'v7';
}
exports.isV7ConfigDocument = isV7ConfigDocument;
/** v6 / v7 语义或 pageContent 配置：不走 v4 md-doc / json 模板 hover */
function isModernConfigText(text) {
    return detectConfigVersion(text) !== null;
}
exports.isModernConfigText = isModernConfigText;
//# sourceMappingURL=configVersionDetect.js.map