import React from "react";

import styled from "@emotion/styled";

import { breakpoints } from "./Layout";

const Header = styled.header`
  padding: 30px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    border-bottom: solid 1px var(--color-border);
    margin: 0;
    padding: 12px 0 24px;
    text-align: left;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    padding-top: 0;
  }
`;

const Heading = styled.h1`
  font-weight: 900;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const Slug = styled.div`
  color: rgba(0, 0, 0, 0.54);
  font-family: var(--font-family-serif);
  font-size: 16px;
  letter-spacing: 0.5px;
  line-height: 20px;
  margin: 0;
`;

interface PageHeaderProps {
  className?: string;
  heading: string;
  slug: string;
}

export default function PageHeader({
  className,
  heading,
  slug,
}: PageHeaderProps): JSX.Element {
  return (
    <Header className={className}>
      <Heading>{heading}</Heading>
      <Slug>{slug}</Slug>
    </Header>
  );
}
