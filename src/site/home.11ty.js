exports.data = {
  layout: "default",
  title: "Home",
  pagination: {
    data: "reviews",
    reverse: true,
    size: 20,
  },
  permalink(data) {
    const pagePath =
      data.pagination.pageNumber === 0
        ? ""
        : `/page-${data.pagination.pageNumber + 1}/`;

    return `/${pagePath}`;
  },
};

exports.render = function ({ pagination }) {
  return this.html`
    <main>
      <ol>
        ${pagination.items
          .map((review) => {
            return this.html` <li value=${review.sequence}>
              <h2>${review.title}</h2>
              ${this.markdown(review.review_content)}
            </li>`;
          })
          .join("\n")}
      </ol>
    </main>
  `;
};
