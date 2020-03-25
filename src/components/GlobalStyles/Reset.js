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

      body {
        margin: 0;
        padding: 0;
        position: relative;
      }
    `}
  />
);
