import React, { ReactNode } from "react";
import GlobalStyles from "./GlobalStyles";
import Mast from "./Mast";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <GlobalStyles />
      <Mast />
      {children}
    </>
  );
};

export default Layout;
