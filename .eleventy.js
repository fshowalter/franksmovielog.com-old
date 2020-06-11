const marked = require("marked");

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

  // Add markdown shortcode for reviews
  eleventyConfig.addShortcode("markdown", function (markdown) {
    return marked(markdown);
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
  eleventyConfig.addPassthroughCopy("./src/site/images");
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
