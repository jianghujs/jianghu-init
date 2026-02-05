/**
 * @fileoverview Ensure actionDataScheme constant definition in service files
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'ensure actionDataScheme constant in service',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingActionDataScheme: 'Service file must define "const actionDataScheme = Object.freeze({...})".',
    },
    schema: [],
  },

  create(context) {
    let hasActionDataScheme = false;

    return {
      VariableDeclarator(node) {
        if (node.id.name === 'actionDataScheme') {
          hasActionDataScheme = true;
        }
      },
      'Program:exit'(node) {
        if (!hasActionDataScheme) {
          context.report({
            node,
            messageId: 'missingActionDataScheme',
          });
        }
      },
    };
  },
};
