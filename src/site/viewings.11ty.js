const html = require("./_includes/helpers/html");
const moment = require("moment");
const reviewLink = require("./_includes/helpers/review-link");

exports.data = {
  layout: "default",
  title: "Viewings",
  css: "viewings",
};

function releaseYearFilter(html, viewings) {
  const sortedViewings = [...viewings].sort((a, b) => {
    return a.year - b.year;
  });

  const min = sortedViewings[0].year;
  const max = sortedViewings[sortedViewings.length - 1].year;

  return html`
    <div>
      <input type="number" min="${min}" max="${max}" value="${min}" />
      &nbsp;to&nbsp;
      <input type="number" min="${min}" max="${max}" value="${max}" />
    </div>
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

function titleForViewing(viewing) {
  return html`<div class="viewings_viewing__title">
    ${reviewLink(
      viewing.imdb_id,
      `${viewing.title} <span class="viewings_viewing__title_year">${viewing.year}</span>`,
      "viewings_viewing__link"
    )}
  </div>`;
}

function slugForViewing(viewing) {
  return html`<div class="viewings_viewing__slug">
    ${moment(viewing.date).format("dddd MMM D, YYYY")} via ${viewing.venue}.
  </div>`;
}

exports.render = function ({ viewings }) {
  viewings.sort((a, b) => {
    return b.sequence - a.sequence;
  });

  return html`
    <main class="viewings">
      <h2 class="viewings__header">Viewing Log</h2>
      <p class="viewings__tagline">
        I&apos;ve watched ${viewings.length} movies since 2012.
      </p>

      <fieldset class="viewings__filters">
        <legend class="viewings__filters_header">Filter &amp; Sort</legend>
        <label class="viewings__label"
          >Title
          <input type="text" placeholder="Enter all or part of a title" />
        </label>
        <label class="viewings__label"
          >Release Year ${releaseYearFilter(this.html, viewings)}
        </label>
        <label class="viewings__label"
          >Venue ${venueSelect(this.html, viewings)}
        </label>
        <label class="viewings__label"
          >Order By
          <select name="order-by">
            <option value="viewing-date-desc" selected="selected"
              >Viewing Date (Newest First)</option
            >
            <option value="viewing-date-asc"
              >Viewing Date (Oldest First)</option
            >
            <option value="release-date-desc"
              >Release Date (Newest First)</option
            >
            <option value="release-date-asc"
              >Release Date (Oldest First)</option
            >
            <option value="title-asc">Title</option>
          </select>
        </label>
      </fieldset>
      <ol reversed>
        ${viewings
          .map((viewing) => {
            return this.html` <li class="viewings_viewing">
              ${titleForViewing(viewing)}
              ${slugForViewing(viewing)}
            </li>`;
          })
          .join("\n")}
      </ol>
    </main>
  `;
};
