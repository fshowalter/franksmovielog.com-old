import React from "react";

import styled from "@emotion/styled";

const Header = styled.header`
  padding: 35px 20px 20px;
  text-align: center;

  @media only screen and (min-width: 50em) {
    margin: 20px;
    padding: 20px;
    text-align: left;
  }
`;

const Heading = styled.h1`
  line-height: 60px;
  margin-bottom: 0;
`;

const Slug = styled.div`
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 0;
`;

interface Props {
  title: string;
  slug: string;
}

export default function PanelHeading({ title, slug }: Props): JSX.Element {
  return (
    <Header>
      <Heading>{title}</Heading>
      <Slug>{slug}</Slug>
    </Header>
  );
}
