import React, { ReactNode } from "react";

import styled from "@emotion/styled";

import { breakpoints } from "./Layout";

const Container = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 5px;
`;

const Heading = styled.h2`
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  display: block;
  font-size: 19px;
  font-weight: normal;
  margin: 0 0 20px;
  padding: 20px;
  position: relative;
  text-decoration: none;
`;

const Content = styled.div`
  padding: 0 20px;
`;

interface PanelProps {
  children: ReactNode;
  heading: string;
}

export default function Panel({ heading, children }: PanelProps): JSX.Element {
  return (
    <Container>
      <Heading>{heading}</Heading>
      <Content>{children}</Content>
    </Container>
  );
}
