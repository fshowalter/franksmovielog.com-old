import React from "react";

import { css } from "@emotion/core";

import Reset from "./Reset";
import Typography from "./Typography";
import Vars from "./Vars";

export const bodyTextMixin = css`
  font-feature-settings: "ordn", "lnum";
  font-size: 18px;
  letter-spacing: -0.05px;
  line-height: 27px;
  margin: 0 auto 30px;
  max-width: 700px;

  @media (min-width: 48em) {
    font-size: 21px;
    line-height: 1.58;
    margin-bottom: 21px;
  }
`;

export default function GlobalStyles(): JSX.Element {
  return (
    <>
      <Vars />
      <Reset />
      <Typography />
    </>
  );
}
