import React, { ReactNode } from "react";

import styled from "@emotion/styled";

import { breakpoints } from "./Layout";

const Container = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 5px;
  margin: 0 20px;

  @media only screen and (min-width: ${breakpoints.mid}) {
    margin: 0;
  }
`;

const Heading = styled.h2`
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  display: block;
  font-family: var(--font-family-system);
  font-size: 18px;
  font-weight: 300;
  margin: 0 0 20px;
  padding: 16px 20px;
  position: relative;
  text-decoration: none;
`;

const Content = styled.div`
  padding: 0 20px;
`;

interface PanelProps {
  children: ReactNode;
  className?: string;
  heading: string;
}

export default function Panel({
  className,
  heading,
  children,
}: PanelProps): JSX.Element {
  return (
    <Container className={className}>
      <Heading>{heading}</Heading>
      <Content>{children}</Content>
    </Container>
  );
}
