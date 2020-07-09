#! /usr/bin/env node

const chokidar = require("chokidar"); // eslint-disable-line import/no-extraneous-dependencies
const fs = require("fs");
const path = require("path");

// One-liner for current directory
chokidar.watch("../movielog-new/reviews").on("all", (event, sourcePath) => {
  if (event === "add" || event === "change") {
    console.log(event, sourcePath); // eslint-disable-line no-console
    const name = path.basename(sourcePath);
    fs.copyFileSync(sourcePath, `${__dirname}/content/reviews/${name}`);
  }
});
