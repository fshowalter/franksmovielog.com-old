import React from "react";

import styled from "@emotion/styled";

import { breakpoints } from "./Layout";

const ColumnWrap = styled.div`
  @media only screen and (min-width: ${breakpoints.mid}) {
    display: grid;
    grid-template-columns: 38.2% 61.8%;
    width: 100%;
  }

  & > :nth-child(1) {
    @media only screen and (min-width: ${breakpoints.mid}) {
      grid-column: 1;
      grid-row: 1;
    }
  }

  & > :nth-child(2) {
    @media only screen and (min-width: ${breakpoints.mid}) {
      grid-row: 1 / span 2;
    }
  }
`;

interface TwoColumnsProps {
  children: React.ReactNode;
}

export default function TwoColumns({ children }: TwoColumnsProps): JSX.Element {
  return <ColumnWrap>{children}</ColumnWrap>;
}
