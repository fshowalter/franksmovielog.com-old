const fs = require("fs");
const html = require("../../../utils/html");

const navJs = fs.readFileSync("src/site/_includes/js/nav.js");
const logo = fs.readFileSync("src/site/svg/logo.svg");

exports.render = function ({ title, content }) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/main.css" />
        <title>Movielog &mdash; ${title}</title>
      </head>

      <body class="font-serif">
        <div class="max-w-screen-lg mx-auto">
          <header
            id="site-header"
            class="flex flex-col justify-between border-b border-gray-200"
          >
            <h1 class="order-2 font-medium text-2xl">
              <a href="/">Frank's Movie Log</a>
            </h1>
            <p class="order-3 text-gray-700">
              Quality reviews of movies of questionable quality.
            </p>
            <nav
              class="bg-gray-900 order-1 flex items-center"
              data-responsive-hidden-nav
            >
              <h2 class="sr-only">Navigation</h2>
              <ul
                class="flex whitespace-no-wrap overflow-x-visible items-baseline tracking-wide text-sm pb-6 space-x-4 text-blue-600"
              >
                <li><a href="/">Home</a></li>
                <li><a href="/about/">About</a></li>
                <li><a href="/how-i-grade/">How I Grade</a></li>
                <li><a href="/reviews/">Reviews</a></li>
                <li><a href="/viewings/">Viewings</a></li>
                <li><a href="/to-watch/">To-Watch</a></li>
                <li><a href="/stats/">Stats</a></li>
              </ul>
              <button>
                <svg
                  class="fill-current w-6 h-6"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.5 11.5A.5.5 0 013 11h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 7h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4A.5.5 0 013 3h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"
                  />
                </svg>
              </button>
              <form
                class="hidden"
                action="https://www.google.com/search"
                acceptCharset="UTF-8"
                method="get"
                role="search"
              >
                <label
                  ><span class="sr-only">Search</span>
                  <input
                    type="text"
                    class="transition-colors duration-100 ease-in-out focus:outline-0 border border-transparent focus:bg-white focus:border-gray-300 placeholder-gray-600 rounded-lg bg-gray-200 py-2 pr-4 pl-10 block w-full appearance-none leading-normal ds-input"
                    name="q"
                    placeholder="What are you looking for?"
                  />
                  <input
                    type="hidden"
                    name="q"
                    value="site:movielog.frankshowalter.com"
                  />
                  <input type="submit" class="sr-only" value="Search" />
                </label>
              </form>
            </nav>
          </header>
          ${content}
          <footer>
            <p>© 2020 Frank Showalter</p>
            <p>
              All stills used in accordance with the
              <a href="http://www.copyright.gov/title17/92chap1.html#107"
                >Fair Use Law</a
              >
            </p>
            <a href="#site-header">
              To the top ↑
            </a>
          </footer>
        </div>
        <script>
          ${navJs};
        </script>
      </body>
    </html>
  `;
};
