import React, { ReactNode } from "react";

import styled from "@emotion/styled";

const Fieldset = styled.fieldset``;

const Legend = styled.legend``;

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
