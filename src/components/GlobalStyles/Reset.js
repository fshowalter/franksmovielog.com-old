import React from "react";
import { Global, css } from "@emotion/core";

export default () => (
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
