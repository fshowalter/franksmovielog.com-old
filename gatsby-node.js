const { createPages } = require("./src/gatsby/createPages");
const { onCreateNode } = require("./src/gatsby/onCreateNode");

/** @type { import("gatsby").GatsbyNode } */
const config = {};
exports.config = config;

config.createPages = createPages;
config.onCreateNode = onCreateNode;

module.exports = config;
