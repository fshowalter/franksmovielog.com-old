const fs = require("fs");

const reviews = JSON.parse(
  fs.readFileSync("./src/site/_data/reviews.json", "utf8")
);

module.exports = function (imdbId, text, className) {
  const review = reviews.find((review) => review.imdb_id === imdbId);

  if (!review) {
    return text;
  }

  return `<a class="${className}" href="${`/reviews/${review.slug}/`}">${text}</a>`;
};
