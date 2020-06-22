const fs = require("fs");

const reviews = JSON.parse(
  fs.readFileSync("./src/site/_data/reviews.json", "utf8")
);

module.exports = function (imdb_id, title, year) {
  titleWithYear = `${title} <span>(${year})</span>`;

  const review = reviews.find((review) => review.imdb_id === imdb_id);

  if (!review) {
    return titleWithYear;
  }

  return `<a href="${`/reviews/${review.slug}/`}">${titleWithYear}</a>`;
};
