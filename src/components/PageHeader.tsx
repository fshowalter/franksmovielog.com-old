import React from "react";

import styled from "@emotion/styled";

import { breakpoints } from "./Layout";

const Header = styled.header`
  padding: 20px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    padding: 10px 20px 28px;
    text-align: left;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    padding-top: 0;
  }
`;

const Heading = styled.h1`
  line-height: 1;
  margin-bottom: 0;
`;

const Slug = styled.div`
  color: rgba(0, 0, 0, 0.54);
  font-size: 15px;
  line-height: 20px;
  margin: 14px 0 0;
`;

interface PageHeaderProps {
  header: string;
  slug: string;
}

export default function PageHeader({
  header,
  slug,
}: PageHeaderProps): JSX.Element {
  return (
    <Header>
      <Heading>{header}</Heading>
      <Slug>{slug}</Slug>
    </Header>
  );
}
