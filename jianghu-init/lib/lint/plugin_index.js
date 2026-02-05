/**
 * @fileoverview JianghuJS lint rules
 */
'use strict';

const requireIndex = require('requireindex');

module.exports = {
  rules: requireIndex(__dirname + '/lib/rules'),
};
