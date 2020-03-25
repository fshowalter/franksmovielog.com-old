import React from "react";
import { Helmet } from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";
import styled from "@emotion/styled";
import GlobalStyles from "./GlobalStyles";

const Column = styled.div`
  background: var(--color-content-background);
  margin: 0 auto;
  position: relative;
  width: 100%;

  @media only screen and (min-width: 50em) {
    max-width: 1000px;
  }
`;

const LayoutSingle = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <Column>{children}</Column>
    </>
  );
};

export default LayoutSingle;
