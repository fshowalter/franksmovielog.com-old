const markdownParser = require("markdown-it")().use(
  require("markdown-it-footnote")
);
const imageForGrade = require("./src/utils/image-for-grade.js");
const titleWithYear = require("./src/utils/title-with-year.js");
const util = require("util");

module.exports = function (eleventyConfig) {
  // a debug utility
  eleventyConfig.addFilter("dump", (obj) => {
    return util.inspect(obj);
  });

  // alias
  eleventyConfig.addLayoutAlias("default", "templates/layout.11ty.js");

  eleventyConfig.setLibrary("md", markdownParser);

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
  eleventyConfig.addShortcode("markdown", function (rawMarkdown) {
    return markdownParser.render(rawMarkdown);
  });

  eleventyConfig.addShortcode("grade", function (gradeLetter) {
    return imageForGrade(gradeLetter);
  });

  eleventyConfig.addShortcode("titleWithYear", function ({
    imdb_id,
    title,
    year,
  }) {
    return titleWithYear(imdb_id, title, year);
  });

  // minify the html output when running in prod
  if (process.env.NODE_ENV == "production") {
    eleventyConfig.addTransform(
      "htmlmin",
      require("./src/utils/minify-html.js")
    );
  }

  // Passthrough
  eleventyConfig.addPassthroughCopy("./src/site/backdrops");
  eleventyConfig.addPassthroughCopy("./src/site/svg");
  eleventyConfig.addPassthroughCopy("./src/site/assets");
  eleventyConfig.addPassthroughCopy("./src/site/css");

  return {
    dir: {
      input: "src/site",
      data: "_data",
      includes: "_includes",
      output: "dist",
    },
    passthroughFileCopy: true,
    templateFormats: ["11ty.js", "md", "yml"],
    htmlTemplateEngine: "11ty.js",
    markdownTemplateEngine: "11ty.js",
  };
};
