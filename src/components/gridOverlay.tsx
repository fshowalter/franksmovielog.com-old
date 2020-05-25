import { css } from "@emotion/core";

export default css`
  /* Settings */
  :root {
    --ratio: 1.61803398875;
    --offset: 1.5rem;
    --max_width: 72rem;
    --columns: 1;
    --baseline: calc(1rem * 1.75);
    --baseline-shift: 0;
    --color: hsla(204, 80%, 72%, 0.25);
    --color-text: hsla(204, 80%, 72%, 1);
    --media-query: "base";
    --repeating-width: calc(100% / var(--columns));
    --column-width: calc((100% / var(--columns)) - var(--gutter));
    --background-width: calc(100% + var(--gutter));
    --background-columns: repeating-linear-gradient(
      to right,
      var(--color),
      var(--color) var(--column-width),
      transparent var(--column-width),
      transparent var(--repeating-width)
    );
    --background-baseline: repeating-linear-gradient(
      to bottom,
      var(--color),
      var(--color) 1px,
      transparent 1px,
      transparent var(--baseline)
    );
  }

  @media (min-width: 35em) {
    :root {
      --columns: 3;
      --offset: 2rem;
      --color: hsla(286, 51%, 44%, 0.25);
      --color-text: hsla(286, 51%, 44%, 1);
      --media-query: "small";
    }
  }

  @media (min-width: 47.75em) {
    :root {
      --offset: 2rem;
      --columns: 2;
      --color: hsla(204, 80%, 72%, 0.25);
      --color-text: hsla(204, 80%, 72%, 1);
      --media-query: "medium";
    }
  }

  @media (min-width: 70em) {
    :root {
      --offset: 4rem;
      --color: hsla(286, 51%, 44%, 0.25);
      --color-text: hsla(286, 51%, 44%, 1);
      --media-query: "large";
    }
  }

  html {
    position: relative;
  }

  html::before {
    background-image: var(--background-columns), var(--background-baseline);
    background-position: 0 var(--baseline-shift);
    background-size: var(--background-width) 100%;
    bottom: 0;
    content: "";
    left: 0;
    margin-left: auto;
    margin-right: auto;
    max-width: var(--max_width);
    min-height: 100vh;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    width: calc(100% - (2 * var(--offset)));
    z-index: 1000;
  }

  html::after {
    color: var(--color-text);
    content: var(--media-query);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    left: 1rem;
    position: fixed;
    top: 1rem;
  }

  /* Codepen styling */
  body {
    height: 400vh;
  }
`;
