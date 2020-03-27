import React from "react";
import { Helmet } from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";
import styled from "@emotion/styled";
import GlobalStyles from "./GlobalStyles";
import Mast from "./Mast";

const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <Mast />
      {children}
    </>
  );
};

export default Layout;
