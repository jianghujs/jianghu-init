/**
 * @fileoverview Ensure doUiAction exists in Vue methods with correct signature
 */
'use strict';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'ensure doUiAction in Vue methods',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      missingDoUiAction: 'Vue methods must contain "doUiAction" method.',
      invalidDoUiAction: '"doUiAction" must be a function with signature (uiActionId, uiActionData).',
    },
    schema: [],
  },

  create(context) {
    return {
      NewExpression(node) {
        if (node.callee.name === 'Vue' && node.arguments.length > 0) {
          const config = node.arguments[0];
          if (config.type === 'ObjectExpression') {
            const methodsProp = config.properties.find(p => p.key.name === 'methods');
            if (methodsProp && methodsProp.value.type === 'ObjectExpression') {
              const doUiAction = methodsProp.value.properties.find(p => p.key.name === 'doUiAction');
              
              if (!doUiAction) {
                context.report({
                  node: methodsProp,
                  messageId: 'missingDoUiAction',
                });
              } else {
                // Check if it is a function and has arguments
                if (
                  (doUiAction.value.type === 'FunctionExpression' || doUiAction.value.type === 'ArrowFunctionExpression')
                ) {
                   // Check arguments count (optional, but requested "default format and args")
                   // Usually: async doUiAction(uiActionId, uiActionData)
                   // We just warn if params length is not 2, or names don't match loosely? 
                   // Let's be strict on params length >= 2 or names.
                   // Actually, let's just check it is a function for now to avoid false positives on loose usage, 
                   // but user said "must have default format and args".
                   // Let's require at least 2 args.
                   if (doUiAction.value.params.length < 2) {
                     context.report({
                       node: doUiAction,
                       messageId: 'invalidDoUiAction',
                     });
                   }
                } else {
                   context.report({
                     node: doUiAction,
                     messageId: 'invalidDoUiAction',
                   });
                }
              }
            }
          }
        }
      },
    };
  },
};
