const fs = require("fs");
const html = require("../../../utils/html");

const navJs = fs.readFileSync("src/site/_includes/js/nav.js");
const logo = fs.readFileSync("src/site/svg/logo.svg");

function navLink(currentUrl, navUrl, text) {
  return html`
    <li class="layout_mast__nav_item">
      <a
        class="layout_mast__nav_link  ${currentUrl === navUrl
          ? "layout_mast__nav_link--active"
          : ""}"
        href="${navUrl}"
        >${text}</a
      >
    </li>
  `;
}

exports.render = function ({ page, title, content, css }) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/${css ? css : "main"}.css" />
        <title>Movielog &mdash; ${title}</title>
      </head>

      <body>
        <div class="layout">
          <header id="site-header" class="layout_mast">
            <div class="layout_mast__title">
              <h1 class="layout_mast__heading">
                <a href="/">Frank's Movie Log</a>
              </h1>
            </div>
            <nav class="layout_mast__nav">
              <h2 class="layout_mast__nav_heading">Navigation</h2>
              <ul class="layout_mast__nav_list">
                ${navLink(page.url, "/", "Home")}
                ${navLink(page.url, "/about/", "About")}
                ${navLink(page.url, "/how-i-grade/", "How I Grade")}
                ${navLink(page.url, "/reviews/", "All Reviews")}
                ${navLink(page.url, "/viewings/", "Viewing Log")}
                ${navLink(page.url, "/to-watch/", "To-Watch List")}
                ${navLink(page.url, "/stats/", "Stats")}
              </ul>
              <button
                class="layout_mast__nav_button"
                aria-label="Full Navigation"
              >
                <svg
                  class="layout_mast__menu_icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <rect x="0" y="0" width="100%" height="2" fill="#fff" />
                  <rect x="0" y="9" width="100%" height="2" fill="#fff" />
                  <rect x="0" y="18" width="100%" height="2" fill="#fff" />
                </svg>
              </button>
              <form
                class="layout_mast__nav_search_form"
                action="https://www.google.com/search"
                acceptCharset="UTF-8"
                method="get"
                role="search"
              >
                <label
                  ><span class="layout_mast__search_heading">Search</span>
                  <input
                    type="text"
                    class="layout_mast__search_input"
                    name="q"
                    placeholder="What are you looking for?"
                  />
                  <input
                    type="hidden"
                    name="q"
                    value="site:movielog.frankshowalter.com"
                  />
                  <input
                    type="submit"
                    class="layout_mast__search_submit"
                    value="Search"
                  />
                </label>
              </form>
            </nav>
          </header>
          ${content}
          <footer class="layout_footer">
            <div class="layout_footer__wrap">
              <p class="layout_footer__copyright">© 2020 Frank Showalter</p>
              <p class="layout_footer__notice">
                All stills used in accordance with the
                <a href="http://www.copyright.gov/title17/92chap1.html#107"
                  >Fair Use Law</a
                >
              </p>
              <a href="#site-header" class="layout_footer__to_the_top">
                To the top ↑
              </a>
            </div>
          </footer>
        </div>
        <script>
          ${navJs};
        </script>
      </body>
    </html>
  `;
};
