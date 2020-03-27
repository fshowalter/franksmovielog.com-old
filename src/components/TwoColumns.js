import React from "react";
import { Helmet } from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";
import styled from "@emotion/styled";
import GlobalStyles from "./GlobalStyles";
import Mast from "./Mast";

const Columns = styled.div`
  background: var(--color-content-background);
  margin: 0 auto;
  position: relative;
  width: 100%;

  &:after {
    clear: both;
    content: "";
    display: table;
  }

  @media only screen and (min-width: 50em) {
    max-width: 1000px;
  }
`;

const Column1 = styled.div`
  display: inline-block;
  width: 100%;

  @media only screen and (min-width: 50em) {
    float: left;
    width: 38.196601126%;
  }
`;

const Column2 = styled.div`
  @media only screen and (min-width: 50em) {
    float: right;
    width: 61.803398875%;
  }
`;

const TwoColumns = ({ children }) => {
  return <Columns>{children}</Columns>;
};

export { Column1, Column2, TwoColumns };
