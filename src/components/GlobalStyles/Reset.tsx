import React from "react";

import { css, Global } from "@emotion/core";

export default function GlobalStyleReset(): JSX.Element {
  return (
    <Global
      styles={css`
        html {
          box-sizing: border-box;
        }

        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }

        a {
          color: var(--color-link);
          line-height: inherit;
          text-decoration: none;
        }

        body {
          margin: 0;
          padding: 0;
          position: relative;
        }
      `}
    />
  );
}
