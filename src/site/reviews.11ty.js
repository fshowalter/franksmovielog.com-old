const moment = require("moment");

exports.data = {
  layout: "default",
  title: "Reviews",
};

function releaseYearFilter(html, viewings) {
  const sortedViewings = [...viewings].sort((a, b) => {
    return a.year - b.year;
  });

  const min = sortedViewings[0].year;
  const max = sortedViewings[sortedViewings.length - 1].year;

  return html`
    <input type="number" min="${min}" max="${max}" value="${min}" />
    &nbsp;to&nbsp;
    <input type="number" min="${min}" max="${max}" value="${max}" />
  `;
}

function gradeFilter(html) {
  const options = html`
    <option value="2">★★</option>
    <option value="3">★★★</option>
    <option value="4">★★★★</option>
  `;

  return html`
    <select>
      <option value="1" selected="selected">★</option>
      ${options}
      <option value="5">★★★★★</option>
    </select>
    &nbsp;to&nbsp;
    <select>
      <option value="1">★</option>
      ${options}
      <option value="5" selected="selected">★★★★★</option>
    </select>
  `;
}

const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

exports.render = function ({ reviews }) {
  reviews.sort((a, b) => {
    return collator.compare(a.title, b.title);
  });

  return this.html`
    <main>
      <h2>Reviews</h2>
      <p>I&apos;ve published ${reviews.length} reviews since 2012.</p>

      <fieldset>
        <legend>Filter &amp; Sort</legend>
        <label>Title
          <input type="text" placeholder="Enter all or part of a title" />
        </label>
        <label>Release Year
          ${releaseYearFilter(this.html, reviews)}
        </label>
        <label>Grade
          ${gradeFilter(this.html)}
        </label>
        <label>Order By
          <select name="order-by">
            <option value="title-asc" selected="selected">Title</option>
            <option value="release-date-desc">Release Date (Newest First)</option>
            <option value="release-date-asc">Release Date (Oldest First)</option>
          </select>
        </label>
      </fieldset>
      <ol>
        ${reviews
          .map((review) => {
            return this.html`<li>
              ${this.titleWithYear(review)} ${this.grade(
              review.grade
            )} ${moment(review.date).format("YYYY-DD-M")}
            </li>`;
          })
          .join("\n")}
      </ol>
    </main>
  `;
};
