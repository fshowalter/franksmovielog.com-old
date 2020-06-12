const markdownParser = require("markdown-it")().use(
  require("markdown-it-footnote")
);

const util = require("util");

module.exports = function (eleventyConfig) {
  // a debug utility
  eleventyConfig.addFilter("dump", (obj) => {
    return util.inspect(obj);
  });

  // alias
  eleventyConfig.addLayoutAlias("default", "layout.11ty.js");

  // compress and combine js files
  eleventyConfig.addFilter("jsmin", require("./src/utils/minify-js.js"));

  // Add html shortcode for vs-code IntelliSense
  eleventyConfig.addShortcode("html", function (literals, ...expressions) {
    let string = ``;
    for (const [i, val] of expressions.entries()) {
      string += literals[i] + val;
    }
    string += literals[literals.length - 1];
    return string;
  });

  eleventyConfig.setLibrary("md", markdownParser);

  // Add markdown shortcode for reviews
  eleventyConfig.addShortcode("markdown", function (rawMarkdown) {
    return markdownParser.render(rawMarkdown);
  });

  // minify the html output when running in prod
  if (process.env.NODE_ENV == "production") {
    eleventyConfig.addTransform(
      "htmlmin",
      require("./src/utils/minify-html.js")
    );
  }

  // Passthrough
  // eleventyConfig.addPassthroughCopy("./src/site/fonts");
  eleventyConfig.addPassthroughCopy("./src/site/backdrops");
  eleventyConfig.addPassthroughCopy("./src/site/svg");
  eleventyConfig.addPassthroughCopy("./src/site/css");

  return {
    dir: {
      input: "src/site",
      data: "_data",
      inludes: "_includes",
      output: "dist",
    },
    passthroughFileCopy: true,
    templateFormats: ["11ty.js", "md", "yml"],
    htmlTemplateEngine: "11ty.js",
    markdownTemplateEngine: "11ty.js",
  };
};
