import React, { ReactNode } from 'react';

import styled from '@emotion/styled';
import { WindowLocation } from '@reach/router';

import Layout from './Layout';

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

interface Props {
  location: WindowLocation;
  children: ReactNode;
}

const TwoColumns = ({ location, children }: Props) => {
  return (
    <Layout location={location}>
      <Columns>{children}</Columns>
    </Layout>
  );
};

export { Column1, Column2, TwoColumns };
