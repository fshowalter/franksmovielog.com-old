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

function buildPagination(html, paginationData) {
  const currentPage = paginationData.pageNumber + 1;
  const numPages = paginationData.pages.length;

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;

  let newer;

  if (isFirst) {
    newer = html`<span>←Newer Posts</span>`;
  } else {
    newer = html`<a href="${paginationData.href.previous}">←Newer Posts</a>`;
  }

  let older;

  if (isLast) {
    older = html`<span>Older Posts→</span>`;
  } else {
    older = html`<a href="${paginationData.href.next}">Older Posts→</a>`;
  }

  let firstPage = "";

  if (currentPage - 1 > 1) {
    firstPage = html`<a href="/">1</a>`;
  }

  let newerDots = "";

  if (currentPage - 2 > 1) {
    newerDots = html`<span>…</span>`;
  }

  let prevPage = "";

  if (!isFirst) {
    prevPage = html`<a href="${paginationData.href.previous}"
      >${currentPage - 1}</a
    >`;
  }

  let nextPage = "";

  if (isLast) {
    nextPage = html`<span></span>`;
  } else {
    nextPage = html`<a href="${paginationData.href.next}"
      >${currentPage + 1}</a
    >`;
  }

  let olderDots = "";

  if (currentPage + 2 < numPages) {
    olderDots = html`<span>…</span>`;
  }

  let lastPage = "";

  if (currentPage + 1 < numPages) {
    lastPage = html`<a href="${paginationData.href.last}">${numPages}</a>`;
  }

  return html`
    <section>
      <h3>Pagination</h3>
      ${newer} ${firstPage} ${newerDots} ${prevPage}
      <span aria-current="page">${currentPage}</span>
      ${nextPage} ${olderDots} ${lastPage} ${older}
    </section>
  `;
}

exports.render = function ({ pagination }) {
  return this.html`
    <main>
      <ol>
        ${pagination.items
          .map((review) => {
            return this.html`<li value=${review.sequence}>
              <h2><a href=${`/reviews/${review.slug}/`}>${review.title} (${
              review.year
            })</a></h2>
              <img loading="lazy" src="${`/backdrops/${review.slug}.png`}" alt="${`A still from ${review.title} (${review.year})`}" />
              ${this.markdown(review.review_content)}
            </li>`;
          })
          .join("\n")}
      </ol>
      ${buildPagination(this.html, pagination)}
    </main>
  `;
};
