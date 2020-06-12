exports.data = {
  layout: "default",
  title: "Home",
  pagination: {
    data: "reviews",
    size: 1,
  },
  permalink(data) {
    return `reviews/${data.pagination.items[0].slug}/`;
  },
};

exports.render = function ({ pagination }) {
  const review = pagination.items[0];

  return this.html`
    <main>
      <h1>${review.title} (${review.year})</h1>
      ${this.markdown(review.review_content)}
    </main>
  `;
};
