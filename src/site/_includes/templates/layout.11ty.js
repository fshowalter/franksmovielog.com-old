exports.render = function ({ title, content }) {
  return this.html`
<!doctype html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/main.css">
    <title>Movielog &mdash; ${title}</title>
  </head>

  <body>
    <div class="layout-site_wrap">
      <header id="site-header">
        <h1>Movielog</h1>
        <p>Quality reviews of movies of questionable quality.</p>
        <nav>
          <h2>Navigation</h2>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/how-i-grade/">How I Grade</a></li>
            <li><a href="/reviews/">Reviews</a></li>
            <li><a href="/viewings/">Viewings</a></li>
            <li><a href="/to-watch/">To-Watch</a></li>
            <li><a href="/stats/">Stats</a></li>
          </ul>
          <form
            action="https://www.google.com/search"
            acceptCharset="UTF-8"
            method="get"
            role="search"
          >
          <label>Search
            <input type="text" name="q" placeholder="What are you looking for?" />
            <input type="hidden" name="q" value="site:movielog.frankshowalter.com" />
            <input type="submit" value="Search" />
          </label>
          </form>
        </nav>
      </header>
      ${content}
      <footer>
        <p>© 2020 Frank Showalter</p>
        <p>All stills used in accordance with the <a href="http://www.copyright.gov/title17/92chap1.html#107">Fair Use Law</a> </p>
        <a href="#site-header">
          To the top ↑
        </a>
      </footer>
    </div>
  </body>
</html>
`;
};
