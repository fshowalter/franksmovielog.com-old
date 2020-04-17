import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet';

import favicon152 from '../assets/apple-touch-icon-152x152.png';
import favicon160 from '../assets/favicon-160x160.png';
import favicon196 from '../assets/favicon-196x196.png';
import favicon32 from '../assets/favicon-32x32.png';
import Footer from './Footer';
import GlobalStyles from './GlobalStyles';
import Mast from './Mast';

interface Props {
  children: ReactNode;
  location: {
    pathname: string;
  };
}

const Layout: React.FC<Props> = ({ children, location }) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="apple-touch-icon" sizes="152x152" href={favicon152} />
        <link rel="icon" type="image/png" href={favicon196} sizes="196x196" />
        <link rel="icon" type="image/png" href={favicon160} sizes="160x160" />
        <link rel="icon" type="image/png" href={favicon32} sizes="32x32" />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Feed"
          href="/feed.xml"
        />
        <link
          href={`https://www.franksmovielog.com${location.pathname}`}
          rel="canonical"
        />
      </Helmet>
      <GlobalStyles />
      <Mast />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
