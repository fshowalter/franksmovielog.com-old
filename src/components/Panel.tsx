import React, { ReactNode } from "react";

import styled from "@emotion/styled";

const Container = styled.div`
  border: 1px solid #eee;
  border-left: none;
  border-right: none;
  transition: opacity 0.3s ease;

  @media only screen and (min-width: 48em) {
    border: none;
    border-right: solid 1px #eee;
  }
`;

const Heading = styled.h2`
  border-bottom: 1px solid var(--color-primary);
  display: block;
  font-size: 19px;
  font-weight: normal;
  margin: 0 0 20px;
  padding: 20px;
  position: relative;
  text-decoration: none;

  @media only screen and (min-width: 48em) {
    padding: 20px 0;
  }
`;

const Content = styled.div`
  padding: 0 20px;

  @media only screen and (min-width: 48em) {
    padding: 0 50px 20px 0;
  }
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
