const stylelint = require("stylelint"); // eslint-disable-line import/no-extraneous-dependencies

const {
  optionsMatches,
  report,
  ruleMessages,
  validateOptions,
} = stylelint.utils;

const ruleName = "movielog/no-comments";

const messages = ruleMessages(ruleName, {
  rejected: `Unexpected comment`,
});

const stylelintCommandPrefix = "stylelint-";

module.exports = stylelint.createPlugin(ruleName, (enabled, options) => {
  if (!enabled) {
    return null;
  }

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: options,
      possible: {
        ignore: ["stylelint-commands"],
      },
      optional: true,
    });

    if (!validOptions) {
      return;
    }

    root.walkComments((comment) => {
      // Optionally ignore stylelint commands
      if (
        comment.text.startsWith(stylelintCommandPrefix) &&
        optionsMatches(options, "ignore", "stylelint-commands")
      ) {
        return;
      }

      const message = messages.rejected;

      report({
        message,
        node: comment,
        result,
        ruleName,
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
