const moment = require("moment");

exports.data = {
  layout: "default",
  title: "Stats",
};

exports.render = function ({ viewingsByReleaseYear }) {
  return this.html`
    <main>
      <h2>Stats</h2>
      <p>What I watch, by the numbers.</p>

      <nav>
      <h3>Navigation</h3>
      <ul>
        <li><a href="#viewings-by-release-year">Viewings by Release Year</a></li>
        <li><a href="#ratings-by-release-year">Ratings by Release Year</a></li>
      </ul>
      </nav>

      <h3 id="viewings-by-release-year">Viewings by Release Year</h3>
      <ul>
      ${viewingsByReleaseYear
        .map((viewingsForYear) => {
          return this
            .html`<li>${viewingsForYear.year}: ${viewingsForYear.viewings}</li>`;
        })
        .join("\n")}
      </ul>

      <h3 id="ratings-by-release-year">Ratings by Release Year</h4>

      <h3>Watchlist Progress</h3>

      <h4>Directors</h4>

      <h4>Performers</h4>

      <h4>Writers</h4>

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
