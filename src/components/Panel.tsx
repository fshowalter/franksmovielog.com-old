import React, { ReactNode } from "react";

import styled from "@emotion/styled";

import { breakpoints } from "./Layout";

const Heading = styled.h2`
  font-size: 1.8rem;
  margin: 0 auto;
  width: calc(100% - 4rem);
  /* border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  display: block;
  font-size: 18px;
  font-weight: 900;
  margin: 0 0 20px;
  padding: 16px 24px;
  position: relative;
  text-decoration: none; */
`;

const Content = styled.div`
  /* padding: 0 24px; */
`;

const Fieldset = styled.fieldset`
  border: 0.2rem solid #d8d8d8;
  margin-bottom: 1.25em;
  margin-left: auto;
  margin-right: auto;
  max-width: 58rem;
  padding: 2rem;
  width: calc(100% - 4rem);
`;

const Legend = styled.legend`
  border: none;
  font-size: 0.85em;
  font-weight: 700;
  line-height: inherit;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: inherit;
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
    <Fieldset className={className}>
      <Legend>{heading}</Legend>
      {children}
    </Fieldset>
  );
}
