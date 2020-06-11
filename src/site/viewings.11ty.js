const moment = require("moment");

exports.data = {
  layout: "default",
  title: "Viewings",
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

function venueSelect(html, viewings) {
  const collator = new Intl.Collator("en", {
    numeric: true,
    sensitivity: "base",
  });

  const options = [html`<option key="all">All</option>`].concat(
    Array.from(
      new Set(
        viewings.map((viewing) => {
          return html`<option>${viewing.venue}</option>`;
        })
      )
    ).sort((a, b) => {
      return collator.compare(a, b);
    })
  );

  return html`
    <select
      >${options.join("\n")}</select
    >
  `;
}

function slugForViewing(viewing) {
  return `${moment(viewing.date).format("dddd MMM D, YYYY")} via ${
    viewing.venue
  }.`;
}

exports.render = function ({ viewings }) {
  viewings.sort((a, b) => {
    return b.sequence - a.sequence;
  });

  return this.html`
    <main>
      <h2>Viewing Log</h2>
      <p>I&apos;ve watched ${viewings.length} movies since 2012.</p>

      <fieldset>
        <legend>Filter &amp; Sort</legend>
        <label>Title
          <input type="text" placeholder="Enter all or part of a title" />
        </label>
        <label>Release Year
          ${releaseYearFilter(this.html, viewings)}
        </label>
        <label>Venue
          ${venueSelect(this.html, viewings)}
        </label>
        <label>Order By
          <select name="order-by">
            <option value="viewing-date-desc">Viewing Date (Newest First)</option>
            <option value="viewing-date-asc">Viewing Date (Oldest First)</option>
            <option value="release-date-desc">Release Date (Newest First)</option>
            <option value="release-date-asc">Release Date (Oldest First)</option>
            <option value="title-asc">Title</option>
          </select>
        </label>
      </fieldset>
      <ol reversed>
        ${viewings
          .map((viewing) => {
            return this.html` <li>
              <div>${viewing.title} (${viewing.year})</div>
              ${slugForViewing(viewing)}
            </li>`;
          })
          .join("\n")}
      </ol>
    </main>
  `;
};
