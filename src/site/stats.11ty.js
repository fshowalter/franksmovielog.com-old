const moment = require("moment");

exports.data = {
  layout: "default",
  title: "Stats",
};

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function watchlistItemProgress(html, itemProgress) {
  return html`<li>
    ${itemProgress.name}: ${itemProgress.reviewed}/${itemProgress.total}
    ${Math.round((itemProgress.reviewed / itemProgress.total) * 100)}%
  </li>`;
}

function mostWatchedItem(html, item) {
  return html`<li>
    ${item.full_name}: ${item.count}
  </li>`;
}

exports.render = function ({
  viewingsByReleaseYear,
  ratingsByReleaseYear,
  directorWatchlistProgress,
  performerWatchlistProgress,
  writerWatchlistProgress,
  watchlistCollectionsProgress,
  mostWatchedPerformers,
  mostWatchedDirectors,
  mostWatchedWriters,
  highestRatedPerformers,
  highestRatedDirectors,
  highestRatedWriters,
}) {
  return this.html`
    <main>
      <h1>Stats</h1>
      <p>What I watch, by the numbers.</p>

      <nav>
      <h2>Navigation</h2>
      <ul>
        <li>By Release Year
          <ul>
            <li><a href="#y-release-year-viewings">Viewings</a></li>
            <li><a href="#by-release-year-ratings">Ratings</a></li>
          </ul>
        </li>
        <li>Watchlist Progress
          <ul>
            <li><a href="#watchlist-progress-directors">Directors</a></li>
            <li><a href="#watchlist-progress-performers">Performers</a></li>
            <li><a href="#watchlist-progress-writers">Writers</a></li>
            <li><a href="#watchlist-progress-collections">Collections</a></li>
          </ul>
        </li>
        <li>Performers
          <ul>
            <li><a href="#most-watched-performers">Most Watched</a></li>
            <li><a href="#highest-rated-performers">Highest Rated</a></li>
          </ul>
        </li>
        <li>Directors
          <ul>
            <li><a href="#most-watched-directors">Most Watched</a></li>
            <li><a href="#highest-rated-directors">Highest Rated</a></li>
          </ul>
        </li>
        <li>Writers
          <ul>
            <li><a href="#most-watched-writers">Most Watched</a></li>
            <li><a href="#highest-rated-writers">Highest Rated</a></li>
          </ul>
        </li>
      </ul>
      </nav>

      <h2 id="by-release-year">By Release Year</h2>
      <h3 id="by-release-year-viewings">Viewings</h3>
      <ul>
      ${viewingsByReleaseYear
        .map((viewingsForYear) => {
          return this
            .html`<li>${viewingsForYear.year}: ${viewingsForYear.viewings}</li>`;
        })
        .join("\n")}
      </ul>

      <h3 id="by-release-year-ratings">Ratings</h3>
      <ul>
      ${ratingsByReleaseYear
        .map((ratingForYear) => {
          return this.html`<li>${ratingForYear.year}: ${round(
            ratingForYear.rating,
            2
          )} stars</li>`;
        })
        .join("\n")}
      </ul>

      <h2 id="watchlist-progress">Watchlist Progress</h2>

      <h3 id="watchlist-progress-directors">Directors</h3>
      <ul>
      ${directorWatchlistProgress
        .map((directorProgress) => {
          return watchlistItemProgress(this.html, directorProgress);
        })
        .join("\n")}
      </ul>

      <h3 id="watchlist-progress-performers">Performers</h3>
      <ul>
      ${performerWatchlistProgress
        .map((performerProgress) => {
          return watchlistItemProgress(this.html, performerProgress);
        })
        .join("\n")}
      </ul>

      <h3 id="watchlist-progress-writers">Writers</h3>
      <ul>
      ${writerWatchlistProgress
        .map((writerProgress) => {
          return watchlistItemProgress(this.html, writerProgress);
        })
        .join("\n")}
      </ul>

      <h3 id="watchlist-progress-collections">Collections</h3>
      <ul>
      ${watchlistCollectionsProgress
        .map((collectionProgress) => {
          return watchlistItemProgress(this.html, collectionProgress);
        })
        .join("\n")}
      </ul>

      <h2>Performers</h2>

      <h3 id="most-watched-performers">Most Watched</h3>
      <ul>
      ${mostWatchedPerformers
        .map((performer) => {
          return mostWatchedItem(this.html, performer);
        })
        .join("\n")}
      </ul>

      <h3 id="highest-rated-performers">Highest Rated</h3>
      <ul>
      ${highestRatedPerformers
        .map((performer) => {
          return this.html`<li>${performer.full_name}: ${round(
            performer.rating,
            2
          )} stars</li>`;
        })
        .join("\n")}
      </ul>

      <h2>Directors</h2>

      <h3 id="most-watched-directors">Most Watched</h3>
      <ul>
      ${mostWatchedDirectors
        .map((director) => {
          return mostWatchedItem(this.html, director);
        })
        .join("\n")}
      </ul>

      <h3 id="highest-rated-directors">Highest Rated</h3>
      <ul>
      ${highestRatedDirectors
        .map((director) => {
          return this.html`<li>${director.full_name}: ${round(
            director.rating,
            2
          )} stars</li>`;
        })
        .join("\n")}
      </ul>

      <h2>Writers</h2>

      <h3 id="most-watched-writers">Most Watched</h3>
      <ul>
      ${mostWatchedWriters
        .map((writer) => {
          return mostWatchedItem(this.html, writer);
        })
        .join("\n")}
      </ul>

      <h3 id="highest-rated-writers">Highest Rated</h3>
      <ul>
      ${highestRatedWriters
        .map((writer) => {
          return this.html`<li>${writer.full_name}: ${round(
            writer.rating,
            2
          )} stars</li>`;
        })
        .join("\n")}
      </ul>



    </main>
  `;
};
