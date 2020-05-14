import React from "react";

import styled from "@emotion/styled";

const Header = styled.header`
  padding: 20px;

  @media only screen and (min-width: 48em) {
    padding: 10px 0 20px;
    text-align: left;
  }

  @media only screen and (min-width: 71.24em) {
    padding-top: 0;
  }
`;

const Heading = styled.h1`
  line-height: 60px;
  margin-bottom: 0;
`;

const Slug = styled.div`
  color: rgba(0, 0, 0, 0.54);
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 0;
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
