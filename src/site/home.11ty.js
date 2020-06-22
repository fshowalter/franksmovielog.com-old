const html = require("./_includes/helpers/html");
const imageForGrade = require("./_includes/helpers/image-for-grade");

exports.data = {
  layout: "default",
  title: "Home",
  css: "home",
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

function buildPagination(paginationData) {
  const currentPage = paginationData.pageNumber + 1;
  const numPages = paginationData.pages.length;

  const isFirst = currentPage === 1;
  const isLast = currentPage === numPages;

  let newer;

  if (isFirst) {
    newer = html`<span
      class="home_pagination__prev home_pagination__placeholder"
      >←Newer Posts</span
    >`;
  } else {
    newer = html`<a
      class="home_pagination__prev home_pagination__link"
      href="${paginationData.href.previous}"
      >←Newer Posts</a
    >`;
  }

  let older;

  if (isLast) {
    older = html`<span
      class="home_pagination__next home_pagination__placeholder"
      >Older Posts→</span
    >`;
  } else {
    older = html`<a
      class="home_pagination__next home_pagination__link"
      href="${paginationData.href.next}"
      >Older Posts→</a
    >`;
  }

  let firstPage = "";

  if (currentPage - 1 > 1) {
    firstPage = html`<a class="home_pagination__link" href="/">1</a>`;
  }

  let newerDots = "";

  if (currentPage - 2 > 1) {
    newerDots = html`<span class="home_pagination__elipsis">…</span>`;
  }

  let prevPage = "";

  if (!isFirst) {
    prevPage = html`<a
      class="home_pagination__link"
      href="${paginationData.href.previous}"
      >${currentPage - 1}</a
    >`;
  }

  let nextPage = "";

  if (isLast) {
    nextPage = html`<span class="home_pagination__placeholder"></span>`;
  } else {
    nextPage = html`<a
      class="home_pagination__link"
      href="${paginationData.href.next}"
      >${currentPage + 1}</a
    >`;
  }

  let olderDots = "";

  if (currentPage + 2 < numPages) {
    olderDots = html`<span class="home_pagination__elipsis">…</span>`;
  }

  let lastPage = "";

  if (currentPage + 1 < numPages) {
    lastPage = html`<a
      class="home_pagination__link"
      href="${paginationData.href.last}"
      >${numPages}</a
    >`;
  }

  return html`
    <section class="home_pagination">
      <h3 class="home_pagination__heading">Pagination</h3>
      ${newer} ${firstPage} ${newerDots} ${prevPage}
      <span class="home_pagination__current_page" aria-current="page"
        >${currentPage}</span
      >
      ${nextPage} ${olderDots} ${lastPage} ${older}
    </section>
  `;
}

function firstParagraph(content) {
  return content.trim().split("\n\n", 2)[0];
}

exports.render = function ({ pagination }) {
  return html`
    <main class="home">
      <ol class="home_post_list">
        ${pagination.items
          .map((review) => {
            return this.html`<li class="home_post_list_item" value=${
              review.sequence
            }>
              <h2 class="home_post_heading">${this.titleWithYear(review)}</h2>
              <div class="home_post_image_wrap">
                <img class="home_post_image" loading="lazy" src="${`/backdrops/${review.slug}.png`}" alt="${`A still from ${review.title} (${review.year})`}" />
              </div>
              ${imageForGrade(review.grade, "home_review_grade")}
              ${this.markdown(firstParagraph(review.review_content)).replace(
                "<p>",
                '<p class="home_post_excerpt">'
              )}
              <a class="home_post__continue_reading" href="/reviews/${
                review.slug
              }/">Continue Reading</a>
            </li>`;
          })
          .join("\n")}
      </ol>
      ${buildPagination(pagination)}
    </main>
  `;
};
