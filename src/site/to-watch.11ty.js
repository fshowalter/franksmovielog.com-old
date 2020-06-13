const moment = require("moment");

exports.data = {
  layout: "default",
  title: "To-Watch",
};

function releaseYearFilter(html, viewings) {
  const sortedViewings = viewings.sort((a, b) => {
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

function buildSelectForNames(html, names) {
  const collator = new Intl.Collator("en", {
    numeric: true,
    sensitivity: "base",
  });

  const options = [html`<option key="all">All</option>`]
    .concat(
      names.map((name) => {
        return html`<option>${name}</option>`;
      })
    )
    .sort((a, b) => {
      return collator.compare(a, b);
    });

  return html`
    <select
      >${options.join("\n")}</select
    >
  `;
}

function directorSelect(html, watchlistTitles) {
  const directors = [
    ...new Set(
      watchlistTitles
        .map((title) => {
          return title.directorNamesConcat
            ? title.directorNamesConcat.split("|")
            : [];
        })
        .reduce((prev, current) => {
          return prev.concat(current);
        })
    ),
  ];

  return buildSelectForNames(html, directors);
}

function performerSelect(html, watchlistTitles) {
  const performers = [
    ...new Set(
      watchlistTitles
        .map((title) => {
          return title.performerNamesConcat
            ? title.performerNamesConcat.split("|")
            : [];
        })
        .reduce((prev, current) => {
          return prev.concat(current);
        })
    ),
  ];

  return buildSelectForNames(html, performers);
}

function writerSelect(html, watchlistTitles) {
  const writers = [
    ...new Set(
      watchlistTitles
        .map((title) => {
          return title.writerNamesConcat
            ? title.writerNamesConcat.split("|")
            : [];
        })
        .reduce((prev, current) => {
          return prev.concat(current);
        })
    ),
  ];

  return buildSelectForNames(html, writers);
}

function formatPeople(people, suffix) {
  if (!people) {
    return "";
  }

  const names = people.split("|");

  const formattedNames = new Intl.ListFormat("en").format(names);

  return `${formattedNames} ${suffix}`;
}

function formatCollections(collections) {
  if (!collections) {
    return "";
  }

  const names = collections.split("|");

  const formattedNames = new Intl.ListFormat("en").format(names);

  return `it's in the "${formattedNames}" collection`;
}

function slugForWatchlistTitle(watchlistTitle) {
  const credits = [
    formatPeople(watchlistTitle.directorNamesConcat, "directed"),
    formatPeople(watchlistTitle.performerNamesConcat, "performed"),
    formatPeople(watchlistTitle.writerNamesConcat, "has a writing credit"),
    formatCollections(watchlistTitle.collectionNamesConcat),
  ];

  let slug = "";

  while (credits.length > 0) {
    const credit = credits.shift();

    slug += credit;

    if (slug && credits.find((item) => item.length > 0)) {
      slug += " and ";
    }
  }

  return `Because ${slug}.`;
}

exports.render = function ({ watchlistTitles }) {
  return this.html`
    <main>
      <h2>To-Watch</h2>
      <p>My movie review bucketlist. ${Number(
        watchlistTitles.length
      ).toLocaleString()} titles. No silents or documentaries.</p>

      <fieldset>
        <legend>Filter &amp; Sort</legend>
        <label>Title
          <input type="text" placeholder="Enter all or part of a title" />
        </label>
        <label>Director
          ${directorSelect(this.html, watchlistTitles)}
        </label>
        <label>Performer
          ${performerSelect(this.html, watchlistTitles)}
        </label>
        <label>Writer
          ${writerSelect(this.html, watchlistTitles)}
        </label>
        <label>Release Year
          ${releaseYearFilter(this.html, watchlistTitles)}
        </label>
        <label>Order By
          <select name="order-by">
            <option value="release-date-asc" selected="selected">Release Date (Oldest First)</option>
            <option value="release-date-desc">Release Date (Newest First)</option>
            <option value="title-asc">Title</option>
          </select>
        </label>
      </fieldset>
      <ol>
        ${watchlistTitles
          .map((watchlistTitle) => {
            return this.html` <li>
              <div>${this.titleWithYear(watchlistTitle)}</div>
              ${slugForWatchlistTitle(watchlistTitle)}
            </li>`;
          })
          .join("\n")}
      </ol>
    </main>
  `;
};
