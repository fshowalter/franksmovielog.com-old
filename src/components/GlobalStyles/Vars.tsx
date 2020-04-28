import React from "react";

import { css, Global } from "@emotion/core";

export default function GlobalStyleVars(): JSX.Element {
  return (
    <Global
      styles={css`
        :root {
          --color-text-primary: rgba(0, 0, 0, 0.87);
          --color-text-secondary: rgba(0, 0, 0, 0.54);
          --color-text-hint: rgba(0, 0, 0, 0.38);
          --color-primary: #e9e7e0;
          --color-accent: #a9a287;
          --color-link: #579;
          --color-heading: #000;
          --color-content-background: #fff;
          --font-family-system: -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji",
            "Segoe UI Emoji", "Segoe UI Symbol";
        }
      `}
    />
  );
}
