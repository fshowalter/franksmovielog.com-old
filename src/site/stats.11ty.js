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
    ${itemProgress.full_name}: ${itemProgress.reviewed}/${itemProgress.total}
    ${Math.round((itemProgress.reviewed / itemProgress.total) * 100)}%
  </li>`;
}

exports.render = function ({
  viewingsByReleaseYear,
  ratingsByReleaseYear,
  directorWatchlistProgress,
  performerWatchlistProgress,
  writerWatchlistProgress,
}) {
  return this.html`
    <main>
      <h2>Stats</h2>
      <p>What I watch, by the numbers.</p>

      <nav>
      <h3>Navigation</h3>
      <ul>
        <li><a href="#by-release-year">By Release Year:</a>
          <ul>
            <li><a href="#y-release-year-viewings">Viewings</a></li>
            <li><a href="#by-release-year-ratings">Ratings</a></li>
          </ul>
        </li>
        <li><a href="#watchlist-progress">Watchlist Progress:</a>
          <ul>
          <li><a href="#watchlist-progress-directors">Directors</a></li>
          <li><a href="#watchlist-progress-performers">Performers</a></li>
          <li><a href="#watchlist-progress-writers">Writers</a></li>
          </ul>
        </li>
      </ul>
      </nav>

      <h3 id="by-release-year">By Release Year</h3>
      <h4 id="by-release-year-viewings">Viewings</h3>
      <ul>
      ${viewingsByReleaseYear
        .map((viewingsForYear) => {
          return this
            .html`<li>${viewingsForYear.year}: ${viewingsForYear.viewings}</li>`;
        })
        .join("\n")}
      </ul>

      <h4 id="by-release-year-ratings">Ratings</h4>
      <ul>
      ${ratingsByReleaseYear
        .map((ratingForYear) => {
          return this.html`<li>${ratingForYear.year}: Average ${round(
            ratingForYear.rating,
            2
          )} stars</li>`;
        })
        .join("\n")}
      </ul>

      <h3 id="watchlist-progress">Watchlist Progress</h3>

      <h4 id="watchlist-progress-directors">Directors</h4>
      <ul>
      ${directorWatchlistProgress
        .map((directorProgress) => {
          return watchlistItemProgress(this.html, directorProgress);
        })
        .join("\n")}
      </ul>

      <h4 id="watchlist-progress-performers">Performers</h4>
      <ul>
      ${performerWatchlistProgress
        .map((performerProgress) => {
          return watchlistItemProgress(this.html, performerProgress);
        })
        .join("\n")}
      </ul>

      <h4 id="watchlist-progress-writers">Writers</h4>
      <ul>
      ${writerWatchlistProgress
        .map((writerProgress) => {
          return watchlistItemProgress(this.html, writerProgress);
        })
        .join("\n")}
      </ul>

      <h4>Collections</h4>

      <h3>Most Watched Films</h3>

      <h3>Performers</h3>

      <h4>Most Watched</h4>

      <h4>Highest Rated</h4>

      <h3>Directors</h3>

      <h4>Most Watched</h4>

      <h4>Highest Rated</h4>

      <h3>Writers</h3>

      <h4>Most Watched</h4>

      <h4>Highest Rated</h4>


    </main>
  `;
};
