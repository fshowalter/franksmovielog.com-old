import React from "react";

import styled from "@emotion/styled";

import { breakpoints } from "./Layout";

const Header = styled.header`
    padding: 4rem 0;

    @media (min-width: 700px) {
      padding: 8rem 0;
    }

  /* padding: 30px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    border-bottom: solid 1px var(--color-border);
    margin: 0;
    padding: 12px 0 24px;
    text-align: left;
  }

  @media only screen and (min-width: ${breakpoints.max}) {
    padding-top: 0;
  } */
`;

const Heading = styled.h1`
  font-family: var(--font-family-system);
  font-size: 3.6rem;
  font-weight: 800;
  line-height: 1.138888889;
  margin: 0 auto;
  padding: 4rem 0 0;
  text-align: center;
  width: calc(100% - 4rem);

  @media (min-width: 700px) {
    font-size: 6.4rem;
  }

  @media (min-width: 1220px) {
    font-size: 8.4rem;
  }
`;

const Slug = styled.div`
  color: #6d6d6d;
  font-size: 1.5rem;
  letter-spacing: -0.016875em;
  line-height: 1.5;
  margin: 2rem auto;
  text-align: center;
  width: calc(100% - 4rem);
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
