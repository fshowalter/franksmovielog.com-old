import React from "react";

import { css, Global } from "@emotion/core";

export default function GobalStyleTypography(): JSX.Element {
  return (
    <Global
      styles={css`
        body,
        html {
          font-size: 16px;
        }

        body {
          background: var(--color-primary);
          color: var(--color-text-primary);
          font-family: "Charter", "Iowan Old Style", Georgia, Cambria,
            "Times New Roman", Times, serif;
          -webkit-font-smoothing: antialiased;
          font-style: normal;
          font-weight: 500;
          line-height: 24px;
        }

        p {
          margin: 0;
          text-rendering: optimizeLegibility;
          word-break: break-word;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          color: var(--color-heading);
          font-style: normal;
          font-weight: 500;
          line-height: 1.3;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
          word-break: break-word;
        }
      `}
    />
  );
}
