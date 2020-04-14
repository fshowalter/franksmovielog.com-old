import React, { ReactNode } from 'react';

import Footer from './Footer';
import GlobalStyles from './GlobalStyles';
import Mast from './Mast';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <GlobalStyles />
      <Mast />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
